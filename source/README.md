# 婚禮儀表板

我們的婚禮籌備總覽頁（2027.10.10 · 一森 Evermore Wedding）。單一 HTML 檔，內容包含待辦、預算、廠商與賓客名單。

資料在打包時以密碼加密（AES-256-GCM，金鑰由 PBKDF2-SHA256 250,000 次迭代產生），瀏覽器輸入正確密碼後才會解開，所以 `dist/index.html` 本身不含任何明文資料。

## 檔案

- `template.html`：頁面原始檔（HTML、CSS、JS 都在裡面）
- `build.py`：把 `data.json` 加密後塞進樣板，輸出 `dist/index.html`
- `dist/`：要上線的成品（`index.html`、`.nojekyll`）

## 重新打包

資料或密碼有更新時：

```bash
pip install cryptography   # 第一次才需要
python3 build.py           # 預設讀取 .password；也可以 python3 build.py 其他密碼檔
```

## 注意

- `data.json` 和 `.password` **絕對不能 commit 或上傳**，`.gitignore` 已經排除，只發佈 `dist/` 的內容。
- 勾選「記住我」會把密碼存在該裝置瀏覽器的 localStorage，共用的裝置請不要勾，用完按「登出」。
- 密碼強度就是整個頁面的保護強度，請用夠長的密碼。
