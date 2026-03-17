import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ onLogout }) {
  return (
    <header style={{
      background: '#3f51b5',
      color: '#fff',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 20, fontWeight: 700 }}>
        RoamTrack
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14 }}>
          Standups
        </Link>
        <Link to="/settings" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14 }}>
          Settings
        </Link>
        <button onClick={onLogout} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.4)',
          color: 'rgba(255,255,255,0.8)', borderRadius: 4,
          padding: '4px 10px', cursor: 'pointer', fontSize: 13
        }}>
          Sign out
        </button>
      </nav>
    </header>
  );
}
