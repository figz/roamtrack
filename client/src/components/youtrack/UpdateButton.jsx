import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { useYouTrack } from '../../hooks/useYouTrack';

export default function UpdateButton({ standupId }) {
  const { postToYouTrack } = useYouTrack();
  const loading = useAppStore(s => s.loading);
  const [result, setResult] = useState(null);

  async function handleUpdate() {
    const res = await postToYouTrack(standupId);
    if (res) setResult(res);
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={handleUpdate}
        disabled={loading.postYoutrack}
        style={{
          padding: '8px 16px',
          background: loading.postYoutrack ? '#bdbdbd' : '#43a047',
          color: '#fff', border: 'none', borderRadius: 6,
          cursor: loading.postYoutrack ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 600
        }}
      >
        {loading.postYoutrack ? 'Updating...' : 'Update YouTrack'}
      </button>
      {result && (
        <span style={{ fontSize: 13, color: '#43a047' }}>
          {result.updated} comment(s) posted
        </span>
      )}
    </div>
  );
}
