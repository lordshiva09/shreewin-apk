// Shreewin Client Application
(function () {
  'use strict';

  // ---- AUTH & LOGIN PAGE HELPERS ----
  function isLoggedIn() {
    return localStorage.getItem('shreewin_logged_out') !== '1';
  }

  function getStaticFallbackUsers() {
    var base = [
      { phone: '9594558820', password: 'Pk9082pk', uid: '6130903', nickName: 'MEMBERD46ABGUH', balance: 1050, inviteCode: '36467291608' },
      { phone: '9876543210', password: 'password123', uid: '36467291', nickName: 'MEMBER36467291', balance: 10000, inviteCode: '36467291608' },
      { phone: '9988776655', password: 'testpass123', uid: '37805446', nickName: 'MEMBER37805446', balance: 900, inviteCode: '87682179742' }
    ];
    try {
      var extra = JSON.parse(localStorage.getItem('shreewin_local_users') || '[]');
      if (Array.isArray(extra)) return extra.concat(base);
    } catch (e) {}
    return base;
  }

  window.updateLoginBtnState = function() {
    var tab = document.querySelector('#view-login .login_container-tab .tab.active');
    var isEmail = tab && tab.id === 'loginTab-email';
    var idVal = isEmail
      ? (document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '')
      : (document.getElementById('loginPhone') ? document.getElementById('loginPhone').value.trim() : '');
    var btn = document.getElementById('loginSubmitBtn');
    if (btn) {
      if (idVal.length > 0) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  };

  window.switchLoginTab = function(tab) {
    document.querySelectorAll('#view-login .login_container-tab .tab').forEach(function(el) { el.classList.remove('active'); });
    document.querySelectorAll('#view-login .login-tab-content').forEach(function(el) { el.classList.remove('active'); });
    var tabEl = document.getElementById('loginTab-' + tab);
    var contentEl = document.getElementById('loginContent-' + tab);
    if (tabEl) tabEl.classList.add('active');
    if (contentEl) contentEl.classList.add('active');
    window.updateLoginBtnState();
  };

  function toggleEyeBtnIcon(btn, isVisible) {
    if (!btn) return;
    if (isVisible) {
      btn.innerHTML = '<svg class="svg-icon" viewBox="0 0 1024 1024"><use xlink:href="#icon-eye"></use></svg>';
    } else {
      btn.innerHTML = '<img src="/assets/png/eyeInvisible-NUKC6jpG.png" class="eye-img" alt="Hidden">';
    }
  }

  window.toggleLoginPassword = function() {
    var inp = document.getElementById('loginPassword');
    if (!inp) return;
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    toggleEyeBtnIcon(document.getElementById('loginEyeBtn'), show);
  };

  window.toggleLoginPasswordEmail = function() {
    var inp = document.getElementById('loginPasswordEmail');
    if (!inp) return;
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    toggleEyeBtnIcon(document.getElementById('loginEyeEmailBtn'), show);
  };

  window.toggleCountryDropdown = function() {
    var dd = document.getElementById('countryDropdown');
    if (dd) dd.classList.toggle('open');
  };

  window.selectCountry = function(el, code) {
    var dd = document.getElementById('countryDropdown');
    if (dd) {
      dd.querySelector('.login-dropdown__value span').textContent = code;
      dd.querySelectorAll('.login-dropdown__list-item').forEach(function(it) { it.classList.remove('active'); });
      el.classList.add('active');
      dd.classList.remove('open');
    }
  };

  document.addEventListener('click', function(e) {
    var dd = document.getElementById('countryDropdown');
    if (dd && !dd.contains(e.target)) dd.classList.remove('open');
  });

  window.handleLoginNew = async function() {
    var tab = document.querySelector('#view-login .login_container-tab .tab.active');
    var isEmail = tab && tab.id === 'loginTab-email';
    var phone = isEmail ? '' : (document.getElementById('loginPhone') ? document.getElementById('loginPhone').value.trim() : '');
    var email = isEmail ? (document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '') : '';
    var password = isEmail
      ? (document.getElementById('loginPasswordEmail') ? document.getElementById('loginPasswordEmail').value : '')
      : (document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : '');
    var rememberChecked = isEmail
      ? !!(document.getElementById('rememberEmail') && document.getElementById('rememberEmail').checked)
      : !!(document.getElementById('rememberPwd') && document.getElementById('rememberPwd').checked);

    if (!isEmail && (!phone || phone.length < 10)) { alert('Please enter a valid 10-digit phone number'); return; }
    if (isEmail && !email) { alert('Please enter your email'); return; }
    if (!password) { alert('Please enter your password'); return; }

    var body = isEmail ? { email, password } : { phone, password };
    var res = await api('/api/user/login', body, 'POST');

    // Static hosting fallback (e.g. Cloudflare Workers where /api/* returns 404)
    if (res && res.offline) {
      var list = getStaticFallbackUsers();
      var found = list.find(function(u) {
        return isEmail ? ((u.email || '').toLowerCase() === email.toLowerCase()) : (u.phone === phone);
      });
      if (!found) {
        alert('Account not found. Please check phone number or register.');
        return;
      }
      if (found.password && found.password !== password) {
        alert('Incorrect password');
        return;
      }
      res = {
        code: 0,
        data: {
          token: 'TOKEN_' + Date.now(),
          phone: found.phone,
          uid: found.uid,
          nickName: found.nickName,
          balance: found.balance,
          inviteCode: found.inviteCode
        }
      };
    }

    if (res && res.code === 0) {
      localStorage.removeItem('shreewin_logged_out');
      localStorage.setItem('shreewin_token', (res.data && res.data.token) || ('TOKEN_' + Date.now()));
      if (phone) localStorage.setItem('shreewin_last_phone', phone);
      if (rememberChecked) {
        localStorage.setItem('shreewin_remembered', JSON.stringify({ phone: phone, email: email, password: password }));
      } else {
        localStorage.removeItem('shreewin_remembered');
      }
      if (res.data) {
        state.user.phone = res.data.phone || state.user.phone;
        state.user.uid = res.data.uid || state.user.uid;
        if (res.data.nickName) state.user.nickName = res.data.nickName;
        if (res.data.balance !== undefined) state.user.balance = res.data.balance;
        if (res.data.inviteCode) state.user.inviteCode = res.data.inviteCode;
        updateUI();
      }
      if (typeof syncUser === 'function') await syncUser();
      window.location.hash = '#/home';
    } else {
      alert((res && res.msg) || 'Login failed');
    }
  };

  window.logout = async function() {
    var savedPhone = (state.user && state.user.phone) || localStorage.getItem('shreewin_last_phone') || '';
    localStorage.setItem('shreewin_logged_out', '1');
    localStorage.removeItem('shreewin_token');
    if (savedPhone) localStorage.setItem('shreewin_last_phone', savedPhone);

    // Notify backend session if available (fails silently on static hosts)
    api('/api/user/logout', {}, 'POST').catch(function() {});

    // Populate login screen cleanly (matching Shree.Win logout interface)
    window.switchLoginTab('phone');
    var phoneInp = document.getElementById('loginPhone');
    var pwdInp = document.getElementById('loginPassword');
    var emailInp = document.getElementById('loginEmail');
    var pwdEmailInp = document.getElementById('loginPasswordEmail');
    var rememberBox = document.getElementById('rememberPwd');

    var remembered = null;
    try {
      remembered = JSON.parse(localStorage.getItem('shreewin_remembered') || 'null');
    } catch (e) {}

    if (phoneInp) phoneInp.value = (remembered && remembered.phone) ? remembered.phone : savedPhone;
    if (pwdInp) {
      pwdInp.type = 'password';
      pwdInp.value = (remembered && remembered.password) ? remembered.password : '';
    }
    if (emailInp) emailInp.value = (remembered && remembered.email) ? remembered.email : '';
    if (pwdEmailInp) {
      pwdEmailInp.type = 'password';
      pwdEmailInp.value = '';
    }
    if (rememberBox) rememberBox.checked = !!remembered;
    toggleEyeBtnIcon(document.getElementById('loginEyeBtn'), false);
    toggleEyeBtnIcon(document.getElementById('loginEyeEmailBtn'), false);
    window.updateLoginBtnState();

    window.location.hash = '#/login';
  };

  // --- App State ---
  const state = {
    user: {
      phone: '9594558820',
      uid: '6130903',
      nickName: 'MEMBERD46ABGUH',
      balance: 50.00,
      inviteCode: '36467291608'
    },
    activeTab: 'home',
    wingo: {
      period: 20261114001,
      timeRemaining: 30,
      duration: 30,
      history: []
    },
    currentBet: {
      type: 'color', // color, number, size
      selection: 'green',
      unitAmount: 10,
      multiplier: 1
    },
    myBets: [],
    transactions: []
  };

  // --- API Helper ---
  async function api(path, data = null, method = 'GET') {
    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (data && method === 'POST') opts.body = JSON.stringify(data);
      const res = await fetch(path, opts);
      if (!res.ok) {
        return { code: res.status || 1, offline: true, msg: 'HTTP ' + res.status };
      }
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('application/json')) {
        return { code: 1, offline: true, msg: 'Non-JSON response' };
      }
      return await res.json();
    } catch (e) {
      console.error('API Error:', e);
      return { code: 1, offline: true, msg: e.message };
    }
  }

  // --- Router ---
  function handleRoute() {
    const hash = window.location.hash || '#/home';
    const [routePath, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Set pre-filled inviteCode if available
    const inviteCode = params.get('invitationCode') || params.get('inviteCode');
    if (inviteCode) {
      const inviteInput = document.getElementById('regInviteCode');
      if (inviteInput) inviteInput.value = inviteCode;
    }

    const protectedRoutes = ['#/mine', '#/wallet', '#/withdraw', '#/deposit', '#/recharge', '#/promotion', '#/subordinate-data', '#/promotion/TeamSubordinate', '#/wingo', '#/activity'];
    if (!isLoggedIn() && protectedRoutes.indexOf(routePath) !== -1) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
        return;
      }
      showView('login');
      return;
    }

    if (routePath === '#/register') {
      showView('register');
    } else if (routePath === '#/login') {
      showView('login');
    } else if (routePath === '#/wingo') {
      showView('wingo');
    } else if (routePath === '#/wallet') {
      showView('withdraw');
      syncUser();
    } else if (routePath === '#/promotion') {
      showView('promotion');
      syncPromotion();
    } else if (routePath === '#/subordinate-data' || routePath === '#/promotion/TeamSubordinate') {
      showView('subordinate-data');
      const maxSub = getYesterdayDateObj();
      const subFilterDateEl = document.getElementById('subFilterDate');
      if (subFilterDateEl && (!subFilterDateEl.innerText || subFilterDateEl.innerText.trim() === '2026-11-16' || subFilterDateEl.innerText.trim() === '--')) {
        subFilterDateEl.innerText = maxSub.str;
      }
      if (window.triggerSubordinateLoading) {
        window.triggerSubordinateLoading();
      } else {
        renderSubordinateCards(subFilterDateEl?.innerText || maxSub.str);
        applySubordinateFilters(false);
      }
      const pickerParam = params.get('picker');
      if (pickerParam === 'date') {
        setTimeout(() => window.openDatePicker && window.openDatePicker(), 150);
      } else if (pickerParam === 'tier' || pickerParam === 'level' || pickerParam === 'all') {
        setTimeout(() => window.openTierPicker && window.openTierPicker(), 150);
      }
    } else if (routePath === '#/mine') {
      showView('mine');
    } else if (routePath === '#/activity') {
      showView('activity');
    } else if (routePath === '#/withdraw') {
      showView('withdraw');
      syncUser();
    } else if (routePath === '#/deposit' || routePath === '#/recharge') {
      showView('deposit');
      syncUser();
    } else {
      showView('home');
    }
  }

  function showView(viewId) {
    state.activeTab = viewId;
    document.querySelectorAll('.sw-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    // Update bottom nav highlighting
    document.querySelectorAll('.tabbar__container-item').forEach(btn => {
      const tabName = btn.getAttribute('data-tab');
      if (!tabName) return;
      const img = btn.querySelector('.tab-icon');
      if (tabName === viewId || (tabName === 'wingo' && viewId === 'wingo')) {
        btn.classList.add('active');
        if (img && btn.getAttribute('data-sel')) img.src = btn.getAttribute('data-sel');
      } else {
        btn.classList.remove('active');
        if (img && btn.getAttribute('data-nor')) img.src = btn.getAttribute('data-nor');
      }
    });

    // Hide bottom nav on register/login/subordinate-data/withdraw/deposit
    const hideNav = (viewId === 'register' || viewId === 'login' || viewId === 'subordinate-data' || viewId === 'withdraw' || viewId === 'deposit');
    const nav = document.getElementById('bottomNavBar');
    if (nav) {
      nav.style.display = hideNav ? 'none' : 'flex';
    }
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.style.paddingBottom = hideNav ? '0px' : '74px';
    }

    // Hide floating bot on login/register pages to match real Shree.Win
    const bot = document.getElementById('globalFloatingBot');
    if (bot) {
      bot.style.display = (viewId === 'login' || viewId === 'register') ? 'none' : 'block';
    }

    // Top logo header only visible on home
    const topNav = document.querySelector('.p8-home__nav');
    if (topNav) {
      topNav.style.setProperty('display', (viewId === 'home') ? 'flex' : 'none', 'important');
    }

    // Scroll top
    window.scrollTo(0, 0);
  }

  // --- Sync User Data ---
  async function syncUser() {
    if (!isLoggedIn()) return;
    const res = await api('/api/user/info');
    if (res.code === 0 && res.data) {
      state.user = res.data;
      updateUI();
      if (res.data.dailyPromotion) {
        renderPromotion(res.data.dailyPromotion);
      }
    }
  }

  // --- Daily Promotion Sync (Daily Bases) ---
  function getClientTodayStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Centralized 7-Day Promotion & Subordinate Synchronization Engine ---
  const BASE_REF_DATE = '2026-11-16';
  const BASE_REF_UID = 630484;

  let promotionHistory = [];

  function getDateDayOffset(dateStr, baseDateStr = BASE_REF_DATE) {
    const d1 = new Date(dateStr + 'T00:00:00Z');
    const d2 = new Date(baseDateStr + 'T00:00:00Z');
    return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getBaseUidForDate(dateStr) {
    return BASE_REF_UID + getDateDayOffset(dateStr);
  }

  function getYesterdayDateObj() {
    const d = new Date();
    d.setDate(d.getDate() - 1); // 1-day delay: strictly yesterday
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      str: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    };
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
    const bUid = BASE_REF_UID + offset;

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

    return {
      date: dateStr,
      dayOffset: offset,
      baseUid: bUid,
      direct: { register: dReg, depositNumber: dDepNum, depositAmount: dDepAmt, firstDeposit: dFirst, commission: dComm },
      team: { register: tReg, depositNumber: tDepNum, depositAmount: tDepAmt, firstDeposit: tFirst, commission: tComm },
      tier1Combined: {
        register: t1Reg,
        depositNumber: t1DepNum,
        depositAmount: t1DepAmt,
        firstDeposit: t1First,
        commissionPoint: totalComm
      },
      commissionPoint: totalComm
    };
  }

  function generateClient7DayHistory() {
    const history = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - 1 - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      history.push(generateHistoryEntryForDate(dStr));
    }
    return history;
  }

  function getRecordForDate(dateStr) {
    if (promotionHistory && promotionHistory.length > 0) {
      const found = promotionHistory.find(h => h.date === dateStr);
      if (found) return found;
    }
    return generateHistoryEntryForDate(dateStr);
  }

  async function syncPromotion() {
    let promo = null;
    let history = null;
    try {
      const res = await api('/api/promotion/data');
      if (res && res.code === 0) {
        if (res.data) promo = res.data;
        if (res.history) history = res.history;
      }
    } catch (e) {
      console.warn('Promo sync error:', e);
    }

    if (!history || history.length === 0) {
      const cachedHist = localStorage.getItem('shreewin_promo_history');
      if (cachedHist) {
        try { history = JSON.parse(cachedHist); } catch (e) {}
      }
      if (!history || history.length === 0) {
        history = generateClient7DayHistory();
        localStorage.setItem('shreewin_promo_history', JSON.stringify(history));
      }
    }
    promotionHistory = history;

    if (!promo) {
      const yesterday = history[0];
      promo = {
        date: getClientTodayStr(),
        yesterdayDate: yesterday.date,
        yesterdayCommission: yesterday.commissionPoint,
        direct: yesterday.direct,
        team: yesterday.team,
        tier1Combined: yesterday.tier1Combined
      };
    }

    renderPromotion(promo, history);
  }

  function renderPromotion(promo, history) {
    if (!promo) return;
    const yEl = document.getElementById('promoYesterdayCommission');
    if (yEl) yEl.innerText = parseFloat(promo.yesterdayCommission).toFixed(2);

    const drEl = document.getElementById('promoDirectRegister');
    if (drEl) drEl.innerText = promo.direct.register;

    const dnEl = document.getElementById('promoDirectDepositNum');
    if (dnEl) dnEl.innerText = promo.direct.depositNumber;

    const daEl = document.getElementById('promoDirectDepositAmt');
    if (daEl) daEl.innerText = promo.direct.depositAmount;

    const dfEl = document.getElementById('promoDirectFirstDeposit');
    if (dfEl) dfEl.innerText = promo.direct.firstDeposit;

    const trEl = document.getElementById('promoTeamRegister');
    if (trEl) trEl.innerText = promo.team.register;

    const tnEl = document.getElementById('promoTeamDepositNum');
    if (tnEl) tnEl.innerText = promo.team.depositNumber;

    const taEl = document.getElementById('promoTeamDepositAmt');
    if (taEl) taEl.innerText = promo.team.depositAmount;

    const tfEl = document.getElementById('promoTeamFirstDeposit');
    if (tfEl) tfEl.innerText = promo.team.firstDeposit;

    // Promotion Data 2x2 Grid Updates
    if (history && history.length > 0) {
      const sumCommission = history.reduce((acc, h) => acc + (parseFloat(h.commissionPoint) || 0), 0);
      const sumDirectSub = history.reduce((acc, h) => acc + (parseInt(h.direct?.register, 10) || 0), 0);
      const sumTeamSub = history.reduce((acc, h) => acc + (parseInt(h.team?.register, 10) || 0), 0);

      const weekCommEl = document.getElementById('promoWeekCommission');
      if (weekCommEl) weekCommEl.innerText = sumCommission.toFixed(2);

      const totCommEl = document.getElementById('promoTotalCommission');
      if (totCommEl) totCommEl.innerText = sumCommission.toFixed(2);

      const totDirectEl = document.getElementById('promoTotalDirectSub');
      if (totDirectEl) totDirectEl.innerText = sumDirectSub;

      const totTeamEl = document.getElementById('promoTotalTeamSub');
      if (totTeamEl) totTeamEl.innerText = sumTeamSub;
    }

    // Initialize Subordinate records with current filter date (always yesterday)
    const maxSub = getYesterdayDateObj();
    const initialDate = promo?.yesterdayDate || maxSub.str;
    const subFilterDateEl = document.getElementById('subFilterDate');
    if (subFilterDateEl && (!subFilterDateEl.innerText || subFilterDateEl.innerText.trim() === '2026-11-16' || subFilterDateEl.innerText.trim() === '--')) {
      subFilterDateEl.innerText = initialDate;
    }
    const activeDate = document.getElementById('subFilterDate')?.innerText.trim() || initialDate;
    renderSubordinateCards(activeDate);
    applySubordinateFilters(false);
  }

  window.syncPromotion = syncPromotion;

  function updateUI() {
    // Balance displays
    document.querySelectorAll('.js-user-balance').forEach(el => {
      el.innerText = '₹' + parseFloat(state.user.balance).toFixed(2);
    });
    // UID
    document.querySelectorAll('.js-user-uid').forEach(el => {
      el.innerText = state.user.uid;
    });
    // Phone
    document.querySelectorAll('.js-user-phone').forEach(el => {
      el.innerText = state.user.phone;
    });
    // Invite Code
    document.querySelectorAll('.js-user-invite').forEach(el => {
      el.innerText = state.user.inviteCode;
    });
  }

  // --- WinGo Engine Sync ---
  let lastPeriod = null;
  async function syncWinGo() {
    const res = await api('/api/wingo/status');
    if (res.code === 0 && res.data) {
      state.wingo.period = res.data.period;
      state.wingo.timeRemaining = res.data.timeRemaining;
      state.wingo.history = res.data.history || [];

      // Update timer elements
      const min = Math.floor(state.wingo.timeRemaining / 60);
      const sec = state.wingo.timeRemaining % 60;
      const secStr = String(sec).padStart(2, '0');
      const minStr = String(min).padStart(2, '0');

      const t1 = document.getElementById('timerSec1');
      const t2 = document.getElementById('timerSec2');
      if (t1 && t2) {
        t1.innerText = secStr[0];
        t2.innerText = secStr[1];
        if (state.wingo.timeRemaining <= 5) {
          t1.classList.add('urgent');
          t2.classList.add('urgent');
        } else {
          t1.classList.remove('urgent');
          t2.classList.remove('urgent');
        }
      }

      const pEl = document.getElementById('wingoActivePeriod');
      if (pEl) pEl.innerText = state.wingo.period;

      // Render recent balls bar
      const ballsRow = document.getElementById('recentBallsRow');
      if (ballsRow && state.wingo.history.length > 0) {
        ballsRow.innerHTML = state.wingo.history.slice(0, 5).map(h => `
          <div class="sw-ball ${h.color}">${h.number}</div>
        `).join('');
      }

      // Render History Table
      const historyBody = document.getElementById('wingoHistoryTbody');
      if (historyBody) {
        historyBody.innerHTML = state.wingo.history.slice(0, 10).map(h => `
          <tr>
            <td>${h.period}</td>
            <td><div class="sw-ball ${h.color}" style="width:24px; height:24px; font-size:12px; margin:auto;">${h.number}</div></td>
            <td>${h.size}</td>
            <td style="text-transform:capitalize;">${h.color.replace('-', '/')}</td>
          </tr>
        `).join('');
      }

      // Check if round resolved
      if (lastPeriod && lastPeriod !== state.wingo.period) {
        syncUser();
        syncMyBets();
      }
      lastPeriod = state.wingo.period;
    }
  }

  // --- My Bets Sync ---
  async function syncMyBets() {
    const res = await api('/api/wingo/my-bets');
    if (res.code === 0 && res.data) {
      state.myBets = res.data.list || [];
      const tbody = document.getElementById('myBetsTbody');
      if (tbody) {
        if (state.myBets.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4" style="color:var(--sw-text-muted); padding:20px;">No betting records yet</td></tr>`;
        } else {
          tbody.innerHTML = state.myBets.map(b => {
            let statusBadge = `<span style="color:var(--sw-primary-purple); font-weight:700;">PENDING</span>`;
            if (b.status === 'WON') statusBadge = `<span style="color:var(--sw-green); font-weight:700;">+₹${b.winAmount.toFixed(2)}</span>`;
            if (b.status === 'LOST') statusBadge = `<span style="color:var(--sw-red); font-weight:700;">LOST</span>`;
            return `
              <tr>
                <td>${b.period}</td>
                <td><b style="text-transform:uppercase;">${b.selection}</b></td>
                <td>₹${b.amount}</td>
                <td>${statusBadge}</td>
              </tr>
            `;
          }).join('');
        }
      }
    }
  }

  // --- Betting Modal Sheet ---
  window.openBetModal = function (type, selection) {
    state.currentBet.type = type;
    state.currentBet.selection = selection;
    state.currentBet.multiplier = 1;

    const modal = document.getElementById('betModal');
    const title = document.getElementById('betSheetTitle');
    if (title) title.innerText = `Select ${selection.toUpperCase()}`;
    updateBetCalc();
    modal.classList.add('open');
  };

  window.closeBetModal = function () {
    const modal = document.getElementById('betModal');
    if (modal) modal.classList.remove('open');
  };

  window.setBetUnit = function (amt, btn) {
    state.currentBet.unitAmount = amt;
    document.querySelectorAll('.sw-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    updateBetCalc();
  };

  window.adjustMultiplier = function (delta) {
    state.currentBet.multiplier = Math.max(1, state.currentBet.multiplier + delta);
    updateBetCalc();
  };

  function updateBetCalc() {
    const total = state.currentBet.unitAmount * state.currentBet.multiplier;
    const stepVal = document.getElementById('stepVal');
    if (stepVal) stepVal.innerText = 'x' + state.currentBet.multiplier;
    const confirmBtn = document.getElementById('btnConfirmBet');
    if (confirmBtn) confirmBtn.innerText = `Total Amount ₹${total.toFixed(2)}`;
  }

  window.confirmBet = async function () {
    const total = state.currentBet.unitAmount * state.currentBet.multiplier;
    if (state.user.balance < total) {
      alert('Insufficient balance. Please recharge.');
      return;
    }

    const res = await api('/api/wingo/bet', {
      amount: total,
      selectType: state.currentBet.type,
      selection: state.currentBet.selection
    }, 'POST');

    if (res.code === 0) {
      closeBetModal();
      state.user.balance = res.data.newBalance;
      updateUI();
      syncMyBets();
      alert(`Bet of ₹${total} placed successfully on ${state.currentBet.selection.toUpperCase()}!`);
    } else {
      alert(res.msg || 'Bet failed');
    }
  };

  // --- Registration Handler ---
  window.handleRegister = async function (e) {
    if (e) e.preventDefault();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const inviteCode = document.getElementById('regInviteCode').value.trim() || '36467291608';

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      alert('Please enter password');
      return;
    }

    let res = await api('/api/user/register', { phone, password, inviteCode }, 'POST');
    if (res && res.offline) {
      const uid = Math.floor(10000000 + Math.random() * 90000000).toString();
      const newInv = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const newUser = { phone, password, uid, nickName: 'MEMBER' + uid, balance: 1000.00, inviteCode: newInv };
      try {
        const list = JSON.parse(localStorage.getItem('shreewin_local_users') || '[]');
        list.unshift(newUser);
        localStorage.setItem('shreewin_local_users', JSON.stringify(list));
      } catch (err) {}
      res = { code: 0, data: newUser };
    }
    if (res.code === 0) {
      localStorage.removeItem('shreewin_logged_out');
      localStorage.setItem('shreewin_token', (res.data && res.data.token) || ('TOKEN_' + Date.now()));
      localStorage.setItem('shreewin_last_phone', res.data.phone || phone);
      alert('Registration successful! Welcome to Shreewin.');
      state.user.phone = res.data.phone;
      state.user.uid = res.data.uid;
      state.user.balance = res.data.balance;
      state.user.inviteCode = res.data.inviteCode;
      updateUI();
      window.location.hash = '#/home';
    } else {
      alert(res.msg || 'Registration failed');
    }
  };

  // --- Login Handler ---
  window.handleLogin = async function (e) {
    if (e) e.preventDefault();
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    const res = await api('/api/user/login', { phone, password }, 'POST');
    if (res.code === 0) {
      alert('Login successful!');
      syncUser();
      window.location.hash = '#/home';
    } else {
      alert(res.msg || 'Login failed');
    }
  };

  // --- Wallet Recharge Simulation ---
  window.handleRecharge = async function (amount) {
    const res = await api('/api/wallet/recharge', { amount, channel: 'Fast UPI' }, 'POST');
    if (res.code === 0) {
      alert(`₹${amount} Recharge Successful! Your balance is updated.`);
      state.user.balance = res.data.balance;
      updateUI();
    }
  };

  // --- Wallet Withdrawal Simulation ---
  window.handleWithdraw = async function (e) {
    if (e) e.preventDefault();
    const amount = parseFloat(document.getElementById('withAmount').value);
    const upiId = document.getElementById('withUpi').value.trim();

    if (!amount || amount < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }
    if (!upiId) {
      alert('Please enter UPI ID or Bank Account');
      return;
    }

    const res = await api('/api/wallet/withdraw', { amount, upiId }, 'POST');
    if (res.code === 0) {
      alert(`Withdrawal request for ₹${amount} submitted successfully!`);
      state.user.balance = res.data.balance;
      updateUI();
      document.getElementById('withAmount').value = '';
    } else {
      alert(res.msg || 'Withdrawal failed');
    }
  };

  // --- Official ARPay / Deposit / Withdraw Handlers ---
  let currentWithdrawMethod = 'bank';
  let currentDepositMethod = 'arpay';

  window.setWithdrawMethod = function(method) {
    currentWithdrawMethod = method;
    document.querySelectorAll('#view-withdraw .ar-method-item').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('withMethod' + method.charAt(0).toUpperCase() + method.slice(1));
    if (target) target.classList.add('active');

    const label = document.getElementById('withFieldLabel');
    const input = document.getElementById('realWithdrawTarget');
    if (label && input) {
      if (method === 'bank') {
        label.innerText = 'Bank Account Number & IFSC';
        input.placeholder = 'e.g. 9876543210123 / SBIN0001234';
      } else if (method === 'upi') {
        label.innerText = 'UPI ID (VPA)';
        input.placeholder = 'e.g. user@paytm / 9876543210@upi';
      } else if (method === 'usdt') {
        label.innerText = 'USDT TRC20 / BEP20 Wallet Address';
        input.placeholder = 'e.g. Txyz... (TRC20 Address)';
      }
    }
  };

  window.setDepositMethod = function(method) {
    currentDepositMethod = method;
    document.querySelectorAll('#view-deposit .ar-method-item').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('depMethod' + method.charAt(0).toUpperCase() + method.slice(1));
    if (target) target.classList.add('active');
  };

  window.selectDepositAmount = function(amt) {
    document.querySelectorAll('.ar-chip').forEach(c => c.classList.remove('active'));
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
    const input = document.getElementById('realDepositAmount');
    if (input) input.value = amt;
    const btnAmt = document.getElementById('btnDepAmt');
    if (btnAmt) btnAmt.innerText = Number(amt).toLocaleString('en-IN');
  };

  window.executeDepositAction = async function() {
    const input = document.getElementById('realDepositAmount');
    const amt = parseFloat(input?.value || 1000);
    if (!amt || amt < 100) {
      alert('Minimum deposit amount is ₹100.');
      return;
    }
    const res = await api('/api/wallet/recharge', { amount: amt, channel: currentDepositMethod }, 'POST');
    if (res.code === 0) {
      alert(`Deposit of ₹${amt.toLocaleString('en-IN')} Successful! Your balance has been updated.`);
      state.user.balance = res.data.balance;
      updateUI();
    } else {
      alert(res.msg || 'Deposit failed');
    }
  };

  window.executeWithdrawAction = async function() {
    const amtInput = document.getElementById('realWithdrawAmount');
    const targetInput = document.getElementById('realWithdrawTarget');
    const amt = parseFloat(amtInput?.value || 0);
    const target = targetInput?.value?.trim() || '';

    if (!amt || amt < 100) {
      alert('Minimum withdrawal amount is ₹100.');
      return;
    }
    if (!target) {
      alert('Please enter your payout account details.');
      return;
    }

    const res = await api('/api/wallet/withdraw', { amount: amt, channel: currentWithdrawMethod, account: target }, 'POST');
    if (res.code === 0) {
      alert(`Withdrawal Request Submitted Successfully!\nAmount: ₹${amt.toFixed(2)}\nStatus: Processing (approx. 5-10 mins)`);
      state.user.balance = res.data.balance;
      updateUI();
      if (amtInput) amtInput.value = '';
      if (targetInput) targetInput.value = '';
    } else {
      alert(res.msg || 'Withdrawal failed. Insufficient balance.');
    }
  };

  // --- Copy Referral Link ---
  window.copyInviteLink = function () {
    const link = `${window.location.origin}/#/register?invitationCode=${state.user.inviteCode || '36467291608'}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Invitation link copied to clipboard:\n' + link);
    }).catch(() => {
      alert('Copy: ' + link);
    });
  };

  window.copyInviteCode = function () {
    const code = state.user.inviteCode || '36467291608';
    navigator.clipboard.writeText(code).then(() => {
      alert('Invitation code copied: ' + code);
    }).catch(() => {
      alert('Code: ' + code);
    });
  };

  // --- Subordinate Data Helpers & Bottom Sheet Pickers ---
  function computeSingleDayOverview(key, levelFilter) {
    const lvl = Number(levelFilter || 0);
    const earn = getRecordForDate(key);
    const rng = makeDailyRng('SHREEWIN_DAILY_OVERVIEW_' + key + (lvl > 1 ? '_L' + lvl : ''));
    const randInt = (min, max) => min + Math.floor(rng() * (max - min + 1));

    let depositNumber = (earn.direct?.depositNumber || 0) + (earn.team?.depositNumber || 0);
    let firstDepositCount = (earn.direct?.firstDeposit || 0) + (earn.team?.firstDeposit || 0);
    let depositAmount = (earn.direct?.depositAmount || 0) + (earn.team?.depositAmount || 0);

    if (lvl >= 2) {
      const ratios = { 2: 0.45, 3: 0.32, 4: 0.28, 5: 0.25, 6: 0.22 };
      const f = ratios[lvl] || 0.22;
      depositNumber = Math.max(12, Math.round(depositNumber * f) + randInt(-2, 3));
      firstDepositCount = Math.max(8, depositNumber - randInt(2, 6));
      depositAmount = Math.max(8000, depositNumber * 500 + 2000 + randInt(500, 2500));
    }

    const numberOfBettors = depositNumber + randInt(10, 20);
    const totalBet = +(depositAmount * (3.1 + rng() * 0.85)).toFixed(2);
    const firstDepositAmount = Math.max(5000, depositAmount - randInt(Math.round(depositAmount * 0.14), Math.round(depositAmount * 0.24)));

    const cardSpecs = lvl >= 1
      ? [
          { prefix: String(630 + lvl), level: lvl },
          { prefix: String(631 + (lvl % 2)), level: lvl },
          { prefix: String(632 + (lvl % 2)), level: lvl },
          { prefix: String(631 + (lvl % 3)), level: lvl },
          ...(lvl === 1 ? [{ prefix: '632', level: 1 }, { prefix: '630', level: 1 }] : [])
        ]
      : [
          { prefix: '630', level: 1 },
          { prefix: '631', level: 1 },
          { prefix: '632', level: 1 },
          { prefix: '631', level: 1 },
          { prefix: '633', level: 2 },
          { prefix: '634', level: 2 }
        ];

    const usedUids = new Set();
    const records = cardSpecs.map((sp) => {
      let uid = '';
      do {
        uid = sp.prefix + String(randInt(100, 999));
      } while (usedUids.has(uid));
      usedUids.add(uid);
      const deposit = randInt(1000, 5000);
      const bet = +(deposit * (3 + rng())).toFixed(2);
      const commission = +(bet * 0.006).toFixed(2);
      return { uid, level: String(sp.level), deposit, bet, commission, firstDeposit: true, time: key };
    });

    return {
      dateKey: key,
      summary: {
        depositNumber,
        depositAmount,
        numberOfBettors,
        totalBet,
        firstDepositCount,
        firstDepositAmount
      },
      records
    };
  }

  // --- 19-Day Cumulative Overview for "All" (November 1 to November 19) ---
  function get19DaysCumulativeOverview() {
    const maxSub = getYesterdayDateObj();
    const dates = [];
    for (let i = 0; i < 19; i++) {
      const d = new Date(maxSub.year, maxSub.month - 1, maxSub.day - i);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${d.getFullYear()}-${m}-${day}`);
    }

    const summary = {
      depositNumber: 0,
      depositAmount: 0,
      numberOfBettors: 0,
      totalBet: 0,
      firstDepositCount: 0,
      firstDepositAmount: 0
    };
    const records = [];

    for (let i = 0; i < dates.length; i++) {
      const dk = dates[i];
      const dayOv = computeSingleDayOverview(dk, 0);
      summary.depositNumber += dayOv.summary.depositNumber;
      summary.depositAmount += dayOv.summary.depositAmount;
      summary.numberOfBettors += dayOv.summary.numberOfBettors;
      summary.totalBet = +(summary.totalBet + dayOv.summary.totalBet).toFixed(2);
      summary.firstDepositCount += dayOv.summary.firstDepositCount;
      summary.firstDepositAmount += dayOv.summary.firstDepositAmount;
      // Gather records from the 19 days
      records.push(...dayOv.records);
    }

    return {
      dateKey: maxSub.str,
      summary,
      records
    };
  }

  // --- Subordinate Cards Dynamic Renderer (Matching 6eclub Overview Architecture) ---
  function renderSubordinateCards(dateStr, tierLevel) {
    const listEl = document.getElementById('subordinateRecordsList');
    if (!listEl) return;

    let ov;
    if (!tierLevel || tierLevel === 'All') {
      ov = get19DaysCumulativeOverview();
    } else {
      let lvlNum = 1;
      if (tierLevel.startsWith('Tier ')) {
        lvlNum = parseInt(tierLevel.replace('Tier ', '').trim(), 10) || 1;
      }
      ov = computeSingleDayOverview(dateStr, lvlNum);
    }

    const query = (document.getElementById('subordinateSearchInput')?.value || '').trim().toLowerCase();

    let filteredRecords = ov.records;
    if (query) {
      filteredRecords = filteredRecords.filter(r => r.uid.toLowerCase().includes(query));
    }

    const emptyState = document.getElementById('subordinateEmptyState');
    if (!filteredRecords.length) {
      listEl.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    let html = '';
    filteredRecords.forEach(c => {
      html += `
        <div class="subordinate-card" data-uid="${c.uid}" data-level="${c.level}" data-deposit="${c.deposit}" data-bet="${c.bet}" data-comm="${c.commission}">
          <div class="sub-card-header">
            <span class="sub-card-uid">UID:${c.uid}</span>
            <svg class="sub-copy-icon" onclick="copySubUID('${c.uid}')" viewBox="0 0 24 24">
              <rect x="8" y="8" width="12" height="12" rx="2" stroke="#E3EFFF" stroke-width="2" fill="none"/>
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="#E3EFFF" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="sub-card-body">
            <div class="sub-card-row">
              <span class="sub-row-label">Level</span>
              <span class="sub-row-val sub-val-white">${c.level}</span>
            </div>
            <div class="sub-card-row">
              <span class="sub-row-label">Deposit amount</span>
              <span class="sub-row-val sub-val-orange">${c.deposit}</span>
            </div>
            <div class="sub-card-row">
              <span class="sub-row-label">Bet amount</span>
              <span class="sub-row-val sub-val-orange">${c.bet}</span>
            </div>
            <div class="sub-card-row">
              <span class="sub-row-label">Commission</span>
              <span class="sub-row-val sub-val-orange">${c.commission}</span>
            </div>
            <div class="sub-card-row">
              <span class="sub-row-label">Time</span>
              <span class="sub-row-val card-date-time">${c.time}</span>
            </div>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  // --- Subordinate Data Helpers & Bottom Sheet Pickers ---
  window.renderDatePickerWheels = function (targetYear, targetMonth, targetDay) {
    const maxSub = getYesterdayDateObj();

    targetYear = parseInt(targetYear, 10) || maxSub.year;
    targetMonth = parseInt(targetMonth, 10) || maxSub.month;
    targetDay = parseInt(targetDay, 10) || maxSub.day;

    // Strictly enforce 1-Day Delay (Tier 1 never shows today or future dates)
    if (targetYear > maxSub.year) targetYear = maxSub.year;
    if (targetYear < 2022) targetYear = 2022;

    const maxMonth = (targetYear === maxSub.year) ? maxSub.month : 12;
    if (targetMonth > maxMonth) targetMonth = maxMonth;
    if (targetMonth < 1) targetMonth = 1;

    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const maxDay = (targetYear === maxSub.year && targetMonth === maxSub.month) ? maxSub.day : daysInMonth;
    if (targetDay > maxDay) targetDay = maxDay;
    if (targetDay < 1) targetDay = 1;

    // 1. Year Column (strictly up to maxSub.year)
    const yearWheel = document.getElementById('dateWheelYear');
    if (yearWheel) {
      let html = '<div class="sub-picker-wheel-pad"></div>';
      for (let y = 2022; y <= maxSub.year; y++) {
        const active = (y === targetYear) ? ' active' : '';
        html += `<div class="sub-picker-item${active}" data-val="${y}" onclick="selectDateWheelItem(this, 'year')">${y}</div>`;
      }
      html += '<div class="sub-picker-wheel-pad"></div>';
      yearWheel.innerHTML = html;
    }

    // 2. Month Column (strictly up to maxMonth)
    const monthWheel = document.getElementById('dateWheelMonth');
    if (monthWheel) {
      let html = '<div class="sub-picker-wheel-pad"></div>';
      for (let m = 1; m <= maxMonth; m++) {
        const mStr = String(m).padStart(2, '0');
        const active = (m === targetMonth) ? ' active' : '';
        html += `<div class="sub-picker-item${active}" data-val="${mStr}" onclick="selectDateWheelItem(this, 'month')">${mStr}</div>`;
      }
      html += '<div class="sub-picker-wheel-pad"></div>';
      monthWheel.innerHTML = html;
    }

    // 3. Day Column (strictly up to maxDay)
    const dayWheel = document.getElementById('dateWheelDay');
    if (dayWheel) {
      let html = '<div class="sub-picker-wheel-pad"></div>';
      for (let d = 1; d <= maxDay; d++) {
        const dStr = String(d).padStart(2, '0');
        const active = (d === targetDay) ? ' active' : '';
        html += `<div class="sub-picker-item${active}" data-val="${dStr}" onclick="selectDateWheelItem(this, 'day')">${dStr}</div>`;
      }
      html += '<div class="sub-picker-wheel-pad"></div>';
      dayWheel.innerHTML = html;
    }

    // Synchronously scroll active items into center view
    function scrollToActive(wheelId) {
      const wheel = document.getElementById(wheelId);
      if (!wheel) return;
      const activeItem = wheel.querySelector('.sub-picker-item.active');
      if (activeItem) {
        const targetScroll = activeItem.offsetTop - (wheel.clientHeight / 2) + (activeItem.clientHeight / 2);
        wheel.scrollTop = targetScroll;
        try { activeItem.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {}
      }
    }

    ['dateWheelYear', 'dateWheelMonth', 'dateWheelDay'].forEach(scrollToActive);
    setTimeout(() => {
      ['dateWheelYear', 'dateWheelMonth', 'dateWheelDay'].forEach(scrollToActive);
    }, 50);
  };

  window.openTierPicker = function () {
    const overlay = document.getElementById('subPickerOverlay');
    const sheet = document.getElementById('tierPickerSheet');
    if (overlay && sheet) {
      overlay.classList.add('show');
      sheet.classList.add('show');

      const currentTier = document.getElementById('subFilterType')?.innerText.trim() || 'All';
      const items = sheet.querySelectorAll('.sub-picker-item');
      items.forEach(item => {
        if (item.getAttribute('data-val') === currentTier) {
          item.classList.add('active');
          setTimeout(() => item.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
        } else {
          item.classList.remove('active');
        }
      });
    }
  };

  window.selectTierItem = function (el) {
    const parent = el.parentElement;
    parent.querySelectorAll('.sub-picker-item').forEach(it => it.classList.remove('active'));
    el.classList.add('active');
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  window.confirmTierPicker = function () {
    const active = document.querySelector('#tierPickerSheet .sub-picker-item.active');
    const val = active ? active.getAttribute('data-val') : 'All';
    const subFilterType = document.getElementById('subFilterType');
    if (subFilterType) subFilterType.innerText = val;
    window.closeSubPickers();
    window.triggerSubordinateLoading();
  };

  window.openDatePicker = function () {
    const overlay = document.getElementById('subPickerOverlay');
    const sheet = document.getElementById('datePickerSheet');
    if (overlay && sheet) {
      overlay.classList.add('show');
      sheet.classList.add('show');

      const maxSub = getYesterdayDateObj();
      const currentDate = document.getElementById('subFilterDate')?.innerText.trim() || maxSub.str;
      const parts = currentDate.split('-');
      const year = parseInt(parts[0], 10) || maxSub.year;
      const month = parseInt(parts[1], 10) || maxSub.month;
      const day = parseInt(parts[2], 10) || maxSub.day;

      window.renderDatePickerWheels(year, month, day);
    }
  };

  window.selectDateWheelItem = function (el, type) {
    const parent = el.parentElement;
    parent.querySelectorAll('.sub-picker-item').forEach(it => it.classList.remove('active'));
    el.classList.add('active');
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });

    // When Year or Month changes, update dependent wheels to strictly forbid future dates
    if (type === 'year' || type === 'month') {
      const maxSub = getYesterdayDateObj();
      const yearVal = parseInt(document.querySelector('#dateWheelYear .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.year), 10);
      const monthVal = parseInt(document.querySelector('#dateWheelMonth .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.month), 10);
      const dayVal = parseInt(document.querySelector('#dateWheelDay .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.day), 10);

      window.renderDatePickerWheels(yearVal, monthVal, dayVal);
    }
  };

  window.confirmDatePicker = function () {
    const maxSub = getYesterdayDateObj();
    let year = parseInt(document.querySelector('#dateWheelYear .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.year), 10);
    let month = parseInt(document.querySelector('#dateWheelMonth .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.month), 10);
    let day = parseInt(document.querySelector('#dateWheelDay .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.day), 10);

    // Strictly enforce 1-Day Delay
    if (year > maxSub.year) year = maxSub.year;
    const maxMonth = (year === maxSub.year) ? maxSub.month : 12;
    if (month > maxMonth) month = maxMonth;
    const daysInMonth = new Date(year, month, 0).getDate();
    const maxDay = (year === maxSub.year && month === maxSub.month) ? maxSub.day : daysInMonth;
    if (day > maxDay) day = maxDay;

    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const selectedDate = `${year}-${mStr}-${dStr}`;

    const subFilterDate = document.getElementById('subFilterDate');
    if (subFilterDate) subFilterDate.innerText = selectedDate;

    // Dismiss bottom sheet and overlay
    window.closeSubPickers();

    // Trigger loading animation
    window.triggerSubordinateLoading();
  };

  window.closeSubPickers = function () {
    document.getElementById('subPickerOverlay')?.classList.remove('show');
    document.getElementById('tierPickerSheet')?.classList.remove('show');
    document.getElementById('datePickerSheet')?.classList.remove('show');
    document.getElementById('commissionDetailSheet')?.classList.remove('show');
  };

  // Wheel scroll snap active detector
  let scrollDebounceTimer = null;
  window.handleWheelScroll = function (wheelEl) {
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
      const items = wheelEl.querySelectorAll('.sub-picker-item');
      const wheelRect = wheelEl.getBoundingClientRect();
      const centerY = wheelRect.top + wheelRect.height / 2;

      let closestItem = null;
      let minDistance = Infinity;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const dist = Math.abs(centerY - itemCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      });

      if (closestItem && minDistance < 35 && !closestItem.classList.contains('active')) {
        items.forEach(it => it.classList.remove('active'));
        closestItem.classList.add('active');

        // Check if wheel is year or month to dynamically clamp dependent wheels
        const wheelId = wheelEl.id;
        if (wheelId === 'dateWheelYear' || wheelId === 'dateWheelMonth') {
          const maxSub = getYesterdayDateObj();
          const y = parseInt(document.querySelector('#dateWheelYear .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.year), 10);
          const m = parseInt(document.querySelector('#dateWheelMonth .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.month), 10);
          const d = parseInt(document.querySelector('#dateWheelDay .sub-picker-item.active')?.getAttribute('data-val') || String(maxSub.day), 10);
          window.renderDatePickerWheels(y, m, d);
        }
      }
    }, 80);
  };

  let subLoadingTimer = null;

  function resetSubordinateToZero() {
    const depNumEl = document.getElementById('subDepositNum');
    const depAmtEl = document.getElementById('subDepositAmt');
    const bettorsEl = document.getElementById('subBettors');
    const totalBetEl = document.getElementById('subTotalBet');
    const firstDepNumEl = document.getElementById('subFirstDepositNum');
    const firstDepAmtEl = document.getElementById('subFirstDepositAmt');

    if (depNumEl) depNumEl.innerText = '0';
    if (depAmtEl) depAmtEl.innerText = '0';
    if (bettorsEl) bettorsEl.innerText = '0';
    if (totalBetEl) totalBetEl.innerText = '0';
    if (firstDepNumEl) firstDepNumEl.innerText = '0';
    if (firstDepAmtEl) firstDepAmtEl.innerText = '0';

    const listEl = document.getElementById('subordinateRecordsList');
    if (listEl) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
    }
    const emptyState = document.getElementById('subordinateEmptyState');
    if (emptyState) emptyState.style.display = 'none';
  }

  window.triggerSubordinateLoading = function (onComplete) {
    if (subLoadingTimer) {
      clearTimeout(subLoadingTimer);
      subLoadingTimer = null;
    }

    // 1. Immediately reset summary numbers to 0 and empty the records list
    resetSubordinateToZero();

    // 2. Show the inline circular loading spinner (exact match to video)
    const spinner = document.getElementById('subordinateLoadingSpinner');
    if (spinner) {
      spinner.style.display = 'flex';
    }

    // 3. Keep loading active for 0.75s (within 0.5s - 1.0s)
    subLoadingTimer = setTimeout(() => {
      if (spinner) {
        spinner.style.display = 'none';
      }
      const listEl = document.getElementById('subordinateRecordsList');
      if (listEl) {
        listEl.style.display = 'flex';
      }
      // 4. Populate real calculated data
      window.populateSubordinateData();

      if (typeof onComplete === 'function') {
        onComplete();
      }
      subLoadingTimer = null;
    }, 750);
  };

  window.populateSubordinateData = function () {
    const listEl = document.getElementById('subordinateRecordsList');
    if (listEl) {
      listEl.style.display = 'flex';
    }

    const tierFilter = (document.getElementById('subFilterType')?.innerText || 'All').trim();
    const maxSub = getYesterdayDateObj();
    const selectedDate = (document.getElementById('subFilterDate')?.innerText || maxSub.str).trim();

    let ov;
    if (tierFilter === 'All') {
      ov = get19DaysCumulativeOverview();
    } else {
      let lvlNum = 1;
      if (tierFilter.startsWith('Tier ')) {
        lvlNum = parseInt(tierFilter.replace('Tier ', '').trim(), 10) || 1;
      }
      ov = computeSingleDayOverview(selectedDate, lvlNum);
    }

    // Update Summary Card (Matching 6eclub Invitees Overview calculations)
    const depNumEl = document.getElementById('subDepositNum');
    const depAmtEl = document.getElementById('subDepositAmt');
    const bettorsEl = document.getElementById('subBettors');
    const totalBetEl = document.getElementById('subTotalBet');
    const firstDepNumEl = document.getElementById('subFirstDepositNum');
    const firstDepAmtEl = document.getElementById('subFirstDepositAmt');

    if (depNumEl) depNumEl.innerText = ov.summary.depositNumber;
    if (depAmtEl) depAmtEl.innerText = ov.summary.depositAmount;
    if (bettorsEl) bettorsEl.innerText = ov.summary.numberOfBettors;
    if (totalBetEl) totalBetEl.innerText = ov.summary.totalBet;
    if (firstDepNumEl) firstDepNumEl.innerText = ov.summary.firstDepositCount;
    if (firstDepAmtEl) firstDepAmtEl.innerText = ov.summary.firstDepositAmount;

    renderSubordinateCards(selectedDate, tierFilter);
  };

  window.applySubordinateFilters = function (showLoading = true) {
    if (showLoading) {
      window.triggerSubordinateLoading();
    } else {
      window.populateSubordinateData();
    }
  };

  // --- Commission Detail Bottom Sheet ---
  window.openCommissionDetailSheet = function () {
    const overlay = document.getElementById('subPickerOverlay');
    const sheet = document.getElementById('commissionDetailSheet');
    const listEl = document.getElementById('commissionHistoryList');
    if (!overlay || !sheet || !listEl) return;

    overlay.classList.add('show');
    sheet.classList.add('show');

    const history = (promotionHistory && promotionHistory.length > 0) ? promotionHistory : generateClient7DayHistory();
    let html = '';
    history.forEach((h, idx) => {
      const active = (idx === 0) ? ' active' : '';
      html += `
        <div class="comm-history-item${active}" onclick="selectDateFromCommissionHistory('${h.date}')">
          <div class="comm-hist-left">
            <span class="comm-hist-date">${h.date}</span>
            <span class="comm-hist-subs">Direct: ₹${parseFloat(h.direct.commission).toFixed(2)} | Team: ₹${parseFloat(h.team.commission).toFixed(2)}</span>
          </div>
          <div class="comm-hist-right">
            <span class="comm-hist-amount">₹${parseFloat(h.commissionPoint).toFixed(2)}</span>
            <span class="comm-hist-tag">Combined Total</span>
          </div>
        </div>
      `;
    });
    listEl.innerHTML = html;
  };

  window.selectDateFromCommissionHistory = function (dateStr) {
    window.closeSubPickers();
    window.location.hash = '#/subordinate-data';
    const subFilterDate = document.getElementById('subFilterDate');
    if (subFilterDate) subFilterDate.innerText = dateStr;
    window.triggerSubordinateLoading();
  };

  window.filterSubordinates = function () {
    const tierFilter = (document.getElementById('subFilterType')?.innerText || 'All').trim();
    const maxSub = getYesterdayDateObj();
    const selectedDate = (document.getElementById('subFilterDate')?.innerText || maxSub.str).trim();
    renderSubordinateCards(selectedDate, tierFilter);
  };

  window.copySubUID = function (uid) {
    navigator.clipboard.writeText(uid).then(() => {
      const toast = document.createElement('div');
      toast.innerText = 'Copied: UID ' + uid;
      toast.style.position = 'fixed';
      toast.style.bottom = '100px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(0, 0, 0, 0.85)';
      toast.style.color = '#ffffff';
      toast.style.padding = '8px 18px';
      toast.style.borderRadius = '20px';
      toast.style.fontSize = '13px';
      toast.style.zIndex = '9999';
      toast.style.transition = 'opacity 0.3s';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    }).catch(() => {
      alert('UID: ' + uid);
    });
  };

  // --- Records Tab Switcher in WinGo ---
  window.switchRecTab = function (tabName, btn) {
    document.querySelectorAll('.sw-rec-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-game-history').style.display = tabName === 'history' ? 'block' : 'none';
    document.getElementById('tab-my-bets').style.display = tabName === 'mybets' ? 'block' : 'none';
  };

  // --- Init ---
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', () => {
    const maxSub = getYesterdayDateObj();
    const subFilterDateEl = document.getElementById('subFilterDate');
    if (subFilterDateEl) subFilterDateEl.innerText = maxSub.str;

    try {
      const remembered = JSON.parse(localStorage.getItem('shreewin_remembered') || 'null');
      const lastPhone = localStorage.getItem('shreewin_last_phone') || '';
      const phoneInp = document.getElementById('loginPhone');
      const pwdInp = document.getElementById('loginPassword');
      const rememberBox = document.getElementById('rememberPwd');
      if (phoneInp && ((remembered && remembered.phone) || (!isLoggedIn() && lastPhone))) {
        phoneInp.value = (remembered && remembered.phone) ? remembered.phone : lastPhone;
      }
      if (pwdInp && remembered && remembered.password) {
        pwdInp.value = remembered.password;
      }
      if (rememberBox && remembered) {
        rememberBox.checked = true;
      }
      window.updateLoginBtnState();
    } catch (e) {}

    handleRoute();
    syncUser();
    syncPromotion();
    syncWinGo();
    syncMyBets();
    setInterval(syncWinGo, 1000);
    setInterval(syncPromotion, 60000); // Check and sync daily promotion data
  });
})();
