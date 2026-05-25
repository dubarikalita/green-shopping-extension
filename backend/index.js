const express = require('express');
const cors = require('cors');
require('dotenv').config();

const scoreRoute = require('./routes/score');
const alternativesRoute = require('./routes/alternatives');

const app = express();
const PORT = process.env.PORT || 3000;

const compareRoute = require('./routes/compare');

const brandsRoute         = require('./routes/brands');
const certificationsRoute = require('./routes/certifications');
const feedbackRoute       = require('./routes/feedback');
const adminRoute          = require('./routes/admin');

app.use('/brands',         brandsRoute);
app.use('/certifications', certificationsRoute);
app.use('/feedback',       feedbackRoute);
app.use('/admin',          adminRoute);

app.use('/compare', compareRoute);

// Middleware
app.use(cors());          // Allow extension to call this server
app.use(express.json());  // Parse incoming JSON requests

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/score', scoreRoute);
app.use('/alternatives', alternativesRoute);

// Health check — visit http://localhost:3000/ to confirm server is running
app.get('/', (req, res) => {
  res.json({ status: 'Green Shopping API is running ✅' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});