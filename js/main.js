/**
 * Hafsa Naeem - Professional Portfolio JavaScript
 * Modern, Vanilla ES6+, Zero Dependencies, High Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScrollAndActiveNav();
  initProjectGallery();
  initClipboardCopy();
  initModals();
  initAvatarUpload();
});

/**
 * 1. Sticky Header Elevation on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Navigation Toggle & Drawer Controller
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.mobile-toggle') || document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  menuToggle.addEventListener('click', () => {
    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  }, { passive: true });
}

/**
 * 3. Active Nav Link Highlighting via IntersectionObserver
 */
function initSmoothScrollAndActiveNav() {
  const sections = document.querySelectorAll('section[id], article[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * 4. Interactive Project Media Gallery in Modal
 */
function initProjectGallery() {
  const mainImage = document.getElementById('modalPreviewImg');
  const browserAddress = document.getElementById('modalBrowserAddress');
  const thumbButtons = document.querySelectorAll('.thumb-btn');

  if (!mainImage || !thumbButtons.length) return;

  thumbButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      thumbButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const newSrc = btn.getAttribute('data-img-src');
      const newAlt = btn.getAttribute('data-img-alt');
      const newAddress = btn.getAttribute('data-address') || 'usb-company-website/home';

      mainImage.style.opacity = '0.3';
      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.alt = newAlt;
        if (browserAddress) {
          browserAddress.textContent = newAddress;
        }
        mainImage.style.opacity = '1';
      }, 120);
    });
  });
}

/**
 * 5. Clipboard Copy with Visual Toast Feedback
 */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');
  const toast = document.getElementById('copyToast');
  let toastTimeout;

  if (!copyButtons.length) return;

  const showToast = (message) => {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(textArea);
  };
}

/**
 * 6. Generic Accessible Modal Controller
 */
function initModals() {
  const openButtons = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const allModals = document.querySelectorAll('.modal-backdrop');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      if (targetId) openModal(targetId);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(targetId) || btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.open');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

/**
 * 7. Interactive Avatar Image / Logo Upload Controller
 * Allows uploading any personal photo or logo, previews immediately,
 * persists in browser localStorage, and supports one-click reset.
 */
function initAvatarUpload() {
  const fileInput = document.getElementById('avatarUploadInput');
  const avatarImg = document.getElementById('heroAvatarImg');
  const resetBtn = document.getElementById('resetAvatarBtn');
  const avatarInner = document.getElementById('avatarInnerCircle');
  const defaultSrc = 'images/ui/hafsa-naeem-logo.svg';

  if (!fileInput || !avatarImg) return;

  // Restore saved photo from localStorage if present
  try {
    const savedAvatar = localStorage.getItem('hafsa_user_avatar');
    if (savedAvatar) {
      avatarImg.src = savedAvatar;
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }
  } catch (err) {
    console.warn('Could not read from localStorage', err);
  }

  // Clicking the avatar circle triggers the file chooser
  if (avatarInner) {
    avatarInner.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Handle image file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      avatarImg.src = dataUrl;
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';

      try {
        localStorage.setItem('hafsa_user_avatar', dataUrl);
      } catch (storageErr) {
        console.warn('LocalStorage quota exceeded; image displayed for session only.', storageErr);
      }

      if (resetBtn) resetBtn.style.display = 'inline-flex';
      showToast('Photo uploaded and displayed successfully!');
    };
    reader.readAsDataURL(file);
  });

  // Reset back to default HN brand logo
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      avatarImg.src = defaultSrc;
      avatarImg.style.objectFit = 'contain';
      avatarImg.style.width = '90%';
      avatarImg.style.height = '90%';
      try {
        localStorage.removeItem('hafsa_user_avatar');
      } catch (err) {
        // Ignore
      }
      fileInput.value = '';
      resetBtn.style.display = 'none';
      showToast('Reset back to Hafsa Naeem brand logo.');
    });
  }
}
