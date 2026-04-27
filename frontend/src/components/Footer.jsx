import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import useViewport from './shared/useViewport';

const styles = {
  footer: {
    background: colors.brandNavy,
    color: '#CBD5E1',
    paddingTop: 56,
    paddingBottom: 32,
    marginTop: 80,
  },
  container: (isMobile) => ({
    maxWidth: 1280,
    margin: '0 auto',
    padding: isMobile ? '0 20px' : '0 40px',
  }),
  topGrid: (isMobile, isTablet) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1.4fr 1fr 1fr' : '1.5fr 1fr 1fr 1fr',
    gap: isMobile ? 36 : 48,
    paddingBottom: 36,
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  }),
  brandColumn: { display: 'flex', flexDirection: 'column' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  brandIcon: {
    width: 38, height: 38, borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.brandPink}, ${colors.brandGold})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20,
  },
  brandTitle: { fontSize: 18, fontWeight: 800, color: '#FFFFFF' },
  brandSub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  brandDesc: {
    fontSize: 13,
    lineHeight: 1.7,
    color: '#94A3B8',
    marginTop: 8,
    maxWidth: 320,
  },
  socialRow: {
    display: 'flex',
    gap: 10,
    marginTop: 18,
  },
  socialBtn: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#CBD5E1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s',
  },
  colTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  link: {
    fontSize: 13,
    color: '#94A3B8',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 1.6,
  },
  contactIcon: { flexShrink: 0, opacity: 0.7 },
  bottomBar: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingTop: 24,
    fontSize: 12,
    color: '#64748B',
  }),
  legalLinks: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
  },
};

const SOCIALS = [
  { icon: '📘', label: 'Facebook', href: '#' },
  { icon: '📷', label: 'Instagram', href: '#' },
  { icon: '✉️', label: 'Email', href: 'mailto:contact@egg-freeze.tw' },
  { icon: '💬', label: 'Line', href: '#' },
];

export default function Footer() {
  const { isMobile, isTablet } = useViewport();

  return (
    <footer style={styles.footer}>
      <div style={styles.container(isMobile)}>
        {/* 上半：4 欄資訊 */}
        <div style={styles.topGrid(isMobile, isTablet)}>
          {/* 品牌 */}
          <div style={styles.brandColumn}>
            <div style={styles.brandRow}>
              <div style={styles.brandIcon}>🥚</div>
              <div>
                <div style={styles.brandTitle}>凍住希望 卵畫未來</div>
                <div style={styles.brandSub}>孕（運）轉乾坤險</div>
              </div>
            </div>
            <p style={styles.brandDesc}>
              整合保險、生殖醫學與 AI 諮詢的 Insurtech 生態系，
              讓凍卵不再只是少數人的選擇——讓每位女性都能掌握生育主動權。
            </p>
            <div style={styles.socialRow}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} title={s.label} style={styles.socialBtn}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = colors.brandPink;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#CBD5E1';
                  }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 服務 */}
          <div>
            <div style={styles.colTitle}>核心服務</div>
            <div style={styles.linkList}>
              {[
                { to: '/health',    label: '健康儀表板' },
                { to: '/insurance', label: '保險理賠中心' },
                { to: '/booking',   label: '醫療生態預約' },
                { to: '/community', label: '社群支持' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={styles.link}
                  onMouseEnter={e => e.currentTarget.style.color = colors.brandPink}
                  onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 關於 */}
          <div>
            <div style={styles.colTitle}>關於我們</div>
            <div style={styles.linkList}>
              {['品牌故事', '客群分析', '保費試算', '法律與政策', '常見問題'].map(t => (
                <span key={t} style={styles.link}
                  onMouseEnter={e => e.currentTarget.style.color = colors.brandPink}
                  onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 聯絡 */}
          <div>
            <div style={styles.colTitle}>聯絡資訊</div>
            <div style={styles.linkList}>
              <div style={styles.contactRow}>
                <span style={styles.contactIcon}>📍</span>
                <span>台北市信義區<br />信義路五段 7 號</span>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactIcon}>📞</span>
                <span>0800-123-456</span>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactIcon}>✉️</span>
                <a href="mailto:contact@egg-freeze.tw" style={{ color: 'inherit', textDecoration: 'none' }}>
                  contact@egg-freeze.tw
                </a>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactIcon}>🕒</span>
                <span>週一至週五 09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下半：版權 */}
        <div style={styles.bottomBar(isMobile)}>
          <div>© 2026 凍住希望 卵畫未來．All rights reserved．本網站作品為實習作品展示用途</div>
          <div style={styles.legalLinks}>
            <span style={styles.link}>隱私權政策</span>
            <span style={styles.link}>服務條款</span>
            <span style={styles.link}>Cookie 設定</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
