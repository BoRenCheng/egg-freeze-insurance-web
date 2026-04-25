const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/clinics', (req, res) => {
  const { city, district, type } = req.query;
  let query = 'SELECT * FROM clinics WHERE 1=1';
  const params = [];
  if (city)     { query += ' AND city = ?';     params.push(city); }
  if (district) { query += ' AND district = ?'; params.push(district); }
  if (type)     { query += ' AND type = ?';     params.push(type); }
  query += ' ORDER BY rating DESC';
  res.json(db.prepare(query).all(...params));
});

router.get('/clinics/:id', (req, res) => {
  const clinic = db.prepare('SELECT * FROM clinics WHERE id = ?').get(req.params.id);
  if (!clinic) return res.status(404).json({ message: '診所不存在' });
  res.json(clinic);
});

router.get('/appointments', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, c.name AS clinic_name, c.type AS clinic_type, c.address AS clinic_address
    FROM appointments a
    JOIN clinics c ON a.clinic_id = c.id
    WHERE a.user_id = ?
    ORDER BY a.appointment_date DESC
  `).all(req.user.id);
  res.json(rows);
});

router.post('/appointments', auth, (req, res) => {
  const { clinic_id, doctor_name, appointment_date, appointment_time, notes } = req.body;
  if (!clinic_id || !doctor_name || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: '請填寫完整預約資訊' });
  }
  const clinic = db.prepare('SELECT * FROM clinics WHERE id = ?').get(clinic_id);
  if (!clinic) return res.status(404).json({ message: '診所不存在' });

  const queue_number = Math.floor(Math.random() * 50) + 1;
  const discount_code = 'APP預約享9折';

  const result = db.prepare(
    'INSERT INTO appointments (user_id, clinic_id, doctor_name, appointment_date, appointment_time, queue_number, discount_code, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, clinic_id, doctor_name, appointment_date, appointment_time, queue_number, discount_code, notes || null);

  res.status(201).json({
    message: '預約成功',
    appointment_id: result.lastInsertRowid,
    clinic_name: clinic.name,
    doctor_name,
    appointment_date,
    appointment_time,
    queue_number,
    discount_code,
  });
});

module.exports = router;
