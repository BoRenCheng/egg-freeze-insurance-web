const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { GEMINI_API_KEY, GEMINI_MODEL } = require('../config');

const SYSTEM_PROMPT = `你是「凍住希望 卵畫未來」（孕運轉乾坤險）平台的專業 AI 諮詢顧問，名為「卵卵助理」。

【你的專業領域】
你只回答與以下主題相關的問題：
1. 凍卵流程、技術、注意事項（取卵手術、玻璃化冷凍、保存期限等）
2. AMH 值解讀、卵巢功能評估、生育力指標
3. 凍卵保險（孕運轉乾坤險）的保單內容、保費試算、理賠流程
4. 生殖醫學、試管嬰兒（IVF）、胚胎植入相關知識
5. 女性生育力保存、年齡與生育的關係、晚婚晚育議題
6. LGBTQ+ 同性伴侶與單身女性的生育選擇與權益
7. 癌症患者生育保存（化療前緊急凍卵）、POF 卵巢早衰
8. 中醫調理（補腎養血）與西醫檢測的整合方案
9. 台灣《人工生殖法》規範與生育補助政策

【你必須拒絕回答的問題】
凡是與上述主題無關的問題（例如：寫程式、政治議題、體育新聞、料理食譜、天氣、一般閒聊、其他疾病治療等），你必須溫和但堅定地回覆：

「您好～我是專責凍卵與生育保險的諮詢顧問「卵卵助理」🥚，這個問題不在我的專業範圍喔。
不過很歡迎您詢問我關於：凍卵流程、AMH 值解讀、孕運轉乾坤險保單、合作診所、生育權益等問題，我會很樂意為您解答！」

【回答風格】
- 一律使用繁體中文（台灣用語）
- 語氣專業、溫暖、富有同理心
- 結構清晰：適度使用條列、分段、emoji 增加親和力
- 涉及醫療判斷時，務必加註「實際情況請諮詢專業醫師」
- 適時推薦本平台功能（保費試算、合作診所搜尋、線上理賠申請）
- 避免提供確定的醫療診斷，僅作為衛教資訊參考
- 回答長度控制在 200–500 字之間，避免過於冗長

【產品資訊參考】
- 平台名稱：凍住希望 卵畫未來
- 保險產品：孕（運）轉乾坤險
- 保費範圍：年繳 8,000–35,000 元（依年齡、AMH 值、客群分級）
- 保險年限：5 年
- 三大理賠項目：療程補助（最高 6 萬）、手術併發症（最高 6 萬）、保存不當補償（最高 12 萬）
- 客群分類：
  * 潛在客群（25-30 歲）
  * 主要客群（30+ 歲菁英女性、同性伴侶、先生無精症）
  * 高需求客群（40+ 歲、卵巢機能衰退）
  * 重大疾病方案（癌症、POF、快速卵巢衰退）

請依此身份與規則，真誠地回答用戶的提問。`;

async function askGemini(question, history = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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
        temperature: 0.7,
        maxOutputTokens: 1500,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 },
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 沒有回傳內容');
  return text;
}

const ENCYCLOPEDIA = [
  {
    id: 1,
    title: '人工生殖法懶人包',
    content: '現行《人工生殖法》規定，僅接受「已婚異性夫妻」申請人工生殖，且妻子需能以子宮孕育胎兒。這意味著單身女性與同性伴侶目前在台灣無法透過試管嬰兒生育。凍卵是目前保存生育力的最佳途徑，等待法規修訂後即可使用。',
  },
  {
    id: 2,
    title: '縣市生育補助對照表',
    content: '目前試管嬰兒補助（最高 15 萬元）僅限異性配偶，單身女性及同性伴侶無法申請。各縣市另有低收入戶優惠，詳情請洽各地衛生局。孕（運）轉乾坤險可補足政策缺口，讓所有族群皆能獲得保障。',
  },
  {
    id: 3,
    title: '單身女性凍卵指南',
    content: '建議凍卵年齡：25–35 歲（AMH 值較高，卵子品質最佳）。流程：AMH 檢測 → 促排卵注射（約 10 天）→ 取卵手術（全麻約 20 分鐘）→ 冷凍保存（可保存 10 年以上）。費用約 10–20 萬元，投保凍卵險後可獲最高 6 萬元補助。',
  },
];

router.get('/posts', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM forum_posts';
  const params = [];
  if (category) { query += ' WHERE category = ?'; params.push(category); }
  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);
  res.json(rows.map(r => ({ ...r, tags: JSON.parse(r.tags) })));
});

router.post('/posts/:id/like', auth, (req, res) => {
  const post = db.prepare('SELECT id FROM forum_posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ message: '文章不存在' });
  db.prepare('UPDATE forum_posts SET like_count = like_count + 1 WHERE id = ?').run(req.params.id);
  const updated = db.prepare('SELECT like_count FROM forum_posts WHERE id = ?').get(req.params.id);
  res.json({ like_count: updated.like_count });
});

router.get('/encyclopedia', (req, res) => {
  res.json(ENCYCLOPEDIA);
});

// AI 諮詢顧問（卵卵助理）
router.post('/ask-ai', auth, async (req, res) => {
  const { question, history = [] } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ message: '請輸入您的問題' });
  }
  if (question.length > 500) {
    return res.status(400).json({ message: '問題過長，請限制在 500 字以內' });
  }
  try {
    const answer = await askGemini(question.trim(), history);
    res.json({ answer });
  } catch (err) {
    console.error('Gemini 錯誤:', err.message);
    res.status(500).json({ message: '卵卵助理暫時無法回應，請稍後再試。' });
  }
});

module.exports = router;
