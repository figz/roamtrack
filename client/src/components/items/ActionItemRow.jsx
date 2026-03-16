import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import { updateActionItem, deleteActionItem } from '../../api/actionItems';
import Badge from '../shared/Badge';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function ActionItemRow({ item, index }) {
  const { ticketLinks, updateActionItem: updateStore, removeActionItem } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const [assignee, setAssignee] = useState(item.assignee || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const links = ticketLinks.filter(l => l.itemId === item._id);

  async function handleSave() {
    try {
      const res = await updateActionItem(item._id, { text, assignee });
      updateStore(res.data);
      setEditing(false);
    } catch {}
  }

  async function handleDelete() {
    try {
      await deleteActionItem(item._id);
      removeActionItem(item._id);
    } catch {}
    setConfirmDelete(false);
  }

  return (
    <Draggable draggableId={`action-item-${item._id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? '#e8eaf6' : '#fff',
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
                placeholder="Action item text"
              />
              <input
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                style={{ ...inputStyle, marginTop: 6 }}
                placeholder="Assignee"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={handleSave} style={saveBtn}>Save</button>
                <button onClick={() => setEditing(false)} style={cancelBtn}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{item.text}</div>
                  {item.assignee && (
                    <div style={{ fontSize: 12, color: '#757575' }}>Assignee: {item.assignee}</div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <Badge type={item.source} label={item.source} />
                    {links.map(l => (
                      <Badge key={l._id} type={l.linkType} label={`${l.ticketId} (${l.linkType})`} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                  <button onClick={() => setEditing(true)} style={iconBtn}>✏️</button>
                  <button onClick={() => setConfirmDelete(true)} style={iconBtn}>🗑️</button>
                </div>
              </div>
            </div>
          )}
          <ConfirmDialog
            open={confirmDelete}
            message="Delete this action item?"
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
