import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('jae+Hae+e')
snippet = code[max(0, idx-1000):idx]
for var in ['jae', 'Hae']:
    m = re.findall(rf'(?:const|let|var)\s+{var}\s*=\s*[^;]+;', snippet)
    if m:
        print(f"Declaration of {var}:", m[-1])
    else:
        # search whole file
        all_m = re.findall(rf'(?:const|let|var)\s+{var}\s*=\s*[^;]+;', code)
        print(f"Global declaration of {var}:", all_m)
