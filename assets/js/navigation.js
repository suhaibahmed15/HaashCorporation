/**
 * Haash Corporation — Navigation & Services Mega-Dropdown Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Desktop Services Dropdown
  const dropdownWrapper = document.querySelector('.nav-dropdown-wrapper');
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const megaMenu = document.querySelector('.services-mega-menu');

  if (dropdownWrapper && dropdownTrigger && megaMenu) {
    let closeTimeout;

    // Open dropdown
    const openMenu = () => {
      clearTimeout(closeTimeout);
      dropdownWrapper.classList.add('open');
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    };

    // Close dropdown with small delay to avoid accidental flicker
    const closeMenu = () => {
      closeTimeout = setTimeout(() => {
        dropdownWrapper.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }, 150);
    };

    // Hover events for desktop
    dropdownWrapper.addEventListener('mouseenter', openMenu);
    dropdownWrapper.addEventListener('mouseleave', closeMenu);

    // Click toggle for touch/click support
    dropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdownWrapper.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        dropdownWrapper.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownWrapper.classList.contains('open')) {
        dropdownWrapper.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        dropdownTrigger.focus();
      }
    });
  }

  // 2. Mobile Hamburger Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');
  const mobileAccordionHeader = document.querySelector('.mobile-accordion-header');
  const mobileAccordionContent = document.querySelector('.mobile-accordion-content');

  const toggleDrawer = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('is-open');
    if (shouldOpen) {
      mobileDrawer.classList.add('is-open');
      mobileBackdrop.classList.add('is-open');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('is-open');
      mobileBackdrop.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileDrawer && mobileBackdrop) {
    mobileToggle.addEventListener('click', () => toggleDrawer());
    mobileBackdrop.addEventListener('click', () => toggleDrawer(false));

    // Close mobile drawer when an internal link is clicked
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleDrawer(false);
      });
    });

    // Mobile services submenu accordion
    if (mobileAccordionHeader && mobileAccordionContent) {
      mobileAccordionHeader.addEventListener('click', () => {
        const isOpen = mobileAccordionContent.classList.contains('is-open');
        mobileAccordionContent.classList.toggle('is-open', !isOpen);
        mobileAccordionHeader.querySelector('svg').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }
  }
});
