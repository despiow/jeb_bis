// ===== Galerie : zoom au survol + lightbox carousel =====
var galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length) {

  // --- Zoom au survol ---
  var preview = document.createElement('div');
  preview.className = 'gallery-zoom-preview';
  var previewImg = document.createElement('img');
  previewImg.src = '';
  previewImg.alt = '';
  preview.appendChild(previewImg);
  document.body.appendChild(preview);

  function positionPreview(rect) {
    var w = 380;
    var left = rect.left + rect.width / 2 - w / 2;
    var top  = rect.top - 280 - 14;
    if (left < 8) left = 8;
    if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
    if (top < 8) top = rect.bottom + 14;
    preview.style.left = left + 'px';
    preview.style.top  = top  + 'px';
  }

  galleryItems.forEach(function(item) {
    var img = item.querySelector('img');
    item.addEventListener('mouseenter', function() {
      previewImg.src = img.src;
      previewImg.alt = img.alt;
      positionPreview(item.getBoundingClientRect());
      preview.classList.add('active');
    });
    item.addEventListener('mouseleave', function() {
      preview.classList.remove('active');
    });
  });

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
