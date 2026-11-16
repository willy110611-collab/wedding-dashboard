# 婚禮儀表板

我們的婚禮籌備總覽頁（2027.10.10 · 一森 Evermore Wedding）。單一 HTML 檔，內容包含待辦、預算、廠商與賓客名單。

資料在打包時以密碼加密（AES-256-GCM，金鑰由 PBKDF2-SHA256 250,000 次迭代產生），瀏覽器輸入正確密碼後才會解開，所以 `dist/index.html` 本身不含任何明文資料。

## 檔案

- `template.html`：頁面框架（版面、分頁、風格設定面板、粒子與吉祥物圖層）
- `themes/*.js`：五種風格模組，不含任何資料，打包時會直接併入 `dist/index.html`
- `build.py`：把 `data.json` 加密、把 `themes/*.js` 併入樣板，輸出單一檔案 `dist/index.html`
- `dist/`：要上線的成品（`index.html`、`.nojekyll`）

## 版面與風格

- 解鎖後分成五個分頁：總覽／待辦／預算／廠商／賓客。手機是底部分頁列，電腦（900px 以上）是上方膠囊導覽。會記住上次停留的分頁，網址 `#tasks` 這類也能直接開，返回手勢可用。總覽的三個統計卡可以點進對應分頁。
- 右上角齒輪（鎖定畫面也有）打開「風格設定」，選擇會記在該裝置的瀏覽器裡，登出也在這裡：

| 風格 | id | 說明 |
| --- | --- | --- |
| 香檳晨曦（預設） | `champagne` | 原本的香檳金與粉霧，花瓣與光點，偶爾有蝴蝶飛過 |
| 大地色 | `earth` | 奶茶、陶土、橄欖綠，亞麻紙質感，落葉與麥穗，小鳥在底部跳 |
| 純白系列 | `white` | 珍珠白配細金線，只有少量金色微光 |
| 可愛線條小狗 | `puppy` | 手繪線條風，原創小狗新人在底部跑來跑去，點牠會跳起來冒愛心 |
| Quokka | `quokka` | 暖杏與草綠，原創短尾矮袋鼠新人 |

- 系統開啟「減少動態效果」時，粒子、吉祥物與轉場都會停用。
- 要新增或調整風格，改 `themes/<id>.js`（設定 CSS 變數、插圖、粒子與吉祥物），再重新打包即可。

## 在網站上編輯（與 Notion 雙向同步）

```
網站 ──(密碼)──▶ Cloudflare Worker（worker.js，存 Notion 金鑰）──▶ Notion 四個資料庫
```

- 解鎖後網站先顯示加密快照，接著透過 Worker 讀 Notion 最新資料；左上角膠囊顯示「已與 Notion 同步」。點它可手動重新同步，切回這個分頁超過 1 分鐘也會自動同步。
- 每張卡片右上的筆可編輯全部欄位，各分頁的「＋ 新增」可新增，表單裡可刪除（移到 Notion 垃圾桶，可復原）。
- `.github/workflows/sync.yml` 每 6 小時透過 Worker 抓資料、重新加密 `index.html`（離線快照），資料沒變就不 commit；也可在 Actions 手動 Run。
- 需要的設定：
  - Cloudflare Worker：貼上 `worker.js`，設定 `NOTION_TOKEN`、`SITE_PASSWORD`（Secret）、`ALLOWED_ORIGIN`、`TOTAL_BUDGET`。
  - Notion：建立 internal integration，並在「婚前準備」頁面的 Connections 加入它。
  - GitHub repo Secrets：`WORKER_URL`、`SITE_PASSWORD`。
- 欄位對應寫在 `worker.js` 的 `KINDS`；Notion 欄位改名時要一起改。

## 重新打包

資料或密碼有更新時：

```bash
pip install cryptography   # 第一次才需要
python3 build.py           # 密碼讀 SITE_PASSWORD 環境變數或 .password；Worker 網址讀 WORKER_URL 或 .api
```

## 注意

- `data.json` 和 `.password*` **絕對不能 commit 或上傳**，`.gitignore` 已經排除，只發佈 `dist/` 的內容。
- 勾選「記住我」會把密碼存在該裝置瀏覽器的 localStorage，共用的裝置請不要勾，用完按「登出」。
- 密碼強度就是整個頁面的保護強度，請用夠長的密碼。
