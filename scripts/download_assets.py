import os, ssl, urllib.request

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

files = [
    ('/assets/css/index-Bp99Xmm8.css', 'assets/css/index-Bp99Xmm8.css'),
    ('/assets/js/index-BivvZ86y.js', 'assets/js/index-BivvZ86y.js'),
    ('/assets/js/xhr-interceptor.js', 'assets/js/xhr-interceptor.js'),
    ('/web/config?_key=ar101', 'web/config.js'),
    ('/favico.ico', 'favico.ico'),
    ('/icon-192x192.png', 'icon-192x192.png')
]

base = 'https://shreewin23.site'

for remote_path, local_path in files:
    os.makedirs(os.path.dirname(local_path) if os.path.dirname(local_path) else '.', exist_ok=True)
    url = base + remote_path
    print('Downloading:', url, '->', local_path)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as r:
            data = r.read()
            with open(local_path, 'wb') as f:
                f.write(data)
            print('  Saved', len(data), 'bytes')
    except Exception as e:
        print('  Failed:', e)

print('All assets downloaded!')
