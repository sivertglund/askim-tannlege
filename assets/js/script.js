/* Askim Tannlege */

document.addEventListener('DOMContentLoaded', () => {

  // Header — transparent over hero, solid after scroll
  const header = document.querySelector('.site-header');
  const heroMode = header && header.dataset.heroMode !== undefined;

  if (header) {
    const setState = () => {
      const scrolled = window.scrollY > 60;
      if (heroMode) {
        header.classList.toggle('transparent', !scrolled);
        header.classList.toggle('solid', scrolled);
      } else {
        header.classList.add('solid');
        header.classList.toggle('scrolled', scrolled);
      }
    };
    window.addEventListener('scroll', setState, { passive: true });
    setState();
  }

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // FAQ
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Booking form → mailto
  const bookForm = document.querySelector('.book-form');
  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(bookForm);
      const navn = (data.get('navn') || '').trim();
      const telefon = (data.get('telefon') || '').trim();
      const epost = (data.get('epost') || '').trim();
      const type = (data.get('type') || '').trim();
      const melding = (data.get('melding') || '').trim();
      const to = bookForm.dataset.mailto || 'post@askimtannlege.no';
      const subject = `Bestill time — ${type || navn || 'Ny henvendelse'}`;
      const body = [
        `Navn: ${navn}`,
        `Telefon: ${telefon}`,
        epost ? `E-post: ${epost}` : '',
        type ? `Type: ${type}` : '',
        '',
        'Melding:',
        melding,
      ].filter(Boolean).join('\n');
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Hero image gradual blur on scroll
  const heroImg = document.querySelector('.hero-right-img');
  const heroSection = document.querySelector('.hero');
  if (heroImg && heroSection) {
    let ticking = false;
    const updateBlur = () => {
      const heroH = heroSection.offsetHeight;
      const progress = Math.min(window.scrollY / heroH, 1);
      const blur = progress * 28;
      const scale = 1 + progress * 0.08;
      heroImg.style.filter = `blur(${blur}px)`;
      heroImg.style.transform = `scale(${scale})`;
      heroImg.style.opacity = `${1 - progress * 0.45}`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBlur);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateBlur, { passive: true });
    updateBlur();
  }
});
