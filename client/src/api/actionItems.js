import axios from 'axios';

export const updateActionItem = (id, data) => axios.put(`/api/action-items/${id}`, data);
export const deleteActionItem = (id) => axios.delete(`/api/action-items/${id}`);
