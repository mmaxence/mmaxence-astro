// Delightful Interactions - Minimal & Elegant
(function () {
  'use strict';

  function initAll() {
    initReadingProgress();
    initSmoothScrolling();
    initHoverEffects();
  }

  document.addEventListener('DOMContentLoaded', initAll);
  // Re-run after Astro View Transitions client-side navigations.
  document.addEventListener('astro:page-load', initAll);

  // Reading progress bar.
  // The element is re-created on every navigation (Astro swaps <body>), so we keep a
  // single scroll listener and look the element up by id on each call.
  function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const denom = scrollHeight - clientHeight;
    const scrollPercent = denom > 0 ? (scrollTop / denom) * 100 : 0;
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }

  function initReadingProgress() {
    if (!document.getElementById('reading-progress')) {
      const progressBar = document.createElement('div');
      progressBar.id = 'reading-progress';
      document.body.prepend(progressBar);
    }

    // Attach the scroll listener exactly once per session.
    if (!window.__readingProgressListenerAttached) {
      let ticking = false;
      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateReadingProgress();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
      window.__readingProgressListenerAttached = true;
    }

    updateReadingProgress(); // initial sync (and re-sync after navigation)
  }

  // Smooth scrolling for in-page anchor links.
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Hover feedback: lift book cards, grow <mark> highlights.
  function initHoverEffects() {
    document.querySelectorAll('.book-item').forEach((item) => {
      item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });
      item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    document.querySelectorAll('mark').forEach((mark) => {
      mark.addEventListener('mouseenter', function () {
        this.style.backgroundSize = '100% 100%';
      });
    });
  }

  // Utility: debounce.
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  window.addEventListener('resize', debounce(updateReadingProgress, 250));
})();
