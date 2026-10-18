/**
 * Haash Corporation — Admin Dashboard Controller
 * Handles lead listing, searching, filtering, status updates, deletions, and exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const lockScreen = document.getElementById('lockScreen');
  const pinInput = document.getElementById('pinInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const lockError = document.getElementById('lockError');
  const lockBtn = document.getElementById('lockBtn');

  const leadsTbody = document.getElementById('leadsTbody');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('adminSearch');
  const statusFilter = document.getElementById('statusFilter');
  const filterPills = document.querySelectorAll('.filter-pill');
  const refreshBtn = document.getElementById('refreshBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const addLeadBtn = document.getElementById('addLeadBtn');

  // Stat Counters
  const statTotal = document.getElementById('statTotal');
  const statNew = document.getElementById('statNew');
  const statStrategy = document.getElementById('statStrategy');
  const statProjects = document.getElementById('statProjects');

  // Modals
  const detailModal = document.getElementById('leadDetailModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModal');
  const addLeadModal = document.getElementById('addLeadModal');
  const closeAddModalBtn = document.getElementById('closeAddModal');
  const addLeadForm = document.getElementById('manualLeadForm');

  // Supabase Cloud Settings Elements
  const cloudConfigBtn = document.getElementById('cloudConfigBtn');
  const cloudStatusText = document.getElementById('cloudStatusText');
  const cloudModal = document.getElementById('cloudModal');
  const closeCloudModal = document.getElementById('closeCloudModal');
  const supabaseConfigForm = document.getElementById('supabaseConfigForm');
  const sbProjectUrl = document.getElementById('sbProjectUrl');
  const sbAnonKey = document.getElementById('sbAnonKey');
  const sbClearBtn = document.getElementById('sbClearBtn');

  // Toast
  const adminToast = document.getElementById('adminToast');
  const toastMessage = document.getElementById('toastMessage');

  // State
  let allLeads = [];
  let currentServiceFilter = 'all';
  let currentSearchQuery = '';
  let currentStatusFilter = 'all';

  const isFile = window.location.protocol === 'file:';
  const API_BASE = isFile ? 'http://localhost:3000' : '';

  const updateCloudStatusUI = () => {
    if (!cloudConfigBtn || !cloudStatusText) return;
    const isCloudActive = window.HaashSupabase && window.HaashSupabase.isConfigured();
    if (isCloudActive) {
      cloudStatusText.textContent = 'Supabase Cloud (Active)';
      cloudConfigBtn.style.color = '#10B981';
      cloudConfigBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      cloudStatusText.textContent = 'Connect Supabase';
      cloudConfigBtn.style.color = '#F59E0B';
      cloudConfigBtn.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    }
  };

  // Show Toast
  const showToast = (msg, duration = 3000) => {
    if (!adminToast || !toastMessage) return;
    toastMessage.textContent = msg;
    adminToast.classList.add('is-visible');
    setTimeout(() => {
      adminToast.classList.remove('is-visible');
    }, duration);
  };

  // ==========================================================================
  // 1. PIN / Passcode Authentication (Cryptographic SHA-256)
  // ==========================================================================
  // Secure one-way SHA-256 digest (plaintext password is never stored or displayed)
  const SECURE_AUTH_HASH = '3f311ee6e5a1db264ab548a195739dc92b50d5b8bfca352989c329ee6e61dc5f';

  const computePinHash = async (text) => {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return '';
    }
  };

  const checkAuth = () => {
    const isUnlocked = sessionStorage.getItem('haash_admin_auth') === 'true';
    if (isUnlocked) {
      if (lockScreen) lockScreen.style.display = 'none';
      loadLeads();
    } else {
      if (lockScreen) lockScreen.style.display = 'flex';
      if (pinInput) pinInput.focus();
    }
  };

  const handleUnlock = async (pin) => {
    const cleanPin = (pin || '').trim();
    if (!cleanPin) {
      if (lockError) {
        lockError.textContent = 'Please enter your authorization PIN.';
        lockError.style.display = 'block';
      }
      return;
    }

    const inputHash = await computePinHash(cleanPin);
    if (inputHash === SECURE_AUTH_HASH) {
      sessionStorage.setItem('haash_admin_auth', 'true');
      if (lockScreen) lockScreen.style.display = 'none';
      if (lockError) lockError.style.display = 'none';
      showToast('Authentication confirmed. Welcome to Admin Portal.');
      loadLeads();
    } else {
      if (lockError) {
        lockError.textContent = 'Invalid authorization PIN. Access denied.';
        lockError.style.display = 'block';
      }
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  };

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => handleUnlock(pinInput ? pinInput.value : ''));
  }

  if (pinInput) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUnlock(pinInput.value);
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('haash_admin_auth');
      if (lockScreen) {
        lockScreen.style.display = 'flex';
        if (pinInput) pinInput.value = '';
      }
    });
  }

  // ==========================================================================
  // 2. Fetch Leads Data from Supabase Cloud / Local Server
  // ==========================================================================
  const loadLeads = async () => {
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        <span>Refreshing...</span>
      `;
    }

    try {
      updateCloudStatusUI();

      // 1. Check if Supabase Cloud is configured
      if (window.HaashSupabase && window.HaashSupabase.isConfigured()) {
        const cloudLeads = await window.HaashSupabase.fetchLeads();
        if (Array.isArray(cloudLeads)) {
          allLeads = cloudLeads;
          updateStats();
          renderLeads();
          return;
        }
      }

      // 2. Otherwise try local/serverless API
      try {
        const res = await fetch(`${API_BASE}/api/leads`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.leads)) {
            allLeads = data.leads;
            updateStats();
            renderLeads();
            return;
          }
        }
      } catch (e) {
        // Fallback to client storage
      }

      // 3. Fallback to client local cache / offline leads
      if (window.HaashSupabase) {
        const offlineLeads = await window.HaashSupabase.fetchLeads();
        allLeads = offlineLeads || [];
        updateStats();
        renderLeads();
      }
    } catch (err) {
      console.warn('[Leads Fetch Error]', err);
      showToast('Offline mode active. Leads cached in browser.');
    } finally {
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Refresh</span>
        `;
      }
    }
  };

  // ==========================================================================
  // 3. Update KPI Stat Cards
  // ==========================================================================
  const updateStats = () => {
    const total = allLeads.length;
    const newCount = allLeads.filter(l => (l.status || 'New').toLowerCase() === 'new').length;
    const strategyCount = allLeads.filter(l => 
      (l.service || '').toLowerCase().includes('strategy') || 
      (l.source || '').toLowerCase().includes('strategy')
    ).length;
    const projectsCount = total - strategyCount;

    if (statTotal) statTotal.textContent = total;
    if (statNew) statNew.textContent = newCount;
    if (statStrategy) statStrategy.textContent = strategyCount;
    if (statProjects) statProjects.textContent = projectsCount;
  };

  // ==========================================================================
  // 4. Filtering & Rendering
  // ==========================================================================
  const getFilteredLeads = () => {
    return allLeads.filter(lead => {
      // Search Query
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        const matchesName = (lead.fullName || '').toLowerCase().includes(q);
        const matchesEmail = (lead.email || '').toLowerCase().includes(q);
        const matchesPhone = (lead.phone || '').toLowerCase().includes(q);
        const matchesCompany = (lead.company || '').toLowerCase().includes(q);
        const matchesService = (lead.service || '').toLowerCase().includes(q);
        const matchesDetails = (lead.details || '').toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCompany && !matchesService && !matchesDetails) {
          return false;
        }
      }

      // Status Filter
      if (currentStatusFilter !== 'all') {
        const leadStatus = (lead.status || 'New').toLowerCase();
        if (leadStatus !== currentStatusFilter.toLowerCase()) {
          return false;
        }
      }

      // Service Category Pill Filter
      if (currentServiceFilter !== 'all') {
        const leadService = (lead.service || '').toLowerCase();
        const leadSource = (lead.source || '').toLowerCase();

        if (currentServiceFilter === 'strategy') {
          if (!leadService.includes('strategy') && !leadSource.includes('strategy')) return false;
        } else if (currentServiceFilter === 'chatbot') {
          if (!leadService.includes('chatbot') && !leadService.includes('nlu')) return false;
        } else if (currentServiceFilter === 'web') {
          if (!leadService.includes('web') && !leadService.includes('site')) return false;
        } else if (currentServiceFilter === 'design') {
          if (!leadService.includes('design') && !leadService.includes('ui') && !leadService.includes('ux')) return false;
        } else if (currentServiceFilter === 'voice') {
          if (!leadService.includes('voice') && !leadService.includes('call') && !leadService.includes('receptionist')) return false;
        } else if (currentServiceFilter === 'crm') {
          if (!leadService.includes('crm') && !leadService.includes('pipeline') && !leadService.includes('automation')) return false;
        } else if (currentServiceFilter === 'graphic') {
          if (!leadService.includes('graphic') && !leadService.includes('brand') && !leadService.includes('identity')) return false;
        }
      }

      return true;
    });
  };

  const getInitials = (name) => {
    if (!name) return 'HC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const getCleanPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    return rawPhone.replace(/[^0-9]/g, '');
  };

  const renderLeads = () => {
    const filtered = getFilteredLeads();

    if (!leadsTbody) return;

    if (filtered.length === 0) {
      leadsTbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    leadsTbody.innerHTML = filtered.map(lead => {
      const initials = getInitials(lead.fullName);
      const dateFormatted = formatDateTime(lead.submittedAt);
      const status = lead.status || 'New';
      const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
      const waNumber = getCleanPhoneForWhatsApp(lead.phone);
      const waText = encodeURIComponent(`Hello ${lead.fullName}, thank you for contacting Haash Corporation regarding your ${lead.service || 'project'} inquiry.`);
      const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : 'https://wa.me/923423951603';
      const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(`Haash Corporation — Follow-up: ${lead.service || 'Project Inquiry'}`)}`;

      return `
        <tr data-lead-id="${lead.id}">
          <td data-label="Date">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">${dateFormatted}</span>
          </td>
          <td data-label="Client">
            <div class="client-meta">
              <div class="client-avatar">${initials}</div>
              <div>
                <div class="client-name">${escapeHtml(lead.fullName || 'Anonymous')}</div>
                <div class="client-company">${escapeHtml(lead.company || 'Direct Client')}</div>
              </div>
            </div>
          </td>
          <td data-label="Contact">
            <div class="contact-links">
              <a href="${mailtoLink}" class="contact-link" title="Send Email">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>${escapeHtml(lead.email || 'No email')}</span>
              </a>
              ${lead.phone ? `
                <a href="${waLink}" target="_blank" class="contact-link" style="color: #25D366;" title="Chat on WhatsApp">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>${escapeHtml(lead.phone)}</span>
                </a>
              ` : ''}
            </div>
          </td>
          <td data-label="Service">
            <span class="service-badge">${escapeHtml(lead.service || 'General Inquiry')}</span>
            <span class="source-badge">${escapeHtml(lead.source || 'Contact Form')}</span>
          </td>
          <td data-label="Status">
            <span class="status-pill ${statusClass}">
              <select class="status-select" data-id="${lead.id}" aria-label="Change Lead Status">
                <option value="New" ${status === 'New' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Closed" ${status === 'Closed' ? 'selected' : ''}>Closed</option>
              </select>
            </span>
          </td>
          <td data-label="Actions">
            <div class="action-buttons">
              <a href="${waLink}" target="_blank" class="icon-btn icon-btn-whatsapp" title="Chat on WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <button type="button" class="icon-btn view-dossier-btn" data-id="${lead.id}" title="View Details">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button type="button" class="icon-btn icon-btn-delete delete-lead-btn" data-id="${lead.id}" title="Delete Lead">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    attachRowEventListeners();
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // ==========================================================================
  // 5. Row Event Listeners: Status Change, View Dossier, Delete
  // ==========================================================================
  const attachRowEventListeners = () => {
    // Status Select Changes
    leadsTbody.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = select.getAttribute('data-id');
        const newStatus = select.value;
        await updateStatus(id, newStatus);
      });
    });

    // View Dossier Modal
    leadsTbody.querySelectorAll('.view-dossier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const lead = allLeads.find(l => l.id === id);
        if (lead) openLeadDossier(lead);
      });
    });

    // Delete Lead
    leadsTbody.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const lead = allLeads.find(l => l.id === id);
        const name = lead ? lead.fullName : 'this lead';
        if (confirm(`Are you sure you want to delete lead: "${name}"?`)) {
          await deleteLead(id);
        }
      });
    });
  };

  // Update Status API (Supabase Cloud + Local sync)
  const updateStatus = async (id, status) => {
    try {
      if (window.HaashSupabase) {
        await window.HaashSupabase.updateStatus(id, status);
      }

      try {
        await fetch(`${API_BASE}/api/leads/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status })
        });
      } catch (e) {
        // Ignore server error if on static host
      }

      showToast(`Lead marked as ${status}`);
      const lead = allLeads.find(l => String(l.id) === String(id));
      if (lead) lead.status = status;
      updateStats();
      renderLeads();
    } catch (err) {
      console.error(err);
      showToast('Error updating status.');
    }
  };

  // Delete Lead API (Supabase Cloud + Local sync)
  const deleteLead = async (id) => {
    try {
      if (window.HaashSupabase) {
        await window.HaashSupabase.deleteLead(id);
      }

      try {
        await fetch(`${API_BASE}/api/leads/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e) {
        // Ignore server error if on static host
      }

      showToast('Lead deleted successfully');
      allLeads = allLeads.filter(l => String(l.id) !== String(id));
      updateStats();
      renderLeads();
    } catch (err) {
      console.error(err);
      showToast('Error deleting lead.');
    }
  };

  // ==========================================================================
  // 6. Lead Detail Dossier Modal
  // ==========================================================================
  const openLeadDossier = (lead) => {
    if (!detailModal) return;

    document.getElementById('modalLeadName').textContent = lead.fullName || 'Anonymous';
    document.getElementById('modalLeadCompany').textContent = lead.company || 'Not provided';
    document.getElementById('modalLeadEmail').textContent = lead.email || 'N/A';
    document.getElementById('modalLeadPhone').textContent = lead.phone || 'N/A';
    document.getElementById('modalLeadService').textContent = lead.service || 'General Inquiry';
    document.getElementById('modalLeadTimeline').textContent = lead.timeline || 'Immediate / Undisclosed';
    document.getElementById('modalLeadSource').textContent = lead.source || 'Website Form';
    document.getElementById('modalLeadDate').textContent = formatDateTime(lead.submittedAt);
    document.getElementById('modalLeadDetails').textContent = lead.details || 'No additional message details provided.';

    // Setup action buttons in modal
    const waNumber = getCleanPhoneForWhatsApp(lead.phone);
    const waText = encodeURIComponent(`Hello ${lead.fullName}, thank you for reaching out to Haash Corporation regarding your ${lead.service || 'project'} inquiry.`);
    const waBtn = document.getElementById('modalWhatsAppBtn');
    if (waBtn) {
      waBtn.href = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : 'https://wa.me/923423951603';
    }

    const emailBtn = document.getElementById('modalEmailBtn');
    if (emailBtn) {
      emailBtn.href = `mailto:${lead.email}?subject=${encodeURIComponent(`Haash Corporation — Follow-up: ${lead.service || 'Project Inquiry'}`)}`;
    }

    detailModal.classList.add('is-active');
  };

  if (closeDetailModalBtn) {
    closeDetailModalBtn.addEventListener('click', () => {
      detailModal.classList.remove('is-active');
    });
  }

  // ==========================================================================
  // 7. Manual Add Lead Modal
  // ==========================================================================
  if (addLeadBtn && addLeadModal) {
    addLeadBtn.addEventListener('click', () => {
      addLeadModal.classList.add('is-active');
    });
  }

  if (closeAddModalBtn && addLeadModal) {
    closeAddModalBtn.addEventListener('click', () => {
      addLeadModal.classList.remove('is-active');
    });
  }

  if (addLeadForm) {
    addLeadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addLeadForm);
      const payload = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        timeline: formData.get('timeline'),
        details: formData.get('details'),
        source: 'Manual Admin Entry',
        status: 'New'
      };

      try {
        let createdLead = null;
        if (window.HaashSupabase) {
          const res = await window.HaashSupabase.submitLead(payload);
          if (res && res.success) {
            createdLead = res.lead;
          }
        }

        try {
          const res = await fetch(`${API_BASE}/api/leads/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.lead) createdLead = data.lead;
          }
        } catch (e) {
          // Ignore server error on static hosts
        }

        if (createdLead) {
          showToast('Manual lead created successfully!');
          addLeadForm.reset();
          addLeadModal.classList.remove('is-active');
          allLeads.unshift(createdLead);
          updateStats();
          renderLeads();
        } else {
          throw new Error('Could not save lead');
        }
      } catch (err) {
        showToast(err.message || 'Error creating manual lead.');
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.remove('is-active');
    if (e.target === addLeadModal) addLeadModal.classList.remove('is-active');
  });

  // ==========================================================================
  // 8. Search & Filters
  // ==========================================================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderLeads();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentStatusFilter = e.target.value;
      renderLeads();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentServiceFilter = pill.getAttribute('data-filter') || 'all';
      renderLeads();
    });
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadLeads);
  }

  // ==========================================================================
  // 9. Export Features (CSV & JSON)
  // ==========================================================================
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (!allLeads || allLeads.length === 0) {
        showToast('No leads available to export.');
        return;
      }
      const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Company', 'Service', 'Timeline', 'Budget', 'Status', 'Source', 'Details'];
      const rows = allLeads.map(l => [
        `"${(l.id || '').replace(/"/g, '""')}"`,
        `"${(l.submittedAt || '').replace(/"/g, '""')}"`,
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.company || '').replace(/"/g, '""')}"`,
        `"${(l.service || '').replace(/"/g, '""')}"`,
        `"${(l.timeline || '').replace(/"/g, '""')}"`,
        `"${(l.budget || '').replace(/"/g, '""')}"`,
        `"${(l.status || 'New').replace(/"/g, '""')}"`,
        `"${(l.source || 'Website Form').replace(/"/g, '""')}"`,
        `"${(l.details || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
      ].join(','));
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(','), ...rows].join('\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", csvContent);
      downloadAnchor.setAttribute("download", `haash_leads_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported leads to CSV file.');
    });
  }

  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allLeads, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `haash_leads_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported leads to JSON file.');
    });
  }

  // Copy helpers
  const setupCopyBtn = (btnId, textElId, label) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const val = document.getElementById(textElId)?.textContent;
      if (val && val !== 'N/A') {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copied ${label} to clipboard!`);
        });
      }
    });
  };

  setupCopyBtn('copyModalEmailBtn', 'modalLeadEmail', 'Email');
  setupCopyBtn('copyModalPhoneBtn', 'modalLeadPhone', 'Phone');

  // ==========================================================================
  // Supabase Cloud Configuration Modal Handlers
  // ==========================================================================
  if (cloudConfigBtn && cloudModal) {
    cloudConfigBtn.addEventListener('click', () => {
      if (window.HaashSupabase) {
        const cfg = window.HaashSupabase.getConfig();
        if (sbProjectUrl) sbProjectUrl.value = cfg.url || '';
        if (sbAnonKey) sbAnonKey.value = cfg.anonKey || '';
      }
      cloudModal.classList.add('is-active');
    });
  }

  if (closeCloudModal && cloudModal) {
    closeCloudModal.addEventListener('click', () => {
      cloudModal.classList.remove('is-active');
    });
  }

  if (supabaseConfigForm) {
    supabaseConfigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = (sbProjectUrl ? sbProjectUrl.value : '').trim();
      const anonKey = (sbAnonKey ? sbAnonKey.value : '').trim();

      if (window.HaashSupabase) {
        window.HaashSupabase.setConfig(url, anonKey);
      }

      showToast('Supabase Cloud credentials updated! Syncing...');
      if (cloudModal) cloudModal.classList.remove('is-active');
      updateCloudStatusUI();
      await loadLeads();
    });
  }

  if (sbClearBtn) {
    sbClearBtn.addEventListener('click', async () => {
      if (confirm('Disconnect Supabase Cloud? Leads will be stored in offline local storage.')) {
        if (window.HaashSupabase) {
          window.HaashSupabase.setConfig('', '');
        }
        if (sbProjectUrl) sbProjectUrl.value = '';
        if (sbAnonKey) sbAnonKey.value = '';
        showToast('Supabase Cloud disconnected. Offline local mode active.');
        if (cloudModal) cloudModal.classList.remove('is-active');
        updateCloudStatusUI();
        await loadLeads();
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.remove('is-active');
    if (e.target === addLeadModal) addLeadModal.classList.remove('is-active');
    if (e.target === cloudModal) cloudModal.classList.remove('is-active');
  });

  // Auto-refresh every 45s
  setInterval(() => {
    if (sessionStorage.getItem('haash_admin_auth') === 'true') {
      loadLeads();
    }
  }, 45000);

  // Initialize
  checkAuth();
  updateCloudStatusUI();
});
