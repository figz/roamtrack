import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import ActionItemRow from './ActionItemRow';
import ItemForm from './ItemForm';
import { createActionItem } from '../../api/standups';
import EmptyState from '../shared/EmptyState';

export default function ActionItemList({ standupId }) {
  const { actionItems, setActionItems, ticketLinks, setTicketLinks } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(data) {
    const res = await createActionItem(standupId, data);
    const { item, links } = res.data;
    setActionItems([...actionItems, item]);
    if (links?.length) setTicketLinks([...ticketLinks, ...links]);
    setShowForm(false);
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Action Items ({actionItems.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add</button>
      </div>
      {showForm && (
        <ItemForm type="action-item" onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}
      <Droppable droppableId="action-items-list" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {actionItems.length === 0 ? (
              <EmptyState message="No action items yet" />
            ) : (
              actionItems.map((item, idx) => (
                <ActionItemRow key={item._id} item={item} index={idx} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

const addBtn = {
  padding: '5px 12px', background: '#fff', border: '1px solid #3f51b5',
  color: '#3f51b5', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600
};
