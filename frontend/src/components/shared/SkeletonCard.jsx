import React from 'react';

const styles = {
  card: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
    border: '1px solid #E5E7EB',
  },
  line: {
    height: 14,
    background: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 10,
  },
};

export default function SkeletonCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={styles.card}>
          <div style={{ ...styles.line, width: '60%', height: 18 }} />
          <div style={{ ...styles.line, width: '90%' }} />
          <div style={{ ...styles.line, width: '75%' }} />
          <div style={{ ...styles.line, width: '40%', marginBottom: 0 }} />
        </div>
      ))}
    </>
  );
}
