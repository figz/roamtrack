const axios = require('axios');

const ytClient = axios.create({
  baseURL: process.env.YOUTRACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.YOUTRACK_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Extract board ID from a full URL or return as-is
function parseBoardId(boardIdOrUrl) {
  const match = boardIdOrUrl.match(/agiles\/([^\/]+)/);
  return match ? match[1] : boardIdOrUrl;
}

async function getIssuesByBoard(boardIdOrUrl) {
  const boardId = parseBoardId(boardIdOrUrl);

  const boardRes = await ytClient.get(`/agiles/${boardId}`, {
    params: { fields: 'id,name,currentSprint(id,name)' }
  });
  const board = boardRes.data;
  const sprintId = board.currentSprint?.id;
  console.log(`[youtrack] board "${board.name}" (${boardId}), currentSprint:`, board.currentSprint);

  let issues;
  try {
    if (sprintId) {
      // Page through the sprint endpoint to get all issues
      let skip = 0;
      const pageSize = 100;
      issues = [];
      while (true) {
        const page = await ytClient.get(`/agiles/${boardId}/sprints/${sprintId}/issues`, {
          params: { fields: 'id,idReadable,summary,updated', $top: pageSize, $skip: skip }
        });
        const batch = page.data;
        issues.push(...batch);
        console.log(`[youtrack] sprint page skip=${skip} returned ${batch.length} issues (total so far: ${issues.length})`);
        if (batch.length < pageSize) break;
        skip += pageSize;
      }
    } else {
      const q = `Board: {${board.name}} #Unresolved`;
      console.log(`[youtrack] querying issues: ${q}`);
      const issuesRes = await ytClient.get('/issues', {
        params: { fields: 'id,idReadable,summary,updated', query: q, $top: 500 }
      });
      issues = issuesRes.data;
      console.log(`[youtrack] board query returned ${issues.length} issues`);
    }
  } catch (err) {
    console.error(`[youtrack] fetch error:`, err.response?.data || err.message);
    throw err;
  }

  issues.sort((a, b) => (b.updated || 0) - (a.updated || 0));

  const webBase = (process.env.YOUTRACK_BASE_URL || '').replace(/\/api\/?$/, '');
  issues.forEach(issue => {
    const id = issue.idReadable || issue.id;
    if (id) issue.webUrl = `${webBase}/issue/${id}`;
  });

  return issues;
}

async function getIssue(ticketId) {
  const response = await ytClient.get(`/issues/${ticketId}`, {
    params: { fields: 'id,summary,idReadable' }
  });
  return response.data;
}

async function findUserLoginByEmail(email) {
  if (!email) return null;
  try {
    const res = await ytClient.get('/users', {
      params: { query: `email: ${email}`, fields: 'id,login,fullName,email', $top: 5 }
    });
    const users = res.data;
    console.log(`[findUserLoginByEmail] query="email: ${email}", results:`, JSON.stringify(users));
    if (!users.length) return null;
    const emailLower = email.trim().toLowerCase();
    const exact = users.find(u => (u.email || '').toLowerCase() === emailLower);
    return (exact || users[0]).login || null;
  } catch (err) {
    console.error(`[findUserLoginByEmail] error for "${email}":`, err.response?.data || err.message);
    return null;
  }
}

async function postComment(ticketId, text) {
  const response = await ytClient.post(`/issues/${ticketId}/comments`, { text });
  return response.data;
}

// Fetch ALL unresolved issues from a board (not just current sprint) — used for auto-matching
async function getAllBoardIssues(boardIdOrUrl) {
  const boardId = parseBoardId(boardIdOrUrl);
  const boardRes = await ytClient.get(`/agiles/${boardId}`, {
    params: { fields: 'id,name' }
  });
  const board = boardRes.data;
  const q = `Board: {${board.name}}`;
  console.log(`[youtrack] getAllBoardIssues query: ${q}`);
  const issuesRes = await ytClient.get('/issues', {
    params: { fields: 'id,idReadable,summary,updated', query: q, $top: 500, $orderBy: 'updated desc' }
  });
  const issues = issuesRes.data;
  console.log(`[youtrack] getAllBoardIssues returned ${issues.length} issues`);
  return issues;
}

module.exports = { getIssuesByBoard, getAllBoardIssues, getIssue, findUserLoginByEmail, postComment };
