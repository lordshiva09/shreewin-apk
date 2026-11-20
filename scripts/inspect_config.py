import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'window\.CONFIG\s*=\s*Object\.freeze\(({[\s\S]*?})\);', html)
if m:
    print(m.group(1))
