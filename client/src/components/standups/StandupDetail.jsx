import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import { getStandup, pullStandup, clearStandup } from '../../api/standups';
import { useYouTrack } from '../../hooks/useYouTrack';
import ActionItemList from '../items/ActionItemList';
import DecisionList from '../items/DecisionList';
import TicketPanel from '../youtrack/TicketPanel';
import UpdateButton from '../youtrack/UpdateButton';
import LoadingSpinner from '../shared/LoadingSpinner';
import Badge from '../shared/Badge';
import { formatDate } from '../../utils/formatters';

export default function StandupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedStandup, setSelectedStandup,
    setActionItems, setDecisions, setTicketLinks,
    setYoutrackIssues,
    settings, loading, setLoading, setError, errors
  } = useAppStore();

  const youtrackProject = React.useMemo(() => {
    if (!selectedStandup || !settings?.dsuMappings?.length) return null;
    const eventName = (selectedStandup.eventName || '').trim().toLowerCase();
    const match = settings.dsuMappings.find(
      m => m.name.trim().toLowerCase() === eventName
    );
    return match?.youtrackProject || null;
  }, [selectedStandup, settings]);
  const { linkTicket } = useYouTrack();
  const [pulling, setPulling] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading('detail', true);
      setYoutrackIssues([]); // clear stale issues from previous standup
      try {
        const res = await getStandup(id);
        setSelectedStandup(res.data.standup);
        setActionItems(res.data.actionItems);
        setDecisions(res.data.decisions);
        setTicketLinks(res.data.ticketLinks);
      } catch (err) {
        setError('detail', err.response?.data?.error || err.message);
      } finally {
        setLoading('detail', false);
      }
    }
    load();
  }, [id]);

  async function handlePull() {
    setPulling(true);
    try {
      const res = await pullStandup(id);
      setActionItems(res.data.actionItems);
      setDecisions(res.data.decisions);
      // Reload to get updated links too
      const full = await getStandup(id);
      setSelectedStandup(full.data.standup);
      setActionItems(full.data.actionItems);
      setDecisions(full.data.decisions);
      setTicketLinks(full.data.ticketLinks);
    } catch (err) {
      setError('pull', err.response?.data?.error || err.message);
    } finally {
      setPulling(false);
    }
  }

  async function handleClear() {
    if (!window.confirm('Clear all action items, decisions, and ticket links for this standup?')) return;
    setClearing(true);
    try {
      await clearStandup(id);
      setActionItems([]);
      setDecisions([]);
      setTicketLinks([]);
      setSelectedStandup(s => ({ ...s, status: 'pending', pulledAt: null }));
    } catch (err) {
      setError('clear', err.response?.data?.error || err.message);
    } finally {
      setClearing(false);
    }
  }

  async function onDragEnd(result) {
    const { draggableId, destination } = result;
    if (!destination) return;

    // draggableId: "action-item-<id>" or "decision-<id>"
    // droppableId: "ticket-<ticketId>"
    let itemId, itemType;
    if (draggableId.startsWith('action-item-')) {
      itemId = draggableId.replace('action-item-', '');
      itemType = 'ActionItem';
    } else if (draggableId.startsWith('decision-')) {
      itemId = draggableId.replace('decision-', '');
      itemType = 'Decision';
    } else return;

    if (!destination.droppableId.startsWith('ticket-')) return;
    const ticketId = destination.droppableId.replace('ticket-', '');

    await linkTicket(itemId, itemType, ticketId);
  }

  if (loading.detail) return <LoadingSpinner />;
  if (!selectedStandup) return <div>Standup not found</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button onClick={() => navigate('/')} style={backBtn}>← Back</button>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>
            {selectedStandup.eventName || 'Standup'}
          </h1>
          <Badge type={selectedStandup.status} label={selectedStandup.status} />
        </div>
        <div style={{ color: '#757575', fontSize: 13, marginBottom: 20 }}>
          {formatDate(selectedStandup.date)} &middot; {selectedStandup.participants?.map(p => p.name || p).join(', ') || 'No participants'}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={handlePull} disabled={pulling} style={btnStyle(pulling)}>
            {pulling ? 'Pulling...' : 'Pull from Roam'}
          </button>
          <UpdateButton standupId={id} />
          <button onClick={handleClear} disabled={clearing} style={clearBtnStyle(clearing)}>
            {clearing ? 'Clearing...' : 'Clear'}
          </button>
        </div>

        {errors.pull && <div style={errorStyle}>{errors.pull}</div>}

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <ActionItemList standupId={id} />
            <DecisionList standupId={id} />
          </div>
          <div style={{ width: 320 }}>
            <TicketPanel key={youtrackProject || '_none'} project={youtrackProject} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

const backBtn = {
  padding: '6px 12px', background: '#fff', border: '1px solid #ddd',
  borderRadius: 6, cursor: 'pointer', fontSize: 13
};
const btnStyle = (disabled) => ({
  padding: '8px 16px',
  background: disabled ? '#bdbdbd' : '#3f51b5',
  color: '#fff', border: 'none', borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600
});
const clearBtnStyle = (disabled) => ({
  padding: '8px 16px',
  background: disabled ? '#bdbdbd' : '#fff',
  color: disabled ? '#fff' : '#c62828',
  border: '1px solid #c62828',
  borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 14, fontWeight: 600
});
const errorStyle = {
  background: '#ffebee', color: '#c62828',
  padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14
};
