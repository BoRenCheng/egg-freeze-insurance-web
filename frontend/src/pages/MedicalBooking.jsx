import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/shared/Modal';
import SkeletonCard from '../components/shared/SkeletonCard';
import useViewport from '../components/shared/useViewport';
import Icon from '../components/shared/Icon';

const CITIES = ['台北市', '新北市', '台中市', '高雄市'];
const DISTRICTS = {
  '台北市': ['', '松山區', '大安區', '信義區', '中山區'],
  '新北市': ['', '板橋區'],
  '台中市': ['', '西屯區', '北區'],
  '高雄市': ['', '苓雅區', '鳥松區'],
};

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  pageTitle: { fontSize: 26, fontWeight: 900, color: '#1A365D', display: 'flex', alignItems: 'center', gap: 10 },
  pageSub: { fontSize: 14, color: '#6B7280', marginTop: -16 },

  layout: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr',
    gap: isMobile ? 18 : 24,
    alignItems: 'start',
  }),
  searchRow: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr) auto',
    gap: 12,
    alignItems: 'end',
  }),
  leftCol: { display: 'flex', flexDirection: 'column', gap: 18 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 18 },

  searchCard: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  searchTitle: { fontSize: 16, fontWeight: 800, color: '#1A365D', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 },
  fieldLabel: { fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 6, display: 'block' },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    color: '#1A365D',
    background: '#F9FAFB',
    cursor: 'pointer',
    outline: 'none',
  },
  searchBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(246,135,179,0.4)',
  },

  resultsHeader: { fontSize: 14, color: '#6B7280', fontWeight: 600 },
  clinicCard: {
    background: '#FFFFFF',
    borderRadius: 14,
    padding: '18px 20px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'all 0.2s ease',
  },
  clinicHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  clinicTitleRow: { display: 'flex', alignItems: 'center', gap: 10 },
  clinicTypeBadge: (type) => ({
    background: type === '中醫' ? '#FEF3C7' : '#DBEAFE',
    color: type === '中醫' ? '#92400E' : '#1E40AF',
    padding: '3px 10px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 700,
  }),
  clinicName: { fontSize: 17, fontWeight: 800, color: '#1A365D' },
  clinicMeta: { fontSize: 12, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 },
  clinicRating: { color: '#F5A623', fontWeight: 700, fontSize: 13 },
  bookBtn: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg, #F687B3, #FFB1D0)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 3px 10px rgba(246,135,179,0.4)',
  },

  // Right column - Phone-style appointment card
  phoneFrame: {
    background: 'linear-gradient(160deg, #FFE4ED 0%, #FFFFFF 60%)',
    borderRadius: 28,
    padding: 18,
    border: '6px solid #1A365D',
    boxShadow: '0 16px 40px rgba(26,54,93,0.2)',
    width: '100%',
  },
  phoneTopBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: 11, fontWeight: 700, color: '#1A365D', marginBottom: 14, padding: '0 6px',
  },
  phoneBookingCard: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 4px 12px rgba(26,54,93,0.08)',
    marginBottom: 12,
  },
  successBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#D1FAE5',
    color: '#065F46',
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 10,
  },
  bookingClinicName: { fontSize: 14, fontWeight: 800, color: '#1A365D', marginBottom: 4 },
  bookingDoctor: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  bookingRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 },
  bookingLabel: { color: '#9CA3AF' },
  bookingValue: { color: '#1A365D', fontWeight: 700 },
  progressLabel: { fontSize: 11, color: '#6B7280', marginTop: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between' },
  progressOuter: { height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg, #F687B3, #F5A623)',
    transition: 'width 0.6s ease',
  }),
  emptyBooking: {
    padding: '32px 16px',
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
  },

  dualCard: {
    background: 'linear-gradient(135deg, #1A365D, #5B6EC7)',
    borderRadius: 16,
    padding: '22px 20px',
    color: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(26,54,93,0.2)',
  },
  dualTitle: { fontSize: 16, fontWeight: 800, marginBottom: 4 },
  dualSubtitle: { fontSize: 12, opacity: 0.8, marginBottom: 16 },
  dualGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 16,
  },
  dualBox: (color) => ({
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(10px)',
    borderRadius: 10,
    padding: 12,
    borderTop: `3px solid ${color}`,
  }),
  dualName: { fontSize: 13, fontWeight: 800, marginBottom: 6 },
  dualDesc: { fontSize: 11, opacity: 0.85, lineHeight: 1.5 },

  packageBox: {
    background: 'rgba(245,166,35,0.15)',
    border: '1px solid rgba(245,166,35,0.4)',
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
  },
  packagePrice: {
    color: '#FFD580', fontSize: 18, fontWeight: 900, marginTop: 4,
  },
  packageInstall: {
    background: 'rgba(255,255,255,0.15)',
    color: '#FFD580',
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 700,
    marginTop: 6,
  },

  // Booking modal
  formField: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  input: {
    padding: '11px 14px',
    fontSize: 14,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    color: '#1A365D',
    background: '#F9FAFB',
    outline: 'none',
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
  },
  // Confirm modal content
  confirmIcon: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  confirmTitle: { fontSize: 18, fontWeight: 800, color: '#1A365D', textAlign: 'center', marginBottom: 6 },
  confirmDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  confirmInfoBox: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  discountBadge: {
    background: 'linear-gradient(135deg, #F5A623, #FFD580)',
    color: '#FFFFFF',
    padding: '12px 18px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 800,
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(245,166,35,0.4)',
    letterSpacing: 1,
  },
};

