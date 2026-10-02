(function () {
  'use strict';
  var photographs = [
    { file: '01.jpg', caption: 'Night Walk' },
    { file: '02.jpg', caption: 'Manly Sunset' },
    { file: '03.jpg', caption: 'Tokyo Night' },
    { file: '04.jpg', caption: 'Tokyo Summer' },
    { file: '05.jpg', caption: 'Fushimi Inari' },
    { file: '06.jpg', caption: 'Summer Memory' },
    { file: '07.jpg', caption: 'Evening Commute' },
    { file: '08.jpg', caption: 'People on the Bridge' },
    { file: '09.jpg', caption: 'Framing the Light' },
    { file: '10.jpg', caption: 'Spring' },
    { file: '11.jpg', caption: 'Before Spring' },
    { file: '12.jpg', caption: 'Garden Angel' },
    { file: '13.jpg', caption: 'Hillside Palms' },
    { file: '14.jpg', caption: 'Rider in the Afternoon' },
    { file: '15.jpg', caption: 'Carousel Night' },
    { file: '16.jpg', caption: 'Amusement Park' },
    { file: '17.jpg', caption: 'Hide and Seek' },
    { file: '18.jpg', caption: 'Bondi Summer' },
    { file: '19.jpg', caption: 'Golden Hour' },
    { file: '20.jpg', caption: 'Before the Rain' },
    { file: '21.jpg', caption: 'Low Tide' }
  ];
  var illustrations = [
    { file: '瑞士蛋糕卷.png', caption: 'Swiss Roll' },
    { file: '可露丽.png', caption: 'Canelé' },
    { file: 'cheese cake.png', caption: 'Cheesecake' },
    { file: '玉米吐司.png', caption: 'Corn Toast' },
    { file: '面包.png', caption: 'Bread' },
    { file: '一碗梨.png', caption: 'A Bowl of Pears' },
    { file: '一串西红柿.png', caption: 'Tomatoes on the Vine' },
    { file: '新鲜蔬菜.png', caption: 'Fresh Vegetables' },
    { file: '豆荚和花.png', caption: 'Peas and Flowers' },
    { file: '花店入口.jpg', caption: 'Flower Shop Entrance' },
    { file: '茶杯兔.png', caption: 'Teacup Rabbit' },
    { file: '小马黄.png.png', caption: 'Little Horse' },
    { file: '马乐园.png', caption: 'Horse Playground' },
    { file: '豹子.png', caption: 'Leopard' },
    { file: '山坡.png', caption: 'Hillside' },
    { file: '树和风.png', caption: 'Trees and Wind' }
  ];
  var isPhotography = document.body.dataset.gallery !== 'illustration';
  var items = isPhotography ? photographs : illustrations;
  var track = document.querySelector('.film-track');
  var windowFrame = document.querySelector('.film-window');
  var caption = document.querySelector('.film-caption');
  var count = document.querySelector('.film-count');
  var previous = document.querySelector('.archive-arrow-prev');
  var next = document.querySelector('.archive-arrow-next');
  if (!track || !windowFrame || !caption || !count || !previous || !next) return;
  var index = 0;
  var moving = false;
  var touchStart = null;
  var autoplayTimer = 0;
  var transitionTimer = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function wrap(number) { return (number + items.length) % items.length; }
  function stepWidth() {
    var element = track.querySelector('.film-slide');
    return element.offsetWidth + parseFloat(getComputedStyle(track).gap || '0');
  }
  function makeSlide(number, visible) {
    var item = items[wrap(number)];
    var element = document.createElement('div');
    var img = document.createElement('img');
    element.className = 'film-slide';
    element.setAttribute('aria-hidden', visible ? 'false' : 'true');
    img.src = 'images/' + item.file;
    img.alt = visible ? item.caption : '';
    img.decoding = 'async';
    element.appendChild(img);
    return element;
  }
  function sizeMobileFrame() {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      windowFrame.style.height = '';
      return;
    }
    var current = track.children[1] && track.children[1].querySelector('img');
    if (!current || !current.naturalWidth) return;
    var fullHeight = windowFrame.clientWidth * current.naturalHeight / current.naturalWidth;
    windowFrame.style.height = Math.min(fullHeight, window.innerHeight * .58, 520) + 'px';
  }
  function render() {
    track.style.transition = 'none';
    track.replaceChildren(makeSlide(index - 1, false), makeSlide(index, true), makeSlide(index + 1, false));
    var current = track.children[1].querySelector('img');
    current.addEventListener('load', sizeMobileFrame, { once: true });
    sizeMobileFrame();
    track.style.transform = 'translate3d(' + (-stepWidth()) + 'px,0,0)';
    caption.textContent = items[index].caption;
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
  }
  function scheduleAutoplay() {
    window.clearTimeout(autoplayTimer);
    if (!isPhotography || moving || document.hidden || reduceMotion.matches || windowFrame.contains(document.activeElement)) return;
    autoplayTimer = window.setTimeout(function () { move(1); }, 5600);
  }
  function move(direction) {
    if (moving) return;
    window.clearTimeout(autoplayTimer);
    if (reduceMotion.matches) {
      index = wrap(index + direction);
      render();
      return;
    }
    moving = true;
    var distance = stepWidth();
    var completed = false;
    function finish() {
      if (completed) return;
      completed = true;
      track.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(transitionTimer);
      windowFrame.classList.remove('is-projecting');
      index = wrap(index + direction);
      render();
      moving = false;
      scheduleAutoplay();
    }
    function onTransitionEnd(event) {
      if (event.target === track && event.propertyName === 'transform') finish();
    }
    track.addEventListener('transitionend', onTransitionEnd);
    windowFrame.classList.add('is-projecting');
    void track.offsetWidth;
    track.style.transition = 'transform 820ms cubic-bezier(.45,.02,.55,.98)';
    track.style.transform = 'translate3d(' + (direction > 0 ? -2 * distance : 0) + 'px,0,0)';
    transitionTimer = window.setTimeout(finish, 1050);
  }

  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  windowFrame.addEventListener('touchstart', function (event) {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });
  windowFrame.addEventListener('touchend', function (event) {
    if (touchStart === null) return;
    var delta = event.changedTouches[0].clientX - touchStart;
    touchStart = null;
    if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('visibilitychange', scheduleAutoplay);
  windowFrame.addEventListener('focusin', function () { window.clearTimeout(autoplayTimer); });
  windowFrame.addEventListener('focusout', scheduleAutoplay);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', scheduleAutoplay);
  window.addEventListener('resize', function () { if (!moving) render(); });
  render();
  scheduleAutoplay();
}());
