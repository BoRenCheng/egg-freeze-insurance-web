const { GEMINI_API_KEY, GEMINI_MODEL } = require('./config');
console.log('Model:', GEMINI_MODEL);
console.log('Key prefix:', GEMINI_API_KEY.substring(0, 10));

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: '你是凍卵專家' }] },
      contents: [{ role: 'user', parts: [{ text: '你好' }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
    })
  });
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Response:', data.substring(0, 1500));
}
test().catch(e => console.error('ERROR:', e.message));
