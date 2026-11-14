#!/usr/bin/env python3
"""Encrypt data.json with the site password and inject it into template.html -> dist/index.html

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


def main() -> int:
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
    for token, value in (("__SALT__", b64(salt)), ("__IV__", b64(iv)), ("__CT__", b64(ciphertext)),
                         ("__ITER__", str(ITERATIONS))):
        if html.count(token) != 1:
            print(f"template.html must contain {token} exactly once", file=sys.stderr)
            return 1
        html = html.replace(token, value)

    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    (dist / "index.html").write_text(html, encoding="utf-8")
    (dist / ".nojekyll").write_text("", encoding="utf-8")
    print(f"built dist/index.html ({len(html.encode('utf-8')):,} bytes, {len(plaintext):,} bytes encrypted)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
