import subprocess, os

# We can create a quick script that scrolls or captures full-page screenshot
# Edge supports --force-device-scale-factor or we can inject a scroll script
scroll_test_html = r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\scripts\capture_scrolled.py'

script_content = """
import subprocess, os

edge = r'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
out = r'C:\\Users\\Pawan kumar\\.gemini\\antigravity\\brain\\d1514078-c51d-4afd-bef5-249e0febc2df\\edge_promo_scrolled.png'
if os.path.exists(out): os.remove(out)

# We can capture with a taller window size (e.g. 412, 1400) to see the entire scrolled page at once!
cmd = [edge, '--headless', f'--screenshot={out}', '--window-size=412,1300', 'http://localhost:4040/#/promotion']
subprocess.run(cmd, capture_output=True)
print('Scrolled capture exists:', os.path.exists(out))
"""

with open(scroll_test_html, 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Created capture_scrolled.py")
