import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Modal from '../components/shared/Modal';
import CountUp from '../components/shared/CountUp';

const PREMIUM_TABLE = {
  '25-30_normal_false':   { base: 8000,  max: 10000 },
  '30-35_normal_false':   { base: 10000, max: 12000 },
  '36-40_normal_false':   { base: 12000, max: 15000 },
  '40+_normal_false':     { base: 18000, max: 22000 },
  '25-30_abnormal_false': { base: 10000, max: 12000 },
  '30-35_abnormal_false': { base: 12000, max: 15000 },
  '36-40_abnormal_false': { base: 15000, max: 18000 },
  '40+_abnormal_false':   { base: 22000, max: 30000 },
  '25-30_normal_true':    { base: 15000, max: 18000 },
  '30-35_normal_true':    { base: 18000, max: 22000 },
  '36-40_normal_true':    { base: 22000, max: 25000 },
  '40+_normal_true':      { base: 25000, max: 28000 },
  '25-30_abnormal_true':  { base: 18000, max: 22000 },
  '30-35_abnormal_true':  { base: 22000, max: 25000 },
  '36-40_abnormal_true':  { base: 25000, max: 28000 },
  '40+_abnormal_true':    { base: 30000, max: 35000 },
};

const COVERAGE_BY_TYPE = {
  potential:   { therapy: 30000,  comp: 50000,  storage: 100000 },
  main:        { therapy: 40000,  comp: 55000,  storage: 110000 },
  high_demand: { therapy: 60000,  comp: 60000,  storage: 120000 },
  cancer:      { therapy: 60000,  comp: 60000,  storage: 120000 },
};

const TYPE_BADGE = {
  potential:   { label: '潛在客群', color: '#10B981' },
  main:        { label: '主要客群', color: '#F687B3' },
  high_demand: { label: '高需求客群', color: '#F5A623' },
  cancer:      { label: '重大疾病方案', color: '#EF4444' },
};

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 28 },
  pageTitle: { fontSize: 26, fontWeight: 900, color: '#1A365D', display: 'flex', alignItems: 'center', gap: 10 },
  pageSub:   { fontSize: 14, color: '#6B7280', marginTop: -20 },
  policyBanner: {
    background: 'linear-gradient(135deg, #1A365D, #2C4F7C)',
    borderRadius: 20,
    padding: '28px 32px',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
    boxShadow: '0 12px 32px rgba(26,54,93,0.25)',
    position: 'relative',
    overflow: 'hidden',
  },
  policyDecor: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: '50%',
    background: 'rgba(246,135,179,0.15)',
    top: -50, right: -50,
  },
  policyLeft: { display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' },
  policyName: { fontSize: 22, fontWeight: 900 },
  policyNumber: { fontSize: 13, opacity: 0.8 },
  policyTags: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  policyTag: (color) => ({
    background: color,
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
  }),
  yearTag: {
    background: 'rgba(245,166,35,0.25)',
    color: '#FFD580',
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid rgba(245,166,35,0.5)',
  },
  policyRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, position: 'relative' },
  premiumLabel: { fontSize: 12, opacity: 0.8 },
  premiumValue: { fontSize: 28, fontWeight: 900, color: '#FFD580' },
  claimBtn: {
    background: 'linear-gradient(135deg, #F687B3, #FFB1D0)',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 24,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 6,
    boxShadow: '0 4px 14px rgba(246,135,179,0.5)',
  },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: '#1A365D' },

  // Glassmorphism coverage panel
  coverageWrap: {
    background: 'linear-gradient(135deg, #5B6EC7 0%, #1A365D 60%, #F687B3 130%)',
    borderRadius: 20,
    padding: '32px 28px',
    position: 'relative',
    overflow: 'hidden',
  },
  coverageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },
  glassCard: {
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.32)',
    borderRadius: 16,
    padding: '22px 20px',
    color: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(26,54,93,0.2)',
    transition: 'transform 0.25s, box-shadow 0.25s',
  },
  glassIcon: { fontSize: 28, marginBottom: 10 },
  glassLabel: { fontSize: 14, fontWeight: 700, opacity: 0.95, marginBottom: 6 },
  glassValue: { fontSize: 30, fontWeight: 900, marginBottom: 4 },
  glassDesc: { fontSize: 11, opacity: 0.85, lineHeight: 1.5 },

  // Premium calculator
  calcCard: {
    background: '#FFFFFF',
    borderRadius: 20,
    padding: '28px 32px',
    boxShadow: '0 8px 24px rgba(26,54,93,0.08)',
  },
  calcRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  calcField: { display: 'flex', flexDirection: 'column', gap: 6 },
  calcLabel: { fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 },
  select: {
    padding: '11px 14px',
    fontSize: 14,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    color: '#1A365D',
    background: '#F9FAFB',
    cursor: 'pointer',
    outline: 'none',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F9FAFB',
    padding: '10px 14px',
    borderRadius: 10,
    border: '2px solid #E5E7EB',
  },
  toggleSwitch: (on) => ({
    width: 42,
    height: 24,
    borderRadius: 12,
    background: on ? '#F687B3' : '#D1D5DB',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }),
  toggleKnob: (on) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#FFFFFF',
    position: 'absolute',
    top: 3,
    left: on ? 21 : 3,
    transition: 'left 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }),
  premiumDisplay: {
    background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
    borderRadius: 14,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #FDE68A',
  },
  premiumDisplayLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
  premiumDisplayLabel: { fontSize: 13, color: '#92400E', fontWeight: 600 },
  premiumDisplayValue: { fontSize: 32, fontWeight: 900, color: '#F5A623' },
  premiumDisplayUnit: { fontSize: 14, color: '#92400E', fontWeight: 600 },

  // Modal
  formField: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  input: {
    padding: '11px 14px',
    fontSize: 14,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    color: '#1A365D',
    background: '#F9FAFB',
    outline: 'none',
  },
  fileInput: {
    padding: '11px 14px',
    border: '2px dashed #D1D5DB',
    borderRadius: 10,
    color: '#6B7280',
    background: '#F9FAFB',
    cursor: 'pointer',
    fontSize: 13,
  },
  noticeBox: {
    background: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 12,
    color: '#92400E',
    marginBottom: 16,
    lineHeight: 1.6,
  },
  submitBtn: {
    width: '100%',
    padding: 13,
    background: 'linear-gradient(135deg, #1A365D, #5B6EC7)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(26,54,93,0.3)',
  },
  alert: {
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
  },
};

