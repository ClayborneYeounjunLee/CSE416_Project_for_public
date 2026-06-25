AI Travel Planner
AI Travel Planner is a web application designed to automate travel planning and enhance user experiences using Google, Skyscanner, and Google Hotel APIs.


// How To run the server & Client====================================================================================
1. Client Part
- npm install axios, firebase, react-router-dom, --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
- You can run the client by typing "npm start"
2. Server Part
- npm install express mongoose body-parser cors
- You can run server by typing "node server.js"
//=============================================================================================================



Project Setup
1. Requirements
Ensure you have the following software installed:

Node.js: Version 16.x or above
npm: Version 8.x or above
MongoDB Atlas: For database hosting
Google Cloud Console: To generate API keys
Skyscanner Developer Account: To generate Skyscanner API keys
Google Hotel API: For retrieving hotel information
2. Installation Steps
Clone the Project

Ensure that the MONGO_URI in the .env file is correct.
The database will be created automatically during the first execution if it does not already exist.
Run the Backend

Click the Google login button.
Log in using a Google account and verify that user information is saved in MongoDB.
Profile Update

Update the phone number and country in the user profile.
Click "Save Changes" and verify the updated information.
Feedback Board Test

Submit feedback messages via the feedback form.
Verify that all feedback messages are displayed on the feedback list.
Travel Planner

Use the Where? and When? pages to select a destination and schedule.
Retrieve flight and hotel information using Skyscanner and Google Hotel APIs.
API Key Configuration
1. Google Cloud API Key
Log in to Google Cloud Console.
Create a new project or select an existing one.
Navigate to APIs & Services > Credentials.
Click "Create API Key" and add the generated key to the .env file:
makefile
코드 복사
GOOGLE_API_KEY=your_google_api_key
2. Skyscanner API Key
Register at the Skyscanner Developer Portal.
Create a new application and retrieve the API key.
Add the key to the .env file:
makefile
코드 복사
SKYSCANNER_API_KEY=your_skyscanner_api_key
3. Google Hotel API
Enable the Google Places API for Hotels on the Google Cloud Console.
Use an existing API key or create a new one and add it to the .env file:


Simple login using Firebase Authentication and Google OAuth 2.0.
Profile Management

Save and update user profiles in MongoDB.
Feedback Board

Submit feedback and view feedback from all users.
Travel Planning

Search for flights and hotels using Skyscanner and Google Hotel APIs.
