import re

with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\index-Cet_viqA.css', 'r', encoding='utf-8') as f:
    cet = f.read()

clean_cet = re.sub(r'\[data-v-[a-z0-9]+\]', '', cet)
with open(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-mine.css', 'a', encoding='utf-8') as f:
    f.write('\n\n/* From index-Cet_viqA.css */\n' + clean_cet)

print("Appended cleaned index-Cet_viqA.css into clean-mine.css!")
