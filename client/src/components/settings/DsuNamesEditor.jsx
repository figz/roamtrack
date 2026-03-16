import React, { useState } from 'react';

export default function DsuMappingsEditor({ mappings, onChange }) {
  const [name, setName] = useState('');
  const [project, setProject] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editProject, setEditProject] = useState('');

  function handleAdd() {
    const trimmedName = name.trim();
    const trimmedProject = project.trim();
    if (!trimmedName || !trimmedProject) return;
    if (mappings.some(m => m.name.toLowerCase() === trimmedName.toLowerCase())) return;
    onChange([...mappings, { name: trimmedName, youtrackProject: trimmedProject }]);
    setName('');
    setProject('');
  }

  function handleRemove(index) {
    if (editingIndex === index) setEditingIndex(null);
    onChange(mappings.filter((_, i) => i !== index));
  }

  function startEdit(index) {
    setEditingIndex(index);
    setEditName(mappings[index].name);
    setEditProject(mappings[index].youtrackProject);
  }

  function handleEditSave(index) {
    const trimmedName = editName.trim();
    const trimmedProject = editProject.trim();
    if (!trimmedName || !trimmedProject) return;
    const updated = mappings.map((m, i) =>
      i === index ? { name: trimmedName, youtrackProject: trimmedProject } : m
    );
    onChange(updated);
    setEditingIndex(null);
  }

  function handleEditKeyDown(e, index) {
    if (e.key === 'Enter') { e.preventDefault(); handleEditSave(index); }
    if (e.key === 'Escape') setEditingIndex(null);
  }

  function handleAddKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  }

  return (
    <div>
      {mappings.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={thStyle}>DSU Meeting Name</th>
              <th style={thStyle}>YouTrack Board ID</th>
              <th style={{ ...thStyle, width: 72 }}></th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m, i) => (
              <tr key={i}>
                {editingIndex === i ? (
                  <>
                    <td style={tdStyle}>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, i)}
                        style={inlineInput}
                        autoFocus
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        value={editProject}
                        onChange={e => setEditProject(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, i)}
                        style={inlineInput}
                      />
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEditSave(i)} style={saveBtn}>Save</button>
                      <button onClick={() => setEditingIndex(null)} style={cancelBtn}>✕</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>{m.name}</td>
                    <td style={tdStyle}>
                      <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>
                        {m.youtrackProject}
                      </code>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => startEdit(i)} style={iconBtn} title="Edit">✏️</button>
                      <button onClick={() => handleRemove(i)} style={iconBtn} title="Remove">🗑️</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder="Meeting name (e.g. Wallet Sync)"
          style={inputStyle}
        />
        <input
          value={project}
          onChange={e => setProject(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder="Board ID from URL (e.g. 124-90)"
          style={inputStyle}
        />
        <button onClick={handleAdd} style={addBtn}>Add</button>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#757575',
  padding: '4px 8px', borderBottom: '1px solid #e0e0e0'
};
const tdStyle = {
  padding: '6px 8px', fontSize: 13, borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle'
};
const inputStyle = {
  flex: 1, padding: '7px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13
};
const inlineInput = {
  width: '100%', padding: '5px 8px', border: '1px solid #90caf9',
  borderRadius: 4, fontSize: 13, outline: 'none'
};
const addBtn = {
  padding: '7px 14px', background: '#3f51b5', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap'
};
const saveBtn = {
  padding: '4px 10px', background: '#3f51b5', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, marginRight: 4
};
const cancelBtn = {
  padding: '4px 8px', background: 'none', border: '1px solid #ddd',
  borderRadius: 4, cursor: 'pointer', fontSize: 12, color: '#757575'
};
const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
  padding: '2px 4px', opacity: 0.6
};
