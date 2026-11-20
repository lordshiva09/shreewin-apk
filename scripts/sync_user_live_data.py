import json

data_path = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\shreewin_data.json'
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for u in data['users']:
    if u['phone'] == '9594558820':
        u['balance'] = 50.00
        u['uid'] = '6130903'
        u['nickname'] = 'MEMBERD46ABGUH'
        u['inviteCode'] = '3180606130902'
        u['vipLevel'] = 0

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated user 9594558820 to UID 6130903, Balance ₹50.00, VIP 0, InviteCode 3180606130902!")
