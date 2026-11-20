import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

symbols = re.findall(r'<symbol\s+id=["\']([^"\']+)["\']', html)
print(f"Total symbols in index.html: {len(symbols)}")
with open('symbols.txt', 'w', encoding='utf-8') as out:
    for s in symbols:
        out.write(s + '\n')

for s in symbols[:40]:
    print(" ", s)
