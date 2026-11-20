import re

def inspect_file(filename, output_name):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # remove svg sprite definitions to make it compact
    html_clean = re.sub(r'<svg xmlns=[\s\S]*?</svg>', '', html, flags=re.I)
    
    # find main app content
    app_match = re.search(r'<div id="app"[^>]*>([\s\S]*?)<div id="popup-container">', html_clean)
    if not app_match:
        app_match = re.search(r'<div id="app"[^>]*>([\s\S]*)', html_clean)
        
    if app_match:
        content = app_match.group(1)
        with open(output_name, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f"Saved {output_name}, length: {len(content)}")
    else:
        print(f"Could not find app in {filename}")

inspect_file(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\shreewin_live_promo.html', 
             r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\promo_app_clean.html')

inspect_file(r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\shreewin_live_mine.html', 
             r'C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\mine_app_clean.html')
