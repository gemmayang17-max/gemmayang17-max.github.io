(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 767px)');
  if (!mq) return;
  function reloadAcrossBreakpoint() { window.location.reload(); }
  if (mq.addEventListener) mq.addEventListener('change', reloadAcrossBreakpoint);
  else if (mq.addListener) mq.addListener(reloadAcrossBreakpoint);
  if (!mq.matches) return;

  var stage = document.getElementById('stage');
  if (!stage || document.getElementById('able-mobile')) return;

  var mobile = document.createElement('main');
  mobile.id = 'able-mobile';
  mobile.setAttribute('aria-label', 'Able Australia project');
  stage.insertBefore(mobile, stage.firstChild);

  function make(tag, className, parent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.appendChild(node);
    return node;
  }

  function move(selector, parent) {
    var node = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (node && parent) parent.appendChild(node);
    return node;
  }

  function section(className) {
    return make('section', 'able-mobile-section ' + (className || ''), mobile);
  }

  var fitFrames = [];
  function fittedFrame(node, sourceWidth, sourceHeight, className, parent) {
    var frame = make('div', 'able-fit-frame ' + (className || ''), parent);
    var canvas = make('div', 'able-fit-canvas', frame);
    canvas.style.width = sourceWidth + 'px';
    canvas.style.height = sourceHeight + 'px';
    canvas.appendChild(node);
    fitFrames.push({ frame: frame, canvas: canvas, width: sourceWidth, height: sourceHeight });
    return frame;
  }

  function fitAll() {
    fitFrames.forEach(function (item) {
      var width = item.frame.clientWidth;
      if (!width) return;
      var scale = width / item.width;
      item.frame.style.height = Math.round(item.height * scale) + 'px';
      item.canvas.style.transform = 'scale(' + scale + ')';
    });
  }

  function icon(direction) {
    var reverse = direction === 'previous' ? ' transform="translate(24 0) scale(-1 1)"' : '';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path' + reverse + ' d="M5 12h13M13 7l5 5-5 5"/></svg>';
  }

  function addSwipeControls(lane, parent, label) {
    var controls = make('div', 'able-swipe-controls', parent);
    lane.setAttribute('aria-label', label || 'Swipe gallery');
    ['previous', 'next'].forEach(function (direction) {
      var button = make('button', 'able-swipe-button', controls);
      button.type = 'button';
      button.setAttribute('aria-label', direction === 'previous' ? 'Previous item' : 'Next item');
      button.innerHTML = icon(direction);
      button.addEventListener('click', function () {
        var firstItem = lane.firstElementChild;
        var itemWidth = firstItem ? firstItem.getBoundingClientRect().width : lane.clientWidth;
        var laneGap = parseFloat(getComputedStyle(lane).columnGap || getComputedStyle(lane).gap) || 0;
        lane.scrollBy({ left: (direction === 'previous' ? -1 : 1) * (itemWidth + laneGap), behavior: 'smooth' });
      });
    });
  }

  /* Header: the back link belongs above the project name on mobile. */
  var editorialSection = section('able-mobile-editorial-section');
  move('#able-editorial', editorialSection);

  var infoSection = section('able-mobile-info-section');
  move('#info', infoSection);

  /* Intro copy and its intact animated brand canvas. */
  var humanSection = section('able-mobile-human-section');
  move('#able-more-title', humanSection);
  move('#able-more-copy', humanSection);
  var hero = document.getElementById('hero');
  if (hero) {
    hero.style.left = '0px';
    hero.style.top = '0px';
    fittedFrame(hero, 1440, 835, 'able-hero-frame', humanSection);
  }

  /* Three finished poster compositions: one complete poster per swipe. */
  var posterSection = section('able-mobile-poster-section');
  var posterLane = make('div', 'able-swipe-lane able-poster-lane', posterSection);
  Array.prototype.slice.call(document.querySelectorAll('.able-static-poster')).forEach(function (poster) {
    poster.style.left = '0px';
    poster.style.top = '0px';
    fittedFrame(poster, 415.19, 587.494, 'able-static-poster-frame', posterLane);
  });
  addSwipeControls(posterLane, posterSection, 'Swipe posters');

  /* Flexible system: keep the mark and wordmark locked together as one canvas. */
  var flexibleSection = section('able-mobile-flexible-section');
  move('#able-flex-title', flexibleSection);
  move('#able-flex-copy', flexibleSection);
  var flexibleCanvas = make('div', 'able-flexible-canvas');
  var wing = move('#able-flex-wing', flexibleCanvas);
  var able = move('#able-flex-able', flexibleCanvas);
  var australia = move('#able-flex-australia', flexibleCanvas);
  if (wing) { wing.style.left = '38px'; wing.style.top = '0px'; }
  if (able) { able.style.left = '511px'; able.style.top = '60px'; }
  if (australia) { australia.style.left = '513.48px'; australia.style.top = '238.13px'; }
  fittedFrame(flexibleCanvas, 850, 383, 'able-flexible-frame', flexibleSection);

  /* Mobile uses a calm, completed-state gallery: one poster, no neighbour peeks. */
  var movingPosterSection = section('able-mobile-moving-posters');
  var carousel = document.getElementById('carousel');
  if (carousel) {
    var movingLane = make('div', 'able-swipe-lane able-manual-poster-lane', movingPosterSection);
    var movingPosters = Array.prototype.slice.call(carousel.querySelectorAll('.poster')).slice(0, 4);
    movingPosters.forEach(function (poster) {
      poster.style.left = '0px';
      poster.style.top = '0px';
      fittedFrame(poster, 413.434, 718.373, 'able-manual-poster-frame', movingLane);
    });
    addSwipeControls(movingLane, movingPosterSection, 'Swipe campaign posters');
  }

  /* Campaign cards stay paired in a true 2 × 2 grid. */
  var campaignSection = section('able-mobile-campaign-section');
  move('#able-campaign-title', campaignSection);
  move('#able-campaign-copy', campaignSection);
  var campaignGrid = make('div', 'able-campaign-grid', campaignSection);
  Array.prototype.slice.call(document.querySelectorAll('.able-campaign-card')).forEach(function (card) {
    campaignGrid.appendChild(card);
  });

  var oohSection = section('able-mobile-ooh-section');
  move('#able-ooh-title', oohSection);
  move('#able-ooh-copy', oohSection);
  move('#able-ooh-poster', oohSection);

  /* Copy first, then bottle and tote on one shared baseline. */
  var touchSection = section('able-mobile-touch-section');
  move('#able-touch-title', touchSection);
  move('#able-touch-copy', touchSection);
  var touchRow = make('div', 'able-touch-row', touchSection);
  var bottle = move('#able-bottle', touchRow);
  var kit = move('#able-kit', touchRow);
  [bottle, kit].forEach(function (node) {
    if (!node) return;
    node.removeAttribute('data-rv');
    node.removeAttribute('data-rv-anchor');
    node.removeAttribute('data-rv-group');
    node.style.opacity = '1';
    node.style.transform = 'none';
  });

  /* Three staff applications: complete items, native touch swipe, soft controls. */
  var credentialsSection = section('able-mobile-credentials-section');
  var credentialsLane = make('div', 'able-swipe-lane able-credentials-lane', credentialsSection);
  Array.prototype.slice.call(document.querySelectorAll('.able-credential')).forEach(function (credential) {
    var credentialWidth = parseFloat(credential.style.width) || 1;
    var credentialHeight = parseFloat(credential.style.height) || 1;
    credential.style.aspectRatio = credentialWidth + ' / ' + credentialHeight;
    credentialsLane.appendChild(credential);
  });
  addSwipeControls(credentialsLane, credentialsSection, 'Swipe credentials');

  var nextSection = section('able-mobile-next-section');
  move('#able-next', nextSection);

  requestAnimationFrame(fitAll);
  window.addEventListener('resize', fitAll);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(fitAll);
    fitFrames.forEach(function (item) { observer.observe(item.frame); });
  }
})();
