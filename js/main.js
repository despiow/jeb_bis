// ===== Galerie : zoom au survol + lightbox carousel =====
var galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length) {

  // --- Lightbox carousel ---
  var images = [];
  galleryItems.forEach(function(item) {
    var img = item.querySelector('img');
    images.push({ src: img.src, alt: img.alt });
  });
  var current = 0;

  // Construire la lightbox sans entités HTML
  var lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';

  var backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';

  var btnPrev = document.createElement('button');
  btnPrev.className = 'lightbox-prev';
  btnPrev.textContent = '\u2039';

  var imgWrap = document.createElement('div');
  imgWrap.className = 'lightbox-img-wrap';

  var lbImg = document.createElement('img');
  lbImg.className = 'lightbox-img';
  lbImg.src = '';
  lbImg.alt = '';
  imgWrap.appendChild(lbImg);

  var btnNext = document.createElement('button');
  btnNext.className = 'lightbox-next';
  btnNext.textContent = '\u203A';

  var btnClose = document.createElement('button');
  btnClose.className = 'lightbox-close';
  btnClose.textContent = '\u00D7';

  var counter = document.createElement('div');
  counter.className = 'lightbox-counter';

  lightbox.appendChild(backdrop);
  lightbox.appendChild(btnPrev);
  lightbox.appendChild(imgWrap);
  lightbox.appendChild(btnNext);
  lightbox.appendChild(btnClose);
  lightbox.appendChild(counter);
  document.body.appendChild(lightbox);

  function showImage(index) {
    current = (index + images.length) % images.length;
    lbImg.classList.remove('loaded');
    lbImg.onload = function() { lbImg.classList.add('loaded'); };
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    counter.textContent = (current + 1) + ' / ' + images.length;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function(item, i) {
    item.addEventListener('click', function() { openLightbox(i); });
  });

  btnPrev.addEventListener('click', function() { showImage(current - 1); });
  btnNext.addEventListener('click', function() { showImage(current + 1); });
  btnClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);
    if (e.key === 'Escape')     closeLightbox();
  });
}

// ===== Navigation mobile =====
var navToggle = document.querySelector('.nav-toggle');
var navMenu   = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', function() {
    var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== Message contact =====
