import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { colors, shadows, radius } from '../theme';
import useViewport from '../components/shared/useViewport';

const FEATURE_CARDS = [
  {
    to: '/health',
    icon: '📊',
    title: '健康儀表板',
    desc: 'AMH 變化趨勢、卵子數量、受孕機率預測',
    accent: colors.brandPink,
    bg: colors.brandPinkBg,
  },
  {
    to: '/insurance',
    icon: '🛡️',
    title: '保險理賠中心',
    desc: '保單詳情、保費試算、線上理賠申請',
    accent: colors.brandNavy,
    bg: '#EFF4FA',
  },
  {
    to: '/booking',
    icon: '🏥',
    title: '醫療生態預約',
    desc: '中西醫合作診所搜尋、線上預約',
    accent: colors.brandGold,
    bg: colors.brandGoldSoft,
  },
  {
    to: '/community',
    icon: '💬',
    title: '社群支持',
    desc: '專屬族群論壇、法律百科、AI 諮詢',
    accent: colors.success,
    bg: '#ECFDF5',
  },
];

const STATS = [
  { value: '4', label: '客群分級', icon: '👥' },
  { value: '5 年', label: '保險年限', icon: '📅' },
  { value: '12+', label: '合作診所', icon: '🏥' },
  { value: '24/7', label: 'AI 諮詢', icon: '🤖' },
];

export default function Dashboard() {
  const { isMobile, isTablet } = useViewport();
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

  // 響應式列數：手機 1 / 平板 2 / 電腦 4
  const featureCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const statsCols = isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 40 : 64 }}>

      {/* === Hero 區塊 === */}
      <section style={{
        textAlign: 'center',
        paddingTop: isMobile ? 16 : 32,
        paddingBottom: isMobile ? 8 : 16,
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 14px',
          background: colors.brandPinkBg,
          color: colors.brandPink,
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 20,
        }}>
          🥚 INSURTECH × FERTILITY
        </div>

        <h1 style={{
          fontSize: isMobile ? 30 : 46,
          fontWeight: 900,
          color: colors.brandNavy,
          lineHeight: 1.25,
          marginBottom: 18,
          letterSpacing: -0.5,
        }}>
          歡迎回來，{user?.name || '訪客'}
          <br />
          <span style={{ color: colors.brandPink }}>掌握您的生育主動權</span>
        </h1>

        <p style={{
          fontSize: isMobile ? 14 : 17,
          color: colors.textSecondary,
          lineHeight: 1.7,
          maxWidth: 640,
          margin: '0 auto',
        }}>
          整合保險、生殖醫學與 AI 諮詢的一站式 Insurtech 平台。
          <br />
          從健康追蹤到理賠申請，讓凍卵之路更安心、更透明。
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 28,
          flexWrap: 'wrap',
        }}>
          <button onClick={() => navigate('/health')} style={{
            padding: '14px 28px',
            background: colors.brandPink,
            color: colors.bgWhite,
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: shadows.cta,
            transition: 'transform 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            查看我的健康數據 →
          </button>
          <button onClick={() => navigate('/insurance')} style={{
            padding: '14px 28px',
            background: colors.bgWhite,
            color: colors.brandNavy,
            border: `2px solid ${colors.borderLight}`,
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = colors.brandNavy}
            onMouseLeave={e => e.currentTarget.style.borderColor = colors.borderLight}>
            查看保單詳情
          </button>
        </div>
      </section>

      {/* === 統計數字卡片 === */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: statsCols,
        gap: isMobile ? 12 : 20,
        background: colors.bgSoft,
        padding: isMobile ? '24px 18px' : '32px 36px',
        borderRadius: 20,
        border: `1px solid ${colors.borderLight}`,
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{
              fontSize: isMobile ? 22 : 30,
              fontWeight: 900,
              color: colors.brandNavy,
              lineHeight: 1.1,
            }}>{s.value}</div>
            <div style={{
              fontSize: 12,
              color: colors.textMuted,
              marginTop: 4,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* === 核心功能卡片 === */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 800,
            color: colors.brandPink,
            letterSpacing: 2,
            marginBottom: 10,
          }}>FEATURES</div>
          <h2 style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 900,
            color: colors.brandNavy,
            marginBottom: 12,
          }}>核心功能模組</h2>
          <p style={{
            fontSize: 14,
            color: colors.textMuted,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            從健康監測到保險理賠，從醫療預約到社群支持，提供凍卵全流程的數位化服務
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: featureCols,
          gap: 20,
        }}>
          {FEATURE_CARDS.map(card => <FeatureCard key={card.to} card={card} navigate={navigate} />)}
        </div>
      </section>

      {/* === 帳戶資訊 === */}
      {user && (
        <section style={{
          background: colors.bgWhite,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: 20,
          padding: isMobile ? 24 : 32,
          boxShadow: shadows.card,
        }}>
          <div style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 18,
            marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.brandPink, letterSpacing: 1.5, marginBottom: 6 }}>
                MY ACCOUNT
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.brandNavy }}>帳戶概況</h2>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 16 : 24,
          }}>
            <InfoBlock label="姓名" value={user.name} />
            <InfoBlock label="客群分類" value={CUSTOMER_LABEL[user.customer_type] || '—'} />
            <InfoBlock label="年齡" value={user.age ? `${user.age} 歲` : '—'} />
            <InfoBlock label="AMH 值" value={user.amh_value ? `${user.amh_value} ng/mL` : '未填寫'} />
          </div>
        </section>
      )}
    </div>
  );
}

const CUSTOMER_LABEL = {
  potential: '潛在客群',
  main: '主要客群',
  high_demand: '高需求客群',
  cancer: '重大疾病方案',
};

function InfoBlock({ label, value }) {
  return (
    <div style={{
      paddingLeft: 14,
      borderLeft: `3px solid ${colors.brandPink}`,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: colors.textMuted,
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: colors.brandNavy,
      }}>{value}</div>
    </div>
  );
}

function FeatureCard({ card, navigate }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => navigate(card.to)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: colors.bgWhite,
        border: `1px solid ${hover ? card.accent : colors.borderLight}`,
        borderRadius: radius.xl,
        padding: 26,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? shadows.cardHover : shadows.card,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <div style={{
        width: 56, height: 56,
        borderRadius: 14,
        background: card.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        marginBottom: 18,
      }}>
        {card.icon}
      </div>
      <h3 style={{
        fontSize: 17,
        fontWeight: 800,
        color: colors.brandNavy,
        marginBottom: 8,
      }}>{card.title}</h3>
      <p style={{
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 1.6,
        flex: 1,
      }}>{card.desc}</p>
      <div style={{
        marginTop: 18,
        fontSize: 13,
        fontWeight: 700,
        color: card.accent,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        進入服務
        <span style={{
          transition: 'transform 0.2s',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
        }}>→</span>
      </div>
    </div>
  );
}
