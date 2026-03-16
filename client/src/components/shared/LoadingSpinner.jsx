import React from 'react';

export default function LoadingSpinner({ size = 24 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: size,
        height: size,
        border: '3px solid #e0e0e0',
        borderTop: '3px solid #5c6bc0',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
