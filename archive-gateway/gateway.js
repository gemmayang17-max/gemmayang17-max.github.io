(function () {
  'use strict';
  var gateway = document.querySelector('.gateway');
  if (!gateway) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  var horse = gateway.querySelector('.horse-run img');
  function start() {
    gateway.classList.remove('is-pending');
    gateway.classList.add('is-animated');
  }
  function showChoicesWithoutHorse() {
    gateway.classList.remove('is-pending');
  }
  if (horse.complete) {
    if (horse.naturalWidth) start();
    else showChoicesWithoutHorse();
  } else {
    horse.addEventListener('load', start, { once: true });
    horse.addEventListener('error', showChoicesWithoutHorse, { once: true });
  }
}());
