import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard',  icon: '🏠', label: '總覽' },
  { to: '/health',     icon: '📊', label: '健康儀表板' },
  { to: '/insurance',  icon: '🛡️', label: '保險理賠' },
  { to: '/booking',    icon: '🏥', label: '醫療預約' },
  { to: '/community',  icon: '💬', label: '社群支持' },
];

const styles = {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F5A623, #FFD580)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 11,
    opacity: 0.7,
    letterSpacing: 1,
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navItem: ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: isActive ? '#1A365D' : 'rgba(255,255,255,0.85)',
    background: isActive ? 'linear-gradient(135deg, #F687B3, #FFB1D0)' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(246,135,179,0.4)' : 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }),
  navIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  userBox: {
    padding: 16,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 4px',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 700 },
  userType: { fontSize: 11, opacity: 0.7 },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    transition: 'background 0.2s',
  },
};

const TYPE_LABEL = {
  potential: '潛在客群', main: '主要客群',
  high_demand: '高需求客群', cancer: '重大疾病方案',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>🥚</div>
        <div style={styles.brandTitle}>凍住希望 卵畫未來</div>
        <div style={styles.brandSub}>孕（運）轉乾坤險</div>
      </div>

      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} style={styles.navItem} end={item.to === '/dashboard'}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.userBox}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.name?.[0] || '?'}</div>
          <div>
            <div style={styles.userName}>{user.name || '訪客'}</div>
            <div style={styles.userType}>{TYPE_LABEL[user.customer_type] || '一般用戶'}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={logout}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          登出
        </button>
      </div>
    </aside>
  );
}
