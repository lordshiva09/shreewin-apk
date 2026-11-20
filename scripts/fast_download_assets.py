import re
import os
import urllib.request
import ssl
from concurrent.futures import ThreadPoolExecutor

ctx = ssl._create_unverified_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://shreewin23.site/'
}

css_file = 'assets/css/index-Bp99Xmm8.css'
js_file = 'assets/js/index-BivvZ86y.js'
html_file = 'index.html'

urls = set()

for fpath in [css_file, js_file, html_file]:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for m in re.finditer(r'(/assets/[a-zA-Z0-9_\-\./]+\.(?:png|jpg|jpeg|svg|webp|gif|mp3|wav|ico|woff2?|ttf))', content):
            urls.add(m.group(1))
        for m in re.finditer(r'(/ar101/[a-zA-Z0-9_\-\./]+\.(?:png|jpg|jpeg|svg|webp|gif|ico))', content):
            urls.add(m.group(1))

print(f"Total potential asset paths found: {len(urls)}", flush=True)

base_url = "https://shreewin23.site"

def fetch_asset(u):
    clean_u = u.split('?')[0].split('#')[0]
    local_rel = clean_u.lstrip('/')
    local_path = os.path.join(os.getcwd(), local_rel.replace('/', os.sep))
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return (clean_u, 'ALREADY_EXISTS')

    url_to_fetch = base_url + clean_u
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        req = urllib.request.Request(url_to_fetch, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=3) as resp:
            data = resp.read()
            if len(data) > 0 and resp.status == 200:
                with open(local_path, 'wb') as out_f:
                    out_f.write(data)
                return (clean_u, f'DOWNLOADED {len(data)}b')
    except Exception as e:
        return (clean_u, f'FAILED')

with ThreadPoolExecutor(max_workers=16) as pool:
    results = list(pool.map(fetch_asset, list(urls)))

downloaded = [r for r in results if 'DOWNLOADED' in r[1]]
exists = [r for r in results if r[1] == 'ALREADY_EXISTS']
failed = [r for r in results if r[1] == 'FAILED']

print(f"Done! Downloaded: {len(downloaded)}, Already exists: {len(exists)}, Not on server: {len(failed)}", flush=True)
for d in downloaded:
    print(f"  + {d[0]}: {d[1]}", flush=True)
