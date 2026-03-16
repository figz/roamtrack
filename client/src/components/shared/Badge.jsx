import React from 'react';

const styles = {
  auto: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' },
  manual: { background: '#f3e5f5', color: '#6a1b9a', border: '1px solid #ce93d8' },
  roam: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  pending: { background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082' },
  pulled: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' },
  updated: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  default: { background: '#f5f5f5', color: '#616161', border: '1px solid #e0e0e0' }
};

export default function Badge({ type, label }) {
  const style = styles[type] || styles.default;
  return (
    <span style={{
      ...style,
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      display: 'inline-block',
      letterSpacing: '0.3px'
    }}>
      {label || type}
    </span>
  );
}
