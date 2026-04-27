import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { colors, shadows } from '../theme';
import useViewport from './shared/useViewport';

const NAV_ITEMS = [
  { to: '/dashboard',  label: '首頁' },
  { to: '/health',     label: '健康儀表板' },
  { to: '/insurance',  label: '保險理賠' },
  { to: '/booking',    label: '醫療預約' },
  { to: '/community',  label: '社群支持' },
];

const TYPE_LABEL = {
  potential: '潛在客群',
  main: '主要客群',
  high_demand: '高需求客群',
  cancer: '重大疾病方案',
};

const styles = {
  navbar: (scrolled) => ({
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: colors.bgWhite,
    borderBottom: `1px solid ${scrolled ? colors.borderLight : 'transparent'}`,
    boxShadow: scrolled ? shadows.navbar : 'none',
    transition: 'all 0.2s ease',
  }),
  container: (isMobile) => ({
    maxWidth: 1280,
    margin: '0 auto',
    padding: isMobile ? '14px 18px' : '18px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  }),
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.brandPink}, ${colors.brandGold})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    boxShadow: '0 4px 12px rgba(246,135,179,0.35)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.brandNavy,
    letterSpacing: 0.3,
  },
  brandSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: 500,
    marginTop: 2,
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  navItem: ({ isActive }) => ({
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: isActive ? colors.brandPink : colors.textSecondary,
    background: isActive ? colors.brandPinkBg : 'transparent',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  }),
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px 6px 6px',
    borderRadius: 999,
    background: colors.bgSoft,
    border: `1px solid ${colors.borderLight}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  avatar: {
    width: 30, height: 30,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.brandPink}, ${colors.brandGold})`,
    color: colors.bgWhite,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  hamburger: {
    background: colors.bgSoft,
    border: `1px solid ${colors.borderLight}`,
    width: 40, height: 40,
    borderRadius: 10,
    fontSize: 20,
    cursor: 'pointer',
    color: colors.brandNavy,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ====== 行動版抽屜 ======
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 99,
    animation: 'fadeIn 0.2s ease',
  },
  drawer: {
    position: 'fixed',
    top: 0, right: 0,
    width: '85%',
    maxWidth: 320,
    height: '100vh',
    background: colors.bgWhite,
    boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.25s ease',
  },
  drawerHeader: {
    padding: '20px 22px',
    borderBottom: `1px solid ${colors.borderLight}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 24,
    color: colors.textMuted,
    cursor: 'pointer',
    padding: 4,
    lineHeight: 1,
  },
  drawerNav: {
    flex: 1,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    overflow: 'auto',
  },
  drawerItem: ({ isActive }) => ({
    padding: '14px 16px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    color: isActive ? colors.brandPink : colors.textPrimary,
    background: isActive ? colors.brandPinkBg : 'transparent',
    cursor: 'pointer',
  }),
  drawerFooter: {
    padding: 18,
    borderTop: `1px solid ${colors.borderLight}`,
    background: colors.bgSoft,
  },
  drawerUserRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  drawerUserName: { fontSize: 14, fontWeight: 700, color: colors.textPrimary },
  drawerUserType: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  logoutBtn: {
    width: '100%',
    padding: 12,
    background: colors.brandNavy,
    color: colors.bgWhite,
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};

export default function TopNavbar() {
  const navigate = useNavigate();
  const { isMobile } = useViewport();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由變更時自動關閉抽屜
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      <nav style={styles.navbar(scrolled)}>
        <div style={styles.container(isMobile)}>
          <div style={styles.brandRow} onClick={() => navigate('/dashboard')}>
            <div style={styles.brandIcon}>🥚</div>
            <div style={styles.brandText}>
              <div style={styles.brandTitle}>凍住希望 卵畫未來</div>
              <div style={styles.brandSub}>孕（運）轉乾坤險</div>
            </div>
          </div>

          {!isMobile && (
            <div style={styles.navList}>
              {NAV_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} style={styles.navItem}
                  end={item.to === '/dashboard'}
                  onMouseEnter={e => e.currentTarget.style.background = colors.bgSoft}
                  onMouseLeave={e => {
                    const active = e.currentTarget.getAttribute('aria-current') === 'page';
                    e.currentTarget.style.background = active ? colors.brandPinkBg : 'transparent';
                  }}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          <div style={styles.rightSide}>
            {!isMobile && user.name && (
              <div style={styles.userPill} onClick={logout} title="點擊登出">
                <div style={styles.avatar}>{user.name?.[0] || '?'}</div>
                <span style={styles.userName}>{user.name}</span>
              </div>
            )}
            {isMobile && (
              <button style={styles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="開啟選單">
                ☰
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 行動版抽屜 */}
      {drawerOpen && (
        <>
          <div style={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
          <aside style={styles.drawer}>
            <div style={styles.drawerHeader}>
              <div style={styles.brandRow}>
                <div style={styles.brandIcon}>🥚</div>
                <div style={styles.brandText}>
                  <div style={styles.brandTitle}>凍住希望 卵畫未來</div>
                </div>
              </div>
              <button style={styles.drawerCloseBtn} onClick={() => setDrawerOpen(false)}>✕</button>
            </div>

            <nav style={styles.drawerNav}>
              {NAV_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} style={styles.drawerItem}
                  end={item.to === '/dashboard'} onClick={() => setDrawerOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div style={styles.drawerFooter}>
              <div style={styles.drawerUserRow}>
                <div style={styles.avatar}>{user.name?.[0] || '?'}</div>
                <div>
                  <div style={styles.drawerUserName}>{user.name || '訪客'}</div>
                  <div style={styles.drawerUserType}>{TYPE_LABEL[user.customer_type] || '一般用戶'}</div>
                </div>
              </div>
              <button style={styles.logoutBtn} onClick={logout}>登出</button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
