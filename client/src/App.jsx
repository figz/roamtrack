import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from './components/layout/AppShell';
import StandupList from './components/standups/StandupList';
import StandupDetail from './components/standups/StandupDetail';
import SettingsPage from './components/settings/SettingsPage';
import LoginPage from './components/auth/LoginPage';
import { useSettings } from './hooks/useSettings';

const TOKEN_KEY = 'rt_token';

function setAxiosToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const { fetchSettings } = useSettings();

  useEffect(() => {
    setAxiosToken(token);
    if (token) fetchSettings();
  }, [token]);

  function handleLogin(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <AppShell onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<StandupList />} />
        <Route path="/standups/:id" element={<StandupDetail />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
