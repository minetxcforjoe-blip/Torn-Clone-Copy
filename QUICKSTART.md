# Quick Start Guide

## 1. Install & Run

```bash
npm install
cp .env.example .env
npm start
```

## 2. Open Browser

Navigate to: **http://localhost:3000**

## 3. Create Account & Play

- Register a new account
- Login
- Start playing!

## Common Issues

**"Connection failed" or "timeout"?**
- Make sure `npm start` is running (server terminal should say "Server running on port 3000")
- Check `.env` file exists
- Verify PORT=3000 in `.env`

**"Module not found"?**
- Run: `npm install`

**Port already in use?**
- Change PORT to 3001 in `.env` and restart

See `README.md` for full troubleshooting guide.
