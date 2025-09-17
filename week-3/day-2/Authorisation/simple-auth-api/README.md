# Simple Auth API

A basic Node.js + Express + Mongoose API for user signup/login using bcrypt and JWT.

## Setup
1. copy `.env.example` → `.env` and fill values
2. `npm install`
3. `npm run dev`

## Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/protected/me (requires Authorization header)
