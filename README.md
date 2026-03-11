# PACE – AI Running Coach

A full-stack web application that generates personalized running training plans using AI. Users fill in their profile and receive a custom multi-week training plan tailored to their fitness level, goal race, and current performance.

## Features

- AI-generated training plans powered by Google Gemini
- Personalized plans based on age, weight, fitness level, current PR, and goal race
- Week-by-week plan view with progress tracking
- Mark workouts as done and track completion per week
- Persistent data storage with MongoDB

## Tech Stack

**Frontend:** React  
**Backend:** Node.js, Express  
**Database:** MongoDB (Atlas)  
**AI:** Google Gemini API

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. Clone the repo
```
   git clone https://github.com/alonyS123/ai-running-coach.git
```

2. Install backend dependencies
```
   cd backend
   npm install
```

3. Install frontend dependencies
```
   cd frontend
   npm install
```

4. Create a `.env` file in the backend folder
```
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_connection_string
```

5. Start the backend
```
   nodemon index.js
```

6. Start the frontend
```
   npm start
```

7. Open `http://localhost:3000` in your browser
