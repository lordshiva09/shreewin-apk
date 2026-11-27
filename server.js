const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 4040;
const DATA_FILE = path.join(__dirname, 'shreewin_data.json');

// --- In-Memory State & Persistence ---
let state = {
  users: [
    {
      id: 'USR10001',
      phone: '9876543210',
      password: 'password123',
      balance: 10000.00,
      uid: '36467291',
      inviteCode: '36467291608',
      inviterCode: '',
      vipLevel: 1,
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'TXN10001',
      userId: 'USR10001',
      type: 'RECHARGE',
      amount: 10000.00,
      status: 'SUCCESS',
      channel: 'Fast UPI',
      time: new Date().toISOString()
    }
  ],
  wingo: {
    period: 20261114001,
    timeRemaining: 30, // seconds
    duration: 30,
    forcedOutcome: null, // admin override: { number: 7, color: 'green' }
    history: [
      { period: 20261114000, number: 7, color: 'green', size: 'Big', time: '16:00:00' },
      { period: 20261113999, number: 2, color: 'red', size: 'Small', time: '15:59:30' },
      { period: 20261113998, number: 0, color: 'violet-red', size: 'Small', time: '15:59:00' },
      { period: 20261113997, number: 5, color: 'violet-green', size: 'Big', time: '15:58:30' },
      { period: 20261113996, number: 8, color: 'red', size: 'Big', time: '15:58:00' },
      { period: 20261113995, number: 3, color: 'green', size: 'Small', time: '15:57:30' },
      { period: 20261113994, number: 1, color: 'green', size: 'Small', time: '15:57:00' },
      { period: 20261113993, number: 6, color: 'red', size: 'Big', time: '15:56:30' },
      { period: 20261113992, number: 4, color: 'red', size: 'Small', time: '15:56:00' },
      { period: 20261113991, number: 9, color: 'green', size: 'Big', time: '15:55:30' }
    ],
    bets: []
  },
  dailyPromotion: null,
  promotionHistory: []
};

// --- Daily Promotion & 7-Day Historical Engine ---
const BASE_REF_DATE = '2026-11-16';
const BASE_REF_UID = 630484;

