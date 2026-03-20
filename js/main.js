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
