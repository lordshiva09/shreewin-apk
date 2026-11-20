import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Search for response interception or error handling
matches = re.findall(r'(\.code\s*===?\s*[0-9]+|\.code\s*!==?\s*[0-9]+)', code)
print("Code checks:", set(matches))

# Look for data structure in GetLoadedSetting or GetUserInfo
for term in ['GetLoadedSetting', 'GetUserInfo', 'loginSuccess']:
    idx = code.find(term)
    if idx != -1:
        print(f"Around {term}:")
        print(code[max(0, idx-100):min(len(code), idx+300)])
