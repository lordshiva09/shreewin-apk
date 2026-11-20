import re

# 1. Prepare exact Promotion HTML
promo_html = """  <!-- VIEW: PROMOTION (Official Agency Clone) -->
  <main id="view-promotion" class="sw-view">
    <div class="navbar white">
      <div class="navbar-fixed">
        <div class="navbar__content">
          <div class="navbar__content-left"></div>
          <div class="navbar__content-center">
            <div class="navbar__content-title">Agency</div>
          </div>
          <div class="navbar__content-right">
            <svg class="svg-icon icon-subordinate"><use xlink:href="#icon-subordinate"></use></svg>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="amount">0</div>
      <div class="amount_txt">Yesterday's total commission</div>
      <div class="tip">Upgrade the level to increase commission income</div>
      <div class="info_content">
        <div class="info">
          <div class="head">Direct subordinates</div>
          <div class="line1 r"><div>0</div> Number of register</div>
          <div class="line2 r"><div>0</div> Deposit number</div>
          <div class="line3 r"><div>0</div> Deposit amount</div>
          <div class="line1 r"><div>0</div> Number of people making first deposit</div>
        </div>
        <div class="info">
          <div class="head">Team subordinates</div>
          <div class="line1"><div>0</div> Number of register</div>
          <div class="line2"><div>0</div> Deposit number</div>
          <div class="line3"><div>0</div> Deposit amount</div>
          <div class="line1"><div>0</div> Number of people making first deposit</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="shareBtnContainer">
        <button class="shareBtn" onclick="copyInviteLink()">INVITATION LINK</button>
      </div>
      <div class="promote__cell">
        <div class="promote__cell-item" onclick="alert('Partner rewards: Earn rebate from team turnover!')">
          <div class="label">
            <svg class="svg-icon icon-team_partner"><use xlink:href="#icon-team_partner"></use></svg>
            <span>Partner rewards</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
        <div class="promote__cell-item" onclick="copyInviteCode()">
          <div class="label">
            <svg class="svg-icon icon-copy_Code"><use xlink:href="#icon-copy_Code"></use></svg>
            <span>Copy invitation code</span>
          </div>
          <div class="arrow">
            <span><span class="js-user-invite">3180606130902</span> <svg class="svg-icon icon-copy" style="width:14px; height:14px; vertical-align:middle;"><use xlink:href="#icon-copy"></use></svg></span>
          </div>
        </div>
        <div class="promote__cell-item" onclick="alert('Subordinate Data: 0 Active Subordinates')">
          <div class="label">
            <svg class="svg-icon icon-team_port"><use xlink:href="#icon-team_port"></use></svg>
            <span>Subordinate data</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
        <div class="promote__cell-item" onclick="alert('Commission Detail: Total earned ₹0.00')">
          <div class="label">
            <svg class="svg-icon icon-commission"><use xlink:href="#icon-commission"></use></svg>
            <span>Commission detail</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
        <div class="promote__cell-item" onclick="alert('Invitation Rules: 30% first deposit bonus, tier commissions!')">
          <div class="label">
            <svg class="svg-icon icon-invite_reg"><use xlink:href="#icon-invite_reg"></use></svg>
            <span>Invitation rules</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
        <div class="promote__cell-item" onclick="alert('Contact Agent Line Support: 24/7 Live Telegram Agent')">
          <div class="label">
            <svg class="svg-icon icon-server"><use xlink:href="#icon-server"></use></svg>
            <span>Agent line customer service</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
        <div class="promote__cell-item" onclick="alert('Rebate Ratio: Level 1: 0.6%, Level 2: 0.18%, Level 3: 0.054%')">
          <div class="label">
            <svg class="svg-icon icon-rebateRatio"><use xlink:href="#icon-rebateRatio"></use></svg>
            <span>Rebate ratio</span>
          </div>
          <div class="arrow"><i class="van-badge__wrapper van-icon van-icon-arrow" style="font-size: 20px;"></i></div>
        </div>
      </div>
      <div class="commission">
        <div class="commission__title">
          <svg class="svg-icon icon-promotionData"><use xlink:href="#icon-promotionData"></use></svg>
          <span>Promotion data</span>
        </div>
        <div class="commission__body">
          <div><span>0</span><span>This Week</span></div>
          <span></span>
          <div><span>0</span><span>Total commission</span></div>
        </div>
        <div class="commission__body">
          <div><span>0</span><span>Direct Subordinate</span></div>
          <span></span>
          <div><span>0</span><span>Total number of subordinates in the team</span></div>
        </div>
      </div>
    </div>
  </main>"""

