with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_app_clean.html', 'r', encoding='utf-8') as f:
    mine_html = f.read()

import re
app_content = re.search(r'<div data-v-[^>]*class="mine[^>]*>[\s\S]*?(?=<div class="tabbar__container)', mine_html)
if not app_content:
    app_content = re.search(r'(<div[^>]*class="mine-container[\s\S]*?)(?=<div[^>]*class="tabbar)', mine_html)

if app_content:
    print("Found mine content, length:", len(app_content.group(0)))
    with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_section.html', 'w', encoding='utf-8') as out:
        out.write(app_content.group(0))
else:
    # write entire content between loading view and tabbar
    start = mine_html.find('class="user-info')
    if start == -1:
        start = mine_html.find('MEMBERD46ABGUH')
        print("Found MEMBERD46ABGUH at:", start)
        sub = mine_html[max(0, start-500):start+3000]
        with open(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_section.html', 'w', encoding='utf-8') as out:
            out.write(sub)
print("Done inspecting mine")
