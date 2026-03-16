import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import StandupList from './components/standups/StandupList';
import StandupDetail from './components/standups/StandupDetail';
import SettingsPage from './components/settings/SettingsPage';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const { fetchSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<StandupList />} />
        <Route path="/standups/:id" element={<StandupDetail />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
