import React, { useEffect, useRef, useState } from 'react';
import { useStandups } from '../../hooks/useStandups';
import StandupCard from './StandupCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import useAppStore from '../../store/useAppStore';

function toLocalDateStr(dateVal) {
  const d = new Date(dateVal);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return toLocalDateStr(new Date());
}

function shiftDate(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return toLocalDateStr(d);
}

function formatLabel(dateStr) {
  const today = todayStr();
  const yesterday = shiftDate(today, -1);
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}

export default function StandupList() {
  const { standups, fetchStandups, sync } = useStandups();
  const loading = useAppStore(s => s.loading);
  const errors = useAppStore(s => s.errors);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const dateInputRef = useRef(null);

  useEffect(() => { fetchStandups(); }, [fetchStandups]);

  const isToday = selectedDate === todayStr();
  const filtered = standups.filter(s => toLocalDateStr(s.date) === selectedDate);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Standups</h1>
        {isToday && (
          <button onClick={sync} disabled={loading.sync} style={btnStyle(loading.sync)}>
            {loading.sync ? 'Fetching...' : "Fetch Today's Standups"}
          </button>
        )}
      </div>

      {/* Date navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setSelectedDate(s => shiftDate(s, -1))} style={navBtn}>&#8592;</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            onClick={() => dateInputRef.current?.showPicker()}
            style={{ fontSize: 15, fontWeight: 600, color: '#3f51b5', minWidth: 160, textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
            title="Click to pick a date"
          >
            {formatLabel(selectedDate)}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            max={todayStr()}
            onChange={e => e.target.value && setSelectedDate(e.target.value)}
            style={{ width: 0, height: 0, opacity: 0, border: 'none', padding: 0, position: 'absolute' }}
          />
        </div>
        <button
          onClick={() => setSelectedDate(s => shiftDate(s, 1))}
          disabled={isToday}
          style={navBtn}
        >
          &#8594;
        </button>
      </div>

      {errors.sync && <div style={errorStyle}>{errors.sync}</div>}
      {loading.standups ? <LoadingSpinner /> :
        filtered.length === 0 ?
          <EmptyState message={`No standups on ${formatLabel(selectedDate)}.${isToday ? " Click 'Fetch Today\\'s Standups' to pull from Roam." : ''}`} /> :
          filtered.map(s => <StandupCard key={s._id} standup={s} />)
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

const navBtn = {
  background: 'none',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: 16,
  color: '#3f51b5',
  lineHeight: 1
};

const errorStyle = {
  background: '#ffebee',
  color: '#c62828',
  padding: '10px 16px',
  borderRadius: 6,
  marginBottom: 16,
  fontSize: 14
};
