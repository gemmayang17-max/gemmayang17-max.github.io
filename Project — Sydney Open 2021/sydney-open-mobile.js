(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 767px)');
  if (!mq || !mq.matches || window.innerWidth > 767) return;

  var stage = document.getElementById('stage');
  if (!stage || document.getElementById('sydney-open-mobile')) return;
  stage.dataset.mobileLayout = 'sydney-open';

  function make(tag, className, parent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.appendChild(node);
    return node;
  }
  function image(src, alt, className) {
    var node = document.createElement('img');
    node.src = 'images/' + src;
    node.alt = alt;
    node.loading = 'lazy';
    if (className) node.className = className;
    return node;
  }
  function clean(node, preserveOpacity) {
    if (!node) return node;
    node.removeAttribute('data-rv');
    node.removeAttribute('data-rv-anchor');
    if (!preserveOpacity) node.style.opacity = '1';
    return node;
  }
  function topOf(node) { return Number((node && node.style.top || '0').replace('px', '')) || 0; }

  var direct = Array.prototype.slice.call(stage.children);
  function at(top, className) {
    return direct.find(function (node) {
      return Math.abs(topOf(node) - top) < 2 && (!className || node.classList.contains(className));
    });
  }
  var editorial = direct.find(function (node) {
    return /Sydney Open 2021/i.test(node.textContent || '') && /ALL WORK/i.test(node.textContent || '');
  });
  var info = document.getElementById('info');
  var footer = direct.find(function (node) { return /NEXT PROJECT/i.test(node.textContent || ''); });
  if (!editorial || !info || !footer) return;

  var mobile = make('main', '', null);
  mobile.id = 'sydney-open-mobile';
  mobile.setAttribute('aria-label', 'Sydney Open 2021 project');
  stage.insertBefore(mobile, stage.firstChild);

  var fitted = [];
  function fitFrame(className, width, height, parent) {
    var frame = make('div', 'sydney-fit-frame ' + (className || ''), parent);
    var canvas = make('div', 'sydney-fit-canvas', frame);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    fitted.push({ frame: frame, canvas: canvas, width: width, height: height });
    return { frame: frame, canvas: canvas };
  }
  function fitAll() {
    fitted.forEach(function (item) {
      var scale = item.frame.clientWidth / item.width;
      item.frame.style.height = Math.round(item.height * scale) + 'px';
      item.canvas.style.transform = 'scale(' + scale + ')';
    });
  }
  function section(titleNode, bodyNode, modifier) {
    var node = make('section', 'sydney-mobile-section ' + (modifier || ''), mobile);
    if (titleNode) node.appendChild(clean(titleNode));
    if (bodyNode) node.appendChild(clean(bodyNode));
    return node;
  }
  function arrow(direction) {
    var button = make('button', 'sydney-carousel-arrow sydney-carousel-arrow-' + direction);
    button.type = 'button';
    button.setAttribute('aria-label', direction === 'previous' ? 'Previous image' : 'Next image');
    button.innerHTML = '<svg viewBox="0 0 20 32" aria-hidden="true"><path d="M17 3 4 16l13 13"/></svg>';
    if (direction === 'next') button.querySelector('svg').style.transform = 'rotate(180deg)';
    return button;
  }
  function carousel(label, slides, parent, modifier) {
    var box = make('div', 'sydney-carousel ' + (modifier || ''), parent);
    box.setAttribute('aria-label', label);
    var lane = make('div', 'sydney-carousel-lane', box);
    slides.forEach(function (slide) {
      slide.classList.add('sydney-carousel-slide');
      lane.appendChild(slide);
    });
    ['previous', 'next'].forEach(function (direction) {
      var button = arrow(direction);
      button.addEventListener('click', function () {
        lane.scrollBy({ left: lane.clientWidth * (direction === 'previous' ? -1 : 1), behavior: 'smooth' });
      });
      box.appendChild(button);
    });
    return box;
  }

  var intro = make('section', 'sydney-mobile-intro', mobile);
  var heroFrame = fitFrame('sydney-mobile-hero-bg', 1440, 900, intro);
  direct.filter(function (node) {
    var top = topOf(node);
    return node !== editorial && node !== info && top < 900 && (node.classList.contains('img') || node.classList.contains('clip'));
  }).forEach(function (node) { heroFrame.canvas.appendChild(clean(node, true)); });
  editorial.id = 'sydney-mobile-editorial';
  Array.prototype.slice.call(editorial.children).forEach(function (node) {
    if (node.tagName === 'A' || /ALL WORK/i.test(node.textContent || '')) node.classList.add('sydney-back');
    else if (/·/.test(node.textContent || '')) node.classList.add('sydney-label');
    else node.classList.add('sydney-title');
  });
  intro.appendChild(editorial);

  var details = make('section', 'sydney-mobile-details', mobile);
  details.appendChild(info);

  var posters = section(at(789, 'label'), at(785, 'body'), 'sydney-mobile-posters');
  carousel('Sydney Open poster series', [
    image('720f0768d0c52b619b7e030f9bfc2160f13379bb.png', 'Sydney Open event poster'),
    image('4937f064ca7ec1ca5581e5adcebdb46cb91f7c48.png', 'The DNA of the City poster'),
    image('949dbe676c29cbc9e630de4ed74aa94572753a75.png', 'Creating a Greener Sydney poster')
  ], posters, 'sydney-poster-carousel');

  var context = section(at(1652, 'h2'), at(1648, 'body'), 'sydney-mobile-context');
  var contextFrame = fitFrame('sydney-context-frame', 1595.774, 881, context);
  var contextBg = at(1820, 'clip');
  if (contextBg) { contextBg.style.left = '0'; contextBg.style.top = '0'; contextFrame.canvas.appendChild(clean(contextBg)); }
  direct.filter(function (node) { return node.classList.contains('seq'); }).forEach(function (node) {
    node.style.left = (Number(node.style.left.replace('px', '')) + 83) + 'px';
    node.style.top = (topOf(node) - 1820) + 'px';
    contextFrame.canvas.appendChild(clean(node));
  });

  var printSection = section(at(2874, 'h2'), at(2870, 'body'), 'sydney-mobile-print');
  printSection.appendChild(image('2819c35029d25a26f7a2684ec34ad88e2a65d7ae.png', 'Sydney Open poster in print'));

  var situSection = section(at(4120, 'h2'), at(4116, 'body'), 'sydney-mobile-situ');
  situSection.appendChild(image('429a677e8a639f3ffdb1e3ddfe202cf31fd0a063.png', 'Sydney Open poster in situ'));

  var brochureSection = section(at(5479, 'h2'), at(5475, 'body'), 'sydney-mobile-brochure');
  carousel('Sydney Open brochure', [
    image('01048a8437e397773452348fc61deb08e0809eeb.png', 'Sydney Open brochure front'),
    image('694c0f473f33dbfedeac1494d4bd809522dac0d2.png', 'Sydney Open brochure reverse')
  ], brochureSection, 'sydney-brochure-carousel');
  brochureSection.appendChild(image('31b3feef26f1829b1e0c491e04fbf0c4e8a45920.png', 'Sydney Open brochure photographed in context', 'sydney-brochure-context'));
  carousel('Sydney Open brochure details', [
    ['d0cab86208381de0255adcb547e885f78ef2850b-2.png', 'Sydney Open brochure detail one'],
    ['8fb53a9b3278571edf068d10a9de76c63129b62f-2.png', 'Sydney Open brochure detail two']
  ].map(function (item) {
    var slide = make('div');
    var replacement = make('img', '', slide);
    replacement.src = 'responsive/' + item[0];
    replacement.alt = item[1];
    replacement.loading = 'lazy';
    return slide;
  }), brochureSection, 'sydney-detail-carousel');

  var venuesSection = section(at(8496, 'h2'), at(8492, 'body'), 'sydney-mobile-venues');
  var venueOne = make('div', 'sydney-venue-composite');
  venueOne.appendChild(image('0cb4ec114a2ef8fe41ba553bc424b293a8932183.png', 'Sydney Open venue brochure page'));
  venueOne.appendChild(image('c310cae99de86be61b4791e32a628bd0758128f7.png', 'Sydney Open venue brochure inset'));
  carousel('Sydney Open venue pages', [
    venueOne,
    image('82847b4babbc1b9856b4bf95868b8cd8ed44ccd9.png', 'Sydney Open venue checklist')
  ], venuesSection, 'sydney-venue-carousel');

  footer.id = 'sydney-mobile-footer';
  mobile.appendChild(footer);

  requestAnimationFrame(fitAll);
  window.addEventListener('resize', fitAll);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(fitAll);
    fitted.forEach(function (item) { observer.observe(item.frame); });
  }
  document.documentElement.classList.add('sydney-open-mobile-ready');
})();
