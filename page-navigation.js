(function () {
  'use strict';
  if (window.__muchuNavigationReady || !/^https?:$/.test(location.protocol)) return;
  window.__muchuNavigationReady = true;
  const directory = new URL('.', location.href);
  const files = new Set(['index.html', 'tos.html', 'tutorial1.html', 'tutorial2.html',
    'tutorial3.html', 'rules1.html', 'rules2.html', 'start.html', 'choice1.html',
    'choice2_red.html', 'choice2_blue.html', 'choice2_green.html', 'choice2_yellow.html',
    'decision.html', 'explanation.html', 'last.html']);
  const cache = new Map();
  let sequence = 0;
  const styleEnd = document.createComment('page style insertion point');
  document.head.appendChild(styleEnd);

  function supportedScript(script, url) {
    if (script.hasAttribute('src')) {
      const src = new URL(script.getAttribute('src'), url);
      return src.origin === location.origin && new URL('.', src).pathname === directory.pathname &&
        ['mobile-layout.js', 'page-initializers.js', 'page-navigation.js'].includes(src.pathname.split('/').pop());
    }
    // Live Server's existing WebSocket stays alive; never start it again on swaps.
    let marker = script.previousSibling;
    while (marker?.nodeType === 3 && !marker.textContent.trim()) marker = marker.previousSibling;
    return marker?.nodeType === 8 && marker.textContent.trim() === 'Code injected by live-server';
  }

  function internalURL(anchor) {
    if (!anchor || anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('data-full-navigation')) return null;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || url.hash ||
        url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1) !== directory.pathname ||
        !files.has(url.pathname.split('/').pop())) return null;
    return url;
  }

  function loadPage(url) {
    // Query parameters are read by the page initializer, never cached as state.
    const key = url.pathname;
    if (!cache.has(key)) {
      const request = fetch(url.href, { credentials: 'same-origin' }).then(async response => {
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html') ||
            new URL(response.url).origin !== location.origin || new URL(response.url).pathname !== url.pathname) {
          throw new Error('Page unavailable');
        }
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (!doc.querySelector('main, .page, .stage') || [...doc.scripts].some(script => !supportedScript(script, url))) {
          throw new Error('Page requires full navigation');
        }
        return doc;
      }).catch(error => { cache.delete(key); throw error; });
      cache.set(key, request);
    }
    return cache.get(key);
  }

  function imageReady(src, url) {
    const image = new Image();
    image.src = new URL(src, url).href;
    return image.decode().catch(() => {});
  }

  async function prepare(doc, url) {
    const pending = [];
    const styles = [...doc.head.querySelectorAll('style, link[rel="stylesheet"]')]
      .filter(node => node.tagName === 'STYLE' || new URL(node.getAttribute('href'), url).origin === location.origin)
      .map(node => {
        if (node.tagName === 'STYLE') return document.importNode(node, true);
        const href = new URL(node.getAttribute('href'), url).href;
        const current = [...document.head.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === href && !link.hasAttribute('data-navigation-pending'));
        if (current) return current;
        const link = document.importNode(node, true);
        link.href = href;
        link.media = 'not all';
        link.setAttribute('data-navigation-pending', '');
        const ready = new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = () => reject(new Error('Stylesheet unavailable'));
        });
        pending.push(ready);
        document.head.appendChild(link);
        return link;
      });
    const images = [...doc.querySelectorAll('img[src]')].map(image => image.getAttribute('src'));
    if (doc.querySelector('.stage')) images.push('img/map.png', 'img/grass.png', 'img/background_grass.png');
    pending.push(...images.map(src => imageReady(src, url)));
    let timer;
    try {
      await Promise.race([Promise.all(pending), new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Page preparation timed out')), 8000);
      })]);
      return styles;
    } catch (error) {
      styles.filter(node => node.hasAttribute('data-navigation-pending')).forEach(node => node.remove());
      throw error;
    } finally { clearTimeout(timer); }
  }

  async function navigate(url, push) {
    const id = ++sequence;
    let styles;
    try {
      const doc = await loadPage(url);
      if (id !== sequence) return;
      styles = await prepare(doc, url);
      if (id !== sequence) {
        styles.filter(node => node.hasAttribute('data-navigation-pending')).forEach(node => node.remove());
        return;
      }
      const body = document.importNode(doc.body, true);
      body.querySelectorAll('script').forEach(script => script.remove());
      if (push) history.pushState(null, '', url.href);
      document.head.querySelectorAll('style[data-page-style], link[data-page-style]').forEach(node => {
        if (!styles.includes(node)) node.remove();
      });
      styles.forEach((node, index) => {
        node.setAttribute('data-page-style', '');
        if (node.tagName === 'LINK') {
          // Moving an active stylesheet briefly detaches its rules in Chromium.
          // Keep it connected and insert page styles before it instead.
          if (node.hasAttribute('data-navigation-pending')) {
            node.removeAttribute('data-navigation-pending');
            node.media = 'all';
          }
        } else {
          const following = styles.slice(index + 1).find(style => style.isConnected);
          document.head.insertBefore(node, following || styleEnd);
        }
      });
      document.body.replaceWith(body);
      document.title = doc.title;
      window.MuchuPages.initialize();
      window.MuchuLayout.refresh();
      window.scrollTo(0, 0);
      const focus = document.querySelector('main, .page, .stage');
      if (focus) { focus.setAttribute('tabindex', '-1'); focus.focus({ preventScroll: true }); }
      document.dispatchEvent(new CustomEvent('muchu:pagechange'));
    } catch (error) {
      // Preserve normal navigation when fetching or page preparation is unavailable.
      if (id === sequence) location.assign(url.href);
    }
  }

  document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
    if (node.tagName === 'STYLE' || new URL(node.href).origin === location.origin) node.setAttribute('data-page-style', '');
  });
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href]');
    const url = internalURL(anchor);
    if (!url) return;
    event.preventDefault();
    navigate(url, true);
  });
  function prefetch(event) {
    const url = internalURL(event.target.closest?.('a[href]'));
    if (url) loadPage(url).catch(() => {});
  }
  document.addEventListener('pointerover', prefetch);
  document.addEventListener('focusin', prefetch);
  document.addEventListener('touchstart', prefetch, { passive: true });
  window.addEventListener('popstate', () => navigate(new URL(location.href), false));
})();
