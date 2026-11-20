import re, urllib.request, os

css_files = set()
for html_file in [r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\shreewin_live_promo.html',
                  r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\shreewin_live_mine.html']:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    links = re.findall(r'href="(/assets/css/[^"]+)"', content)
    css_files.update(links)

print("Found CSS files in live HTMLs:", len(css_files))
out_dir = r"c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css"

for path in sorted(css_files):
    fname = os.path.basename(path)
    local_path = os.path.join(out_dir, fname)
    if not os.path.exists(local_path):
        url = "https://shreewin23.site" + path
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp, open(local_path, 'wb') as out:
                out.write(resp.read())
            print(f"Downloaded: {fname}")
        except Exception as e:
            print(f"Failed {fname}: {e}")
    else:
        print(f"Already exists: {fname}")