export default function MedicalBooking() {
  const { isMobile } = useViewport();
  const [search, setSearch] = useState({ city: '台北市', district: '', type: '' });
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const [bookingClinic, setBookingClinic] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  function fetchClinics(params = search) {
    setLoading(true);
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.district) query.append('district', params.district);
    if (params.type) query.append('type', params.type);
    axios.get('/api/clinics?' + query.toString()).then(res => {
      setTimeout(() => {
        setClinics(res.data);
        setLoading(false);
      }, 600);
    }).catch(() => setLoading(false));
  }

  function fetchAppointments() {
    axios.get('/api/appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setAppointments(res.data)).catch(() => {});
  }

  useEffect(() => {
    fetchClinics();
    fetchAppointments();
  }, []);

  async function submitBooking(e) {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.time) return;
    setBookingLoading(true);
    try {
      const res = await axios.post('/api/appointments', {
        clinic_id: bookingClinic.id,
        doctor_name: bookingClinic.doctor_name,
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        notes: bookingForm.notes,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConfirmedBooking(res.data);
      setBookingClinic(null);
      setBookingForm({ date: '', time: '', notes: '' });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || '預約失敗');
    } finally {
      setBookingLoading(false);
    }
  }

  const latestBooking = appointments[0];
  const progress = latestBooking ? Math.min(100, ((latestBooking.queue_number || 1) / 50) * 100) : 0;

  return (
    <div style={styles.page}>
      <div style={styles.pageTitle}>
        <Icon name="hospital" size={26} color="#1A365D" />
        中西醫合作生態系預約
      </div>
      <div style={styles.pageSub}>搜尋合作診所，享 APP 預約專屬折扣，一站完成檢測、諮詢、療程。</div>

      <div style={styles.layout(isMobile)}>
        {/* 左側：搜尋與診所清單 */}
        <div style={styles.leftCol}>
          <div style={styles.searchCard}>
            <div style={styles.searchTitle}>
              <Icon name="search" size={18} color="#1A365D" />
              智能診所搜尋
            </div>
            <div style={styles.searchRow(isMobile)}>
              <div>
                <label style={styles.fieldLabel}>縣市</label>
                <select value={search.city}
                  onChange={e => setSearch({ ...search, city: e.target.value, district: '' })}
                  style={styles.select}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.fieldLabel}>鄉鎮市區</label>
                <select value={search.district}
                  onChange={e => setSearch({ ...search, district: e.target.value })}
                  style={styles.select}>
                  {(DISTRICTS[search.city] || ['']).map(d =>
                    <option key={d} value={d}>{d || '全部'}</option>
                  )}
                </select>
              </div>
              <div>
                <label style={styles.fieldLabel}>院所類別</label>
                <select value={search.type}
                  onChange={e => setSearch({ ...search, type: e.target.value })}
                  style={styles.select}>
                  <option value="">不限</option>
                  <option value="中醫">🌿 中醫</option>
                  <option value="西醫">🩺 西醫</option>
                </select>
              </div>
              <button style={styles.searchBtn} onClick={() => fetchClinics()}>查詢</button>
            </div>
          </div>

          <div style={styles.resultsHeader}>
            {loading ? '搜尋中...' : `找到 ${clinics.length} 間合作診所`}
          </div>

          {loading ? (
            <SkeletonCard count={3} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {clinics.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  目前沒有符合條件的診所，請調整搜尋條件
                </div>
              )}
              {clinics.map(clinic => (
                <div key={clinic.id} style={styles.clinicCard}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,54,93,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,54,93,0.08)'; }}>
                  <div style={styles.clinicHead}>
                    <div>
                      <div style={styles.clinicTitleRow}>
                        <span style={styles.clinicTypeBadge(clinic.type)}>
                          {clinic.type === '中醫' ? '🌿' : '🩺'} {clinic.type}
                        </span>
                        <span style={styles.clinicName}>{clinic.name}</span>
                      </div>
                      <div style={{ ...styles.clinicMeta, marginTop: 8 }}>
                        <span>👨‍⚕️ {clinic.doctor_name} ・ {clinic.specialty}</span>
                        <span>📞 {clinic.phone}</span>
                        <span>📍 {clinic.address}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={styles.clinicRating}>★ {clinic.rating}</span>
                      <button style={styles.bookBtn} onClick={() => setBookingClinic(clinic)}>
                        立即預約
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右側：預約單 + 雙管齊下 */}
        <div style={styles.rightCol}>
          <div style={styles.phoneFrame}>
            <div style={styles.phoneTopBar}>
              <span>9:41</span>
              <span>📋 我的預約</span>
              <span>📶 🔋</span>
            </div>

            {latestBooking ? (
              <div style={styles.phoneBookingCard}>
                <div style={styles.successBadge}>✓ 掛號成功</div>
                <div style={styles.bookingClinicName}>{latestBooking.clinic_name}</div>
                <div style={styles.bookingDoctor}>
                  {latestBooking.doctor_name} 醫師 ・ {latestBooking.clinic_type}
                </div>
                <div style={styles.bookingRow}>
                  <span style={styles.bookingLabel}>就診日期</span>
                  <span style={styles.bookingValue}>{latestBooking.appointment_date} {latestBooking.appointment_time}</span>
                </div>
                <div style={styles.bookingRow}>
                  <span style={styles.bookingLabel}>掛號序號</span>
                  <span style={styles.bookingValue}>{latestBooking.queue_number} 號</span>
                </div>
                <div style={styles.progressLabel}>
                  <span>看診進度</span>
                  <span style={{ fontWeight: 700, color: '#F687B3' }}>{Math.floor(progress)}%</span>
                </div>
                <div style={styles.progressOuter}>
                  <div style={styles.progressInner(progress)} />
                </div>
              </div>
            ) : (
              <div style={styles.phoneBookingCard}>
                <div style={styles.emptyBooking}>
                  📋<br />尚無預約紀錄<br />點擊左側診所「立即預約」開始
                </div>
              </div>
            )}

            {appointments.slice(1, 3).map(a => (
              <div key={a.id} style={{ ...styles.phoneBookingCard, opacity: 0.85 }}>
                <div style={styles.bookingClinicName}>{a.clinic_name}</div>
                <div style={styles.bookingDoctor}>{a.doctor_name} ・ {a.appointment_date}</div>
              </div>
            ))}
          </div>

          {/* 雙管齊下方案 */}
          <div style={styles.dualCard}>
            <div style={styles.dualTitle}>💡 雙管齊下方案</div>
            <div style={styles.dualSubtitle}>西醫數值檢測 + 中醫根部調理，提升生育率</div>
            <div style={styles.dualGrid}>
              <div style={styles.dualBox('#5B6EC7')}>
                <div style={styles.dualName}>🩺 西醫</div>
                <div style={styles.dualDesc}>精確 AMH 檢測、IVF、卵子冷凍技術，持續追蹤健康狀況</div>
              </div>
              <div style={styles.dualBox('#F5A623')}>
                <div style={styles.dualName}>🌿 中醫</div>
                <div style={styles.dualDesc}>個性化中藥調理，改善卵巢功能、促進血液循環</div>
              </div>
            </div>
            <div style={styles.packageBox}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>🎁 整合方案：檢測 + 諮詢 + 手術</div>
              <div style={styles.packagePrice}>NT$ 12,800 / 月</div>
              <div style={styles.packageInstall}>💳 支援分期付款</div>
            </div>
          </div>
        </div>
      </div>

      {/* 預約 Modal */}
      <Modal isOpen={!!bookingClinic} onClose={() => setBookingClinic(null)} title={`📅 預約 ${bookingClinic?.name}`}>
        {bookingClinic && (
          <form onSubmit={submitBooking}>
            <div style={{ background: '#F9FAFB', padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
              <div><b>{bookingClinic.doctor_name} 醫師</b> ・ {bookingClinic.specialty}</div>
              <div style={{ color: '#6B7280', marginTop: 4 }}>📍 {bookingClinic.address}</div>
            </div>
            <div style={styles.formField}>
              <label style={{ ...styles.fieldLabel, marginBottom: 0 }}>就診日期</label>
              <input type="date" required
                value={bookingForm.date}
                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                style={styles.input} />
            </div>
            <div style={styles.formField}>
              <label style={{ ...styles.fieldLabel, marginBottom: 0 }}>時段</label>
              <select value={bookingForm.time} required
                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                style={styles.input}>
                <option value="">請選擇</option>
                <option value="上午">上午（09:00-12:00）</option>
                <option value="下午">下午（14:00-17:00）</option>
                <option value="晚上">晚上（18:00-21:00）</option>
              </select>
            </div>
            <div style={styles.formField}>
              <label style={{ ...styles.fieldLabel, marginBottom: 0 }}>備註（選填）</label>
              <input type="text" placeholder="例：初診、複診..."
                value={bookingForm.notes}
                onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                style={styles.input} />
            </div>
            <button type="submit" disabled={bookingLoading}
              style={{ ...styles.submitBtn, opacity: bookingLoading ? 0.7 : 1 }}>
              {bookingLoading ? '預約中...' : '✓ 確認預約'}
            </button>
          </form>
        )}
      </Modal>

      {/* 預約成功 Modal */}
      <Modal isOpen={!!confirmedBooking} onClose={() => setConfirmedBooking(null)} title="預約成功">
        {confirmedBooking && (
          <>
            <div style={styles.confirmIcon}>🎉</div>
            <div style={styles.confirmTitle}>預約成功！</div>
            <div style={styles.confirmDesc}>已為您保留座位，期待您的蒞臨</div>

            <div style={styles.confirmInfoBox}>
              <div style={styles.bookingRow}>
                <span style={styles.bookingLabel}>診所</span>
                <span style={styles.bookingValue}>{confirmedBooking.clinic_name}</span>
              </div>
              <div style={styles.bookingRow}>
                <span style={styles.bookingLabel}>醫師</span>
                <span style={styles.bookingValue}>{confirmedBooking.doctor_name}</span>
              </div>
              <div style={styles.bookingRow}>
                <span style={styles.bookingLabel}>就診日期</span>
                <span style={styles.bookingValue}>{confirmedBooking.appointment_date} {confirmedBooking.appointment_time}</span>
              </div>
              <div style={{ ...styles.bookingRow, marginBottom: 0 }}>
                <span style={styles.bookingLabel}>掛號序號</span>
                <span style={{ ...styles.bookingValue, color: '#F687B3', fontSize: 16 }}>
                  {confirmedBooking.queue_number} 號
                </span>
              </div>
            </div>

            <div style={styles.discountBadge}>
              🎁 {confirmedBooking.discount_code}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
