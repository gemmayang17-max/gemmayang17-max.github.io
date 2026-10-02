/* Shared site behaviour for every project page.
   1. Centre the 1440px Figma canvas; use identical geometry and half the former outer gutters.
   2. The site header is lifted out of the scaled canvas and pinned to the top of the window.
   3. Nav / ALL WORK / NEXT PROJECT links wired to the real page folders.
   Edit this one file and all pages follow. */
(function () {
  var BASE = 1440;
  var MOBILE_QUERY = window.matchMedia ? window.matchMedia('(max-width: 767px)') : { matches: false, addEventListener: function () {} };
  var htmlRoot = document.documentElement;
  function isMobileLayout() { return !!MOBILE_QUERY.matches; }
  function setPageClass() {
    var path = decodeURIComponent(location.pathname).toLowerCase();
    htmlRoot.classList.toggle('portfolio-mobile-page-home', /\/home\//.test(path));
    htmlRoot.classList.toggle('portfolio-mobile-page-about', /\/about\//.test(path));
    htmlRoot.classList.toggle('portfolio-mobile-page-work', /\/work-index\//.test(path));
    var isArchive = /\/(?:archive|archive-gateway|illustration)\//.test(path);
    htmlRoot.classList.toggle('portfolio-mobile-page-archive', isArchive);
    htmlRoot.classList.toggle('portfolio-mobile-page-project', !(/\/home\//.test(path) || /\/about\//.test(path) || /\/work-index\//.test(path) || isArchive));
    htmlRoot.classList.toggle('portfolio-mobile-page-able', /\/project — able australia\/(?:index3\.html)?$/.test(path));
    htmlRoot.classList.toggle('portfolio-mobile-page-scaled-project', /\/project — (?:custom typeface & editorial series|onemorecase|gege pancake shop|sydney candle co|colour u)\/(?:index\.html)?$/.test(path));
    htmlRoot.classList.toggle('portfolio-mobile-page-beerfest', /\/project — beerfest australia\/(?:index\.html)?$/.test(path));
    htmlRoot.classList.toggle('portfolio-mobile-page-sydney-open', /\/project — sydney open 2021\/(?:index\.html)?$/.test(path));
  }
  setPageClass();
  function syncMobileClass() { htmlRoot.classList.toggle('portfolio-mobile', isMobileLayout()); }
  syncMobileClass();
  var SITE_SCRIPT_URL = document.currentScript && document.currentScript.src;
  if (SITE_SCRIPT_URL) {
    var mobileCss = document.createElement('link');
    mobileCss.rel = 'stylesheet';
    mobileCss.href = new URL('mobile-responsive.css?v=archive-20260930-1', SITE_SCRIPT_URL).href;
    document.head.appendChild(mobileCss);
  }
  var badgeStyle = document.createElement('style');
  badgeStyle.textContent = '#nl-badge-frame{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
  document.head.appendChild(badgeStyle);
  var PAGES = {
    'SYDNEY OPEN 2021': 'Project — Sydney Open 2021',
    'DOMAYNE DIGITAL CAMPAIGNS': 'Project — Domayne Digital Campaigns',
    'DOMAYNE FATHER’S DAY': 'Project — Domayne Father’s Day',
    "DOMAYNE FATHER'S DAY": 'Project — Domayne Father’s Day',
    'ONEMORECASE': 'Project — onemorecase',
    'BEERFEST AUSTRALIA': 'Project — Beerfest Australia',
    'SYDNEY CANDLE CO': 'Project — Sydney Candle Co',
    'COLOUR U': 'Project — Colour U',
    'ABLE AUSTRALIA': 'Project — Able Australia',
    'CUSTOM TYPEFACE & EDITORIAL SERIES': 'Project — Custom Typeface & Editorial Series',
    'GEGE PANCAKE SHOP': 'Project — GeGe Pancake Shop'
  };
  /* Able intentionally uses index3.html: it is the approved 1440px-width version. */
  var FILES = { 'ABLE AUSTRALIA': 'index3.html' };
  var HOME = '../home/index.html';
  var WORK = '../work-index/index.html';
  var ABOUT = '../about/index.html';
  var ARCHIVE = '../archive-gateway/index.html';
  function projectHref(name) {
    var key = name.trim().toUpperCase();
    var f = PAGES[key];
    return f ? '../' + encodeURIComponent(f).replace(/%2F/g, '/') + '/' + (FILES[key] || 'index.html') : null;
  }

  /* ---------- 1. find the canvas ---------- */
  var stage = document.getElementById('stage'),
      wrap  = document.getElementById('viewport'),
      root, H;
  if (stage && wrap) { root = stage; }
  else {
    for (var i = 0; i < document.body.children.length; i++) {
      if (document.body.children[i].tagName === 'DIV') { root = document.body.children[i]; break; }
    }
    if (!root) return;
    H = parseFloat(getComputedStyle(root).height) || root.offsetHeight;
    wrap = document.createElement('div');
    wrap.id = 'viewport';
    wrap.style.cssText = 'position:relative;width:100%;overflow:hidden';
    document.body.insertBefore(wrap, root);
    wrap.appendChild(root);
    document.body.style.display = 'block';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }
  H = H || parseFloat(getComputedStyle(root).height) || root.offsetHeight;
  var fitScreen = root.hasAttribute('data-fit-screen') && !root.hasAttribute('data-scroll-page');
  var fitFirstScreenHeight = parseFloat(root.getAttribute('data-fit-first-screen')) || 0;
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
  if (fitScreen) {
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowY = 'hidden';
  }
  root.style.transformOrigin = 'top left';
  root.style.margin = '0';

  /* ---------- 2. pin the header ---------- */
  var header = document.getElementById('siteheader');
  if (!header) {
    var kids = root.children;
    for (var j = 0; j < kids.length; j++) {
      var k = kids[j], cs = getComputedStyle(k);
      if (k.tagName === 'DIV' && cs.position === 'absolute' &&
          Math.round(parseFloat(cs.height)) === 80 && Math.round(parseFloat(cs.top)) === 0 &&
          Math.round(parseFloat(cs.width)) === BASE) { header = k; break; }
    }
  }
  if (header) {
    if (!header.id) header.id = 'siteheader';
    var bg = getComputedStyle(header).backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      bg = getComputedStyle(document.body).backgroundColor || '#f4f1e9';
    }
    document.body.appendChild(header);
    var aboutNav = Array.prototype.find.call(header.children, function (child) {
      return (child.textContent || '').trim().toUpperCase() === 'ABOUT';
    });
    if (aboutNav && !Array.prototype.some.call(header.children, function (child) {
      return (child.textContent || '').trim().toUpperCase() === 'ARCHIVE';
    })) {
      var archiveNav = document.createElement('a');
      archiveNav.textContent = 'ARCHIVE';
      archiveNav.href = ARCHIVE;
      archiveNav.className = aboutNav.className.replace(/\bon\b/g, '').trim();
      archiveNav.style.cssText = aboutNav.style.cssText;
      archiveNav.style.color = '#11110f';
      archiveNav.style.textAlign = 'left';
      archiveNav.style.position = 'absolute';
      archiveNav.style.width = '70px';
      archiveNav.setAttribute('data-mobile-nav', 'archive');
      aboutNav.insertAdjacentElement('afterend', archiveNav);
    }
    /* half-height bar: keep every child vertically centred in the new 40px strip */
    var HBAR = 40, rule = null;
    var kidsH = [];
    for (var q = 0; q < header.children.length; q++) {
      kidsH.push(header.children[q].getBoundingClientRect().height);
    }
    for (var q2 = 0; q2 < header.children.length; q2++) {
      var kid = header.children[q2], kh = kidsH[q2];
      if (kh <= 2) { rule = kid; continue; }
      kid.style.top = ((HBAR - kh) / 2).toFixed(1) + 'px';
      kid.style.fontSize = '9.6px';
    }
    var emailLink = header.querySelector('a[href^="mailto:"]');
    if (!emailLink) {
      for (var qe = 0; qe < header.children.length; qe++) {
        if ((header.children[qe].textContent || '').trim().toUpperCase() === 'GEMMAYANG22@GMAIL.COM') {
          emailLink = header.children[qe];
          break;
        }
      }
    }
    /* Keep the navigation geometry identical on every page.  The home page
       deliberately omits the redundant home link, so WORK and ABOUT occupy
       the first two canonical positions there. */
    var nav = {};
    for (var qn = 0; qn < header.children.length; qn++) {
      var navText = (header.children[qn].textContent || '').trim().toUpperCase();
      if (navText) nav[navText] = header.children[qn];
    }
    if (nav['GEMMA YANG']) nav['GEMMA YANG'].setAttribute('data-mobile-nav', 'home');
    if (nav.WORK) nav.WORK.setAttribute('data-mobile-nav', 'work');
    if (nav.ABOUT) nav.ABOUT.setAttribute('data-mobile-nav', 'about');
    if (nav.ARCHIVE) nav.ARCHIVE.setAttribute('data-mobile-nav', 'archive');
    if (emailLink) emailLink.setAttribute('data-mobile-nav', 'email');
    var isHome = /\/home\/(?:index\.html)?$/i.test(decodeURIComponent(location.pathname));
    function placeNav(el, left, width) {
      if (!el) return;
      el.style.left = left + 'px';
      el.style.width = width + 'px';
    }
    if (isHome) {
      if (nav['GEMMA YANG']) nav['GEMMA YANG'].style.display = 'none';
      placeNav(nav.WORK, 32, 60);
      placeNav(nav.ABOUT, 118, 70);
      placeNav(nav.ARCHIVE, 204, 70);
    } else {
      placeNav(nav['GEMMA YANG'], 32, 160);
      placeNav(nav.WORK, 151, 60);
      placeNav(nav.ABOUT, 233, 70);
      placeNav(nav.ARCHIVE, 319, 70);
    }
    placeNav(emailLink, 1164, 244);
    if (emailLink) emailLink.style.textAlign = 'right';
    /* one hairline, sitting on the bottom edge of the bar */
    var ruleBg = rule ? getComputedStyle(rule).backgroundColor : '';
    if (!ruleBg || ruleBg === 'transparent' || ruleBg === 'rgba(0, 0, 0, 0)') ruleBg = '#b8b4aa';
    if (!rule) { rule = document.createElement('div'); header.appendChild(rule); }
    rule.className = 'site-header-rule';
    rule.setAttribute('aria-hidden', 'true');
    rule.style.cssText = 'position:absolute;left:0;top:' + (HBAR - 1) + 'px;width:' + BASE +
      'px;height:1px;display:block;visibility:visible;opacity:1;z-index:1;pointer-events:none;background:' + ruleBg;
    header.style.cssText = 'position:fixed;left:0;top:0;width:' + BASE + 'px;height:' + HBAR + 'px;' +
      'background:' + bg + ';transform-origin:top left;z-index:1000;margin:0;overflow:hidden';
  }

  var originalProjectOrder = [];
  var mobileWrapped = [];

  /* ---------- 3. scale ---------- */
  function fit() {
    syncMobileClass();
    if (isMobileLayout()) {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      restoreDesktopProjectLayout();
      if (root.hasAttribute('data-figma-artboard') && root.dataset.mobileLayout !== 'scaled-project') {
        var mobileArtScale = Math.max(0.1, wrap.clientWidth / BASE);
        root.style.margin = '0';
        root.style.left = '0px';
        root.style.transform = 'scale(' + mobileArtScale + ')';
        wrap.style.height = (H * mobileArtScale) + 'px';
        if (header) header.style.transform = 'scale(' + mobileArtScale + ')';
        return;
      }
      root.style.margin = '0';
      root.style.left = '0px';
      root.style.transform = 'none';
      wrap.style.height = 'auto';
      if (header) header.style.transform = 'none';
      prepareMobileProjectLayout();
      return;
    }
    restoreDesktopProjectLayout();
    var geometry = window.portfolioCanvasLayout(wrap.clientWidth, window.innerHeight);
    var s = geometry.scale;
    var left = geometry.left;
    if (fitScreen) {
      s = Math.min(s, Math.max(0.1, (window.innerHeight - 1) / H));
      left = Math.max(0, (wrap.clientWidth - BASE * s) / 2);
    } else if (fitFirstScreenHeight) {
      s = Math.min(s, Math.max(0.1, (window.innerHeight - 1) / fitFirstScreenHeight));
      left = Math.max(0, (wrap.clientWidth - BASE * s) / 2);
    }
    root.style.margin = '0';
    root.style.left = left + 'px';
    root.style.transform = 'scale(' + s + ')';
    root.style.setProperty('--canvas-viewport-width', (wrap.clientWidth / s) + 'px');
    wrap.style.height = (fitScreen ? Math.min(window.innerHeight - 1, H * s) : H * s) + 'px';
    root.querySelectorAll('[data-fullbleed]').forEach(function (el) {
      if (!el.__bleed) { el.__bleed = document.createElement('div'); el.__bleed.setAttribute('aria-hidden','true'); wrap.insertBefore(el.__bleed,root); }
      if (getComputedStyle(el).display === 'none') { el.__bleed.style.display = 'none'; return; }
      var bt = Math.round(parseFloat(el.style.top) * s), bh = Math.round(parseFloat(el.style.height) * s);
      var isRule = el.hasAttribute('data-fullbleed-rule');
      var isExact = el.hasAttribute('data-fullbleed-exact');
      var bleedTop = isRule ? bt : (isExact ? bt : bt - 1);
      var bleedHeight = isRule ? Math.max(1, Math.round(s)) : (isExact ? bh : bh + 2);
      el.__bleed.style.cssText = 'position:absolute;left:0;width:100%;pointer-events:none;background:' +
        el.dataset.fullbleed + ';top:' + bleedTop + 'px;height:' + bleedHeight + 'px';
    });
    if (header) { var hs = wrap.clientWidth / BASE; header.style.transform = 'scale(' + hs + ')'; }
  }
  fit();
  addEventListener('resize', fit);

  /* ---------- mobile-only responsive helpers ---------- */
  function getCanvasNumber(el, prop) {
    if (!el || !el.style) return 0;
    var raw = el.style[prop] || (window.getComputedStyle ? getComputedStyle(el)[prop] : '') || '';
    var n = parseFloat(raw);
    return isNaN(n) ? 0 : n;
  }
  function hasReadableOwnText(el) {
    if (!el) return false;
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return false;
    if (text.length > 160) return true;
    var media = el.querySelectorAll ? el.querySelectorAll('img,video,svg,.img,.clip,iframe').length : 0;
    return media === 0 && text.length > 1;
  }
  function annotateMobileElement(el) {
    if (!el || el.id === 'siteheader') return;
    if (el.id === 'info') { el.classList.add('mobile-readable-block'); return; }
    if (el.classList.contains('rule') || (getCanvasNumber(el, 'height') <= 2 && getCanvasNumber(el, 'width') > 80)) {
      el.classList.add('mobile-rule-block'); return;
    }
    if (hasReadableOwnText(el)) {
      el.classList.add('mobile-readable-block'); return;
    }
    var w = getCanvasNumber(el, 'width') || el.offsetWidth || 0;
    var h = getCanvasNumber(el, 'height') || el.offsetHeight || 0;
    var mediaCount = el.querySelectorAll ? el.querySelectorAll('img,video,svg,.img,.clip,iframe').length : 0;
    var hasBg = !!(getComputedStyle(el).backgroundImage && getComputedStyle(el).backgroundImage !== 'none');
    if ((w > 20 && h > 20) && (mediaCount || hasBg || el.children.length > 1 || el.classList.contains('img') || el.classList.contains('clip'))) {
      el.classList.add('mobile-scaled-art');
      el.dataset.mobileSourceWidth = String(Math.max(1, w));
      el.dataset.mobileSourceHeight = String(Math.max(1, h));
    }
  }
  function prepareMobileProjectLayout() {
    if (!htmlRoot.classList.contains('portfolio-mobile-page-project') || !isMobileLayout() || !root || root.dataset.mobilePrepared === '1') return;
    if (root.dataset.mobileLayout === 'able' || root.dataset.mobileLayout === 'scaled-project' || root.dataset.mobileLayout === 'beerfest' || root.dataset.mobileLayout === 'sydney-open') return;
    root.dataset.mobilePrepared = '1';
    var children = Array.prototype.slice.call(root.children).filter(function (el) { return el.id !== 'siteheader'; });
    originalProjectOrder = children.map(function (el) { return { el: el, parent: el.parentNode, next: el.nextSibling }; });
    children.forEach(function (el) {
      annotateMobileElement(el);
      el.dataset.mobileTop = String(getCanvasNumber(el, 'top'));
      el.dataset.mobileLeft = String(getCanvasNumber(el, 'left'));
    });
    children.sort(function (a, b) {
      var at = parseFloat(a.dataset.mobileTop || '0'), bt = parseFloat(b.dataset.mobileTop || '0');
      if (at !== bt) return at - bt;
      return parseFloat(a.dataset.mobileLeft || '0') - parseFloat(b.dataset.mobileLeft || '0');
    }).forEach(function (el) { root.appendChild(el); });
    Array.prototype.slice.call(root.querySelectorAll(':scope > .mobile-scaled-art')).forEach(function (el) {
      if (el.parentNode && el.parentNode.classList && el.parentNode.classList.contains('mobile-art-wrap')) return;
      var wrapEl = document.createElement('div');
      wrapEl.className = 'mobile-art-wrap';
      var w = parseFloat(el.dataset.mobileSourceWidth || '1');
      var h = parseFloat(el.dataset.mobileSourceHeight || '1');
      wrapEl.style.setProperty('--mobile-source-width', w);
      wrapEl.style.setProperty('--mobile-source-height', h);
      el.parentNode.insertBefore(wrapEl, el);
      wrapEl.appendChild(el);
      mobileWrapped.push({ wrap: wrapEl, el: el });
    });
    updateMobileArtScale();
  }
  function updateMobileArtScale() {
    if (!isMobileLayout() || !mobileWrapped.length) return;
    var available = Math.max(280, window.innerWidth - 40);
    mobileWrapped.forEach(function (item) {
      var el = item.el, wrapEl = item.wrap;
      var w = parseFloat(el.dataset.mobileSourceWidth || '1');
      var h = parseFloat(el.dataset.mobileSourceHeight || '1');
      var scale = Math.min(1, available / w);
      wrapEl.style.height = Math.max(1, Math.round(h * scale)) + 'px';
      wrapEl.style.setProperty('--mobile-art-scale', scale);
    });
  }
  function restoreDesktopProjectLayout() {
    if (!root || root.dataset.mobilePrepared !== '1') return;
    mobileWrapped.forEach(function (item) {
      if (item.wrap.parentNode) item.wrap.parentNode.insertBefore(item.el, item.wrap);
      if (item.wrap.parentNode) item.wrap.parentNode.removeChild(item.wrap);
    });
    mobileWrapped = [];
    originalProjectOrder.forEach(function (item) {
      if (item.parent && item.el.parentNode === item.parent) item.parent.insertBefore(item.el, item.next);
    });
    originalProjectOrder = [];
    root.dataset.mobilePrepared = '';
  }
  if (MOBILE_QUERY.addEventListener) MOBILE_QUERY.addEventListener('change', function () { syncMobileClass(); fit(); });
  else if (MOBILE_QUERY.addListener) MOBILE_QUERY.addListener(function () { syncMobileClass(); fit(); });
  addEventListener('resize', updateMobileArtScale);

  /* ---------- 4. links ---------- */
  var here = decodeURIComponent(location.pathname);

  function canSmoothNavigate(href) {
    var url;
    try { url = new URL(href, location.href); } catch (error) { return false; }
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return url.origin === location.origin && url.href !== location.href && url.protocol.indexOf('http') === 0;
  }
  function smoothNavigate(href) {
    if (!canSmoothNavigate(href)) { location.href = href; return; }
    /* On phones the captured-page transition delays navigation and can distort
       scaled artwork while the next responsive layout is being constructed. */
    if (isMobileLayout()) { location.href = href; return; }
    try { sessionStorage.setItem('portfolio-transition', '1'); } catch (error) {}
    document.documentElement.classList.add('portfolio-page-leaving');
    setTimeout(function () { location.href = href; }, 160);
  }

  function go(el, href) {
    if (!href) return;
    if (el.tagName === 'A') { el.setAttribute('href', href); return; }
    el.style.cursor = 'pointer';
    el.setAttribute('role', 'link');
    el.tabIndex = 0;
    el.addEventListener('keydown', function (event) { if (event.key === 'Enter') smoothNavigate(href); });
    el.addEventListener('click', function () { smoothNavigate(href); });
  }
  var nodes = document.querySelectorAll('a,span,p,div');
  var nextName = null;
  for (var n = 0; n < nodes.length; n++) {
    var el = nodes[n];
    if (el.closest && el.closest('[data-no-auto-link]')) continue;
    if (el.children.length > 1) continue;
    var t = (el.textContent || '').trim();
    if (!t || t.length > 40) continue;
    var u = t.toUpperCase();
    if (u === 'GEMMA YANG') go(el, HOME);
    else if (u === 'WORK') go(el, WORK);
    else if (u === 'ABOUT') go(el, ABOUT);
    else if (u === 'ARCHIVE') go(el, ARCHIVE);
    else if (u === 'VIEW SELECTED WORK ↗' || u === 'VIEW SELECTED WORK') {
      if (!el.closest || !el.closest('#home-selected-cta')) go(el, WORK);
    }
    else if (u === '← ALL WORK' || u === '<- ALL WORK') go(el, WORK);
    else if (u === 'GEMMAYANG22@GMAIL.COM') go(el, 'mailto:gemmayang22@gmail.com');
    else if (PAGES[u] && here.indexOf(PAGES[u]) === -1) { nextName = u; go(el, projectHref(u)); }
  }
  if (nextName) {
    var href = projectHref(nextName);
    var all = document.querySelectorAll('a,p,span,div');
    for (var m = 0; m < all.length; m++) {
      var s2 = (all[m].textContent || '').trim();
      if (all[m].children.length <= 1 && /^NEXT\s*→?$/.test(s2.toUpperCase())) go(all[m], href);
    }
  }

  /* ---------- 5. persistent site music ---------- */
  var AUDIO_STATE_KEY = 'gemma-portfolio-audio-v1';
  var AUDIO_FILE = SITE_SCRIPT_URL
    ? new URL('home/audio/gemma-lofi-full-clean.wav', SITE_SCRIPT_URL).href
    : '../home/audio/gemma-lofi-full-clean.wav';
  function readAudioState() {
    try {
      var value = JSON.parse(localStorage.getItem(AUDIO_STATE_KEY) || '{}');
      return {
        playing: value.playing === true,
        time: Math.max(0, parseFloat(value.time) || 0),
        updated: parseFloat(value.updated) || Date.now()
      };
    } catch (error) {
      return { playing: false, time: 0, updated: Date.now() };
    }
  }
  function writeAudioState(value) {
    try { localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify(value)); } catch (error) {}
  }

  var savedAudioState = readAudioState();
  var wantsAudio = savedAudioState.playing;
  var audioRestored = false;
  var siteAudio = document.createElement('audio');
  siteAudio.id = 'portfolio-site-audio';
  siteAudio.src = AUDIO_FILE;
  siteAudio.loop = true;
  siteAudio.preload = 'auto';
  siteAudio.volume = 0.38;
  siteAudio.setAttribute('aria-hidden', 'true');
  siteAudio.style.display = 'none';
  document.body.appendChild(siteAudio);

  var audioButton = null;
  if (header) {
    audioButton = document.createElement('button');
    audioButton.id = 'portfolio-audio-toggle';
    audioButton.type = 'button';
    audioButton.innerHTML = '<span class="portfolio-audio-icon" aria-hidden="true"></span>';
    audioButton.style.cssText = 'position:absolute;left:1118px;top:6px;width:28px;height:28px;' +
      'display:flex;align-items:center;justify-content:center;z-index:3;cursor:pointer;color:#11110f;' +
      'border:0;padding:0;background:transparent;-webkit-appearance:none;appearance:none';
    header.appendChild(audioButton);
  }

  function currentAudioState() {
    return {
      playing: wantsAudio,
      time: isFinite(siteAudio.currentTime) ? siteAudio.currentTime : savedAudioState.time,
      updated: Date.now()
    };
  }
  function notifyAudioState() {
    if (audioButton) {
      audioButton.classList.toggle('is-playing', wantsAudio);
      audioButton.setAttribute('aria-pressed', wantsAudio ? 'true' : 'false');
      audioButton.setAttribute('aria-label', wantsAudio ? 'Pause music' : 'Play music');
      audioButton.title = wantsAudio ? 'Pause music' : 'Play music';
    }
    document.dispatchEvent(new CustomEvent('portfolio-audio-change', {
      detail: { playing: wantsAudio }
    }));
  }
  function saveAudioState() {
    savedAudioState = currentAudioState();
    writeAudioState(savedAudioState);
  }
  function restoreAudioPosition() {
    if (audioRestored || !isFinite(siteAudio.duration) || siteAudio.duration <= 0) return;
    var elapsed = savedAudioState.playing
      ? Math.max(0, (Date.now() - savedAudioState.updated) / 1000)
      : 0;
    siteAudio.currentTime = (savedAudioState.time + elapsed) % siteAudio.duration;
    audioRestored = true;
  }
  function setAudioPlaying(playing, userInitiated) {
    wantsAudio = !!playing;
    notifyAudioState();
    saveAudioState();
    if (!wantsAudio) {
      siteAudio.pause();
      return;
    }
    restoreAudioPosition();
    var promise = siteAudio.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        if (!userInitiated) {
          wantsAudio = false;
          notifyAudioState();
          saveAudioState();
        }
      });
    }
  }
  window.PortfolioAudio = {
    play: function (userInitiated) { setAudioPlaying(true, !!userInitiated); },
    pause: function () { setAudioPlaying(false, true); },
    toggle: function (userInitiated) { setAudioPlaying(!wantsAudio, !!userInitiated); },
    isPlaying: function () { return wantsAudio; }
  };
  if (audioButton) {
    audioButton.addEventListener('click', function () {
      window.PortfolioAudio.toggle(true);
    });
  }
  siteAudio.addEventListener('loadedmetadata', function () {
    restoreAudioPosition();
    if (wantsAudio) setAudioPlaying(true, false);
  });
  siteAudio.addEventListener('timeupdate', function () {
    if (wantsAudio) saveAudioState();
  });
  addEventListener('pagehide', saveAudioState);
  notifyAudioState();

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    var href = link.href;
    if (!canSmoothNavigate(href)) return;
    event.preventDefault();
    smoothNavigate(href);
  }, true);

  /* ---------- 6. prefetch nearby internal pages ---------- */
  var prefetched = {};
  function prefetchPage(href) {
    var url;
    try { url = new URL(href, location.href); } catch (error) { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname || prefetched[url.href]) return;
    prefetched[url.href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.href;
    link.as = 'document';
    document.head.appendChild(link);
  }
  document.addEventListener('pointerover', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (link) prefetchPage(link.href);
  });
  document.addEventListener('touchstart', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (link) prefetchPage(link.href);
  }, { passive: true });


  /* ---------- 7. hold animated image stacks until their artwork is decoded ---------- */
  function collectImageUrls(value) {
    var urls = [];
    if (!value || value === 'none') return urls;
    value.replace(/url\((['"]?)(.*?)\1\)/g, function (_, quote, url) {
      if (url) urls.push(url);
      return _;
    });
    return urls;
  }
  function absoluteImageUrl(url) {
    try { return new URL(url, location.href).href; }
    catch (error) { return null; }
  }
  function decodeImageUrl(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        resolve();
      }
      img.onload = function () {
        if (img.decode) img.decode().then(finish, finish);
        else finish();
      };
      img.onerror = finish;
      img.src = url;
      setTimeout(finish, 2500);
    });
  }
  function prepareMotionFrames() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('.seq,.cu-gif,.pstand,#hero,[data-motion-preload],img[src$=".gif"],img[src*=".gif?"]'));
    if (!targets.length) {
      document.documentElement.classList.add('portfolio-motion-ready');
      return;
    }
    var seen = {};
    var urls = [];
    targets.forEach(function (target) {
      var nodes = [target].concat(Array.prototype.slice.call(target.querySelectorAll ? target.querySelectorAll('*') : []));
      nodes.forEach(function (node) {
        if (node.tagName === 'IMG' && node.currentSrc) {
          var current = absoluteImageUrl(node.currentSrc);
          if (current && !seen[current]) { seen[current] = true; urls.push(current); }
        }
        if (node.tagName === 'IMG' && node.src) {
          var src = absoluteImageUrl(node.src);
          if (src && !seen[src]) { seen[src] = true; urls.push(src); }
        }
        var style = getComputedStyle(node);
        collectImageUrls(style.backgroundImage).forEach(function (url) {
          var abs = absoluteImageUrl(url);
          if (abs && !seen[abs]) { seen[abs] = true; urls.push(abs); }
        });
      });
    });
    var reveal = function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.add('portfolio-motion-ready');
      });
    };
    if (!urls.length) { reveal(); return; }
    Promise.all(urls.map(decodeImageUrl)).then(reveal, reveal);
  }
  prepareMotionFrames();

  /* ---------- 8. smooth link feedback ---------- */
  var st = document.createElement('style');
  st.textContent = 'a,[style*="cursor: pointer"],[style*="cursor:pointer"]{transition:opacity .35s cubic-bezier(.22,1,.36,1)}' +
                   'a:hover,[style*="cursor: pointer"]:hover,[style*="cursor:pointer"]:hover{opacity:.55}' +
                   '#portfolio-audio-toggle{transition:opacity .25s ease,color .25s ease}' +
                   '#portfolio-audio-toggle:hover{opacity:.55}' +
                   '#portfolio-audio-toggle:focus-visible{outline:1px solid #cd3023;outline-offset:1px}' +
                   '#portfolio-audio-toggle.is-playing{color:#cd3023}' +
                   '.portfolio-audio-icon{position:relative;display:block;width:12px;height:12px}' +
                   '#portfolio-audio-toggle:not(.is-playing) .portfolio-audio-icon:before{' +
                     'content:"";position:absolute;left:3px;top:1px;width:0;height:0;border-top:5px solid transparent;' +
                     'border-bottom:5px solid transparent;border-left:8px solid currentColor}' +
                   '#portfolio-audio-toggle.is-playing .portfolio-audio-icon:before,' +
                   '#portfolio-audio-toggle.is-playing .portfolio-audio-icon:after{' +
                     'content:"";position:absolute;top:1px;width:3px;height:10px;background:currentColor}' +
                   '#portfolio-audio-toggle.is-playing .portfolio-audio-icon:before{left:2px}' +
                   '#portfolio-audio-toggle.is-playing .portfolio-audio-icon:after{right:2px}';
  document.head.appendChild(st);
})();

