import React from 'react';

export default function PromptEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={6}
      style={{
        width: '100%', padding: '10px 12px',
        border: '1px solid #ddd', borderRadius: 6,
        fontSize: 13, fontFamily: 'monospace',
        resize: 'vertical', lineHeight: 1.5
      }}
      placeholder="Enter the prompt to send to Roam's transcript.prompt..."
    />
  );
}
