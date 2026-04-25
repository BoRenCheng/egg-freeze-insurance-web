const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const authMiddleware = require('./middleware/auth');
const { JWT_SECRET, PORT, NODE_ENV } = require('./config');

const app = express();
const isProduction = NODE_ENV === 'production';

// CORS：開發時前端在 3000，生產時同源（不需要 cors）
app.use(cors({
  origin: isProduction ? false : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// 健康檢查
app.get('/healthz', (req, res) => res.json({ status: 'ok', env: NODE_ENV }));

// 註冊
app.post('/api/register', async (req, res) => {
  const { name, email, password, age, customer_type, amh_value, has_major_illness } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: '請填寫姓名、Email 與密碼' });
  if (password.length < 6) return res.status(400).json({ message: '密碼至少需要 6 個字元' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ message: '此 Email 已被註冊' });

  const hashed = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, age, customer_type, amh_value, has_major_illness) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, email, hashed, age || null, customer_type || 'potential', amh_value || null, has_major_illness ? 1 : 0);

  const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ message: '註冊成功', token, user: { id: result.lastInsertRowid, name, email } });
});

// 登入
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: '請輸入 Email 與密碼' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Email 或密碼錯誤' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Email 或密碼錯誤' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: '登入成功', token, user: { id: user.id, name: user.name, email: user.email, customer_type: user.customer_type } });
});

// 個人資料
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, age, customer_type, amh_value, has_major_illness, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: '使用者不存在' });
  res.json(user);
});

// 功能模組路由
app.use('/api/health',    require('./routes/health'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api',           require('./routes/clinics'));
app.use('/api/forum',     require('./routes/community'));

// 生產環境：靜態托管 React build 並支援 SPA 路由
const publicDir = path.join(__dirname, 'public');
if (isProduction && fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { maxAge: '7d', index: false }));
  app.get(/^\/(?!api|healthz).*/, (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
  console.log(`[Static] 托管前端：${publicDir}`);
}

// 啟動前自動 seed（DB 為空時）
async function autoSeed() {
  try {
    const count = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
    if (count === 0) {
      console.log('[Seed] 資料庫為空，執行初始化...');
      const seed = require('./seed');
      await seed();
    } else {
      console.log(`[Seed] 略過（已有 ${count} 個用戶）`);
    }
  } catch (e) {
    console.error('[Seed] 失敗:', e.message);
  }
}

(async () => {
  await autoSeed();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`後端伺服器啟動於 http://0.0.0.0:${PORT} (${NODE_ENV})`);
  });
})();
