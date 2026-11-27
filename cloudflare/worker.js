import { DurableObject } from 'cloudflare:workers';
import seedData from './seed-data.json';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const BASE_REF_DATE = '2026-11-16';
const BASE_REF_UID = 630484;

function corsHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    ...extra
  };
}

function sendJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  });
}

function cloneJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getIstDateObj(offsetDays = 0) {
  const now = new Date(Date.now() + IST_OFFSET_MS);
  if (offsetDays) now.setUTCDate(now.getUTCDate() + offsetDays);
  return now;
}

function formatDateYMD(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTodayDateStr() {
  return formatDateYMD(getIstDateObj(0));
}

function getYesterdayDateStr() {
  return formatDateYMD(getIstDateObj(-1));
}

function getIstTimeStr() {
  const d = getIstDateObj(0);
  return [
    String(d.getUTCHours()).padStart(2, '0'),
    String(d.getUTCMinutes()).padStart(2, '0'),
    String(d.getUTCSeconds()).padStart(2, '0')
  ].join(':');
}

function getDateDayOffset(dateStr, baseDateStr = BASE_REF_DATE) {
  const d1 = new Date(dateStr + 'T00:00:00Z');
  const d2 = new Date(baseDateStr + 'T00:00:00Z');
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
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

  const dDepNum = randInt(70, 90);
  const dReg = randInt(Math.max(80, dDepNum), 110);
  const dDepAmt = dDepNum * 500 + randInt(5000, 9000);
  const dFirst = dDepNum - randInt(10, 20);

  const tDepNum = randInt(20, 40);
  const tReg = randInt(Math.max(30, tDepNum), 50);
  const tDepAmt = tDepNum * 500 + randInt(1000, 2000);
  const tFirst = tDepNum;

  const totalComm = +(randInt(4000, 5999) + randInt(0, 99) / 100).toFixed(2);
  const dComm = +(totalComm * (0.62 + rng() * 0.06)).toFixed(2);
  const tComm = +(totalComm - dComm).toFixed(2);

  const t1Reg = dReg + tReg;
  const t1DepNum = dDepNum + tDepNum;
  const t1DepAmt = dDepAmt + tDepAmt;
  const t1First = dFirst + tFirst;

  const cards = [
    { uid: String(baseUid), level: '1', deposit: 300, bet: 409, commission: 2.45, time: dateStr },
    { uid: String(baseUid - 32), level: '1', deposit: 200, bet: 330, commission: 1.98, time: dateStr },
    { uid: String(baseUid - 96), level: '1', deposit: 200, bet: 280, commission: 1.68, time: dateStr },
    { uid: String(baseUid - 169), level: '1', deposit: 100, bet: 115, commission: 0.69, time: dateStr },
    { uid: String(baseUid - 224), level: '1', deposit: 100, bet: 100, commission: 0.60, time: dateStr },
    { uid: String(baseUid - 294), level: '2', deposit: 500, bet: 620, commission: 3.72, time: dateStr }
  ];

  return {
    date: dateStr,
    dayOffset: offset,
    baseUid,
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
    cards
  };
}

function getColorForNumber(num) {
  if (num === 0) return 'violet-red';
  if (num === 5) return 'violet-green';
  if ([1, 3, 7, 9].includes(num)) return 'green';
  return 'red';
}

export class ShreewinStateDO extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS kv_state (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
    });
  }

  getInitialState() {
    const base = cloneJson(seedData || {});
    const users = Array.isArray(base.users) && base.users.length ? base.users : [
      {
        id: 'USR10000',
        phone: '9594558820',
        password: 'Pk9082pk',
        balance: 1050,
        uid: '6130903',
        inviteCode: '36467291608',
        inviterCode: '',
        vipLevel: 0,
        nickname: 'MEMBERD46ABGUH',
        nickName: 'MEMBERD46ABGUH',
        createdAt: new Date().toISOString()
      }
    ];
    const nowSec = Math.floor(Date.now() / 1000);
    const wingo = base.wingo || {};
    return {
      activeUserId: base.activeUserId !== undefined ? base.activeUserId : (users[0] ? users[0].id : null),
      users,
      transactions: Array.isArray(base.transactions) ? base.transactions : [],
      wingo: {
        period: Number(wingo.period || 20261114001),
        duration: 30,
        forcedOutcome: wingo.forcedOutcome || null,
        history: Array.isArray(wingo.history) ? wingo.history.slice(0, 50) : [],
        bets: Array.isArray(wingo.bets) ? wingo.bets : [],
        roundStartSec: nowSec - (nowSec % 30)
      },
      dailyPromotion: base.dailyPromotion || null,
      promotionHistory: Array.isArray(base.promotionHistory) ? base.promotionHistory : []
    };
  }

  loadState() {
    const row = this.ctx.storage.sql
      .exec('SELECT data FROM kv_state WHERE id = ?', 'global')
      .toArray()[0];

    if (!row) {
      const init = this.getInitialState();
      this.saveState(init);
      return init;
    }

    const parsed = JSON.parse(row.data);
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.transactions)) parsed.transactions = [];
    if (!parsed.wingo) parsed.wingo = { period: 20261114001, duration: 30, forcedOutcome: null, history: [], bets: [] };
    if (!Array.isArray(parsed.wingo.history)) parsed.wingo.history = [];
    if (!Array.isArray(parsed.wingo.bets)) parsed.wingo.bets = [];
    return parsed;
  }

  saveState(data) {
    this.ctx.storage.sql.exec(
      'INSERT OR REPLACE INTO kv_state (id, data, updated_at) VALUES (?, ?, ?)',
      'global',
      JSON.stringify(data),
      new Date().toISOString()
    );
  }

  getActiveUser(data) {
    return data.users.find((u) => u.id === data.activeUserId) || data.users[0] || null;
  }

  ensurePromotionHistory(data) {
    const yesterdayStr = getYesterdayDateStr();
    let mutated = false;
    if (!Array.isArray(data.promotionHistory) || data.promotionHistory.length === 0 || data.promotionHistory[0].date !== yesterdayStr) {
      const history = [];
      for (let i = 1; i <= 7; i++) {
        history.push(generateHistoryEntryForDate(formatDateYMD(getIstDateObj(-i))));
      }
      data.promotionHistory = history;
      mutated = true;
    }
    const yesterdayEntry = data.promotionHistory[0] || generateHistoryEntryForDate(BASE_REF_DATE);
    data.dailyPromotion = {
      date: getTodayDateStr(),
      yesterdayDate: yesterdayEntry.date,
      yesterdayCommission: yesterdayEntry.commissionPoint,
      direct: yesterdayEntry.direct,
      team: yesterdayEntry.team,
      tier1Combined: yesterdayEntry.tier1Combined,
      commissionPoint: yesterdayEntry.commissionPoint
    };
    return { promo: data.dailyPromotion, history: data.promotionHistory, mutated };
  }

  resolvePeriod(data, period, forcedOutcome = null) {
    let winningNumber;
    if (forcedOutcome !== null && typeof forcedOutcome.number === 'number') {
      winningNumber = forcedOutcome.number;
    } else {
      winningNumber = Math.floor(Math.random() * 10);
    }

    const color = getColorForNumber(winningNumber);
    const size = winningNumber >= 5 ? 'Big' : 'Small';
    const roundResult = {
      period,
      number: winningNumber,
      color,
      size,
      time: getIstTimeStr()
    };

    data.wingo.history.unshift(roundResult);
    if (data.wingo.history.length > 50) data.wingo.history.pop();

    data.wingo.bets.forEach((b) => {
      if (b.period === period && b.status === 'PENDING') {
        let isWin = false;
        let multiplier = 0;

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
        } else if (b.selectType === 'number') {
          if (parseInt(b.selection, 10) === winningNumber) {
            isWin = true;
            multiplier = 9;
          }
        } else if (b.selectType === 'size') {
          if (String(b.selection || '').toLowerCase() === size.toLowerCase()) {
            isWin = true;
            multiplier = 2;
          }
        }

        if (isWin) {
          b.status = 'WON';
          b.winAmount = b.amount * multiplier;
          const u = data.users.find((usr) => usr.id === b.userId);
          if (u) u.balance = Number(u.balance || 0) + b.winAmount;
        } else {
          b.status = 'LOST';
          b.winAmount = 0;
        }
      }
    });
  }

  advanceWingoIfNeeded(data) {
    const duration = 30;
    const nowSec = Math.floor(Date.now() / 1000);
    let mutated = false;

    if (!data.wingo.roundStartSec || typeof data.wingo.roundStartSec !== 'number') {
      data.wingo.roundStartSec = nowSec - (nowSec % duration);
      mutated = true;
    }

    const elapsed = nowSec - data.wingo.roundStartSec;
    if (elapsed >= duration) {
      const periodsElapsed = Math.floor(elapsed / duration);
      this.resolvePeriod(data, data.wingo.period, data.wingo.forcedOutcome);
      data.wingo.forcedOutcome = null;

      if (periodsElapsed > 1) {
        const extra = Math.min(periodsElapsed - 1, 10);
        const startOffset = periodsElapsed - extra;
        for (let i = startOffset; i < periodsElapsed; i++) {
          this.resolvePeriod(data, data.wingo.period + i, null);
        }
      }

      data.wingo.period += periodsElapsed;
      data.wingo.roundStartSec += periodsElapsed * duration;
      mutated = true;
    }

    data.wingo.duration = duration;
    data.wingo.timeRemaining = Math.max(0, duration - (nowSec - data.wingo.roundStartSec));
    return mutated;
  }

  async parseJson(request) {
    try {
      const raw = await request.text();
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const data = this.loadState();
    let dirty = this.advanceWingoIfNeeded(data);

    // 1. User Info & Session
    if (pathname === '/api/user/info' || pathname === '/api/webapi/GetUserInfo') {
      if (!data.activeUserId) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Logged out' });
      }
      const user = this.getActiveUser(data);
      const promoRes = this.ensurePromotionHistory(data);
      if (dirty || promoRes.mutated) this.saveState(data);
      return sendJson({
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
          commission: promoRes.promo.yesterdayCommission,
          inviteCode: user.inviteCode || '36467291608',
          vipLevel: user.vipLevel !== undefined ? user.vipLevel : 0,
          dailyPromotion: promoRes.promo
        }
      });
    }

    // 1.1 Promotion Daily Data & 7-Day History
    if (pathname === '/api/promotion/data' || pathname === '/api/webapi/GetPromotionData') {
      const promoRes = this.ensurePromotionHistory(data);
      if (dirty || promoRes.mutated) this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Success',
        data: promoRes.promo,
        history: promoRes.history
      });
    }

    // 1.2 Promotion 7-Day History Endpoint
    if (pathname === '/api/promotion/history') {
      const promoRes = this.ensurePromotionHistory(data);
      if (dirty || promoRes.mutated) this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Success',
        data: promoRes.history
      });
    }

    // 1.3 Promotion Data for Specific Date
    if (pathname === '/api/promotion/date') {
      const targetDate = url.searchParams.get('date');
      if (!targetDate) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Date parameter required' }, 400);
      }
      const promoRes = this.ensurePromotionHistory(data);
      if (dirty || promoRes.mutated) this.saveState(data);
      const entry = promoRes.history.find((h) => h.date === targetDate) || generateHistoryEntryForDate(targetDate);
      return sendJson({ code: 0, msg: 'Success', data: entry });
    }

    // 1.4 Admin Refresh Daily Promotion
    if (pathname === '/api/admin/refresh-daily-promotion') {
      const entry = generateHistoryEntryForDate(getTodayDateStr());
      data.dailyPromotion = {
        date: getTodayDateStr(),
        yesterdayDate: getYesterdayDateStr(),
        yesterdayCommission: entry.commissionPoint,
        direct: entry.direct,
        team: entry.team,
        tier1Combined: entry.tier1Combined,
        commissionPoint: entry.commissionPoint
      };
      this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Daily promotion refreshed successfully',
        data: data.dailyPromotion
      });
    }

    // 2. Register
    if (pathname === '/api/user/register' || pathname === '/api/webapi/Register') {
      const body = await this.parseJson(request);
      const phone = body.phone || body.username || ('98' + Math.floor(10000000 + Math.random() * 90000000));
      const inviteCode = body.inviteCode || body.invitationCode || '36467291608';
      const password = body.password || '123456';

      let existing = data.users.find((u) => u.phone === phone);
      if (!existing) {
        existing = {
          id: 'USR' + (10000 + data.users.length + 1),
          phone,
          password,
          balance: 1000.0,
          uid: Math.floor(10000000 + Math.random() * 90000000).toString(),
          inviteCode: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
          inviterCode: inviteCode,
          vipLevel: 1,
          createdAt: new Date().toISOString()
        };
        data.users.unshift(existing);
      }
      data.activeUserId = existing.id;
      this.saveState(data);

      return sendJson({
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
      const body = await this.parseJson(request);
      const phone = (body.phone || body.username || '').trim();
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      let user = null;
      if (phone) {
        user = data.users.find((u) => u.phone === phone);
      } else if (email) {
        user = data.users.find((u) => (u.email || '').toLowerCase() === email);
      }

      if (!user) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Account not found. Please check phone number or register.' });
      }
      if (user.password && password !== user.password) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Incorrect password' });
      }

      data.activeUserId = user.id;
      this.saveState(data);
      return sendJson({
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
      data.activeUserId = null;
      this.saveState(data);
      return sendJson({ code: 0, msg: 'Logged out successfully' });
    }

    // 4. WinGo Status & History
    if (pathname === '/api/wingo/status' || pathname === '/api/webapi/GetGameIssue') {
      if (dirty) this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Success',
        data: {
          period: data.wingo.period,
          timeRemaining: data.wingo.timeRemaining,
          duration: data.wingo.duration,
          history: data.wingo.history.slice(0, 20)
        }
      });
    }

    // 5. Place Bet
    if (pathname === '/api/wingo/bet' || pathname === '/api/webapi/GameBetting') {
      const body = await this.parseJson(request);
      const amount = parseFloat(body.amount || 10);
      const selectType = body.selectType || 'color';
      const selection = body.selection || 'green';
      const user = this.getActiveUser(data);

      if (!user || user.balance < amount) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Insufficient balance' }, 400);
      }

      user.balance = Number(user.balance) - amount;
      const newBet = {
        id: 'BET' + Date.now(),
        userId: user.id,
        period: data.wingo.period,
        selectType,
        selection,
        amount,
        status: 'PENDING',
        winAmount: 0,
        time: getIstTimeStr()
      };

      data.wingo.bets.unshift(newBet);
      this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Bet placed successfully',
        data: { bet: newBet, newBalance: user.balance }
      });
    }

    // 6. User Bets
    if (pathname === '/api/wingo/my-bets' || pathname === '/api/webapi/GetMyEmerdList') {
      if (dirty) this.saveState(data);
      const user = this.getActiveUser(data);
      const userBets = user ? data.wingo.bets.filter((b) => b.userId === user.id).slice(0, 30) : [];
      return sendJson({ code: 0, msg: 'Success', data: { list: userBets } });
    }

    // 7. Wallet Recharge
    if (pathname === '/api/wallet/recharge' || pathname === '/api/webapi/CreateLocalRechargeOrderV3') {
      const body = await this.parseJson(request);
      const amount = parseFloat(body.amount || 500);
      const channel = body.channel || 'Fast UPI';
      const user = this.getActiveUser(data);
      if (!user) return sendJson({ code: 1, msg: 'User not found' }, 404);

      user.balance = Number(user.balance) + amount;
      const txn = {
        id: 'TXN' + Date.now(),
        userId: user.id,
        type: 'RECHARGE',
        amount,
        channel,
        status: 'SUCCESS',
        time: new Date().toISOString()
      };
      data.transactions.unshift(txn);
      this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Recharge successful',
        data: { txnId: txn.id, amount, balance: user.balance }
      });
    }

    // 8. Wallet Withdrawal
    if (pathname === '/api/wallet/withdraw' || pathname === '/api/webapi/NewSetWithdrawal') {
      const body = await this.parseJson(request);
      const amount = parseFloat(body.amount || 200);
      const user = this.getActiveUser(data);
      if (!user || user.balance < amount) {
        if (dirty) this.saveState(data);
        return sendJson({ code: 1, msg: 'Insufficient balance' }, 400);
      }

      user.balance = Number(user.balance) - amount;
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
      data.transactions.unshift(txn);
      this.saveState(data);
      return sendJson({
        code: 0,
        msg: 'Withdrawal submitted successfully',
        data: { txnId: txn.id, amount, balance: user.balance }
      });
    }

    // 9. Transaction Records
    if (pathname === '/api/wallet/transactions' || pathname === '/api/webapi/GetTransactions') {
      if (dirty) this.saveState(data);
      const user = this.getActiveUser(data);
      const list = user
        ? data.transactions.filter((t) => !t.userId || t.userId === user.id || t.userId === 'ALL')
        : [];
      return sendJson({ code: 0, msg: 'Success', data: { list } });
    }

    // 10. Admin Control APIs
    if (pathname === '/api/admin/set-outcome') {
      const body = await this.parseJson(request);
      const num = parseInt(body.number, 10);
      if (body.number !== null && body.number !== '' && !isNaN(num) && num >= 0 && num <= 9) {
        data.wingo.forcedOutcome = { number: num };
        this.saveState(data);
        return sendJson({ code: 0, msg: `Next period outcome forced to Number: ${num}` });
      }
      data.wingo.forcedOutcome = null;
      this.saveState(data);
      return sendJson({ code: 0, msg: 'Next period outcome reset to AUTO (random)' });
    }

    if (pathname === '/api/admin/set-balance') {
      const body = await this.parseJson(request);
      const newBal = parseFloat(body.balance);
      const targetUser = (body.userId ? data.users.find((u) => u.id === body.userId) : null) || this.getActiveUser(data);
      if (!isNaN(newBal) && targetUser) {
        targetUser.balance = newBal;
        this.saveState(data);
        return sendJson({ code: 0, msg: `User balance updated to ₹${newBal.toFixed(2)}`, balance: newBal });
      }
      return sendJson({ code: 1, msg: 'Invalid balance amount' }, 400);
    }

    if (pathname === '/api/admin/update-user') {
      const body = await this.parseJson(request);
      const targetUser = (body.userId ? data.users.find((u) => u.id === body.userId) : null)
        || (body.originalPhone ? data.users.find((u) => u.phone === body.originalPhone) : null)
        || this.getActiveUser(data);
      if (!targetUser) {
        return sendJson({ code: 1, msg: 'User not found' }, 404);
      }

      if (body.uid !== undefined && String(body.uid).trim() !== '') {
        targetUser.uid = String(body.uid).trim();
      }
      if (body.inviteCode !== undefined && String(body.inviteCode).trim() !== '') {
        targetUser.inviteCode = String(body.inviteCode).trim();
      }
      if (body.balance !== undefined && !isNaN(parseFloat(body.balance))) {
        targetUser.balance = parseFloat(body.balance);
      }
      if (body.phone !== undefined && String(body.phone).trim() !== '') {
        targetUser.phone = String(body.phone).trim();
      }
      if (body.nickName !== undefined && String(body.nickName).trim() !== '') {
        targetUser.nickname = String(body.nickName).trim();
        targetUser.nickName = targetUser.nickname;
      }
      if (body.vipLevel !== undefined && !isNaN(parseInt(body.vipLevel, 10))) {
        targetUser.vipLevel = parseInt(body.vipLevel, 10);
      }
      if (body.password !== undefined && String(body.password).trim() !== '') {
        targetUser.password = String(body.password).trim();
      }

      this.saveState(data);
      return sendJson({ code: 0, msg: 'User profile updated successfully', data: targetUser });
    }

    if (pathname === '/api/admin/transaction/add') {
      const body = await this.parseJson(request);
      const type = (body.type || 'WITHDRAW').toUpperCase();
      const amount = parseFloat(body.amount);
      if (isNaN(amount) || amount < 0) {
        return sendJson({ code: 1, msg: 'Invalid transaction amount' }, 400);
      }
      const targetUser = (body.userId ? data.users.find((u) => u.id === body.userId) : null) || this.getActiveUser(data);
      const prefix = type === 'WITHDRAW' ? 'WTH' : 'TXN';
      const txn = {
        id: (body.id && String(body.id).trim()) || (prefix + Date.now()),
        userId: body.userId || (targetUser ? targetUser.id : 'USR10000'),
        type,
        amount,
        channel: (body.channel && String(body.channel).trim()) || (type === 'WITHDRAW' ? 'UPI Fast' : 'Fast UPI'),
        account: (body.account && String(body.account).trim()) || '',
        status: (body.status && String(body.status).trim().toUpperCase()) || 'SUCCESS',
        time: (body.time && String(body.time).trim()) || new Date().toISOString()
      };
      data.transactions.unshift(txn);
      this.saveState(data);
      return sendJson({ code: 0, msg: `${type} record added (${txn.id})`, data: txn });
    }

    if (pathname === '/api/admin/transaction/update') {
      const body = await this.parseJson(request);
      const txn = data.transactions.find((t) => t.id === body.id);
      if (!txn) {
        return sendJson({ code: 1, msg: 'Transaction not found' }, 404);
      }
      if (body.newId !== undefined && String(body.newId).trim() !== '') txn.id = String(body.newId).trim();
      if (body.userId !== undefined && String(body.userId).trim() !== '') txn.userId = String(body.userId).trim();
      if (body.type !== undefined && String(body.type).trim() !== '') txn.type = String(body.type).trim().toUpperCase();
      if (body.amount !== undefined && !isNaN(parseFloat(body.amount))) txn.amount = parseFloat(body.amount);
      if (body.channel !== undefined) txn.channel = String(body.channel).trim();
      if (body.account !== undefined) txn.account = String(body.account).trim();
      if (body.status !== undefined && String(body.status).trim() !== '') txn.status = String(body.status).trim().toUpperCase();
      if (body.time !== undefined && String(body.time).trim() !== '') txn.time = String(body.time).trim();
      this.saveState(data);
      return sendJson({ code: 0, msg: `Record ${txn.id} updated`, data: txn });
    }

    if (pathname === '/api/admin/transaction/delete') {
      const body = await this.parseJson(request);
      const idx = data.transactions.findIndex((t) => t.id === body.id);
      if (idx === -1) {
        return sendJson({ code: 1, msg: 'Transaction not found' }, 404);
      }
      const removed = data.transactions.splice(idx, 1)[0];
      this.saveState(data);
      return sendJson({ code: 0, msg: `Record ${removed.id} deleted` });
    }

    if (pathname === '/api/admin/data') {
      if (dirty) this.saveState(data);
      const activeUser = this.getActiveUser(data);
      return sendJson({
        code: 0,
        data: {
          activeUserId: activeUser ? activeUser.id : null,
          users: data.users,
          transactions: data.transactions,
          wingo: data.wingo
        }
      });
    }

    if (dirty) this.saveState(data);
    return sendJson({ code: 404, msg: 'Unknown API endpoint' }, 404);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const id = env.SHREEWIN_DO.idFromName('global');
      const stub = env.SHREEWIN_DO.get(id);
      return stub.fetch(request);
    }

    if (url.pathname === '/admin' || url.pathname === '/admin.html') {
      const assetUrl = new URL('/admin', url.origin);
      const resp = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      const headers = new Headers(resp.headers);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return new Response(resp.body, { status: resp.status, headers });
    }

    return env.ASSETS.fetch(request);
  }
};
