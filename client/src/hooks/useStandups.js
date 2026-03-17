import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getStandups, syncStandups } from '../api/standups';

export function useStandups() {
  const { standups, setStandups, setLoading, setError } = useAppStore();

  const fetchStandups = useCallback(async () => {
    setLoading('standups', true);
    setError('standups', null);
    try {
      const res = await getStandups();
      setStandups(res.data);
    } catch (err) {
      setError('standups', err.response?.data?.error || err.message);
    } finally {
      setLoading('standups', false);
    }
  }, [setStandups, setLoading, setError]);

  const sync = useCallback(async (date) => {
    setLoading('sync', true);
    setError('sync', null);
    try {
      await syncStandups(date);
      await fetchStandups();
    } catch (err) {
      setError('sync', err.response?.data?.error || err.message);
    } finally {
      setLoading('sync', false);
    }
  }, [fetchStandups, setLoading, setError]);

  return { standups, fetchStandups, sync };
}
