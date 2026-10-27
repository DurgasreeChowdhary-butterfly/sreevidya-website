/* branch.html?b=slug — fills the template from data/branches.js; unknown slug → branches.html */
(function () {
  var slug = new URLSearchParams(location.search).get('b');
  var b = (window.BRANCHES || []).filter(function (x) { return x.slug === slug; })[0];
  if (!b) { location.replace('branches.html'); return; }

  document.title = b.name + ' Campus — Srividya\'s Abhyasana';
  var s = b.stats || {};
  var val = {
    name: b.name, city: b.city, blurb: b.blurb,
    location: b.address || b.city + ', ' + b.state,
    students: s.students ? s.students.toLocaleString('en-IN') + '+' : '—',
    educators: s.educators ? s.educators + '+' : '—',
    area: s.area ? s.area + 'L+' : '—'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var meta = document.querySelector('meta[name=description]');
    if (meta) meta.content = b.name + ' campus of Srividya\'s Abhyasana, ' + b.city + '. ' + b.blurb;
    document.querySelectorAll('[data-b]').forEach(function (el) {
      var k = el.dataset.b;
      if (k === 'image') { el.src = b.image; el.alt = b.name + ' campus of Srividya\'s Abhyasana'; }
      else if (k === 'directions') {
        el.href = 'https://www.google.com/maps/search/?api=1&query=' +
          encodeURIComponent('Srividya\'s Abhyasana ' + b.name + ' ' + b.city);
      } else if (k === 'highlights') {
        el.innerHTML = (b.highlights || []).map(function (h) {
          return '<figure class="hl"><img src="' + h[0] + '" alt="' + h[1] + ' at ' + b.name + ' campus" loading="lazy" width="300" height="300"><figcaption>' + h[1] + '</figcaption></figure>';
        }).join('');
      } else if (k in val) el.textContent = val[k];
    });
  });
})();
