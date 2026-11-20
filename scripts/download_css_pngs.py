import re, os, urllib.request

css_files = [
    r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-promotion.css',
    r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-mine.css'
]

png_refs = set()
for fpath in css_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    urls = re.findall(r'url\((?:["\']?)(/assets/png/[^"\'\)]+)(?:["\']?)\)', c)
    png_refs.update(urls)

print("Found PNG references:", len(png_refs))
out_dir = r"c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\png"
os.makedirs(out_dir, exist_ok=True)

for path in sorted(png_refs):
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
