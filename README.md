# 凍住希望 卵畫未來 — 孕（運）轉乾坤險

凍卵保險生態系平台。整合保險、生殖醫學（中西醫）、社群支持與 AI 智能諮詢，服務菁英女性、LGBTQ+ 同性伴侶與癌症病友。

## 技術棧

| 層 | 技術 |
|---|---|
| 前端 | React 18 + React Router v6 + axios + recharts |
| 後端 | Node.js 22+ + Express 4 + JWT |
| 資料庫 | SQLite（Node.js 內建 `node:sqlite`，需 `--experimental-sqlite`）|
| AI | Google Gemini 2.5 Flash |
| 部署 | Docker（多階段建置）|

## 功能模組

1. **登入／註冊** — JWT Token、三步驟引導註冊、客群分類
2. **健康儀表板** — 卵子總數、AMH 趨勢圖（recharts BarChart）、受孕機率環形圖、醫師建議
3. **保險理賠中心** — 保單摘要、Glassmorphism 三大保障卡片、動態保費試算（CountUp 動畫）、線上理賠申請
4. **醫療生態預約** — 中西醫診所搜尋、骨架屏載入、手機風格預約單、雙管齊下整合方案、APP 折扣碼
5. **社群支持** — 5 分類論壇 Tab、按讚樂觀更新、生育權益百科手風琴、橫向滑動知識卡、**AI 智能諮詢「卵卵助理」**

## 本地開發

### 不使用 Docker

```bash
# 後端
cd backend
npm install
node --experimental-sqlite server.js
# → http://localhost:5000

# 前端（另一個終端）
cd frontend
npm install
npm start
# → http://localhost:3000
```

Demo 帳號：`demo@egg.tw` / `demo123`

### 使用 Docker（推薦）

```bash
# 1. 複製環境變數範本
cp .env.example .env

# 2. 編輯 .env 填入你的 GEMINI_API_KEY 與 JWT_SECRET

# 3. 一鍵啟動
docker compose up --build

# → http://localhost:5000（前後端整合在同一 port）
```

關閉服務：`docker compose down`  
重置資料庫：`docker compose down -v`（會刪除 volume）

---

# 部署指南

部署採「單一容器」架構：Express 同時提供 API 與靜態托管 React build，SQLite 透過 volume 持久化。

## ⚙️ 環境變數總覽

| 變數 | 必填 | 說明 |
|------|------|------|
| `JWT_SECRET` | ✅ | JWT 簽章金鑰，至少 32 字元亂數 |
| `GEMINI_API_KEY` | ✅ | Google Gemini API Key |
| `GEMINI_MODEL` | ❌ | 預設 `gemini-2.5-flash` |
| `PORT` | ❌ | 預設 5000（Cloud Run 會自動設為 8080）|
| `NODE_ENV` | ❌ | 設 `production` 啟用靜態托管 |
| `DB_PATH` | ❌ | 預設 `/data/insurance.db` |

## 🚂 方案 A：Railway（推薦・最簡單）

Railway 自動偵測 Dockerfile，附帶免費網域與 Volume 支援，**5 分鐘即可上線**。

### 1. 建立 GitHub Repo

```bash
cd egg-freeze-insurance
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 開新 repo 後：
git remote add origin https://github.com/<你的帳號>/egg-freeze-insurance.git
git branch -M main
git push -u origin main
```

### 2. 安裝 Railway CLI（可選）

```bash
npm install -g @railway/cli
railway login
```

### 3. 部署（兩種方式擇一）

**方式 A：Web Dashboard（推薦給新手）**

1. 到 https://railway.app 登入
2. 點 **New Project → Deploy from GitHub repo**
3. 選擇剛剛 push 的 repo
4. Railway 會自動偵測 `Dockerfile` 開始 build
5. **設定 Volume**：Settings → Volumes → New Volume
   - Mount path: `/data`
   - Size: 1 GB（免費足夠）
6. **設定環境變數**：Variables → Raw Editor 貼上：
   ```
   JWT_SECRET=<openssl rand -base64 48 生成的字串>
   GEMINI_API_KEY=<你的 Gemini Key>
   NODE_ENV=production
   DB_PATH=/data/insurance.db
   ```
7. **產生公開網域**：Settings → Networking → Generate Domain
8. 完成！訪問 `https://<你的專案>.up.railway.app`

**方式 B：CLI 部署**

```bash
railway init                              # 在當前目錄建立 Railway 專案
railway up                                # 上傳並建置
railway volume add --mount-path /data     # 加 volume
railway variables set JWT_SECRET=xxx GEMINI_API_KEY=xxx NODE_ENV=production
railway domain                            # 產生公開網域
```

### 4. 取得公開 URL

部署完成後，URL 顯示於：
- Dashboard：Settings → Domains
- CLI：`railway domain`

範例：`https://egg-freeze-insurance-production.up.railway.app`

## ☁️ 方案 B：Google Cloud Run

⚠️ **重要限制：** Cloud Run 容器是 ephemeral（無狀態），SQLite 檔案會在容器重啟後消失。建議：
- **示範用途**：可接受（每次重啟會重新 seed 資料）
- **正式上線**：需改用 Cloud SQL（PostgreSQL）或掛載 Cloud Filestore

