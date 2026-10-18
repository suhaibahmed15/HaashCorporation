/**
 * Haash Corporation — Supabase Cloud Database Client
 * Lightweight, zero-dependency REST client for Supabase leads management.
 * Works seamlessly on Vercel Edge, static CDNs, and local development.
 */

(function () {
  const STORAGE_KEY_URL = 'haash_supabase_url';
  const STORAGE_KEY_KEY = 'haash_supabase_anon_key';
  const STORAGE_KEY_OFFLINE = 'haash_offline_leads';

  // Default / placeholder configuration
  // Users can configure this via the Admin Portal or in window.HAASH_SUPABASE_CONFIG
  const DEFAULT_CONFIG = (window.HAASH_SUPABASE_CONFIG && typeof window.HAASH_SUPABASE_CONFIG === 'object')
    ? window.HAASH_SUPABASE_CONFIG
    : {
        url: '',
        anonKey: ''
      };

  const getUrl = () => {
    return (localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_CONFIG.url || '').trim().replace(/\/$/, '');
  };

  const getAnonKey = () => {
    return (localStorage.getItem(STORAGE_KEY_KEY) || DEFAULT_CONFIG.anonKey || '').trim();
  };

  const isConfigured = () => {
    const url = getUrl();
    const key = getAnonKey();
    return Boolean(url && key && url.includes('supabase.co'));
  };

  const setConfig = (url, anonKey) => {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim().replace(/\/$/, ''));
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
  };

  const getOfflineLeads = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_OFFLINE) || '[]');
    } catch (e) {
      return [];
    }
  };

  const saveOfflineLead = (lead) => {
    const leads = getOfflineLeads();
    leads.unshift(lead);
    localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(leads));
  };

  /**
   * Submit a new lead to Supabase
   */
  const submitLead = async (leadData) => {
    const normalizedLead = {
      full_name: (leadData.fullName || leadData.name || '').trim(),
      email: (leadData.email || '').trim().toLowerCase(),
      phone: (leadData.phone || '').trim(),
      company: (leadData.company || '').trim(),
      service: (leadData.service || 'General Inquiry').trim(),
      timeline: (leadData.timeline || leadData.budget || '').trim(),
      budget: (leadData.budget || leadData.timeline || '').trim(),
      details: (leadData.details || leadData.message || '').trim(),
      source: (leadData.source || 'Website Form').trim(),
      status: 'New'
    };

    if (isConfigured()) {
      const url = getUrl();
      const anonKey = getAnonKey();

      try {
        const response = await fetch(`${url}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(normalizedLead)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Supabase error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        return {
          success: true,
          cloudSync: true,
          provider: 'supabase',
          lead: data[0] || normalizedLead,
          message: 'Thank you! Your inquiry has been securely delivered to Haash Corporation.'
        };
      } catch (err) {
        console.warn('[Supabase Submit Warning, saving to offline backup]:', err);
        // Fallback to offline store
        normalizedLead.id = `offline_${Date.now()}`;
        normalizedLead.created_at = new Date().toISOString();
        saveOfflineLead(normalizedLead);
        return {
          success: true,
          cloudSync: false,
          offlineSaved: true,
          lead: normalizedLead,
          message: 'Your inquiry has been received! We will follow up shortly.'
        };
      }
    } else {
      // Supabase credentials not set yet — save locally so lead is never lost
      normalizedLead.id = `local_${Date.now()}`;
      normalizedLead.created_at = new Date().toISOString();
      saveOfflineLead(normalizedLead);

      return {
        success: true,
        cloudSync: false,
        lead: normalizedLead,
        message: 'Thank you! Your message has been received. Our team will contact you shortly.'
      };
    }
  };

  /**
   * Fetch all leads from Supabase (or offline fallback)
   */
  const fetchLeads = async () => {
    let cloudLeads = [];
    const offlineLeads = getOfflineLeads();

    if (isConfigured()) {
      const url = getUrl();
      const anonKey = getAnonKey();

      try {
        const response = await fetch(`${url}/rest/v1/leads?select=*&order=created_at.desc`, {
          method: 'GET',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          cloudLeads = (data || []).map(item => ({
            id: item.id,
            fullName: item.full_name,
            email: item.email,
            phone: item.phone,
            company: item.company,
            service: item.service,
            timeline: item.timeline,
            budget: item.budget,
            details: item.details,
            source: item.source || 'Website Form',
            status: item.status || 'New',
            submittedAt: item.created_at
          }));
        }
      } catch (err) {
        console.warn('[Supabase Fetch Error]:', err);
      }
    }

    // Combine cloud and local offline leads
    const combined = [...cloudLeads];
    offlineLeads.forEach(off => {
      if (!combined.some(c => c.email === off.email && Math.abs(new Date(c.submittedAt || 0) - new Date(off.created_at || 0)) < 60000)) {
        combined.push({
          id: off.id,
          fullName: off.full_name,
          email: off.email,
          phone: off.phone,
          company: off.company,
          service: off.service,
          timeline: off.timeline,
          budget: off.budget,
          details: off.details,
          source: off.source || 'Offline Backup',
          status: off.status || 'New',
          submittedAt: off.created_at
        });
      }
    });

    return combined;
  };

  /**
   * Update lead status in Supabase
   */
  const updateStatus = async (id, newStatus) => {
    if (isConfigured() && !String(id).startsWith('local_') && !String(id).startsWith('offline_')) {
      const url = getUrl();
      const anonKey = getAnonKey();

      try {
        const res = await fetch(`${url}/rest/v1/leads?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
        return res.ok;
      } catch (e) {
        console.error(e);
      }
    }

    // Also update offline cache if present
    const offline = getOfflineLeads();
    const item = offline.find(l => l.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(offline));
    }
    return true;
  };

  /**
   * Delete lead from Supabase
   */
  const deleteLead = async (id) => {
    if (isConfigured() && !String(id).startsWith('local_') && !String(id).startsWith('offline_')) {
      const url = getUrl();
      const anonKey = getAnonKey();

      try {
        const res = await fetch(`${url}/rest/v1/leads?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        });
        return res.ok;
      } catch (e) {
        console.error(e);
      }
    }

    // Remove from offline cache
    const offline = getOfflineLeads().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(offline));
    return true;
  };

  // Export to global scope
  window.HaashSupabase = {
    isConfigured,
    getConfig: () => ({ url: getUrl(), anonKey: getAnonKey() }),
    setConfig,
    submitLead,
    fetchLeads,
    updateStatus,
    deleteLead
  };
})();
