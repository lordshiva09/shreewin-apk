import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

matches = [m.start() for m in re.finditer(r'(?:const|let|var)\s+U\s*=', code)]
for idx in matches[:5]:
    print(code[idx:idx+250])
    print("---")
