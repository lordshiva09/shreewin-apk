import urllib.request, os

vip_pngs = [
    '0-BG6QPOmD.png',
    '1-Cx7tGjnc.png',
    '2-DSernNVr.png',
    '3-BcJpLSeh.png',
    '4-CUhm8sT6.png',
    '5-CrVoNhwK.png',
    '6-CCzRU1dM.png',
    '7-CUIdRk8a.png',
    '8-DZMegZRt.png',
    '9-BeIDzsUE.png',
    '10-CQvZLiXE.png'
]

out_dir = r"c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\png"
for fname in vip_pngs:
    local_path = os.path.join(out_dir, fname)
    if not os.path.exists(local_path):
        url = "https://shreewin23.site/assets/png/" + fname
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp, open(local_path, 'wb') as out:
                out.write(resp.read())
            print(f"Downloaded: {fname}")
        except Exception as e:
            print(f"Failed {fname}: {e}")
    else:
        print(f"Already exists: {fname}")
