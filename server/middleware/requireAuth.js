const { TOKEN } = require('../routes/auth');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token === TOKEN) return next();
  res.status(401).json({ error: 'Unauthorized' });
};
