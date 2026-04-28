import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { colors, shadows } from '../theme';
import useViewport from '../components/shared/useViewport';
import Icon from '../components/shared/Icon';

export default function LoginPage() {
  const { isMobile, isTablet } = useViewport();
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
      setAlert({ type: 'success', msg: `歡迎回來，${res.data.user.name}` });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || '登入失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  }

  // ── styles ──
  const isStacked = isMobile || isTablet;
  const containerStyle = {
    minHeight: '100vh',
    background: colors.bgWhite,
    display: 'grid',
    gridTemplateColumns: isStacked ? '1fr' : '1.1fr 1fr',
  };

  const heroStyle = {
    background: `linear-gradient(140deg, ${colors.brandNavyDark} 0%, ${colors.brandNavy} 60%, #2C4F7C 100%)`,
    color: '#FFFFFF',
    padding: isMobile ? '40px 24px 56px' : '64px 56px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const formAreaStyle = {
    background: colors.bgWhite,
    padding: isMobile ? '40px 24px 64px' : '64px 56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formCardStyle = {
    width: '100%',
    maxWidth: 420,
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px 13px 46px',
    fontSize: 14,
    border: `1.5px solid ${
      errors[field] ? colors.danger :
      focusField === field ? colors.brandPink : colors.borderLight
    }`,
    borderRadius: 10,
    outline: 'none',
    color: colors.textPrimary,
    background: focusField === field ? colors.bgWhite : colors.bgSoft,
    transition: 'all 0.15s',
    boxShadow: focusField === field ? `0 0 0 4px ${colors.brandPinkBg}` : 'none',
    fontFamily: 'inherit',
  });

  return (
    <div style={containerStyle}>
      {/* === 左側：品牌 Hero === */}
      <section style={heroStyle}>
        {/* 背景裝飾紋理 */}
        <div style={{
          position: 'absolute',
          top: -100, right: -100,
          width: 360, height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.brandPink}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80, left: -60,
          width: 280, height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.brandGold}1A 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* 上半：品牌與標題 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '6px 14px',
            borderRadius: 999,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            marginBottom: 28,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}>
            <Icon name="award" size={14} color={colors.brandGold} />
            <span style={{ color: '#E5E7EB' }}>FRANCE PRÉVOYANCE × 創新競賽佳作</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.brandPink}, ${colors.brandGold})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(246,135,179,0.35)',
            }}>
              <Icon name="egg" size={24} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: 1.5 }}>EGG FREEZE INSURANCE</div>
              <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: 1 }}>孕（運）轉乾坤險</div>
            </div>
          </div>

          <h1 style={{
            fontSize: isMobile ? 32 : 52,
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: -0.5,
          }}>
            凍住希望
            <br />
            <span style={{ color: colors.brandPink }}>卵畫未來</span>
          </h1>
        </div>
      </section>

      {/* === 右側：登入表單 === */}
      <section style={formAreaStyle}>
        <div style={formCardStyle}>
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: colors.brandPink,
            letterSpacing: 2,
            marginBottom: 12,
          }}>SIGN IN</div>

          <h2 style={{
            fontSize: 30,
            fontWeight: 900,
            color: colors.brandNavy,
            marginBottom: 8,
            letterSpacing: -0.5,
          }}>
            歡迎回來
          </h2>
          <p style={{
            fontSize: 14,
            color: colors.textMuted,
            marginBottom: 32,
            lineHeight: 1.6,
          }}>
            登入以管理您的凍卵保單、查看健康數據、預約合作診所。
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
            {/* Alert */}
            {alert && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                background: alert.type === 'error' ? '#FEF2F2' : '#ECFDF5',
                color: alert.type === 'error' ? '#B91C1C' : '#047857',
                border: `1px solid ${alert.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
              }}>
                <Icon
                  name={alert.type === 'error' ? 'alertTriangle' : 'checkCircle'}
                  size={16}
                  color={alert.type === 'error' ? '#B91C1C' : '#047857'}
                />
                {alert.msg}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                電子信箱
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icon name="mail" size={18} color={focusField === 'email' ? colors.brandPink : colors.textPlaceholder} />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  style={inputStyle('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div style={{ fontSize: 12, color: colors.danger, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="alertCircle" size={12} color={colors.danger} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* 密碼 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, letterSpacing: 0.5 }}>
                  密碼
                </label>
                <span style={{ fontSize: 12, color: colors.brandPink, fontWeight: 600, cursor: 'pointer' }}>
                  忘記密碼？
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icon name="lock" size={18} color={focusField === 'password' ? colors.brandPink : colors.textPlaceholder} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="請輸入密碼"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  style={{ ...inputStyle('password'), paddingRight: 48 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6,
                    color: colors.textMuted,
                    lineHeight: 0,
                  }}>
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
              {errors.password && (
                <div style={{ fontSize: 12, color: colors.danger, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="alertCircle" size={12} color={colors.danger} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: '14px',
                background: loading ? '#9CA3AF' : `linear-gradient(135deg, ${colors.brandPink}, #E55A93)`,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : shadows.cta,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}>
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: 16, height: 16,
                    border: '2.5px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  登入中
                </>
              ) : (
                <>
                  <Icon name="logIn" size={18} color="#FFFFFF" />
                  登入帳號
                </>
              )}
            </button>

            {/* Demo 帳號提示 */}
            <div style={{
              padding: '12px 14px',
              background: colors.bgSoft,
              border: `1px dashed ${colors.borderLight}`,
              borderRadius: 10,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 1.6,
            }}>
              <div style={{ fontWeight: 700, color: colors.textSecondary, marginBottom: 4 }}>
                試用 Demo 帳號
              </div>
              Email: <code style={{ background: '#FFFFFF', padding: '1px 6px', borderRadius: 4, color: colors.brandNavy }}>demo@egg.tw</code>
              <span style={{ marginLeft: 8 }}>密碼: <code style={{ background: '#FFFFFF', padding: '1px 6px', borderRadius: 4, color: colors.brandNavy }}>demo123</code></span>
            </div>

            {/* 分隔 + 註冊 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 8,
            }}>
              <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
              <span style={{ fontSize: 12, color: colors.textMuted }}>還沒有帳號？</span>
              <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
            </div>

            <Link to="/register">
              <button type="button" style={{
                width: '100%',
                padding: '13px',
                background: '#FFFFFF',
                color: colors.brandNavy,
                border: `1.5px solid ${colors.borderLight}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.brandNavy; e.currentTarget.style.background = colors.bgSoft; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.borderLight; e.currentTarget.style.background = '#FFFFFF'; }}>
                建立新帳號
              </button>
            </Link>

            {/* 法律提示 */}
            <p style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 1.7, marginTop: 8 }}>
              登入即表示您同意我們的<span style={{ color: colors.brandPink, cursor: 'pointer' }}>服務條款</span>
              與<span style={{ color: colors.brandPink, cursor: 'pointer' }}>隱私權政策</span>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
