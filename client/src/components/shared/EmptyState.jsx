import React from 'react';

export default function EmptyState({ message = 'No items found', action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: '#9e9e9e'
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
      <p style={{ fontSize: 14 }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
