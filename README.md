# Torn Underground - Complete Setup & Troubleshooting Guide

## ✅ Prerequisites
- **Node.js** v14 or higher (download from https://nodejs.org)
- **npm** (comes with Node.js)
- A terminal/command prompt

## 📥 Installation Steps

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/minetxcforjoe-blip/Torn-Clone-Copy.git
cd Torn-Clone-Copy
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

**Edit `.env` file:**
```
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_very_secure_random_key_here_minimum_32_chars
```

### 3. Start the Server
```bash
npm start
```

You should see:
```
Server running on port 3000
```

### 4. Open in Browser
Visit: **http://localhost:3000**

---

## 🔧 Troubleshooting

### "Network execution timeout framework crash" Error

**❌ Problem:** Connection fails when trying to login

**✅ Solution:**

1. **Verify server is running:**
   - Check terminal shows `Server running on port 3000`
   - If not, run `npm start`

2. **Check port 3000 is available:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```
   If something is using port 3000, either:
   - Stop that process, OR
   - Change PORT in `.env` to 3001, 3002, etc.

3. **Check browser console for errors:**
   - Open DevTools: `F12` or `Right-click > Inspect`
   - Go to **Console** tab
   - Look for red error messages
   - Check **Network** tab to see actual API calls

4. **Verify `.env` is correct:**
   - Make sure you have `.env` file (not `.env.example`)
   - Check PORT matches where server is running

5. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in Incognito/Private window

### Database File Not Creating

**❌ Problem:** `database.db` not appearing

**✅ Solution:**
- Server creates it automatically on first run
- Check folder permissions (you need read/write access)
- Manually delete `.env` and try fresh `npm install`

### "Module not found" Errors

**❌ Problem:** Can't find bcrypt, express-session, etc.

**✅ Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Server Crashes with Port Already in Use

**❌ Problem:** `Error: listen EADDRINUSE :::3000`

**✅ Solution:**
```bash
# Find what's using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process, OR change port in .env
```

---

## 🎮 Usage

### First Time
1. Click **"Create New Network Record"** to register
2. Enter username (any name) and password (min 6 characters)
3. Once created, click **"Authorize Link Sequence"** to login

### Gameplay
- **Train:** Spend energy to increase stats
- **Crime:** Use nerve to make money (3 difficulty levels)
- **Shop:** Buy equipment and consumables with money
- **Combat:** Attack other players (need 25 energy)
- **Trading:** Propose item trades with other players
- **Chat:** Message all players in real-time

---

## 🔒 Security Best Practices

✅ **Already Implemented:**
- Passwords hashed with bcrypt (never stored in plain text)
- Session cookies are HttpOnly (can't be stolen via JavaScript)
- All database queries use parameterized statements (SQL injection protection)
- Input validation on all endpoints
- CSRF protection with SameSite cookies

**For Production:**
```bash
NODE_ENV=production npm start
```

This enables:
- Secure cookies (HTTPS only)
- Stricter session policies
- Better error handling

---

## 📁 Project Structure

```
Torn-Clone-Copy/
├── server.js          # Express backend with all game logic
├── index.html         # Login page
├── game.html          # Main game interface
├── package.json       # Dependencies list
├── .env.example       # Environment template
├── .gitignore         # Ignored files (secrets, node_modules)
└── database.db        # SQLite database (auto-created)
```

---

## 📊 Database Info

- **Type:** SQLite (local file storage)
- **Location:** `database.db` in project root
- **Tables:**
  - `users` - Player accounts & stats
  - `items` - Game items catalog
  - `user_items` - Player inventory
  - `trades` - Player-to-player trades
  - `chat` - Global chat messages

---

## 🚀 Deployment Options

### Local Network (Play with Friends)
1. Find your machine's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Share: `http://YOUR_IP:3000`
3. Friends can access from any device on same network

### Free Cloud Hosting

**Heroku** (Deprecated - try alternatives)
**Render:** https://render.com (free tier)
**Railway:** https://railway.app (free tier)

Steps:
1. Create account and connect GitHub repo
2. Set environment variables in dashboard
3. Deploy!

---

## ❓ Still Having Issues?

1. **Check terminal output** for error messages
2. **Check browser console** (`F12` > Console tab)
3. **Check Network tab** in DevTools to see API calls
4. **Verify `.env` file** exists and has correct values
5. **Try fresh install:** `rm -rf node_modules && npm install`

---

## 📝 Notes

- Game data is stored locally in `database.db`
- Resetting game: Delete `database.db` and restart server
- Each player session lasts 24 hours
- Stats regenerate automatically every minute
