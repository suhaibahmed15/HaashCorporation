/**
 * Haash Corporation — Production Contact Form API Handler
 * Compatible with Vercel Serverless Functions and Express.js
 */

const fs = require('fs');
const path = require('path');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleContactSubmission(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Please submit via POST.'
    });
  }

  try {
    const body = req.body || {};
    const fullName = (body.fullName || body.name || '').trim();
    const email = (body.email || '').trim();
    const company = (body.company || '').trim();
    const phone = (body.phone || '').trim();
    const service = (body.service || '').trim();
    const timeline = (body.timeline || body.budget || '').trim();
    const details = (body.details || body.message || '').trim();
    const consent = body.consent !== undefined ? body.consent : true;
    const website_hp = body.website_hp;

    // 1. Anti-spam honeypot verification
    if (website_hp) {
      console.warn('[Spam Detection] Honeypot triggered by submission.');
      return res.status(200).json({
        success: true,
        message: 'Your message has been received.'
      });
    }

    // 2. Server-side validation
    const errors = {};

    if (!fullName || fullName.length < 2) {
      errors.fullName = 'Full name is required (minimum 2 characters).';
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      errors.email = 'A valid business email address is required.';
    }

    if (!details || details.length < 5) {
      errors.details = 'Project details are required (minimum 5 characters).';
    }

    if (consent !== true && consent !== 'true' && consent !== 'on') {
      errors.consent = 'You must agree to the privacy policy to submit an inquiry.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed. Please correct the highlighted fields.',
        validationErrors: errors
      });
    }

    // 3. Sanitized payload
    const sanitizedData = {
      fullName: fullName.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 120),
      company: company.trim().slice(0, 100),
      phone: phone.trim().slice(0, 50),
      service: service.trim().slice(0, 80),
      timeline: timeline.trim().slice(0, 50),
      budget: timeline.trim().slice(0, 50),
      details: details.trim().slice(0, 3000),
      submittedAt: new Date().toISOString()
    };

    // Save inquiry locally to inquiries.json file
    try {
      const inquiriesPath = path.join(__dirname, '..', 'inquiries.json');
      let inquiriesList = [];
      if (fs.existsSync(inquiriesPath)) {
        try {
          inquiriesList = JSON.parse(fs.readFileSync(inquiriesPath, 'utf8') || '[]');
        } catch (readErr) {
          inquiriesList = [];
        }
      }
      inquiriesList.unshift(sanitizedData);
      fs.writeFileSync(inquiriesPath, JSON.stringify(inquiriesList, null, 2), 'utf8');
      console.log(`[Contact API] Inquiry from ${sanitizedData.fullName} (${sanitizedData.email}) saved to inquiries.json`);
    } catch (saveErr) {
      console.warn('[Contact API] Notice: Could not save to inquiries.json:', saveErr.message);
    }

    // 4. Secure email delivery
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'Suhaibahmed099@gmail.com';
    const senderEmail = process.env.CONTACT_SENDER_EMAIL || 'website@haashcorp.com';

    if (resendApiKey && resendApiKey !== 'your_resend_api_key_here') {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111111; line-height: 1.6; border: 1px solid #E8E8EC; border-radius: 8px;">
          <div style="border-bottom: 2px solid #5B5FF0; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #111111; margin: 0; font-size: 20px;">New Client Inquiry — Haash Corporation</h2>
            <p style="color: #686868; font-size: 13px; margin: 4px 0 0 0;">Received on ${new Date(sanitizedData.submittedAt).toUTCString()}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; width: 140px; color: #686868;">Full Name:</td>
              <td style="padding: 8px 0; font-weight: 500;">${sanitizedData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #686868;">Business Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${sanitizedData.email}" style="color: #5B5FF0;">${sanitizedData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #686868;">Company:</td>
              <td style="padding: 8px 0;">${sanitizedData.company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #686868;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0;">${sanitizedData.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #686868;">Service of Interest:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #5B5FF0;">${sanitizedData.service || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #686868;">Implementation Timeline:</td>
              <td style="padding: 8px 0;">${sanitizedData.timeline || 'Undisclosed'}</td>
            </tr>
          </table>
          <div style="background: #F5F6F8; padding: 16px; border-radius: 6px; margin-top: 16px;">
            <strong style="display: block; margin-bottom: 8px; color: #111111;">Project Details:</strong>
            <p style="margin: 0; white-space: pre-wrap; color: #333333;">${sanitizedData.details}</p>
          </div>
          <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #E8E8EC; font-size: 12px; color: #888888; text-align: center;">
            This email was sent from the official Haash Corporation contact form.
          </div>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: `Haash Corporation Web <${senderEmail}>`,
          to: [recipientEmail],
          reply_to: sanitizedData.email,
          subject: `[New Inquiry] ${sanitizedData.fullName} — ${sanitizedData.service || 'Haash Corporation'}`,
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Resend Error]', errorData);
        return res.status(502).json({
          success: false,
          error: 'Delivery provider error. Please reach out to us directly via WhatsApp or email.'
        });
      }

      const resendResult = await response.json();
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been delivered to our team. We will respond within 24 business hours.',
        id: resendResult.id
      });
    } else {
      // Development mode / unconfigured provider fallback
      console.log('--- [HAASH INQUIRY RECEIVED (DEV / DEMO MODE)] ---');
      console.log(JSON.stringify(sanitizedData, null, 2));
      console.log('--- (Configure RESEND_API_KEY in .env for live production delivery) ---');

      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
        devMode: true
      });
    }
  } catch (err) {
    console.error('[Contact API Internal Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing your request. Please try again or reach out on WhatsApp.'
    });
  }
}

module.exports = handleContactSubmission;
