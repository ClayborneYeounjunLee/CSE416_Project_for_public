# AI Travel Planner

An intelligent travel planning web application that leverages AI to create personalized travel itineraries based on user preferences, utilizing Google Maps, Skyscanner, and hotel APIs.

## 🌟 Features

- **AI-Powered Itinerary Generation**
  - Personalized travel schedules based on preferences
  - Smart activity recommendations
  - Budget-aware planning

- **User Authentication**
  - Google OAuth 2.0 integration
  - Secure user profile management
  - Personalized user experience

- **Travel Services Integration**
  - Hotel booking via Google Hotels API
  - Flight booking via Skyscanner API
  - Interactive maps and location services

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- MongoDB Atlas account
- Firebase project
- API keys for:
  - Google Cloud Platform
  - OpenAI
  - Skyscanner

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
│       │   ├── FinishedLoginPage.js
│       │   ├── LoginPage.js
│       │   ├── Profile.js
│       │   ├── ProfileEdit.js
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

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAWvQb0IQLBX67SCzhJ7eUI8JHrlwT0Hrc",
  authDomain: "cse416-14112.firebaseapp.com",
  projectId: "cse416-14112",
  storageBucket: "cse416-14112.appspot.com",
  messagingSenderId: "670480129388",
  appId: "1:670480129388:web:32f6ef11713488c81a2749",
  measurementId: "G-RDHXYMTX87"
};
```

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
  - Google Maps API
  - Skyscanner API
  - Google Hotels API
  - OpenAI GPT-4

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

## ⚖️ License

This project is licensed under the MIT License - see the LICENSE file for details


## 🙏 Acknowledgments

- OpenAI for GPT API
- Google Cloud Platform
- Skyscanner API
- MongoDB Atlas
