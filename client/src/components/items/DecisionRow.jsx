import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import { updateDecision, deleteDecision } from '../../api/decisions';
import Badge from '../shared/Badge';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function DecisionRow({ item, index }) {
  const { ticketLinks, updateDecision: updateStore, removeDecision } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const links = ticketLinks.filter(l => l.itemId === item._id);

  async function handleSave() {
    try {
      const res = await updateDecision(item._id, { text });
      updateStore(res.data);
      setEditing(false);
    } catch {}
  }

  async function handleDelete() {
    try {
      await deleteDecision(item._id);
      removeDecision(item._id);
    } catch {}
    setConfirmDelete(false);
  }

  return (
    <Draggable draggableId={`decision-${item._id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? '#fce4ec' : '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 8,
            cursor: 'grab'
          }}
        >
          {editing ? (
            <div>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                style={inputStyle}
                placeholder="Decision text"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={handleSave} style={saveBtn}>Save</button>
                <button onClick={() => setEditing(false)} style={cancelBtn}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{item.text}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge type={item.source} label={item.source} />
                  {links.map(l => (
                    l.ticketUrl
                      ? <a key={l._id} href={l.ticketUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Badge type={l.linkType} label={`${l.ticketId} (${l.linkType})`} />
                        </a>
                      : <Badge key={l._id} type={l.linkType} label={`${l.ticketId} (${l.linkType})`} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                <button onClick={() => setEditing(true)} style={iconBtn}>✏️</button>
                <button onClick={() => setConfirmDelete(true)} style={iconBtn}>🗑️</button>
              </div>
            </div>
          )}
          <ConfirmDialog
            open={confirmDelete}
            message="Delete this decision?"
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
          />
        </div>
      )}
    </Draggable>
  );
}

const inputStyle = {
  width: '100%', padding: '6px 10px', border: '1px solid #ddd',
  borderRadius: 4, fontSize: 13
};
const saveBtn = {
  padding: '5px 12px', background: '#3f51b5', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12
};
const cancelBtn = {
  padding: '5px 12px', background: '#fff', border: '1px solid #ddd',
  borderRadius: 4, cursor: 'pointer', fontSize: 12
};
const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '2px 4px'
};
