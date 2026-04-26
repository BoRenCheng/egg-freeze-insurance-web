# 孕（運）轉乾坤險 -- 具備登入系統與 SQLite 後端，並串接 Gemini API 提供智能諮詢，以 Docker 容器化並部署至 Render之凍卵保險資訊平台

> 整合保險、生殖醫學（中西醫）、AI 諮詢與用戶社群的 **Insurtech 全端平台**
> 專為菁英女性、LGBTQ+ 同性伴侶、癌症病友等族群打造的凍卵保險生態系

**線上展示：** https://egg-freeze-insurance-web.onrender.com/login

**Demo 帳號：** `demo@egg.tw` / `demo123`
---

## 目錄

1. [專案動機與商業背景](#專案動機與商業背景)
2. [技術棧概覽](#技術棧概覽)
3. [系統架構](#系統架構)
4. [前端設計與實作](#1-前端設計與實作)
5. [後端架構與資料庫](#2-後端架構與資料庫)
6. [API 設計與外部串接](#3-api-設計與外部串接)
7. [Docker 容器化](#4-docker-容器化)
8. [Render 雲端部署](#5-render-雲端部署)
9. [Git 工作流程](#6-git-工作流程)
10. [本地開發與測試](#本地開發與測試)
11. [安全性考量](#安全性考量)

---

## 專案動機與商業背景 -- (參與法國巴黎人壽創新創業競賽 榮獲佳作)

### 為何做這個？

台灣 2022 年凍卵需求**爆發性增長**（送子鳥內部統計），原因包括：
- 晚婚晚育趨勢（首次凍卵平均年齡 35.2 歲）
- 女性年齡焦慮上升
- 社會觀念開放，多元成家普及

但市場存在**痛點**：
- 凍卵費用高昂（單次 8–15 萬，無保險覆蓋）
- 試管補助政策**僅限異性配偶**，排除單身女性與同性伴侶
- 重大疾病患者（如癌症化療前需緊急凍卵）缺乏專屬方案

### 解決方案

本專案打造一個**三方共贏的 Insurtech 生態系**：
- **凍卵中心 / 中西醫**：提供療程與調理服務
- **保險公司**：依年齡與 AMH 值動態定價的個性化保單
- **用戶**：一站式完成保單管理、健康追蹤、診所預約、AI 諮詢

### 目標客群分級

| 客群 | 年齡 | 特徵 | 年保費範圍 |
|------|------|------|-----------|
| **潛在客群** | 25-30 | 未婚但有生育規劃、演藝/Model | 8,000 – 12,000 |
| **主要客群** | 30+ | 菁英女性、LGBTQ+ 同性伴侶、無精症配偶 | 10,000 – 18,000 |
| **高需求客群** | 40+ | 卵巢機能衰退 | 18,000 – 30,000 |
| **重大疾病方案** | 全年齡 | 癌症、POF、快速卵巢衰退 | 15,000 – 35,000 |

---

## 技術棧概覽

| 分層 | 技術 | 選用理由 |
|------|------|---------|
| **前端框架** | React 18 + React Router v6 | SPA 體驗、社群龐大、Hooks 寫法簡潔 |
| **HTTP 客戶端** | axios | 比 fetch 更易處理 interceptor、自動 JSON 解析 |
| **資料視覺化** | recharts 3 | React 原生整合、響應式、動畫流暢 |
| **後端框架** | Node.js 22 + Express 4 | 輕量、生態成熟、易部署 |
| **資料庫** | SQLite（`node:sqlite` 內建模組）| 零依賴、免安裝、檔案級資料庫，部署簡單 |
| **認證機制** | JWT (jsonwebtoken) + bcryptjs | 無狀態 token、雜湊密碼安全 |
| **AI 服務** | Google Gemini 2.5 Flash | 免費 tier 充足、支援系統指令、多輪對話 |
| **容器化** | Docker（多階段建置） | 環境一致性、可重現部署 |
| **部署平台** | Render.com | 免信用卡、自動 HTTPS、GitHub 整合 |
| **版本控制** | Git + GitHub | CI/CD 觸發來源 |

### 為什麼選 SQLite 而不是 PostgreSQL？

- ✅ **零配置**：不需要另外起資料庫服務、不用記連線字串
- ✅ **檔案級備份**：直接複製 `.db` 檔案即可備份
- ✅ **適合展示**：Render Free tier 不需付費掛 Cloud SQL
- ✅ **Node 22+ 內建**：`node:sqlite` 模組無需 native compilation（避開 `better-sqlite3` 的編譯問題）
- ⚠️ **限制**：不適合高併發寫入；正式上線可平滑遷移到 PostgreSQL（schema 相容）

---

## 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                         使用者瀏覽器                          │
│              https://egg-freeze-insurance.onrender.com       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Render Web Service                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Docker Container (Node 22)              │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │       Express App (server.js : 5000)          │   │    │
│  │  │                                               │   │    │
│  │  │  /              → 靜態托管 React build         │   │    │
│  │  │  /api/login     → JWT 簽發                    │   │    │
│  │  │  /api/me        → JWT 驗證後回傳用戶資料        │   │    │
│  │  │  /api/health/*  → 健康儀表板資料              │   │    │
│  │  │  /api/insurance → 保單與保費試算              │   │    │
│  │  │  /api/clinics   → 診所搜尋與預約              │   │    │
│  │  │  /api/forum/*   → 論壇與 AI 諮詢              │   │    │
│  │  │                                               │   │    │
│  │  │       ┌───────────────────────────┐          │   │    │
│  │  │       │  node:sqlite (內建)        │          │   │    │
│  │  │       │  /data/insurance.db        │          │   │    │
│  │  │       └───────────────────────────┘          │   │    │
│  │  └──────────────┬───────────────────────────────┘   │    │
│  │                 │ HTTPS                              │    │
│  │                 ▼                                    │    │
│  │   ┌────────────────────────────────────┐            │    │
│  │   │  Google Gemini API（外部）          │            │    │
│  │   │  gemini-2.5-flash                   │            │    │
│  │   └────────────────────────────────────┘            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ git push（觸發自動部署）
                           │
                  ┌────────┴────────┐
                  │  GitHub Repo     │
                  └─────────────────┘
```

---

# 1. 前端設計與實作

## 1.1 設計理念

整體視覺基於**簡報品牌**（凍住希望 卵畫未來）的色彩與情感調性：

| 角色 | 色票 | 用途 |
|------|------|------|
| 主色（信賴） | `#1A365D` 深海軍藍 | Sidebar、標題、主按鈕 |
| 漸層延伸 | `#5B6EC7` → `#1A365D` | 卡片背景漸層 |
| 強調色（生命） | `#F687B3` 玫瑰粉 | 健康指標、CTA、AI 助理 |
| 點綴色（溫暖） | `#F5A623` 金黃 | LOGO icon、優惠標籤 |
| 背景 | `#F5F3EE` 米白 | 主內容區 |

### 設計原則

1. **資訊層次**：標題 800 字重 / 數據 900 字重放大 / 次要資訊灰階
2. **圓角統一**：卡片 `16-20px`、按鈕 `10-24px`、Pill 標籤 `12px+`
3. **陰影分級**：靜態 `0 4px 16px`、Hover `0 12px 32px`、強調 `0 16px 48px`
4. **動畫節奏**：所有 hover/focus 過渡 `0.2-0.25s ease`，數據動畫 `0.6-1.2s`

## 1.2 元件架構

```
frontend/src/
├── App.jsx                    路由配置 + PrivateRoute 守衛
├── index.js / index.css       React 進入點 + 全域樣式
│
├── components/
│   ├── AppLayout.jsx          整體佈局（Sidebar + Outlet）
│   ├── Sidebar.jsx            側邊導覽 + 用戶資訊 + 登出
│   └── shared/                跨頁可重用元件
│       ├── MetricCard.jsx     數據卡片（hover 浮起、左側色條）
│       ├── Modal.jsx          彈出對話框（Esc 關閉、毛玻璃遮罩）
│       ├── SkeletonCard.jsx   載入骨架屏
│       └── CountUp.jsx        數字滾動動畫 hook
│
└── pages/
    ├── LoginPage.jsx          登入（左 Hero + 右 Form 雙欄）
    ├── RegisterPage.jsx       三步驟引導註冊
    ├── Dashboard.jsx          總覽（4 大功能 tile）
    ├── HealthDashboard.jsx    健康儀表板（recharts 圖表）
    ├── InsuranceCenter.jsx    保險理賠（Glassmorphism + CountUp）
    ├── MedicalBooking.jsx     醫療預約（手機框 UI + 骨架屏）
    └── Community.jsx          社群（Tab + 手風琴 + AI Chat）
```

### 為何採用 Inline Styles？

放棄 styled-components / CSS Modules / Tailwind 的考量：
- ✅ **零依賴**：減少 bundle 體積、避免框架衝突
- ✅ **動態樣式直觀**：`style={hover ? hoverStyle : baseStyle}` 比 className 切換更直覺
- ✅ **無命名衝突**：每個元件樣式 scoped 在自己檔案
- ⚠️ 缺點：無法使用 `:hover` 偽類，需 JS 控制 → 用 `onMouseEnter/Leave` 補足

## 1.3 路由與權限控制

```jsx
// App.jsx - 兩層路由結構
<Routes>
  {/* 公開路由 */}
  <Route path="/login"    element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* 受保護路由（需 JWT） */}
  <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/health"    element={<HealthDashboard />} />
    {/* ... */}
  </Route>
</Routes>
```

`PrivateRoute` 是**高階守衛元件**：
```jsx
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
```

未登入使用者試圖訪問 `/dashboard` 會被自動導向 `/login`。

## 1.4 狀態管理策略

採用**輕量化** React Hooks，沒有引入 Redux / Zustand：

| 狀態類型 | 存放位置 | 範例 |
|---------|---------|------|
| **JWT Token** | `localStorage` | `localStorage.setItem('token', jwt)` |
| **用戶資訊** | `localStorage` + 頁面層 `useState` | 登入後快取，頁面初始化時驗證 |
| **頁面臨時狀態** | `useState` | 表單輸入、modal 開關、loading |
| **副作用** | `useEffect` | API 呼叫、訂閱、計時器 |

選擇理由：應用規模小、頁面間共享狀態少（僅 user）、不需跨元件通訊複雜邏輯。

---

# 2. 後端架構與資料庫

## 2.1 專案結構

```
backend/
├── server.js              主入口：Express app 設定 + 路由註冊 + 自動 seed
├── db.js                  SQLite 連線 + Schema 定義（CREATE TABLE IF NOT EXISTS）
├── seed.js                種子資料：demo 用戶、AMH 歷史、論壇文章、診所
├── config.js              環境變數讀取（單一來源）
├── middleware/
│   └── auth.js            JWT 驗證中間件
└── routes/
    ├── health.js          健康儀表板資料 API
    ├── insurance.js       保單、保費試算、理賠 API
    ├── clinics.js         診所搜尋與預約 API
    └── community.js       論壇文章、按讚、AI 諮詢 API
```

## 2.2 資料庫 Schema 設計

8 張表，遵循**第三正規化**原則（除了論壇 tags 為性能考量採 JSON）：

```sql
users               -- 使用者主檔
├── id PK
├── email UNIQUE
├── password (bcrypt hash)
├── customer_type   -- 'potential' / 'main' / 'high_demand' / 'cancer'
└── amh_value, age, has_major_illness

policies            -- 保單
├── user_id FK → users
├── policy_number UNIQUE
├── customer_type, age_range, amh_status
├── annual_premium, start_date, end_date
└── status

egg_records         -- 凍卵紀錄
├── user_id FK
├── freeze_date, egg_count, amh_value, health_score

amh_records         -- AMH 歷年檢測（時序資料）
├── user_id FK
└── recorded_year, amh_value

clinics             -- 合作診所
├── name, type ('中醫'/'西醫'), city, district
├── doctor_name, specialty, phone, address
└── rating

appointments        -- 預約紀錄
├── user_id FK
├── clinic_id FK → clinics
├── doctor_name, appointment_date, queue_number
└── status

forum_posts         -- 論壇文章
├── author_name, category
├── title, content, excerpt
├── tags (JSON)
└── like_count, reply_count

claims              -- 理賠申請
├── user_id FK
├── therapy_type, institution
├── claim_date
└── status
```

### Schema 設計亮點

1. **時序資料分表**：`amh_records` 獨立於 `users`，便於畫趨勢圖（每年一筆）
2. **冗餘欄位**：`appointments.doctor_name` 與 `clinics.doctor_name` 重複
   - 理由：醫師可能會調動，預約時的醫師應**凍結**為當下的值
3. **狀態機設計**：`policies.status`、`appointments.status`、`claims.status` 皆有預設值，方便未來擴充工作流
4. **idempotent migration**：所有 `CREATE TABLE IF NOT EXISTS`，重啟不會重建

## 2.3 認證機制 — JWT Flow

```
┌──────┐  POST /api/login         ┌──────┐
│ 前端 │  { email, password }     │ 後端 │
│      │ ───────────────────────► │      │
│      │                          │      │
│      │                  ┌───────┴──┐   │
│      │                  │ 1. 查 user │   │
│      │                  │ 2. bcrypt  │   │
│      │                  │   .compare │   │
│      │                  │ 3. jwt.sign│   │
│      │                  │   (7d 過期)│   │
│      │                  └───────┬──┘   │
│      │  { token, user }          │      │
│      │ ◄─────────────────────── │      │
│      │                                  │
│ localStorage.setItem('token', ...)      │
│                                         │
│  GET /api/health/summary                │
│  Authorization: Bearer <token>          │
│ ───────────────────────────────────────► │
│                                         │
│                            ┌────────────┴──┐
│                            │ auth.js middleware │
│                            │ jwt.verify(token)  │
│                            │ req.user = {...}   │
│                            └────────────┬──┘
│  { egg_count, amh_value, ... }         │
│ ◄──────────────────────────────────────│
└──────┘                                 └──────┘
```

### 安全性設計

```javascript
// seed.js / 註冊：密碼用 bcrypt 雜湊（10 輪 salt）
const hashed = await bcrypt.hash(password, 10);

// 驗證：constant-time 比對，防止 timing attack
const match = await bcrypt.compare(password, user.password);

// JWT：HS256 演算法，密鑰來自環境變數
const token = jwt.sign(
  { id, email, name },
  JWT_SECRET,           // 從 process.env.JWT_SECRET 讀取
  { expiresIn: '7d' }
);
```

## 2.4 中間件 (auth.js) 解析

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '請先登入' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);  // 解碼後掛載到 req
    next();                                     // 通過驗證，進入下一個 handler
  } catch {
    res.status(401).json({ message: 'Token 已失效' });
  }
}
```

任何需要登入的路由只要加上 `authMiddleware` 即可：
```javascript
router.get('/policy', authMiddleware, (req, res) => {
  // 此處 req.user 一定存在（middleware 已驗證）
  const policy = db.prepare('... WHERE user_id = ?').get(req.user.id);
});
```

## 2.5 自動 Seed 機制

部署到無持久化磁碟的雲端時（如 Render Free），容器重啟資料會清空。為此實作**自動補資料**：

```javascript
// server.js
async function autoSeed() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (count === 0) {
    console.log('[Seed] 資料庫為空，執行初始化...');
    const seed = require('./seed');
    await seed();
  }
}

(async () => {
  await autoSeed();
  app.listen(PORT, () => { /* ... */ });
})();
```

`seed.js` 用 `INSERT OR IGNORE` 確保**冪等性**（idempotent），可重複執行不會出錯。

## 2.6 生產 vs 開發環境差異

```javascript
const isProduction = NODE_ENV === 'production';

// CORS：開發要跨域 3000→5000，生產同源不需
app.use(cors({ origin: isProduction ? false : 'http://localhost:3000' }));

// 靜態托管：只在生產啟用（避免覆蓋 dev server）
if (isProduction && fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { maxAge: '7d' }));

  // SPA fallback：非 /api 開頭的路由都回傳 index.html
  // 讓 React Router 接手前端路由
  app.get(/^\/(?!api|healthz).*/, (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}
```

---

# 3. API 設計與外部串接

## 3.1 RESTful API 設計原則

- **資源導向命名**：`/api/clinics`（複數）、`/api/policy`（單一資源）
- **HTTP 動詞語意**：GET 讀取、POST 建立、PUT/PATCH 更新、DELETE 刪除
- **HTTP 狀態碼**：
  - `200` 成功
  - `201` Created（註冊、新增資源）
  - `400` 參數錯誤
  - `401` 未授權（缺 token / token 失效）
  - `404` 找不到
  - `409` Conflict（email 已註冊、重複保單）
  - `500` 伺服器錯誤

## 3.2 內部 API 完整清單

### 認證
| Method | Path | 需登入 | 說明 |
|--------|------|--------|------|
| POST | `/api/register` | ❌ | 註冊（自動發 token）|
| POST | `/api/login` | ❌ | 登入 |
| GET | `/api/me` | ✅ | 取得當前用戶資料 |
| GET | `/healthz` | ❌ | 健康檢查（給 Render 用）|

### 健康儀表板
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/health/summary` | 卵子數、AMH、健康評級、受孕率、醫師建議 |
| GET | `/api/health/amh-history` | 歷年 AMH 紀錄（給 BarChart）|

### 保險
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/insurance/policy` | 保單詳情 + 保障額度（依客群動態回傳）|
| POST | `/api/insurance/policy` | 投保 |
| GET | `/api/insurance/premium-calc` | 即時保費試算（無需登入）|
| POST | `/api/insurance/claims` | 線上理賠申請 |

### 醫療預約
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/clinics?city=&district=&type=` | 三維度篩選診所 |
| POST | `/api/appointments` | 線上預約（自動產生掛號序號）|
| GET | `/api/appointments` | 個人預約列表 |

### 社群
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/forum/posts?category=` | 分類過濾論壇文章 |
| POST | `/api/forum/posts/:id/like` | 按讚（需登入）|
| GET | `/api/forum/encyclopedia` | 法律百科手風琴內容 |
| POST | `/api/forum/ask-ai` | **AI 諮詢（呼叫 Gemini）** |

## 3.3 Gemini AI 整合（核心亮點）

### 為何用 Gemini？

| 比較項 | Gemini 2.5 Flash | OpenAI GPT-4o | Claude 3.5 |
|--------|------------------|----------------|------------|
| 中文能力 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 免費額度 | ✅ 1500 req/day | ❌ 需付費 | ❌ 需付費 |
| 系統指令 | ✅ `systemInstruction` | ✅ `system` role | ✅ `system` |
| 多輪對話 | ✅ `contents` 陣列 | ✅ messages | ✅ messages |
| 安全過濾 | ✅ `safetySettings` | ⚠️ 內建較嚴格 | ⚠️ 內建嚴格 |

### System Prompt 工程

關鍵設計：**用 System Prompt 把 Gemini 「鎖在」凍卵領域**，避免變成萬能聊天機器人。

```javascript
const SYSTEM_PROMPT = `你是「凍住希望 卵畫未來」（孕運轉乾坤險）平台的專業 AI 諮詢顧問，名為「卵卵助理」。

【你的專業領域】
你只回答與以下主題相關的問題：
1. 凍卵流程、技術、注意事項
2. AMH 值解讀、卵巢功能評估
3. 凍卵保險（孕運轉乾坤險）的保單內容、保費試算、理賠流程
4. 生殖醫學、試管嬰兒（IVF）相關知識
5. 女性生育力保存、年齡與生育的關係
6. LGBTQ+ 同性伴侶與單身女性的生育選擇與權益
7. 癌症患者生育保存（化療前緊急凍卵）、POF 卵巢早衰
8. 中醫調理與西醫檢測的整合方案
9. 台灣《人工生殖法》規範與生育補助政策

【你必須拒絕回答的問題】
凡是與上述主題無關的問題（程式、政治、料理、閒聊...），
你必須溫和但堅定地回覆：「您好～我是專責凍卵與生育保險的諮詢顧問...」

【產品資訊參考】
- 保險年限：5 年
- 保費範圍：8,000–35,000 元/年
- 三大理賠：療程補助、手術併發症、保存不當補償
...`;
```

### 呼叫 Gemini 的程式邏輯

```javascript
async function askGemini(question, history = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // 把前端傳來的 history 轉成 Gemini 格式
  const contents = [
    ...history.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,           // 不要太發散
        maxOutputTokens: 1500,
        thinkingConfig: { thinkingBudget: 0 },  // 關閉 thinking 模式提速
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Gemini API ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
```

### 關鍵踩坑點 — `thinkingBudget: 0`

Gemini 2.5 Flash 預設啟用「**thinking 模式**」（內部推理），會吃掉大量 token：
- 設 `maxOutputTokens: 200` 時，191 token 用於 thinking，剩 9 token 給回答 → 內容被截斷
- 解法：設 `thinkingConfig: { thinkingBudget: 0 }` 關閉 thinking，全部 token 給回答

## 3.4 API 安全性

```javascript
router.post('/ask-ai', auth, async (req, res) => {
  const { question, history = [] } = req.body;

  // 1. 必填驗證
  if (!question?.trim()) return res.status(400).json({ message: '請輸入問題' });

  // 2. 長度限制（防止濫用 + 控制成本）
  if (question.length > 500) return res.status(400).json({ message: '問題過長' });

  // 3. JWT 驗證已由 auth middleware 完成

  try {
    const answer = await askGemini(question.trim(), history);
    res.json({ answer });
  } catch (err) {
    console.error('Gemini 錯誤:', err.message);
    // 4. 不向前端洩漏內部錯誤細節
    res.status(500).json({ message: '卵卵助理暫時無法回應，請稍後再試。' });
  }
});
```

---

# 4. Docker 容器化

## 4.1 為何要 Docker？

| 痛點 | Docker 解決 |
|------|------------|
| 「在我電腦上能跑」 | 整個執行環境打包成 image，到處都能跑 |
| 部署複雜 | 不用裝 Node/npm，雲端平台直接 pull image |
| 版本衝突 | 隔離環境，不污染主機 |
| 可重現性 | Dockerfile 是程式碼，可版本控制 |

## 4.2 多階段建置（Multi-stage Build）

```dockerfile
# =============================================================
# Stage 1: 編譯 React 前端（只在建置時需要）
# =============================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# 先複製 lock 檔以快取 npm install
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

# 再複製原始碼
COPY frontend/ ./
ENV NODE_ENV=production CI=false DISABLE_ESLINT_PLUGIN=true GENERATE_SOURCEMAP=false
RUN npm run build      # 產出 build/ 資料夾

# =============================================================
# Stage 2: Node.js 後端執行階段（最終 image 只包含這層）
# =============================================================
FROM node:22-alpine AS runtime

RUN apk add --no-cache tini    # 處理 PID 1 訊號

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY backend/ ./

# ★ 關鍵：從第一階段複製編譯好的前端到 Express 靜態目錄
COPY --from=frontend-builder /app/frontend/build ./public

# 建立 SQLite 持久化目錄並設權限
RUN mkdir -p /data && chown -R node:node /data /app
USER node                      # 切換到非 root 用戶（安全性）

ENV NODE_ENV=production \
    PORT=5000 \
    DB_PATH=/data/insurance.db

EXPOSE 5000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--experimental-sqlite", "server.js"]
```

### 多階段建置的好處

| | 單階段 | 多階段（本專案）|
|---|--------|-----------------|
| 最終 image 大小 | ~ 1.5 GB（含全部 dev deps）| **~ 250 MB** |
| 包含原始碼 | 前端 src/、testing libs 都在 | 只有編譯後的靜態檔 |
| 攻擊面 | 大（裝了一堆套件）| 小 |

## 4.3 .dockerignore 策略

```
**/node_modules        # 容器內會重新 npm install
**/build               # 容器內會重新 npm run build
.env                   # 敏感資料絕對不能進 image
.git                   # 版本歷史對執行無用
**/*.db                # 本地測試資料不該進去
**/*.md                # 文件不需要
**/test-gemini.js      # dev 工具
```

不寫 `.dockerignore` 的話：`COPY backend/` 會把 `node_modules`（可能 500MB）也塞進 image，build 時間翻倍。

## 4.4 安全性設計

```dockerfile
USER node                       # 非 root 執行（即使被入侵也限制權限）
ENTRYPOINT ["/sbin/tini", "--"] # 正確處理 SIGTERM（容器停止訊號）
EXPOSE 5000                     # 文件性質，告知預設 port
```

## 4.5 docker-compose.yml — 本地一鍵啟動

```yaml
services:
  app:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["5000:5000"]
    environment:
      JWT_SECRET: ${JWT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      NODE_ENV: production
      DB_PATH: /data/insurance.db
    volumes:
      - sqlite-data:/data         # ★ 命名 volume 持久化資料
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:5000/healthz"]
      interval: 30s

volumes:
  sqlite-data:                    # 命名 volume，docker compose down 不刪
    driver: local
```

執行 `docker compose up --build` 即可一鍵啟動，環境變數自動從根目錄 `.env` 載入。

---

# 5. Render 雲端部署

## 5.1 為何選 Render？

| 平台 | 信用卡 | Docker 支援 | 持久化磁碟 | HTTPS | 自動部署 |
|------|--------|------------|-----------|-------|---------|
| **Render** | ❌ 不需 | ✅ | 付費 | ✅ | ✅ git push |
| Railway | ✅ 需 | ✅ | ✅ Free | ✅ | ✅ |
| Cloud Run | ✅ 需 | ✅ | ❌ ephemeral | ✅ | 需配 GitHub Action |
| Heroku | ✅ 需 | ✅ | 付費 | ✅ | ✅ |

對展示用途，Render Free tier 完全夠用，且零信用卡門檻。

## 5.2 部署流程

```
本機 git push                Render Webhook              Docker Build           Live
     ↓                            ↓                            ↓                    ↓
┌─────────┐  push    ┌─────────────────┐  notify   ┌──────────────┐  deploy  ┌─────────┐
│ GitHub  │ ───────► │ Render 偵測新 commit │ ────────► │ Build Pipeline │ ───────► │ Live URL │
│ (main)  │           │  via webhook        │            │ (Dockerfile)   │          │   :443   │
└─────────┘          └─────────────────┘            └──────────────┘          └─────────┘
```

## 5.3 Render 設定要點

### Web Service 配置
- **Source**：連結 GitHub Repo
- **Branch**：`main`（push 到此分支會自動部署）
- **Runtime**：選 **Docker**（Render 會找 Dockerfile）
- **Region**：**Singapore**（亞洲最近）
- **Instance Type**：**Free**

### 環境變數（在 Render Dashboard 設定）
```
JWT_SECRET=<openssl rand -base64 48 產生>
GEMINI_API_KEY=<從 Google AI Studio 取得>
NODE_ENV=production
```
> ⚠️ Render 會把這些注入容器，**永遠不要**寫死在 Dockerfile 或 git 上

### Health Check
Render 會定期打 `/healthz` 確認服務存活：
```javascript
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
```

## 5.4 Free Tier 限制與對策

| 限制 | 對策 |
|------|------|
| **15 分鐘無流量會休眠** | 用 cron-job.org 每 10 分鐘 ping `/healthz` 防睡眠 |
| **無持久化磁碟** | `autoSeed()` 機制，重啟自動補 demo 資料 |
| **每月 750 小時** | 一個 service 24/7 = 720 小時，足夠 |
| **冷啟動 ~30 秒** | Demo 用戶可接受，正式上線改付費方案 |

## 5.5 持續部署 (CI/CD) 流程

```
開發者本機改 code
        │
        ▼
   git add .
   git commit -m "..."
   git push
        │
        ▼
GitHub 收到 push
        │
        ▼
Render Webhook 觸發
        │
        ▼
從 GitHub clone 最新 commit
        │
        ▼
docker build -f Dockerfile .   ← 5-7 分鐘
        │
        ▼
deploy 新版本到 Render runtime
        │
        ▼
舊 container 慢慢下線（Zero-downtime deploy）
        │
        ▼
新版 Live ✓
```

每次推 commit 全自動部署，不用手動操作雲端介面。

---

# 6. Git 工作流程

## 6.1 為何 Git 是必備技能？

- ✅ **時光機**：任何修改都能回溯到歷史版本
- ✅ **協作基礎**：多人開發必備（branch、merge、PR）
- ✅ **CI/CD 觸發**：Render / Vercel / GitHub Actions 都靠 git push 啟動
- ✅ **作品集載體**：GitHub 是工程師履歷的重要部分

## 6.2 本專案的 Git 結構

```
egg-freeze-insurance/
├── .git/                  Git 元資料（.git 目錄含所有歷史）
├── .gitignore             告訴 Git 哪些檔案要忽略
├── ...專案檔案...
└── .env                   ⚠️ 已加入 gitignore，不會被推上 GitHub
```

## 6.3 .gitignore 策略

```gitignore
node_modules/         # 套件相依，npm install 可重建
build/                # 編譯產物
.env                  # 敏感資訊（API Key、JWT Secret）
*.db                  # 本機 SQLite 資料庫
*.log                 # 日誌
.vscode/ .idea/       # IDE 設定，個人偏好不該共享
```

**為何要排除 `.env`？**
- 裡面有 Gemini API Key、JWT Secret
- 推到公開 GitHub 等於把鑰匙交給全世界
- 雲端部署用環境變數注入，無需 commit

## 6.4 完整工作流（從零到上線）

```bash
# === 第一次設定（只做一次）===
git init                                              # 初始化本地 repo
git config user.email "you@example.com"               # 設身份
git config user.name "Your Name"
git remote add origin https://github.com/USER/REPO.git # 連結 GitHub

# === 日常開發循環 ===
# 1. 修改檔案後查看狀態
git status                          # 看哪些檔案改了

# 2. 暫存變更（staging area）
git add .                           # 全部加入
git add backend/server.js           # 或指定檔案

# 3. 建立 commit（snapshot）
git commit -m "Fix: 修正 AMH 圖表 tooltip 顏色"

# 4. 推上 GitHub（觸發 Render 自動部署）
git push                            # 之後可以省略 -u origin main
```

## 6.5 Commit Message 規範（Conventional Commits）

| 前綴 | 用途 | 範例 |
|------|------|------|
| `feat:` | 新功能 | `feat: 加入 AI 諮詢聊天介面` |
| `fix:` | 修 bug | `fix: 修正保費試算切換不更新數字` |
| `docs:` | 文件 | `docs: 補充 README 部署章節` |
| `refactor:` | 重構（行為不變）| `refactor: 抽出 auth middleware` |
| `style:` | 樣式調整 | `style: 統一卡片圓角為 16px` |
| `chore:` | 雜項（依賴升級、build 設定）| `chore: 升級 recharts 至 3.8.1` |

**好處**：未來自動產生 changelog；團隊成員一看就懂這次改了什麼類型的東西。

## 6.6 常用救命指令

```bash
# 我推錯了想撤回最後一次 commit（保留變更）
git reset --soft HEAD~1

# 我改錯了想完全丟棄當前修改
git checkout -- backend/server.js

# 我想看某個檔案歷史
git log --oneline -- backend/server.js

# 我想看上次 commit 改了什麼
git show HEAD

# 我要切到舊版本看看（不影響 main）
git checkout <commit-hash>
git checkout main          # 回到最新

# 我把 .env 不小心推上去了！
git rm --cached .env       # 從追蹤移除（本地檔案保留）
git commit -m "Remove .env from tracking"
git push
# ⚠️ 還要去撤銷暴露的 API Key！git history 裡仍可看到
```

## 6.7 推 commit → 自動部署的完整流程

當你執行 `git push` 後背後發生的事：

```
┌──────────┐
│ git push │ 從本機推送到 GitHub
└────┬─────┘
     │
     ▼
┌──────────────────────┐
│ GitHub 接收 commit    │ origin/main 更新
└────┬─────────────────┘
     │
     │ webhook (HTTP POST)
     ▼
┌──────────────────────┐
│ Render 收到通知       │ 「main 分支有新 commit」
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Render 拉取最新程式碼 │ git clone --depth 1
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ docker build         │ 執行 Dockerfile（多階段）
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ 部署新 container      │ 注入環境變數
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Health check 通過 → Live │
└──────────────────────┘
```

整個流程**全自動**，開發者只要寫 code 然後 push，幾分鐘後線上版本就更新了。

---

# 本地開發與測試

## 環境需求

- Node.js **22+**（內建 SQLite 模組）
- Git 2.x+
- 任意瀏覽器（Chrome / Edge / Firefox）

## 啟動步驟

```bash
# 1. clone 專案
git clone https://github.com/BoRenCheng/egg-freeze-insurance-web.git
cd egg-freeze-insurance-web

# 2. 設定環境變數
cp .env.example .env
# 編輯 .env，填入你的 GEMINI_API_KEY

# 3. 啟動後端（終端 1）
cd backend
npm install
npm start
# → 後端跑在 http://localhost:5000

# 4. 啟動前端（終端 2）
cd frontend
npm install
npm start
# → 前端跑在 http://localhost:3000
# → 自動開瀏覽器
```

## 測試帳號

| Email | 密碼 | 角色 |
|-------|------|------|
| `demo@egg.tw` | `demo123` | 主要客群（已有保單與 AMH 紀錄）|

## API 測試（curl）

```bash
# 登入取 token
TOKEN=$(curl -s -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@egg.tw","password":"demo123"}' | jq -r .token)

# 查健康儀表板
curl http://localhost:5000/api/health/summary -H "Authorization: Bearer $TOKEN"

# 試 AI 諮詢
curl -X POST http://localhost:5000/api/forum/ask-ai \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"AMH 2.5 適合凍卵嗎？"}'
```

## 資料庫檢視

```bash
cd backend
node --experimental-sqlite inspect.js   # 列出所有表的內容
```

---

# 安全性考量

| 項目 | 措施 |
|------|------|
| 密碼儲存 | bcrypt 雜湊（10 輪 salt），絕不明文 |
| API 認證 | JWT HS256，7 天過期 |
| 敏感資訊 | 環境變數注入，不寫死於程式碼 |
| `.env` 保護 | 加入 `.gitignore`，絕不推上 GitHub |
| Container 權限 | 非 root 用戶 (`node`) 執行 |
| CORS | 生產環境關閉跨域（同源即可）|
| HTTPS | Render 自動提供 Let's Encrypt 憑證 |
| AI 輸入限制 | 問題長度上限 500 字元，防濫用 |
| Error 回傳 | 不透露內部錯誤細節給前端 |

---

# 授權

本專案僅供實習以及推甄作品展示使用。
PDF 簡報內容、品牌名稱、Logo 為原團隊智慧財產。

---

**作者：** BoRenCheng
**完成日期：** 2026 年 4 月
**聯絡方式：** raycheng940629@gmail.com
