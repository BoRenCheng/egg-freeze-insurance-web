import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #1E3A6E 0%, #5B6EC7 50%, #8A99D6 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    top: -100,
    right: -100,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: '50%',
    background: 'rgba(245,166,35,0.15)',
    bottom: 50,
    left: -80,
  },
  decorCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    bottom: 200,
    right: 80,
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    position: 'relative',
    zIndex: 1,
  },
  brandIcon: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F5A623, #FFD580)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 42,
    marginBottom: 24,
    boxShadow: '0 8px 32px rgba(245,166,35,0.4)',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 900,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 1.3,
    marginBottom: 8,
    letterSpacing: 2,
  },
  brandHighlight: {
    color: '#F5A623',
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 3,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
  },
  featureIcon: {
    fontSize: 20,
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(245,166,35,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 500,
  },
  rightPanel: {
    width: 480,
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 48px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '-20px 0 60px rgba(0,0,0,0.2)',
  },
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1E3A6E',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1E3A6E',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    fontSize: 18,
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    fontSize: 15,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    color: '#1E3A6E',
    background: '#F9FAFB',
    fontFamily: 'inherit',
  },
  inputFocus: {
    borderColor: '#5B6EC7',
    boxShadow: '0 0 0 3px rgba(91,110,199,0.15)',
    background: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
    boxShadow: '0 0 0 3px rgba(239,68,68,0.1)',
  },
  togglePassword: {
    position: 'absolute',
    right: 14,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#9CA3AF',
    padding: 4,
    lineHeight: 1,
  },
  errorMsg: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  forgotLink: {
    textAlign: 'right',
    marginTop: -12,
  },
  forgotText: {
    fontSize: 13,
    color: '#5B6EC7',
    cursor: 'pointer',
    fontWeight: 500,
  },
  alertBox: {
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  alertError: {
    background: '#FEE2E2',
    color: '#DC2626',
    border: '1px solid #FECACA',
  },
  alertSuccess: {
    background: '#D1FAE5',
    color: '#065F46',
    border: '1px solid #A7F3D0',
  },
  submitBtn: {
    padding: '14px',
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #5B6EC7, #1E3A6E)',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.2s',
    letterSpacing: 1,
    boxShadow: '0 4px 15px rgba(91,110,199,0.4)',
    fontFamily: 'inherit',
    marginTop: 4,
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: 500,
  },
  registerRow: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    color: '#F5A623',
    fontWeight: 700,
    cursor: 'pointer',
    marginLeft: 4,
  },
  loadingSpinner: {
    display: 'inline-block',
    width: 18,
    height: 18,
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: 8,
    verticalAlign: 'middle',
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [focusField, setFocusField] = useState(null);

  function validate() {
    const errs = {};
    if (!form.email) errs.email = '請輸入 Email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email 格式不正確';
    if (!form.password) errs.password = '請輸入密碼';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setAlert(null);
    try {
      const res = await axios.post('/api/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAlert({ type: 'success', msg: `歡迎回來，${res.data.user.name}！` });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || '登入失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  }

  function getInputStyle(field) {
    const base = { ...styles.input };
    if (focusField === field) Object.assign(base, styles.inputFocus);
    if (errors[field]) Object.assign(base, styles.inputError);
    return base;
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:not(:disabled):hover { filter: brightness(1.05); }
        .submit-btn:not(:disabled):active { transform: scale(0.98); }
      `}</style>

      {/* 裝飾圓圈 */}
      <div style={styles.decorCircle1} />
      <div style={styles.decorCircle2} />
      <div style={styles.decorCircle3} />

      {/* 左側品牌區 */}
      <div style={styles.leftPanel}>
        <div style={styles.brandIcon}>🥚</div>
        <div style={styles.brandTitle}>
          <span style={styles.brandHighlight}>凍</span>住希望{' '}
          <span style={styles.brandHighlight}>卵</span>畫未來
        </div>
        <div style={styles.brandSubtitle}>孕（運）轉乾坤險</div>

        <div style={styles.featureList}>
          {[
            { icon: '🛡️', text: '凍卵療程全程保障，安心無憂' },
            { icon: '📊', text: '個人化 AMH 分析，精準保費試算' },
            { icon: '🏥', text: '中西醫三方合作生態系' },
            { icon: '💛', text: '涵蓋高齡、癌症、LGBTQ+ 客群' },
          ].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <span style={styles.featureText}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 右側登入表單 */}
      <div style={styles.rightPanel}>
        <div style={styles.formHeader}>
          <div style={styles.formTitle}>歡迎回來</div>
          <div style={styles.formSubtitle}>請登入您的帳號以繼續使用服務</div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {alert && (
            <div style={{ ...styles.alertBox, ...(alert.type === 'error' ? styles.alertError : styles.alertSuccess) }}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
            </div>
          )}

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>電子信箱</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="請輸入您的 Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                style={getInputStyle('email')}
                autoComplete="email"
              />
            </div>
            {errors.email && <div style={styles.errorMsg}>⚠ {errors.email}</div>}
          </div>

          {/* 密碼 */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>密碼</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="請輸入您的密碼"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
                style={getInputStyle('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div style={styles.errorMsg}>⚠ {errors.password}</div>}
          </div>

          <div style={styles.forgotLink}>
            <span style={styles.forgotText}>忘記密碼？</span>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
          >
            {loading && <span style={styles.loadingSpinner} />}
            {loading ? '登入中...' : '登入'}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>還沒有帳號？</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.registerRow}>
            立即加入孕（運）轉乾坤險
            <Link to="/register">
              <span style={styles.registerLink}>免費註冊 →</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
