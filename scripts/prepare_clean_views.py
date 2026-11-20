import re

# Read clean promo body
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\promo_full_body.html', 'r', encoding='utf-8') as f:
    promo_raw = f.read()

# Read clean mine body
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_full_body.html', 'r', encoding='utf-8') as f:
    mine_raw = f.read()

# Let's clean data-v attributes
clean_promo = re.sub(r'\s*data-v-[a-z0-9]+=""', '', promo_raw)
clean_mine = re.sub(r'\s*data-v-[a-z0-9]+=""', '', mine_raw)

# Save for reference
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clean_promo_ready.html', 'w', encoding='utf-8') as out:
    out.write(clean_promo)

with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clean_mine_ready.html', 'w', encoding='utf-8') as out:
    out.write(clean_mine)

print("Promo ready length:", len(clean_promo))
print("Mine ready length:", len(clean_mine))
