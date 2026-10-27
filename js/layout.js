/* Shared header + footer, injected into [data-header] and [data-footer]. Needs data/branches.js first. */
(function () {
  var B = window.BRANCHES || [], S = window.SCHOOL || {};
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  if (page === 'branch') page = 'branches';
  if (!document.querySelector('link[rel="icon"]')) {
    var fav = document.createElement('link'); fav.rel = 'icon'; fav.href = 'img/logo-mark.png'; document.head.appendChild(fav);
  }

  var NAV = [
    { label: 'Home', href: 'index.html', id: 'index' },
    { label: 'About', href: 'about.html', id: 'about', items: [
      ['Our Story', 'about.html#story'], ['Vision & Mission', 'about.html#vision'], ['Leadership', 'about.html#leadership']] },
    { label: 'Branches', href: 'branches.html', id: 'branches', items:
      [['Overview', 'branches.html']].concat(B.map(function (b) { return [b.name, 'branch.html?b=' + b.slug]; })) },
    { label: 'Academics', href: 'academics.html', id: 'academics', items: [
      ['Curriculum', 'academics.html#curriculum'], ['Programs', 'academics.html#programs'], ['Assessment', 'academics.html#assessment']] },
    { label: 'Campus Life', href: 'campus-life.html', id: 'campus-life', items: [
      ['Sports', 'campus-life.html#sports'], ['Arts & Creativity', 'campus-life.html#arts'], ['Clubs', 'campus-life.html#clubs'],
      ['Events', 'campus-life.html#events'], ['Community', 'campus-life.html#community']] },
    { label: 'Facilities', href: 'facilities.html', id: 'facilities' },
    { label: 'Contact', href: 'contact.html', id: 'contact' }
  ];

  var ic = {
    chev: '<path d="m6 9 6 6 6-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    ig: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    yt: '<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><path d="m9.8 15.5 5.7-3.5-5.7-3.5z"/>',
    in: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'
  };
  function svg(n, cls) { return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ic[n] + '</svg>'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var logo = '<a class="logo" href="index.html" aria-label="Srividya\'s Abhyasana home">' +
    '<img src="img/logo-mark.png" alt="" width="46" height="40">' +
    '<span class="logo-text"><small>Srividya\'s</small><b>Abhyasana</b><i>The School</i></span></a>';

  var navHtml = NAV.map(function (n, i) {
    var cur = n.id === page ? ' aria-current="page"' : '';
    if (!n.items) return '<li class="nav-item"><a class="nav-link" href="' + n.href + '"' + cur + '>' + n.label + '</a></li>';
    return '<li class="nav-item"><button class="nav-link" type="button" aria-expanded="false" aria-controls="sub-' + i + '"' + cur + '>' +
      n.label + svg('chev', 'chev') + '</button><div class="sub" id="sub-' + i + '"><ul>' +
      n.items.map(function (s) { return '<li><a href="' + s[1] + '">' + esc(s[0]) + '</a></li>'; }).join('') + '</ul></div></li>';
  }).join('');

  var header = '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="site-header"><div class="wrap hdr-row">' + logo +
    '<nav class="nav" id="site-nav" aria-label="Main"><ul>' + navHtml + '</ul></nav>' +
    '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>' +
    '</div></header>';

  var mbar = '<div class="mbar"><a class="btn btn-outline" href="tel:' + S.tel + '">' + svg('phone') + 'Call</a>' +
    '<a class="btn btn-primary" href="contact.html#enquiry">' + svg('edit') + 'Enquire</a></div>';

  function col(title, links) {
    return '<div><h4>' + title + '</h4><ul class="ft-links">' +
      links.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul></div>';
  }
  var footer = '<footer class="site-footer"><div class="wrap"><div class="ft-grid">' +
    '<div class="ft-brand"><span class="logo-plate">' + logo + '</span>' +
      '<p>Five campuses across Telangana, 34 years of nurturing curious, confident and compassionate learners.</p></div>' +
    col('Quick Links', [['About Us', 'about.html'], ['Academics', 'academics.html'], ['Campus Life', 'campus-life.html'],
      ['Facilities', 'facilities.html'], ['Admissions', 'contact.html#enquiry']]) +
    col('Our Branches', B.map(function (b) { return [b.name, 'branch.html?b=' + b.slug]; })) +
    col('Support', [['Contact Us', 'contact.html'], ['Careers', 'contact.html#touch'], ['Privacy Policy', '#'], ['Terms & Conditions', '#']]) +
    '<div><h4>Connect With Us</h4><div class="social">' +
      '<a href="#" aria-label="Facebook">' + svg('fb') + '</a><a href="#" aria-label="Instagram">' + svg('ig') + '</a>' +
      '<a href="#" aria-label="YouTube">' + svg('yt') + '</a><a href="#" aria-label="LinkedIn">' + svg('in') + '</a></div>' +
      '<ul class="ft-contact"><li>' + svg('phone') + '<a href="tel:' + S.tel + '">' + S.phone + '</a></li>' +
      '<li>' + svg('mail') + '<a href="mailto:' + S.email + '">' + S.email + '</a></li></ul></div>' +
    '</div><div class="ft-bot"><span>© ' + new Date().getFullYear() + ' Srividya\'s Abhyasana — The School. All rights reserved.</span>' +
    '<span><a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a></span></div></div></footer>';

  var h = document.querySelector('[data-header]'), f = document.querySelector('[data-footer]');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer + mbar;
})();
