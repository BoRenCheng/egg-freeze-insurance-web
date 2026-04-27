import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import MetricCard from '../components/shared/MetricCard';
import useViewport from '../components/shared/useViewport';

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  pageTitle: { fontSize: 26, fontWeight: 900, color: '#1A365D', display: 'flex', alignItems: 'center', gap: 10 },
  pageSub: { fontSize: 14, color: '#6B7280', marginTop: -16 },

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 18,
  },

  chartsGrid: (visible, isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: 20,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  }),

  chartCard: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '24px 24px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.25s ease',
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  chartTitle: { fontSize: 16, fontWeight: 800, color: '#1A365D' },
  chartSub: { fontSize: 12, color: '#9CA3AF' },

  donutWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  donutCenter: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  donutPercent: { fontSize: 36, fontWeight: 900, color: '#F687B3', lineHeight: 1 },
  donutLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },

  donutInfo: {
    marginTop: 12,
    padding: '10px 14px',
    background: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: 10,
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: 600,
  },

  // Doctor advice card
  adviceCard: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '20px 24px',
    border: '1px solid #E5E7EB',
    borderLeft: '4px solid #F687B3',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  adviceAvatar: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #FFD580)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, flexShrink: 0,
  },
  adviceLabel: { fontSize: 13, fontWeight: 800, color: '#F687B3', marginBottom: 6 },
  adviceText: { fontSize: 14, color: '#1A365D', lineHeight: 1.7 },
  adviceWarn: {
    marginTop: 12,
    padding: '8px 14px',
    background: '#FEF3C7',
    borderLeft: '3px solid #F5A623',
    borderRadius: 4,
    fontSize: 12,
    color: '#92400E',
    fontWeight: 600,
  },

  loadingPlaceholder: {
    height: 250,
    background: '#F9FAFB',
    borderRadius: 12,
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
  },
};

const GRADE_COLOR = {
  A: { bg: 'linear-gradient(135deg, #10B981, #6EE7B7)', accent: '#10B981' },
  B: { bg: 'linear-gradient(135deg, #F687B3, #FFB1D0)', accent: '#F687B3' },
  C: { bg: 'linear-gradient(135deg, #F5A623, #FFD580)', accent: '#F5A623' },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1A365D',
      color: '#FFFFFF',
      padding: '8px 12px',
      borderRadius: 8,
      fontSize: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={{ fontWeight: 700 }}>{payload[0].payload.year} 年</div>
      <div style={{ color: '#FFD580' }}>AMH: {payload[0].value} ng/mL</div>
    </div>
  );
}

export default function HealthDashboard() {
  const { isMobile } = useViewport();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsVisible, setChartsVisible] = useState(false);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    Promise.all([
      axios.get('/api/health/summary', { headers }),
      axios.get('/api/health/amh-history', { headers }),
    ]).then(([s, h]) => {
      setSummary(s.data);
      setHistory(h.data);
      setLoading(false);
      setTimeout(() => setChartsVisible(true), 200);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const grade = summary?.health_grade || 'B';
  const gradeStyle = GRADE_COLOR[grade] || GRADE_COLOR.B;

  const donutData = summary ? [
    { name: '受孕機率', value: summary.pregnancy_probability },
    { name: '剩餘',     value: 100 - summary.pregnancy_probability },
  ] : [];

  return (
    <div style={styles.page}>
      <div style={styles.pageTitle}>📊 個人健康數據儀表板</div>
      <div style={styles.pageSub}>掌握您的卵子存放資訊、AMH 變化趨勢與整體生育健康狀況。</div>

      {/* 三大指標卡片 */}
      <div style={styles.metricsGrid}>
        <MetricCard
          icon="🥚"
          label="卵子總數"
          value={loading ? '—' : `${summary?.egg_count ?? 0} 顆`}
          subtitle={summary?.freeze_date ? `凍卵日期：${summary.freeze_date}` : '尚無凍卵紀錄'}
          accentColor="#F687B3"
        />
        <MetricCard
          icon="🧪"
          label="AMH 檢測值"
          value={loading ? '—' : `${summary?.amh_value ?? '—'}`}
          subtitle="ng/mL ・ 卵巢庫存量指標"
          accentColor="#5B6EC7"
          valueColor="#5B6EC7"
        />
        <MetricCard
          icon="⭐"
          label="健康評估等級"
          value={loading ? '—' : grade}
          subtitle={summary?.warning || '系統綜合評估'}
          accentColor={gradeStyle.accent}
          valueColor={gradeStyle.accent}
        />
      </div>

      {/* 圖表區 */}
      <div style={styles.chartsGrid(chartsVisible, isMobile)}>
        {/* AMH 變化直方圖 */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>AMH 變化趨勢</div>
              <div style={styles.chartSub}>歷年卵巢功能檢測紀錄</div>
            </div>
            <div style={{ fontSize: 12, color: '#F687B3', fontWeight: 700 }}>
              ● 最新檢測
            </div>
          </div>
          {loading ? (
            <div style={styles.loadingPlaceholder} />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(246,135,179,0.1)' }} />
                <Bar dataKey="amh_value" radius={[8, 8, 0, 0]} animationDuration={1200}>
                  {history.map((_, i) => (
                    <Cell key={i} fill={i === history.length - 1 ? '#F687B3' : '#1A365D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 受孕機率環形圖 */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>受孕機率預測</div>
              <div style={styles.chartSub}>依年齡與卵子數量綜合評估</div>
            </div>
          </div>
          {loading ? (
            <div style={styles.loadingPlaceholder} />
          ) : (
            <>
              <div style={styles.donutWrap}>
                <PieChart width={200} height={200}>
                  <Pie
                    data={donutData}
                    cx={100} cy={100}
                    innerRadius={60} outerRadius={85}
                    startAngle={90} endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={1200}
                  >
                    <Cell fill="#F687B3" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
                <div style={styles.donutCenter}>
                  <div style={styles.donutPercent}>{summary?.pregnancy_probability}%</div>
                  <div style={styles.donutLabel}>預估受孕率</div>
                </div>
              </div>
              <div style={styles.donutInfo}>
                💡 條件：{summary?.egg_count} 顆卵子・健康等級 {grade}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 醫師建議 */}
      {summary && (
        <div style={styles.adviceCard}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={styles.adviceAvatar}>👩‍⚕️</div>
          <div style={{ flex: 1 }}>
            <div style={styles.adviceLabel}>醫師建議</div>
            <div style={styles.adviceText}>{summary.doctor_advice}</div>
            <div style={styles.adviceWarn}>⚡ {summary.warning}</div>
          </div>
        </div>
      )}
    </div>
  );
}
