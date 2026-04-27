// 全站統一設計 token（仿 smartbeb 簡潔白底風格）
export const colors = {
  // 品牌主色
  brandNavy:      '#1A365D',
  brandNavyDark:  '#0F2942',
  brandPink:      '#F687B3',
  brandPinkSoft:  '#FCE7F3',
  brandPinkBg:    '#FFF5F8',
  brandGold:      '#F5A623',
  brandGoldSoft:  '#FEF3C7',
  brandMint:      '#5EEAD4',
  brandMintSoft:  '#E6FFFA',

  // 文字
  textPrimary:    '#1F2937',
  textSecondary:  '#4B5563',
  textMuted:      '#6B7280',
  textPlaceholder:'#9CA3AF',

  // 背景
  bgWhite:        '#FFFFFF',
  bgSoft:         '#F9FAFB',
  bgAccent:       '#F3F4F6',

  // 邊界與分隔
  borderLight:    '#E5E7EB',
  borderSofter:   '#F3F4F6',

  // 狀態
  success:        '#10B981',
  warning:        '#F59E0B',
  danger:         '#EF4444',
  info:           '#5B6EC7',
};

export const shadows = {
  // 加深的卡片陰影
  card:       '0 4px 14px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.06)',
  cardHover:  '0 18px 40px rgba(15,23,42,0.18), 0 6px 14px rgba(15,23,42,0.10)',
  navbar:     '0 2px 8px rgba(15,23,42,0.08)',
  cta:        '0 6px 18px rgba(246,135,179,0.45), 0 2px 6px rgba(246,135,179,0.25)',
  modal:      '0 24px 64px rgba(15,23,42,0.30)',
  // 強調用
  bold:       '0 12px 32px rgba(15,23,42,0.16), 0 4px 8px rgba(15,23,42,0.08)',
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
};

// 響應式斷點（同 useViewport 內邏輯）
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
};