function getDateDayOffset(dateStr, baseDateStr = BASE_REF_DATE) {
  const d1 = new Date(dateStr + 'T00:00:00Z');
  const d2 = new Date(baseDateStr + 'T00:00:00Z');
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

function getBaseUidForDate(dateStr) {
  return BASE_REF_UID + getDateDayOffset(dateStr);
}

function makeDailyRng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateHistoryEntryForDate(dateStr) {
  const offset = getDateDayOffset(dateStr);
  const baseUid = BASE_REF_UID + offset;

  const rng = makeDailyRng('SHREEWIN_DAILY_PROMO_' + dateStr);
  const randInt = (min, max) => min + Math.floor(rng() * (max - min + 1));

  // Direct:
  // Deposit users: 70 - 90
  // Register users: 80 - 110 (always >= deposit users)
  const dDepNum = randInt(70, 90);
  const dReg = randInt(Math.max(80, dDepNum), 110);
  // Deposit amount: (deposit users * 500) + 5000-9000
  const dDepAmt = dDepNum * 500 + randInt(5000, 9000);
  // First deposit users: 10 - 20 less than deposit users
  const dFirst = dDepNum - randInt(10, 20);

  // Team:
  // Deposit users: 20 - 40
  // Register users: 30 - 50 (always >= deposit users)
  const tDepNum = randInt(20, 40);
  const tReg = randInt(Math.max(30, tDepNum), 50);
  // Deposit amount: (deposit users * 500) + 1000-2000 extra
  const tDepAmt = tDepNum * 500 + randInt(1000, 2000);
  // First deposit users: equal to deposit users
  const tFirst = tDepNum;

  // Yesterday Total Commission: 4000 - 6000
  const totalComm = +(randInt(4000, 5999) + (randInt(0, 99) / 100)).toFixed(2);
  const dComm = +(totalComm * (0.62 + rng() * 0.06)).toFixed(2);
  const tComm = +(totalComm - dComm).toFixed(2);

  const t1Reg = dReg + tReg;
  const t1DepNum = dDepNum + tDepNum;
  const t1DepAmt = dDepAmt + tDepAmt;
  const t1First = dFirst + tFirst;

  const cards = [
    { uid: String(baseUid), level: "1", deposit: 300, bet: 409, commission: 2.45, time: dateStr },
    { uid: String(baseUid - 32), level: "1", deposit: 200, bet: 330, commission: 1.98, time: dateStr },
    { uid: String(baseUid - 96), level: "1", deposit: 200, bet: 280, commission: 1.68, time: dateStr },
    { uid: String(baseUid - 169), level: "1", deposit: 100, bet: 115, commission: 0.69, time: dateStr },
    { uid: String(baseUid - 224), level: "1", deposit: 100, bet: 100, commission: 0.60, time: dateStr },
    { uid: String(baseUid - 294), level: "2", deposit: 500, bet: 620, commission: 3.72, time: dateStr }
  ];

  return {
    date: dateStr,
    dayOffset: offset,
    baseUid: baseUid,
    direct: {
      register: dReg,
      depositNumber: dDepNum,
      depositAmount: dDepAmt,
      firstDeposit: dFirst,
      commission: dComm
    },
    team: {
      register: tReg,
      depositNumber: tDepNum,
      depositAmount: tDepAmt,
      firstDeposit: tFirst,
      commission: tComm
    },
    tier1Combined: {
      register: t1Reg,
      depositNumber: t1DepNum,
      depositAmount: t1DepAmt,
      firstDeposit: t1First,
      commissionPoint: totalComm
    },
    commissionPoint: totalComm,
    cards: cards
  };
}

function getTodayDateStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPromotionHistory() {
  const yesterdayStr = getYesterdayDateStr();
  if (!state.promotionHistory || !Array.isArray(state.promotionHistory) || state.promotionHistory.length === 0 || state.promotionHistory[0].date !== yesterdayStr) {
    const today = new Date();
    const history = [];
    for (let i = 1; i <= 7; i++) {
      const past = new Date(today);
      past.setDate(today.getDate() - i);
      const year = past.getFullYear();
      const month = String(past.getMonth() + 1).padStart(2, '0');
      const day = String(past.getDate()).padStart(2, '0');
      const dStr = `${year}-${month}-${day}`;
      history.push(generateHistoryEntryForDate(dStr));
    }
    state.promotionHistory = history;
    saveData();
  }
  return state.promotionHistory;
}

function getDailyPromotion() {
  const history = getPromotionHistory();
  const yesterdayEntry = history[0] || generateHistoryEntryForDate('2026-11-16');

  state.dailyPromotion = {
    date: getTodayDateStr(),
    yesterdayDate: yesterdayEntry.date,
    yesterdayCommission: yesterdayEntry.commissionPoint,
    direct: yesterdayEntry.direct,
    team: yesterdayEntry.team,
    tier1Combined: yesterdayEntry.tier1Combined,
    commissionPoint: yesterdayEntry.commissionPoint
  };
  return state.dailyPromotion;
}

let activeUserId = null;

// Load saved data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.users) state.users = parsed.users;
    if (parsed.transactions) state.transactions = parsed.transactions;
    if (parsed.wingo && parsed.wingo.history) state.wingo.history = parsed.wingo.history;
    if (parsed.wingo && parsed.wingo.bets) state.wingo.bets = parsed.wingo.bets;
    if (parsed.dailyPromotion) state.dailyPromotion = parsed.dailyPromotion;
    if (parsed.promotionHistory) state.promotionHistory = parsed.promotionHistory;
  } catch (err) {
    console.warn('Error reading data file, using defaults');
  }
}

activeUserId = (state.users && state.users[0]) ? state.users[0].id : null;

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

// --- WinGo Timer & Settlement Engine ---
setInterval(() => {
  if (state.wingo.timeRemaining > 0) {
    state.wingo.timeRemaining--;
  } else {
    // Settle current round
    resolveCurrentPeriod();
    // Start next round
    state.wingo.period++;
    state.wingo.timeRemaining = state.wingo.duration;
  }
}, 1000);

