import axios from 'axios';

export const getIssues = (boardId, query) =>
  axios.get('/api/youtrack/issues', { params: { boardId, query } });

export const createTicketLink = (data) => axios.post('/api/youtrack/ticket-links', data);
export const deleteTicketLink = (linkId) => axios.delete(`/api/youtrack/ticket-links/${linkId}`);
export const updateYouTrack = (standupId) => axios.post('/api/youtrack/update', { standupId });
