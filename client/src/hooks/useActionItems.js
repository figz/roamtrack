import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getStandup } from '../api/standups';

export function useActionItems(standupId) {
  const { actionItems, setActionItems, setLoading, setError } = useAppStore();

  const fetchActionItems = useCallback(async () => {
    if (!standupId) return;
    setLoading('actionItems', true);
    try {
      const res = await getStandup(standupId);
      setActionItems(res.data.actionItems);
    } catch (err) {
      setError('actionItems', err.response?.data?.error || err.message);
    } finally {
      setLoading('actionItems', false);
    }
  }, [standupId, setActionItems, setLoading, setError]);

  return { actionItems, fetchActionItems };
}
