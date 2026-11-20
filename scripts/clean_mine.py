with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_full_body.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Let's clean data-v attributes to make it neat
clean = re.sub(r'\s*data-v-[a-z0-9]+=""', '', text)
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_clean.html', 'w', encoding='utf-8') as out:
    out.write(clean)

print("Saved mine_clean.html, length:", len(clean))
