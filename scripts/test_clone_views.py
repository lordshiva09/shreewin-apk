import json, time, base64
import websocket

WS = "ws://localhost:9222/devtools/page/27AD0BE7EC5DA3AAD14B74A2ECC13258"

def run_cmd(ws, method, params=None, _id=1):
    ws.send(json.dumps({"id": _id, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == _id:
            return msg

pages = [
    ("http://localhost:4040/#/promotion", r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clone_promotion_test.png"),
    ("http://localhost:4040/#/mine", r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clone_mine_test.png"),
    ("http://localhost:4040/#/home", r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\clone_home_test.png"),
]

for url, out_path in pages:
    ws = websocket.create_connection(WS, suppress_origin=True)
    run_cmd(ws, "Page.navigate", {"url": url}, 1)
    time.sleep(2)
    # capture full viewport
    r = run_cmd(ws, "Page.captureScreenshot", {"format": "png", "quality": 90}, 2)
    ws.close()
    data = r["result"]["data"]
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(data))
    print(f"Captured: {out_path}")

print("All test captures complete!")
