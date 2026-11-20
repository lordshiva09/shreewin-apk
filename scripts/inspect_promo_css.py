with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-promotion.css', 'r', encoding='utf-8') as f:
    promo_css = f.read()

import re
selectors = re.findall(r'([^{}]+)\{', promo_css)
print("Total rule blocks in clean-promotion.css:", len(selectors))
for s in selectors[:25]:
    print(" -", s.strip())