### 1. 前置需求

- 已建立 GCP 專案並啟用帳單
- 已安裝 [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- 已啟用 API：
  ```bash
  gcloud services enable run.googleapis.com \
                          artifactregistry.googleapis.com \
                          cloudbuild.googleapis.com
  ```

### 2. 設定變數

```bash
export PROJECT_ID=你的-gcp-project-id
export REGION=asia-east1
export SERVICE_NAME=egg-freeze-insurance

gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
```

### 3. 建立 Artifact Registry

```bash
gcloud artifacts repositories create egg-freeze \
  --repository-format=docker \
  --location=$REGION
```

### 4. 一鍵 Build & Deploy

```bash
# 在專案根目錄執行（egg-freeze-insurance/）
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 5000 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 3 \
  --set-env-vars "NODE_ENV=production,DB_PATH=/tmp/insurance.db,GEMINI_MODEL=gemini-2.5-flash" \
  --set-secrets "JWT_SECRET=jwt-secret:latest,GEMINI_API_KEY=gemini-api-key:latest"
```

> 註：Cloud Run 唯一可寫入的是 `/tmp`（記憶體 tmpfs），所以 DB_PATH 設為 `/tmp/insurance.db`。重啟後資料會消失但會重新 seed。

### 5. 建立 Secrets

```bash
echo -n "$(openssl rand -base64 48)" | gcloud secrets create jwt-secret --data-file=-
echo -n "你的-Gemini-Key" | gcloud secrets create gemini-api-key --data-file=-

# 授權 Cloud Run 讀取
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 6. 取得公開 URL

```bash
gcloud run services describe $SERVICE_NAME --format='value(status.url)'
# → https://egg-freeze-insurance-xxxxxx-de.a.run.app
```

## 🐳 方案 C：純 Docker（自架伺服器）

```bash
# Build
docker build -t egg-freeze-insurance:latest .

# Run（含 volume 持久化）
docker run -d \
  --name egg-freeze \
  -p 5000:5000 \
  -v egg-freeze-data:/data \
  -e JWT_SECRET="$(openssl rand -base64 48)" \
  -e GEMINI_API_KEY="你的-Gemini-Key" \
  -e NODE_ENV=production \
  --restart unless-stopped \
  egg-freeze-insurance:latest

# 查看日誌
docker logs -f egg-freeze

# 進入容器
docker exec -it egg-freeze sh
```

## 🔍 部署後驗證

```bash
# 健康檢查
curl https://<你的網域>/healthz
# → {"status":"ok","env":"production"}

# 登入測試（demo 帳號自動 seed）
curl -X POST https://<你的網域>/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@egg.tw","password":"demo123"}'

# AI 諮詢測試（取得 token 後）
TOKEN="<上一步的 token>"
curl -X POST https://<你的網域>/api/forum/ask-ai \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"什麼是 AMH 值？"}'
```

## 🐛 常見問題

**Q: docker compose up 後 build 失敗 `npm ci` 錯誤？**  
A: 刪除 `frontend/node_modules` 與 `frontend/package-lock.json` 重新生成 lock 檔。

**Q: Railway 部署後 502 Bad Gateway？**  
A: 通常是 `PORT` 變數沒設對。Railway 會自動注入 `PORT`，本專案的 `config.js` 會優先使用環境變數。

**Q: Cloud Run 重啟後 demo 帳號不見了？**  
A: 這是正常的——Cloud Run 容器無狀態。容器啟動時會自動執行 `autoSeed()` 重建。如需正式持久化請改用 Cloud SQL。

**Q: AI 諮詢回應 500？**  
A: 檢查 `GEMINI_API_KEY` 是否正確設定，並到 https://aistudio.google.com/apikey 確認 quota。

## 🔐 安全清單（上線前必檢）

- [ ] `.env` 已加入 `.gitignore`，未推上 GitHub
- [ ] `JWT_SECRET` 為強亂數（≥ 32 字元），非預設值
- [ ] Gemini API Key 透過環境變數注入，未硬編碼
- [ ] CORS 在生產環境關閉跨域（`origin: false`）
- [ ] Docker 容器以非 root user (`node`) 執行
- [ ] 已啟用 HTTPS（Railway / Cloud Run 預設提供）

## 📁 專案結構

```
egg-freeze-insurance/
├── Dockerfile                    多階段建置
├── docker-compose.yml            本地一鍵啟動
├── .dockerignore                 排除 node_modules / 日誌
├── .env.example                  環境變數範本
├── .gitignore
├── railway.json                  Railway 部署設定
├── README.md                     本文件
├── backend/
│   ├── server.js                 Express + 靜態托管
│   ├── db.js                     SQLite（讀 DB_PATH）
│   ├── seed.js                   種子資料（可被 server 呼叫）
│   ├── config.js                 環境變數讀取
│   ├── middleware/auth.js        JWT 驗證
│   └── routes/
│       ├── health.js
│       ├── insurance.js
│       ├── clinics.js
│       └── community.js          含 Gemini AI 端點
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/           AppLayout / Sidebar / shared 共用
    │   └── pages/                LoginPage / RegisterPage / 4 大模組
    └── public/index.html
```
