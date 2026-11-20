with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_full_body.html', 'r', encoding='utf-8') as f:
    mine_body = f.read()

import re
# Find all div classes inside mine_body
classes = set(re.findall(r'class="([^"]+)"', mine_body))
print("Classes in mine body:", len(classes))
for c in sorted(classes):
    print(" ", c)
