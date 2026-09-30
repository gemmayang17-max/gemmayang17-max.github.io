(function () {
  'use strict';
  // Captions retain descriptive source filenames; camera-numbered files use short visual titles.
  var photos = [
    { file: '01.jpg', caption: 'Sydney Night' },
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
  var track = document.querySelector('.film-track');
  var windowFrame = document.querySelector('.film-window');
  var caption = document.querySelector('.film-caption');
  var count = document.querySelector('.film-count');
  var marks = Array.prototype.slice.call(document.querySelectorAll('.film-marks i'));
  var previous = document.querySelector('.archive-arrow-prev');
  var next = document.querySelector('.archive-arrow-next');
  var index = 0;
  var moving = false;
  var touchStart = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function wrap(number) { return (number + photos.length) % photos.length; }
  function stepWidth() {
    var slide = track.querySelector('.film-slide');
    return slide.offsetWidth + parseFloat(getComputedStyle(track).gap || '0');
  }
  function slide(number, visible) {
    var photo = photos[wrap(number)];
    var element = document.createElement('div');
    var img = document.createElement('img');
    element.className = 'film-slide';
    element.setAttribute('aria-hidden', visible ? 'false' : 'true');
    img.src = 'images/' + photo.file;
    img.alt = visible ? photo.caption : '';
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
    track.replaceChildren(slide(index - 1, false), slide(index, true), slide(index + 1, false));
    var current = track.children[1].querySelector('img');
    current.addEventListener('load', sizeMobileFrame, { once: true });
    sizeMobileFrame();
    track.style.transform = 'translate3d(' + (-stepWidth()) + 'px,0,0)';
    caption.textContent = photos[index].caption;
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
    var activeMark = Math.min(4, Math.floor(index * 5 / photos.length));
    marks.forEach(function (mark, position) { mark.classList.toggle('active', position === activeMark); });
  }
  function move(direction) {
    if (moving) return;
    if (reduceMotion.matches) { index = wrap(index + direction); render(); return; }
    moving = true;
    var distance = stepWidth();
    track.style.transition = 'transform 480ms cubic-bezier(.22,1,.36,1)';
    track.style.transform = 'translate3d(' + (direction > 0 ? -2 * distance : 0) + 'px,0,0)';
    function finish() {
      track.removeEventListener('transitionend', finish);
      index = wrap(index + direction);
      render();
      moving = false;
    }
    track.addEventListener('transitionend', finish);
  }
  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  document.querySelector('.film-window').addEventListener('touchstart', function (event) {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });
  document.querySelector('.film-window').addEventListener('touchend', function (event) {
    if (touchStart === null) return;
    var delta = event.changedTouches[0].clientX - touchStart;
    touchStart = null;
    if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
  }, { passive: true });
  window.addEventListener('resize', function () { if (!moving) render(); });
  render();
}());
