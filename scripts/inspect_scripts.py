import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# find all scripts
scripts = re.findall(r'<script[^>]*>.*?</script>', html, re.DOTALL)
print(f"Total script tags: {len(scripts)}")
for s in scripts:
    if len(s) < 300:
        print(s)
    else:
        print(s[:150] + ' ... ' + s[-80:])
