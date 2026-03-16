import axios from 'axios';

export const getSettings = () => axios.get('/api/settings');
export const saveSettings = (data) => axios.put('/api/settings', data);
