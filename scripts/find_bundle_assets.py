import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

matches = re.findall(r'/assets/[^"\'\s()]+\.(?:png|webp|svg|jpg|jpeg|gif|ico|woff2?)', js)
uniq = sorted(list(set(matches)))
print('Total unique assets in index-BivvZ86y.js:', len(uniq))
print('Sample 20:')
for u in uniq[:20]:
    print(' ', u)

with open('detected_assets.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(uniq))
