# EventSphere (Simple Event Management System)

A beginner-friendly full-stack app using Node.js, Express, MongoDB, and a minimal HTML/CSS/JS frontend.

## Features
- Signup/Login (JWT)
- Create Events (title, description, date)
- List Upcoming Events
- Register/Unregister for events

## Quick Start

1. Create `.env` (you can run without MongoDB installed):
```
MONGO_URI=memory
JWT_SECRET=your_long_random_secret
PORT=3000
```
Or use local/Atlas:
```
MONGO_URI=mongodb://127.0.0.1:27017/eventsphere
# or your Atlas connection string
```

2. Install dependencies:
```
npm install
```

3. Run:
```
npm run dev
# then open http://localhost:3000
```

## API (brief)
- POST `/api/auth/signup` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/events` (public)
- POST `/api/events` (auth)
- POST `/api/events/:id/register` (auth)
- POST `/api/events/:id/unregister` (auth)

## Notes
- Add-ons like categories/search/email can be added later (placeholders in UI).
- Keep JWT secret safe in production.