function resolveCurrentPeriod() {
  const currentPeriod = state.wingo.period;
  let winningNumber;

  if (state.wingo.forcedOutcome !== null && typeof state.wingo.forcedOutcome.number === 'number') {
    winningNumber = state.wingo.forcedOutcome.number;
    state.wingo.forcedOutcome = null; // Reset override after one round
  } else {
    winningNumber = Math.floor(Math.random() * 10);
  }

  let color = 'red';
  if (winningNumber === 0) color = 'violet-red';
  else if (winningNumber === 5) color = 'violet-green';
  else if ([1, 3, 7, 9].includes(winningNumber)) color = 'green';
  else color = 'red';

  const size = winningNumber >= 5 ? 'Big' : 'Small';
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];

  const roundResult = {
    period: currentPeriod,
    number: winningNumber,
    color,
    size,
    time: timeStr
  };

  state.wingo.history.unshift(roundResult);
  if (state.wingo.history.length > 50) state.wingo.history.pop();

  // Settle user bets for this period
  state.wingo.bets.forEach(b => {
    if (b.period === currentPeriod && b.status === 'PENDING') {
      let isWin = false;
      let multiplier = 0;

      // Color check
      if (b.selectType === 'color') {
        if (b.selection === 'green' && (color === 'green' || color === 'violet-green')) {
          isWin = true;
          multiplier = color === 'violet-green' ? 1.5 : 2;
        } else if (b.selection === 'red' && (color === 'red' || color === 'violet-red')) {
          isWin = true;
          multiplier = color === 'violet-red' ? 1.5 : 2;
        } else if (b.selection === 'violet' && (color === 'violet-red' || color === 'violet-green')) {
          isWin = true;
          multiplier = 4.5;
        }
      }
      // Number check
      else if (b.selectType === 'number') {
        if (parseInt(b.selection, 10) === winningNumber) {
          isWin = true;
          multiplier = 9;
        }
      }
      // Size check
      else if (b.selectType === 'size') {
        if (b.selection.toLowerCase() === size.toLowerCase()) {
          isWin = true;
          multiplier = 2;
        }
      }

      if (isWin) {
        b.status = 'WON';
        b.winAmount = b.amount * multiplier;
        // Credit winning to user
        const u = state.users.find(usr => usr.id === b.userId);
        if (u) {
          u.balance += b.winAmount;
        }
      } else {
        b.status = 'LOST';
        b.winAmount = 0;
      }
    }
  });

  saveData();
}

