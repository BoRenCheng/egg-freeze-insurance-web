import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TILES = [
  { to: '/health',    icon: '📊', title: '健康儀表板', desc: '卵子數量、AMH 變化趨勢、受孕機率', color: '#F687B3', bg: 'linear-gradient(135deg, #F687B3, #FBB6CE)' },
  { to: '/insurance', icon: '🛡️', title: '保險理賠中心', desc: '保單詳情、保費試算、線上理賠', color: '#1A365D', bg: 'linear-gradient(135deg, #1A365D, #5B6EC7)' },
  { to: '/booking',   icon: '🏥', title: '醫療生態預約', desc: '中西醫合作診所搜尋與線上預約', color: '#F5A623', bg: 'linear-gradient(135deg, #F5A623, #FFD580)' },
  { to: '/community', icon: '💬', title: '社群支持', desc: '專屬族群討論、法律百科、知識庫', color: '#10B981', bg: 'linear-gradient(135deg, #10B981, #6EE7B7)' },
];

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 28 },
  hero: {
    background: 'linear-gradient(135deg, #1A365D, #5B6EC7)',
    borderRadius: 24,
    padding: '36px 40px',
    color: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(26,54,93,0.25)',
  },
  heroDecor: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: '50%',
    background: 'rgba(245,166,35,0.15)',
    top: -60,
    right: -40,
  },
  heroDecor2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'rgba(246,135,179,0.18)',
    bottom: -40,
    right: 200,
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(245,166,35,0.25)',
    color: '#FFD580',
    padding: '4px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 12,
  },
  heroTitle: { fontSize: 30, fontWeight: 900, marginBottom: 8, position: 'relative' },
  heroSub:   { fontSize: 15, opacity: 0.85, position: 'relative', maxWidth: 600 },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: '#1A365D' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },
  tile: (hover, bg) => ({
    background: bg,
    borderRadius: 18,
    padding: '28px 24px',
    color: '#FFFFFF',
    cursor: 'pointer',
    transform: hover ? 'translateY(-6px)' : 'translateY(0)',
    boxShadow: hover ? '0 16px 36px rgba(0,0,0,0.18)' : '0 6px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  tileIcon: { fontSize: 36, marginBottom: 10 },
  tileTitle: { fontSize: 18, fontWeight: 800, marginBottom: 6 },
  tileDesc: { fontSize: 13, opacity: 0.92, lineHeight: 1.5 },
  tileArrow: { marginTop: 14, fontSize: 14, fontWeight: 700, opacity: 0.9 },
};

function Tile({ tile }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      style={styles.tile(hover, tile.bg)}
      onClick={() => navigate(tile.to)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>
        <div style={styles.tileIcon}>{tile.icon}</div>
        <div style={styles.tileTitle}>{tile.title}</div>
        <div style={styles.tileDesc}>{tile.desc}</div>
      </div>
      <div style={styles.tileArrow}>進入 →</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    }).catch(() => {
      localStorage.clear();
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroDecor} />
        <div style={styles.heroDecor2} />
        <div style={{ position: 'relative' }}>
          <div style={styles.heroBadge}>🥚 孕（運）轉乾坤險</div>
          <div style={styles.heroTitle}>歡迎回來，{user?.name || '...'}</div>
          <div style={styles.heroSub}>
            凍住希望，卵畫未來。透過下方功能模組，掌握您的健康數據、管理保單、預約合作診所，並與專屬社群互動。
          </div>
        </div>
      </div>

      <div style={styles.sectionTitle}>核心功能</div>
      <div style={styles.grid}>
        {TILES.map(t => <Tile key={t.to} tile={t} />)}
      </div>
    </div>
  );
}
