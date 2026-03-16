import React, { useEffect, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { useYouTrack } from '../../hooks/useYouTrack';
import TicketCard from './TicketCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

export default function TicketPanel({ project }) {
  const { youtrackIssues, fetchIssues } = useYouTrack();
  const { loading, errors } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (project) {
      fetchIssues(project, '');
    }
  }, [project]);

  const filtered = query.trim()
    ? youtrackIssues.filter(issue => {
        const q = query.toLowerCase();
        return (
          issue.summary?.toLowerCase().includes(q) ||
          issue.idReadable?.toLowerCase().includes(q)
        );
      })
    : youtrackIssues;

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>YouTrack Tickets</h2>
      {project && (
        <div style={{ fontSize: 12, color: '#9e9e9e', marginBottom: 8 }}>
          Board: <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: 3 }}>{project}</code>
        </div>
      )}
      <p style={{ fontSize: 12, color: '#9e9e9e', marginBottom: 12 }}>
        Drag action items or decisions onto tickets to link them
      </p>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter tickets..."
        style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}
      />
      {errors.youtrack && (
        <div style={{ color: '#c62828', fontSize: 13, marginBottom: 8 }}>{errors.youtrack}</div>
      )}
      {loading.youtrack ? <LoadingSpinner size={20} /> :
        !project ? (
          <EmptyState message="No YouTrack board mapped for this standup. Configure it in Settings." />
        ) : filtered.length === 0 ? (
          <EmptyState message="No issues found" />
        ) : (
          filtered.map(issue => (
            <TicketCard key={issue.idReadable || issue.id} issue={issue} />
          ))
        )
      }
    </div>
  );
}

const searchBtn = {
  padding: '6px 12px', background: '#3f51b5', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13
};
