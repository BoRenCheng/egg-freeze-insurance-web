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
  card:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover:  '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
  navbar:     '0 1px 3px rgba(0,0,0,0.05)',
  cta:        '0 4px 14px rgba(246,135,179,0.35)',
  modal:      '0 24px 64px rgba(0,0,0,0.18)',
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
