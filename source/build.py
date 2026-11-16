#!/usr/bin/env python3
"""Encrypt data.json with the site password and inject it into template.html -> dist/index.html

Theme modules (themes/*.js) are public, contain no data, and are inlined as-is so the
output stays a single file.

Usage: python3 build.py [path-to-password-file]
"""
import base64
import json
import os
import sys
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ROOT = Path(__file__).resolve().parent
ITERATIONS = 250_000
THEMES_TOKEN = "/*__THEMES__*/"


def main() -> int:
    password = os.environ.get("SITE_PASSWORD", "").strip()
    if not password:
        pw_path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".password"
        password = pw_path.read_text(encoding="utf-8").strip()
    if not password:
        print("password file is empty", file=sys.stderr)
        return 1

    data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
    plaintext = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")

    salt = os.urandom(16)
    iv = os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERATIONS).derive(
        password.encode("utf-8")
    )
    ciphertext = AESGCM(key).encrypt(iv, plaintext, None)  # ciphertext || 16-byte tag (WebCrypto layout)

    b64 = lambda b: base64.b64encode(b).decode("ascii")
    html = (ROOT / "template.html").read_text(encoding="utf-8")

    theme_files = sorted((ROOT / "themes").glob("*.js"))
    if not theme_files:
        print("no theme modules found in themes/", file=sys.stderr)
        return 1
    # one <script> per module, so a broken theme cannot take the others down with it
    themes_js = "</script>\n<script>".join(
        f"/* themes/{f.name} */\n" + f.read_text(encoding="utf-8").replace("</script", "<\\/script").replace("<!--", "<\\!--")
        for f in theme_files
    )
    if html.count(THEMES_TOKEN) != 1:
        print(f"template.html must contain {THEMES_TOKEN} exactly once", file=sys.stderr)
        return 1
    html = html.replace(THEMES_TOKEN, themes_js)
    # Worker 網址（不是祕密）：環境變數 WORKER_URL，或 source/.api 檔；沒設定就只有唯讀快照
    api = os.environ.get("WORKER_URL", "").strip()
    if not api and (ROOT / ".api").exists():
        api = (ROOT / ".api").read_text(encoding="utf-8").strip()
    if api and not api.startswith("https://"):
        print("WORKER_URL must start with https://", file=sys.stderr)
        return 1
    for token, value in (("__SALT__", b64(salt)), ("__IV__", b64(iv)), ("__CT__", b64(ciphertext)),
                         ("__ITER__", str(ITERATIONS)), ("__API__", api.replace('"', ""))):
        if html.count(token) != 1:
            print(f"template.html must contain {token} exactly once", file=sys.stderr)
            return 1
        html = html.replace(token, value)

    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    (dist / "index.html").write_text(html, encoding="utf-8")
    (dist / ".nojekyll").write_text("", encoding="utf-8")
    print(f"themes: {', '.join(f.stem for f in theme_files)}")
    print(f"live editing: {api or 'off (no WORKER_URL)'}")
    print(f"built dist/index.html ({len(html.encode('utf-8')):,} bytes, {len(plaintext):,} bytes encrypted)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
