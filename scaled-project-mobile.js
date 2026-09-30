(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 767px)');
  if (!mq) return;

  function reloadAcrossBreakpoint() { window.location.reload(); }
  if (mq.addEventListener) mq.addEventListener('change', reloadAcrossBreakpoint);
  else if (mq.addListener) mq.addListener(reloadAcrossBreakpoint);

  var root = document.querySelector('[data-figma-artboard]') ||
    document.querySelector('#viewport > div') ||
    Array.prototype.find.call(document.body.children, function (node) {
      return node.tagName === 'DIV' && parseFloat(node.style.width) === 1440;
    });
  if (!root) return;
  var path = decodeURIComponent(location.pathname).toLowerCase();
  var preserveDesktopArtwork = /custom typeface & editorial series|onemorecase|sydney candle co|gege pancake shop|colour u/.test(path);
  var isTypeProject = /custom typeface & editorial series/.test(path);
  var isOneMoreCase = /onemorecase/.test(path);
  var isGeGe = /gege pancake shop/.test(path);
  var isCandle = /sydney candle co/.test(path);
  var isColourU = /colour u/.test(path);

  if (!mq.matches || window.innerWidth > 767 || document.getElementById('scaled-project-mobile')) return;

  var children = Array.prototype.slice.call(root.children);
  var editorial = children.find(function (node) {
    return /ALL WORK/i.test(node.textContent || '') && !/NEXT PROJECT/i.test(node.textContent || '');
  });
  var info = children.find(function (node) {
    return /Project Background/i.test(node.textContent || '');
  });
  var header = children.find(function (node) {
    var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
    return /GEMMA YANG/i.test(text) && /GEMMAYANG22@GMAIL\.COM/i.test(text);
  });
  var footer = children.find(function (node) {
    return /NEXT PROJECT/i.test(node.textContent || '');
  });
  if (!editorial || !info || !header) return;

  root.id = root.id || 'stage';
  root.dataset.mobileLayout = 'scaled-project';
  if (preserveDesktopArtwork) document.documentElement.classList.add('scaled-project-preserve-art');
  if (isTypeProject) document.documentElement.classList.add('scaled-project-type');
  if (isOneMoreCase) document.documentElement.classList.add('scaled-project-omc');
  if (isGeGe) document.documentElement.classList.add('scaled-project-gege');
  if (isCandle) document.documentElement.classList.add('scaled-project-candle');
  if (isColourU) document.documentElement.classList.add('scaled-project-colour-u');

  editorial.id = 'scaled-project-editorial';
  info.id = 'scaled-project-info';
  Array.prototype.slice.call(editorial.children).forEach(function (node) {
    if (node.tagName === 'A' || /ALL WORK/i.test(node.textContent || '')) node.classList.add('scaled-project-back');
    else if (/·/.test(node.textContent || '')) node.classList.add('scaled-project-label');
    else node.classList.add('scaled-project-title');
  });
  Array.prototype.slice.call(info.children).forEach(function (row) {
    row.classList.add('scaled-project-info-row');
    if (row.children[0]) row.children[0].classList.add('scaled-project-info-key');
    if (row.children[1]) row.children[1].classList.add('scaled-project-info-value');
  });

  var mobile = document.createElement('main');
  mobile.id = 'scaled-project-mobile';
  mobile.setAttribute('aria-label', 'Project case study');
  root.insertBefore(mobile, root.firstChild);

  var intro = document.createElement('section');
  intro.className = 'scaled-project-mobile-intro';
  intro.appendChild(editorial);
  mobile.appendChild(intro);

  var details = document.createElement('section');
  details.className = 'scaled-project-mobile-details';
  details.appendChild(info);
  mobile.appendChild(details);

  var artwork = children.filter(function (node) {
    return node !== editorial && node !== info && node !== header && node !== footer;
  });
  function isReadableArtwork(node) {
    var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
    return !!text && !node.querySelector('img,video,svg,iframe,.img,.clip');
  }
  var narrative = artwork.filter(isReadableArtwork).sort(function (a, b) { return topOf(a) - topOf(b); });
  artwork = artwork.filter(function (node) { return !isReadableArtwork(node); });

  if (narrative.length && !preserveDesktopArtwork) {
    var notes = document.createElement('section');
    notes.className = 'scaled-project-mobile-notes';
    narrative.forEach(function (node) {
      var originalFontSize = parseFloat(node.style.fontSize || node.style.font) || 0;
      node.classList.add(originalFontSize >= 28 ? 'scaled-project-section-title' : 'scaled-project-section-copy');
      notes.appendChild(node);
    });
    mobile.appendChild(notes);
  }
  function topOf(node) {
    var value = parseFloat(node.style.top);
    return isNaN(value) ? 0 : value;
  }
  var artSection = document.createElement('section');
  artSection.className = 'scaled-project-mobile-art-section';
  mobile.appendChild(artSection);
  var fittedArtwork = [];
  function prepareArtwork(node) {
    Array.prototype.slice.call(node.querySelectorAll('[data-rv]')).concat(node.hasAttribute('data-rv') ? [node] : []).forEach(function (reveal) {
      reveal.removeAttribute('data-rv');
      reveal.removeAttribute('data-rv-anchor');
      reveal.style.opacity = '1';
    });
  }

  if (isTypeProject) {
    artSection.classList.add('scaled-project-type-art');
    var imageRoot = 'images/';
    function typeImage(src, alt, className) {
      var image = document.createElement('img');
      image.src = imageRoot + src;
      image.alt = alt;
      image.loading = 'lazy';
      if (className) image.className = className;
      return image;
    }
    function typeSection(title, copy, modifier) {
      var section = document.createElement('section');
      section.className = 'type-mobile-section ' + (modifier || '');
      var text = document.createElement('div');
      text.className = 'type-mobile-copy';
      var heading = document.createElement('h2');
      heading.className = 'type-mobile-heading';
      heading.textContent = title;
      var paragraph = document.createElement('p');
      paragraph.textContent = copy;
      text.appendChild(heading);
      text.appendChild(paragraph);
      section.appendChild(text);
      return section;
    }
    function typeCarousel(label, slides) {
      var carousel = document.createElement('div');
      carousel.className = 'type-mobile-carousel';
      carousel.setAttribute('aria-label', label);
      var lane = document.createElement('div');
      lane.className = 'type-mobile-carousel-lane';
      slides.forEach(function (slide) {
        slide.classList.add('type-mobile-carousel-slide');
        lane.appendChild(slide);
      });
      function arrow(direction) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'type-mobile-carousel-arrow type-mobile-carousel-arrow-' + direction;
        button.setAttribute('aria-label', direction === 'previous' ? 'Previous image' : 'Next image');
        button.innerHTML = '<svg viewBox="0 0 20 32" aria-hidden="true"><path d="M17 3 4 16l13 13"/></svg>';
        if (direction === 'next') button.querySelector('svg').style.transform = 'rotate(180deg)';
        button.addEventListener('click', function () {
          lane.scrollBy({ left: (direction === 'previous' ? -1 : 1) * lane.clientWidth, behavior: 'smooth' });
        });
        return button;
      }
      carousel.appendChild(lane);
      carousel.appendChild(arrow('previous'));
      carousel.appendChild(arrow('next'));
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { lane.scrollLeft = 0; });
      });
      return carousel;
    }

    var fontSection = typeSection(
      'Font',
      'A typeface inspired by the form of an anchor, translating its structural qualities into a bold and structured letter system with a subtle vintage and metallic character.',
      'type-mobile-font'
    );
    fontSection.appendChild(typeImage('0ea676caae1d4cd0bdbef98c9e437db12b7238bc.png', 'Custom anchor-inspired alphabet', 'type-mobile-font-image'));
    artSection.appendChild(fontSection);

    var coverSection = typeSection(
      'Book Cover',
      'A series of three book covers inspired by encyclopedic themes across different categories. The custom typeface is applied to the titles, accompanied by hand-drawn illustrations to create a cohesive visual system.',
      'type-mobile-book-cover'
    );
    var coverObjects = document.createElement('div');
    coverObjects.className = 'type-mobile-cover-objects';
    coverObjects.appendChild(typeImage('cbb28251da622319af77bd39171176534e0d491d.png', 'Fungi book cover mockup', 'type-mobile-cover-hero'));
    var coverObjectRow = document.createElement('div');
    coverObjectRow.className = 'type-mobile-cover-row';
    coverObjectRow.appendChild(typeImage('1238f60c2abecac863bb14db90fa99486da8eb46.png', 'Flowers book cover mockup'));
    coverObjectRow.appendChild(typeImage('082a1c2b52d2c37543c1d256af731efe4190cb49.png', 'Shells book cover mockup'));
    coverObjects.appendChild(coverObjectRow);
    coverSection.appendChild(coverObjects);
    var coverFlats = document.createElement('div');
    coverFlats.className = 'type-mobile-cover-flats';
    coverFlats.appendChild(typeImage('9554b3b55242f525faeb7bfcd6b5e33e90925611.png', 'Flowers full book jacket', 'type-mobile-cover-flat-hero'));
    var coverFlatRow = document.createElement('div');
    coverFlatRow.className = 'type-mobile-cover-row';
    coverFlatRow.appendChild(typeImage('8af858f3ed47a6305bdf996897e3281b5b78117d.png', 'Fungi full book jacket'));
    coverFlatRow.appendChild(typeImage('7e27f8d4d72eb2536b079caebfef1d0f937e8a79.png', 'Shells full book jacket'));
    coverFlats.appendChild(coverFlatRow);
    coverSection.appendChild(coverFlats);
    artSection.appendChild(coverSection);

    var internalSection = typeSection(
      'Internal Page Design',
      'Three layout variations exploring different margin settings and grid systems to create distinct page structures and reading rhythms.',
      'type-mobile-internal'
    );
    var internalGrid = document.createElement('div');
    internalGrid.className = 'type-mobile-internal-grid';
    var mushroomDecoration = document.createElement('div');
    mushroomDecoration.className = 'type-mobile-internal-decoration';
    mushroomDecoration.appendChild(typeImage('c9bc0c797169d1e6f7b155484abea2874f398dc1.png', 'Hand-drawn mushroom decoration'));
    internalGrid.appendChild(mushroomDecoration);
    internalGrid.appendChild(typeImage('76f28e47bfd2c072ab9f6cdb2ea1f5cb3c510912.png', 'Editorial page layout one', 'type-mobile-internal-primary'));
    internalGrid.appendChild(typeImage('31edaa257b9b7c01add79b7865047e5180786643.png', 'Editorial page layout two', 'type-mobile-internal-large'));
    internalGrid.appendChild(typeImage('8900c51da2396207a6b4866c78c28883a3db9d46.png', 'Editorial page layout three', 'type-mobile-internal-large'));
    internalGrid.appendChild(typeImage('b19c50844cd2b5fb1e4e657426b2e5615d0e6d3b.png', 'Editorial detail one', 'type-mobile-internal-detail'));
    internalGrid.appendChild(typeImage('8eaf1fc09d8e648d1ede08a8ecaada7cd8d6eb58.png', 'Editorial detail two', 'type-mobile-internal-detail'));
    internalGrid.appendChild(typeImage('8a03be020377bc1acf9087d520af8d512330a5e1.png', 'Editorial detail three', 'type-mobile-internal-detail'));
    internalSection.appendChild(internalGrid);
    artSection.appendChild(internalSection);

    var finalSection = typeSection(
      'Final Book Series',
      'The finished volumes bring the cover system and internal grid together as one editorial set. Closed covers establish each subject through colour and illustration; open spreads reveal how the same visual language supports longer-form reading.',
      'type-mobile-final'
    );
    var coverPairs = [
      ['3d0161608bf82c6e87a0ab6b8ea4d63b16fb6fa1.png', '36b0a0cd4b45618b07044a8637c94cac249eae09.png', 'Flowers cover and back cover'],
      ['536db77630ef215e44ae6be99000d7cbf5b49acd.png', '865ed94b1a0e75fb26bd85b2157d7bf90bbd9bb4.png', 'Fungi cover and back cover'],
      ['a44d617c39258e7e6142c2e99bad7db9b064ca06.png', '8d42399724e7940ae87c2b6ee2bf957fa9c23890.png', 'Shells cover and back cover']
    ].map(function (pair) {
      var slide = document.createElement('div');
      slide.className = 'type-mobile-cover-pair';
      slide.appendChild(typeImage(pair[0], pair[2] + ', front'));
      slide.appendChild(typeImage(pair[1], pair[2] + ', back'));
      return slide;
    });
    finalSection.appendChild(typeCarousel('Final book covers', coverPairs));
    var shells = document.createElement('div');
    shells.className = 'type-mobile-shells';
    [
      ['09fba983ca467fc5b43c4288fcfed9fd2e237680.png', 'Conch shell'],
      ['88bfef3a682e3e0bd053ddf77e551303afcd9fc2.png', 'Cowrie shell'],
      ['1ed30589a2f9a560f2d5f3a23712eab6b3a5d4ef.png', 'Spiral shell'],
      ['05dfcee13997b5cd74550c0a34ebaa56be2eb609.png', 'Scallop shell'],
      ['a67ac732d356778883bf3be90cdcbf6025274ded.png', 'Murex shell']
    ].forEach(function (shell) { shells.appendChild(typeImage(shell[0], shell[1])); });
    finalSection.appendChild(shells);
    var spreads = [
      ['ffdc53257e0a617872cfe7dec854cafcda2c8348.png', 'Flowers internal spread'],
      ['2b7da3d69d890ae1f1b0fbee5126b766b725d2be.png', 'Fungi internal spread'],
      ['d55de25525d39bd8f2126389772f91b2af480145.png', 'Shells internal spread']
    ].map(function (spread) {
      var slide = document.createElement('div');
      slide.appendChild(typeImage(spread[0], spread[1]));
      return slide;
    });
    finalSection.appendChild(typeCarousel('Final book internal spreads', spreads));
    artSection.appendChild(finalSection);
  } else if (isColourU) {
    artSection.classList.add('scaled-project-colour-u-art');
    function cuText(value) {
      return narrative.find(function (node) { return (node.textContent || '').trim() === value; });
    }
    function cuSection(className) {
      var node = document.createElement('section');
      node.className = 'cu-mobile-section ' + className;
      artSection.appendChild(node);
      return node;
    }
    function cuCopy(section, heading, copy) {
      var group = document.createElement('div');
      group.className = 'cu-mobile-copy';
      [heading, copy].forEach(function (value, index) {
        var source = cuText(value);
        if (!source) return;
        var node = document.createElement(index ? 'p' : 'h2');
        node.textContent = source.textContent;
        group.appendChild(node);
      });
      section.appendChild(group);
    }
    function cuFrame(section, className, width, height, nodes, left, top) {
      var frame = document.createElement('div');
      frame.className = 'scaled-project-mobile-art-frame cu-mobile-frame ' + className;
      var canvas = document.createElement('div');
      canvas.className = 'scaled-project-mobile-art-canvas';
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      nodes.forEach(function (node) {
        node.style.left = ((parseFloat(node.style.left) || 0) - left) + 'px';
        node.style.top = ((parseFloat(node.style.top) || 0) - top) + 'px';
        if (className === 'cu-mobile-identity-frame' && node.tagName.toLowerCase() === 'svg') {
          var logoGuard = document.createElement('div');
          logoGuard.className = 'cu-mobile-logo-guard';
          logoGuard.appendChild(node);
          canvas.appendChild(logoGuard);
        } else canvas.appendChild(node);
      });
      frame.appendChild(canvas);
      section.appendChild(frame);
      fittedArtwork.push({ frame: frame, canvas: canvas, height: height, sourceWidth: width,
        cropTop: className === 'cu-mobile-hero-frame' ? 54 : 0 });
    }
    var hero = cuSection('cu-mobile-hero');
    var heroArtwork = artwork.find(function (node) { return node.classList.contains('cu-stage'); });
    if (heroArtwork) cuFrame(hero, 'cu-mobile-hero-frame', 1467, 943, [heroArtwork], -13, 710);

    var identity = cuSection('cu-mobile-identity');
    cuCopy(identity, 'Colour U Identity', 'The identity reduces the project idea to one repeatable mark. Its half-arch and paired blocks scale from app icon to wordmark and public-facing pattern without losing recognition.');
    var identityGraphic = artwork.filter(function (node) {
      var top = topOf(node);
      return (node.tagName.toLowerCase() === 'svg' && top === 1902) ||
        (top === 2134 && node.tagName === 'DIV');
    }).concat(narrative.filter(function (node) {
      return /^(Colour U|Color Your Life|#A1D0A3|#F68ECA)$/.test((node.textContent || '').trim());
    }));
    cuFrame(identity, 'cu-mobile-identity-frame', 690, 264, identityGraphic, 664, 1902);

    var poster = cuSection('cu-mobile-poster');
    cuCopy(poster, 'Poster', 'Repeating the identity mark at civic scale turns a small app symbol into an immediately recognisable public graphic, linking individual participation with the shared urban environment.');
    var posterAnimation = artwork.find(function (node) { return node.classList.contains('cu-gif'); });
    if (posterAnimation) cuFrame(poster, 'cu-mobile-poster-frame', 799, 558, [posterAnimation], -3, 2379);

    var appSection = cuSection('cu-mobile-app');
    cuCopy(appSection, 'Mobile App', 'The interface carries the same arch motif through onboarding, step conversion, plant selection, redemption and community sharing. Consistent spacing and colour make the multi-step journey easy to scan.');
    var screenNodes = artwork.filter(function (node) {
      var top = topOf(node);
      return (top === 3420 || top === 4000) && !!node.querySelector('img');
    }).sort(function (a, b) {
      return topOf(a) - topOf(b) || parseFloat(a.style.left) - parseFloat(b.style.left);
    });
    var carousel = document.createElement('div');
    carousel.className = 'cu-mobile-carousel';
    carousel.setAttribute('aria-label', 'Colour U app screens');
    var lane = document.createElement('div');
    lane.className = 'cu-mobile-carousel-lane';
    screenNodes.forEach(function (original, index) {
      var slide = document.createElement('div');
      slide.className = 'cu-mobile-carousel-slide';
      var image = original.querySelector('img').cloneNode(false);
      image.removeAttribute('style');
      image.loading = index < 2 ? 'eager' : 'lazy';
      slide.appendChild(image);
      lane.appendChild(slide);
    });
    carousel.appendChild(lane);
    ['previous', 'next'].forEach(function (direction) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'cu-mobile-carousel-arrow cu-mobile-carousel-arrow-' + direction;
      button.setAttribute('aria-label', direction === 'previous' ? 'Previous app screen' : 'Next app screen');
      button.innerHTML = '<svg viewBox="0 0 20 32" aria-hidden="true"><path d="M17 3 4 16l13 13"/></svg>';
      if (direction === 'next') button.querySelector('svg').style.transform = 'rotate(180deg)';
      button.addEventListener('click', function () {
        lane.scrollBy({ left: lane.clientWidth * (direction === 'previous' ? -1 : 1), behavior: 'smooth' });
      });
      carousel.appendChild(button);
    });
    appSection.appendChild(carousel);
  } else if (isOneMoreCase) {
    artSection.classList.add('scaled-project-omc-art');
    var omcImageRoot = 'images/';
    function omcImage(src, alt, className) {
      var image = document.createElement('img');
      image.src = omcImageRoot + src;
      image.alt = alt;
      image.loading = 'lazy';
      if (className) image.className = className;
      return image;
    }
    function omcSection(title, copy, modifier) {
      var section = document.createElement('section');
      section.className = 'omc-mobile-section ' + (modifier || '');
      if (title) {
        var heading = document.createElement('h2');
        heading.className = 'omc-mobile-heading';
        heading.textContent = title;
        section.appendChild(heading);
      }
      if (copy) {
        var paragraph = document.createElement('p');
        paragraph.className = 'omc-mobile-copy';
        paragraph.textContent = copy;
        section.appendChild(paragraph);
      }
      return section;
    }
    function omcCarousel(label, slides, modifier) {
      var carousel = document.createElement('div');
      carousel.className = 'omc-mobile-carousel ' + (modifier || '');
      carousel.setAttribute('aria-label', label);
      var lane = document.createElement('div');
      lane.className = 'omc-mobile-carousel-lane';
      slides.forEach(function (slide) {
        slide.classList.add('omc-mobile-carousel-slide');
        lane.appendChild(slide);
      });
      function arrow(direction) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'omc-mobile-carousel-arrow omc-mobile-carousel-arrow-' + direction;
        button.setAttribute('aria-label', direction === 'previous' ? 'Previous image' : 'Next image');
        button.innerHTML = '<svg viewBox="0 0 20 32" aria-hidden="true"><path d="M17 3 4 16l13 13"/></svg>';
        if (direction === 'next') button.querySelector('svg').style.transform = 'rotate(180deg)';
        button.addEventListener('click', function () {
          lane.scrollBy({ left: (direction === 'previous' ? -1 : 1) * lane.clientWidth, behavior: 'smooth' });
        });
        return button;
      }
      carousel.appendChild(lane);
      carousel.appendChild(arrow('previous'));
      carousel.appendChild(arrow('next'));
      return carousel;
    }

    /* Keep the approved opening composition. Retail Packaging is rebuilt as
       its own responsive section immediately below so its artwork and motion
       cannot become separated from its explanation. */
    var legacyArtwork = artwork.filter(function (node) { return topOf(node) >= 821 && topOf(node) < 1400; });
    legacyArtwork.forEach(function (node) {
      if (node.querySelector('img[alt="onemorecase fox"]')) node.style.top = '931px';
    });
    var legacyNarrative = narrative.filter(function (node) { return topOf(node) < 1400; });
    var legacyTop = legacyArtwork.reduce(function (minimum, node) {
      var top = topOf(node);
      return top > 0 ? Math.min(minimum, top) : minimum;
    }, Infinity);
    if (!isFinite(legacyTop)) legacyTop = 0;
    var legacyEnd = legacyArtwork.reduce(function (maximum, node) {
      return Math.max(maximum, topOf(node) + (parseFloat(node.style.height) || node.offsetHeight || 0));
    }, legacyTop);
    var legacyHeight = Math.max(1, legacyEnd - legacyTop);
    var legacyFrame = document.createElement('div');
    legacyFrame.className = 'scaled-project-mobile-art-frame omc-mobile-legacy-frame';
    var legacyCanvas = document.createElement('div');
    legacyCanvas.className = 'scaled-project-mobile-art-canvas';
    legacyCanvas.style.width = '1440px';
    legacyCanvas.style.height = legacyHeight + 'px';
    legacyArtwork.forEach(function (node) {
      var top = topOf(node);
      node.dataset.scaledProjectTop = String(top);
      if (top > 0) node.style.top = (top - legacyTop) + 'px';
      prepareArtwork(node);
      legacyCanvas.appendChild(node);
    });
    legacyFrame.appendChild(legacyCanvas);
    var legacyTextLayer = document.createElement('div');
    legacyTextLayer.className = 'scaled-project-mobile-text-layer';
    var legacyGroups = [];
    legacyNarrative.forEach(function (node) {
      var top = topOf(node);
      var group = legacyGroups[legacyGroups.length - 1];
      if (!group || top - group.start >= 180) {
        group = { start: top, end: top, nodes: [] };
        legacyGroups.push(group);
      }
      group.end = Math.max(group.end, top + (parseFloat(node.style.height) || node.offsetHeight || 24));
      group.nodes.push(node);
    });
    legacyGroups.forEach(function (group) {
      var wrapper = document.createElement('div');
      wrapper.className = 'scaled-project-text-group scaled-project-art-center';
      wrapper.dataset.scaledProjectTop = String(group.start);
      wrapper.dataset.scaledProjectEnd = String(group.end);
      group.nodes.forEach(function (node) {
        var originalFontSize = parseFloat(node.style.fontSize || node.style.font) || 0;
        node.classList.add(originalFontSize >= 28 ? 'scaled-project-art-title' : 'scaled-project-art-copy');
        node.removeAttribute('style');
        wrapper.appendChild(node);
      });
      legacyTextLayer.appendChild(wrapper);
    });
    legacyFrame.appendChild(legacyTextLayer);
    artSection.appendChild(legacyFrame);
    fittedArtwork.push({ frame: legacyFrame, canvas: legacyCanvas, height: legacyHeight, artwork: legacyArtwork, artworkTop: legacyTop, textLayer: legacyTextLayer });

    var postersSection = omcSection(
      'Campaign Posters',
      'These posters were created for seasonal launches and brand anniversaries. I used recurring characters, a limited colour palette and generous spacing to keep the campaigns connected, while giving each one a slightly different mood.',
      'omc-mobile-posters'
    );
    var postersGrid = document.createElement('div');
    postersGrid.className = 'omc-mobile-posters-grid';
    [
      ['c4044dc68af6b7633a47473a7061f79c7276be3c.png', 'Christmas campaign poster'],
      ['f61716e2a6e563c111c85018f7aeb3af54b3b562.png', 'Year of the Tiger campaign poster'],
      ['cd5c422ac0e6881b1b61f044888bc5b7bf956a3e.png', 'New Year campaign poster'],
      ['afe4ce269b3a8413b30b72223cc1e53a0eaa53f2.png', 'Anniversary sale campaign poster']
    ].forEach(function (item) { postersGrid.appendChild(omcImage(item[0], item[1])); });
    postersSection.appendChild(postersGrid);
    artSection.appendChild(postersSection);

    var packagingSection = omcSection(
      'Retail Packaging System',
      'I designed the boxes and hang tags as a system that could grow with the product range. The illustrated boxes carry the main visual idea, while the removable tags hold the practical product details and make new variants easier to introduce.',
      'omc-mobile-packaging'
    );
    var packagingArtwork = artwork.filter(function (node) {
      var top = topOf(node);
      return top >= 3000 && top < 3811;
    });
    var packagingFrame = document.createElement('div');
    packagingFrame.className = 'scaled-project-mobile-art-frame omc-mobile-packaging-frame';
    var packagingCanvas = document.createElement('div');
    packagingCanvas.className = 'scaled-project-mobile-art-canvas';
    packagingCanvas.style.width = '1440px';
    packagingCanvas.style.height = '700px';
    packagingArtwork.forEach(function (node) {
      var top = topOf(node);
      node.dataset.scaledProjectTop = String(top);
      node.style.top = (top - 3000) + 'px';
      prepareArtwork(node);
      packagingCanvas.appendChild(node);
    });
    packagingFrame.appendChild(packagingCanvas);
    packagingSection.appendChild(packagingFrame);
    artSection.appendChild(packagingSection);
    fittedArtwork.push({ frame: packagingFrame, canvas: packagingCanvas, height: 700, artwork: packagingArtwork, artworkTop: 3000, textLayer: null });

    var mugSection = omcSection(
      'Coffee Mug',
      'The coffee mug collection takes a more vintage inspired direction, bringing illustrated fruit, vegetables and small everyday motifs onto a product people can use regularly. The forms stay simple and practical, while the artwork gives each mug its own character.',
      'omc-mobile-mugs'
    );
    var mugSlides = [
      ['c3f602d2531e9d812c3b6e5d759e74f0ec8adb86.png', 'Lemon illustrated coffee mug'],
      ['5915ac9b4d685b3c0b66bc1cdf67f43610c42e2b.png', 'Grapefruit illustrated coffee mug'],
      ['8bc5d10ab4260c39de8891a088a8c80ab4fc3ede.png', 'Onion illustrated coffee mug'],
      ['5eaf42dc7b07eee8c4ea1ec29c62583cefad0071.png', 'Butterfly illustrated coffee mug']
    ].map(function (item) {
      var slide = document.createElement('div');
      slide.appendChild(omcImage(item[0], item[1]));
      return slide;
    });
    mugSection.appendChild(omcCarousel('Coffee mug collection', mugSlides, 'omc-mobile-product-carousel'));
    artSection.appendChild(mugSection);

    var campaignSection = omcSection(
      'Campaign Materials',
      'For each launch, I planned the visual direction, photographed the products and adapted the idea across posters, packaging and social content. I wanted the campaigns to feel connected, even when the product or season changed.',
      'omc-mobile-campaign'
    );
    var campaignGrid = document.createElement('div');
    campaignGrid.className = 'omc-mobile-equal-pair';
    campaignGrid.appendChild(omcImage('104331ff88914696ccf1d73c8de8f0a0a77a9a55.png', 'OneMoreCase campaign display'));
    campaignGrid.appendChild(omcImage('4b20f2f8222b1eb8a10573abf5e83b5f66a33b41.jpeg', 'OneMoreCase campaign photography'));
    campaignSection.appendChild(campaignGrid);
    artSection.appendChild(campaignSection);

    var phoneSection = omcSection(
      'Phone Stand',
      'Each phone stand is cast in clear resin, with tiny fruit and vegetable miniatures or real shells, starfish and other ocean details set inside the half dome. The magnetic base makes it easy to attach and remove, and the extendable grip can support a phone in either portrait or landscape.',
      'omc-mobile-phone'
    );
    var phonePair = document.createElement('div');
    phonePair.className = 'omc-mobile-phone-pair';
    var phoneAnimationPanel = document.createElement('div');
    phoneAnimationPanel.className = 'omc-mobile-phone-animation-panel';
    var phoneCase = document.createElement('div');
    phoneCase.className = 'omc-mobile-phone-case';
    phoneCase.appendChild(omcImage('56d1a98698b6e2b2ea2ff03d7241f1a9da82c6ca.png', 'OneMoreCase phone case'));
    phoneAnimationPanel.appendChild(phoneCase);
    var phoneAnimation = document.createElement('div');
    phoneAnimation.className = 'pstand omc-mobile-phone-animation';
    [
      '37d48f854ad6638986ae097144fb63c543c3e3a4.png',
      '34fe1ed629f7c516b0d054ca7dfe551dfaf6f75f.png',
      '0cc8dc7aaec7d7cde51862b94df8ca1e30c04511.png',
      'bb1776b5875bba39e8c00e6786034b026a7cc6e8.png',
      '190134b5e46c33d46b615f667ef81c94a0e93bb2.png'
    ].forEach(function (src, index) {
      var frameNode = document.createElement('div');
      frameNode.appendChild(omcImage(src, 'Phone stand animation frame ' + (index + 1)));
      phoneAnimation.appendChild(frameNode);
    });
    phoneAnimationPanel.appendChild(phoneAnimation);
    phonePair.appendChild(phoneAnimationPanel);
    phonePair.appendChild(omcImage('5c39c4ca1cb1288345562d0c39e60262c624c569.png', 'OneMoreCase phone stand campaign poster', 'omc-mobile-phone-poster'));
    phoneSection.appendChild(phonePair);
    artSection.appendChild(phoneSection);

    var ipadSection = omcSection(
      'Magnetic iPad Case',
      'The foldable cover supports multiple viewing angles while keeping the Apple Pencil accessible. A restrained exterior lets the illustrated lining become the visual reveal.',
      'omc-mobile-ipad'
    );
    var ipadPair = document.createElement('div');
    ipadPair.className = 'omc-mobile-ipad-pair';
    ipadPair.appendChild(omcImage('2431016aa24eca610c68a8ff4f6be1d72bdbb3b1.png', 'Magnetic iPad case in use', 'omc-mobile-ipad-lifestyle'));
    ipadPair.appendChild(omcImage('1dea0e8aca5b9be5e63a23835e01b7ca0884fd76.png', 'Magnetic iPad case packaging', 'omc-mobile-ipad-packaging'));
    var ipadAngles = document.createElement('div');
    ipadAngles.className = 'omc-mobile-ipad-angles';
    ['top', 'middle', 'bottom'].forEach(function (position) {
      var angle = document.createElement('div');
      angle.className = 'omc-mobile-ipad-angle omc-mobile-ipad-angle-' + position;
      angle.setAttribute('role', 'img');
      angle.setAttribute('aria-label', 'Magnetic iPad case viewing position');
      ipadAngles.appendChild(angle);
    });
    ipadPair.appendChild(ipadAngles);
    /* Preserve the desktop product group as one canvas, including its crops. */
    ipadPair.replaceChildren();
    var ipadFrame = document.createElement('div');
    ipadFrame.className = 'omc-mobile-ipad-desktop-frame';
    var ipadCanvas = document.createElement('div');
    ipadCanvas.className = 'scaled-project-mobile-art-canvas';
    ipadCanvas.style.width = '630px';
    ipadCanvas.style.height = '644px';
    artwork.filter(function (node) {
      var img = node.querySelector('img');
      return img && /1dea0e8|013bd54/.test(img.getAttribute('src') || '');
    }).forEach(function (node) {
      node.style.left = (parseFloat(node.style.left) - 716) + 'px';
      node.style.top = (topOf(node) - 7919) + 'px';
      prepareArtwork(node);
      ipadCanvas.appendChild(node);
    });
    ipadFrame.appendChild(ipadCanvas);
    ipadPair.appendChild(ipadFrame);
    fittedArtwork.push({frame: ipadFrame, canvas: ipadCanvas, height: 644, sourceWidth: 630});
    ipadPair.appendChild(omcImage('2431016aa24eca610c68a8ff4f6be1d72bdbb3b1.png', 'Magnetic iPad case in use', 'omc-mobile-ipad-lifestyle'));
    ipadSection.appendChild(ipadPair);
    artSection.appendChild(ipadSection);

    var postcardSection = omcSection('Postcard', '', 'omc-mobile-postcards');
    var postcardSlides = [
      ['958fc9ed00fe4954eca0fed84bd32271251ac375.png', 'Penguin postcard'],
      ['f563a1381af966926a75f27e3e023fde04682ddc.png', 'Leopard postcard'],
      ['b820899c1de3f5623d87fdcc36df6b8784a798a8.png', 'Cake postcard'],
      ['5d3291007be2cf44398d8e3fce13779012f0673a.png', 'Pea postcard'],
      ['7511057cbeb5020bd04d9c180517ec208d9f452c.png', 'Rabbit postcard'],
      ['e8db829c6acf2a3a67978f7866cbf8ae62edaabe.png', 'Duck postcard'],
      ['3f9b20660ec885e7c41e506897751d2d60884f10.png', 'Bread postcard'],
      ['150064c75dd085692c93551d928b4ec2226de59e.png', 'Tomato postcard']
    ].map(function (item) {
      var slide = document.createElement('div');
      slide.appendChild(omcImage(item[0], item[1]));
      return slide;
    });
    postcardSection.appendChild(omcCarousel('Postcard collection', postcardSlides, 'omc-mobile-postcard-carousel'));
    artSection.appendChild(postcardSection);

    var retailHeroOne = document.createElement('div');
    retailHeroOne.className = 'omc-mobile-brand-hero';
    retailHeroOne.appendChild(omcImage('d9b06b85eebd7310a572a0782219302e61711445.jpeg', 'OneMoreCase retail market display'));

    var brandSection = omcSection(
      'Brand Collaboration',
      'For collaborations, I adapted the onemorecase visual style to suit each partner instead of simply adding another logo to the product. The idea carried through the product, market display and social content, while each collaboration still had its own character.',
      'omc-mobile-brand'
    );
    brandSection.appendChild(retailHeroOne);
    var brandGrid = document.createElement('div');
    brandGrid.className = 'omc-mobile-brand-grid';
    [
      ['c996da0efea4de5c16cfa889dbf9f0eb94b6c087.jpeg', 'OneMoreCase market display'],
      ['79de63aca9639f80f85bfa60e109c12422b46a4c.jpeg', 'OneMoreCase market stall'],
      ['eac5612f783ffa5a482652cab37c3b0705431e40.jpeg', 'OneMoreCase retail product display'],
      ['8e4a5de7883b6a9c0c3951b444ec22d966ba4a52.jpeg', 'OneMoreCase studio shop']
    ].forEach(function (item) { brandGrid.appendChild(omcImage(item[0], item[1])); });
    brandSection.appendChild(brandGrid);
    artSection.appendChild(brandSection);

    var retailHeroTwo = document.createElement('div');
    retailHeroTwo.className = 'omc-mobile-fullwidth-image omc-mobile-fullwidth-image-portrait';
    retailHeroTwo.appendChild(omcImage('5702b8e64a553f0c87a0ecd3b00e523ec2491389.jpeg', 'OneMoreCase community retail space'));

    var retailLabel = document.createElement('p');
    retailLabel.className = 'omc-mobile-retail-label';
    retailLabel.textContent = 'Retail & Community';
    artSection.appendChild(retailLabel);
    artSection.appendChild(retailHeroTwo);
  } else if (isCandle) {
    function candleFrame(nodes, start, height, parent, width) {
      var frame = document.createElement('div');
      frame.className = 'candle-mobile-frame';
      var canvas = document.createElement('div');
      canvas.className = 'scaled-project-mobile-art-canvas';
      canvas.style.width = (width || 1440) + 'px';
      canvas.style.height = height + 'px';
      nodes.forEach(function (node) { node.style.top = (topOf(node) - start) + 'px'; prepareArtwork(node); canvas.appendChild(node); });
      frame.appendChild(canvas); parent.appendChild(frame);
      fittedArtwork.push({frame: frame, canvas: canvas, height: height, sourceWidth: width || 1440});
    }
    var candleHero = document.createElement('section');
    candleHero.className = 'candle-mobile-hero';
    var candleGif = artwork.find(function (node) { return node.classList.contains('cd-gif'); });
    candleGif.style.left = '0px';
    candleFrame([candleGif], 842, 349.4, candleHero, 413.2);
    var slogan = document.createElement('p');
    slogan.className = 'candle-mobile-slogan';
    slogan.innerHTML = 'Scent Your Space<br>Turn Every Room into Summer';
    candleHero.appendChild(slogan); artSection.appendChild(candleHero);
    candleFrame(artwork.filter(function (node) { return topOf(node) >= 1383 && topOf(node) < 4473; }), 1383, 3090, artSection);
    [[4473,5438,6472,'bbc6eef'],[6472,7436,8470,'b8c206'],[8470,9435,9435,'6f54b']].forEach(function (spec, index) {
      var row = document.createElement('section'); row.className = 'candle-mobile-product-row' + (index === 1 ? ' candle-mobile-reverse' : '');
      var original = artwork.find(function (node) { var img = node.querySelector('img'); return img && img.getAttribute('src').indexOf(spec[3]) !== -1; });
      var photo = original.querySelector('img'); photo.removeAttribute('style'); photo.loading = 'eager';
      row.appendChild(photo);
      var copy = document.createElement('div'); copy.className = 'candle-mobile-product-copy';
      narrative.filter(function (node) { return topOf(node) >= spec[0] && topOf(node) < spec[1]; }).sort(function (a,b) { return topOf(a)-topOf(b); }).forEach(function (node) {
        var isTitle = parseFloat(node.style.fontSize) > 30; node.removeAttribute('style'); node.className = isTitle ? 'candle-mobile-product-title' : 'candle-mobile-product-description'; copy.appendChild(node);
      });
      row.appendChild(copy); artSection.appendChild(row);
      if (index < 2) candleFrame(artwork.filter(function (node) { return topOf(node) >= spec[1] && topOf(node) < spec[2]; }), spec[1], spec[2]-spec[1], artSection);
    });
  } else {
    var gegeGalleryItems = null;
    var gegeGalleryTop = 0;
    if (isGeGe) {
      var gegeGallerySources = [
        'a022b14e57ba6488ff8729c6d2551158c8508b54.png',
        '5384a32704d447df3e714a059cc9f019a98b1ecc.png',
        'gege-cup-card-replacement.png',
        'gege-worker-replacement.png',
        '65ea9bc52dd8f55c2eb8cf01556f87a9d65303ba.png',
        '057a9c646e171a86fcfaab178f6e7b7ce7065218.png'
      ];
      gegeGalleryItems = gegeGallerySources.map(function (source) {
        return artwork.find(function (node) {
          var image = node.querySelector('img');
          return image && decodeURIComponent(image.getAttribute('src') || '').indexOf(source) !== -1;
        });
      }).filter(Boolean);
      gegeGalleryTop = gegeGalleryItems.reduce(function (top, node) {
        var imageTop = topOf(node);
        return imageTop > 0 ? Math.min(top, imageTop) : top;
      }, Infinity);
      if (!isFinite(gegeGalleryTop)) gegeGalleryTop = 0;
      artwork = artwork.filter(function (node) {
        var image = node.querySelector('img');
        var source = image && decodeURIComponent(image.getAttribute('src') || '');
        return !gegeGallerySources.some(function (fileName) { return source && source.indexOf(fileName) !== -1; });
      });
      var takeawayRules = artwork.find(function (node) {
        return Array.prototype.some.call(node.children || [], function (child) {
          return child.style && child.style.top === '1030px' && child.style.height === '1px';
        });
      });
      if (takeawayRules) {
        Array.prototype.forEach.call(takeawayRules.children, function (child) {
          if (child.style.top === '1030px' && child.style.height === '1px') {
            child.style.top = '819px';
            child.classList.add('gege-takeaway-end-rule');
          }
        });
      }
    }
    var artworkTop = artwork.reduce(function (minimum, node) {
      var top = topOf(node);
      return top > 0 ? Math.min(minimum, top) : minimum;
    }, Infinity);
    if (!isFinite(artworkTop)) artworkTop = 0;
    var artworkEnd = artwork.reduce(function (maximum, node) {
      var height = parseFloat(node.style.height) || node.offsetHeight || 0;
      return Math.max(maximum, topOf(node) + height);
    }, artworkTop);
    var artworkHeight = Math.max(1, artworkEnd - artworkTop);
    var frame = document.createElement('div');
    frame.className = 'scaled-project-mobile-art-frame';
    var canvas = document.createElement('div');
    canvas.className = 'scaled-project-mobile-art-canvas';
    canvas.style.width = '1440px';
    canvas.style.height = artworkHeight + 'px';
    artwork.forEach(function (node) {
      var top = topOf(node);
      node.dataset.scaledProjectTop = String(top);
      if (isGeGe && node.querySelector('.gg-cup1')) node.dataset.scaledProjectMobileOffset = '-200';
      var mobileOffset = parseFloat(node.dataset.scaledProjectMobileOffset || '0');
      if (top > 0) node.style.top = (top - artworkTop + mobileOffset) + 'px';
      prepareArtwork(node);
      canvas.appendChild(node);
    });
    frame.appendChild(canvas);
    var textLayer = null;
    if (narrative.length && preserveDesktopArtwork) {
      textLayer = document.createElement('div');
      textLayer.className = 'scaled-project-mobile-text-layer';
      var narrativeGroups = [];
      narrative.forEach(function (node) {
        var top = topOf(node);
        var group;
        if (isGeGe) {
          group = narrativeGroups[0];
          if (!group) {
            group = { start: 2700, end: 2700, nodes: [] };
            narrativeGroups.push(group);
          }
        } else {
          group = narrativeGroups[narrativeGroups.length - 1];
          if (!group || top - group.start >= 180) {
            group = { start: top, end: top, nodes: [] };
            narrativeGroups.push(group);
          }
        }
        group.end = Math.max(group.end, top + (parseFloat(node.style.height) || node.offsetHeight || 24));
        group.nodes.push(node);
      });
      narrativeGroups.forEach(function (group) {
        var wrapper = document.createElement('div');
        var first = group.nodes[0];
        var align = (first.style.textAlign || 'left').toLowerCase();
        wrapper.className = 'scaled-project-text-group scaled-project-art-' +
          (align === 'center' ? 'center' : ((parseFloat(first.style.left) || 0) >= 700 ? 'right' : 'left'));
        wrapper.dataset.scaledProjectTop = String(group.start);
        wrapper.dataset.scaledProjectEnd = String(group.end);
        group.nodes.forEach(function (node) {
          var originalFontSize = parseFloat(node.style.fontSize || node.style.font) || 0;
          node.classList.add(originalFontSize >= 28 ? 'scaled-project-art-title' : 'scaled-project-art-copy');
          node.removeAttribute('style');
          wrapper.appendChild(node);
        });
        textLayer.appendChild(wrapper);
      });
      frame.appendChild(textLayer);
    }
    artSection.appendChild(frame);
    if (gegeGalleryItems && gegeGalleryItems.length) {
      var gegeGallery = document.createElement('div');
      gegeGallery.className = 'gege-mobile-gallery';
      var galleryImages = {};
      gegeGalleryItems.forEach(function (node) {
        var image = node.querySelector('img');
        var source = decodeURIComponent(image.getAttribute('src') || '');
        var key = source.split('/').pop();
        if (galleryImages[key]) return;
        image.removeAttribute('style');
        image.loading = 'lazy';
        galleryImages[key] = image;
      });
      ['a022b14e57ba6488ff8729c6d2551158c8508b54.png', '5384a32704d447df3e714a059cc9f019a98b1ecc.png'].forEach(function (key) {
        if (galleryImages[key]) gegeGallery.appendChild(galleryImages[key]);
      });
      var portraitGroup = document.createElement('div');
      portraitGroup.className = 'gege-mobile-portrait-group';
      var portraitRule = document.createElement('div');
      portraitRule.className = 'gege-mobile-portrait-rule';
      portraitGroup.appendChild(portraitRule);
      var portraitPair = document.createElement('div');
      portraitPair.className = 'gege-mobile-portrait-pair';
      ['gege-cup-card-replacement.png', 'gege-worker-replacement.png'].forEach(function (key) {
        if (galleryImages[key]) portraitPair.appendChild(galleryImages[key]);
      });
      portraitGroup.appendChild(portraitPair);
      gegeGallery.appendChild(portraitGroup);
      ['65ea9bc52dd8f55c2eb8cf01556f87a9d65303ba.png', '057a9c646e171a86fcfaab178f6e7b7ce7065218.png'].forEach(function (key) {
        if (galleryImages[key]) gegeGallery.appendChild(galleryImages[key]);
      });
      artSection.appendChild(gegeGallery);
    }
      fittedArtwork.push({
        frame: frame,
        canvas: canvas,
        height: artworkHeight,
        artwork: artwork,
        artworkTop: artworkTop,
        textLayer: textLayer,
        gallery: isGeGe ? gegeGallery : null,
        galleryTop: gegeGalleryTop
      });
  }

  if (footer) {
    footer.id = footer.id || 'scaled-project-footer';
    footer.classList.add('scaled-project-footer');
    Array.prototype.slice.call(footer.children).forEach(function (node, index) {
      node.classList.add(index === footer.children.length - 1 ? 'scaled-project-footer-link' : 'scaled-project-footer-meta');
    });
    var footerSection = document.createElement('section');
    footerSection.className = 'scaled-project-mobile-footer-section';
    footerSection.appendChild(footer);
    mobile.appendChild(footerSection);
  }

  function fitArtwork() {
    fittedArtwork.forEach(function (item) {
      var width = item.frame.clientWidth || Math.max(280, window.innerWidth - 40);
      var scale = width / (item.sourceWidth || 1440);
      item.canvas.style.transform = (item.cropTop ? 'translateY(-' + item.cropTop + 'px) ' : '') + 'scale(' + scale + ')';
      item.frame.style.height = Math.round(item.height * scale - (item.cropTop || 0)) + 'px';
      if (item.artwork) item.artwork.forEach(function (node) {
        var mobileOffset = parseFloat(node.dataset.scaledProjectMobileOffset || '0');
        node.style.top = (parseFloat(node.dataset.scaledProjectTop || '0') - item.artworkTop + mobileOffset) + 'px';
      });
      var addedSpace = 0;
      if (item.textLayer) {
        var insertions = [];
        Array.prototype.slice.call(item.textLayer.children).sort(function (a, b) {
          return parseFloat(a.dataset.scaledProjectTop) - parseFloat(b.dataset.scaledProjectTop);
        }).forEach(function (group) {
          var groupTop = parseFloat(group.dataset.scaledProjectTop);
          var groupEnd = parseFloat(group.dataset.scaledProjectEnd);
          var projectedTop = Math.max(0, (groupTop - item.artworkTop) * scale) + addedSpace;
          group.style.top = Math.round(projectedTop) + 'px';
          var originalSpace = Math.max(0, (groupEnd - groupTop) * scale);
          var extra = Math.max(0, group.offsetHeight + 28 - originalSpace);
          addedSpace += extra;
          insertions.push({ top: groupTop, extra: extra });
        });
        item.artwork.forEach(function (node) {
          var originalTop = parseFloat(node.dataset.scaledProjectTop || '0');
          var mobileOffset = parseFloat(node.dataset.scaledProjectMobileOffset || '0');
          var shift = insertions.reduce(function (sum, insertion) {
            return originalTop > insertion.top ? sum + insertion.extra : sum;
          }, 0);
          node.style.top = (originalTop - item.artworkTop + mobileOffset + shift / scale) + 'px';
        });
        item.frame.style.height = Math.round(item.height * scale + addedSpace) + 'px';
      }
      if (item.gallery && item.galleryTop > 0) {
        var fittedHeight = parseFloat(item.frame.style.height) || item.frame.offsetHeight;
        var endRule = item.canvas.querySelector('.gege-takeaway-end-rule');
        var intendedTop = endRule
          ? endRule.getBoundingClientRect().bottom - item.frame.getBoundingClientRect().top + 28
          : (item.galleryTop - item.artworkTop) * scale + addedSpace;
        item.gallery.style.marginTop = (intendedTop - fittedHeight) + 'px';
      }
    });
  }
  requestAnimationFrame(fitArtwork);
  window.addEventListener('resize', fitArtwork);
  if (window.ResizeObserver) {
    var observer = new ResizeObserver(fitArtwork);
    fittedArtwork.forEach(function (item) { observer.observe(item.frame); });
  }
  document.documentElement.classList.add('scaled-project-mobile-ready');
})();
