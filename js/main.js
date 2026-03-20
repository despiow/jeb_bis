// ===== Galerie : zoom au survol + lightbox carousel =====
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length) {
  // --- Zoom au survol ---
  const preview = document.createElement('div');
  preview.className = 'gallery-zoom-preview';
  preview.innerHTML = '<img src="" alt="">';
  document.body.appendChild(preview);

  function positionPreview(rect) {
    const w = 380;
    let left = rect.left + rect.width / 2 - w / 2;
    let top  = rect.top - 280 - 14;
    if (left < 8) left = 8;
    if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
    if (top < 8) top = rect.bottom + 14;
    preview.style.left = left + 'px';
    preview.style.top  = top  + 'px';
  }

  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('mouseenter', () => {
      preview.querySelector('img').src = img.src;
      preview.querySelector('img').alt = img.alt;
      const rect = item.getBoundingClientRect();
      positionPreview(rect);
      preview.classList.add('active');
    });
    item.addEventListener('mouseleave', () => {
      preview.classList.remove('active');
    });
  });

  // --- Lightbox carousel ---
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));
  let current = 0;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <button class="lightbox-prev">&#8249;</button>
    <div class="lightbox-img-wrap">
      <img class="lightbox-img" src="" alt="">
    </div>
    <button class="lightbox-next">&#8250;</button>
    <button class="lightbox-close">&times;</button>
    <div class="lightbox-counter"></div>`;
  document.body.appendChild(lightbox);

  const lbImg     = lightbox.querySelector('.lightbox-img');
  const lbCounter = lightbox.querySelector('.lightbox-counter');

  function showImage(index) {
    current = (index + images.length) % images.length;
    lbImg.classList.remove('loaded');
    lbImg.onload = () => lbImg.classList.add('loaded');
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lbCounter.textContent = (current + 1) + ' / ' + images.length;
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

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(current + 1));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);
    if (e.key === 'Escape')     closeLightbox();
  });
}

// Navigation mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Fermer le menu au clic sur un lien
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}


// Message contact (succès/erreur)
const urlParams = new URLSearchParams(window.location.search);
const contactStatus = urlParams.get('contact');
if (contactStatus === 'success') {
  const form = document.querySelector('.contact-form');
  if (form) {
    const alert = document.createElement('p');
    alert.className = 'form-alert form-alert-success';
    alert.textContent = 'Message envoyé avec succès ! Nous vous répondrons rapidement.';
    form.insertBefore(alert, form.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
  }
} else if (contactStatus === 'error') {
  const form = document.querySelector('.contact-form');
  if (form) {
    const alert = document.createElement('p');
    alert.className = 'form-alert form-alert-error';
    alert.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
    form.insertBefore(alert, form.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// Popup vidéo au clic
const videoPopups = document.querySelectorAll('.video-placeholder');
const videoPopup = document.getElementById('video-popup');
const videoPopupClose = document.querySelector('.video-popup-close');
const videoPopupBackdrop = document.querySelector('.video-popup-backdrop');
const videoPopupMedia = document.querySelector('.video-popup-media');
const videoPopupTitle = document.querySelector('.video-popup-title');

function openVideoPopup(src, title) {
  if (!videoPopup || !videoPopupMedia) return;
  videoPopupMedia.innerHTML = '';
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src) || src.includes('youtube') || src.includes('vimeo');
  if (isVideo) {
    if (src.includes('youtube') || src.includes('vimeo')) {
      const iframe = document.createElement('iframe');
      let embedUrl = src;
      if (src.includes('youtube.com/watch')) {
        const id = new URL(src).searchParams.get('v');
        embedUrl = id ? `https://www.youtube.com/embed/${id}?autoplay=1` : src;
      } else if (src.includes('vimeo.com/')) {
        const id = src.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = id ? `https://player.vimeo.com/video/${id}?autoplay=1` : src;
      }
      iframe.src = embedUrl;
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      videoPopupMedia.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      videoPopupMedia.appendChild(video);
    }
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    videoPopupMedia.appendChild(img);
  }
  videoPopupTitle.textContent = title || '';
  videoPopup.setAttribute('aria-hidden', 'false');
  videoPopup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoPopup() {
  if (!videoPopup) return;
  videoPopup.classList.remove('active');
  videoPopup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const iframe = videoPopupMedia?.querySelector('iframe');
  const video = videoPopupMedia?.querySelector('video');
  if (iframe) iframe.src = '';
  if (video) video.pause();
  setTimeout(() => {
    videoPopupMedia?.innerHTML = '';
  }, 300);
}

videoPopups.forEach(placeholder => {
  placeholder.addEventListener('click', (e) => {
    e.preventDefault();
    const src = placeholder.dataset.videoSrc || placeholder.querySelector('img')?.src;
    const title = placeholder.dataset.videoTitle || '';
    if (src) openVideoPopup(src, title);
  });
});

videoPopupClose?.addEventListener('click', closeVideoPopup);
videoPopupBackdrop?.addEventListener('click', closeVideoPopup);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoPopup?.classList.contains('active')) {
    closeVideoPopup();
  }
});

// Header scroll (optionnel : réduire le header au scroll)
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});
