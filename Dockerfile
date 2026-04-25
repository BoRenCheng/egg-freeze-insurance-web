# =============================================================
# Stage 1: 編譯 React 前端
# =============================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# 先複製 lock 檔以快取 npm install
COPY frontend/package*.json ./
# 使用 npm install 而非 npm ci，避免 lock 檔與 recharts 等套件的版本不一致問題
RUN npm install --no-audit --no-fund --legacy-peer-deps

# 複製前端原始碼並編譯
COPY frontend/ ./
# CI=false 避免 react-scripts 把 ESLint warning 當作 error
# DISABLE_ESLINT_PLUGIN=true 完全略過 ESLint 檢查（不影響功能）
ENV NODE_ENV=production CI=false DISABLE_ESLINT_PLUGIN=true GENERATE_SOURCEMAP=false
RUN npm run build

# =============================================================
# Stage 2: Node.js 後端執行階段（包含靜態托管）
# =============================================================
FROM node:22-alpine AS runtime

# tini 處理訊號（避免 zombie process），dumb-init 也可
RUN apk add --no-cache tini

WORKDIR /app

# 安裝後端 production 依賴
COPY backend/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# 複製後端原始碼
COPY backend/ ./

# 移除非必要 dev 工具（避免 image 變肥）
RUN rm -f test-gemini.js inspect.js

# 從第一階段複製編譯後的前端到 Express 靜態目錄
COPY --from=frontend-builder /app/frontend/build ./public

# 建立 SQLite 資料持久化目錄，賦予 node user 權限
RUN mkdir -p /data && chown -R node:node /data /app

# 切換到非 root 用戶（安全性）
USER node

# 預設環境變數（可被 docker-compose / 雲端平台覆寫）
ENV NODE_ENV=production \
    PORT=5000 \
    DB_PATH=/data/insurance.db

EXPOSE 5000

# tini 作為 PID 1，正確處理 Ctrl+C / docker stop
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--experimental-sqlite", "server.js"]
