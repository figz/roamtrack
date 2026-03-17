import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      onLogin(res.data.token);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f5f5'
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: '40px 36px',
        width: 340, boxShadow: '0 2px 16px rgba(0,0,0,0.10)'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#1a1a2e' }}>RoamTrack</h1>
        <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 28 }}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
              autoFocus
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div style={{ color: '#c62828', fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}
          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#424242' };
const inputStyle = {
  width: '100%', padding: '8px 12px', border: '1px solid #ddd',
  borderRadius: 6, fontSize: 14, boxSizing: 'border-box'
};
const btnStyle = (disabled) => ({
  width: '100%', padding: '10px', background: disabled ? '#bdbdbd' : '#3f51b5',
  color: '#fff', border: 'none', borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600
});
