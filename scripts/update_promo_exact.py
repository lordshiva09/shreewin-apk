import re

# Exact pixel-perfect Promotion HTML matching the video frames (000, 002, 008)
exact_promo_html = """  <!-- VIEW: PROMOTION (Exact Live Match to Video) -->
  <main id="view-promotion" class="sw-view">
    <!-- Navbar Header -->
    <div class="agency-navbar">
      <div class="agency-navbar__left"></div>
      <div class="agency-navbar__title">Agency</div>
      <div class="agency-navbar__right" onclick="alert('Subordinate Record Filter')">
        <svg class="svg-icon icon-subordinate"><use xlink:href="#icon-subordinate"></use></svg>
      </div>
    </div>

    <!-- Top Curved Hero Card with Concentric Circles -->
    <div class="agency-hero">
      <div class="agency-hero__amount">0</div>
      <div class="agency-hero__badge">Yesterday's total commission</div>
      <div class="agency-hero__tip">Upgrade the level to increase commission income</div>

      <!-- Subordinates Comparison Card -->
      <div class="agency-table-card">
        <div class="agency-table-header">
          <div class="agency-table-th direct">Direct subordinates</div>
          <div class="agency-table-th team">Team subordinates</div>
        </div>
        <div class="agency-table-body">
          <div class="agency-table-row">
            <div class="agency-table-cell direct">
              <div class="val">0</div>
              <div class="lbl">Number of register</div>
            </div>
            <div class="agency-table-cell team">
              <div class="val">0</div>
              <div class="lbl">Number of register</div>
            </div>
          </div>
          <div class="agency-table-row">
            <div class="agency-table-cell direct">
              <div class="val green">0</div>
              <div class="lbl">Deposit number</div>
            </div>
            <div class="agency-table-cell team">
              <div class="val green">0</div>
              <div class="lbl">Deposit number</div>
            </div>
          </div>
          <div class="agency-table-row">
            <div class="agency-table-cell direct">
              <div class="val gold">0</div>
              <div class="lbl">Deposit amount</div>
            </div>
            <div class="agency-table-cell team">
              <div class="val gold">0</div>
              <div class="lbl">Deposit amount</div>
            </div>
          </div>
          <div class="agency-table-row">
            <div class="agency-table-cell direct">
              <div class="val">0</div>
              <div class="lbl">Number of people making first deposit</div>
            </div>
            <div class="agency-table-cell team">
              <div class="val">0</div>
              <div class="lbl">Number of people making first deposit</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body Content -->
    <div class="agency-content">
      <!-- Full-Width Invitation Link Button -->
      <div class="agency-btn-wrap">
        <button class="agency-btn-invite" onclick="copyInviteLink()">INVITATION LINK</button>
      </div>

      <!-- Separate Menu Cards -->
      <div class="agency-menu-list">
        <!-- 1. Partner Rewards -->
        <div class="agency-card-item" onclick="alert('Partner rewards: Unlimited rebate from team performance!')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-team_partner"></use></svg>
            <span class="agency-card-text">Partner rewards</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>

        <!-- 2. Copy Invitation Code -->
        <div class="agency-card-item" onclick="copyInviteCode()">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-copy_Code"></use></svg>
            <span class="agency-card-text">Copy invitation code</span>
          </div>
          <div class="agency-card-right">
            <span class="agency-code-text js-user-invite">3180606130902</span>
            <svg class="agency-copy-icon"><use xlink:href="#icon-copy"></use></svg>
          </div>
        </div>

        <!-- 3. Subordinate Data -->
        <div class="agency-card-item" onclick="alert('Subordinate Data: 0 Active Subordinates')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-team_port"></use></svg>
            <span class="agency-card-text">Subordinate data</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>

        <!-- 4. Commission Detail -->
        <div class="agency-card-item" onclick="alert('Commission Detail: Total earned ₹0.00')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-commission"></use></svg>
            <span class="agency-card-text">Commission detail</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>

        <!-- 5. Invitation Rules -->
        <div class="agency-card-item" onclick="alert('Invitation Rules: Up to 3 levels of high team turnover rebate')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-invite_reg"></use></svg>
            <span class="agency-card-text">Invitation rules</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>

        <!-- 6. Agent Line Customer Service -->
        <div class="agency-card-item" onclick="alert('Agent line customer service: Telegram 24/7 Agent Connected')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-server"></use></svg>
            <span class="agency-card-text">Agent line customer service</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>

        <!-- 7. Rebate Ratio -->
        <div class="agency-card-item" onclick="alert('Rebate ratio: Tier 1 (0.6%), Tier 2 (0.18%), Tier 3 (0.054%)')">
          <div class="agency-card-left">
            <svg class="agency-card-icon"><use xlink:href="#icon-rebateRatio"></use></svg>
            <span class="agency-card-text">Rebate ratio</span>
          </div>
          <svg class="agency-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>
      </div>

      <!-- Promotion Data Card (2x2 Grid) -->
      <div class="agency-promo-data">
        <div class="agency-promo-data__title">
          <svg class="agency-card-icon"><use xlink:href="#icon-promotionData"></use></svg>
          <span>Promotion data</span>
        </div>
        <div class="agency-promo-data__grid">
          <div class="agency-promo-data__row">
            <div class="agency-promo-data__col">
              <span class="num">0</span>
              <span class="desc">This Week</span>
            </div>
            <div class="agency-promo-data__divider"></div>
            <div class="agency-promo-data__col">
              <span class="num">0</span>
              <span class="desc">Total commission</span>
            </div>
          </div>
          <div class="agency-promo-data__row-line"></div>
          <div class="agency-promo-data__row">
            <div class="agency-promo-data__col">
              <span class="num">0</span>
              <span class="desc">Direct Subordinate</span>
            </div>
            <div class="agency-promo-data__divider"></div>
            <div class="agency-promo-data__col">
              <span class="num">0</span>
              <span class="desc">Total number of subordinates in the team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>"""

index_path = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace view-promotion block cleanly
html = re.sub(r'<!-- VIEW: PROMOTION[\s\S]*?</main>\s*(?=\s*<!-- VIEW: REGISTER)', exact_promo_html + '\n\n', html)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html promotion view updated successfully!")
