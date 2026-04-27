import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/shared/Modal';
import useViewport from '../components/shared/useViewport';

const TABS = [
  { key: '菁英女性',  icon: '👑', color: '#F687B3' },
  { key: 'LGBTQ+',   icon: '🌈', color: '#A78BFA' },
  { key: '病友支持',  icon: '💝', color: '#FCA5A5' },
  { key: '法律政策',  icon: '⚖️', color: '#5B6EC7' },
  { key: '知識庫',    icon: '📚', color: '#10B981' },
];

const EDU_CARDS = [
  { icon: '🧪', title: '解讀你的 AMH 值', desc: 'AMH 1.5–3.5 ng/mL 為正常，數值反映卵巢庫存量。', color: 'linear-gradient(135deg, #F687B3, #FFB1D0)' },
  { icon: '🥚', title: '凍卵險的三大好處', desc: '延緩生育年齡、減輕經濟負擔、降低心理壓力。', color: 'linear-gradient(135deg, #5B6EC7, #8A99D6)' },
  { icon: '🌿', title: '中西醫調理建議', desc: '中醫補腎養血改善卵巢功能；西醫精準檢測追蹤。', color: 'linear-gradient(135deg, #10B981, #6EE7B7)' },
  { icon: '⚖️', title: '人工生殖法解析', desc: '了解現行法規對單身與同性伴侶的限制與未來修訂方向。', color: 'linear-gradient(135deg, #F5A623, #FFD580)' },
  { icon: '💝', title: '病友凍卵指南', desc: '癌症患者化療前緊急凍卵流程與注意事項。', color: 'linear-gradient(135deg, #FCA5A5, #FECACA)' },
];

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  pageTitle: { fontSize: 26, fontWeight: 900, color: '#1A365D', display: 'flex', alignItems: 'center', gap: 10 },
  pageSub: { fontSize: 14, color: '#6B7280', marginTop: -16 },

  tabs: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    background: '#FFFFFF',
    padding: 8,
    borderRadius: 14,
    border: '1px solid #E5E7EB',
  },
  tab: (active, color) => ({
    padding: '10px 18px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? color : 'transparent',
    color: active ? '#FFFFFF' : '#6B7280',
    boxShadow: active ? `0 4px 12px ${color}44` : 'none',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    border: 'none',
  }),

  layout: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1.7fr 1fr',
    gap: isMobile ? 18 : 24,
    alignItems: 'start',
  }),

  // Forum posts
  postsHeader: { fontSize: 14, color: '#6B7280', fontWeight: 600, marginBottom: 8 },
  postCard: {
    background: '#FFFFFF',
    borderRadius: 14,
    padding: '20px 22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: 12,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  postTags: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  postTag: {
    background: '#FCE7F3',
    color: '#BE185D',
    padding: '2px 8px',
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  postTitle: { fontSize: 16, fontWeight: 800, color: '#1A365D', marginBottom: 6 },
  postExcerpt: { fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 12 },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#9CA3AF',
  },
  postAuthor: { display: 'flex', alignItems: 'center', gap: 8 },
  authorAvatar: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  postActions: { display: 'flex', gap: 14 },
  actionBtn: (liked) => ({
    background: 'none',
    border: 'none',
    fontSize: 12,
    color: liked ? '#F687B3' : '#6B7280',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  }),

  // Right column
  rightCol: { display: 'flex', flexDirection: 'column', gap: 18 },
  encyclopediaCard: {
    background: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  sectionHeader: { fontSize: 16, fontWeight: 800, color: '#1A365D', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 },
  accordionItem: {
    borderBottom: '1px solid #F3F4F6',
  },
  accordionHead: (open) => ({
    padding: '12px 4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 13,
    fontWeight: 700,
    color: open ? '#F687B3' : '#1A365D',
    transition: 'color 0.2s',
  }),
  accordionContent: (open) => ({
    maxHeight: open ? 500 : 0,
    overflow: 'hidden',
    transition: 'max-height 0.35s ease',
  }),
  accordionText: {
    padding: '4px 4px 14px',
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 1.7,
  },
  accordionArrow: (open) => ({
    transition: 'transform 0.2s',
    transform: open ? 'rotate(180deg)' : 'rotate(0)',
    fontSize: 12,
  }),

  // Edu cards horizontal scroll
  eduWrap: {
    background: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  eduScroller: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 6,
  },
  eduCard: (gradient) => ({
    minWidth: 180,
    flexShrink: 0,
    background: gradient,
    borderRadius: 14,
    padding: 14,
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }),
  eduIcon: { fontSize: 26, marginBottom: 8 },
  eduTitle: { fontSize: 13, fontWeight: 800, marginBottom: 6, lineHeight: 1.4 },
  eduDesc: { fontSize: 11, opacity: 0.9, lineHeight: 1.5 },

  // Floating button
  floatingBtn: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 28,
    padding: '14px 24px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(246,135,179,0.5)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 0.2s',
  },

  // AI Chat
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'linear-gradient(135deg, #FCE7F3, #FEF3C7)',
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 12,
  },
  chatHeaderAvatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  chatHeaderName: { fontSize: 14, fontWeight: 800, color: '#1A365D' },
  chatHeaderRole: { fontSize: 11, color: '#92400E' },
  chatBody: {
    height: 380,
    overflowY: 'auto',
    padding: 12,
    background: '#F9FAFB',
    borderRadius: 12,
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 12,
  },
  chatHint: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    padding: '20px 10px',
    fontStyle: 'italic',
  },
  msgRow: (isUser) => ({
    display: 'flex',
    flexDirection: isUser ? 'row-reverse' : 'row',
    gap: 8,
    alignItems: 'flex-start',
  }),
  msgAvatar: (isUser) => ({
    width: 30, height: 30, borderRadius: '50%',
    background: isUser
      ? 'linear-gradient(135deg, #5B6EC7, #1A365D)'
      : 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  }),
  msgBubble: (isUser, isError) => ({
    background: isError ? '#FEE2E2' : isUser ? '#5B6EC7' : '#FFFFFF',
    color: isError ? '#DC2626' : isUser ? '#FFFFFF' : '#1A365D',
    padding: '10px 14px',
    borderRadius: 14,
    fontSize: 13,
    lineHeight: 1.65,
    maxWidth: '78%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    border: !isUser && !isError ? '1px solid #E5E7EB' : 'none',
  }),
  typingDots: {
    display: 'inline-flex',
    gap: 4,
    padding: '4px 0',
  },
  typingDot: (delay) => ({
    width: 6, height: 6, borderRadius: '50%',
    background: '#F687B3',
    animation: `typingPulse 1.2s ${delay}s infinite ease-in-out`,
  }),
  inputRow: {
    display: 'flex',
    gap: 8,
  },
  qInput: {
    flex: 1,
    padding: '11px 14px',
    fontSize: 14,
    border: '2px solid #E5E7EB',
    borderRadius: 10,
    color: '#1A365D',
    background: '#F9FAFB',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #F687B3, #F5A623)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(246,135,179,0.35)',
  },
  suggestChips: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  suggestChip: {
    background: '#FFFFFF',
    border: '1px solid #FBCFE8',
    color: '#BE185D',
    padding: '5px 12px',
    borderRadius: 16,
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  emptyPosts: {
    textAlign: 'center',
    padding: 50,
    color: '#9CA3AF',
    background: '#FFFFFF',
    borderRadius: 14,
  },
};

