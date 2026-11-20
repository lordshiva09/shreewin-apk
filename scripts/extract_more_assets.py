import re
import os
import urllib.request
import ssl

ctx = ssl._create_unverified_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://shreewin23.site/'
}

css_file = 'assets/css/index-Bp99Xmm8.css'
js_file = 'assets/js/index-BivvZ86y.js'

urls = set()

if os.path.exists(css_file):
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    found = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', content)
    for u in found:
        if not u.startswith('data:'):
            urls.add(u)

if os.path.exists(js_file):
    with open(js_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    found = re.findall(r'["\'](/assets/[^"\']+\.(?:png|jpg|jpeg|svg|webp|gif|mp3|wav|ico))["\']', content)
    for u in found:
        urls.add(u)
    found2 = re.findall(r'["\'](/ar101/[^"\']+\.(?:png|jpg|jpeg|svg|webp|gif|ico))["\']', content)
    for u in found2:
        urls.add(u)

print(f"Total unique assets found: {len(urls)}")

base_url = "https://shreewin23.site"
downloaded = 0
failed = 0

for u in sorted(urls):
    clean_u = u.split('?')[0].split('#')[0]
    if clean_u.startswith('http'):
        url_to_fetch = clean_u
        local_rel = clean_u.replace('https://shreewin23.site/', '')
    elif clean_u.startswith('/'):
        url_to_fetch = base_url + clean_u
        local_rel = clean_u.lstrip('/')
    else:
        url_to_fetch = base_url + '/' + clean_u
        local_rel = clean_u

    local_path = os.path.join(os.getcwd(), local_rel.replace('/', os.sep))
    
    if os.path.exists(local_path):
        continue

    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        req = urllib.request.Request(url_to_fetch, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
            data = resp.read()
            if len(data) > 0 and resp.status == 200:
                with open(local_path, 'wb') as out_f:
                    out_f.write(data)
                downloaded += 1
                print(f"OK: {clean_u} ({len(data)} bytes)")
    except Exception as e:
        failed += 1

print(f"Done! Downloaded: {downloaded}, Existed/Failed: {len(urls) - downloaded}")
