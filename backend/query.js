// 自訂查詢工具
// 用法: node --experimental-sqlite query.js
const db = require('./db');

// === 在下面寫你想查的 SQL ===

console.log('\n📊 用戶總數');
console.log(db.prepare('SELECT COUNT(*) AS total FROM users').get());

console.log('\n👥 用戶清單（最近註冊優先）');
console.table(
  db.prepare(`
    SELECT id, name, email, customer_type, age, amh_value, created_at
    FROM users
    ORDER BY created_at DESC
  `).all()
);

console.log('\n💬 熱門文章 TOP 5');
console.table(
  db.prepare(`
    SELECT id, author_name, title, like_count, reply_count
    FROM forum_posts
    ORDER BY like_count DESC
    LIMIT 5
  `).all()
);

console.log('\n📅 最近 5 筆預約');
console.table(
  db.prepare(`
    SELECT a.id, u.name AS 用戶, c.name AS 診所, a.appointment_date AS 日期, a.queue_number AS 號碼
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN clinics c ON a.clinic_id = c.id
    ORDER BY a.created_at DESC
    LIMIT 5
  `).all()
);

console.log('\n🛡️ 所有保單與保費');
console.table(
  db.prepare(`
    SELECT p.policy_number AS 保單號, u.name AS 用戶, p.customer_type AS 客群, p.annual_premium AS 年保費
    FROM policies p
    JOIN users u ON p.user_id = u.id
  `).all()
);
