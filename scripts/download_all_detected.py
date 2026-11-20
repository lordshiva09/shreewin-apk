import os, ssl, urllib.request, time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base = 'https://shreewin23.site'

with open('detected_assets.txt', 'r', encoding='utf-8') as f:
    paths = [line.strip() for line in f if line.strip()]

print(f'Starting download of {len(paths)} real Shreewin assets...')

success = 0
failed = 0

for p in paths:
    # local path strip leading slash
    local_path = p.lstrip('/')
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    url = base + p
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = r.read()
            with open(local_path, 'wb') as f_out:
                f_out.write(data)
            success += 1
            print(f'[{success}/{len(paths)}] OK: {p} ({len(data)} B)')
    except Exception as e:
        failed += 1
        print(f'FAILED: {p} -> {e}')
    time.sleep(0.05)

print(f'\nDownload complete! Success: {success}, Failed: {failed}')
