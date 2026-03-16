require('dotenv').config({ path: '../.env' });
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
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/standups', standupRoutes);
app.use('/api/action-items', actionItemRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/youtrack', youtrackRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
