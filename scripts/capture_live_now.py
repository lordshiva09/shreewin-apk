import json, time
import websocket

WS = "ws://localhost:9222/devtools/page/27AD0BE7EC5DA3AAD14B74A2ECC13258"

def run_cmd(ws, method, params=None, _id=1):
    ws.send(json.dumps({"id": _id, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == _id:
            return msg

# Capture home page
ws = websocket.create_connection(WS, suppress_origin=True)
run_cmd(ws, "Page.navigate", {"url": "https://shreewin23.site/#/"}, 1)
time.sleep(3)
r = run_cmd(ws, "Page.captureScreenshot", {"format": "png", "quality": 90}, 2)
ws.close()

import base64
data = r["result"]["data"]
out_path = r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\live_home_now.png"
with open(out_path, "wb") as f:
    f.write(base64.b64decode(data))
print(f"Saved: {out_path}")

# Capture wingo page
ws2 = websocket.create_connection(WS, suppress_origin=True)
run_cmd(ws2, "Page.navigate", {"url": "https://shreewin23.site/#/game/WinGo?id=10&issue=&typeId=1&type=4"}, 1)
time.sleep(4)
r2 = run_cmd(ws2, "Page.captureScreenshot", {"format": "png", "quality": 90}, 2)
ws2.close()

data2 = r2["result"]["data"]
out2 = r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\live_wingo_now.png"
with open(out2, "wb") as f:
    f.write(base64.b64decode(data2))
print(f"Saved: {out2}")

# Capture mine page
ws3 = websocket.create_connection(WS, suppress_origin=True)
run_cmd(ws3, "Page.navigate", {"url": "https://shreewin23.site/#/mine"}, 1)
time.sleep(3)
r3 = run_cmd(ws3, "Page.captureScreenshot", {"format": "png", "quality": 90}, 2)
ws3.close()

data3 = r3["result"]["data"]
out3 = r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\live_mine_now.png"
with open(out3, "wb") as f:
    f.write(base64.b64decode(data3))
print(f"Saved: {out3}")

print("All captures done!")
