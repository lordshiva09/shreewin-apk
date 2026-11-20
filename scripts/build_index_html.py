import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    orig_html = f.read()

# Extract the SVG sprite node: <svg ... style="position: absolute; width: 0; height: 0" ... </svg>
svg_match = re.search(r'(<svg[^>]*style="position:\s*absolute;[^"]*"[^>]*>[\s\S]*?</svg>)', orig_html)
if not svg_match:
    print("Error: Could not find SVG sprite node in index.html")
    exit(1)

svg_sprite = svg_match.group(1)
print(f"Extracted SVG sprite: {len(svg_sprite)} bytes")

# App template
app_html = """
<div id="app-container">
  <!-- Top Header -->
  <header class="sw-header">
    <div class="sw-brand-text">SHREEWIN</div>
    <div class="sw-header-right">
      <span style="font-size:12px; font-weight:700; color:var(--sw-text-muted);" class="js-user-balance">₹10,000.00</span>
      <button class="sw-icon-btn" onclick="window.location.hash='#/wallet'">
        <img src="/assets/png/wallet_sel-tj6BSHob.png" alt="Wallet">
      </button>
      <button class="sw-icon-btn" onclick="alert('24/7 Customer Service: support@shreewin.vip')">
        <img src="/assets/png/icon_sevice-DVRmjUrR.png" alt="Service">
      </button>
    </div>
  </header>

  <!-- VIEW: REGISTER -->
  <main id="view-register" class="sw-view">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <button class="sw-icon-btn" onclick="window.location.hash='#/home'" style="font-size:18px;">← Back</button>
      <h3 style="font-size:17px; font-weight:700;">Register</h3>
      <img src="/assets/png/en-Bw55K-VV.png" style="width:24px; border-radius:4px;" alt="EN">
    </div>

    <div class="sw-banner-card" style="padding:14px; margin-bottom:18px;">
      <h2>Register your phone</h2>
      <p>Please enter phone number and password to register</p>
    </div>

    <form class="sw-form-card" onsubmit="handleRegister(event)">
      <div class="sw-input-group">
        <label class="sw-input-label">Phone Number</label>
        <div class="sw-input-wrap">
          <span class="sw-input-prefix">+91</span>
          <input type="tel" id="regPhone" class="sw-input" placeholder="Please enter the phone number" maxlength="10" required>
        </div>
      </div>

      <div class="sw-input-group">
        <label class="sw-input-label">Set Password</label>
        <div class="sw-input-wrap">
          <input type="password" id="regPassword" class="sw-input" placeholder="Set password (at least 6 characters)" required>
          <img src="/assets/png/eyeInvisible-NUKC6jpG.png" style="width:18px; opacity:0.6;" alt="eye">
        </div>
      </div>

      <div class="sw-input-group">
        <label class="sw-input-label">Confirm Password</label>
        <div class="sw-input-wrap">
          <input type="password" id="regPasswordConfirm" class="sw-input" placeholder="Confirm password" required>
        </div>
      </div>

      <div class="sw-input-group">
        <label class="sw-input-label">Invitation Code</label>
        <div class="sw-input-wrap">
          <input type="text" id="regInviteCode" class="sw-input" value="36467291608" placeholder="Please enter the invitation code">
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:8px; margin:14px 0; font-size:12px; color:var(--sw-text-muted);">
        <input type="checkbox" id="regAgree" checked required style="accent-color:var(--sw-primary-purple);">
        <label for="regAgree">I have read and agree to 【Privacy Agreement】</label>
      </div>

      <button type="submit" class="sw-btn-submit">Register</button>

      <div style="text-align:center; margin-top:16px; font-size:13px;">
        <span style="color:var(--sw-text-muted);">I have an account, </span>
        <a href="#/login" style="color:var(--sw-primary-purple); font-weight:700; text-decoration:none;">Log in</a>
      </div>
    </form>
  </main>

  <!-- VIEW: LOGIN -->
  <main id="view-login" class="sw-view">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <button class="sw-icon-btn" onclick="window.location.hash='#/home'" style="font-size:18px;">← Back</button>
      <h3 style="font-size:17px; font-weight:700;">Login</h3>
      <div style="width:24px;"></div>
    </div>

    <form class="sw-form-card" onsubmit="handleLogin(event)">
      <div class="sw-input-group">
        <label class="sw-input-label">Phone Number</label>
        <div class="sw-input-wrap">
          <span class="sw-input-prefix">+91</span>
          <input type="tel" id="loginPhone" class="sw-input" value="9876543210" placeholder="Please enter the phone number" required>
        </div>
      </div>

      <div class="sw-input-group">
        <label class="sw-input-label">Password</label>
        <div class="sw-input-wrap">
          <input type="password" id="loginPassword" class="sw-input" value="password123" placeholder="Please enter password" required>
        </div>
      </div>

      <button type="submit" class="sw-btn-submit">Log in</button>

      <div style="text-align:center; margin-top:16px; font-size:13px;">
        <span style="color:var(--sw-text-muted);">No account? </span>
        <a href="#/register?invitationCode=36467291608" style="color:var(--sw-primary-purple); font-weight:700; text-decoration:none;">Register now</a>
      </div>
    </form>
  </main>

  <!-- VIEW: HOME -->
  <main id="view-home" class="sw-view active">
    <!-- Banner Card -->
    <div class="sw-banner-card">
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; opacity:0.8; margin-bottom:4px;">Official Shreewin Platform</div>
      <h2>Win Go Lottery Arena</h2>
      <p>Guess Number, Color or Size to win up to 9X payout</p>
      <div style="margin-top:12px; display:flex; gap:10px;">
        <button class="sw-play-btn" onclick="window.location.hash='#/wingo'">Play Win Go 30s ↗</button>
        <button class="sw-play-btn" style="background:rgba(255,255,255,0.2); box-shadow:none;" onclick="window.location.hash='#/wallet'">Deposit</button>
      </div>
    </div>

    <!-- Notice Bar -->
    <div class="sw-notice-bar">
      <span class="sw-notice-speaker">📢</span>
      <div class="sw-notice-text">Notice: Congratulations Member 98***71 on winning ₹4,500 in Win Go 30s!</div>
    </div>

    <!-- Category Tabs -->
    <div class="sw-category-tabs">
      <div class="sw-cat-tab active">Lottery</div>
      <div class="sw-cat-tab">Mini Games</div>
      <div class="sw-cat-tab">Slots</div>
      <div class="sw-cat-tab">Live Casino</div>
      <div class="sw-cat-tab">PVC Cards</div>
    </div>

    <!-- Featured Games List -->
    <div class="sw-game-card" onclick="window.location.hash='#/wingo'">
      <div class="sw-game-info">
        <h3>Win Go 30s</h3>
        <p>30-second fast draw lottery with highest odds</p>
        <span class="sw-game-tag">⚡ Hot & Fast</span>
      </div>
      <button class="sw-play-btn">PLAY</button>
    </div>

    <div class="sw-game-card" onclick="window.location.hash='#/wingo'">
      <div class="sw-game-info">
        <h3>Win Go 1Min</h3>
        <p>Traditional 1 minute period color game</p>
        <span class="sw-game-tag">🔥 Popular</span>
      </div>
      <button class="sw-play-btn">PLAY</button>
    </div>

    <div class="sw-game-card" onclick="alert('Trx Win Go runs in synchronized block mode.')">
      <div class="sw-game-info">
        <h3>Trx Win Go</h3>
        <p>Blockchain verified Tron lottery draws</p>
        <span class="sw-game-tag">⛓️ On-Chain</span>
      </div>
      <button class="sw-play-btn" style="background:#555;">PLAY</button>
    </div>

    <!-- Winning Rank Leaderboard -->
    <div style="margin-top:10px;">
      <h4 style="font-size:15px; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
        <span>🏆 Winning Rank Today</span>
      </h4>
      <div class="sw-table-wrapper">
        <table class="sw-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Member</th>
              <th>Winning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span style="background:#ffd700; color:#000; padding:2px 8px; border-radius:10px; font-weight:800;">1</span></td>
              <td>User_**9812</td>
              <td style="color:var(--sw-green); font-weight:700;">₹48,250.00</td>
            </tr>
            <tr>
              <td><span style="background:#c0c0c0; color:#000; padding:2px 8px; border-radius:10px; font-weight:800;">2</span></td>
              <td>User_**4510</td>
              <td style="color:var(--sw-green); font-weight:700;">₹32,100.00</td>
            </tr>
            <tr>
              <td><span style="background:#cd7f32; color:#fff; padding:2px 8px; border-radius:10px; font-weight:800;">3</span></td>
              <td>User_**7734</td>
              <td style="color:var(--sw-green); font-weight:700;">₹21,800.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- VIEW: WINGO GAME -->
  <main id="view-wingo" class="sw-view">
    <!-- Header with Balance & Back -->
    <div class="sw-arena-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <button class="sw-icon-btn" onclick="window.location.hash='#/home'" style="font-size:18px;">←</button>
        <div>
          <div style="font-size:11px; color:var(--sw-text-muted);">Available Balance</div>
          <div class="sw-arena-balance-val js-user-balance">₹10,000.00</div>
        </div>
      </div>
      <button class="sw-btn-small" onclick="window.location.hash='#/wallet'">+ Recharge</button>
    </div>

    <!-- Period & Timer Bar -->
    <div class="sw-timer-card">
      <div>
        <div style="font-size:11px; color:var(--sw-text-muted); margin-bottom:4px;">Period Number</div>
        <div style="font-size:17px; font-weight:800; color:#fff;" id="wingoActivePeriod">20261114001</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; color:var(--sw-text-muted); margin-bottom:4px;">Time Remaining</div>
        <div class="sw-timer-digits">
          <div class="sw-time-box">0</div>
          <div class="sw-time-box">0</div>
          <div style="align-self:center; font-size:16px; font-weight:800;">:</div>
          <div class="sw-time-box" id="timerSec1">3</div>
          <div class="sw-time-box" id="timerSec2">0</div>
        </div>
      </div>
    </div>

    <!-- Recent Balls Row -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <span style="font-size:12px; color:var(--sw-text-muted);">Recent Draws:</span>
    </div>
    <div class="sw-balls-row" id="recentBallsRow">
      <!-- Injected via app.js -->
    </div>

    <!-- 1. Color Choices -->
    <div class="sw-choice-colors">
      <button class="sw-btn-color green" onclick="openBetModal('color', 'green')">Green<br><span style="font-size:11px; opacity:0.8;">2X</span></button>
      <button class="sw-btn-color violet" onclick="openBetModal('color', 'violet')">Violet<br><span style="font-size:11px; opacity:0.8;">4.5X</span></button>
      <button class="sw-btn-color red" onclick="openBetModal('color', 'red')">Red<br><span style="font-size:11px; opacity:0.8;">2X</span></button>
    </div>

    <!-- 2. Number Balls Grid (0 to 9) -->
    <div class="sw-numbers-box">
      <div style="font-size:12px; color:var(--sw-text-muted); margin-bottom:10px; text-align:center;">Pick Number (Payout 9X)</div>
      <div class="sw-num-grid">
        <button class="sw-num-choice sw-ball violet-red" onclick="openBetModal('number', '0')">0</button>
        <button class="sw-num-choice sw-ball green" onclick="openBetModal('number', '1')">1</button>
        <button class="sw-num-choice sw-ball red" onclick="openBetModal('number', '2')">2</button>
        <button class="sw-num-choice sw-ball green" onclick="openBetModal('number', '3')">3</button>
        <button class="sw-num-choice sw-ball red" onclick="openBetModal('number', '4')">4</button>
        <button class="sw-num-choice sw-ball violet-green" onclick="openBetModal('number', '5')">5</button>
        <button class="sw-num-choice sw-ball red" onclick="openBetModal('number', '6')">6</button>
        <button class="sw-num-choice sw-ball green" onclick="openBetModal('number', '7')">7</button>
        <button class="sw-num-choice sw-ball red" onclick="openBetModal('number', '8')">8</button>
        <button class="sw-num-choice sw-ball green" onclick="openBetModal('number', '9')">9</button>
      </div>
    </div>

    <!-- 3. Size Choice (Big / Small) -->
    <div class="sw-choice-size">
      <button class="sw-btn-size big" onclick="openBetModal('size', 'Big')">Big (5-9)<br><span style="font-size:11px; opacity:0.8;">2X</span></button>
      <button class="sw-btn-size small" onclick="openBetModal('size', 'Small')">Small (0-4)<br><span style="font-size:11px; opacity:0.8;">2X</span></button>
    </div>

    <!-- History / My Bets Tabs -->
    <div class="sw-records-tabs">
      <div class="sw-rec-tab active" onclick="switchRecTab('history', this)">Game History</div>
      <div class="sw-rec-tab" onclick="switchRecTab('mybets', this)">My Bets</div>
    </div>

    <div id="tab-game-history" class="sw-table-wrapper">
      <table class="sw-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Number</th>
            <th>Size</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody id="wingoHistoryTbody">
          <!-- Injected via app.js -->
        </tbody>
      </table>
    </div>

    <div id="tab-my-bets" class="sw-table-wrapper" style="display:none;">
      <table class="sw-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Selection</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="myBetsTbody">
          <!-- Injected via app.js -->
        </tbody>
      </table>
    </div>
  </main>

  <!-- VIEW: WALLET -->
  <main id="view-wallet" class="sw-view">
    <div class="sw-banner-card">
      <div style="font-size:11px; opacity:0.8;">Total Balance</div>
      <h2 class="js-user-balance">₹10,000.00</h2>
      <p style="margin-top:6px;">Main wallet for all games and instant withdrawals</p>
    </div>

    <!-- Fast Recharge -->
    <div class="sw-form-card">
      <h3 style="font-size:16px; font-weight:700; margin-bottom:12px;">Fast Deposit (Recharge)</h3>
      <div style="font-size:12px; color:var(--sw-text-muted); margin-bottom:10px;">Select Channel: Fast UPI (0% Fee, Instant)</div>
      <div class="sw-chip-group">
        <div class="sw-chip active" onclick="handleRecharge(500)">+ ₹500</div>
        <div class="sw-chip" onclick="handleRecharge(1000)">+ ₹1,000</div>
        <div class="sw-chip" onclick="handleRecharge(2000)">+ ₹2,000</div>
        <div class="sw-chip" onclick="handleRecharge(5000)">+ ₹5,000</div>
      </div>
      <button class="sw-btn-submit" onclick="handleRecharge(1000)">Recharge ₹1,000 (Instant Simulator)</button>
    </div>

    <!-- Withdrawal -->
    <form class="sw-form-card" onsubmit="handleWithdraw(event)">
      <h3 style="font-size:16px; font-weight:700; margin-bottom:12px;">Fast Withdrawal</h3>
      <div class="sw-input-group">
        <label class="sw-input-label">Withdrawal Amount (₹)</label>
        <div class="sw-input-wrap">
          <input type="number" id="withAmount" class="sw-input" placeholder="Min ₹100" min="100" required>
        </div>
      </div>
      <div class="sw-input-group">
        <label class="sw-input-label">UPI ID or Bank Account</label>
        <div class="sw-input-wrap">
          <input type="text" id="withUpi" class="sw-input" placeholder="e.g. yourname@oksbi" required>
        </div>
      </div>
      <button type="submit" class="sw-btn-submit" style="background:linear-gradient(90deg, #fd565c, #e07a3c);">Submit Withdrawal</button>
    </form>
  </main>

  <!-- VIEW: PROMOTION -->
  <main id="view-promotion" class="sw-view">
    <div class="sw-banner-card">
      <div style="font-size:11px; opacity:0.8;">Agency Promotion Center</div>
      <h2>Invite & Earn Commissions</h2>
      <p>Up to 3 levels of high team turnover rebate</p>
    </div>

    <div class="sw-form-card">
      <h3 style="font-size:15px; font-weight:700; margin-bottom:14px;">Your Invitation Details</h3>
      <div style="background:var(--sw-card-inner); padding:12px; border-radius:10px; margin-bottom:12px;">
        <div style="font-size:11px; color:var(--sw-text-muted);">Invitation Code:</div>
        <div style="font-size:20px; font-weight:800; color:var(--sw-primary-purple); letter-spacing:1px;" class="js-user-invite">36467291608</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="sw-btn-submit" style="margin-top:0;" onclick="copyInviteCode()">Copy Code</button>
        <button class="sw-btn-submit" style="margin-top:0; background:var(--sw-gold-gradient); color:#000;" onclick="copyInviteLink()">Copy Share Link</button>
      </div>
    </div>

    <div class="sw-table-wrapper">
      <table class="sw-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>Commission Rate</th>
            <th>Rebate Mode</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Level 1 (Direct)</td>
            <td style="color:var(--sw-green); font-weight:700;">0.6%</td>
            <td>Instant Turnover</td>
          </tr>
          <tr>
            <td>Level 2 (Team)</td>
            <td style="color:var(--sw-green); font-weight:700;">0.18%</td>
            <td>Instant Turnover</td>
          </tr>
          <tr>
            <td>Level 3 (Sub-team)</td>
            <td style="color:var(--sw-green); font-weight:700;">0.05%</td>
            <td>Instant Turnover</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <!-- VIEW: MINE / ACCOUNT -->
  <main id="view-mine" class="sw-view">
    <div class="sw-form-card" style="display:flex; align-items:center; gap:16px;">
      <img src="/assets/png/avatar-BTjdxpts.png" style="width:60px; height:60px; border-radius:50%; border:2px solid var(--sw-primary-purple);" alt="avatar">
      <div>
        <div style="font-size:17px; font-weight:800;">User <span class="js-user-uid">36467291</span></div>
        <div style="font-size:12px; color:var(--sw-text-muted); margin-top:2px;">Phone: <span class="js-user-phone">9876543210</span></div>
        <div style="display:inline-block; padding:2px 8px; background:var(--sw-gold-gradient); color:#000; border-radius:10px; font-size:11px; font-weight:800; margin-top:4px;">VIP 1 MEMBER</div>
      </div>
    </div>

    <div class="sw-game-card" onclick="window.location.hash='#/wallet'">
      <div>
        <div style="font-size:12px; color:var(--sw-text-muted);">Total Balance</div>
        <div style="font-size:22px; font-weight:800;" class="js-user-balance">₹10,000.00</div>
      </div>
      <button class="sw-play-btn">Wallet ↗</button>
    </div>

    <div class="sw-form-card" style="padding:10px 16px;">
      <div style="padding:12px 0; border-bottom:1px solid var(--sw-border); cursor:pointer;" onclick="window.location.hash='#/wingo'">🎮 Bet Records</div>
      <div style="padding:12px 0; border-bottom:1px solid var(--sw-border); cursor:pointer;" onclick="window.location.hash='#/wallet'">💳 Transaction History</div>
      <div style="padding:12px 0; border-bottom:1px solid var(--sw-border); cursor:pointer;" onclick="window.location.hash='#/promotion'">👥 Invite Friends & Earn</div>
      <div style="padding:12px 0; cursor:pointer;" onclick="window.location.hash='#/login'">🚪 Logout</div>
    </div>
  </main>

  <!-- Bottom Navigation Bar -->
  <nav id="bottomNavBar" class="sw-bottom-nav">
    <a href="#/home" class="sw-nav-item active" data-tab="home" data-nor="/assets/png/home_nor-CroMkB0V.png" data-sel="/assets/png/home_sel-uoBer_fS.png">
      <img src="/assets/png/home_sel-uoBer_fS.png" class="sw-nav-icon" alt="Home">
      <span>Home</span>
    </a>
    <a href="#/activity" class="sw-nav-item" data-tab="activity" data-nor="/assets/png/activity_nor-CWI5aOzf.png" data-sel="/assets/png/activity_sel-D7XI5yrT.png">
      <img src="/assets/png/activity_nor-CWI5aOzf.png" class="sw-nav-icon" alt="Activity">
      <span>Activity</span>
    </a>
    <a href="#/promotion" class="sw-nav-item" data-tab="promotion">
      <svg class="sw-nav-icon" style="fill:currentColor;"><use xlink:href="#icon-promotion"></use></svg>
      <span>Promotion</span>
    </a>
    <a href="#/wallet" class="sw-nav-item" data-tab="wallet" data-nor="/assets/png/wallet_sel-tj6BSHob.png" data-sel="/assets/png/wallet_sel-tj6BSHob.png">
      <img src="/assets/png/wallet_sel-tj6BSHob.png" class="sw-nav-icon" alt="Wallet">
      <span>Wallet</span>
    </a>
    <a href="#/mine" class="sw-nav-item" data-tab="mine" data-nor="/assets/png/mine_nor-CvlzPUfD.png" data-sel="/assets/png/mine_sel-fH8TpJZ8.png">
      <img src="/assets/png/mine_nor-CvlzPUfD.png" class="sw-nav-icon" alt="Mine">
      <span>Mine</span>
    </a>
  </nav>

  <!-- Bet Placement Bottom Sheet Modal -->
  <div id="betModal" class="sw-modal-mask" onclick="if(event.target===this) closeBetModal()">
    <div class="sw-bet-sheet">
      <div class="sw-sheet-header">
        <h3 class="sw-sheet-title" id="betSheetTitle">Select Option</h3>
        <button class="sw-close-btn" onclick="closeBetModal()">✕</button>
      </div>

      <div style="font-size:12px; color:var(--sw-text-muted); margin-bottom:8px;">Balance Amount:</div>
      <div class="sw-chip-group">
        <div class="sw-chip active" onclick="setBetUnit(10, this)">₹10</div>
        <div class="sw-chip" onclick="setBetUnit(100, this)">₹100</div>
        <div class="sw-chip" onclick="setBetUnit(1000, this)">₹1,000</div>
        <div class="sw-chip" onclick="setBetUnit(10000, this)">₹10,000</div>
      </div>

      <div style="font-size:12px; color:var(--sw-text-muted); margin-bottom:8px;">Multiplier:</div>
      <div class="sw-stepper">
        <button class="sw-step-btn" onclick="adjustMultiplier(-1)">-</button>
        <span class="sw-step-val" id="stepVal">x1</span>
        <button class="sw-step-btn" onclick="adjustMultiplier(1)">+</button>
      </div>

      <button class="sw-btn-confirm" id="btnConfirmBet" onclick="confirmBet()">Confirm Bet</button>
    </div>
  </div>
</div>
"""

# Assemble new index.html with preserved SVG sprite and official CSS
new_html = f"""<!DOCTYPE html>
<html lang="en" translate="no">
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" type="image/png" href="/favico.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>shreewin</title>
    <!-- Shreewin Official CSS -->
    <link rel="stylesheet" crossorigin href="/assets/css/index-Bp99Xmm8.css">
    <link rel="stylesheet" href="/app.css">
</head>
<body>
    {svg_sprite}
    <div id="app">
        {app_html}
    </div>
    <script src="/app.js"></script>
</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as out_f:
    out_f.write(new_html)

print("index.html updated successfully with complete Shreewin app template!")
