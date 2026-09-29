(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 767px)');
  if (!mq) return;
  function reload() { window.location.reload(); }
  if (mq.addEventListener) mq.addEventListener('change', reload);
  else if (mq.addListener) mq.addListener(reload);
  if (!mq.matches || window.innerWidth > 767) return;

  var path = decodeURIComponent(location.pathname);
  var fathers = /Domayne Father.s Day/i.test(path);
  var digital = /Domayne Digital Campaigns/i.test(path);
  if (!fathers && !digital) return;
  var root = Array.prototype.find.call(document.body.children, function (el) {
    return el.tagName === 'DIV' && parseFloat(el.style.width) === 1440;
  });
  if (!root) return;
  var original = Array.prototype.slice.call(root.children);
  var editorial = original.find(function (el) { return /ALL WORK/i.test(el.textContent || ''); });
  var info = original.find(function (el) { return /Project Background/i.test(el.textContent || ''); });
  var footer = original.find(function (el) { return /NEXT PROJECT/i.test(el.textContent || ''); });
  if (!editorial || !info) return;
  root.id = 'domayne-mobile-stage';
  root.dataset.mobileLayout = 'scaled-project';
  document.documentElement.classList.add('domayne-mobile-ready');
  document.documentElement.classList.add(fathers ? 'domayne-mobile-fathers' : 'domayne-mobile-digital');

  var main = document.createElement('main');
  main.id = 'domayne-mobile';
  root.insertBefore(main, root.firstChild);
  function el(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function heading(text, copy) {
    var section = el('section', 'domayne-mobile-section');
    var header = el('div', 'domayne-mobile-copy');
    header.appendChild(el('h2', '', text));
    if (copy) header.appendChild(el('p', '', copy));
    section.appendChild(header);
    main.appendChild(section);
    return section;
  }
  function source(text) {
    return original.find(function (node) { return (node.textContent || '').trim() === text; });
  }
  function imageFrom(node) {
    var img = node && node.querySelector('img');
    if (!img) return null;
    var clone = document.createElement('img');
    clone.src = img.getAttribute('src');
    clone.alt = img.alt || '';
    clone.loading = 'lazy';
    return clone;
  }
  function carousel(section, images, label) {
    var shell = el('div', 'domayne-mobile-carousel');
    shell.setAttribute('aria-label', label);
    var lane = el('div', 'domayne-mobile-carousel-lane');
    images.forEach(function (img) {
      var slide = el('div', 'domayne-mobile-carousel-slide');
      slide.appendChild(img);
      lane.appendChild(slide);
    });
    shell.appendChild(lane);
    ['previous', 'next'].forEach(function (direction) {
      var button = el('button', 'domayne-mobile-arrow domayne-mobile-arrow-' + direction, direction === 'previous' ? '‹' : '›');
      button.type = 'button';
      button.setAttribute('aria-label', direction === 'previous' ? 'Previous image' : 'Next image');
      button.addEventListener('click', function () {
        lane.scrollBy({ left: lane.clientWidth * (direction === 'previous' ? -1 : 1), behavior: 'smooth' });
      });
      shell.appendChild(button);
    });
    section.appendChild(shell);
    return lane;
  }

  var intro = el('section', 'domayne-mobile-intro');
  var edNodes = Array.prototype.slice.call(editorial.children);
  var back = edNodes.find(function (node) { return node.tagName === 'A'; });
  var label = edNodes.find(function (node) { return /·/.test(node.textContent || ''); });
  var title = edNodes.find(function (node) { return /Domayne/i.test(node.textContent || ''); });
  var backLink = el('a', 'domayne-mobile-back', '← ALL WORK');
  backLink.href = back && back.href && back.getAttribute('href') !== '#' ? back.href : '../work-index/index.html';
  intro.appendChild(backLink);
  if (label) intro.appendChild(el('p', 'domayne-mobile-label', label.textContent.trim()));
  if (title) intro.appendChild(el('h1', 'domayne-mobile-title', title.textContent.trim()));
  main.appendChild(intro);
  var details = el('section', 'domayne-mobile-details');
  Array.prototype.slice.call(info.children).forEach(function (row) {
    if (row.children.length < 2) return;
    var item = el('div', 'domayne-mobile-detail');
    item.appendChild(el('h2', '', row.children[0].textContent.trim()));
    item.appendChild(el('p', '', row.children[1].textContent.trim()));
    details.appendChild(item);
  });
  main.appendChild(details);

  if (fathers) {
    var landingCopy = original.find(function (node) { return /The landing page opens with/i.test(node.textContent || ''); });
    var landing = heading('Landing Page', landingCopy && landingCopy.textContent.trim());
    var cover = original.find(function (node) { return !!node.querySelector('img[alt="cover1 2"]'); });
    if (cover) landing.appendChild(imageFrom(cover));
    var windowSource = original.find(function (node) { return node.classList.contains('lp-window'); });
    if (windowSource) {
      var windowFrame = el('div', 'domayne-mobile-landing-window');
      var chrome = el('div', 'domayne-mobile-chrome');
      for (var i = 0; i < 3; i++) chrome.appendChild(document.createElement('i'));
      windowFrame.appendChild(chrome);
      var iframe = document.createElement('iframe');
      iframe.src = windowSource.querySelector('iframe').getAttribute('src');
      iframe.title = 'Domayne Father’s Day landing page';
      iframe.loading = 'lazy';
      windowFrame.appendChild(iframe);
      landing.appendChild(windowFrame);
    }

    var ads = heading('Animated Display Ads', source('Headline, date and offer are revealed in a short sequence, preserving legibility across compact square and horizontal advertising formats.')?.textContent);
    original.filter(function (node) { return !!node.querySelector('iframe[src*="images/banners/"]'); }).sort(function (a, b) {
      return parseFloat(a.style.top) - parseFloat(b.style.top);
    }).forEach(function (node) {
      var originalFrame = node.querySelector('iframe');
      var size = /300x250/.test(originalFrame.src) ? [300, 250] : [320, 50];
      var wrap = el('div', 'domayne-mobile-ad');
      wrap.dataset.sourceWidth = size[0];
      wrap.dataset.sourceHeight = size[1];
      var frame = document.createElement('iframe');
      frame.src = originalFrame.getAttribute('src');
      frame.title = originalFrame.title;
      frame.scrolling = 'no';
      frame.style.width = size[0] + 'px';
      frame.style.height = size[1] + 'px';
      wrap.appendChild(frame);
      ads.appendChild(wrap);
    });

    var edmSection = heading('EDM', source('Three email variations reuse the campaign image, colour system and product modules at different levels of urgency, while maintaining one clear path to shop.')?.textContent);
    var edms = original.filter(function (node) { return node.classList.contains('edm'); }).sort(function (a, b) {
      return parseFloat(a.style.left) - parseFloat(b.style.left);
    });
    var edmSlides = edms.map(function (node, index) {
      var viewport = el('div', 'domayne-mobile-edm-viewport');
      viewport.tabIndex = 0;
      viewport.setAttribute('role', 'region');
      viewport.setAttribute('aria-label', 'EDM ' + (index + 1) + ' — scroll vertically to read');
      var art = el('div', 'domayne-mobile-edm-art');
      art.style.width = (node.offsetWidth || 298) + 'px';
      art.style.height = (parseFloat(node.style.height) || node.offsetHeight) + 'px';
      art.innerHTML = node.innerHTML;
      viewport.appendChild(art);
      return viewport;
    });
    carousel(edmSection, edmSlides, 'Four Domayne Father’s Day emails');
  }

  if (digital) {
    var overview = heading('Digital Campaigns');
    var icons = el('div', 'domayne-mobile-icons');
    original.filter(function (node) { return node.classList.contains('domayne-feature-icon'); }).sort(function (a, b) {
      return parseFloat(a.style.top) - parseFloat(b.style.top);
    }).forEach(function (node) { icons.appendChild(imageFrom(node)); });
    overview.appendChild(icons);
    var desktop = original.find(function (node) { return !!node.querySelector('img[alt="outdoor-desktop 1"]'); });
    var phone = original.find(function (node) { return !!node.querySelector('img[alt="outdoor-phone 1"]'); });
    var mockups = el('div', 'domayne-mobile-mockups');
    if (desktop) mockups.appendChild(imageFrom(desktop));
    if (phone) mockups.appendChild(imageFrom(phone));
    overview.appendChild(mockups);

    var story = heading('Instagram Story', source('Vertical stories use room-scale photography, restrained typography and a single product message, keeping the call to action legible within a fast-moving social format.')?.textContent);
    carousel(story, original.filter(function (node) { return parseFloat(node.style.top) === 1693 && !!node.querySelector('img'); }).sort(function (a, b) {
      return parseFloat(a.style.left) - parseFloat(b.style.left);
    }).map(imageFrom), 'Instagram stories');

    var reel = heading('Instagram Reel', source('The reel moves between lifestyle detail and product-led frames, using consistent pacing and typography to turn the campaign into a concise social narrative.')?.textContent);
    var videoNode = original.find(function (node) { return !!node.querySelector('video[src*="outdoor-web.mp4"]'); });
    if (videoNode) {
      var video = document.createElement('video');
      video.src = videoNode.querySelector('video').getAttribute('src');
      video.width = 1080;
      video.height = 1920;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.controls = true;
      video.className = 'domayne-mobile-reel-video';
      reel.appendChild(video);
      if (window.IntersectionObserver) {
        var videoObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) video.play().catch(function () {});
            else video.pause();
          });
        }, { threshold: .2 });
        videoObserver.observe(video);
      }
    }
  }

  if (footer) {
    var next = (footer.textContent || '').match(/NEXT PROJECT\s*([^\n]*?)\s*NEXT\s*→/i);
    var footerSection = el('footer', 'domayne-mobile-footer');
    footerSection.appendChild(el('span', '', 'NEXT PROJECT'));
    footerSection.appendChild(el('span', '', next ? next[1].trim() : fathers ? 'DOMAYNE DIGITAL CAMPAIGNS' : 'ABLE AUSTRALIA'));
    var link = el('a', '', 'NEXT →');
    link.href = fathers ? '../Project — Domayne Digital Campaigns/index.html' : '../Project — Able Australia/index3.html';
    footerSection.appendChild(link);
    main.appendChild(footerSection);
  }
  function fitAds() {
    document.querySelectorAll('.domayne-mobile-ad').forEach(function (wrap) {
      var width = +wrap.dataset.sourceWidth;
      var height = +wrap.dataset.sourceHeight;
      var scale = wrap.clientWidth / width;
      wrap.style.height = Math.round(height * scale) + 'px';
      wrap.firstChild.style.transform = 'scale(' + scale + ')';
    });
  }
  requestAnimationFrame(fitAds);
  window.addEventListener('load', fitAds);
  window.addEventListener('resize', fitAds);
  if (window.ResizeObserver) {
    var adObserver = new ResizeObserver(fitAds);
    document.querySelectorAll('.domayne-mobile-ad').forEach(function (wrap) { adObserver.observe(wrap); });
  }
})();
