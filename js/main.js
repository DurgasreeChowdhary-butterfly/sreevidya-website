/* Site behaviour: menu, reveal, counters, carousels. Load after layout.js. */
(function () {
  var doc = document.documentElement, body = document.body;
  var desktop = window.matchMedia('(min-width:1024px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu: hamburger + accordion (mobile), click/hover dropdowns (desktop) */
  function initMenu() {
    var burger = document.querySelector('.burger'), header = document.querySelector('.site-header');
    if (!header) return;
    function setOpen(open) {
      body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    function closeAll(except) {
      header.querySelectorAll('.nav-item.open').forEach(function (it) {
        if (it !== except) { it.classList.remove('open'); it.firstElementChild.setAttribute('aria-expanded', 'false'); }
      });
    }
    burger && burger.addEventListener('click', function () { setOpen(!body.classList.contains('nav-open')); });
    header.querySelectorAll('button.nav-link').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.parentElement, open = !item.classList.contains('open');
        closeAll(item);
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
      });
    });
    document.addEventListener('click', function (e) { if (desktop.matches && !e.target.closest('.nav-item')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); setOpen(false); } });
    desktop.addEventListener('change', function () { setOpen(false); closeAll(); });
    window.addEventListener('scroll', function () { header.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  }

  /* Scroll reveal: add .reveal to elements */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Counters: <span data-count="14000" data-suffix="+">0</span> */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    function fmt(n, el) { return Number(n).toLocaleString('en-IN', { maximumFractionDigits: +(el.dataset.decimals || 0) }) + (el.dataset.suffix || ''); }
    function run(el) {
      var end = parseFloat(el.dataset.count), t0 = null, dur = 1600;
      if (reduced) { el.textContent = fmt(end, el); return; }
      requestAnimationFrame(function step(t) {
        t0 = t0 || t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * e, el);
        if (p < 1) requestAnimationFrame(step);
      });
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Carousels: [data-carousel] > .track (scroll-snap) + [data-prev]/[data-next] */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (c) {
      var track = c.querySelector('.track');
      if (!track) return;
      function go(dir) {
        var item = track.firstElementChild, step = item ? item.getBoundingClientRect().width + 16 : track.clientWidth;
        track.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
      }
      var p = c.querySelector('[data-prev]'), n = c.querySelector('[data-next]');
      p && p.addEventListener('click', function () { go(-1); });
      n && n.addEventListener('click', function () { go(1); });
    });
  }

  /* Branch cards from data/branches.js into [data-branch-cards] */
  function renderBranches() {
    var B = window.BRANCHES || [];
    document.querySelectorAll('[data-branch-cards]').forEach(function (el) {
      el.innerHTML = B.map(function (b) {
        return '<a class="branch-card" href="branch.html?b=' + b.slug + '">' +
          '<img src="img/campus-' + b.slug + '.jpg" alt="' + b.name + ' campus" loading="lazy" width="600" height="450">' +
          '<b>' + b.name + '</b><small>' + (b.region || b.city) + '</small></a>';
      }).join('');
      var bar = el.parentElement.querySelector('[data-progress]');
      if (!bar) return;
      function upd() {
        var max = el.scrollWidth - el.clientWidth;
        bar.style.width = (max > 0 ? (el.clientWidth + el.scrollLeft) / el.scrollWidth * 100 : 100) + '%';
      }
      el.addEventListener('scroll', upd, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    });
    var pin = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    var arrow = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    document.querySelectorAll('[data-branch-list]').forEach(function (el) {
      el.innerHTML = B.map(function (b) {
        return '<a class="card bcard reveal" href="branch.html?b=' + b.slug + '">' +
          '<img src="' + b.image + '" alt="' + b.name + ' campus" loading="lazy" width="480" height="300">' +
          '<div class="card-body"><h3>' + b.name + '</h3><span class="loc">' + pin + b.city + ', ' + b.state + '</span>' +
          '<p>' + b.blurb + '</p><span class="arrow-link">View Campus' + arrow + '</span></div></a>';
      }).join('');
    });
  }

  /* Sticky tabs: highlight the section in view */
  function initTabs() {
    var links = document.querySelectorAll('.tabs a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.hash.slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var a = map[en.target.id];
        a.classList.add('active'); a.setAttribute('aria-current', 'true');
        var ul = a.closest('ul');
        ul.scrollLeft = a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2;
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); s && io.observe(s); });
  }

  /* Contact: branch addresses + enquiry form (client-side only, no backend) */
  function initContact() {
    var B = window.BRANCHES || [];
    document.querySelectorAll('[data-branch-addresses]').forEach(function (el) {
      el.innerHTML = B.map(function (b) {
        return '<div class="card addr reveal"><h3>' + b.name + '</h3><p>' + (b.address || b.city + ', ' + b.state) + '</p>' +
          '<a class="arrow-link" href="branch.html?b=' + b.slug + '">View Campus</a></div>';
      }).join('');
    });

    var box = document.querySelector('[data-enquiry]');
    if (!box) return;
    var form = box.querySelector('form'), done = box.querySelector('.form-done'), sel = form.elements.namedItem('branch');
    B.forEach(function (b) { sel.add(new Option(b.name + ' (' + b.city + ')', b.slug)); });
    var pre = new URLSearchParams(location.search).get('b');
    if (pre) sel.value = pre;

    var rules = {
      name: function (v) { return v.length >= 2 || 'Please enter your name.'; },
      phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '')) || 'Enter a valid 10-digit mobile number.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address.'; },
      branch: function (v) { return !!v || 'Please choose a campus.'; },
      grade: function (v) { return !!v || 'Please choose a grade.'; }
    };
    function check(name) {
      var f = form.elements.namedItem(name), r = rules[name](f.value.trim()), err = document.getElementById('e-' + name);
      var ok = r === true;
      f.setAttribute('aria-invalid', !ok);
      f.setAttribute('aria-describedby', 'e-' + name);
      err.textContent = ok ? '' : r;
      return ok;
    }
    Object.keys(rules).forEach(function (n) {
      form.elements.namedItem(n).addEventListener('blur', function () { if (form.elements.namedItem(n).value) check(n); });
      form.elements.namedItem(n).addEventListener('input', function () { if (form.elements.namedItem(n).getAttribute('aria-invalid') === 'true') check(n); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = Object.keys(rules).filter(function (n) { return !check(n); });
      if (bad.length) { form.elements.namedItem(bad[0]).focus(); return; }
      var br = sel.options[sel.selectedIndex].text;
      box.querySelector('[data-done-msg]').textContent = 'Thanks, ' + form.elements.namedItem('name').value.trim().split(' ')[0] +
        '. Our ' + br + ' admissions team will call you back shortly about ' + form.elements.namedItem('grade').value + '.';
      form.hidden = true; done.hidden = false; done.focus();
    });
    box.querySelector('[data-reset]').addEventListener('click', function () {
      form.reset(); done.hidden = true; form.hidden = false;
      form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
      form.elements.namedItem('name').focus();
    });
  }

  doc.classList.add('js');
  renderBranches(); initContact(); initMenu(); initTabs(); initReveal(); initCounters(); initCarousels();
})();
