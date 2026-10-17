/**
 * Haash Corporation — Admin Leads API Handler
 * Handles lead listing, status updates, deletions, manual entry, and CSV exports.
 */

const fs = require('fs');
const path = require('path');

const INQUIRIES_FILE = path.join(__dirname, '..', 'inquiries.json');

function readInquiriesSafe() {
  if (!fs.existsSync(INQUIRIES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    let modified = false;

    // Ensure all leads have required fields (id, status, source)
    const normalized = parsed.map((item, index) => {
      let changed = false;
      if (!item.id) {
        const timePart = item.submittedAt ? new Date(item.submittedAt).getTime() : Date.now();
        item.id = `lead_${timePart}_${index}`;
        changed = true;
      }
      if (!item.status) {
        item.status = 'New';
        changed = true;
      }
      if (!item.source) {
        const isStrategy = (item.service || '').toLowerCase().includes('strategy') || (item.details || '').includes('Preferred Time');
        item.source = isStrategy ? 'Strategy Consultation' : 'Project Inquiry Form';
        changed = true;
      }
      if (changed) modified = true;
      return item;
    });

    if (modified) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(normalized, null, 2), 'utf8');
    }
    return normalized;
  } catch (err) {
    console.error('[Leads API] Error reading inquiries.json:', err);
    return [];
  }
}

function writeInquiriesSafe(leads) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Leads API] Error writing inquiries.json:', err);
    return false;
  }
}

// GET /api/leads
function getLeads(req, res) {
  const leads = readInquiriesSafe();
  return res.status(200).json({
    success: true,
    count: leads.length,
    leads: leads
  });
}

// POST /api/leads/status
function updateLeadStatus(req, res) {
  const { id, status } = req.body || {};
  if (!id || !status) {
    return res.status(400).json({ success: false, error: 'Missing lead id or status' });
  }

  const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  const leads = readInquiriesSafe();
  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  writeInquiriesSafe(leads);

  return res.status(200).json({
    success: true,
    message: 'Lead status updated successfully',
    lead
  });
}

// POST /api/leads/delete
function deleteLead(req, res) {
  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing lead id' });
  }

  let leads = readInquiriesSafe();
  const initialCount = leads.length;
  leads = leads.filter(l => l.id !== id);

  if (leads.length === initialCount) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  writeInquiriesSafe(leads);
  return res.status(200).json({
    success: true,
    message: 'Lead deleted successfully'
  });
}

// POST /api/leads/create
function createManualLead(req, res) {
  const body = req.body || {};
  const fullName = (body.fullName || '').trim();
  const email = (body.email || '').trim();

  if (!fullName || !email) {
    return res.status(400).json({ success: false, error: 'Full name and email are required' });
  }

  const leads = readInquiriesSafe();
  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName,
    email,
    company: (body.company || '').trim(),
    phone: (body.phone || '').trim(),
    service: (body.service || 'Direct Manual Entry').trim(),
    timeline: (body.timeline || '').trim(),
    budget: (body.budget || '').trim(),
    details: (body.details || '').trim(),
    source: (body.source || 'Manual Admin Entry').trim(),
    status: body.status || 'New',
    submittedAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  writeInquiriesSafe(leads);

  return res.status(201).json({
    success: true,
    message: 'Manual lead added successfully',
    lead: newLead
  });
}

// GET /api/leads/export
function exportLeadsCsv(req, res) {
  const leads = readInquiriesSafe();
  const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Company', 'Service', 'Timeline', 'Source', 'Status', 'Details'];

  const csvRows = [headers.join(',')];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${clean}"`;
  };

  leads.forEach(lead => {
    const row = [
      escapeCsv(lead.id),
      escapeCsv(lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : ''),
      escapeCsv(lead.fullName),
      escapeCsv(lead.email),
      escapeCsv(lead.phone),
      escapeCsv(lead.company),
      escapeCsv(lead.service),
      escapeCsv(lead.timeline),
      escapeCsv(lead.source),
      escapeCsv(lead.status),
      escapeCsv(lead.details)
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="haash_leads_${dateStr}.csv"`);
  return res.status(200).send(csvString);
}

// Master Vercel Serverless Function Handler
async function leadsHandler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const action = (req.query && req.query.action) || '';

  if (url.includes('/export') || action === 'export' || (req.query && req.query.export === 'csv')) {
    return exportLeadsCsv(req, res);
  }
  if (url.includes('/status') || action === 'status' || (req.body && req.body.action === 'status')) {
    return updateLeadStatus(req, res);
  }
  if (url.includes('/delete') || action === 'delete' || (req.body && req.body.action === 'delete')) {
    return deleteLead(req, res);
  }
  if (url.includes('/create') || action === 'create' || (req.body && req.body.action === 'create')) {
    return createManualLead(req, res);
  }

  if (req.method === 'POST') {
    return createManualLead(req, res);
  }

  return getLeads(req, res);
}

leadsHandler.getLeads = getLeads;
leadsHandler.updateLeadStatus = updateLeadStatus;
leadsHandler.deleteLead = deleteLead;
leadsHandler.createManualLead = createManualLead;
leadsHandler.exportLeadsCsv = exportLeadsCsv;
leadsHandler.readInquiriesSafe = readInquiriesSafe;

module.exports = leadsHandler;