# 2. Prepare exact Mine HTML
mine_html = """  <!-- VIEW: MINE / ACCOUNT (Exact Live Match to MEMBERD46ABGUH) -->
  <main id="view-mine" class="sw-view">
    <div class="userInfo__container-content">
      <div class="userInfo__container-content-wrapper">
        <div class="userInfo__container-content__avatar">
          <img src="/assets/png/1-Cz2mt-nl.png" class="userAvatar">
        </div>
        <div class="userInfo__container-content__name">
          <div class="userInfo__container-content-nickname">
            <h3 class="js-user-nick">MEMBERD46ABGUH</h3>
            <div class="n0"></div>
          </div>
          <div class="userInfo__container-content-uid">
            <span>UID</span><span>|</span><span class="js-user-uid">6130903</span>
            <svg class="svg-icon icon-copy" onclick="navigator.clipboard.writeText('6130903'); alert('UID Copied!');"><use xlink:href="#icon-copy"></use></svg>
          </div>
          <div class="userInfo__container-content-logintime">
            <span>Last login:&nbsp;</span><span>2026-11-15 09:57:42</span>
          </div>
        </div>
      </div>
    </div>

    <div class="userinfo-content">
      <!-- Total Balance Card -->
      <div class="totalSavings__container">
        <div class="totalSavings__container-header">
          <div class="totalSavings__container-header-box ar-1px-b">
            <div class="balance_info">
              <div class="totalSavings__container-header__title"><span>Total balance</span></div>
              <p class="totalSavings__container-header__subtitle">
                <span class="js-user-balance">₹50.00</span>
                <svg class="svg-icon icon-refreshBalance" onclick="syncUser()"><use xlink:href="#icon-refreshBalance"></use></svg>
              </p>
            </div>
            <div class="comminWallet" onclick="window.location.hash='#/wallet'">Enter wallet</div>
          </div>
        </div>
        <div class="totalSavings__container-content">
          <div class="totalSavings__container-content-item" onclick="window.location.hash='#/wallet'">
            <div><svg class="svg-icon icon-wallets"><use xlink:href="#icon-wallets"></use></svg><span>ARWallet</span></div>
          </div>
          <div class="totalSavings__container-content-item" onclick="window.location.hash='#/wallet'">
            <div><svg class="svg-icon icon-rechargeIcon"><use xlink:href="#icon-rechargeIcon"></use></svg><span>Deposit</span></div>
          </div>
          <div class="totalSavings__container-content-item" onclick="window.location.hash='#/wallet'">
            <div><svg class="svg-icon icon-widthdrawBlue"><use xlink:href="#icon-widthdrawBlue"></use></svg><span>Withdraw</span></div>
          </div>
          <div class="totalSavings__container-content-item" onclick="alert('VIP Level: VIP0 (Recharge ₹500 to reach VIP1)')">
            <div><svg class="svg-icon icon-VipIcon"><use xlink:href="#icon-VipIcon"></use></svg><span>VIP</span></div>
          </div>
        </div>
      </div>

      <!-- Financial Services Grid -->
      <div class="financialServices__container">
        <div class="financialServices__container-box">
          <div onclick="window.location.hash='#/wingo'">
            <svg class="svg-icon icon-betHistory"><use xlink:href="#icon-betHistory"></use></svg>
            <div class="financialServices__container-box-para">
              <h3>Game History</h3>
              <span>My game history</span>
            </div>
          </div>
          <div onclick="alert('Transaction history: All records synced')">
            <svg class="svg-icon icon-tradeHistory"><use xlink:href="#icon-tradeHistory"></use></svg>
            <div class="financialServices__container-box-para">
              <h3>Transaction</h3>
              <span>My transaction history</span>
            </div>
          </div>
          <div onclick="alert('Deposit history: ₹50.00 initial credit confirmed')">
            <svg class="svg-icon icon-rechargeHistory"><use xlink:href="#icon-rechargeHistory"></use></svg>
            <div class="financialServices__container-box-para">
              <h3>Deposit</h3>
              <span>My deposit history</span>
            </div>
          </div>
          <div onclick="alert('Withdraw history: No pending withdrawals')">
            <svg class="svg-icon icon-myWithdrawHistory"><use xlink:href="#icon-myWithdrawHistory"></use></svg>
            <div class="financialServices__container-box-para">
              <h3>Withdraw</h3>
              <span>My withdraw history</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Setting Panel List -->
      <div class="settingPanel__container">
        <div class="settingPanel__container-items">
          <div class="settingPanel__container-items__item ar-1px-b" onclick="alert('Notification: Welcome bonus ₹50 credited!')">
            <div class="settingPanel__container-items__title">
              <svg class="svg-icon icon-notification"><use xlink:href="#icon-notification"></use></svg>
              <span>Notification</span>
            </div>
            <div class="settingPanel__container-items-right">
              <h5>2</h5>
              <i class="van-badge__wrapper van-icon van-icon-arrow"></i>
            </div>
          </div>
          <div class="settingPanel__container-items__item ar-1px-b" onclick="alert('Gifts Center: Check daily free spins and rewards')">
            <div class="settingPanel__container-items__title">
              <svg class="svg-icon icon-gifts"><use xlink:href="#icon-gifts"></use></svg>
              <span>Gifts</span>
            </div>
            <div class="settingPanel__container-items-right">
              <i class="van-badge__wrapper van-icon van-icon-arrow"></i>
            </div>
          </div>
          <div class="settingPanel__container-items__item ar-1px-b" onclick="alert('Tournament: Weekly WinGo Leaderboard is Live')">
            <div class="settingPanel__container-items__title">
              <svg class="svg-icon icon-tournament"><use xlink:href="#icon-tournament"></use></svg>
              <span>My Tournament</span>
            </div>
            <div class="settingPanel__container-items-right">
              <i class="van-badge__wrapper van-icon van-icon-arrow"></i>
            </div>
          </div>
          <div class="settingPanel__container-items__item ar-1px-b" onclick="alert('Game statistics: Win rate 68.5% across 24 rounds')">
            <div class="settingPanel__container-items__title">
              <svg class="svg-icon icon-statsIcon"><use xlink:href="#icon-statsIcon"></use></svg>
              <span>Game statistics</span>
            </div>
            <div class="settingPanel__container-items-right">
              <i class="van-badge__wrapper van-icon van-icon-arrow"></i>
            </div>
          </div>
          <div class="settingPanel__container-items__item ar-1px-b" onclick="alert('Language: English (Default)')">
            <div class="settingPanel__container-items__title">
              <svg class="svg-icon icon-language"><use xlink:href="#icon-language"></use></svg>
              <span>Language</span>
            </div>
            <div class="settingPanel__container-items-right">
              <span>English</span>
              <i class="van-badge__wrapper van-icon van-icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Center Section -->
      <div class="serviceCenter-wrap">
        <div class="serviceCenter__container">
          <h1>Service center</h1>
          <div class="serviceCenter__container-items">
            <div class="serviceCenter__container-items__item" onclick="alert('Settings: App version 2.4.1')">
              <svg class="svg-icon icon-settingCenter"><use xlink:href="#icon-settingCenter"></use></svg>
              <span>Settings</span>
            </div>
            <div class="serviceCenter__container-items__item" onclick="alert('Feedback: Submit suggestions to our technical team')">
              <svg class="svg-icon icon-feedback"><use xlink:href="#icon-feedback"></use></svg>
              <span>Feedback</span>
            </div>
            <div class="serviceCenter__container-items__item" onclick="alert('Announcement: System stability update completed')">
              <svg class="svg-icon icon-notificationCenter"><use xlink:href="#icon-notificationCenter"></use></svg>
              <span>Announcement</span>
            </div>
            <div class="serviceCenter__container-items__item" onclick="alert('Customer Service: Connecting to agent on Telegram...')">
              <svg class="svg-icon icon-serverTicket"><use xlink:href="#icon-serverTicket"></use></svg>
              <span>Customer Service</span>
            </div>
            <div class="serviceCenter__container-items__item" onclick="alert('Beginner Guide: How to play WinGo and withdraw')">
              <svg class="svg-icon icon-guide"><use xlink:href="#icon-guide"></use></svg>
              <span>Beginner's Guide</span>
            </div>
            <div class="serviceCenter__container-items__item" onclick="alert('About us: Shree.Win Official Platform')">
              <svg class="svg-icon icon-about"><use xlink:href="#icon-about"></use></svg>
              <span>About us</span>
            </div>
          </div>
        </div>
        <div class="serviceCenter-wrap-header">
          <button onclick="logout()"><svg class="svg-icon icon-logout"><use xlink:href="#icon-logout"></use></svg> Log out</button>
        </div>
      </div>
    </div>
  </main>"""

