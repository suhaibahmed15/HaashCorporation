/**
 * Haash Corporation — Local Development & Production Express Server
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const handleContactSubmission = require('./api/contact');
const leadsController = require('./api/leads');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form URL-encoded bodies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CORS middleware allowing requests from file:// or other local origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Endpoints for Contact Form & Admin Leads Dashboard
app.post('/api/contact', handleContactSubmission);
app.get('/api/leads', leadsController.getLeads);
app.post('/api/leads/status', leadsController.updateLeadStatus);
app.post('/api/leads/delete', leadsController.deleteLead);
app.post('/api/leads/create', leadsController.createManualLead);
app.get('/api/leads/export', leadsController.exportLeadsCsv);

// Serve static assets with proper caching headers
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html',
  maxAge: '1h'
}));

// Fallback for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ Haash Corporation Web Server is live at:`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
