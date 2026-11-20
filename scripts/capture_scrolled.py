
import subprocess, os

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
out = r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\edge_promo_scrolled.png'
if os.path.exists(out): os.remove(out)

# We can capture with a taller window size (e.g. 412, 1400) to see the entire scrolled page at once!
cmd = [edge, '--headless', f'--screenshot={out}', '--window-size=412,1300', 'http://localhost:4040/#/promotion']
subprocess.run(cmd, capture_output=True)
print('Scrolled capture exists:', os.path.exists(out))