export default function InsuranceCenter() {
  const [policy, setPolicy] = useState(null);
  const [coverage, setCoverage] = useState(COVERAGE_BY_TYPE.main);
  const [customerType, setCustomerType] = useState('main');

  const [calcAge, setCalcAge] = useState('36-40');
  const [calcAmh, setCalcAmh] = useState('normal');
  const [calcIllness, setCalcIllness] = useState(false);

  const [claimsOpen, setClaimsOpen] = useState(false);
  const [claimsForm, setClaimsForm] = useState({ therapy_type: '凍卵療程', institution: '', file: '' });
  const [claimsAlert, setClaimsAlert] = useState(null);
  const [claimsLoading, setClaimsLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/insurance/policy', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setPolicy(res.data.policy);
      setCoverage(res.data.coverage);
      setCustomerType(res.data.customer_type);
    }).catch(() => {});
  }, []);

  const calcResult = useMemo(() => {
    const key = `${calcAge}_${calcAmh}_${calcIllness}`;
    return PREMIUM_TABLE[key] || { base: 0, max: 0 };
  }, [calcAge, calcAmh, calcIllness]);

  async function submitClaim(e) {
    e.preventDefault();
    if (!claimsForm.therapy_type || !claimsForm.institution) {
      setClaimsAlert({ type: 'error', msg: '請填寫療程類型與醫療機構' });
      return;
    }
    setClaimsLoading(true);
    setClaimsAlert(null);
    try {
      const res = await axios.post('/api/insurance/claims', {
        therapy_type: claimsForm.therapy_type,
        institution: claimsForm.institution,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClaimsAlert({ type: 'success', msg: res.data.message });
      setClaimsForm({ therapy_type: '凍卵療程', institution: '', file: '' });
      setTimeout(() => setClaimsOpen(false), 1800);
    } catch (err) {
      setClaimsAlert({ type: 'error', msg: err.response?.data?.message || '送出失敗' });
    } finally {
      setClaimsLoading(false);
    }
  }

  const badge = TYPE_BADGE[customerType] || TYPE_BADGE.potential;

  return (
    <div style={styles.page}>
      <div>
        <div style={styles.pageTitle}>🛡️ 保險契約與理賠中心</div>
      </div>
      <div style={styles.pageSub}>管理您的孕（運）轉乾坤險保單，查看保障範圍、試算保費與線上申請理賠。</div>

      {/* 保單摘要 Banner */}
      <div style={styles.policyBanner}>
        <div style={styles.policyDecor} />
        <div style={styles.policyLeft}>
          <div style={styles.policyName}>孕（運）轉乾坤險（凍卵險）</div>
          <div style={styles.policyNumber}>
            保單編號：{policy?.policy_number || '尚未投保'}
            {policy && ` ・ 起期 ${policy.start_date} ~ ${policy.end_date}`}
          </div>
          <div style={styles.policyTags}>
            <span style={styles.policyTag(badge.color)}>{badge.label}</span>
            <span style={styles.yearTag}>📅 保險年限 5 年</span>
          </div>
        </div>
        <div style={styles.policyRight}>
          <div style={styles.premiumLabel}>本年度保費</div>
          <div style={styles.premiumValue}>NT$ {(policy?.annual_premium || 12000).toLocaleString()}</div>
          <button style={styles.claimBtn} onClick={() => setClaimsOpen(true)}>📝 發起理賠申請</button>
        </div>
      </div>

      {/* 三大保障 */}
      <div style={styles.sectionTitle}>三大保障項目</div>
      <div style={styles.coverageWrap}>
        <div style={styles.coverageGrid}>
          {[
            { icon: '💊', label: '凍卵療程補助', value: coverage.therapy, desc: '提供凍卵相關醫療費用補助' },
            { icon: '🏥', label: '手術併發症保障', value: coverage.comp,    desc: '凍卵或植卵過程併發症額外理賠' },
            { icon: '🧊', label: '保存不當補償',   value: coverage.storage, desc: '機構技術或設備因素導致凍卵失敗' },
          ].map((item, i) => (
            <div key={i} style={styles.glassCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(26,54,93,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,54,93,0.2)'; }}>
              <div style={styles.glassIcon}>{item.icon}</div>
              <div style={styles.glassLabel}>{item.label}</div>
              <div style={styles.glassValue}>NT$ <CountUp value={item.value} duration={1200} /></div>
              <div style={styles.glassDesc}>最高理賠額度 ・ {item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 保費試算器 */}
      <div style={styles.sectionTitle}>動態保費試算</div>
      <div style={styles.calcCard}>
        <div style={styles.calcRow}>
          <div style={styles.calcField}>
            <label style={styles.calcLabel}>年齡區間</label>
            <select value={calcAge} onChange={e => setCalcAge(e.target.value)} style={styles.select}>
              <option value="25-30">25–30 歲</option>
              <option value="30-35">30–35 歲</option>
              <option value="36-40">36–40 歲</option>
              <option value="40+">40 歲以上</option>
            </select>
          </div>
          <div style={styles.calcField}>
            <label style={styles.calcLabel}>AMH 數值狀態</label>
            <select value={calcAmh} onChange={e => setCalcAmh(e.target.value)} style={styles.select}>
              <option value="normal">正常 (≥ 2.0 ng/mL)</option>
              <option value="abnormal">異常 (&lt; 2.0 ng/mL)</option>
            </select>
          </div>
          <div style={styles.calcField}>
            <label style={styles.calcLabel}>重大疾病史</label>
            <div style={styles.toggleRow}>
              <span style={{ fontSize: 13, color: '#1A365D', fontWeight: 600 }}>
                {calcIllness ? '是（重大疾病方案）' : '否'}
              </span>
              <div style={styles.toggleSwitch(calcIllness)} onClick={() => setCalcIllness(!calcIllness)}>
                <div style={styles.toggleKnob(calcIllness)} />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.premiumDisplay}>
          <div style={styles.premiumDisplayLeft}>
            <div style={styles.premiumDisplayLabel}>預估年度保費</div>
            <div style={styles.premiumDisplayValue}>
              NT$ <CountUp value={calcResult.base} duration={600} /> – <CountUp value={calcResult.max} duration={600} />
            </div>
          </div>
          <div style={styles.premiumDisplayUnit}>
            🔒 含五年保障期間
          </div>
        </div>
      </div>

      {/* 理賠 Modal */}
      <Modal isOpen={claimsOpen} onClose={() => setClaimsOpen(false)} title="📝 發起理賠申請">
        <div style={styles.noticeBox}>
          ⚠️ <b>理賠條件：</b>需於認可醫療機構進行，且需符合 25 歲以上投保限制。請上傳療程證明文件以加速審核。
        </div>
        {claimsAlert && (
          <div style={{
            ...styles.alert,
            background: claimsAlert.type === 'error' ? '#FEE2E2' : '#D1FAE5',
            color: claimsAlert.type === 'error' ? '#DC2626' : '#065F46',
          }}>
            {claimsAlert.type === 'error' ? '⚠️' : '✅'} {claimsAlert.msg}
          </div>
        )}
        <form onSubmit={submitClaim}>
          <div style={styles.formField}>
            <label style={styles.calcLabel}>療程類型</label>
            <select value={claimsForm.therapy_type} onChange={e => setClaimsForm({ ...claimsForm, therapy_type: e.target.value })} style={styles.input}>
              <option value="凍卵療程">凍卵療程補助</option>
              <option value="手術併發症">手術併發症保障</option>
              <option value="保存不當">保存不當補償</option>
            </select>
          </div>
          <div style={styles.formField}>
            <label style={styles.calcLabel}>醫療機構名稱</label>
            <input type="text" placeholder="請填寫認可醫療機構全名"
              value={claimsForm.institution}
              onChange={e => setClaimsForm({ ...claimsForm, institution: e.target.value })}
              style={styles.input} />
          </div>
          <div style={styles.formField}>
            <label style={styles.calcLabel}>收據／證明文件（模擬上傳）</label>
            <input type="file" accept="image/*,.pdf"
              onChange={e => setClaimsForm({ ...claimsForm, file: e.target.files[0]?.name || '' })}
              style={styles.fileInput} />
            {claimsForm.file && <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>✓ 已選取：{claimsForm.file}</div>}
          </div>
          <button type="submit" disabled={claimsLoading} style={{ ...styles.submitBtn, opacity: claimsLoading ? 0.7 : 1 }}>
            {claimsLoading ? '送出中...' : '✓ 送出理賠申請'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
