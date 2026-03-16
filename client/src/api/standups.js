import axios from 'axios';

export const getStandups = () => axios.get('/api/standups');
export const getStandup = (id) => axios.get(`/api/standups/${id}`);
export const syncStandups = () => axios.post('/api/standups/sync');
export const pullStandup = (id) => axios.post(`/api/standups/${id}/pull`);
export const createActionItem = (id, data) => axios.post(`/api/standups/${id}/action-items`, data);
export const createDecision = (id, data) => axios.post(`/api/standups/${id}/decisions`, data);
