(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const AR = n => n.toLocaleString('ar-EG');

/* stars */
function stars(el, n) {
  if (!el) return;
  let h = '';
  for (let i = 0; i < n; i++) {
    const s = rnd(1, 2.6).toFixed(1);
    h += `<i style="left:${rnd(0, 100).toFixed(1)}%;top:${rnd(0, 75).toFixed(1)}%;width:${s}px;height:${s}px;--o:${rnd(.3, 1).toFixed(2)};--t:${rnd(2, 5).toFixed(1)}s;animation-delay:-${rnd(0, 5).toFixed(1)}s"></i>`;
  }
  el.innerHTML = h;
}
stars($('#heroStars'), 110); stars($('#ideaStars'), 50); stars($('#scrStars'), 50); stars($('#ctaStars'), 60);

/* skyline */
function skyline(svg, H, ground, big) {
  let h = '';
  [[60, 150], [250, 120], [480, 170], [780, 130], [1030, 165], [1260, 140]].forEach(([x, s]) =>
    h += `<use href="#mosque" x="${x - s / 2}" y="${H - s - 20}" width="${s}" height="${s}" fill="#0a4a37" opacity=".5"/>`);
  [[170, 230], [1120, 250]].forEach(([x, s]) =>
    h += `<use href="#mosque" x="${x - s / 2}" y="${H - s - 8}" width="${s}" height="${s}" fill="#073a2b"/>`);
  if (big) h += `<use href="#mosque" x="${720 - 190}" y="${H - 380}" width="380" height="380" fill="${ground}"/>`;
  let x = -10;
  while (x < 1450) {
    const w = rnd(44, 92), ht = rnd(28, big ? 84 : 60);
    h += `<rect x="${x}" y="${H - ht}" width="${w + 1}" height="${ht + 2}" fill="${ground}"/>`;
    if (big) for (let cx = x + 8; cx < x + w - 10; cx += 16)
      for (let cy = H - ht + 10; cy < H - 10; cy += 20)
        if (Math.random() < .24) h += `<rect class="w" x="${cx}" y="${cy}" width="6" height="9" rx="1.5" fill="#f7dc9b" style="--f:${rnd(3, 8).toFixed(1)}s;animation-delay:-${rnd(0, 6).toFixed(1)}s"/>`;
    x += w + rnd(0, 6);
  }
  svg.innerHTML = h;
}
skyline($('#skyline'), 400, '#052a20', true);
skyline($('#ctaSky'), 260, '#03110d', false);

/* header, menu, progress, parallax */
const hdr = $('#hdr'), prog = $('#prog'), hero = $('.hero');
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  hdr.classList.toggle('scrolled', y > 30);
  prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (y < innerHeight * 1.2) {
    $('.moon').style.marginTop = `${y * .12}px`;
    $('#skyline').style.transform = `translateY(${y * -.05}px)`;
  }
  journey();
}
addEventListener('scroll', onScroll, { passive: true });
$('#burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
$$('#drawer a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%');
  hero.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100) + '%');
});

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal, .j-row').forEach(el => io.observe(el));

