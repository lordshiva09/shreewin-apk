with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_app_clean.html', 'r', encoding='utf-8') as f:
    mine_html = f.read()

import re
# Find start of main content in mine
start_idx = mine_html.find('class="userInfo__container-content"')
if start_idx != -1:
    end_idx = mine_html.find('class="tabbar__container')
    mine_body = mine_html[start_idx-100:end_idx]
    with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_full_body.html', 'w', encoding='utf-8') as out:
        out.write(mine_body)
    print("Extracted mine_full_body.html, length:", len(mine_body))

# Also extract full promo body
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\promo_app_clean.html', 'r', encoding='utf-8') as f:
    promo_html = f.read()

start_p = promo_html.find('class="navbar white"')
end_p = promo_html.find('class="customer"')
if start_p != -1 and end_p != -1:
    promo_body = promo_html[start_p:end_p]
    with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\promo_full_body.html', 'w', encoding='utf-8') as out:
        out.write(promo_body)
    print("Extracted promo_full_body.html, length:", len(promo_body))