/* =====================================================================
   Scroll-linked reveal engine (shared by every project page)
     data-rv        left | right | up | fall | io | rise | flow | out
     data-rv-dist   travel distance in canvas px (default 220)
     data-rv-delay  stagger index 0,1,2… -> a FIXED scroll gap per step
     data-rv-start  where the move begins, as a fraction of the viewport
                    height measured from the top (default .86 = near the
                    bottom edge, i.e. just as the element comes into view)
     data-rv-span   how much scrolling one item takes (default .45 vh)
     data-rv-gap    fixed scroll gap between stagger steps (default .14 vh)
     data-rv-rot    extra rotation for "fall" (deg)
     data-rv-spin   degrees the element rolls through on its way in (e.g. -360)
     data-rv-out    "io": how far it slides up as it leaves (default 420)
     data-rv-lift   "rise": how far above its own slot it finally sits
   Positions are measured once (untransformed) so the animation can never
   feed back into its own trigger, however far an element travels.
   ===================================================================== */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var items = [].slice.call(document.querySelectorAll('[data-rv]'));
  if (!items.length) return;
  items.forEach(function (el) {
    el.__base = (el.style.transform || '').trim();
    var o0 = parseFloat(el.style.opacity);
    el.__op0 = isNaN(o0) ? 1 : o0;          /* keep a designed opacity intact */
    el.style.willChange = 'auto';
    el.style.backfaceVisibility = 'hidden';
  });
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sy() { return window.pageYOffset || document.documentElement.scrollTop || 0; }

  function measure() {
    for (var i = 0; i < items.length; i++) {
      var el = items[i], kt = el.style.transform, ko = el.style.opacity;
      el.style.transform = el.__base || '';
      el.style.opacity = '';
      var r = el.getBoundingClientRect();
      el.__top = r.top + sy();
      el.__height = r.height;
      if (el.dataset.rvOffscreen) {
        var cx = 0, n = el;
        while (n && n.parentNode && n.parentNode.id !== 'viewport' && n !== document.body) { cx += n.offsetLeft; n = n.offsetParent; }
        el.__cx = cx; el.__cw = el.offsetWidth;
      }
      el.style.transform = kt;
      el.style.opacity = ko;
    }
    /* A reveal group starts with its first visible row, never its last row.
       Colour U keeps its authored falling-logo choreography. */
    var groups = {};
    items.forEach(function (el) {
      var g = el.dataset.rvGroup; if (!g) return;
      groups[g] = groups[g] === undefined ? el.__top :
        (g === 'cu' ? Math.max(groups[g], el.__top) : Math.min(groups[g], el.__top));
    });
    items.forEach(function (el) {
      var g = el.dataset.rvGroup;
      var anchor = el.dataset.rvAnchor && document.querySelector(el.dataset.rvAnchor);
      el.__trig = anchor ? anchor.getBoundingClientRect().top + sy() : (g ? groups[g] : el.__top);
    });
  }

  var queued = false;
  function apply() {
    queued = false;
    var vh = window.innerHeight, y = sy();
    /* the outer gutters sit outside the 1440 canvas: an element parked "off
       screen" has to clear them too, or it still pokes in on a wide window */
    var vpEl = document.getElementById('viewport');
    var geo = window.portfolioCanvasLayout
      ? window.portfolioCanvasLayout((vpEl ? vpEl.clientWidth : window.innerWidth), vh)
      : { scale: 1, left: 0 };
    var pad = geo.scale ? geo.left / geo.scale : 0;
    for (var i = 0; i < items.length; i++) {
      var el = items[i], d = el.dataset;
      var top  = (el.__trig !== undefined ? el.__trig : el.__top || 0) - y;
      var mode = d.rv,
          dist = parseFloat(d.rvDist  || '220'),
          step = parseFloat(d.rvDelay || '0'),
          span = parseFloat(d.rvSpan  || '0.45') * vh,
          gap  = parseFloat(d.rvGap   || '0.14') * vh,
          s0   = parseFloat(d.rvStart || '0.86') * vh;
      if (d.rvOffscreen && el.__cx !== undefined && (mode === 'left' || mode === 'right')) {
        dist = Math.max(dist, (mode === 'left' ? el.__cx + el.__cw : 1440 - el.__cx) + pad + 8);
      }
      var start = s0 - step * gap;
      /* A short proportional canvas can already be visible at page load.
         Preserve a true initial state and use the available scroll distance. */
      if ((mode === 'roll' || d.rvFade === 'zero') && el.__trig < start) {
        start = el.__trig;
        span = Math.min(span, Math.max(80, el.__trig * 0.5));
      }
      var end = start - span;
      // Ordinary entrances begin with visible artwork; keep a readable settled interval.
      if (!d.rvAnchor && /^(left|right|up|io)$/.test(mode)) {
        start = Math.min(start, vh * 0.92);
        end = Math.max(vh * 0.36, start - Math.min(span, vh * 0.38));
      }
      el.__progress = clamp((start - top) / (start - end));
      var p = clamp((start - top) / (start - end)), k = ease(p), inv = 1 - k, t = '', o = 1;

      if (mode === 'wave') { t = 'translateY(' + (dist * inv).toFixed(2) + 'px)'; o = k; }
      else if (mode === 'left')       { t = 'translateX(' + (-dist * inv).toFixed(2) + 'px)'; o = 0.05 + 0.95 * k; }
      else if (mode === 'right') { t = 'translateX(' + ( dist * inv).toFixed(2) + 'px)'; o = 0.05 + 0.95 * k; }
      else if (mode === 'up')    { t = 'translateY(' + ( dist * inv).toFixed(2) + 'px)'; o = 0.05 + 0.95 * k; }
      else if (mode === 'fall') {
        /* drops in from above the section, with a little tilt on the way down */
        var rot = parseFloat(d.rvRot || '0');
        t = 'translateY(' + (-dist * inv).toFixed(2) + 'px)' +
            (rot ? ' rotate(' + (rot * inv).toFixed(2) + 'deg)' : '');
        o = 0.05 + 0.95 * k;
      }
      else if (mode === 'io') {
        /* waves in, then slides up and fades away as the scroll continues */
        var lift = parseFloat(d.rvOut || '420');
        var eSpan = parseFloat(d.rvOutSpan || '0.55') * vh;
        var eStart = (d.rvOutStart !== undefined ? parseFloat(d.rvOutStart) * vh
                                                 : end - parseFloat(d.rvOutDelay || '0.06') * vh)
                     - step * parseFloat(d.rvOutGap || '0') * vh;
        var q = ease(clamp((eStart - top) / eSpan));
        t = 'translateY(' + (dist * inv - lift * q).toFixed(2) + 'px)';
        o = (0.05 + 0.95 * k) * (1 - q);
      }
      else if (mode === 'rise') {
        /* comes up from below its own slot and settles higher up the page */
        var up = parseFloat(d.rvLift || '0');
        t = 'translateY(' + (dist * inv - up * k).toFixed(2) + 'px)';
        o = 0.05 + 0.95 * k;
      }
      else if (mode === 'flow') {
        var far0 = parseFloat(d.rvOut || '900');
        var q0 = ease(clamp((end - top) / (vh * 0.7)));
        t = 'translateY(' + (dist * 0.4 * inv).toFixed(2) + 'px) translateX(' + (q0 * far0).toFixed(2) + 'px)';
        o = (0.05 + 0.95 * k) * (1 - q0);
      }
      else if (mode === 'out') {
        var far = parseFloat(d.rvOut || '1100');
        var q1 = ease(clamp((end - top) / (vh * 0.8)));
        t = 'translateX(' + (q1 * far).toFixed(2) + 'px)';
        o = (0.05 + 0.95 * k) * (1 - q1);
      }
      if (mode === 'roll') { t = 'rotate(' + (-360 * (1 - p)).toFixed(2) + 'deg)'; o = 1; }
      var spin = parseFloat(d.rvSpin || '0');
      if (spin) t += ' rotate(' + (spin * inv).toFixed(2) + 'deg)';
      if (d.rvFade === '0') o = 1;
      if (d.rvFade === 'zero') o = k;
      if (reduced.matches) { t = ''; o = 1; }
      el.style.willChange = !reduced.matches && p > 0 && p < 1 ? 'transform,opacity' : 'auto';
      o *= el.__op0;
      el.style.transform = t + (el.__base ? ' ' + el.__base : '');
      el.style.opacity = o.toFixed(3);
    }
    if (media.length) playWhenLevel(vh);
  }
  var media = items.filter(function (el) {
    return el.tagName === 'VIDEO' || el.querySelector('video');
  });
  function playWhenLevel(vh) {
    for (var v = 0; v < media.length; v++) {
      var host = media[v], vid = host.tagName === 'VIDEO' ? host : host.querySelector('video');
      if (!vid) continue;
      var r = host.getBoundingClientRect();
      if (!r.height) continue;
      var inView = r.top < vh * 1.2 && r.bottom > 0;
      if (inView && !document.hidden && !reduced.matches) {
        if (vid.paused) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
      } else if (!vid.paused) { vid.pause(); }
    }
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(apply); } }
  function onResize() { measure(); onScroll(); }
  document.addEventListener('visibilitychange', onScroll);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
  addEventListener('load', onResize);
  reduced.addEventListener('change', onScroll);
  if (document.fonts) document.fonts.ready.then(onResize);
  measure(); apply();
})();

/* One clock for the GeGe takeaway composition, paused when offscreen. */
(function () {
  var cup = document.querySelector('.gg-cup1');
  if (!cup) return;
  var host = cup.parentElement;
  var members = host.querySelectorAll('.gg-cup2,.gg-card1,.gg-card2,.gg-stick1,.gg-stick2');
  var visible = false, started = false;
  function update() {
    members.forEach(function (el) { el.style.animationPlayState = visible && !document.hidden ? 'running' : 'paused'; });
  }
  update();
  var observer = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible && !started) {
      members.forEach(function (el) { el.getAnimations().forEach(function (a) { a.currentTime = 0; }); });
      started = true;
    }
    update();
  }, { rootMargin: '0px 0px -10% 0px' });
  observer.observe(cup);
  document.addEventListener('visibilitychange', update);
})();
