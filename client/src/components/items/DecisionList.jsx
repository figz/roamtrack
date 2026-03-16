import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import DecisionRow from './DecisionRow';
import ItemForm from './ItemForm';
import { createDecision } from '../../api/standups';
import EmptyState from '../shared/EmptyState';

export default function DecisionList({ standupId }) {
  const { decisions, setDecisions, ticketLinks, setTicketLinks } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(data) {
    const res = await createDecision(standupId, data);
    const { item, links } = res.data;
    setDecisions([...decisions, item]);
    if (links?.length) setTicketLinks([...ticketLinks, ...links]);
    setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Decisions ({decisions.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add</button>
      </div>
      {showForm && (
        <ItemForm type="decision" onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}
      <Droppable droppableId="decisions-list" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {decisions.length === 0 ? (
              <EmptyState message="No decisions yet" />
            ) : (
              decisions.map((item, idx) => (
                <DecisionRow key={item._id} item={item} index={idx} />
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
