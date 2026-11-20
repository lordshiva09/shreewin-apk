import json

data_path = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\shreewin_data.json'
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['users'][0]['balance'] = 50.00
data['users'][0]['uid'] = '6130903'
data['users'][0]['nickname'] = 'MEMBERD46ABGUH'
data['users'][0]['inviteCode'] = '3180606130902'
data['users'][0]['vipLevel'] = 0

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Directly updated users[0]:", data['users'][0])
