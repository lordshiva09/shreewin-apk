with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clean_mine_ready.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Let's clean up and make a nice formatted block for mine
text = text.replace('class="navbar__content-right"></div></div></div></div>', '')
with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\formatted_mine.html', 'w', encoding='utf-8') as out:
    out.write(text)

print("Formatted mine saved!")
