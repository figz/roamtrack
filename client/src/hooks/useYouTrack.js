import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getIssues, createTicketLink, deleteTicketLink, updateYouTrack } from '../api/youtrack';

export function useYouTrack() {
  const { youtrackIssues, setYoutrackIssues, addTicketLink, removeTicketLink, setLoading, setError } = useAppStore();

  const fetchIssues = useCallback(async (project, query) => {
    setLoading('youtrack', true);
    setError('youtrack', null);
    try {
      const res = await getIssues(project, query);
      setYoutrackIssues(res.data);
    } catch (err) {
      setError('youtrack', err.response?.data?.error || err.message);
    } finally {
      setLoading('youtrack', false);
    }
  }, [setYoutrackIssues, setLoading, setError]);

  const linkTicket = useCallback(async (itemId, itemType, ticketId) => {
    try {
      const res = await createTicketLink({ itemId, itemType, ticketId });
      addTicketLink(res.data);
      return res.data;
    } catch (err) {
      setError('linkTicket', err.response?.data?.error || err.message);
      return null;
    }
  }, [addTicketLink, setError]);

  const unlinkTicket = useCallback(async (linkId) => {
    try {
      await deleteTicketLink(linkId);
      removeTicketLink(linkId);
    } catch (err) {
      setError('unlinkTicket', err.response?.data?.error || err.message);
    }
  }, [removeTicketLink, setError]);

  const postToYouTrack = useCallback(async (standupId) => {
    setLoading('postYoutrack', true);
    setError('postYoutrack', null);
    try {
      const res = await updateYouTrack(standupId);
      return res.data;
    } catch (err) {
      setError('postYoutrack', err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading('postYoutrack', false);
    }
  }, [setLoading, setError]);

  return { youtrackIssues, fetchIssues, linkTicket, unlinkTicket, postToYouTrack };
}
