import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('jae+Hae+e')
if idx != -1:
    print(code[max(0, idx-200):idx+100])
