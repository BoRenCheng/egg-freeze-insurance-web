const db = require('./db');

const tables = ['users', 'policies', 'egg_records', 'amh_records', 'clinics', 'appointments', 'forum_posts', 'claims'];

console.log('\n========== 資料庫總覽 ==========\n');

for (const t of tables) {
  const count = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
  console.log(`📊 ${t}: ${count} 筆`);
}

console.log('\n========== 使用者清單 ==========');
const users = db.prepare('SELECT id, name, email, age, customer_type, amh_value FROM users').all();
console.table(users);

console.log('\n========== AMH 記錄 ==========');
console.table(db.prepare('SELECT user_id, recorded_year, amh_value FROM amh_records ORDER BY user_id, recorded_year').all());

console.log('\n========== 保單 ==========');
console.table(db.prepare('SELECT id, user_id, policy_number, customer_type, annual_premium, status FROM policies').all());

console.log('\n========== 診所（前 5 筆）==========');
console.table(db.prepare('SELECT id, name, type, city, district, doctor_name, rating FROM clinics LIMIT 5').all());

console.log('\n========== 預約紀錄 ==========');
console.table(db.prepare(`
  SELECT a.id, c.name AS clinic, a.doctor_name, a.appointment_date, a.queue_number, a.status
  FROM appointments a JOIN clinics c ON a.clinic_id = c.id
`).all());

console.log('\n========== 論壇文章（前 5 筆）==========');
console.table(db.prepare('SELECT id, author_name, category, title, like_count, reply_count FROM forum_posts LIMIT 5').all());

console.log('\n========== 理賠申請 ==========');
console.table(db.prepare('SELECT * FROM claims').all());

console.log('\n========== 完成 ==========\n');
