const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  console.log('開始建立種子資料...');

  // Demo 用戶
  const hashed = await bcrypt.hash('demo123', 10);
  db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password, age, customer_type, amh_value, has_major_illness)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('江都曖', 'demo@egg.tw', hashed, 36, 'main', 2.1, 0);

  const demo = db.prepare("SELECT id FROM users WHERE email = 'demo@egg.tw'").get();
  const uid = demo.id;

  // AMH 歷史記錄
  const amhHistory = [
    { year: 2018, val: 3.8 }, { year: 2019, val: 3.5 },
    { year: 2021, val: 3.1 }, { year: 2022, val: 2.6 },
    { year: 2023, val: 2.3 }, { year: 2024, val: 2.1 },
  ];
  for (const { year, val } of amhHistory) {
    db.prepare('INSERT OR IGNORE INTO amh_records (user_id, recorded_year, amh_value) VALUES (?, ?, ?)').run(uid, year, val);
  }

  // 凍卵記錄
  db.prepare(`
    INSERT OR IGNORE INTO egg_records (user_id, freeze_date, egg_count, amh_value, health_score)
    VALUES (?, '2024-03-15', 16, 2.1, 'B')
  `).run(uid);

  // 保單
  db.prepare(`
    INSERT OR IGNORE INTO policies (user_id, policy_number, customer_type, age_range, amh_status, annual_premium, start_date, end_date)
    VALUES (?, 'EGG-20240315001', 'main', '36-40', 'normal', 12000, '2024-03-15', '2029-03-15')
  `).run(uid);

  // 診所
  const clinics = [
    { name: '臻觀中醫診所',     type: '中醫', city: '台北市', district: '松山區', address: '台北市松山區東華街136號',     phone: '02-2766-3388', doctor: '林冠吟', specialty: '中醫婦科', rating: 4.9 },
    { name: '天方中醫診所',     type: '中醫', city: '台北市', district: '松山區', address: '台北市松山區虎林街121巷10號', phone: '02-2767-8899', doctor: '陳美玲', specialty: '中醫婦科', rating: 4.7 },
    { name: '建中中醫診所',     type: '中醫', city: '台北市', district: '大安區', address: '台北市大安區中南路1段46號',   phone: '02-2826-2009', doctor: '王建國', specialty: '中醫婦科', rating: 4.6 },
    { name: '進春中醫診所',     type: '中醫', city: '台北市', district: '大安區', address: '台北市大安區中南路1段125號',  phone: '02-2892-5557', doctor: '張進春', specialty: '針灸調理', rating: 4.5 },
    { name: '台北生殖醫學中心', type: '西醫', city: '台北市', district: '信義區', address: '台北市信義區忠孝東路五段100號', phone: '02-8780-1234', doctor: '林志明', specialty: '生殖內分泌', rating: 4.9 },
    { name: '送子鳥生殖中心',   type: '西醫', city: '台北市', district: '大安區', address: '台北市大安區復興南路二段200號', phone: '02-2700-5566', doctor: '吳明輝', specialty: '試管嬰兒', rating: 4.8 },
    { name: '馬偕生殖醫學科',   type: '西醫', city: '台北市', district: '中山區', address: '台北市中山區中山北路二段92號',  phone: '02-2543-3535', doctor: '黃怡蓉', specialty: '卵巢功能評估', rating: 4.7 },
    { name: '台中漢唐中醫',     type: '中醫', city: '台中市', district: '西屯區', address: '台中市西屯區台灣大道三段500號', phone: '04-2252-3456', doctor: '李漢唐', specialty: '中醫婦科', rating: 4.6 },
    { name: '台中孕寶生殖中心', type: '西醫', city: '台中市', district: '北區',   address: '台中市北區雙十路一段30號',    phone: '04-2201-1234', doctor: '陳孕蓁', specialty: '生殖醫學', rating: 4.8 },
    { name: '高雄欣苑中醫',     type: '中醫', city: '高雄市', district: '苓雅區', address: '高雄市苓雅區中正一路120號',   phone: '07-335-8899', doctor: '蔡欣怡', specialty: '中醫婦科', rating: 4.5 },
    { name: '高雄長庚生殖科',   type: '西醫', city: '高雄市', district: '鳥松區', address: '高雄市鳥松區大埤路123號',     phone: '07-731-7123', doctor: '周文欣', specialty: '試管嬰兒', rating: 4.7 },
    { name: '新北悅馨中醫',     type: '中醫', city: '新北市', district: '板橋區', address: '新北市板橋區文化路一段88號',   phone: '02-2951-8899', doctor: '許悅馨', specialty: '婦科調理', rating: 4.6 },
  ];
  for (const c of clinics) {
    db.prepare(`
      INSERT OR IGNORE INTO clinics (name, type, city, district, address, phone, doctor_name, specialty, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(c.name, c.type, c.city, c.district, c.address, c.phone, c.doctor, c.specialty, c.rating);
  }

  // 論壇文章
  const posts = [
    // 菁英女性
    { author: '小如', cat: '菁英女性', title: '35歲高管決定凍卵：給未來的自己一個選擇', excerpt: '在職場打拼十年，終於決定為自己的生育力做一個投資。分享我的凍卵決策過程和注意事項...', tags: ['#職場平衡', '#自我投資', '#菁英女性'], likes: 102, replies: 24 },
    { author: '珊珊', cat: '菁英女性', title: '凍卵後的心理變化：焦慮少了，底氣多了', excerpt: '凍完卵之後，感覺對於婚姻和生育的焦慮大幅降低，終於可以好好談一段感情了...', tags: ['#心理健康', '#年齡焦慮', '#凍卵心得'], likes: 87,  replies: 18 },
    { author: '雅婷', cat: '菁英女性', title: 'AMH 2.1也能凍到好卵？我的親身經歷', excerpt: '醫生說我AMH偏低，但透過中醫調理三個月後，取卵數量超出預期。希望分享給有同樣擔憂的姐妹們...', tags: ['#AMH偏低', '#中醫調理', '#菁英女性'], likes: 156, replies: 31 },
    // LGBTQ+
    { author: '曉云', cat: 'LGBTQ+', title: '身為女同志，凍卵是我給自己的禮物', excerpt: '和女友討論了很久，決定凍卵是對我們未來家庭規劃最重要的一步。分享整個過程和法律挑戰...', tags: ['#LGBTQ+', '#同志家庭', '#生育權益'], likes: 78,  replies: 22 },
    { author: '品萱', cat: 'LGBTQ+', title: '人工生殖法的限制如何影響我們？', excerpt: '台灣的《人工生殖法》對同性伴侶有諸多限制，但凍卵是目前可行的選項，等待未來法規開放...', tags: ['#LGBTQ+', '#法律政策', '#生育平等'], likes: 134, replies: 45 },
    { author: '依晴', cat: 'LGBTQ+', title: '找到友善的診所：我的問診經驗分享', excerpt: '花了很多時間找到一間對LGBTQ+友善的生殖診所，整理了幾個篩選重點分享給大家...', tags: ['#LGBTQ+', '#友善診所', '#資源分享'], likes: 96,  replies: 19 },
    // 病友支持
    { author: '小蕾', cat: '病友支持', title: '乳癌確診後緊急凍卵：與時間賽跑的故事', excerpt: '收到診斷書的那天，醫生建議我在化療前盡快凍卵。分享這段緊迫又充滿勇氣的過程...', tags: ['#癌症病友', '#緊急凍卵', '#勇氣'], likes: 203, replies: 67 },
    { author: '芊芊', cat: '病友支持', title: 'POF患者：珍貴的卵子請好好保管', excerpt: '被診斷出卵巢早衰(POF)的那年才28歲，幸好還來得及凍卵。給同樣面對早衰的姐妹們...', tags: ['#POF', '#卵巢早衰', '#病友互助'], likes: 167, replies: 43 },
    { author: '怡君', cat: '病友支持', title: '化療後還能懷孕嗎？我的問答整理', excerpt: '整理了與生殖科醫師的諮詢筆記，關於化療對生育力的影響以及凍卵的必要性...', tags: ['#化療', '#生育保存', '#醫療資訊'], likes: 119, replies: 38 },
    // 法律政策
    { author: '律師Amy', cat: '法律政策', title: '《人工生殖法》修正草案：有什麼改變？', excerpt: '近年修正草案擬放寬單身女性及同性伴侶的適用範圍，解析最新進展與可能影響...', tags: ['#法律政策', '#人工生殖法', '#修法進度'], likes: 89,  replies: 27 },
    { author: '政策研究員', cat: '法律政策', title: '各縣市生育補助懶人包 2026版', excerpt: '整理了全台22縣市最新生育補助資訊，包含試管嬰兒補助資格與金額對照表...', tags: ['#生育補助', '#政策資訊', '#縣市補助'], likes: 245, replies: 53 },
    { author: '倡議者小鹿', cat: '法律政策', title: '為什麼試管補助只限異性配偶不公平？', excerpt: '從人權角度分析現行政策的不平等之處，以及我們可以如何參與倡議改變...', tags: ['#生育平等', '#倡議行動', '#政策批判'], likes: 178, replies: 62 },
    // 知識庫
    { author: '醫學編輯', cat: '知識庫', title: '解讀你的AMH值：正常範圍與意義', excerpt: 'AMH（抗穆勒氏管荷爾蒙）是衡量卵巢庫存的重要指標。數值1.5–3.5 ng/mL為正常範圍，一起了解如何解讀...', tags: ['#AMH解析', '#卵巢功能', '#醫學知識'], likes: 312, replies: 74 },
    { author: '凍卵衛教師', cat: '知識庫', title: '凍卵全流程圖解：從諮詢到保存', excerpt: '詳解凍卵五大步驟：初診評估 → 促排卵 → 卵泡監測 → 取卵手術 → 玻璃化冷凍保存...', tags: ['#凍卵流程', '#醫療知識', '#新手必讀'], likes: 267, replies: 58 },
    { author: '中醫師林博士', cat: '知識庫', title: '中醫如何幫助提升卵子品質？', excerpt: '從中醫角度，「腎氣」與生育力密切相關。補腎養血的藥方如何改善卵巢功能？科學實證解析...', tags: ['#中醫調理', '#卵子品質', '#中西醫整合'], likes: 198, replies: 41 },
  ];

  for (const p of posts) {
    db.prepare(`
      INSERT OR IGNORE INTO forum_posts (author_name, category, title, excerpt, tags, like_count, reply_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || (abs(random()) % 30) || ' days'))
    `).run(p.author, p.cat, p.title, p.excerpt, JSON.stringify(p.tags), p.likes, p.replies);
  }

  console.log('種子資料建立完成！');
  console.log('Demo 帳號: demo@egg.tw / demo123');
}

module.exports = seed;

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1); });
}
