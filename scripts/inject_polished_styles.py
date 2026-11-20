css_additions = """
/* ========================================================
   EXACT RECONSTRUCTION FOR PROMOTION (AGENCY) & MINE PAGES
   ======================================================== */

/* Navbar General */
.navbar {
  width: 100%;
  height: 48px;
  position: relative;
  z-index: 99;
}
.navbar.white {
  background: transparent;
}
.navbar-fixed {
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
}
.navbar__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  color: #fff;
}
.navbar__content-left {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.navbar__content-center {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #fff;
}
.navbar__content-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.navbar__content-right {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.navbar__content-right svg {
  width: 24px;
  height: 24px;
  fill: #857aff;
  cursor: pointer;
}

/* Promotion Page Official Layout */
#view-promotion .container {
  background: linear-gradient(180deg, #7b68ee 0%, #483d8b 60%, #15132b 100%);
  border-radius: 0 0 20px 20px;
  padding: 16px 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: -48px;
  padding-top: 54px;
}
#view-promotion .amount {
  font-size: 38px;
  font-weight: 800;
  color: #ffffff;
  margin-top: 4px;
  line-height: 1.1;
}
#view-promotion .amount_txt {
  background: rgba(0, 0, 0, 0.4);
  color: #e2dfff;
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 12px;
  margin: 6px 0 8px;
  font-weight: 600;
}
#view-promotion .tip {
  font-size: 12px;
  color: #c4bdfa;
  margin-bottom: 16px;
}
#view-promotion .info_content {
  display: flex;
  width: 100%;
  background: #1c1a3f;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
#view-promotion .info {
  flex: 1;
  padding: 12px 10px;
  font-size: 11px;
  color: #928cb5;
}
#view-promotion .info:first-child {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}
#view-promotion .info .head {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
}
#view-promotion .info .line1,
#view-promotion .info .line2,
#view-promotion .info .line3 {
  margin-bottom: 8px;
  text-align: center;
}
#view-promotion .info .line1 > div,
#view-promotion .info .line2 > div,
#view-promotion .info .line3 > div {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 2px;
}
#view-promotion .info .line1 > div { color: #fff; }
#view-promotion .info .line2 > div { color: #40ad72; }
#view-promotion .info .line3 > div { color: #f5a036; }

#view-promotion .content {
  padding: 14px;
}
#view-promotion .shareBtnContainer {
  margin-bottom: 14px;
}
#view-promotion .shareBtn {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #8372ff 0%, #5d4ffd 100%);
  border: none;
  border-radius: 22px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(93, 79, 253, 0.4);
}
#view-promotion .promote__cell {
  background: #1c1a3f;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 14px;
}
#view-promotion .promote__cell-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
#view-promotion .promote__cell-item:last-child {
  border-bottom: none;
}
#view-promotion .promote__cell-item .label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
#view-promotion .promote__cell-item .label svg {
  width: 22px;
  height: 22px;
  fill: #8372ff;
}
#view-promotion .promote__cell-item .arrow {
  color: #7d77a8;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

#view-promotion .commission {
  background: #1c1a3f;
  border-radius: 14px;
  padding: 14px;
}
#view-promotion .commission__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}
#view-promotion .commission__title svg {
  width: 20px;
  height: 20px;
  fill: #8372ff;
}
#view-promotion .commission__body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
#view-promotion .commission__body:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
#view-promotion .commission__body > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
#view-promotion .commission__body > div span:first-of-type {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}
#view-promotion .commission__body > div span:last-of-type {
  font-size: 11px;
  color: #928cb5;
}

/* ========================================================
   MINE (ACCOUNT) OFFICIAL PURPLE THEME MATCH
   ======================================================== */
#view-mine .userInfo__container {
  width: 100%;
  background: linear-gradient(180deg, #6c52f6 0%, #4333b2 100%);
  border-radius: 0 0 24px 24px;
  padding: 16px 16px 44px;
  box-sizing: border-box;
}
#view-mine .userInfo__container-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
#view-mine .userInfo__container-content-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
#view-mine .userInfo__container-content__avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}
#view-mine .userInfo__container-content__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
#view-mine .userInfo__container-content__name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
#view-mine .userInfo__container-content-nickname {
  display: flex;
  align-items: center;
  gap: 8px;
}
#view-mine .userInfo__container-content-nickname h3 {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  margin: 0;
}
#view-mine .n0 {
  width: 54px;
  height: 22px;
  background: url(/assets/png/0-BG6QPOmD.png) no-repeat center;
  background-size: contain;
}
#view-mine .userInfo__container-content-uid {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f5a036;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}
#view-mine .userInfo__container-content-uid svg {
  width: 12px;
  height: 12px;
  fill: #fff;
  cursor: pointer;
}
#view-mine .userInfo__container-content-logintime {
  font-size: 11px;
  color: #c4bdfa;
}

#view-mine .userinfo-content {
  padding: 0 14px 20px;
  margin-top: -30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

#view-mine .totalSavings__container {
  background: #1c1a3f;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
#view-mine .totalSavings__container-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}
#view-mine .totalSavings__container-header__title {
  font-size: 11px;
  color: #928cb5;
}
#view-mine .totalSavings__container-header__subtitle {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
#view-mine .totalSavings__container-header__subtitle svg {
  width: 16px;
  height: 16px;
  fill: #8372ff;
  cursor: pointer;
}
#view-mine .comminWallet {
  background: #2c275e;
  border: 1px solid #736cb8;
  color: #e2dfff;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
#view-mine .totalSavings__container-content {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
}
#view-mine .totalSavings__container-content-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
#view-mine .totalSavings__container-content-item div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #928cb5;
  font-weight: 600;
}
#view-mine .totalSavings__container-content-item div svg {
  width: 28px;
  height: 28px;
}

#view-mine .financialServices__container-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
#view-mine .financialServices__container-box > div {
  background: #1c1a3f;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
#view-mine .financialServices__container-box > div svg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
#view-mine .financialServices__container-box-para h3 {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px 0;
}
#view-mine .financialServices__container-box-para span {
  font-size: 10px;
  color: #7d77a8;
}

#view-mine .settingPanel__container {
  background: #1c1a3f;
  border-radius: 14px;
  overflow: hidden;
}
#view-mine .settingPanel__container-items__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
#view-mine .settingPanel__container-items__item:last-child {
  border-bottom: none;
}
#view-mine .settingPanel__container-items__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
#view-mine .settingPanel__container-items__title svg {
  width: 20px;
  height: 20px;
  fill: #8372ff;
}
#view-mine .settingPanel__container-items-right {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7d77a8;
  font-size: 12px;
}
#view-mine .settingPanel__container-items-right h5 {
  background: #fd565c;
  color: #fff;
  font-size: 10px;
  border-radius: 10px;
  padding: 1px 6px;
  margin: 0;
}

#view-mine .serviceCenter-wrap {
  background: #1c1a3f;
  border-radius: 14px;
  padding: 14px;
}
#view-mine .serviceCenter__container h1 {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}
#view-mine .serviceCenter__container-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 10px;
  text-align: center;
}
#view-mine .serviceCenter__container-items__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
#view-mine .serviceCenter__container-items__item svg {
  width: 24px;
  height: 24px;
  fill: #8372ff;
}
#view-mine .serviceCenter__container-items__item span {
  font-size: 11px;
  color: #a39fed;
}
#view-mine .serviceCenter-wrap-header {
  margin-top: 16px;
}
#view-mine .serviceCenter-wrap-header button {
  width: 100%;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: #928cb5;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
#view-mine .serviceCenter-wrap-header button svg {
  width: 16px;
  height: 16px;
  fill: #928cb5;
}
"""

with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\app.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css_additions)

print("Appended polished CSS to app.css successfully!")
