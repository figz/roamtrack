import React from 'react';

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: 24, maxWidth: 360, width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <p style={{ marginBottom: 20, fontSize: 15 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={cancelStyle}>Cancel</button>
          <button onClick={onConfirm} style={confirmStyle}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

const cancelStyle = {
  padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd',
  background: '#fff', cursor: 'pointer', fontSize: 14
};
const confirmStyle = {
  padding: '8px 16px', borderRadius: 6, border: 'none',
  background: '#e53935', color: '#fff', cursor: 'pointer', fontSize: 14
};
