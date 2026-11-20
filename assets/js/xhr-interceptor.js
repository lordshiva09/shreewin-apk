/**
 * ============================================================
 * xhr-interceptor.js — Transparent AES-256-GCM for Axios/XHR
 * ============================================================
 * Yeh script Vue app se PEHLE load hota hai.
 * Axios (ya koi bhi XHR) ke saare /Tarun/api/webapi/* calls
 * automatically encrypt ho jaate hain — bina Vue code touch kiye.
 *
 * HTML me add karo SABSE PEHLE:
 *   <script src="/assets/js/xhr-interceptor.js"></script>
 *   <script type="module" src="/assets/js/index-BivvZ86y.js"></script>
 * ============================================================
 */

(async () => {
  'use strict';

  // ============================================================
  // CONFIG — kaunse URLs encrypt karni hain
  // ============================================================
  const ENCRYPT_URL_PATTERNS = [
    '/Tarun/api/webapi/',
    '/api/Lottery/',
    '/api/Common/',
    '/jdbapi/',
  ];

  const HANDSHAKE_URL = '/Tarun/api/webapi/Handshake.php';

  // Yeh URLs SKIP karo (encrypt mat karo)
  const SKIP_URLS = [
    'Handshake.php',
    '/cdn-cgi/',
    'cloudflare',
    '.woff', '.otf', '.ttf', '.png', '.jpg', '.svg', '.ico',
  ];

  // ============================================================
  // SESSION STATE — memory only
  // ============================================================
  let _sid = null;       // sessionId (server se mila)
  let _ck  = null;       // CryptoKey (non-extractable)
  let _exp = 0;          // expiresAt (unix seconds)
  let _hsPromise = null; // dedup concurrent handshakes

  // ============================================================
  // HELPERS
  // ============================================================
  const _b64enc = u => btoa(String.fromCharCode(...u));
  const _b64dec = s => { const b=atob(s); const u=new Uint8Array(b.length); for(let i=0;i<b.length;i++) u[i]=b.charCodeAt(i); return u; };
  const _nonce  = () => { const b=new Uint8Array(16); crypto.getRandomValues(b); return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join(''); };

  // ============================================================
  // AES-256-GCM ENCRYPT
  // Format: base64(iv) + "." + base64(tag) + "." + base64(ct)
  // ============================================================
  async function _encrypt(obj) {
    const plain = typeof obj === 'string' ? obj : JSON.stringify(obj);
    const iv    = new Uint8Array(12);
    crypto.getRandomValues(iv);
    const ctTag  = await crypto.subtle.encrypt({ name:'AES-GCM', iv, tagLength:128 }, _ck, new TextEncoder().encode(plain));
    const bytes  = new Uint8Array(ctTag);
    const tag    = bytes.slice(bytes.length - 16);
    const ct     = bytes.slice(0, bytes.length - 16);
    return _b64enc(iv) + '.' + _b64enc(tag) + '.' + _b64enc(ct);
  }

  // ============================================================
  // AES-256-GCM DECRYPT
  // ============================================================
  async function _decrypt(encStr) {
    const p = encStr.split('.');
    if (p.length !== 3) throw new Error('Bad encryptString');
    const iv  = _b64dec(p[0]);
    const tag = _b64dec(p[1]);
    const ct  = _b64dec(p[2]);
    const combined = new Uint8Array(ct.length + tag.length);
    combined.set(ct); combined.set(tag, ct.length);
    const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv, tagLength:128 }, _ck, combined);
    return new TextDecoder().decode(plain);
  }

  // ============================================================
  // HANDSHAKE
  // ============================================================
  async function _handshake() {
    if (_hsPromise) return _hsPromise;

    _hsPromise = (async () => {
      try {
        const raw = new Uint8Array(32);
        crypto.getRandomValues(raw);

        // Non-extractable CryptoKey — DevTools dump nahi kar sakta
        const ck = await crypto.subtle.importKey(
          'raw', raw, { name:'AES-GCM', length:256 }, false, ['encrypt','decrypt']
        );

        // Native fetch use karo (intercepted XHR avoid karo)
        const res = await _nativeFetch(HANDSHAKE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientKey: _b64enc(raw), clientId: _nonce() }),
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Handshake HTTP ' + res.status);
        const data = await res.json();
        if (data.code !== 0 || !data.data?.sessionId) throw new Error(data.msg || 'Handshake failed');

        _sid = data.data.sessionId;
        _ck  = ck;
        _exp = data.data.expiresAt || (Math.floor(Date.now()/1000) + 3600);

        // Auto-renew 5 min pehle
        const delay = (_exp - 300 - Math.floor(Date.now()/1000)) * 1000;
        if (delay > 0) setTimeout(() => { _sid=null; _ck=null; _handshake(); }, delay);

        console.log('[ENC] Session ready ✅');
        return true;
      } catch(e) {
        console.warn('[ENC] Handshake failed:', e.message);
        throw e;
      } finally {
        _hsPromise = null;
      }
    })();

    return _hsPromise;
  }

  async function _ensureSession() {
    if (_sid && _ck && _exp > Math.floor(Date.now()/1000) + 30) return;
    await _handshake();
  }

  // ============================================================
  // URL MATCHERS
  // ============================================================
  function _shouldEncrypt(url) {
    if (!url) return false;
    // Skip list
    if (SKIP_URLS.some(s => url.includes(s))) return false;
    // Must match at least one encrypt pattern
    return ENCRYPT_URL_PATTERNS.some(p => url.includes(p));
  }

  // ============================================================
  // Save native fetch BEFORE any override
  // ============================================================
  const _nativeFetch = window.fetch.bind(window);

  // ============================================================
  // INTERCEPT fetch() — Vue/Axios dono ke liye
  // ============================================================
  window.fetch = async function(input, init = {}) {
    const url = typeof input === 'string' ? input : (input?.url || '');

    if (!_shouldEncrypt(url)) {
      return _nativeFetch(input, init);
    }

    // Ensure session ready
    try { await _ensureSession(); }
    catch(e) { return _nativeFetch(input, init); } // fallback plain

    // Get request body
    let bodyData = {};
    if (init.body) {
      try { bodyData = JSON.parse(init.body); }
      catch(e) { bodyData = init.body; }
    }

    // Encrypt
    const envelope = typeof bodyData === 'object' 
      ? { ...bodyData, _nonce: _nonce(), _timestamp: Math.floor(Date.now()/1000) }
      : bodyData;

    const encStr = await _encrypt(envelope);

    const newInit = {
      ...init,
      headers: { ...(init.headers || {}), 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptString: encStr, sessionId: _sid }),
    };

    const resp = await _nativeFetch(input, newInit);

    // Clone response and decrypt if encrypted
    const text = await resp.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch(e) { 
      // Not JSON — return as-is
      return new Response(text, { status: resp.status, headers: resp.headers });
    }

    if (parsed.encryptString) {
      try {
        const decrypted = await _decrypt(parsed.encryptString);
        return new Response(decrypted, {
          status: resp.status,
          headers: { ...Object.fromEntries(resp.headers), 'content-type': 'application/json; charset=utf-8' }
        });
      } catch(e) {
        console.warn('[ENC] Decrypt failed:', e.message);
        return new Response(text, { status: resp.status, headers: resp.headers });
      }
    }

    return new Response(text, { status: resp.status, headers: resp.headers });
  };

  // ============================================================
  // INTERCEPT XMLHttpRequest — Axios use karta hai isko
  // ============================================================
  const _NativeXHR   = window.XMLHttpRequest;
  const _nativeOpen  = _NativeXHR.prototype.open;
  const _nativeSend  = _NativeXHR.prototype.send;
  const _nativeSetRH = _NativeXHR.prototype.setRequestHeader;

  window.XMLHttpRequest = function() {
    const xhr     = new _NativeXHR();
    let   _url    = '';
    let   _method = 'GET';
    const _headers = {};
    let   _encryptThis = false;

    // --- open() ---
    xhr.open = function(method, url, ...rest) {
      _method = method;
      _url    = url;
      _encryptThis = (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')
                     && _shouldEncrypt(url);
      return _nativeOpen.apply(this, [method, url, ...rest]);
    };

    // --- setRequestHeader() ---
    xhr.setRequestHeader = function(name, value) {
      _headers[name] = value;
      return _nativeSetRH.apply(this, arguments);
    };

    // --- send() --- Main interception
    xhr.send = async function(body) {
      if (!_encryptThis) {
        return _nativeSend.apply(this, [body]);
      }

      const self = this;

      // Ensure session
      try { await _ensureSession(); }
      catch(e) { return _nativeSend.apply(self, [body]); }

      // Parse body
      let bodyData = {};
      if (body) {
        try { bodyData = JSON.parse(body); }
        catch(e) { bodyData = body; }
      }

      // Encrypt
      const envelope = typeof bodyData === 'object'
        ? { ...bodyData, _nonce: _nonce(), _timestamp: Math.floor(Date.now()/1000) }
        : bodyData;

      const encStr = await _encrypt(envelope);
      const encBody = JSON.stringify({ encryptString: encStr, sessionId: _sid });

      // Override Content-Type
      _nativeSetRH.apply(self, ['Content-Type', 'application/json']);

      // Intercept response via event listeners
      const origOnReadyStateChange = self.onreadystatechange;
      let   _responseDecrypted = false;
      let   _decryptedText = '';

      self.addEventListener('readystatechange', async function() {
        if (self.readyState !== 4) return;
        if (_responseDecrypted) return;

        try {
          const respText = self.responseText;
          const parsed = JSON.parse(respText);

          if (parsed.encryptString) {
            _responseDecrypted = true;
            _decryptedText = await _decrypt(parsed.encryptString);

            // Patch responseText and response via defineProperty
            Object.defineProperty(self, 'responseText', { get: () => _decryptedText, configurable: true });
            Object.defineProperty(self, 'response',     { get: () => _decryptedText, configurable: true });
          }
        } catch(e) {
          // Not encrypted or parse error — ignore
        }

        if (origOnReadyStateChange) origOnReadyStateChange.call(self);
      });

      return _nativeSend.apply(self, [encBody]);
    };

    return xhr;
  };

  // Copy prototype methods
  window.XMLHttpRequest.prototype = _NativeXHR.prototype;

  // ============================================================
  // START — Handshake karo page load pe
  // ============================================================
  try {
    await _handshake();
  } catch(e) {
    console.warn('[ENC] Pre-init handshake failed, will retry on first API call');
  }

})();
