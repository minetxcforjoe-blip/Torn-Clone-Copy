# Torn Underground - Installation & Setup Guide

## Prerequisites
- Node.js (v14+)
- npm

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/minetxcforjoe-blip/Torn-Clone-Copy.git
cd Torn-Clone-Copy
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and update these values for production:
```
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_very_secure_random_key_here_minimum_32_chars
```

## Running the Application

**Development:**
```bash
npm start
```

**Production:**
```bash
NODE_ENV=production npm start
```

The server will start on `http://localhost:3000`

## Features
- User registration & login with bcrypt password hashing
- Real-time multiplayer game state
- Trading system with escrow
- Combat system with equipment
- Crime missions with tiered difficulty
- Training & stat progression
- Chat system
- Item inventory & shop

## Security Features
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Session validation on protected routes
- ✅ Input validation & SQL injection protection (parameterized queries)
- ✅ HttpOnly cookies to prevent XSS
- ✅ SameSite cookie policy
- ✅ Environment variables for sensitive data
- ✅ Whitelist validation for enums (avatars, slots, stats, tiers, actions)

## Database
SQLite database (`database.db`) is automatically created on first run with all necessary tables and item seeds.

## Notes
- Database is stored locally as `database.db` (excluded from git)
- For production, migrate to PostgreSQL or MySQL and update connection string
- Set `NODE_ENV=production` to enable secure cookies
- Change `SESSION_SECRET` to a strong random string in production
