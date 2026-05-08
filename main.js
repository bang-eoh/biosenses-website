/* ============================================================
   BioSenses — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Sticky nav shadow on scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Mobile hamburger menu ── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Mobile dropdown toggle ── */
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    }
  });

  /* ── 4. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu
        if (navMenu) {
          navMenu.classList.remove('mobile-open');
          if (hamburger) hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ── 5. Form submission handler ── */
  function handleForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EF4444';
          field.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
        } else {
          field.style.boxShadow = '';
        }
      });

      if (!valid) {
        showToast('Vui lòng điền đầy đủ các trường bắt buộc.', 'error');
        return;
      }

      // Loading state
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Đang gửi…';
      btn.disabled = true;
      btn.style.opacity = '.7';

      // Simulate async submit
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
        form.reset();
        // Clear any red borders
        form.querySelectorAll('input, select, textarea').forEach((f) => {
          f.style.borderColor = '';
          f.style.boxShadow = '';
        });
        showToast('Cảm ơn! Chúng tôi sẽ liên hệ với bạn trong vòng 24h làm việc.', 'success');
      }, 1200);
    });
  }

  document.querySelectorAll('form').forEach(handleForm);

  /* ── 6. Toast notification ── */
  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    const iconSvg = type === 'success'
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

    const iconBg = type === 'success' ? '#22C55E' : '#EF4444';

    toast.innerHTML = `
      <div class="toast-icon" style="background:${iconBg};">${iconSvg}</div>
      <span>${message}</span>
    `;

    // Trigger show
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  /* ── 7. Tab interface ── */
  document.querySelectorAll('.tabs').forEach((tabs) => {
    const btns = tabs.querySelectorAll('.tab-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach((panel) => {
          panel.classList.toggle('active', panel.id === target);
        });
      });
    });
  });

  /* ── Policy sidebar tabs ── */
  function activatePolicyTab(id) {
    // Update nav buttons (old style)
    document.querySelectorAll('.policy-nav-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.policy === id);
      b.setAttribute('aria-selected', b.dataset.policy === id);
    });
    // Update sidebar buttons (new style)
    document.querySelectorAll('.policy-sidebar-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.policy === id);
    });
    // Show/hide policy content panels
    document.querySelectorAll('.policy-content').forEach((panel) => {
      panel.classList.toggle('active', panel.id === id);
    });
    // Show/hide corresponding TOC section
    document.querySelectorAll('[id^="toc-"]').forEach((toc) => {
      toc.style.display = (toc.id === 'toc-' + id) ? 'block' : 'none';
    });
  }

  document.querySelectorAll('.policy-nav-btn, .policy-sidebar-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activatePolicyTab(btn.dataset.policy);
      history.replaceState(null, '', '#' + btn.dataset.policy);
    });
  });

  // Activate tab from URL hash on page load
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('policy-content')) {
    activatePolicyTab(hash);
  } else {
    // Ensure default TOC is visible on policy page
    const defaultToc = document.getElementById('toc-policy-privacy');
    if (defaultToc) defaultToc.style.display = 'block';
  }

  /* ── Policy TOC scrollspy ── */
  (function initPolicyScrollspy() {
    const tocLinks = document.querySelectorAll('.policy-toc a');
    if (!tocLinks.length) return;

    function onPolicyScroll() {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
      let currentId = '';
      tocLinks.forEach((link) => {
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target && target.getBoundingClientRect().top <= navH + 80) {
          currentId = targetId;
        }
      });
      tocLinks.forEach((link) => {
        const targetId = link.getAttribute('href').slice(1);
        link.classList.toggle('active', targetId === currentId);
      });
    }

    window.addEventListener('scroll', onPolicyScroll, { passive: true });
    onPolicyScroll();
  })();

  /* ── 8. Intersection Observer — scroll animations ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
  }

  /* ── 9. ECG line animation ── */
  function initEcgAnimation() {
    const path = document.querySelector('.ecg-path');
    if (!path) return;

    const length = path.getTotalLength ? path.getTotalLength() : 600;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    let start = null;
    const duration = 2800;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      path.style.strokeDashoffset = length * (1 - eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Loop with delay
        setTimeout(() => {
          path.style.strokeDashoffset = length;
          start = null;
          requestAnimationFrame(animate);
        }, 1200);
      }
    }

    requestAnimationFrame(animate);
  }

  initEcgAnimation();

  /* ── 10. Count-up animation for stat numbers ── */
  (function initCountUp() {
    const statEls = document.querySelectorAll('.stat-num, .stats-bar-item .stat-num');
    if (!statEls.length || !('IntersectionObserver' in window)) return;

    function parseStatNum(el) {
      // Store original HTML once
      if (!el.dataset.originalHtml) {
        el.dataset.originalHtml = el.innerHTML;
      }
      const text = el.textContent.trim();
      // Extract leading number (int or float)
      const match = text.match(/^([\d,\.]+)/);
      if (!match) return null;
      const numStr = match[1].replace(/,/g, '');
      const num = parseFloat(numStr);
      if (isNaN(num)) return null;
      // Suffix is everything after the number
      const suffix = text.slice(match[0].length);
      // Check if there's a <span> child with accent color (like the "+" in about page)
      return { num, suffix, isFloat: numStr.includes('.') };
    }

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCountUp(el) {
      const parsed = parseStatNum(el);
      if (!parsed) return;

      const { num, isFloat } = parsed;
      const duration = 1500;
      let start = null;

      // Reconstruct the original structure after animation
      const originalHtml = el.dataset.originalHtml;

      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = num * eased;

        // Format number
        let displayNum;
        if (isFloat) {
          displayNum = current.toFixed(1);
        } else if (num >= 1000) {
          displayNum = Math.round(current).toLocaleString('en-US');
        } else {
          displayNum = Math.round(current).toString();
        }

        // Rebuild inner content preserving suffix/span
        // Simple approach: replace just the leading number text
        el.innerHTML = originalHtml.replace(/^([\d,\.]+)/, displayNum);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Restore original html exactly
          el.innerHTML = originalHtml;
        }
      }

      requestAnimationFrame(step);
    }

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach((el) => {
      // Only observe if it contains a parseable number
      if (parseStatNum(el)) {
        countObserver.observe(el);
      }
    });
  })();

  /* ── Active nav link detection ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });

})();
