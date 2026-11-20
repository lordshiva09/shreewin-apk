import re

agency_css = """
/* ========================================================
   EXACT LIVE AGENCY (PROMOTION) SCREEN MATCH
   ======================================================== */
.agency-navbar {
  width: 100%;
  height: 46px;
  background: #15132b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}
.agency-navbar__left {
  width: 24px;
}
.agency-navbar__title {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  flex: 1;
}
.agency-navbar__right {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.agency-navbar__right svg {
  width: 22px;
  height: 22px;
  fill: #857aff;
}

.agency-hero {
  background-image: url(/assets/png/promotionbg-CsE_DCu0.png), linear-gradient(180deg, #745df6 0%, #4c3bbd 65%, #15132b 100%);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover, 100% 100%;
  border-radius: 0 0 24px 24px;
  padding: 16px 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}
.agency-hero__amount {
  font-size: 38px;
  font-weight: 700;
  color: #ffffff;
  margin: 4px 0 6px 0;
  line-height: 1;
}
.agency-hero__badge {
  background: rgba(30, 26, 68, 0.65);
  color: #a39fed;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  display: inline-block;
}
.agency-hero__tip {
  font-size: 11.5px;
  color: #c4bdfa;
  margin-bottom: 16px;
}

.agency-table-card {
  width: 100%;
  max-width: 410px;
  background: #1c1a3f;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  box-sizing: border-box;
}
.agency-table-header {
  display: flex;
  height: 42px;
  line-height: 42px;
  background: #14122e;
}
.agency-table-th {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}
.agency-table-th.direct {
  color: #5cdbd3;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.agency-table-th.team {
  color: #ffffff;
}

.agency-table-body {
  display: flex;
  flex-direction: column;
}
.agency-table-row {
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.agency-table-row:last-child {
  border-bottom: none;
}
.agency-table-cell {
  flex: 1;
  padding: 10px 4px;
  text-align: center;
}
.agency-table-cell.direct {
  border-right: 1px solid rgba(255,255,255,0.06);
}
.agency-table-cell .val {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 3px;
}
.agency-table-cell .val.green {
  color: #18b660;
}
.agency-table-cell .val.gold {
  color: #f5a036;
}
.agency-table-cell .lbl {
  font-size: 10.5px;
  color: #928cb5;
  line-height: 1.2;
}

.agency-content {
  padding: 14px 14px 24px;
  box-sizing: border-box;
}
.agency-btn-wrap {
  margin-bottom: 14px;
}
.agency-btn-invite {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(90deg, #8372ff 0%, #5d4ffd 100%);
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(93, 79, 253, 0.4);
}

.agency-menu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}
.agency-card-item {
  background: #1c1a3f;
  border-radius: 14px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  box-sizing: border-box;
  transition: transform 0.15s ease, background 0.15s ease;
}
.agency-card-item:active {
  transform: scale(0.99);
  background: #252254;
}
.agency-card-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.agency-card-icon {
  width: 24px;
  height: 24px;
  fill: #8372ff;
  flex-shrink: 0;
}
.agency-card-text {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
}
.agency-chevron {
  width: 16px;
  height: 16px;
  color: #7d77a8;
  stroke: #7d77a8;
}
.agency-card-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.agency-code-text {
  font-size: 13px;
  font-weight: 600;
  color: #92a8e3;
}
.agency-copy-icon {
  width: 15px;
  height: 15px;
  fill: #92a8e3;
  cursor: pointer;
}

.agency-promo-data {
  background: #1c1a3f;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  box-sizing: border-box;
  margin-bottom: 16px;
}
.agency-promo-data__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}
.agency-promo-data__grid {
  display: flex;
  flex-direction: column;
}
.agency-promo-data__row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.agency-promo-data__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.agency-promo-data__divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.06);
}
.agency-promo-data__row-line {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 12px 0;
}
.agency-promo-data__col .num {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}
.agency-promo-data__col .desc {
  font-size: 11px;
  color: #928cb5;
}
"""

css_path = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\app.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old #view-promotion custom styles to avoid conflicts
css = re.sub(r'/\* Navbar Agency \*/[\s\S]*?(?=/\* ========================================================|\Z)', '', css)
css += '\n' + agency_css

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("app.css updated with exact agency classes!")