/* counters */
$$('[data-count]').forEach(el => {
  const to = +el.dataset.count; let t0;
  const step = t => { t0 ??= t; const p = clamp((t - t0) / 1400, 0, 1); el.textContent = AR(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
  el.textContent = AR(0); setTimeout(() => requestAnimationFrame(step), 700);
});

/* hero phone status loop */
const hs = $$('#heroPhone .hs'), labels = ['بانتظار الاستلام', 'تم استلام البلاغ', 'راجعه المشرف', 'أُحيل لشركة الصيانة', 'الفريق في الطريق', 'تم إغلاق البلاغ ✓'];
let hstep = 0;
function heroStep() {
  hs.forEach((s, i) => s.classList.toggle('on', i < hstep));
  $('#hpLabel').textContent = labels[hstep];
  hstep = (hstep + 1) % 6;
  setTimeout(heroStep, hstep === 0 ? 2600 : 1500);
}
heroStep();

/* orbit */
(() => {
  const g = $('#orbitRot'), C = 300;
  const pol = (r, a) => ({ x: C + r * Math.cos(a * Math.PI / 180), y: C + r * Math.sin(a * Math.PI / 180) });
  let h = `<circle class="ring" cx="${C}" cy="${C}" r="130"/><circle class="ring" cx="${C}" cy="${C}" r="230"/>`;
  let nodes = '', pulses = '', k = 0;
  [-90, 30, 150].forEach(a => {
    const p = pol(130, a);
    h += `<line class="ln" x1="${C}" y1="${C}" x2="${p.x}" y2="${p.y}"/>`;
    pulses += `<circle class="pulse" r="3.5"><animateMotion dur="2.6s" begin="${(k * .5).toFixed(1)}s" repeatCount="indefinite" path="M${p.x} ${p.y} L${C} ${C}"/></circle>`;
    [-19, 0, 19].forEach(o => {
      const q = pol(230, a + o);
      h += `<line class="ln" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
      nodes += `<g class="n-imam"><circle cx="${q.x}" cy="${q.y}" r="9"/><circle cx="${q.x}" cy="${q.y}" r="2.6" fill="#5eeab0"/></g>`;
      pulses += `<circle class="pulse" r="3"><animateMotion dur="3s" begin="${(k++ * .35).toFixed(2)}s" repeatCount="indefinite" path="M${q.x} ${q.y} L${p.x} ${p.y}"/></circle>`;
    });
    nodes += `<g class="n-sup"><circle class="o" cx="${p.x}" cy="${p.y}" r="19"/><circle class="c" cx="${p.x}" cy="${p.y}" r="6"/></g>`;
  });
  g.innerHTML = h + pulses + nodes;

  const orbit = $('#orbit'), roles = $$('.role');
  let cur = 0, timer;
  const set = i => {
    cur = i;
    roles.forEach((r, j) => { r.classList.remove('active'); });
    void roles[0].offsetWidth;
    roles[i].classList.add('active');
    orbit.dataset.active = roles[i].dataset.role;
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => set((cur + 1) % 3), 5200); };
  roles.forEach((r, i) => r.addEventListener('click', () => { set(i); auto(); }));
  auto();
})();

/* journey */
const jWrap = $('#journeyWrap'), spine = $('#spine'), sFill = $('#spineFill'), rows = $$('.j-row');
function layoutSpine() {
  const nodes = $$('.j-node span', jWrap);
  const wr = jWrap.getBoundingClientRect();
  const a = nodes[0].getBoundingClientRect(), b = nodes[nodes.length - 1].getBoundingClientRect();
  spine.style.top = (a.top + a.height / 2 - wr.top) + 'px';
  spine.style.height = (b.top - a.top) + 'px';
}
function journey() {
  const sr = spine.getBoundingClientRect(), line = innerHeight * .6;
  sFill.style.transform = `scaleY(${clamp((line - sr.top) / (sr.height || 1), 0, 1)})`;
  rows.forEach(r => {
    const t = r.getBoundingClientRect();
    r.classList.toggle('reached', t.top + t.height / 2 < line);
  });
}
$$('.j-art svg').forEach(svg => $$('path,circle,rect', svg).forEach(el => el.setAttribute('pathLength', '1')));
addEventListener('resize', () => { layoutSpine(); journey(); });
addEventListener('load', () => { layoutSpine(); journey(); });
layoutSpine(); journey();

/* amenities */
const IC = {
  women: '<circle cx="12" cy="6" r="3"/><path d="M7 21c0-4.5 2.5-8 5-8s5 3.5 5 8"/>',
  lift: '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="m10 9 2-2 2 2M10 15l2 2 2-2"/>',
  ramp: '<path d="M4 20h16M4 20 14 7h3l3 13"/><circle cx="6.5" cy="16.5" r="2.3"/>',
  park: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 8h3.2a2.3 2.3 0 0 1 0 4.6H9V8zm0 4.6V16"/>',
  wudu: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  cool: '<path d="M12 2v20M12 2 8 6M12 2l4 4M12 22l-4-4M12 22l4-4M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4"/>',
  quran: '<path d="M12 6.5c-1.8-1.4-4.3-2-7-1.7v13.4c2.7-.3 5.2.3 7 1.7m0-13.4c1.8-1.4 4.3-2 7-1.7v13.4c-2.7-.3-5.2.3-7 1.7m0-13.4v13.4"/>'
};
const AM = [
  { n: 'مصلى نساء', d: 'مصلى مخصص بمدخل ومرافق مستقلة', x: 808, y: 268, i: 'women' },
  { n: 'مصعد', d: 'لكبار السن وذوي الاحتياجات', x: 675, y: 232, i: 'lift' },
  { n: 'منحدر', d: 'مدخل مهيّأ للكراسي المتحركة', x: 385, y: 432, i: 'ramp' },
  { n: 'مواقف', d: 'مواقف للمصلين بجوار المسجد', x: 714, y: 366, i: 'park' },
  { n: 'ميضأة', d: 'ميضأة نظيفة ومهيّأة', x: 145, y: 384, i: 'wudu' },
  { n: 'مبرّدات', d: 'مبرّدات هواء وتكييف للمصلى', x: 151, y: 294, i: 'cool' },
  { n: 'حلقة تحفيظ', d: 'حلقات لتحفيظ القرآن الكريم', x: 558, y: 288, i: 'quran' }
];
(() => {
  const pins = $('#pins'), list = $('#amenList');
  let ph = '', lh = '';
  AM.forEach((a, i) => {
    const w = a.n.length * 11 + 34;
    ph += `<g class="pin" data-i="${i}" transform="translate(${a.x} ${a.y})" tabindex="0" aria-label="${a.n}">
      <circle class="halo" r="15" fill="#e6b85c"/><circle class="dot" r="11" fill="#e6b85c" stroke="#fff" stroke-width="3"/>
      <text y="4.5" text-anchor="middle" font-size="12" font-weight="700" fill="#0d211a">${AR(i + 1)}</text>
      <g class="tip" transform="translate(0 -44)"><rect x="${-w / 2}" y="-16" width="${w}" height="30" rx="15" fill="#0d211a"/><path d="M-6 13l6 8 6-8z" fill="#0d211a"/><text y="4" text-anchor="middle" font-size="14" font-weight="600" fill="#fff">${a.n}</text></g></g>`;
    lh += `<li data-i="${i}"><svg viewBox="0 0 24 24">${IC[a.i]}</svg><div><b>${a.n}</b><small>${a.d}</small></div></li>`;
  });
  pins.innerHTML = ph; list.innerHTML = lh;
  const P = $$('.pin', pins), L = $$('li', list);
  let cur = -1, timer;
  const set = i => { cur = i; P.forEach((p, j) => p.classList.toggle('active', j === i)); L.forEach((l, j) => l.classList.toggle('active', j === i)); };
  const auto = () => { clearInterval(timer); timer = setInterval(() => set((cur + 1) % AM.length), 2600); };
  [...P, ...L].forEach(el => {
    const i = +el.dataset.i;
    ['mouseenter', 'focus', 'click'].forEach(ev => el.addEventListener(ev, () => { set(i); clearInterval(timer); }));
    el.addEventListener('mouseleave', auto);
  });
  set(0); auto();
})();

/* phones */
(() => {
  const ph = $$('.pw'), btn = $$('#stepsNav button');
  let cur = 0, timer;
  const set = i => {
    cur = i;
    ph.forEach(p => p.classList.remove('play'));
    void document.body.offsetWidth;
    ph.forEach((p, k) => {
      const d = ((k - i + 1) % 3 + 3) % 3 - 1;
      p.dataset.pos = d === 0 ? 'c' : d === 1 ? 'l' : 'r';
      p.classList.toggle('play', d === 0);
    });
    btn.forEach((b, k) => b.classList.toggle('on', k === i));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => set((cur + 1) % 3), 6500); };
  ph.forEach((p, i) => p.addEventListener('click', () => { set(i); auto(); }));
  btn.forEach((b, i) => b.addEventListener('click', () => { set(i); auto(); }));
  set(0); auto();
})();

/* features spotlight */
$$('.f').forEach(f => f.addEventListener('pointermove', e => {
  const r = f.getBoundingClientRect();
  f.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  f.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

/* partners marquee */
(() => {
  const G = [
    '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',
    '<path d="M4 20 12 4l8 16z"/>',
    '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/>',
    '<path d="M12 3l8 5v8l-8 5-8-5V8z"/>',
    '<path d="M4 12c4-8 12-8 16 0-4 8-12 8-16 0z"/><circle cx="12" cy="12" r="2.5"/>',
    '<path d="M5 19V9l7-5 7 5v10z"/><path d="M10 19v-5h4v5"/>'
  ];
  let h = '';
  for (let r = 0; r < 2; r++) G.forEach((g, i) => h += `<div class="logo-ph"><svg viewBox="0 0 24 24">${g}</svg>شعار شريك ${AR(i + 1)}</div>`);
  $('#track').innerHTML = h;
})();

$('#year').textContent = new Date().getFullYear();
onScroll();
})();
