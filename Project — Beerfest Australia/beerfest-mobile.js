(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 767px)');
  if (!mq) return;
  function reloadAcrossBreakpoint() { window.location.reload(); }
  if (mq.addEventListener) mq.addEventListener('change', reloadAcrossBreakpoint);
  else if (mq.addListener) mq.addListener(reloadAcrossBreakpoint);

  var stage = document.getElementById('stage');
  if (!stage) return;
  if (!mq.matches || window.innerWidth > 767 || document.getElementById('beerfest-mobile')) return;
  stage.dataset.mobileLayout = 'beerfest';

  function make(tag, className, parent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.appendChild(node);
    return node;
  }
  function move(node, parent) {
    if (node && parent) parent.appendChild(node);
    return node;
  }
  function clean(node) {
    if (!node) return node;
    node.removeAttribute('data-rv');
    node.removeAttribute('data-rv-anchor');
    node.style.opacity = '1';
    return node;
  }
  function section(className) { return make('section', 'beerfest-mobile-section ' + className, mobile); }

  var fitted = [];
  function fitFrame(node, sourceWidth, sourceHeight, className, parent) {
    var frame = make('div', 'beerfest-fit-frame ' + (className || ''), parent);
    var canvas = make('div', 'beerfest-fit-canvas', frame);
    canvas.style.width = sourceWidth + 'px';
    canvas.style.height = sourceHeight + 'px';
    clean(node);
    canvas.appendChild(node);
    fitted.push({ frame: frame, canvas: canvas, width: sourceWidth, height: sourceHeight });
    return frame;
  }
  function fitAll() {
    fitted.forEach(function (item) {
      var width = item.frame.clientWidth;
      if (!width) return;
      var scale = width / item.width;
      item.frame.style.height = Math.round(item.height * scale) + 'px';
      item.canvas.style.transform = 'scale(' + scale + ')';
    });
  }
  function arrow(direction) {
    var transform = direction === 'previous' ? ' transform="translate(24 0) scale(-1 1)"' : '';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path' + transform + ' d="M8 4l8 8-8 8"/></svg>';
  }
  function controls(lane, parent, label) {
    var box = make('div', 'beerfest-swipe-controls', parent);
    ['previous', 'next'].forEach(function (direction) {
      var button = make('button', 'beerfest-swipe-button', box);
      button.type = 'button';
      button.setAttribute('aria-label', (direction === 'previous' ? 'Previous ' : 'Next ') + label);
      button.innerHTML = arrow(direction);
      button.addEventListener('click', function () {
        lane.scrollBy({ left: lane.clientWidth * (direction === 'previous' ? -1 : 1), behavior: 'smooth' });
      });
    });
    return box;
  }

  var mobile = make('main', '', null);
  mobile.id = 'beerfest-mobile';
  mobile.setAttribute('aria-label', 'Beerfest Australia project');
  stage.insertBefore(mobile, stage.firstChild);

  var direct = Array.prototype.slice.call(stage.children);
  var editorial = direct.find(function (node) { return /ALL WORK/i.test(node.textContent || ''); });
  var info = document.getElementById('info');
  var footer = document.getElementById('beerfest-footer');
  var heroBg = direct.find(function (node) { return node.querySelector && node.querySelector('video[src*="hero-bg"]'); });
  var heroFront = direct.find(function (node) { return node.querySelector && node.querySelector('video[src$="hero.mp4"]'); });
  var social = direct.find(function (node) { return node.querySelector && node.querySelector('video[src*="socialdisplay"]'); });

  var intro = section('beerfest-mobile-intro');
  editorial.id = 'beerfest-editorial';
  Array.prototype.slice.call(editorial.children).forEach(function (node) {
    if (/ALL WORK/i.test(node.textContent || '')) node.classList.add('beerfest-back');
    else if (/·/.test(node.textContent || '')) node.classList.add('beerfest-label');
    else node.classList.add('beerfest-title');
  });
  move(editorial, intro);

  var details = section('beerfest-mobile-details');
  move(info, details);

  var textNodes = direct.filter(function (node) { return node.classList && (node.classList.contains('h2') || node.classList.contains('body')); });
  function byTop(top) { return textNodes.find(function (node) { return Math.abs(parseFloat(node.style.top) - top) < 2; }); }

  var heroSection = section('beerfest-mobile-hero');
  move(byTop(924), heroSection);
  move(byTop(989), heroSection);
  var heroCanvas = make('div', 'beerfest-hero-canvas');
  heroBg.style.left = '0px'; heroBg.style.top = '0px';
  heroFront.style.left = '360px'; heroFront.style.top = '75px';
  heroFront.style.width = '1187px'; heroFront.style.height = '915px';
  heroCanvas.appendChild(clean(heroBg));
  heroCanvas.appendChild(clean(heroFront));
  fitFrame(heroCanvas, 1906, 1053, 'beerfest-hero-frame', heroSection);

  var previewSection = section('beerfest-mobile-previews');
  var previewNodes = direct.filter(function (node) {
    var top = parseFloat(node.style.top);
    return node.classList && node.classList.contains('clip') && top >= 2060 && top <= 2230;
  }).sort(function (a, b) { return parseFloat(a.style.left) - parseFloat(b.style.left); });
  var phoneRow = make('div', 'beerfest-phone-row', previewSection);
  if (previewNodes[0]) { previewNodes[0].style.left = '0'; previewNodes[0].style.top = '0'; fitFrame(previewNodes[0], 440, 504, '', phoneRow); }
  if (previewNodes[1]) {
    var secondPhoneImage = previewNodes[1].querySelector('.img');
    previewNodes[1].style.left = '0'; previewNodes[1].style.top = '0';
    previewNodes[1].style.width = '440px'; previewNodes[1].style.height = '504px';
    if (secondPhoneImage) {
      secondPhoneImage.style.left = '0'; secondPhoneImage.style.top = '-0.1%';
      secondPhoneImage.style.width = '124.7%'; secondPhoneImage.style.height = '100.2%';
    }
    fitFrame(previewNodes[1], 440, 504, '', phoneRow);
  }
  /* The standalone What We Have board is intentionally omitted on mobile. */
  previewSection.appendChild(phoneRow);

  var pagesSection = section('beerfest-mobile-pages');
  move(byTop(2937), pagesSection);
  move(byTop(3006), pagesSection);
  var pagesGallery = make('div', 'beerfest-pages-gallery', pagesSection);
  var pagesLane = make('div', 'beerfest-pages-lane', pagesGallery);
  var pageNodes = direct.filter(function (node) {
    return node.classList && node.classList.contains('img') && parseFloat(node.style.top) >= 3140 && parseFloat(node.style.top) <= 3143 && parseFloat(node.style.width) === 192;
  }).sort(function (a, b) { return parseFloat(a.style.left) - parseFloat(b.style.left); });
  pageNodes.forEach(function (page) {
    var slide = make('div', 'beerfest-page-slide', pagesLane);
    var scroller = make('div', 'beerfest-page-scroll', slide);
    var height = parseFloat(page.style.height) || 1;
    page.style.left = '0'; page.style.top = '0';
    page.style.width = '234px'; page.style.height = (height * 234 / 192) + 'px';
    page.style.backgroundSize = '100% 100%';
    clean(page);
    scroller.appendChild(page);
  });
  controls(pagesLane, pagesGallery, 'website page');

  var wantSection = section('beerfest-mobile-want');
  var wantTitle = direct.find(function (node) { return /want more\?/i.test((node.textContent || '').trim()); });
  move(wantTitle, wantSection);
  var carousel = document.getElementById('carousel');
  move(carousel, wantSection);

  var extendSection = section('beerfest-mobile-extend');
  move(byTop(5435), extendSection);
  move(byTop(5554), extendSection);
  /* Keep the explanatory copy, but omit the What We Have board and its frame. */

  var socialSection = section('beerfest-mobile-social');
  if (social) {
    social.style.left = '0'; social.style.top = '0';
    fitFrame(social, 1152, 781.6, 'beerfest-social-frame', socialSection);
  }

  Array.prototype.slice.call(stage.querySelectorAll('img[src*="assets/details/"]')).forEach(function (node) {
    node.classList.add('beerfest-mobile-hidden-detail');
  });

  var footerSection = section('beerfest-mobile-footer');
  move(footer, footerSection);

  requestAnimationFrame(fitAll);
  window.addEventListener('resize', fitAll);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(fitAll);
    fitted.forEach(function (item) { observer.observe(item.frame); });
  }
  document.documentElement.classList.add('beerfest-mobile-ready');
})();
