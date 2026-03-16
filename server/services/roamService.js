const axios = require('axios');

const roamClient = axios.create({
  baseURL: process.env.ROAM_API_BASE_URL || 'https://api.ro.am/v0',
  headers: {
    Authorization: `Bearer ${process.env.ROAM_API_TOKEN}`
  }
});

function getTodayEasternBoundaries() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;

  // Start: today 00:00 ET, End: today 23:59:59 ET
  const startET = new Date(`${year}-${month}-${day}T00:00:00`);
  const endET = new Date(`${year}-${month}-${day}T23:59:59`);

  // Convert ET to UTC (ET is UTC-5 or UTC-4 depending on DST)
  const etOffsetMs = getEasternOffsetMs(now);
  const startUTC = new Date(startET.getTime() + etOffsetMs);
  const endUTC = new Date(endET.getTime() + etOffsetMs);

  return { startUTC, endUTC };
}

function getEasternOffsetMs(date) {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const etDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return utcDate - etDate;
}

async function listTodayTranscripts() {
  const { startUTC, endUTC } = getTodayEasternBoundaries();
  const transcripts = [];
  let cursor = null;

  do {
    const params = {
      after: startUTC.toISOString(),
      before: endUTC.toISOString(),
      limit: 100
    };
    if (cursor) params.cursor = cursor;

    const response = await roamClient.get('/transcript.list', { params });
    const data = response.data;
    if (data.transcripts) {
      transcripts.push(...data.transcripts);
    }
    cursor = data.nextCursor || null;
  } while (cursor);

  return transcripts;
}

function filterByDsuNames(transcripts, dsuNames) {
  const lowerNames = dsuNames.map(n => n.trim().toLowerCase());
  return transcripts.filter(t =>
    t.eventName && lowerNames.includes(t.eventName.trim().toLowerCase())
  );
}

async function extractItems(transcriptId, prompt) {
  try {
    const response = await roamClient.post('/transcript.prompt', {
      id: transcriptId,
      prompt
    });
    const text = response.data.response || '';

    // Try JSON.parse first
    try {
      const parsed = JSON.parse(text);
      return {
        actionItems: parsed.actionItems || [],
        decisions: parsed.decisions || []
      };
    } catch (_) {
      // Try regex extraction
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          return {
            actionItems: parsed.actionItems || [],
            decisions: parsed.decisions || []
          };
        } catch (_) {}
      }
      // Final fallback
      return { actionItems: [], decisions: [] };
    }
  } catch (err) {
    console.error('extractItems error:', err.message);
    return { actionItems: [], decisions: [] };
  }
}

module.exports = { listTodayTranscripts, filterByDsuNames, extractItems };
