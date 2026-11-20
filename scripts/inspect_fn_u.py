import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('vae=async(e,t)=>U(')
if idx != -1:
    print(code[max(0, idx-400):idx+100])
