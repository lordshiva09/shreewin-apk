import re

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Let's search for strings with 'GetUserInfo' or 'Login' or 'Register' or 'Game' or 'WinGo' or 'Lottery'
terms = ['GetUserInfo', 'Login', 'Register', 'WinGo', 'Bet', 'Recharge', 'Withdraw', 'GameHistory', 'Issue']
for t in terms:
    pos = 0
    found = 0
    while True:
        idx = code.find(t, pos)
        if idx == -1 or found > 3:
            break
        print(f"Match for {t}: {code[max(0, idx-50):min(len(code), idx+100)]}")
        pos = idx + len(t)
        found += 1
