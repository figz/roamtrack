import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import Badge from '../shared/Badge';
import { deleteTicketLink } from '../../api/youtrack';

export default function TicketCard({ issue }) {
  const { ticketLinks, removeTicketLink } = useAppStore();
  const ticketId = issue.idReadable || issue.id;
  const linkedItems = ticketLinks.filter(l => l.ticketId === ticketId);

  async function handleUnlink(linkId) {
    await deleteTicketLink(linkId);
    removeTicketLink(linkId);
  }

  return (
    <Droppable droppableId={`ticket-${ticketId}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: snapshot.isDraggingOver ? '#e8eaf6' : '#fff',
            border: snapshot.isDraggingOver ? '2px dashed #3f51b5' : '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 10,
            transition: 'all 0.15s'
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: '#3f51b5', marginBottom: 4 }}>
            {ticketId}
          </div>
          <div style={{ fontSize: 13, color: '#424242', marginBottom: 8 }}>
            {issue.summary}
          </div>
          {linkedItems.length > 0 && (
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
              {linkedItems.map(l => (
                <div key={l._id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 4
                }}>
                  <Badge type={l.linkType} label={`${l.itemType} (${l.linkType})`} />
                  <button
                    onClick={() => handleUnlink(l._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#f44336' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ height: linkedItems.length === 0 ? 20 : 0 }}>
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
