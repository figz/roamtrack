import React, { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import useAppStore from '../../store/useAppStore';
import DsuMappingsEditor from './DsuNamesEditor';
import PromptEditor from './PromptEditor';

const DEFAULT_PROMPT = 'From this standup transcript, return ONLY valid JSON in this exact format: { "actionItems": [{"text": "...", "assignee": "..."}], "decisions": [{"text": "..."}] }. IMPORTANT: If any ticket IDs are mentioned (e.g. LFG-4172, PROJ-123), preserve them exactly as spoken including the prefix in the text field. No other text.';

export default function SettingsPage() {
  const { settings, fetchSettings, save } = useSettings();
  const loading = useAppStore(s => s.loading);
  const errors = useAppStore(s => s.errors);
  const [dsuMappings, setDsuMappings] = useState([]);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setDsuMappings(settings.dsuMappings || []);
      setPrompt(settings.transcriptPrompt || DEFAULT_PROMPT);
    }
  }, [settings]);

  async function handleSave() {
    const ok = await save({ dsuMappings, transcriptPrompt: prompt });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <section style={sectionStyle}>
        <h2 style={sectionTitle}>DSU → YouTrack Board Mappings</h2>
        <p style={sectionDesc}>
          Map each standup meeting name to a YouTrack board ID. Find the board ID in the URL:
          youtrack.cloud/agiles/<strong>124-90</strong>/current. Transcripts are matched case-insensitively.
        </p>
        <DsuMappingsEditor mappings={dsuMappings} onChange={setDsuMappings} />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Transcript Prompt</h2>
        <p style={sectionDesc}>
          This prompt is sent to Roam's AI when extracting action items and decisions.
        </p>
        <PromptEditor value={prompt} onChange={setPrompt} />
      </section>

      {errors.saveSettings && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          {errors.saveSettings}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid #e0e0e0', paddingTop: 20 }}>
        <button
          onClick={handleSave}
          disabled={loading.saveSettings}
          style={{
            padding: '10px 24px',
            background: loading.saveSettings ? '#bdbdbd' : '#3f51b5',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: loading.saveSettings ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 600
          }}
        >
          {loading.saveSettings ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span style={{ color: '#43a047', fontSize: 14 }}>Settings saved!</span>}
      </div>
    </div>
  );
}

const sectionStyle = {
  background: '#fff', border: '1px solid #e0e0e0',
  borderRadius: 8, padding: '20px 24px', marginBottom: 20
};
const sectionTitle = { fontSize: 15, fontWeight: 700, marginBottom: 6 };
const sectionDesc = { fontSize: 13, color: '#757575', marginBottom: 12 };
