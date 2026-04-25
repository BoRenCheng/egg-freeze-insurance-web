// 環境變數讀取，本地開發若無 .env 則使用預設值
// ⚠️ 在生產環境（Docker / Railway / Cloud Run）必須透過環境變數覆寫
module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL:   process.env.GEMINI_MODEL   || 'gemini-2.5-flash',
  JWT_SECRET:     process.env.JWT_SECRET     || 'dev-only-jwt-secret-replace-in-production',
  DB_PATH:        process.env.DB_PATH        || null,
  PORT:           Number(process.env.PORT)   || 5000,
  NODE_ENV:       process.env.NODE_ENV       || 'development',
};
