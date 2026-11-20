import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('jae=')
if idx != -1:
    print("jae=: ", code[idx:idx+100])
idx2 = code.find('Hae=')
if idx2 != -1:
    print("Hae=: ", code[idx2:idx2+100])
