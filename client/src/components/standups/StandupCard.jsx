import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../shared/Badge';
import { formatDate } from '../../utils/formatters';

export default function StandupCard({ standup }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/standups/${standup._id}`)}
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '16px 20px',
        cursor: 'pointer',
        marginBottom: 12,
        transition: 'box-shadow 0.15s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
          {standup.eventName || 'Untitled Standup'}
        </div>
        <div style={{ fontSize: 13, color: '#757575' }}>
          {formatDate(standup.date)} &middot; {standup.participants?.length || 0} participants
        </div>
      </div>
      <Badge type={standup.status} label={standup.status} />
    </div>
  );
}
