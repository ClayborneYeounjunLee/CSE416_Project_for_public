> 📄 한국어 상세 구조 문서: [프로젝트_구조.md](./프로젝트_구조.md)

# AI Travel Planner (Stony Brook CSE416 Course Project)

A full-stack web application that generates personalized multi-day travel itineraries with the OpenAI API (gpt-4o). Users sign in with Google (Firebase Authentication), manage a profile stored in MongoDB, and save generated trips — each plan comes with ready-made hotel (Booking.com) and flight (Google Flights) search links.

## Tech Stack

- **Client** — React 18 (Create React App), react-router-dom, axios, Firebase JS SDK (Google sign-in)
- **Server** — Node.js + Express, Mongoose (MongoDB), OpenAI Chat Completions API (`gpt-4o`)
- **Deploy** — Firebase Hosting via GitHub Actions (client)

## How to Run

### 1. Server

```bash
cd main/server
npm install
cp .env.example .env   # then fill in your own values
node server.js         # runs on http://localhost:8000
```

`.env` values (template: [main/server/.env.example](main/server/.env.example)):

- `MONGODB_URI` — MongoDB connection string (Atlas or local). Never commit the real `.env`.
- `OPENAI_API_KEY` — OpenAI API key.

### 2. Client

```bash
cd main/client
npm install
npm start              # runs on http://localhost:3000
```

The Firebase web config lives in [main/client/src/firebase.js](main/client/src/firebase.js). It is Firebase's public client config — access control is enforced by Firebase console rules and authorized domains, not by hiding these values. To use your own Firebase project, replace the config object with your own.

## API Endpoints (server, port 8000)

| Method | Path | Description |
|---|---|---|
| POST | `/api/users` | Create or fetch a user after Google sign-in |
| GET | `/api/users/:uid` | Get a user profile |
| PUT | `/api/users/:uid` | Update a user profile |
| POST | `/api/plan-trip` | Generate an itinerary with gpt-4o + booking links |
| POST | `/api/save-travel-plan` | Save a generated plan |
| GET | `/api/users/:uid/trips` | List a user's saved trips |
| GET | `/api/trips/:tripId` | Get one saved trip |
| DELETE | `/api/trips/:tripId` | Delete a saved trip |

## Testing the App

1. Start the server and client as above.
2. Click the Google login button and sign in — verify the user is saved in MongoDB.
3. Update the phone number and country in the user profile and save.
4. Use the travel planner to pick a destination and dates, then generate a plan — verify the itinerary and the Booking.com / Google Flights links.

## Known Limitations

- The feedback board UI (client) posts to `/api/feedback`, but that route is not implemented in `server.js` — only the Mongoose model (`models/Feedback.js`) exists.
- No automated tests beyond the CRA default.