// --- HTTP Request Helper ---
function parseJson(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

// --- Static File Server ---
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  // --- API Endpoints ---
  // 1. User Info & Session
  if (pathname === '/api/user/info' || pathname === '/api/webapi/GetUserInfo') {
    if (!activeUserId) {
      return sendJson(res, { code: 1, msg: 'Logged out' });
    }
    const user = state.users.find(u => u.id === activeUserId) || state.users[0];
    const promo = getDailyPromotion();
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: {
        userId: user.id,
        phone: user.phone,
        userPhoto: '/assets/png/1-Cz2mt-nl.png',
        nickName: user.nickname || user.nickName || 'MEMBERD46ABGUH',
        uid: user.uid || '6130903',
        balance: user.balance,
        totalBalance: user.balance,
        commission: promo.yesterdayCommission,
        inviteCode: user.inviteCode || '36467291608',
        vipLevel: user.vipLevel !== undefined ? user.vipLevel : 0,
        dailyPromotion: promo
      }
    });
  }

  // 1.1 Promotion Daily Data & 7-Day History
  if (pathname === '/api/promotion/data' || pathname === '/api/webapi/GetPromotionData') {
    const promo = getDailyPromotion();
    const history = getPromotionHistory();
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: promo,
      history: history
    });
  }

  // 1.2 Promotion 7-Day History Endpoint
  if (pathname === '/api/promotion/history') {
    const history = getPromotionHistory();
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: history
    });
  }

  // 1.3 Promotion Data for Specific Date
  if (pathname === '/api/promotion/date') {
    const parsedUrl = url.parse(req.url, true);
    const targetDate = parsedUrl.query.date;
    if (!targetDate) {
      return sendJson(res, { code: 1, msg: 'Date parameter required' }, 400);
    }
    const history = getPromotionHistory();
    let entry = history.find(h => h.date === targetDate);
    if (!entry) {
      entry = generateHistoryEntryForDate(targetDate);
    }
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: entry
    });
  }

  // 1.2 Admin Force Re-roll Daily Promotion
  if (pathname === '/api/admin/refresh-daily-promotion') {
    const today = getTodayDateStr();
    state.dailyPromotion = generateDailyPromotion(today);
    saveData();
    return sendJson(res, {
      code: 0,
      msg: 'Daily promotion refreshed successfully',
      data: state.dailyPromotion
    });
  }

  // 2. Register
  if (pathname === '/api/user/register' || pathname === '/api/webapi/Register') {
    const body = await parseJson(req);
    const phone = body.phone || body.username || ('98' + Math.floor(10000000 + Math.random() * 90000000));
    const inviteCode = body.inviteCode || body.invitationCode || '36467291608';
    const password = body.password || '123456';

    let existing = state.users.find(u => u.phone === phone);
    if (!existing) {
      existing = {
        id: 'USR' + (10000 + state.users.length + 1),
        phone: phone,
        password: password,
        balance: 1000.00, // Rs. 1000 signup bonus
        uid: Math.floor(10000000 + Math.random() * 90000000).toString(),
        inviteCode: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        inviterCode: inviteCode,
        vipLevel: 1,
        createdAt: new Date().toISOString()
      };
      state.users.unshift(existing);
      saveData();
    }
    activeUserId = existing.id;

    return sendJson(res, {
      code: 0,
      msg: 'Registration successful',
      data: {
        token: 'TOKEN_' + Date.now(),
        userId: existing.id,
        phone: existing.phone,
        uid: existing.uid,
        balance: existing.balance,
        inviteCode: existing.inviteCode
      }
    });
  }

  // 3. Login
  if (pathname === '/api/user/login' || pathname === '/api/webapi/Login') {
    const body = await parseJson(req);
    const phone = (body.phone || body.username || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    let user = null;
    if (phone) {
      user = state.users.find(u => u.phone === phone);
    } else if (email) {
      user = state.users.find(u => (u.email || '').toLowerCase() === email);
    }

    if (!user) {
      return sendJson(res, { code: 1, msg: 'Account not found. Please check phone number or register.' });
    }
    if (user.password && password !== user.password) {
      return sendJson(res, { code: 1, msg: 'Incorrect password' });
    }

    activeUserId = user.id;
    return sendJson(res, {
      code: 0,
      msg: 'Login successful',
      data: {
        token: 'TOKEN_' + Date.now(),
        userId: user.id,
        phone: user.phone,
        nickName: user.nickname || user.nickName || 'MEMBERD46ABGUH',
        uid: user.uid,
        balance: user.balance,
        inviteCode: user.inviteCode || '36467291608'
      }
    });
  }

  // 3.1 Logout
  if (pathname === '/api/user/logout' || pathname === '/api/webapi/Logout') {
    activeUserId = null;
    return sendJson(res, { code: 0, msg: 'Logged out successfully' });
  }

  // 4. WinGo Status & History
  if (pathname === '/api/wingo/status' || pathname === '/api/webapi/GetGameIssue') {
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: {
        period: state.wingo.period,
        timeRemaining: state.wingo.timeRemaining,
        duration: state.wingo.duration,
        history: state.wingo.history.slice(0, 20)
      }
    });
  }

  // 5. Place Bet
  if (pathname === '/api/wingo/bet' || pathname === '/api/webapi/GameBetting') {
    const body = await parseJson(req);
    const amount = parseFloat(body.amount || 10);
    const selectType = body.selectType || 'color'; // color, number, size
    const selection = body.selection || 'green'; // green, red, violet, 0-9, Big, Small
    const user = state.users[0];

    if (user.balance < amount) {
      return sendJson(res, { code: 1, msg: 'Insufficient balance' }, 400);
    }

    user.balance -= amount;

    const newBet = {
      id: 'BET' + Date.now(),
      userId: user.id,
      period: state.wingo.period,
      selectType,
      selection,
      amount,
      status: 'PENDING',
      winAmount: 0,
      time: new Date().toLocaleTimeString()
    };

    state.wingo.bets.unshift(newBet);
    saveData();

    return sendJson(res, {
      code: 0,
      msg: 'Bet placed successfully',
      data: {
        bet: newBet,
        newBalance: user.balance
      }
    });
  }

  // 6. User Bets
  if (pathname === '/api/wingo/my-bets' || pathname === '/api/webapi/GetMyEmerdList') {
    const userBets = state.wingo.bets.filter(b => b.userId === state.users[0].id).slice(0, 30);
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: {
        list: userBets
      }
    });
  }

  // 7. Wallet Recharge (Deposit Simulation)
  if (pathname === '/api/wallet/recharge' || pathname === '/api/webapi/CreateLocalRechargeOrderV3') {
    const body = await parseJson(req);
    const amount = parseFloat(body.amount || 500);
    const channel = body.channel || 'Fast UPI';
    const user = state.users[0];

    user.balance += amount;

    const txn = {
      id: 'TXN' + Date.now(),
      userId: user.id,
      type: 'RECHARGE',
      amount,
      channel,
      status: 'SUCCESS',
      time: new Date().toISOString()
    };
    state.transactions.unshift(txn);
    saveData();

    return sendJson(res, {
      code: 0,
      msg: 'Recharge successful',
      data: {
        txnId: txn.id,
        amount,
        balance: user.balance
      }
    });
  }

  // 8. Wallet Withdrawal
  if (pathname === '/api/wallet/withdraw' || pathname === '/api/webapi/NewSetWithdrawal') {
    const body = await parseJson(req);
    const amount = parseFloat(body.amount || 200);
    const user = state.users[0];

    if (user.balance < amount) {
      return sendJson(res, { code: 1, msg: 'Insufficient balance' }, 400);
    }

    user.balance -= amount;

    const txn = {
      id: 'WTH' + Date.now(),
      userId: user.id,
      type: 'WITHDRAW',
      amount,
      channel: body.bankName || 'UPI Fast',
      account: body.accountNo || body.upiId || 'user@upi',
      status: 'SUCCESS',
      time: new Date().toISOString()
    };
    state.transactions.unshift(txn);
    saveData();

    return sendJson(res, {
      code: 0,
      msg: 'Withdrawal submitted successfully',
      data: {
        txnId: txn.id,
        amount,
        balance: user.balance
      }
    });
  }

  // 9. Transaction Records
  if (pathname === '/api/wallet/transactions' || pathname === '/api/webapi/GetTransactions') {
    return sendJson(res, {
      code: 0,
      msg: 'Success',
      data: {
        list: state.transactions
      }
    });
  }

  // 10. Admin Control APIs
  if (pathname === '/api/admin/set-outcome') {
    const body = await parseJson(req);
    const num = parseInt(body.number, 10);
    if (!isNaN(num) && num >= 0 && num <= 9) {
      state.wingo.forcedOutcome = { number: num };
      return sendJson(res, { code: 0, msg: `Next period outcome forced to Number: ${num}` });
    } else {
      state.wingo.forcedOutcome = null; // Auto/random
      return sendJson(res, { code: 0, msg: 'Next period outcome reset to AUTO (random)' });
    }
  }

  if (pathname === '/api/admin/set-balance') {
    const body = await parseJson(req);
    const newBal = parseFloat(body.balance);
    if (!isNaN(newBal)) {
      state.users[0].balance = newBal;
      saveData();
      return sendJson(res, { code: 0, msg: `User balance updated to ₹${newBal.toFixed(2)}`, balance: newBal });
    }
    return sendJson(res, { code: 1, msg: 'Invalid balance amount' }, 400);
  }

  if (pathname === '/api/admin/data') {
    return sendJson(res, {
      code: 0,
      data: {
        users: state.users,
        transactions: state.transactions,
        wingo: state.wingo
      }
    });
  }

  // --- Serve Admin Page ---
  if (pathname === '/admin' || pathname === '/admin.html') {
    const adminPath = path.join(__dirname, 'admin.html');
    if (fs.existsSync(adminPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(adminPath).pipe(res);
    }
  }

  // --- Static Files Handler ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = 'index.html';
  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA hash routing
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SHREEWIN PLATFORM CLONE RUNNING ON PORT ${PORT}`);
  console.log(`  Target URL: http://localhost:${PORT}/#/register?invitationCode=36467291608`);
  console.log(`  Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`=======================================================`);
});
