/* =====================================================
   main.js — Portfolio interactions
===================================================== */

// ── 1. AOS INIT ──────────────────────────────────────
AOS.init({
  offset:   80,
  duration: 700,
  once:     true,
  easing:   'ease-out-cubic',
});

// ── 2. MOBILE HAMBURGER MENU ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  // Prevent body scroll when nav open
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── 3. SMOOTH SCROLL for all anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72'
    );
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 4. ACTIVE MENU HIGHLIGHT on scroll ───────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: '-40% 0px -50% 0px',
  threshold:  0,
});

sections.forEach(sec => sectionObserver.observe(sec));

// ── 5. HEADER SCROLL EFFECT ───────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── 6. TYPING EFFECT ──────────────────────────────────
const typingEl = document.getElementById('typing-text');
const phrases  = [
  'Lập trình viên',
  'Giảng viên',
  'Founder NenTang.vn',
  'Người xây dựng nền tảng học tập',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let typingTimer  = null;

function type() {
  const current  = phrases[phraseIndex];
  const displayed = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  typingEl.textContent = displayed;

  if (!isDeleting) {
    charIndex++;
    if (charIndex === current.length) {
      // Pause at end before deleting
      isDeleting = true;
      typingTimer = setTimeout(type, 2000);
      return;
    }
  } else {
    charIndex--;
    if (charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingTimer = setTimeout(type, 400);
      return;
    }
  }

  const speed = isDeleting ? 55 : 90;
  typingTimer = setTimeout(type, speed);
}

// Start typing after a short delay
setTimeout(type, 800);

// ── 7. STATS COUNTER ANIMATION ────────────────────────
const statNumbers = document.querySelectorAll('.stat__number');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // ms
  const step     = 16;   // ~60fps
  const steps    = duration / step;
  const increment = target / steps;
  let current    = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString('vi-VN');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('vi-VN');
    }
  }, step);
}

// Trigger counters when stats section enters viewport
const statsSection = document.querySelector('.stats');
let countersStarted = false;

if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}

// ── 8. GALLERY MODAL LIGHTBOX ─────────────────────────
const modal     = document.getElementById('gallery-modal');
const modalImg  = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const backdrop  = document.getElementById('modal-backdrop');

function openModal(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Clear src after transition
  setTimeout(() => { modalImg.src = ''; }, 350);
}

// Attach click handlers to gallery items
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) openModal(img.src, img.alt);
  });
});

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ── 9. CONTACT FORM SUBMIT ────────────────────────────
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic client-side validation
  const name    = this.querySelector('#name').value.trim();
  const email   = this.querySelector('#email').value.trim();
  const message = this.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    // Highlight empty required fields
    [{ id: 'name', val: name }, { id: 'email', val: email }, { id: 'message', val: message }]
      .forEach(({ id, val }) => {
        const el = this.querySelector(`#${id}`);
        el.style.borderColor = val ? 'var(--border)' : 'var(--primary)';
      });
    return;
  }

  // Show success message (in a real project, send via fetch/API)
  const submitBtn = this.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi tin nhắn';
    formSuccess.style.display = 'flex';
    contactForm.reset();
    // Reset border colours
    contactForm.querySelectorAll('input, textarea').forEach(el => {
      el.style.borderColor = '';
    });
    // Hide success after 6s
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  }, 1200);
});

// Reset field border colour on input
contactForm.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => { el.style.borderColor = ''; });
});

// ── 10. BACK-TO-TOP BUTTON ────────────────────────────
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
