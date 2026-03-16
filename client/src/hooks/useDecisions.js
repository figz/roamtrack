import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getStandup } from '../api/standups';

export function useDecisions(standupId) {
  const { decisions, setDecisions, setLoading, setError } = useAppStore();

  const fetchDecisions = useCallback(async () => {
    if (!standupId) return;
    setLoading('decisions', true);
    try {
      const res = await getStandup(standupId);
      setDecisions(res.data.decisions);
    } catch (err) {
      setError('decisions', err.response?.data?.error || err.message);
    } finally {
      setLoading('decisions', false);
    }
  }, [standupId, setDecisions, setLoading, setError]);

  return { decisions, fetchDecisions };
}
