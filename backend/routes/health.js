const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

function computeHealthGrade(amh) {
  if (amh >= 3.5) return { grade: 'A', probability: 90, advice: 'AMH值表現優秀！繼續保持規律的運動和均衡飲食，妳的卵子品質非常棒喔～' };
  if (amh >= 1.5) return { grade: 'B', probability: 80, advice: 'AMH值有逐年回歸正常值，繼續保持規律的運動和健康飲食，妳的卵子品質就會越來越好喔～' };
  return { grade: 'C', probability: 55, advice: 'AMH值偏低，建議盡快至婦產科評估，搭配中醫調理改善卵巢功能，提升受孕機率。' };
}

router.get('/summary', auth, (req, res) => {
  const egg = db.prepare(
    'SELECT * FROM egg_records WHERE user_id = ? ORDER BY freeze_date DESC LIMIT 1'
  ).get(req.user.id);
  const amhRow = db.prepare(
    'SELECT amh_value FROM amh_records WHERE user_id = ? ORDER BY recorded_year DESC LIMIT 1'
  ).get(req.user.id);
  const user = db.prepare('SELECT amh_value, age FROM users WHERE id = ?').get(req.user.id);

  const amh = amhRow?.amh_value ?? user?.amh_value ?? 2.1;
  const { grade, probability, advice } = computeHealthGrade(amh);

  res.json({
    egg_count: egg?.egg_count ?? 0,
    freeze_date: egg?.freeze_date ?? null,
    amh_value: amh,
    health_grade: grade,
    pregnancy_probability: probability,
    doctor_advice: advice,
    warning: amh < 1.5 ? '目前狀況需要關注，建議盡快諮詢醫師。' : '目前狀況很棒！請繼續保持～',
  });
});

router.get('/amh-history', auth, (req, res) => {
  const rows = db.prepare(
    'SELECT recorded_year AS year, amh_value FROM amh_records WHERE user_id = ? ORDER BY recorded_year ASC'
  ).all(req.user.id);
  res.json(rows);
});

router.post('/amh-records', auth, (req, res) => {
  const { recorded_year, amh_value, notes } = req.body;
  if (!recorded_year || !amh_value) return res.status(400).json({ message: '請提供年份與 AMH 值' });
  db.prepare(
    'INSERT INTO amh_records (user_id, recorded_year, amh_value, notes) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, recorded_year, amh_value, notes || null);
  res.status(201).json({ message: '新增成功' });
});

module.exports = router;
