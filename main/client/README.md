# AI Travel Planner

An intelligent travel planning web application that generates personalized multi-day travel itineraries with the OpenAI API (gpt-4o), with Google sign-in via Firebase Authentication and ready-made hotel/flight search links for each plan.

## 🌟 Features

- **AI-Powered Itinerary Generation**
  - Personalized travel schedules based on preferences
  - Smart activity recommendations
  - Budget-aware planning

- **User Authentication**
  - Google OAuth 2.0 integration
  - Secure user profile management
  - Personalized user experience

- **Booking Links**
  - Hotel search links via Booking.com
  - Flight search links via Google Flights
  - Generated automatically for each itinerary

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- MongoDB Atlas account (or local MongoDB)
- Firebase project (Google sign-in enabled)
- OpenAI API key (server-side, via `server/.env`)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd ai-travel-planner
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

<!-- 3. Configure environment variables -->


4. Start the application

```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
npm start
```

## 🏗️ Project Structure

```
project-root/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── FeedbackForm.js
│       │   ├── FeedbackList.js
│       │   ├── FinishedLoginPage.js
│       │   ├── LoginPage.js
│       │   ├── Profile.js
│       │   ├── ProfileEdit.js
│       │   ├── SignInPage.js
│       │   └── TravelPlan.js
│       ├── firebase.js
│       └── App.js
└── server/
    ├── models/
    │   └── User.js
    └── server.js
```

## 🔧 API Endpoints

```
POST /api/users              - Create/retrieve user
GET  /api/users/:uid        - Get user information
PUT  /api/users/:uid        - Update user information
POST /api/plan-trip         - Generate AI travel plan
POST /api/save-travel-plan  - Save travel plan
GET  /api/users/:uid/trips  - Get user's saved trips
GET  /api/trips/:tripId     - Get specific trip details
```

## 🔑 Firebase Configuration

The Firebase web config lives in [`src/firebase.js`](./src/firebase.js). To use your own Firebase project, replace the `firebaseConfig` object there with the values from your Firebase console (Project settings → Your apps). This is Firebase's public client config — access control is enforced by Firebase console rules and authorized domains, not by keeping these values hidden.

## 🛠️ Technologies Used

- **Frontend**
  - React.js
  - Firebase Authentication
  - Tailwind CSS
  - Axios

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - OpenAI API

- **APIs**
  - OpenAI Chat Completions (gpt-4o, server-side)
  - Booking.com / Google Flights (search links, no API key needed)

## 🔐 Security Notes

- Store all API keys in environment variables
- Never commit sensitive credentials to version control
- Implement proper error handling and input validation
- Use secure HTTPS connections in production
- Regularly update dependencies for security patches

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- OpenAI for the GPT API
- Firebase Authentication
- MongoDB Atlas
