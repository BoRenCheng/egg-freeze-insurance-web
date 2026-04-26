import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard',  icon: '🏠', label: '總覽' },
  { to: '/health',     icon: '📊', label: '健康儀表板' },
  { to: '/insurance',  icon: '🛡️', label: '保險理賠' },
  { to: '/booking',    icon: '🏥', label: '醫療預約' },
  { to: '/community',  icon: '💬', label: '社群支持' },
];

const TYPE_LABEL = {
  potential: '潛在客群', main: '主要客群',
  high_demand: '高需求客群', cancer: '重大疾病方案',
};

// === 桌面版樣式 ===
const desktopStyles = {
  sidebar: {
    width: 240,
    minWidth: 240,
    background: 'linear-gradient(180deg, #1A365D 0%, #2C4F7C 100%)',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    boxShadow: '4px 0 20px rgba(26,54,93,0.15)',
  },
  brand: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', flexDirection: 'column',
  },
  brandIcon: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F5A623, #FFD580)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, marginBottom: 8,
  },
  brandTitle: { fontSize: 16, fontWeight: 800, letterSpacing: 1 },
  brandSub: { fontSize: 11, opacity: 0.7, letterSpacing: 1 },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', borderRadius: 10,
    fontSize: 14, fontWeight: 600,
    color: isActive ? '#1A365D' : 'rgba(255,255,255,0.85)',
    background: isActive ? 'linear-gradient(135deg, #F687B3, #FFB1D0)' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(246,135,179,0.4)' : 'none',
    transition: 'all 0.2s', cursor: 'pointer',
  }),
  userBox: { padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 700 },
  userType: { fontSize: 11, opacity: 0.7 },
  logoutBtn: {
    width: '100%', padding: '10px',
    background: 'rgba(255,255,255,0.1)', color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8, cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
    marginTop: 8,
  },
};

// === 行動版樣式 ===
const mobileStyles = {
  topBar: {
    background: 'linear-gradient(135deg, #1A365D, #2C4F7C)',
    color: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 4px 12px rgba(26,54,93,0.2)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F5A623, #FFD580)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16,
  },
  brandTitle: { fontSize: 14, fontWeight: 800 },
  hamburger: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: '#FFFFFF',
    width: 36, height: 36,
    borderRadius: 8,
    fontSize: 18,
    cursor: 'pointer',
  },
  navScroller: {
    display: 'flex',
    gap: 6,
    padding: '0 12px 10px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  navItem: ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 700,
    color: isActive ? '#1A365D' : 'rgba(255,255,255,0.85)',
    background: isActive ? 'linear-gradient(135deg, #F687B3, #FFB1D0)' : 'rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    border: 'none',
    cursor: 'pointer',
  }),
  drawer: {
    position: 'fixed',
    top: 0, right: 0,
    width: 260,
    height: '100vh',
    background: '#FFFFFF',
    boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
    zIndex: 100,
    padding: 20,
    transition: 'transform 0.25s',
  },
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: '1px solid #E5E7EB',
  },
  drawerTitle: { fontSize: 16, fontWeight: 800, color: '#1A365D' },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: 22, cursor: 'pointer', color: '#6B7280',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  userName: { fontSize: 14, fontWeight: 700, color: '#1A365D' },
  userType: { fontSize: 11, color: '#6B7280' },
  logoutBtn: {
    width: '100%',
    padding: 12,
    background: 'linear-gradient(135deg, #1A365D, #5B6EC7)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default function Sidebar({ isMobile }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  // ==== 行動版：頂部 nav bar + 抽屜 ====
  if (isMobile) {
    return (
      <>
        <div style={mobileStyles.topBar}>
          <div style={mobileStyles.topRow}>
            <div style={mobileStyles.brandRow}>
              <div style={mobileStyles.brandIcon}>🥚</div>
              <div>
                <div style={mobileStyles.brandTitle}>凍住希望 卵畫未來</div>
              </div>
            </div>
            <button style={mobileStyles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="選單">
              ☰
            </button>
          </div>
          <div style={mobileStyles.navScroller}>
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} style={mobileStyles.navItem} end={item.to === '/dashboard'}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {drawerOpen && (
          <>
            <div style={mobileStyles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
            <div style={mobileStyles.drawer}>
              <div style={mobileStyles.drawerHeader}>
                <div style={mobileStyles.drawerTitle}>個人資訊</div>
                <button style={mobileStyles.closeBtn} onClick={() => setDrawerOpen(false)}>✕</button>
              </div>
              <div style={mobileStyles.userInfo}>
                <div style={mobileStyles.avatar}>{user.name?.[0] || '?'}</div>
                <div>
                  <div style={mobileStyles.userName}>{user.name || '訪客'}</div>
                  <div style={mobileStyles.userType}>{TYPE_LABEL[user.customer_type] || '一般用戶'}</div>
                </div>
              </div>
              <button style={mobileStyles.logoutBtn} onClick={logout}>登出</button>
            </div>
          </>
        )}
      </>
    );
  }

  // ==== 桌面版：左側完整 sidebar ====
  return (
    <aside style={desktopStyles.sidebar}>
      <div style={desktopStyles.brand}>
        <div style={desktopStyles.brandIcon}>🥚</div>
        <div style={desktopStyles.brandTitle}>凍住希望 卵畫未來</div>
        <div style={desktopStyles.brandSub}>孕（運）轉乾坤險</div>
      </div>

      <nav style={desktopStyles.nav}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} style={desktopStyles.navItem} end={item.to === '/dashboard'}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={desktopStyles.userBox}>
        <div style={desktopStyles.userInfo}>
          <div style={desktopStyles.avatar}>{user.name?.[0] || '?'}</div>
          <div>
            <div style={desktopStyles.userName}>{user.name || '訪客'}</div>
            <div style={desktopStyles.userType}>{TYPE_LABEL[user.customer_type] || '一般用戶'}</div>
          </div>
        </div>
        <button style={desktopStyles.logoutBtn} onClick={logout}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          登出
        </button>
      </div>
    </aside>
  );
}
