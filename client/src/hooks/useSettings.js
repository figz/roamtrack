import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getSettings, saveSettings } from '../api/settings';

export function useSettings() {
  const { settings, setSettings, setLoading, setError } = useAppStore();

  const fetchSettings = useCallback(async () => {
    setLoading('settings', true);
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch (err) {
      setError('settings', err.response?.data?.error || err.message);
    } finally {
      setLoading('settings', false);
    }
  }, [setSettings, setLoading, setError]);

  const save = useCallback(async (data) => {
    setLoading('saveSettings', true);
    try {
      const res = await saveSettings(data);
      setSettings(res.data);
      return true;
    } catch (err) {
      setError('saveSettings', err.response?.data?.error || err.message);
      return false;
    } finally {
      setLoading('saveSettings', false);
    }
  }, [setSettings, setLoading, setError]);

  return { settings, fetchSettings, save };
}
