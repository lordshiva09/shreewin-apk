with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
icons = ['icon-team_partner', 'icon-copy_Code', 'icon-team_port', 'icon-commission', 'icon-invite_reg', 'icon-server', 'icon-rebateRatio', 'icon-promotionData', 'icon-subordinate']
for ic in icons:
    m = re.search(rf'<symbol id="{ic}"[^>]*>([\s\S]*?)</symbol>', html)
    if m:
        print(f'=== {ic} ===')
        print(m.group(0)[:180] + '...')
    else:
        print(f'{ic} NOT FOUND')
