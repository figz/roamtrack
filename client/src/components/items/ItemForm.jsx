import React, { useState } from 'react';

export default function ItemForm({ type, onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [assignee, setAssignee] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), assignee: assignee.trim() });
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#f5f7fa', border: '1px solid #ddd',
      borderRadius: 6, padding: '12px 14px', marginBottom: 12
    }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={type === 'action-item' ? 'Action item text...' : 'Decision text...'}
        style={inputStyle}
        autoFocus
      />
      {type === 'action-item' && (
        <input
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
          placeholder="Assignee (optional)"
          style={{ ...inputStyle, marginTop: 8 }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button type="submit" style={saveBtn}>Add</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: '100%', padding: '7px 10px', border: '1px solid #ddd',
  borderRadius: 4, fontSize: 13
};
const saveBtn = {
  padding: '6px 14px', background: '#3f51b5', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13
};
const cancelBtn = {
  padding: '6px 14px', background: '#fff', border: '1px solid #ddd',
  borderRadius: 4, cursor: 'pointer', fontSize: 13
};
