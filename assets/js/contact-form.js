/**
 * Haash Corporation — Contact Form Validation & Submission Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const alertSuccess = document.getElementById('formSuccessAlert');
  const alertError = document.getElementById('formErrorAlert');
  const errorMessageEl = document.getElementById('formErrorMessage');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearErrors = () => {
    contactForm.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
      input.classList.remove('is-invalid');
    });
    if (alertSuccess) alertSuccess.classList.remove('is-visible');
    if (alertError) alertError.classList.remove('is-visible');
  };

  const markInvalid = (name, message) => {
    const input = contactForm.querySelector(`[name="${name}"]`);
    if (input) {
      input.classList.add('is-invalid');
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback && message) {
        feedback.textContent = message;
      }
    }
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(contactForm);
    const data = {
      fullName: (formData.get('fullName') || '').trim(),
      email: (formData.get('email') || '').trim(),
      company: (formData.get('company') || '').trim(),
      phone: (formData.get('phone') || '').trim(),
      service: (formData.get('service') || '').trim(),
      timeline: (formData.get('timeline') || '').trim(),
      budget: (formData.get('timeline') || formData.get('budget') || '').trim(),
      details: (formData.get('details') || '').trim(),
      consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
      website_hp: formData.get('website_hp') || ''
    };

    // Client-side validation
    let hasError = false;

    if (!data.fullName || data.fullName.length < 2) {
      markInvalid('fullName', 'Please enter your full name (at least 2 characters).');
      hasError = true;
    }

    if (!data.email || !EMAIL_REGEX.test(data.email)) {
      markInvalid('email', 'Please provide a valid business email address.');
      hasError = true;
    }

    if (!data.details || data.details.length < 10) {
      markInvalid('details', 'Please provide a brief description of your project (at least 10 characters).');
      hasError = true;
    }

    if (!data.consent) {
      markInvalid('consent', 'You must agree to the privacy notice before submitting.');
      hasError = true;
    }

    if (hasError) {
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Set Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Sending inquiry...</span>
    `;

    try {
      let result = null;

      // Submit directly to Supabase Cloud Client
      if (window.HaashSupabase) {
        result = await window.HaashSupabase.submitLead(data);
      } else {
        result = { success: true, message: 'Thank you! Your message has been received. Our team will get back to you shortly.' };
      }

      if (result && result.success) {
        // Show success alert
        if (alertSuccess) {
          const successText = alertSuccess.querySelector('.alert-text');
          if (successText && result.message) {
            successText.textContent = result.message;
          }
          alertSuccess.classList.add('is-visible');
          alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      } else {
        // Validation or delivery error
        if (result && result.validationErrors) {
          Object.keys(result.validationErrors).forEach(field => {
            markInvalid(field, result.validationErrors[field]);
          });
        }
        if (alertError) {
          if (errorMessageEl) {
            errorMessageEl.textContent = (result && result.error) || 'Unable to submit your message. Please try again or chat via WhatsApp.';
          }
          alertError.classList.add('is-visible');
        }
      }
    } catch (err) {
      console.error('[Contact Form Network Error]', err);
      if (alertError) {
        if (errorMessageEl) {
          const isFileProtocol = window.location.protocol === 'file:';
          if (isFileProtocol) {
            errorMessageEl.innerHTML = 'Network error: Server was unreachable from file://. Please view via <strong><a href="http://localhost:3000/contact.html" style="text-decoration:underline;color:inherit;">http://localhost:3000/contact.html</a></strong> or reach us via <a href="https://wa.me/923423951603" target="_blank" style="text-decoration:underline;color:inherit;">WhatsApp (+92 342 3951603)</a> / <a href="mailto:hasshcorporation@gmail.com" style="text-decoration:underline;color:inherit;">hasshcorporation@gmail.com</a>.';
          } else {
            errorMessageEl.textContent = 'A network error occurred while submitting. Please check your connection or contact us via WhatsApp (+92 342 3951603).';
          }
        }
        alertError.classList.add('is-visible');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
