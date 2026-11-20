import json, time, base64
import websocket

WS = "ws://localhost:9222/devtools/page/27AD0BE7EC5DA3AAD14B74A2ECC13258"

try:
    ws = websocket.create_connection(WS, suppress_origin=True)
    def run_cmd(ws, method, params=None, _id=1):
        ws.send(json.dumps({"id": _id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == _id:
                return msg

    run_cmd(ws, "Page.navigate", {"url": "http://localhost:4040/#/promotion"}, 1)
    time.sleep(1)
    run_cmd(ws, "Page.reload", {"ignoreCache": True}, 2)
    time.sleep(2)
    r = run_cmd(ws, "Page.captureScreenshot", {"format": "png", "quality": 90}, 3)
    ws.close()

    out_path = r"C:\Users\Pawan kumar\.gemini\antigravity\brain\d1514078-c51d-4afd-bef5-249e0febc2df\current_clone_promo.png"
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(r["result"]["data"]))
    print("Screenshot saved to:", out_path)
except Exception as e:
    print("Error connecting to CDP:", e)
    # Check if there are other pages in localhost:9222
    import urllib.request
    try:
        req = urllib.request.urlopen("http://localhost:9222/json")
        pages = json.loads(req.read().decode('utf-8'))
        print("Available pages on 9222:")
        for p in pages:
            print(" -", p.get("title"), p.get("webSocketDebuggerUrl"))
    except Exception as e2:
        print("Error getting json list:", e2)
