# Shreewin Web Application

A full-featured, mobile-responsive clone of the Shreewin gaming & betting platform.

## Features
- **Mobile First Design:** Pixel-perfect mobile view with smooth navigation and UI animations.
- **Pages & Modules:**
  - Home Page (Lottery cards, banner carousels, game categories)
  - WinGo Game View (Live timer, color betting, history records)
  - Promotion Section (Commission stats, subordinate data & records, referral tools)
  - Subordinate Data View (Detailed filtering, search, and hierarchy tracking)
  - Mine / Account Center (User profile, deposit & withdrawal history, VIP level, language selector)
  - Deposit & Withdrawal Pages (UPI, Bank Card, USDT, ARPay integration)
  - Admin Panel (`admin.html`)
- **Backend Server:** Node.js HTTP server (`server.js`) with embedded JSON persistence (`shreewin_data.json`).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Run the Server
```bash
# Start the Node.js server
node server.js
```

The server will start at:
- `http://localhost:4040/`

Open `http://localhost:4040/` in your browser (preferably in mobile responsive mode, e.g. 375x667 or 400x844).