var urlParams     = new URLSearchParams(window.location.search);
var contactStatus = urlParams.get('contact');
if (contactStatus === 'success' || contactStatus === 'error') {
  var form = document.querySelector('.contact-form');
  if (form) {
    var alertEl = document.createElement('p');
    alertEl.className = contactStatus === 'success'
      ? 'form-alert form-alert-success'
      : 'form-alert form-alert-error';
    alertEl.textContent = contactStatus === 'success'
      ? 'Message envoy\u00E9 avec succ\u00E8s ! Nous vous r\u00E9pondrons rapidement.'
      : 'Une erreur est survenue. Veuillez r\u00E9essayer ou nous contacter directement.';
    form.insertBefore(alertEl, form.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ===== Popup vidéo =====
var videoPopups       = document.querySelectorAll('.video-placeholder');
var videoPopup        = document.getElementById('video-popup');
var videoPopupClose   = document.querySelector('.video-popup-close');
var videoPopupBdrop   = document.querySelector('.video-popup-backdrop');
var videoPopupMedia   = document.querySelector('.video-popup-media');
var videoPopupTitle   = document.querySelector('.video-popup-title');

function openVideoPopup(src, title) {
  if (!videoPopup || !videoPopupMedia) return;
  videoPopupMedia.innerHTML = '';
  var isVideo = /\.(mp4|webm|ogg)$/i.test(src) || src.indexOf('youtube') !== -1 || src.indexOf('vimeo') !== -1;
  if (isVideo) {
    var iframe = document.createElement('iframe');
    var embedUrl = src;
    if (src.indexOf('youtube.com/watch') !== -1) {
      try {
        var id = new URL(src).searchParams.get('v');
        if (id) embedUrl = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      } catch(e) {}
    } else if (src.indexOf('vimeo.com/') !== -1) {
      var parts = src.split('vimeo.com/');
      var vid = parts[1] ? parts[1].split('?')[0] : null;
      if (vid) embedUrl = 'https://player.vimeo.com/video/' + vid + '?autoplay=1';
    }
    iframe.src = embedUrl;
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    videoPopupMedia.appendChild(iframe);
  } else {
    var img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    videoPopupMedia.appendChild(img);
  }
  if (videoPopupTitle) videoPopupTitle.textContent = title || '';
  videoPopup.setAttribute('aria-hidden', 'false');
  videoPopup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoPopup() {
  if (!videoPopup) return;
  videoPopup.classList.remove('active');
  videoPopup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (videoPopupMedia) {
    var iframe = videoPopupMedia.querySelector('iframe');
    var video  = videoPopupMedia.querySelector('video');
    if (iframe) iframe.src = '';
    if (video)  video.pause();
    setTimeout(function() { videoPopupMedia.innerHTML = ''; }, 300);
  }
}

videoPopups.forEach(function(placeholder) {
  placeholder.addEventListener('click', function(e) {
    e.preventDefault();
    var src   = placeholder.dataset.videoSrc || (placeholder.querySelector('img') && placeholder.querySelector('img').src);
    var title = placeholder.dataset.videoTitle || '';
    if (src) openVideoPopup(src, title);
  });
});

if (videoPopupClose)  videoPopupClose.addEventListener('click', closeVideoPopup);
if (videoPopupBdrop)  videoPopupBdrop.addEventListener('click', closeVideoPopup);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && videoPopup && videoPopup.classList.contains('active')) {
    closeVideoPopup();
  }
});

// ===== Header scroll =====
var header = document.querySelector('.header');
window.addEventListener('scroll', function() {
  if (!header) return;
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Reviews Carousel =====
(function() {
  var track     = document.getElementById('reviews-track');
  var carousel  = document.getElementById('reviews-carousel');
  var dotsWrap  = document.getElementById('carousel-dots');
  var btnPrev   = document.querySelector('.carousel-prev');
  var btnNext   = document.querySelector('.carousel-next');

  if (!track || !carousel) return;

  var cards       = Array.prototype.slice.call(track.querySelectorAll('.review-card'));
  var totalCards  = cards.length;
  var currentIdx  = 0;
  var visibleCount = 3;
  var autoTimer   = null;

  function getVisible() {
    var w = carousel.offsetWidth;
    if (w < 560) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, totalCards - visibleCount);
  }

  function updateCardWidth() {
    visibleCount = getVisible();
    var gap = visibleCount > 1 ? 24 : 0;
    var cardW = (carousel.offsetWidth - gap * (visibleCount - 1)) / visibleCount;
    cards.forEach(function(c) {
      c.style.flex = '0 0 ' + cardW + 'px';
    });
    track.style.gap = gap + 'px';
    goTo(Math.min(currentIdx, maxIndex()), false);
    buildDots();
  }

  function goTo(idx, animate) {
    if (animate === false) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
    var gap      = visibleCount > 1 ? 24 : 0;
    var cardW    = cards[0] ? cards[0].offsetWidth : 0;
    var offset   = idx * (cardW + gap);
    currentIdx   = idx;
    track.style.transform = 'translateX(-' + offset + 'px)';
    updateDots();
    updateButtons();
    if (animate === false) {
      // Re-enable transitions next frame
      requestAnimationFrame(function() {
        track.style.transition = '';
      });
    }
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    var count = maxIndex() + 1;
    for (var i = 0; i < count; i++) {
      (function(i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentIdx ? ' active' : '');
        dot.setAttribute('aria-label', 'Aller à l\'avis ' + (i + 1));
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', function() { goTo(i, true); resetAuto(); });
        dotsWrap.appendChild(dot);
      })(i);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    var dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === currentIdx);
    });
  }

  function updateButtons() {
    if (btnPrev) btnPrev.disabled = currentIdx <= 0;
    if (btnNext) btnNext.disabled = currentIdx >= maxIndex();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() {
      var next = currentIdx >= maxIndex() ? 0 : currentIdx + 1;
      goTo(next, true);
    }, 5000);
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (currentIdx > 0) { goTo(currentIdx - 1, true); resetAuto(); }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (currentIdx < maxIndex()) { goTo(currentIdx + 1, true); resetAuto(); }
    });
  }

  // Swipe touch support
  var touchStartX = 0;
  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIdx < maxIndex()) { goTo(currentIdx + 1, true); resetAuto(); }
      else if (diff < 0 && currentIdx > 0)    { goTo(currentIdx - 1, true); resetAuto(); }
    }
  }, { passive: true });

  // Keyboard support
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft'  && currentIdx > 0)         { goTo(currentIdx - 1, true); resetAuto(); }
    if (e.key === 'ArrowRight' && currentIdx < maxIndex()) { goTo(currentIdx + 1, true); resetAuto(); }
  });

  // Init
  updateCardWidth();
  resetAuto();

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCardWidth, 150);
  });
})();

// ===== Pricing interaction =====
var pricingArena = document.getElementById('pricing-arena');
var pricingCards = pricingArena
  ? Array.prototype.slice.call(pricingArena.querySelectorAll('.pricing-cat-card'))
  : [];

if (pricingArena && pricingCards.length) {
  pricingCards.forEach(function(card) {
    var header = card.querySelector('.pricing-cat-header');
    if (!header) return;
    header.addEventListener('click', function() {
      if (card.classList.contains('active')) return;
      pricingCards.forEach(function(c) { c.classList.remove('active'); });
      pricingArena.classList.add('has-active');
      card.classList.add('active');
      setTimeout(function() {
        var top = pricingArena.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }, 60);
    });
  });
}

function resetPricing() {
  if (!pricingArena) return;
  pricingCards.forEach(function(c) { c.classList.remove('active'); });
  pricingArena.classList.remove('has-active');
  var top = pricingArena.getBoundingClientRect().top + window.pageYOffset - 120;
  window.scrollTo({ top: top, behavior: 'smooth' });
}
