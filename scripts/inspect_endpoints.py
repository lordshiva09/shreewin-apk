import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

endpoints = set(re.findall(r'[\'\"`](/(?:api|Tarun|webapi)/[^\'\"`\s\?]+)[\'\"`]', code))
print('Endpoints found:', len(endpoints))
with open('endpoints.txt', 'w', encoding='utf-8') as out:
    for ep in sorted(endpoints):
        out.write(ep + '\n')
        print(' ', ep)
