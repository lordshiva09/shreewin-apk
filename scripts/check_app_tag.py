with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\shreewin_live_mine.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
m = re.search(r'<div[^>]*id=["\']app["\'][^>]*>', html)
print('App tag:', m.group(0) if m else 'None')
