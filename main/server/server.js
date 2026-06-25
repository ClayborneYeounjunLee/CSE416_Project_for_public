// Import required modules
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express application
const app = express();
const PORT = 8000;

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(cors()); // CORS middleware added

// Serve static files from 'public' directory
app.use(express.static('public'));

// Define the user schema and model
const User = require('./models/User');

// Create user endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName, phoneNumber, country, address1, address2, photoURL } = req.body;
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        displayName,
        phoneNumber,
        country,
        address1,
        address2,
        photoURL,
      });
      await user.save();
      return res.status(201).send(user);
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Get user data by UID
app.get('/api/users/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update user data by UID
app.put('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;
    const user = await User.findOneAndUpdate({ uid }, updateData, { new: true });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update user' });
  }
});

const travelPlanSchema = new mongoose.Schema({
  user: String,
  destination: String,
  startDate: String,
  days: Number,
  budget: String,
  withWho: String,
  activities: [String],
  options: [String],
  adults: Number,
  children: Number,
  plan: String,
  hotelBookingUrl: String,  // Added field for hotel booking URL
  flightBookingUrl: String  // Added field for flight booking URL
});

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);


// URL validation middleware
const validateUrls = (req, res, next) => {
  const { hotelBookingUrl, flightBookingUrl } = req.body;
  try {
    if (hotelBookingUrl) new URL(hotelBookingUrl);
    if (flightBookingUrl) new URL(flightBookingUrl);
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid URL format' });
  }
};

// Updated save-travel-plan endpoint with validation
app.post('/api/save-travel-plan', validateUrls, async (req, res) => {
  try {
    const {
      user,
      destination,
      startDate,
      days,
      budget,
      withWho,
      activities,
      options,
      adults,
      children,
      plan,
      hotelBookingUrl,
      flightBookingUrl
    } = req.body;

    // Log the URLs for debugging
    console.log('Saving URLs:', { hotelBookingUrl, flightBookingUrl });

    const travelPlan = new TravelPlan({
      user,
      destination,
      startDate,
      days,
      budget,
      withWho,
      activities,
      options,
      adults,
      children,
      plan,
      hotelBookingUrl,
      flightBookingUrl
    });

    const savedPlan = await travelPlan.save();
    console.log('Saved plan:', savedPlan);
    
    res.status(201).send({ 
      message: 'Travel plan saved successfully.',
      planId: savedPlan._id,
      urls: {
        hotel: savedPlan.hotelBookingUrl,
        flight: savedPlan.flightBookingUrl
      }
    });
  } catch (error) {
    console.error('Error saving travel plan:', error);
    res.status(500).send({ error: 'Failed to save travel plan.' });
  }
});

// Updated get trip endpoint with explicit URL fields
app.get('/api/trips/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await TravelPlan.findById(tripId)
      .select('+hotelBookingUrl +flightBookingUrl'); // Explicitly include URL fields
    
    if (!trip) {
      return res.status(404).send({ error: 'Trip not found' });
    }
    
    console.log('Retrieved trip with URLs:', {
      hotelUrl: trip.hotelBookingUrl,
      flightUrl: trip.flightBookingUrl
    });
    
    res.status(200).send(trip);
  } catch (error) {
    console.error('Error fetching trip detail:', error);
    res.status(500).send({ error: 'Failed to fetch trip detail' });
  }
});

// Define the get-user-trips route
app.get('/api/users/:uid/trips', async (req, res) => {
  try {
    const userId = req.params.uid;
    const trips = await TravelPlan.find({ user: userId });
    res.status(200).send(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).send({ error: 'Failed to fetch user trips' });
  }
});

app.post('/api/plan-trip', async (req, res) => {
  const { destination, startDate, days, budget, withWho, activities, options, adults, children } = req.body;

  // Generate the messages to ask OpenAI
  const messages = [{ 
    role: 'user', 
    content: `Create a ${days}-day travel plan for ${destination} starting on ${startDate}. The theme of travel is ${withWho} travel. The budget is ${budget}. The activities include ${activities.join(", ")}. The options include ${options.join(", ")}. Number of adults: ${adults}, children: ${children}.
    
    Format it as follows:
    
    Travel Concept : ${withWho}
    ${Array.from({ length: days }).map((_, i) => `
    - Day ${i + 1}: YYYY-MM-DD
      - Location : place concept (for example: park, restaurant)
      - Location : place concept`).join('')}
    
    Only answer in this format. The number of locations is not limited to 2, you can add 1-2 more locations to each day.` }];

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const plan = response.data.choices[0].message ? response.data.choices[0].message.content : 'No content available';
      
      // Generate booking URLs
      const hotelBookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${startDate}&checkout=${calculateCheckoutDate(startDate, days)}&group_adults=${adults}&group_children=${children}`;
      const flightBookingUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20on%20${startDate}${days > 0 ? `%20through%20${calculateCheckoutDate(startDate, days)}` : ''}${adults > 1 ? `%20${adults}%20adults` : adults === 1 ? `%20${adults}%20adult` : ''}${children > 0 ? `%20and%20${children}%20children` : ''}%20economy&curr=USD`;

      res.json({ 
        plan,
        hotelBookingUrl,
        flightBookingUrl
      });
    } else {
      console.error('Unexpected response format from OpenAI:', response.data);
      res.status(500).json({ error: 'Unexpected response format from OpenAI.' });
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response from OpenAI:', JSON.stringify(error.response.data, null, 2));
      res.status(500).json({ error: error.response.data });
    } else {
      console.error('Error fetching data from OpenAI:', error.message);
      res.status(500).json({ error: 'Failed to generate travel plan. Please try again later.' });
    }
  }
});

// Add this delete endpoint to your server code
app.delete('/api/trips/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await TravelPlan.findByIdAndDelete(tripId);
    
    if (!trip) {
      return res.status(404).send({ error: 'Trip not found' });
    }
    
    // Send back success response
    res.status(200).send({ 
      message: 'Trip deleted successfully',
      deletedTripId: tripId 
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).send({ error: 'Failed to delete trip' });
  }
});


const calculateCheckoutDate = (startDate, days) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
