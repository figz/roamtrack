import axios from 'axios';

export const updateDecision = (id, data) => axios.put(`/api/decisions/${id}`, data);
export const deleteDecision = (id) => axios.delete(`/api/decisions/${id}`);
