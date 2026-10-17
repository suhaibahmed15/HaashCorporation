/**
 * Haash Corporation — Advanced 3D Interactive Canvas & Motion System
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Quantum Gyro-Core & Multi-Ring 3D Orbital Accelerator (Hero Canvas)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationFrameId;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // 3D camera & mouse parallax
    const fov = 340;
    let targetRotY = 0;
    let targetRotX = 0;
    let rotY = 0;
    let rotX = 0;
    let baseSpin = 0;

    // 3D Particles
    const particleCount = 54;
    const particles = [];
    const maxConnectionDist = 110;

    for (let i = 0; i < particleCount; i++) {
      const radius = 60 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particles.push({
        x: radius * Math.cos(phi) * Math.cos(theta),
        y: radius * Math.sin(phi),
        z: radius * Math.cos(phi) * Math.sin(theta),
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        theta,
        phi,
        radius,
        size: Math.random() * 2 + 1.5,
        color: i % 3 === 0 ? '#C084FC' : (i % 3 === 1 ? '#EC4899' : '#8B5CF6')
      });
    }

    // 3D Orbital Rings Configuration (Cosmic Metaverse Signature)
    const rings = [
      { radius: 100, tiltX: 0.8, tiltZ: 0.3, speed: 0.015, color: 'rgba(168, 85, 247, 0.55)', dots: 24 },
      { radius: 140, tiltX: -0.6, tiltZ: -0.5, speed: -0.01, color: 'rgba(236, 72, 153, 0.45)', dots: 32 },
      { radius: 175, tiltX: 0.4, tiltZ: 0.9, speed: 0.008, color: 'rgba(0, 242, 254, 0.4)', dots: 40 }
    ];

    const project3D = (x, y, z, rX, rY) => {
      // Rotate Y
      const cosY = Math.cos(rY);
      const sinY = Math.sin(rY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(rX);
      const sinX = Math.sin(rX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = fov / (fov + z2 + 240);
      return {
        x: (x1 * scale) + (width / 2),
        y: (y2 * scale) + (height / 2),
        scale,
        z: z2
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      rotY += (targetRotY - rotY) * 0.06;
      rotX += (targetRotX - rotX) * 0.06;
      baseSpin += 0.006;

      const currentRotY = rotY + baseSpin;
      const currentRotX = rotX;

      // Central Cosmic Singularity Glow
      const centerProj = project3D(0, 0, 0, currentRotX, currentRotY);
      const coreGlow = ctx.createRadialGradient(
        centerProj.x, centerProj.y, 4,
        centerProj.x, centerProj.y, 110 * centerProj.scale
      );
      coreGlow.addColorStop(0, 'rgba(236, 72, 153, 0.65)');
      coreGlow.addColorStop(0.35, 'rgba(168, 85, 247, 0.35)');
      coreGlow.addColorStop(0.7, 'rgba(124, 58, 237, 0.12)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 110 * centerProj.scale, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D Orbital Rings
      rings.forEach(ring => {
        ctx.beginPath();
        let first = true;
        const segments = 48;
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2 + (baseSpin * ring.speed * 80);
          const rx = ring.radius * Math.cos(angle);
          const rz = ring.radius * Math.sin(angle);
          const ry = rx * Math.sin(ring.tiltX) + rz * Math.cos(ring.tiltZ) * 0.3;

          const p = project3D(rx, ry, rz, currentRotX, currentRotY);
          if (first) {
            ctx.moveTo(p.x, p.y);
            first = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Update & project particles
      const projected = [];
      particles.forEach(p => {
        p.theta += p.speed;
        p.x = p.radius * Math.cos(p.phi) * Math.cos(p.theta);
        p.z = p.radius * Math.cos(p.phi) * Math.sin(p.theta);
        p.y = p.radius * Math.sin(p.phi) + Math.sin(p.theta * 2) * 12;

        const proj = project3D(p.x, p.y, p.z, currentRotX, currentRotY);
        proj.color = p.color;
        proj.size = p.size;
        projected.push(proj);
      });

      // Draw particle connection laser filaments
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const alpha = (1 - (dist / maxConnectionDist)) * 0.28 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = Math.min(p1.scale, p2.scale) * 1.1;
            ctx.stroke();
          }
        }
      }

      // Draw cosmic nodes with neon bloom
      projected.forEach(p => {
        const r = Math.max(1, p.size * p.scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Neon bloom aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#EC4899' ? 'rgba(236, 72, 153, 0.22)' : 'rgba(168, 85, 247, 0.18)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', resize);

    const heroWrapper = canvas.closest('.hero-visual-wrapper') || canvas.parentElement;
    if (heroWrapper) {
      heroWrapper.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left - (width / 2);
        const my = e.clientY - rect.top - (height / 2);
        targetRotY = (mx / width) * 0.55;
        targetRotX = -(my / height) * 0.55;
      });

      heroWrapper.addEventListener('mouseleave', () => {
        targetRotY = 0;
        targetRotX = 0;
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. GSAP & ScrollTrigger Staggered Reveals
  // --------------------------------------------------------------------------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero content stagger
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.from(heroContent.querySelectorAll('.eyebrow-badge, .hero-title, .section-subtitle, .hero-actions'), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out'
      });
    }

    // Service cards scroll reveal
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
      gsap.from(serviceCards, {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: 'power2.out'
      });
    }

    // Process steps scroll reveal
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length > 0 && typeof ScrollTrigger !== 'undefined') {
      gsap.from(processSteps, {
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Reading Progress Bar
  // --------------------------------------------------------------------------
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);
  }

  const updateScrollProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // --------------------------------------------------------------------------
  // 4. Floating Ambient Aurora Mesh
  // --------------------------------------------------------------------------
  if (!document.querySelector('.aurora-mesh')) {
    const aurora = document.createElement('div');
    aurora.className = 'aurora-mesh';
    aurora.setAttribute('aria-hidden', 'true');
    aurora.innerHTML = `
      <div class="aurora-orb aurora-orb-1"></div>
      <div class="aurora-orb aurora-orb-2"></div>
      <div class="aurora-orb aurora-orb-3"></div>
      <div class="cosmic-nebula-vortex"></div>
    `;
    document.body.prepend(aurora);
  }

  // --------------------------------------------------------------------------
  // 5. Interactive 3D Perspective Card Tilt
  // --------------------------------------------------------------------------
  if (!prefersReduced && window.innerWidth > 768) {
    const tiltTargets = document.querySelectorAll('.bento-card, .service-card, .why-card, .pillar-card, .hero-visual-card');
    tiltTargets.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -5.5;
        const rotY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Number Counter Roll-Up (Intersection Observer)
  // --------------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const counterElements = document.querySelectorAll('.bento-vital-val, .hud-val, .roi-stat-val');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.textContent.trim();
          const matchNum = originalText.match(/[\d.]+/);
          if (matchNum) {
            const targetNum = parseFloat(matchNum[0]);
            const prefix = originalText.slice(0, matchNum.index);
            const suffix = originalText.slice(matchNum.index + matchNum[0].length);
            const isFloat = matchNum[0].includes('.');
            const decimals = isFloat ? matchNum[0].split('.')[1].length : 0;
            const duration = 1200;
            const startTime = performance.now();

            const animateCounter = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(1, elapsed / duration);
              // Ease-out cubic curve
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = (targetNum * easeProgress).toFixed(decimals);
              el.textContent = `${prefix}${currentVal}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(animateCounter);
              } else {
                el.textContent = originalText;
              }
            };
            requestAnimationFrame(animateCounter);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }
});
