import json, time, re
import websocket

WS = "ws://localhost:9222/devtools/page/27AD0BE7EC5DA3AAD14B74A2ECC13258"

def run_cmd(ws, method, params=None, _id=1):
    ws.send(json.dumps({"id": _id, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == _id:
            return msg

ws = websocket.create_connection(WS, suppress_origin=True)
run_cmd(ws, "Page.navigate", {"url": "https://shreewin23.site/#/"}, 1)
time.sleep(4)

# Get all banner image sources and game category URLs
r = run_cmd(ws, "Runtime.evaluate", {"expression": """
(function() {
    var banners = Array.from(document.querySelectorAll('.van-swipe img, .swiper-slide img, [class*="banner"] img')).map(i => i.src);
    var gameIcons = Array.from(document.querySelectorAll('[class*="category"] img, [class*="game-icon"] img, .homeGameList img')).map(i => ({src: i.src, alt: i.alt}));
    var allImgs = Array.from(document.querySelectorAll('img')).slice(0, 60).map(i => ({src: i.src, alt: i.alt, cls: i.className}));
    return JSON.stringify({banners, gameIcons, allImgs});
})()
"""}, 2)
ws.close()

result = json.loads(r["result"]["result"]["value"])
print("=== BANNERS ===")
for b in result["banners"][:10]:
    print(b)
print("\n=== GAME ICONS ===")
for g in result["gameIcons"][:20]:
    print(g)
print("\n=== ALL IMGS (first 30) ===")
for img in result["allImgs"][:30]:
    print(img)
