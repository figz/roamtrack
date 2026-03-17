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

  // Get board details to find current sprint
  const boardRes = await ytClient.get(`/agiles/${boardId}`, {
    params: { fields: 'id,name,currentSprint(id,name)' }
  });
  const board = boardRes.data;
  const sprintId = board.currentSprint?.id;
  console.log(`[youtrack] board "${board.name}" (${boardId}), currentSprint:`, board.currentSprint);

  let issues;
  try {
    if (sprintId) {
      const params = { fields: 'id,idReadable,summary,updated', $top: 100 };
      const issuesRes = await ytClient.get(`/agiles/${boardId}/sprints/${sprintId}/issues`, { params });
      issues = issuesRes.data;
      console.log(`[youtrack] sprint "${board.currentSprint.name}" returned ${issues.length} issues`);
    } else {
      const q = `Board: {${board.name}} #Unresolved`;
      console.log(`[youtrack] no sprint, querying: ${q}`);
      const issuesRes = await ytClient.get('/issues', {
        params: { fields: 'id,idReadable,summary,updated', query: q, $top: 100 }
      });
      issues = issuesRes.data;
      console.log(`[youtrack] query returned ${issues.length} issues`);
    }
  } catch (err) {
    console.error(`[youtrack] fetch error:`, err.response?.data || err.message);
    throw err;
  }

  // Sort by most recently updated
  issues.sort((a, b) => (b.updated || 0) - (a.updated || 0));

  // Add web URL to each issue
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
  const q = `Board: {${board.name}} #Unresolved`;
  console.log(`[youtrack] getAllBoardIssues query: ${q}`);
  const issuesRes = await ytClient.get('/issues', {
    params: { fields: 'id,idReadable,summary,updated', query: q, $top: 500 }
  });
  const issues = issuesRes.data;
  console.log(`[youtrack] getAllBoardIssues returned ${issues.length} issues`);
  return issues;
}

module.exports = { getIssuesByBoard, getAllBoardIssues, getIssue, postComment };
