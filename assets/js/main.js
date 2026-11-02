/**
 * CarGloss – Premium Mobile Car Detailing
 * Main JavaScript Module
 */

'use strict';

// ─── Utility Functions ───
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ─── Theme Manager ───
const ThemeManager = {
  key: 'cargloss-theme',
  init() {
    const saved = localStorage.getItem(this.key) || 'dark';
    this.apply(saved);
    $$('[data-theme-toggle]').forEach(btn => {
      on(btn, 'click', () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    $$('[data-theme-icon]').forEach(icon => {
      icon.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme');
    this.apply(cur === 'dark' ? 'light' : 'dark');
  }
};

// ─── RTL Manager ───
const RTLManager = {
  key: 'cargloss-rtl',
  init() {
    const saved = localStorage.getItem(this.key) === 'true';
    if (saved) this.apply(true);
    $$('[data-rtl-toggle]').forEach(btn => {
      on(btn, 'click', () => this.toggle());
    });
  },
  apply(rtl) {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    localStorage.setItem(this.key, rtl);
  },
  toggle() {
    const cur = document.documentElement.dir === 'rtl';
    this.apply(!cur);
  }
};

// ─── Navbar ───
const Navbar = {
  init() {
    const navbar = $('#navbar');
    if (!navbar) return;
    const mobileToggle = $('#mobile-toggle');
    const mobileMenu = $('#mobile-menu');

    // Scroll effect
    let lastY = 0;
    on(window, 'scroll', () => {
      const y = window.scrollY;
      if (y > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastY = y;
    }, { passive: true });

    // Mobile toggle
    if (mobileToggle && mobileMenu) {
      on(mobileToggle, 'click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
      // Close on link click
      $$('a', mobileMenu).forEach(link => {
        on(link, 'click', () => {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link highlight
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link-custom').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href === path) {
        link.classList.add('active');
      } else if (path === 'service-details.html' && href === 'services.html') {
        link.classList.add('active');
      } else if (path === 'blog-details.html' && href === 'blog.html') {
        link.classList.add('active');
      } else if (path === 'admin-dashboard.html' && href === 'customer-dashboard.html') {
        link.classList.add('active');
      }
    });

    // Profile dropdown (click to open, outside-click / Escape to close)
    const profileToggle = $('#profile-toggle');
    const profileWrap = profileToggle ? profileToggle.closest('.profile-menu-wrap') : null;
    if (profileToggle && profileWrap) {
      on(profileToggle, 'click', (e) => {
        e.stopPropagation();
        const open = profileWrap.classList.toggle('open');
        profileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      on(document, 'click', (e) => {
        if (!profileWrap.contains(e.target)) {
          profileWrap.classList.remove('open');
          profileToggle.setAttribute('aria-expanded', 'false');
        }
      });
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape') {
          profileWrap.classList.remove('open');
          profileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
};

// ─── Scroll Animations ───
const ScrollAnimator = {
  observer: null,
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ─── Back to Top ───
const BackToTop = {
  init() {
    const btn = $('#back-to-top');
    if (!btn) return;
    on(window, 'scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ─── Counter Animation ───
const CounterAnimation = {
  init() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  },
  animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const duration = 2000;
    const decimals = (el.dataset.count.includes('.')) ? 1 : 0;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (ease * target).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
};

// ─── FAQ Accordion ───
const FAQ = {
  init() {
    $$('.faq-question').forEach(btn => {
      on(btn, 'click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        $$('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

// ─── Before/After Slider ───
const BeforeAfter = {
  init() {
    $$('.before-after-wrapper').forEach(wrapper => {
      const overlay = wrapper.querySelector('.before-after-overlay');
      const divider = wrapper.querySelector('.ba-divider');
      if (!overlay || !divider) return;

      let dragging = false;
      const getPos = (clientX) => {
        const rect = wrapper.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        return (x / rect.width) * 100;
      };

      const setPos = (pct) => {
        overlay.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        divider.style.left = pct + '%';
      };

      // Init at 50%
      setPos(50);

      on(wrapper, 'mousedown', (e) => { dragging = true; e.preventDefault(); });
      on(window, 'mousemove', (e) => { if (dragging) setPos(getPos(e.clientX)); });
      on(window, 'mouseup', () => { dragging = false; });
      on(wrapper, 'touchstart', () => { dragging = true; }, { passive: true });
      on(window, 'touchmove', (e) => {
        if (dragging) setPos(getPos(e.touches[0].clientX));
      }, { passive: true });
      on(window, 'touchend', () => { dragging = false; });
    });
  }
};

// ─── Hero Slider ───
const HeroSlider = {
  current: 0,
  slides: [],
  interval: null,
  init() {
    this.slides = $$('.hero-slide');
    const dots = $$('.hero-dot');
    const prevBtn = $('#hero-prev');
    const nextBtn = $('#hero-next');
    if (!this.slides.length) return;

    const show = (idx) => {
      this.slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
      this.current = idx;
    };

    dots.forEach((dot, i) => on(dot, 'click', () => { clearInterval(this.interval); show(i); this.autoPlay(); }));
    if (prevBtn) on(prevBtn, 'click', () => { clearInterval(this.interval); show((this.current - 1 + this.slides.length) % this.slides.length); this.autoPlay(); });
    if (nextBtn) on(nextBtn, 'click', () => { clearInterval(this.interval); show((this.current + 1) % this.slides.length); this.autoPlay(); });

    show(0);
    this.autoPlay();
  },
  autoPlay() {
    this.interval = setInterval(() => {
      const next = (this.current + 1) % this.slides.length;
      this.slides.forEach((s, i) => s.classList.toggle('active', i === next));
      $$('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === next));
      this.current = next;
    }, 5000);
  }
};

// ─── Service Filter ───
const ServiceFilter = {
  init() {
    const filters = $$('[data-filter-btn]');
    const cards = $$('[data-category]');
    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
      on(btn, 'click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filterBtn;
        cards.forEach(card => {
          const match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? '' : 'none';
          card.style.animation = match ? 'fadeIn 0.4s ease' : '';
        });
      });
    });
  }
};

// ─── Time Slot Picker ───
const TimeSlotPicker = {
  init() {
    $$('.time-slot:not(.unavailable)').forEach(slot => {
      on(slot, 'click', () => {
        $$('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        const input = $('[name="timeslot"]');
        if (input) input.value = slot.textContent.trim();
        // Show confirmation toast
        Toast.show('Time slot selected: ' + slot.textContent.trim(), 'info');
      });
    });
  }
};

// ─── Calendar Widget ───
const CalendarWidget = {
  today: new Date(),
  current: new Date(),
  selected: null,
  init() {
    const wrapper = $('#booking-calendar');
    if (!wrapper) return;
    this.render(wrapper);
  },
  render(wrapper) {
    const year = this.current.getFullYear();
    const month = this.current.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();

    // Mock booked days
    const booked = [5, 12, 18, 22, 27];

    let days = '';
    for (let d = 0; d < startDay; d++) {
      const prevDate = new Date(year, month, -startDay + d + 1);
      days += `<div class="calendar-day other-month disabled">${prevDate.getDate()}</div>`;
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(year, month, d);
      const isToday = date.toDateString() === this.today.toDateString();
      const isSelected = this.selected && date.toDateString() === this.selected.toDateString();
      const hasBook = booked.includes(d);
      const isPast = date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      let cls = 'calendar-day';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';
      if (hasBook) cls += ' has-booking';
      if (isPast) cls += ' disabled';
      days += `<div class="${cls}" data-date="${date.toISOString().split('T')[0]}">${d}</div>`;
    }

    wrapper.innerHTML = `
      <div class="calendar-header">
        <span class="calendar-title">${monthNames[month]} ${year}</span>
        <div class="calendar-nav">
          <button id="cal-prev">‹</button>
          <button id="cal-next">›</button>
        </div>
      </div>
      <div class="calendar-days-header">
        ${dayNames.map(d => `<div class="calendar-day-name">${d}</div>`).join('')}
      </div>
      <div class="calendar-grid">${days}</div>
    `;

    on($('#cal-prev', wrapper), 'click', () => { this.current.setMonth(month - 1); this.render(wrapper); });
    on($('#cal-next', wrapper), 'click', () => { this.current.setMonth(month + 1); this.render(wrapper); });

    $$('.calendar-day:not(.disabled):not(.other-month)', wrapper).forEach(day => {
      on(day, 'click', () => {
        $$('.calendar-day', wrapper).forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
        this.selected = new Date(day.dataset.date);
        const input = $('[name="booking-date"]');
        if (input) input.value = day.dataset.date;
        Toast.show('Date selected: ' + day.dataset.date, 'info');
      });
    });
  }
};

// ─── Form Validation ───
const FormValidator = {
  init() {
    $$('form[data-validate]').forEach(form => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        let valid = true;
        $$('[required]', form).forEach(field => {
          if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        });
        if (valid) {
          const successMsg = form.dataset.successMsg || 'Your request was submitted successfully!';
          Toast.show(successMsg, 'success');
          form.reset();
          const redirect = form.dataset.redirect;
          if (redirect) setTimeout(() => { window.location.href = redirect; }, 1400);
        } else {
          Toast.show('Please fill all required fields.', 'error');
        }
      });
      $$('[required]', form).forEach(field => {
        on(field, 'input', () => {
          field.classList.toggle('is-invalid', !field.value.trim());
        });
      });
    });
  }
};

// ─── Toast Notifications ───
const Toast = {
  container: null,
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
    // Show cookie banner
    const banner = $('#cookie-banner');
    if (banner && !localStorage.getItem('cookie-accepted')) {
      setTimeout(() => banner.classList.add('visible'), 2000);
      const acceptBtn = $('#cookie-accept');
      if (acceptBtn) {
        on(acceptBtn, 'click', () => {
          banner.classList.remove('visible');
          localStorage.setItem('cookie-accepted', '1');
        });
      }
    }
  },
  show(message, type = 'info', duration = 4000) {
    const icons = {
      success: ['fa-solid fa-circle-check', 'var(--success)'],
      error: ['fa-solid fa-circle-xmark', 'var(--danger)'],
      info: ['fa-solid fa-circle-info', 'var(--electric)'],
      warning: ['fa-solid fa-triangle-exclamation', 'var(--warning)']
    };
    const [iconCls, iconColor] = icons[type] || icons.info;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconCls}" style="font-size:1.1rem;color:${iconColor};flex-shrink:0"></i><span>${message}</span>`;
    this.container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

// ─── Modal Manager ───
const Modal = {
  init() {
    $$('[data-modal-open]').forEach(btn => {
      on(btn, 'click', () => {
        const modal = $('#' + btn.dataset.modalOpen);
        if (modal) modal.classList.add('open');
      });
    });
    $$('[data-modal-close], .modal-overlay').forEach(el => {
      on(el, 'click', (e) => {
        if (e.target === el || el.dataset.modalClose !== undefined) {
          el.closest('.modal-overlay')?.classList.remove('open');
        }
      });
    });
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') $$('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    });
  }
};

// ─── Stats Ticker ───
const StatsTicker = {
  init() {
    $$('[data-ticker]').forEach(ticker => {
      const items = ticker.querySelectorAll('.ticker-item');
      let idx = 0;
      setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
      }, 3000);
      if (items[0]) items[0].classList.add('active');
    });
  }
};

// ─── Smooth Scroll for anchor links ───
const SmoothScroll = {
  init() {
    $$('a[href^="#"]').forEach(link => {
      on(link, 'click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

// ─── Progress Bar fill on scroll ───
const ProgressFill = {
  init() {
    const bars = $$('.progress-fill[data-width]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => { b.style.width = '0'; observer.observe(b); });
  }
};

// ─── Tabs ───
const Tabs = {
  init() {
    $$('[data-tab-group]').forEach(group => {
      const groupId = group.dataset.tabGroup;
      const tabs = $$(`[data-tab="${groupId}"]`);
      const panels = $$(`[data-tab-panel="${groupId}"]`);
      tabs.forEach((tab, i) => {
        on(tab, 'click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.style.display = 'none');
          tab.classList.add('active');
          if (panels[i]) panels[i].style.display = '';
        });
      });
      if (panels[0]) panels[0].style.display = '';
    });
  }
};

// ─── Rating Stars ───
const RatingStars = {
  init() {
    $$('[data-rating-input]').forEach(container => {
      const stars = $$('.rating-star', container);
      const paint = (count) => {
        stars.forEach((s, j) => {
          const active = j < count;
          s.classList.add('fa-star');
          s.classList.toggle('fa-solid', active);
          s.classList.toggle('fa-regular', !active);
          s.style.color = active ? 'var(--warning)' : 'var(--text-muted)';
        });
      };
      stars.forEach((star, i) => {
        on(star, 'click', () => {
          container.dataset.rated = i + 1;
          paint(i + 1);
          const input = $('[name="rating"]', container.closest('form'));
          if (input) input.value = i + 1;
        });
        on(star, 'mouseenter', () => paint(i + 1));
      });
      on(container, 'mouseleave', () => paint(parseInt(container.dataset.rated || '0', 10)));
      paint(parseInt(container.dataset.rated || '0', 10));
    });
  }
};

// ─── Dashboard Sidebar Toggle (mobile) ───
const DashboardSidebar = {
  init() {
    const toggle = $('#sidebar-toggle');
    const sidebar = $('#dashboard-sidebar');
    if (!toggle || !sidebar) return;
    on(toggle, 'click', () => {
      sidebar.classList.toggle('open');
    });
    // Close when a sidebar link is tapped (mobile overlay)
    on(sidebar, 'click', (e) => {
      if (e.target.closest('a')) sidebar.classList.remove('open');
    });
    // Close on outside click
    on(document, 'click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
};

// ─── Chart Period Selector ───
const ChartPeriod = {
  init() {
    $$('.chart-period').forEach(group => {
      const buttons = $$('button', group);
      buttons.forEach(btn => {
        on(btn, 'click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });
  }
};

// ─── Tech Tracker (simulated) ───
const TechTracker = {
  init() {
    const dot = $('#tech-dot');
    if (!dot) return;
    let x = 40, y = 50, dirX = 1, dirY = 0.5;
    setInterval(() => {
      x = Math.max(10, Math.min(80, x + dirX * (Math.random() * 3)));
      y = Math.max(20, Math.min(70, y + dirY * (Math.random() * 2)));
      if (x >= 80 || x <= 10) dirX *= -1;
      if (y >= 70 || y <= 20) dirY *= -1;
      dot.style.left = x + '%';
      dot.style.top = y + '%';
    }, 1500);
  }
};

// ─── Admin Bookings Table (simulated live) ───
const LiveTable = {
  init() {
    const counter = $('#live-booking-count');
    if (!counter) return;
    let count = parseInt(counter.textContent) || 0;
    setInterval(() => {
      if (Math.random() > 0.7) {
        count++;
        counter.textContent = count;
        counter.style.animation = 'none';
        requestAnimationFrame(() => {
          counter.style.animation = 'slideInDown 0.4s ease';
        });
      }
    }, 8000);
  }
};

// ─── Search (Admin) ───
const AdminSearch = {
  init() {
    const searchInputs = $$('.admin-search input');
    searchInputs.forEach(input => {
      on(input, 'input', () => {
        const query = input.value.toLowerCase();
        const tableId = input.dataset.searchTable;
        const table = tableId ? $(`#${tableId}`) : input.closest('.admin-table-wrapper')?.querySelector('table');
        if (!table) return;
        $$('tbody tr', table).forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    });
  }
};

// ─── Blog Post Deep-Linking ───
// Cards on blog.html carry data-post="<slug>". Clicking one opens
// blog-details.html?post=<slug> so the details page shows that card's
// image, title and category dynamically (sessionStorage as fallback).
const BLOG_POSTS = {
  'choose-package': { img: '../assets/images/blog-featured-sedan.jpg', alt: 'Silver sedan after a full detailing package', title: 'How to Choose the Right Car Detailing Package for Your Vehicle in 2026', category: 'Detailing Guide' },
  'clay-bar-guide': { img: '../assets/images/blog-clay-roadster.jpg', alt: 'Glossy blue classic roadster', title: 'The Complete Clay Bar Guide: When and Why to Use It', category: 'Tips & Tricks' },
  'carnauba-waxes-2026': { img: '../assets/images/blog-wax-dupont-ad.jpg', alt: 'Vintage DuPont car polish advertisement', title: 'Best Carnauba Waxes of 2026: Professional Tested', category: 'Products' },
  'swirl-marks': { img: '../assets/images/blog-swirl-reflection.jpg', alt: 'City lights reflecting in swirl-free paint', title: 'How to Remove Swirl Marks Without a Machine Polisher', category: 'How-To' },
  'mobile-boom': { img: '../assets/images/blog-market-traffic.jpg', alt: 'City traffic viewed through a windshield', title: 'Why Mobile Car Detailing Is Booming in 2026', category: 'Industry' },
  'interior-secrets': { img: '../assets/images/blog-interior-dash.jpg', alt: 'Detailed dashboard and leather trim', title: '10 Interior Detailing Secrets Only Professionals Know', category: 'Tips & Tricks' },
  'gyeon-review': { img: '../assets/images/blog-ceramic-mercedes.jpg', alt: 'Black Mercedes with fresh ceramic coating', title: 'Gyeon Q2 Ceramic Coating: 12-Month Real-World Review', category: 'Reviews' }
};
const BlogPost = {
  key: 'cargloss-post',
  init() {
    // Listing / related links: append ?post=<slug> and remember the choice.
    $$('[data-post]').forEach(el => {
      const slug = el.dataset.post;
      if (!BLOG_POSTS[slug]) return;
      const href = el.getAttribute('href') || '';
      if (href.includes('blog-details.html') && !href.includes('?post=')) {
        el.setAttribute('href', `blog-details.html?post=${slug}`);
      }
      on(el, 'click', () => {
        try { sessionStorage.setItem(this.key, slug); } catch (e) {}
      });
    });
    // Details page: apply ?post=<slug> (else stored slug, else default content).
    const heroImg = $('#post-hero-img');
    if (!heroImg) return;
    let slug = null;
    try { slug = new URLSearchParams(location.search).get('post'); } catch (e) {}
    if (!slug || !BLOG_POSTS[slug]) {
      try { slug = sessionStorage.getItem(this.key); } catch (e) {}
    }
    const post = BLOG_POSTS[slug];
    if (!post) return;
    heroImg.src = post.img;
    heroImg.alt = post.alt;
    const title = $('#post-title');
    if (title) title.textContent = post.title;
    const cat = $('#post-category');
    if (cat) cat.textContent = post.category;
    const crumb = $('#post-crumb');
    if (crumb) crumb.textContent = post.category;
    document.title = `${post.title} – CarGloss Blog`;
  }
};

// ─── Init on DOM Ready ───
document.addEventListener('DOMContentLoaded', () => {
  BlogPost.init();
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  ScrollAnimator.init();
  BackToTop.init();
  CounterAnimation.init();
  FAQ.init();
  BeforeAfter.init();
  HeroSlider.init();
  ServiceFilter.init();
  TimeSlotPicker.init();
  CalendarWidget.init();
  FormValidator.init();
  Toast.init();
  Modal.init();
  SmoothScroll.init();
  ProgressFill.init();
  Tabs.init();
  RatingStars.init();
  DashboardSidebar.init();
  ChartPeriod.init();
  TechTracker.init();
  LiveTable.init();
  AdminSearch.init();
  StatsTicker.init();
});