# 3. Exact Tabbar
tabbar_html = """  <!-- Exact Live Tabbar with Elevated Turntable Center Wheel -->
  <nav class="tabbar__container" id="bottomNavBar">
    <div class="tabbar__container-item active" data-tab="home" data-nor="/assets/png/home_nor-CroMkB0V.png" data-sel="/assets/png/home_sel-uoBer_fS.png" onclick="window.location.hash='#/home'">
      <img class="tab-icon" src="/assets/png/home_sel-uoBer_fS.png" alt="Home">
      <span>Home</span>
    </div>
    <div class="tabbar__container-item" data-tab="wingo" data-nor="/assets/png/activity_nor-CWI5aOzf.png" data-sel="/assets/png/activity_sel-D7XI5yrT.png" onclick="window.location.hash='#/wingo'">
      <img class="tab-icon" src="/assets/png/activity_nor-CWI5aOzf.png" alt="Activity">
      <span>Activity</span>
    </div>
    <div class="tabbar__container-item turntable-item" onclick="alert('Lucky Spin Turntable: Win up to ₹500!')">
      <div class="turntableBg" style="background-image: url(/ossimg/shreewin/tab/wheel.png);"></div>
      <span class="turntable-text">Get ₹500</span>
    </div>
    <div class="tabbar__container-item" data-tab="promotion" data-nor="/assets/png/wallet_nor-D-p_ziCw.png" data-sel="/assets/png/wallet_sel-tj6BSHob.png" onclick="window.location.hash='#/promotion'">
      <img class="tab-icon" src="/assets/png/wallet_nor-D-p_ziCw.png" alt="Promotion">
      <span>Promotion</span>
    </div>
    <div class="tabbar__container-item" data-tab="mine" data-nor="/assets/png/mine_nor-CvlzPUfD.png" data-sel="/assets/png/mine_sel-fH8TpJZ8.png" onclick="window.location.hash='#/mine'">
      <img class="tab-icon" src="/assets/png/mine_nor-CvlzPUfD.png" alt="Account">
      <span>Account</span>
    </div>
  </nav>"""

index_path = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add stylesheet links if not present
new_css = """    <!-- Shreewin Official CSS -->
    <link rel="stylesheet" crossorigin href="/assets/css/index-Bp99Xmm8.css">
    <link rel="stylesheet" crossorigin href="/assets/css/clean-promotion.css">
    <link rel="stylesheet" crossorigin href="/assets/css/clean-mine.css">
    <link rel="stylesheet" href="/app.css">"""

html = re.sub(r'<!-- Shreewin Official CSS -->[\s\S]*?<link rel="stylesheet" href="/app.css">', new_css, html)

# Replace view-mine
html = re.sub(r'<!-- VIEW: MINE[\s\S]*?</main>\s*(?=\s*<!-- VIEW: WALLET)', mine_html + '\n\n', html)

# Replace view-promotion
html = re.sub(r'<!-- VIEW: PROMOTION[\s\S]*?</main>\s*(?=\s*<!-- VIEW: REGISTER)', promo_html + '\n\n', html)

# Replace tabbar
html = re.sub(r'<!-- Exact Live Tabbar[\s\S]*?</nav>', tabbar_html, html)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html successfully!")
