import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Let's search for function calls that invoke GetLoadedSetting or use its response
m = re.findall(r'GetLoadedSetting[^\(]+\([^)]*\)', code)
print("Calls:", m[:5])

# Find where GetLoadedSetting response is handled
pos = 0
while True:
    idx = code.find('GetLoadedSetting', pos)
    if idx == -1:
        break
    print(code[max(0, idx-50):min(len(code), idx+250)])
    print("---")
    pos = idx + len('GetLoadedSetting')
