/* Shared site behaviour for every project page.
   1. Centre the 1440px Figma canvas; use identical geometry and half the former outer gutters.
   2. The site header is lifted out of the scaled canvas and pinned to the top of the window.
   3. Nav / ALL WORK / NEXT PROJECT links wired to the real page folders.
   Edit this one file and all pages follow. */
(function () {
  var BASE = 1440;
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
  var WORK = '../work-index/index.html';
  function projectHref(name) {
    var f = PAGES[name.trim().toUpperCase()];
    return f ? '../' + encodeURIComponent(f).replace(/%2F/g, '/') + '/index.html' : null;
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
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
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
    var bg = getComputedStyle(header).backgroundColor;
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      bg = getComputedStyle(document.body).backgroundColor || '#f4f1e9';
    }
    document.body.appendChild(header);
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
    }
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

  /* ---------- 3. scale ---------- */
  function fit() {
    var geometry = window.portfolioCanvasLayout(wrap.clientWidth, window.innerHeight);
    var s = geometry.scale;
    root.style.margin = '0';
    root.style.left = geometry.left + 'px';
    root.style.transform = 'scale(' + s + ')';
    wrap.style.height = (H * s) + 'px';
    if (header) { var hs = wrap.clientWidth / BASE; header.style.transform = 'scale(' + hs + ')'; }
  }
  fit();
  addEventListener('resize', fit);

  /* ---------- 4. links ---------- */
  var here = decodeURIComponent(location.pathname);
  function go(el, href) {
    if (!href) return;
    if (el.tagName === 'A') { el.setAttribute('href', href); return; }
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () { location.href = href; });
  }
  var nodes = document.querySelectorAll('a,span,p,div');
  var nextName = null;
  for (var n = 0; n < nodes.length; n++) {
    var el = nodes[n];
    if (el.children.length > 1) continue;
    var t = (el.textContent || '').trim();
    if (!t || t.length > 40) continue;
    var u = t.toUpperCase();
    if (u === 'GEMMA YANG' || u === 'WORK') go(el, WORK);
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

  /* ---------- 5. smooth link feedback ---------- */
  var st = document.createElement('style');
  st.textContent = 'a,[style*="cursor: pointer"],[style*="cursor:pointer"]{transition:opacity .35s cubic-bezier(.22,1,.36,1)}' +
                   'a:hover,[style*="cursor: pointer"]:hover,[style*="cursor:pointer"]:hover{opacity:.55}';
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
    for (var i = 0; i < items.length; i++) {
      var el = items[i], d = el.dataset;
      var top  = (el.__trig !== undefined ? el.__trig : el.__top || 0) - y;
      var mode = d.rv,
          dist = parseFloat(d.rvDist  || '220'),
          step = parseFloat(d.rvDelay || '0'),
          span = parseFloat(d.rvSpan  || '0.45') * vh,
          gap  = parseFloat(d.rvGap   || '0.14') * vh,
          s0   = parseFloat(d.rvStart || '0.86') * vh;
      var start = s0 - step * gap;
      /* A short proportional canvas can already be visible at page load.
         Preserve a true initial state and use the available scroll distance. */
      if ((mode === 'roll' || d.rvFade === 'zero') && el.__trig < start) {
        start = el.__trig;
        span = Math.min(span, Math.max(80, el.__trig * 0.5));
      }
      var end = start - span;
      if (!d.rvAnchor && d.rvGroup !== 'cu' && /^(left|right|up|io)$/.test(mode)) {
        // Finish while the upper part of the work is still comfortably in view.
        var deadline = Math.max(vh * 0.60, Math.min(vh * 0.82, vh - el.__height - vh * 0.06));
        if (end < deadline) {
          end = deadline;
          start = Math.max(end + vh * 0.12, Math.min(vh * 0.98, end + span));
        }
      }
      el.__progress = clamp((start - top) / (start - end));
      var p = clamp((start - top) / (start - end)), k = ease(p), inv = 1 - k, t = '', o = 1;

      if (mode === 'left')       { t = 'translateX(' + (-dist * inv).toFixed(2) + 'px)'; o = 0.05 + 0.95 * k; }
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
  }, { rootMargin: '20% 0px' });
  observer.observe(cup);
  document.addEventListener('visibilitychange', update);
})();
