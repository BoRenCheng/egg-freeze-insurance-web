import React, { useState } from 'react';

export default function MetricCard({ icon, label, value, subtitle, accentColor = '#F687B3', valueColor = '#1A365D', gradient }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: gradient || '#FFFFFF',
        borderRadius: 16,
        padding: '24px 24px',
        boxShadow: hover
          ? '0 12px 32px rgba(26,54,93,0.18)'
          : '0 4px 16px rgba(26,54,93,0.08)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'default',
        borderLeft: `4px solid ${accentColor}`,
        minHeight: 130,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: valueColor, lineHeight: 1.2 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 'auto' }}>{subtitle}</div>}
    </div>
  );
}
