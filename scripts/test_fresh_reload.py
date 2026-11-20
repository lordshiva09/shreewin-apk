import json, time, base64
import websocket

WS = "ws://localhost:9222/devtools/page/27AD0BE7EC5DA3AAD14B74A2ECC13258"

def run_cmd(ws, method, params=None, _id=1):
    ws.send(json.dumps({"id": _id, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == _id:
            return msg

ws = websocket.create_connection(WS, suppress_origin=True)

# 1. Test Promotion
run_cmd(ws, "Page.navigate", {"url": "http://localhost:4040/#/promotion"}, 1)
time.sleep(1)
run_cmd(ws, "Page.reload", {"ignoreCache": True}, 2)
time.sleep(2)
r = run_cmd(ws, "Page.captureScreenshot", {"format": "png", "quality": 90}, 3)
with open(r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clone_promo_fresh.png", "wb") as f:
    f.write(base64.b64decode(r["result"]["data"]))
print("Saved clone_promo_fresh.png")

# 2. Test Mine
run_cmd(ws, "Page.navigate", {"url": "http://localhost:4040/#/mine"}, 4)
time.sleep(1)
run_cmd(ws, "Page.reload", {"ignoreCache": True}, 5)
time.sleep(2)
r = run_cmd(ws, "Page.captureScreenshot", {"format": "png", "quality": 90}, 6)
with open(r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clone_mine_fresh.png", "wb") as f:
    f.write(base64.b64decode(r["result"]["data"]))
print("Saved clone_mine_fresh.png")

ws.close()
