const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

const PREMIUM_TABLE = {
  '25-30_normal_false':   { base: 8000,  max: 10000 },
  '30-35_normal_false':   { base: 10000, max: 12000 },
  '36-40_normal_false':   { base: 12000, max: 15000 },
  '40+_normal_false':     { base: 18000, max: 22000 },
  '25-30_abnormal_false': { base: 10000, max: 12000 },
  '30-35_abnormal_false': { base: 12000, max: 15000 },
  '36-40_abnormal_false': { base: 15000, max: 18000 },
  '40+_abnormal_false':   { base: 22000, max: 30000 },
  '25-30_normal_true':    { base: 15000, max: 18000 },
  '30-35_normal_true':    { base: 18000, max: 22000 },
  '36-40_normal_true':    { base: 22000, max: 25000 },
  '40+_normal_true':      { base: 25000, max: 28000 },
  '25-30_abnormal_true':  { base: 18000, max: 22000 },
  '30-35_abnormal_true':  { base: 22000, max: 25000 },
  '36-40_abnormal_true':  { base: 25000, max: 28000 },
  '40+_abnormal_true':    { base: 30000, max: 35000 },
};

const COVERAGE = {
  potential:   { therapy: 30000,  comp: 50000,  storage: 100000 },
  main:        { therapy: 40000,  comp: 55000,  storage: 110000 },
  high_demand: { therapy: 60000,  comp: 60000,  storage: 120000 },
  cancer:      { therapy: 60000,  comp: 60000,  storage: 120000 },
};

router.get('/policy', auth, (req, res) => {
  const policy = db.prepare(
    "SELECT * FROM policies WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).get(req.user.id);
  const user = db.prepare('SELECT customer_type, amh_value, age FROM users WHERE id = ?').get(req.user.id);
  const coverage = COVERAGE[user?.customer_type] || COVERAGE.potential;
  res.json({ policy: policy || null, coverage, customer_type: user?.customer_type || 'potential' });
});

router.post('/policy', auth, (req, res) => {
  const existing = db.prepare(
    "SELECT id FROM policies WHERE user_id = ? AND status = 'active'"
  ).get(req.user.id);
  if (existing) return res.status(409).json({ message: '您已有一份有效保單' });

  const user = db.prepare('SELECT age, customer_type, amh_value FROM users WHERE id = ?').get(req.user.id);
  const age = user?.age || 30;
  let age_range = '25-30';
  if (age >= 40) age_range = '40+';
  else if (age >= 36) age_range = '36-40';
  else if (age >= 30) age_range = '30-35';

  const amh_status = (user?.amh_value || 2) >= 2 ? 'normal' : 'abnormal';
  const key = `${age_range}_${amh_status}_false`;
  const premiumData = PREMIUM_TABLE[key] || { base: 10000, max: 12000 };

  const policy_number = 'EGG-' + Date.now();
  const start_date = new Date().toISOString().split('T')[0];
  const end_date = new Date(Date.now() + 5 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0];

  db.prepare(
    'INSERT INTO policies (user_id, policy_number, customer_type, age_range, amh_status, annual_premium, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, policy_number, user.customer_type, age_range, amh_status, premiumData.base, start_date, end_date);

  res.status(201).json({ message: '保單建立成功', policy_number, annual_premium: premiumData.base });
});

router.get('/premium-calc', (req, res) => {
  const { age_range = '30-35', amh_status = 'normal', has_major_illness = 'false' } = req.query;
  const key = `${age_range}_${amh_status}_${has_major_illness}`;
  const result = PREMIUM_TABLE[key];
  if (!result) return res.status(400).json({ message: '無效的查詢條件' });
  res.json({
    base_premium: result.base,
    max_premium: result.max,
    display: `${result.base.toLocaleString()} – ${result.max.toLocaleString()}`,
  });
});

router.post('/claims', auth, (req, res) => {
  const { therapy_type, institution } = req.body;
  if (!therapy_type || !institution) return res.status(400).json({ message: '請填寫療程類型與醫療機構' });
  db.prepare(
    'INSERT INTO claims (user_id, therapy_type, institution) VALUES (?, ?, ?)'
  ).run(req.user.id, therapy_type, institution);
  res.status(201).json({ message: '理賠申請已送出，我們將於 3-5 個工作天內與您聯繫。' });
});

module.exports = router;
