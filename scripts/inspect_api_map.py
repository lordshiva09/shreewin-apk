import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

m = re.search(r'Login:"/Login"[^}]+}', code)
if m:
    print("Found API mapping:")
    print(m.group(0)[:1500])
