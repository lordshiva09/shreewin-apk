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

with open('assets/js/index-BivvZ86y.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Find all chunk paths like "assets/js/..." and "assets/css/..."
chunks = set(re.findall(r'["\'](assets/(?:js|css)/[a-zA-Z0-9_\-]+\.(?:js|css))["\']', code))
print(f"Total chunks found in index-BivvZ86y.js: {len(chunks)}", flush=True)

base_url = "https://shreewin23.site"

def fetch_chunk(rel):
    local_path = os.path.join(os.getcwd(), rel.replace('/', os.sep))
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return (rel, 'ALREADY_EXISTS')

    url_to_fetch = base_url + '/' + rel
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        req = urllib.request.Request(url_to_fetch, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
            data = resp.read()
            if len(data) > 0 and resp.status == 200:
                with open(local_path, 'wb') as out_f:
                    out_f.write(data)
                return (rel, f'DOWNLOADED {len(data)}b')
            else:
                return (rel, f'STATUS_{resp.status}')
    except Exception as e:
        return (rel, f'FAILED: {e}')

with ThreadPoolExecutor(max_workers=16) as pool:
    results = list(pool.map(fetch_chunk, list(chunks)))

downloaded = [r for r in results if 'DOWNLOADED' in r[1]]
exists = [r for r in results if r[1] == 'ALREADY_EXISTS']
failed = [r for r in results if 'FAILED' in r[1]]

print(f"Done! Downloaded: {len(downloaded)}, Already exists: {len(exists)}, Failed: {len(failed)}", flush=True)
for d in downloaded:
    print(f"  + {d[0]}: {d[1]}", flush=True)
