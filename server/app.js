const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const standupRoutes = require('./routes/standups');
const actionItemRoutes = require('./routes/actionItems');
const decisionRoutes = require('./routes/decisions');
const youtrackRoutes = require('./routes/youtrack');
const settingsRoutes = require('./routes/settings');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure DB is connected before every request (safe for serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/standups', standupRoutes);
app.use('/api/action-items', actionItemRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/youtrack', youtrackRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

module.exports = app;