function timeAgo(iso) {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const days = Math.floor((now - t) / (24 * 3600 * 1000));
  if (days < 1) return '今天';
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  return `${Math.floor(days / 30)} 個月前`;
}

export default function Community() {
  const { isMobile } = useViewport();
  const [activeTab, setActiveTab] = useState('菁英女性');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [likedSet, setLikedSet] = useState(new Set());
  const [accordion, setAccordion] = useState({});
  const [encyclopedia, setEncyclopedia] = useState([]);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBodyRef = React.useRef(null);

  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    setLoadingPosts(true);
    axios.get(`/api/forum/posts?category=${encodeURIComponent(activeTab)}`)
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));
  }, [activeTab]);

  useEffect(() => {
    axios.get('/api/forum/encyclopedia').then(res => setEncyclopedia(res.data)).catch(() => {});
  }, []);

  async function handleLike(postId) {
    if (likedSet.has(postId)) return;
    setLikedSet(prev => new Set(prev).add(postId));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: p.like_count + 1 } : p));
    try {
      await axios.post(`/api/forum/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch {
      setLikedSet(prev => { const n = new Set(prev); n.delete(postId); return n; });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: p.like_count - 1 } : p));
    }
  }

  async function sendMessage(text) {
    const question = (text ?? chatInput).trim();
    if (!question || chatLoading) return;

    const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post('/api/forum/ask-ai',
        { question, history },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setChatMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: err.response?.data?.message || '連線失敗，請稍後再試。',
        error: true,
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  const SUGGESTIONS = [
    '什麼是 AMH 值？',
    '凍卵流程要多久？',
    '保費怎麼計算？',
    '癌症患者可以投保嗎？',
  ];

  return (
    <div style={styles.page}>
      <div style={styles.pageTitle}>💬 用戶互動與支持社群</div>
      <div style={styles.pageSub}>專為凍卵族群打造的安心交流空間，分享經驗、獲取知識、爭取權益。</div>

      {/* Tab 導覽 */}
      <div style={styles.tabs}>
        {TABS.map(tab => (
          <button key={tab.key}
            style={styles.tab(activeTab === tab.key, tab.color)}
            onClick={() => setActiveTab(tab.key)}>
            <span>{tab.icon}</span>
            <span>{tab.key}</span>
          </button>
        ))}
      </div>

      <div style={styles.layout(isMobile)}>
        {/* 左側：論壇文章 */}
        <div>
          <div style={styles.postsHeader}>
            {loadingPosts ? '載入中...' : `共 ${posts.length} 篇文章 ・ 分類：${activeTab}`}
          </div>
          {!loadingPosts && posts.length === 0 && (
            <div style={styles.emptyPosts}>
              📭 尚無文章
            </div>
          )}
          {posts.map(post => {
            const liked = likedSet.has(post.id);
            return (
              <div key={post.id} style={styles.postCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,54,93,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,54,93,0.06)'; }}>
                <div style={styles.postTags}>
                  {post.tags.map((tag, i) => <span key={i} style={styles.postTag}>{tag}</span>)}
                </div>
                <div style={styles.postTitle}>{post.title}</div>
                <div style={styles.postExcerpt}>{post.excerpt}</div>
                <div style={styles.postMeta}>
                  <div style={styles.postAuthor}>
                    <div style={styles.authorAvatar}>{post.author_name[0]}</div>
                    <span style={{ color: '#1A365D', fontWeight: 600 }}>{post.author_name}</span>
                    <span>・ {timeAgo(post.created_at)}</span>
                  </div>
                  <div style={styles.postActions}>
                    <button style={styles.actionBtn(liked)} onClick={() => handleLike(post.id)}>
                      {liked ? '❤️' : '🤍'} {post.like_count}
                    </button>
                    <span style={styles.actionBtn(false)}>💬 {post.reply_count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 右側：法律百科 + 教育卡 */}
        <div style={styles.rightCol}>
          <div style={styles.encyclopediaCard}>
            <div style={styles.sectionHeader}>📖 生育權益大百科</div>
            {encyclopedia.map(item => {
              const open = accordion[item.id];
              return (
                <div key={item.id} style={styles.accordionItem}>
                  <div style={styles.accordionHead(open)}
                    onClick={() => setAccordion(prev => ({ ...prev, [item.id]: !prev[item.id] }))}>
                    <span>{item.title}</span>
                    <span style={styles.accordionArrow(open)}>▼</span>
                  </div>
                  <div style={styles.accordionContent(open)}>
                    <div style={styles.accordionText}>{item.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.eduWrap}>
            <div style={styles.sectionHeader}>🎓 凍卵知識庫</div>
            <div style={styles.eduScroller}>
              {EDU_CARDS.map((card, i) => (
                <div key={i} style={styles.eduCard(card.color)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={styles.eduIcon}>{card.icon}</div>
                  <div style={styles.eduTitle}>{card.title}</div>
                  <div style={styles.eduDesc}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 浮動按鈕 */}
      <button style={styles.floatingBtn}
        onClick={() => setQuestionOpen(true)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        💬 我要提問
      </button>

      {/* AI 諮詢 Modal */}
      <Modal isOpen={questionOpen} onClose={() => setQuestionOpen(false)} title="🥚 卵卵助理 ・ AI 智能諮詢">
        <style>{`
          @keyframes typingPulse {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.4; }
            30% { transform: scale(1.2); opacity: 1; }
          }
        `}</style>

        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderAvatar}>🥚</div>
          <div style={{ flex: 1 }}>
            <div style={styles.chatHeaderName}>卵卵助理</div>
            <div style={styles.chatHeaderRole}>專屬於凍卵與生育保險的 AI 顧問 ・ 由 Gemini 提供</div>
          </div>
          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>● 線上</span>
        </div>

        <div style={styles.chatBody} ref={chatBodyRef}>
          {chatMessages.length === 0 && !chatLoading && (
            <div style={styles.chatHint}>
              👋 您好，我是卵卵助理！<br />
              可以詢問我關於凍卵、AMH、保險、合作診所等問題。
            </div>
          )}

          {chatMessages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} style={styles.msgRow(isUser)}>
                <div style={styles.msgAvatar(isUser)}>{isUser ? '我' : '🥚'}</div>
                <div style={styles.msgBubble(isUser, msg.error)}>{msg.content}</div>
              </div>
            );
          })}

          {chatLoading && (
            <div style={styles.msgRow(false)}>
              <div style={styles.msgAvatar(false)}>🥚</div>
              <div style={styles.msgBubble(false, false)}>
                <span style={styles.typingDots}>
                  <span style={styles.typingDot(0)} />
                  <span style={styles.typingDot(0.2)} />
                  <span style={styles.typingDot(0.4)} />
                </span>
                <span style={{ marginLeft: 8, color: '#6B7280', fontSize: 12 }}>卵卵助理正在思考...</span>
              </div>
            </div>
          )}
        </div>

        {chatMessages.length === 0 && (
          <div style={styles.suggestChips}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} type="button" style={styles.suggestChip}
                onClick={() => sendMessage(s)}
                onMouseEnter={e => { e.currentTarget.style.background = '#FCE7F3'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleChatSubmit} style={{ ...styles.inputRow, marginTop: chatMessages.length === 0 ? 12 : 0 }}>
          <input type="text" placeholder="輸入您的問題..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={chatLoading}
            style={styles.qInput}
            maxLength={500} />
          <button type="submit" disabled={chatLoading || !chatInput.trim()}
            style={{ ...styles.sendBtn, opacity: (chatLoading || !chatInput.trim()) ? 0.5 : 1 }}>
            {chatLoading ? '⌛' : '送出 →'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
