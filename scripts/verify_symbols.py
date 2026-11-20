with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

symbols = [
    'icon-subordinate',
    'icon-team_partner',
    'icon-copy_Code',
    'icon-team_port',
    'icon-commission',
    'icon-invite_reg',
    'icon-server',
    'icon-rebateRatio',
    'icon-promotionData',
    'icon-copy',
    'icon-wallets',
    'icon-rechargeIcon',
    'icon-widthdrawBlue',
    'icon-VipIcon',
    'icon-betHistory',
    'icon-tradeHistory',
    'icon-rechargeHistory',
    'icon-myWithdrawHistory',
    'icon-notification',
    'icon-gifts',
    'icon-tournament',
    'icon-statsIcon',
    'icon-language',
    'icon-settingCenter',
    'icon-feedback',
    'icon-notificationCenter',
    'icon-serverTicket',
    'icon-guide',
    'icon-about',
    'icon-logout',
    'icon-refreshBalance'
]

for s in symbols:
    print(s, 'EXISTS' if f'id="{s}"' in html else 'MISSING')
