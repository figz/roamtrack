import React, { useEffect } from 'react';
import { useStandups } from '../../hooks/useStandups';
import StandupCard from './StandupCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import useAppStore from '../../store/useAppStore';

export default function StandupList() {
  const { standups, fetchStandups, sync } = useStandups();
  const loading = useAppStore(s => s.loading);
  const errors = useAppStore(s => s.errors);

  useEffect(() => { fetchStandups(); }, [fetchStandups]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Standups</h1>
        <button
          onClick={sync}
          disabled={loading.sync}
          style={btnStyle(loading.sync)}
        >
          {loading.sync ? 'Fetching...' : "Fetch Today's Standups"}
        </button>
      </div>
      {errors.sync && <div style={errorStyle}>{errors.sync}</div>}
      {loading.standups ? <LoadingSpinner /> :
        standups.length === 0 ?
          <EmptyState message="No standups yet. Click 'Fetch Today's Standups' to pull from Roam." /> :
          standups.map(s => <StandupCard key={s._id} standup={s} />)
      }
    </div>
  );
}

const btnStyle = (disabled) => ({
  padding: '10px 20px',
  background: disabled ? '#bdbdbd' : '#3f51b5',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 14,
  fontWeight: 600
});

const errorStyle = {
  background: '#ffebee',
  color: '#c62828',
  padding: '10px 16px',
  borderRadius: 6,
  marginBottom: 16,
  fontSize: 14
};
