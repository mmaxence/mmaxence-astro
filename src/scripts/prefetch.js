// Pre-fetch links on hover for faster navigation
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const prefetchLinks = document.querySelectorAll('.prefetch-link[data-prefetch="true"]');
    const prefetchedUrls = new Set();

    prefetchLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const url = link.href || link.getAttribute('href');
        
        if (url && !prefetchedUrls.has(url)) {
          // Use link prefetch for better performance
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = url;
          prefetchLink.as = 'document';
          document.head.appendChild(prefetchLink);
          
          prefetchedUrls.add(url);
        }
      }, { once: true });
    });
  });
})();

