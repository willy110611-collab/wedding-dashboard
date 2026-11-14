/* Wedding dashboard theme: earth (大地色) */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};

  /* ---------- tiny SVG helpers (run once at load, results are plain strings) ---------- */
  var OLIVE = '#8A9A6B', OLIVE_D = '#6E7E52', SAGE = '#A9B48C', TERRA = '#C08A6A', TERRA_D = '#A86F50',
      OCHRE = '#C9A45E', STEM = '#7C6A4C';
  function r(n) { return Math.round(n * 10) / 10; }
  function leaf(x, y, a, l, w, f, o) {
    return '<path transform="translate(' + r(x) + ' ' + r(y) + ') rotate(' + r(a) + ')" d="M0 0Q' + r(l * 0.42) + ' ' + r(-w) +
      ' ' + r(l) + ' 0Q' + r(l * 0.5) + ' ' + r(w * 0.9) + ' 0 0Z" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : '') + '/>';
  }
  function wheat(x, y, a, l, c) {
    var s = '<g transform="translate(' + r(x) + ' ' + r(y) + ') rotate(' + r(a) + ')">' +
      '<path d="M0 0Q' + r(l * 0.5) + ' -1.2 ' + r(l) + ' 0" fill="none" stroke="' + c + '" stroke-width="1" stroke-linecap="round"/>';
    var i, gx;
    for (i = 0; i < 4; i++) {
      gx = l * (0.42 + i * 0.15);
      s += '<ellipse cx="' + r(gx) + '" cy="-2.3" rx="3" ry="1.5" transform="rotate(-28 ' + r(gx) + ' -2.3)" fill="' + c + '"/>' +
           '<ellipse cx="' + r(gx) + '" cy="2.3" rx="3" ry="1.5" transform="rotate(28 ' + r(gx) + ' 2.3)" fill="' + c + '"/>';
    }
    s += '<ellipse cx="' + r(l + 2) + '" cy="0" rx="3.2" ry="1.5" fill="' + c + '"/>' +
      '<path d="M' + r(l + 4) + ' 0l6 -1.4M' + r(l + 3) + ' -1.5l5 -4M' + r(l + 3) + ' 1.5l5 3.6" fill="none" stroke="' + c +
      '" stroke-width=".6" stroke-linecap="round"/></g>';
    return s;
  }
  var JIT = [3, -5, 6, -2, 4, -6, 1, 5, -3, 2, -4, 6];
  var TONES = [OLIVE, SAGE, OLIVE_D, OLIVE, '#98A677', SAGE];
  /* olive branch following a circle arc; dir=1 clockwise, -1 counter-clockwise */
  function arcBranch(cx, cy, R, t0, t1, dir) {
    var s = '', n = 0, t, rad, x, y, tan, len, a0 = t0 * Math.PI / 180, a1 = t1 * Math.PI / 180;
    s += '<path d="M' + r(cx + R * Math.cos(a0)) + ' ' + r(cy + R * Math.sin(a0)) + 'A' + R + ' ' + R + ' 0 0 ' + (dir > 0 ? 1 : 0) +
      ' ' + r(cx + R * Math.cos(a1)) + ' ' + r(cy + R * Math.sin(a1)) + '" fill="none" stroke="' + STEM +
      '" stroke-width="1.1" stroke-linecap="round"/>';
    for (t = t0 + dir * 7; dir > 0 ? t <= t1 : t >= t1; t += dir * 11.5) {
      rad = t * Math.PI / 180; x = cx + R * Math.cos(rad); y = cy + R * Math.sin(rad);
      tan = t + dir * 90; len = 15 - n * 0.35;
      s += leaf(x, y, tan - dir * (40 + JIT[n % 12]), len, 3.6, TONES[n % 6]);
      s += leaf(x, y, tan + dir * (36 + JIT[(n + 5) % 12]), len - 1.5, 3.3, TONES[(n + 3) % 6]);
      if (n % 4 === 2) {
        s += '<ellipse cx="' + r(cx + (R + 5) * Math.cos(rad + dir * 0.09)) + '" cy="' + r(cy + (R + 5) * Math.sin(rad + dir * 0.09)) +
          '" rx="2.3" ry="2.8" fill="' + (n % 8 === 2 ? TERRA : OLIVE_D) + '"/>';
      }
      n++;
    }
    rad = a1; s += leaf(cx + R * Math.cos(rad), cy + R * Math.sin(rad), t1 + dir * 90, 13, 3.3, OLIVE);
    return s;
  }

  /* ---------- lock art: olive + wheat wreath ---------- */
  var lockArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="132" height="132" aria-hidden="true">' +
    wheat(66, 123, 190, 36, OCHRE) + wheat(84, 123, -10, 36, OCHRE) +
    wheat(64, 124, 162, 26, '#D4B576') + wheat(86, 124, 18, 26, '#D4B576') +
    arcBranch(75, 74, 47, 100, 248, 1) + arcBranch(75, 74, 47, 80, -68, -1) +
    '<path d="M75 118c-5-5-12-5-12 0s7 5 12 2c5 3 12 3 12-2s-7-5-12 0z" fill="' + TERRA + '"/>' +
    '<path d="M74 120l-5 11M76 120l5 11" fill="none" stroke="' + TERRA_D + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="75" cy="119.5" r="2.2" fill="' + TERRA_D + '"/>' +
    '<path d="M75 82c-9-6.5-13.5-11.5-13.5-16.5c0-4 3-6.6 6.4-6.6c2.8 0 5.4 1.7 7.1 4.6c1.7-2.9 4.3-4.6 7.1-4.6c3.4 0 6.4 2.6 6.4 6.6c0 5-4.5 10-13.5 16.5z" ' +
    'fill="none" stroke="' + TERRA + '" stroke-width="1.3" stroke-linejoin="round" opacity=".85"/>' +
    '</svg>';

  /* ---------- ornament: olive branch divider ---------- */
  var ornament = (function () {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 26" width="200" height="26" aria-hidden="true">' +
      '<path d="M8 13.5H52" stroke="' + TERRA + '" stroke-width=".8" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M148 13.5H192" stroke="' + TERRA + '" stroke-width=".8" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M58 14.5Q79 10 96 13.5" fill="none" stroke="' + STEM + '" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M142 14.5Q121 10 104 13.5" fill="none" stroke="' + STEM + '" stroke-width="1" stroke-linecap="round"/>';
    var i, x, y, l;
    for (i = 0; i < 4; i++) {
      x = 90 - i * 9.5; y = 13 - Math.sin((i + 0.6) / 4 * Math.PI) * 1.6 + 0.6; l = 11 - i * 1.1;
      s += leaf(x, y, 218 + JIT[i], l, 3, TONES[i]) + leaf(x - 2, y, 146 - JIT[i + 2], l - 1, 2.8, TONES[i + 2]);
      s += leaf(200 - x, y, -38 - JIT[i], l, 3, TONES[i]) + leaf(202 - x, y, 34 + JIT[i + 2], l - 1, 2.8, TONES[i + 2]);
    }
    s += leaf(58, 14.5, 186, 9, 2.5, OLIVE) + leaf(142, 14.5, -6, 9, 2.5, OLIVE) +
      '<ellipse cx="97" cy="14.5" rx="2.4" ry="3" fill="' + OLIVE_D + '"/>' +
      '<ellipse cx="103" cy="13.5" rx="2.4" ry="3" fill="' + TERRA + '"/></svg>';
    return s;
  })();

  /* ---------- heading icon: tiny sprig ---------- */
  var headingIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path d="M5 22Q9 12 18 3.5" fill="none" stroke="' + STEM + '" stroke-width="1.1" stroke-linecap="round"/>' +
    leaf(7, 17.5, -8, 8.5, 2.6, OLIVE) + leaf(7.6, 16.2, -112, 7.5, 2.4, SAGE) +
    leaf(11, 11.5, -18, 8, 2.5, OLIVE_D) + leaf(11.6, 10.6, -122, 7, 2.3, OLIVE) +
    leaf(15, 6.8, -28, 6.5, 2.2, SAGE) + leaf(15.4, 6.3, -128, 6, 2, OLIVE_D) +
    leaf(18, 3.6, -52, 5.5, 1.9, OLIVE) +
    '</svg>';

  /* ---------- corner mascot: sprig cluster peeking over the card corner ---------- */
  var cornerMascot = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 56" width="72" height="56" aria-hidden="true">' +
    wheat(36, 56, -112, 30, OCHRE) + wheat(44, 56, -58, 24, '#D4B576') +
    '<path d="M38 56Q30 36 14 22" fill="none" stroke="' + STEM + '" stroke-width="1.1" stroke-linecap="round"/>' +
    leaf(33, 44, 172, 12, 3.2, OLIVE) + leaf(33.5, 43, -100, 11, 3, SAGE) +
    leaf(27, 34, 182, 11, 3, OLIVE_D) + leaf(27.5, 33, -92, 10, 2.8, OLIVE) +
    leaf(20.5, 27, 192, 9.5, 2.7, SAGE) + leaf(21, 26, -84, 9, 2.6, OLIVE_D) + leaf(14, 22, -140, 9, 2.6, OLIVE) +
    '<path d="M42 56Q50 42 60 34" fill="none" stroke="' + STEM + '" stroke-width="1.1" stroke-linecap="round"/>' +
    leaf(47, 46.5, -4, 10, 2.8, OLIVE) + leaf(46.5, 46, -96, 9, 2.6, SAGE) +
    leaf(53, 39.5, -10, 9, 2.6, OLIVE_D) + leaf(53, 39, -100, 8, 2.4, OLIVE) + leaf(60, 34, -42, 8, 2.4, SAGE) +
    '<ellipse cx="57" cy="44" rx="2.3" ry="2.8" fill="' + TERRA + '"/>' +
    '</svg>';

  /* ---------- swatch 120x80 ---------- */
  var swatch = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<defs><linearGradient id="earthSwBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3EBDD"/>' +
    '<stop offset=".55" stop-color="#E4D5C0"/><stop offset="1" stop-color="#D5BE9F"/></linearGradient>' +
    '<linearGradient id="earthSwAc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B67857"/>' +
    '<stop offset="1" stop-color="#7C8C58"/></linearGradient></defs>' +
    '<rect width="120" height="80" rx="12" fill="url(#earthSwBg)"/>' +
    '<circle cx="100" cy="14" r="22" fill="#C08A6A" opacity=".2"/><circle cx="14" cy="72" r="24" fill="#8A9A6B" opacity=".22"/>' +
    '<rect x="12" y="14" width="96" height="40" rx="10" fill="#FBF5EA" fill-opacity=".8" stroke="#C08A6A" stroke-opacity=".5" stroke-width=".8"/>' +
    '<text x="24" y="41" font-family="Georgia,serif" font-size="20" font-weight="600" fill="url(#earthSwAc)">329</text>' +
    '<text x="62" y="40" font-family="serif" font-size="9" fill="#7A6655">天</text>' +
    '<g transform="translate(74 8) scale(.62)">' +
    '<path d="M38 56Q30 36 14 22" fill="none" stroke="' + STEM + '" stroke-width="1.4" stroke-linecap="round"/>' +
    leaf(33, 44, 172, 12, 3.2, OLIVE) + leaf(33.5, 43, -100, 11, 3, SAGE) + leaf(27, 34, 182, 11, 3, OLIVE_D) +
    leaf(27.5, 33, -92, 10, 2.8, OLIVE) + leaf(20.5, 27, 192, 9.5, 2.7, SAGE) + leaf(21, 26, -84, 9, 2.6, OLIVE_D) +
    leaf(14, 22, -140, 9, 2.6, OLIVE) + '</g>' +
    '<rect x="12" y="62" width="64" height="6" rx="3" fill="#7A6655" fill-opacity=".16"/>' +
    '<rect x="12" y="62" width="40" height="6" rx="3" fill="url(#earthSwAc)"/>' +
    '<circle cx="88" cy="65" r="4" fill="#C08A6A"/><circle cx="100" cy="65" r="4" fill="#8A9A6B"/><circle cx="112" cy="65" r="0" fill="#C9A45E"/>' +
    '</svg>';

  /* ---------- runner: little white-eye songbird ---------- */
  var BIRD_SVG = '<svg class="earth-bird-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 44" width="50" height="44" aria-hidden="true">' +
    '<g class="earth-bird-legs" fill="none" stroke="#A8744E" stroke-width="1.4" stroke-linecap="round">' +
    '<path d="M21 35v6.5M21 41.5l-3 1M21 41.5l3 1"/><path d="M27 35v6.5M27 41.5l-3 1M27 41.5l3 1"/></g>' +
    '<path class="earth-bird-tail" d="M13 27L1.5 22.5l3 5.2L1 31.5L13 32z" fill="#6E7E52"/>' +
    '<ellipse cx="24" cy="26.5" rx="13" ry="10.8" fill="#9DAB78"/>' +
    '<path d="M14.5 31.5c2.5 5 7 6.3 11.5 6.3c6.5 0 11-4.2 11-10c0-2-.5-3.6-1.3-5c-3 5.6-8.5 9.2-21.2 8.7z" fill="#F6ECDA"/>' +
    '<path d="M22 37.2c5.5-.4 9.6-2.8 12.6-7.4" fill="none" stroke="#D9A98A" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>' +
    '<g class="earth-bird-head">' +
    '<circle cx="33" cy="16.5" r="8.6" fill="#9DAB78"/>' +
    '<path d="M27.5 22.5c2.6 2.6 7.6 2.8 11 .4c-1 1.9-3.3 3.3-5.9 3.3c-2.2 0-4-1.2-5.1-3.7z" fill="#E9D48E" opacity=".9"/>' +
    '<path d="M40.6 14.6L47 16.8L40.6 18.9z" fill="#5A4636" stroke="#5A4636" stroke-width=".8" stroke-linejoin="round"/>' +
    '<circle cx="36" cy="15.2" r="3" fill="#FFFDF8"/>' +
    '<ellipse class="earth-bird-eye" cx="36.3" cy="15.2" rx="1.65" ry="1.65" fill="#3A2C22"/>' +
    '<circle cx="36.9" cy="14.6" r=".55" fill="#fff"/>' +
    '<ellipse cx="33.2" cy="20.2" rx="2.3" ry="1.4" fill="#D08F74" opacity=".55"/>' +
    '</g>' +
    '<path class="earth-bird-wing" d="M13.5 23.5Q21 16 31 23.5Q26 33.5 13 29.5Q11.5 26 13.5 23.5z" fill="#7C8C5A"/>' +
    '<path class="earth-bird-wing2" d="M16 26.5q5 2 10-.5M17.5 23.8q4 1.4 8.5-.6" fill="none" stroke="#66764A" stroke-width=".8" stroke-linecap="round" opacity=".7"/>' +
    '</svg>';
  var NOTE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="17" height="17"><path d="M6 12.2V3.4l7-1.6v8.6" fill="none" stroke="#A86F50" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="4.2" cy="12.3" rx="2.3" ry="1.8" fill="#A86F50"/><ellipse cx="11.2" cy="10.5" rx="2.3" ry="1.8" fill="#A86F50"/></svg>';
  var HEART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 14C3.6 10.8 1.5 8.4 1.5 5.8C1.5 3.8 3 2.4 4.8 2.4c1.3 0 2.5.8 3.2 2.1c.7-1.3 1.9-2.1 3.2-2.1c1.8 0 3.3 1.4 3.3 3.4c0 2.6-2.1 5-6.5 8.2z" fill="#C97F6B"/></svg>';

  function mountRunner(layer) {
    var BW = 50;
    var root = document.createElement('div');
    root.className = 'earth-bird';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="earth-bird-flip"><div class="earth-bird-bob">' + BIRD_SVG + '</div></div>';
    var flip = root.firstChild, bob = flip.firstChild;
    layer.appendChild(root);

    var timers = [], anim = null, x = -80, y = 0, face = 1, paused = false, dead = false, grounded = false, extras = [];
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { reduce = false; }

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function W() { return layer.clientWidth || window.innerWidth || 390; }
    function later(fn, ms) {
      var id = setTimeout(function () {
        var i = timers.indexOf(id); if (i >= 0) timers.splice(i, 1);
        if (!dead && !paused) fn();
      }, ms);
      timers.push(id);
    }
    function clearAll() {
      while (timers.length) clearTimeout(timers.pop());
      if (anim) { try { anim.cancel(); } catch (e) {} anim = null; }
    }
    function tf(px, py) { return 'translate3d(' + Math.round(px) + 'px,' + Math.round(py) + 'px,0)'; }
    function place(px, py) { x = px; y = py; root.style.transform = tf(px, py); }
    function setFace(d) { face = d; flip.style.transform = d < 0 ? 'scaleX(-1)' : ''; }
    function setState(s) { root.className = 'earth-bird' + (s ? ' ' + s : ''); }
    function move(frames, dur, ease, done) {
      var last = frames[frames.length - 1];
      if (!root.animate) { place(last[0], last[1]); later(done, dur); return; }
      var kf = frames.map(function (f) {
        var k = { transform: tf(f[0], f[1]) };
        if (f.length > 2) k.offset = f[2];
        return k;
      });
      anim = root.animate(kf, { duration: dur, easing: ease, fill: 'forwards' });
      later(function () {
        place(last[0], last[1]);
        if (anim) { try { anim.cancel(); } catch (e) {} anim = null; }
        done();
      }, dur);
    }

    function flyIn() {
      var w = W(), fromLeft = Math.random() < 0.5;
      var landX = rnd(w * 0.14, Math.max(w * 0.2, w * 0.86 - BW));
      var sx = fromLeft ? -BW - 20 : w + 20;
      setFace(fromLeft ? 1 : -1);
      place(sx, -66);
      root.style.visibility = 'visible';
      grounded = false;
      setState('earth-flying');
      move([[sx, -66], [(sx + landX * 2) / 3, -52, 0.4], [landX, 0]], 1300, 'cubic-bezier(.25,.6,.3,1)', function () {
        grounded = true;
        setState('earth-land');
        later(function () { act(Math.round(rnd(5, 9))); }, 620);
      });
    }
    function flyOut() {
      var w = W();
      if (x < w * 0.25) setFace(-1); else if (x > w * 0.75 - BW) setFace(1);
      var ex = face > 0 ? w + 30 : -BW - 30;
      grounded = false;
      setState('earth-flying');
      move([[x, 0], [x + face * 26, -30, 0.3], [ex, -84]], 1250, 'cubic-bezier(.5,.05,.7,.6)', function () {
        root.style.visibility = 'hidden';
        setState('');
        later(flyIn, rnd(9000, 20000));
      });
    }
    function hop(n, done) {
      var w = W(), d = 20 + Math.random() * 10;
      if (x + face * d < 10 || x + face * d > w - BW - 10) setFace(-face);
      var nx = x + face * d;
      setState('earth-hop');
      move([[x, 0], [(x + nx) / 2, -11, 0.5], [nx, 0]], 250, 'linear', function () {
        setState('');
        if (n > 1) later(function () { hop(n - 1, done); }, rnd(110, 260)); else done();
      });
    }
    function act(left) {
      if (left <= 0) { flyOut(); return; }
      var next = function () { later(function () { act(left - 1); }, rnd(350, 1100)); };
      var k = Math.random();
      if (k < 0.36) hop(1 + Math.floor(Math.random() * 3), next);
      else if (k < 0.62) { setState('earth-peck'); later(function () { setState(''); next(); }, 980); }
      else if (k < 0.82) { setState('earth-tilt'); later(function () { setState(''); next(); }, 1300); }
      else if (k < 0.92) { setFace(-face); next(); }
      else next();
    }

    function chirp(ev) {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      if (dead || !grounded) return;
      bob.classList.remove('earth-chirp');
      void bob.offsetWidth;
      bob.classList.add('earth-chirp');
      var n = document.createElement('div');
      n.className = 'earth-note';
      n.innerHTML = Math.random() < 0.5 ? NOTE_SVG : HEART_SVG;
      n.style.left = Math.round(x + (face > 0 ? BW - 12 : -2)) + 'px';
      n.style.setProperty('--earth-nx', (face * rnd(6, 16)).toFixed(1) + 'px');
      layer.appendChild(n);
      extras.push(n);
      setTimeout(function () {
        var i = extras.indexOf(n); if (i >= 0) extras.splice(i, 1);
        if (n.parentNode) n.parentNode.removeChild(n);
      }, 1250);
    }
    root.addEventListener('click', chirp);

    function start(delay) {
      if (reduce) {
        var w = W(); setFace(1); place(w * 0.62, 0); grounded = true; setState(''); root.style.visibility = 'visible';
        return;
      }
      root.style.visibility = 'hidden';
      later(flyIn, delay);
    }
    start(1400);

    return {
      pause: function () {
        if (dead || paused) return;
        paused = true; clearAll(); grounded = false;
        root.style.visibility = 'hidden'; setState('');
      },
      resume: function () {
        if (dead || !paused) return;
        paused = false; start(rnd(1200, 3200));
      },
      destroy: function () {
        if (dead) return;
        dead = true; clearAll();
        root.removeEventListener('click', chirp);
        if (root.parentNode) root.parentNode.removeChild(root);
        while (extras.length) { var n = extras.pop(); if (n.parentNode) n.parentNode.removeChild(n); }
      }
    };
  }

  /* ---------- particles: drifting leaves, wheat ears, seeds ---------- */
  var P_COL = ['#8A9A6B', '#A3AE85', '#7C8C5A', '#BFA65E', '#C08A6A', '#A9B48C', '#B7986A'];
  var particles = {
    count: 16,
    spawn: function (w, h) {
      var k = Math.random(), kind = k < 0.68 ? 0 : (k < 0.84 ? 1 : 2);
      return {
        kind: kind,
        x: Math.random() * w,
        y: -0.08 * h + Math.random() * h * 0.8,
        vx: -4 + Math.random() * 10,
        vy: (kind === 2 ? 5 : 9) + Math.random() * 11,
        s: kind === 0 ? 5 + Math.random() * 4.5 : (kind === 1 ? 8 + Math.random() * 3 : 6 + Math.random() * 2),
        rot: Math.random() * 6.283,
        vr: (Math.random() - 0.5) * 0.7,
        flip: Math.random() * 6.283,
        vf: 0.4 + Math.random() * 0.8,
        ph: Math.random() * 6.283,
        sf: 0.5 + Math.random() * 0.7,
        sa: 6 + Math.random() * 12,
        a: 0.34 + Math.random() * 0.26,
        c: kind === 1 ? '#C2A35C' : P_COL[Math.floor(Math.random() * P_COL.length)],
        t: 0, o: 0
      };
    },
    step: function (p, dt, w, h) {
      if (dt > 0.1) dt = 0.1;
      p.t += dt;
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.t * p.sf + p.ph) * p.sa) * dt;
      p.rot += (p.vr + Math.cos(p.t * p.sf + p.ph) * 0.25) * dt;
      p.flip += p.vf * dt;
      var fin = p.t < 1.6 ? p.t / 1.6 : 1, fout = (h + 8 - p.y) / 90;
      if (fout > 1) fout = 1; if (fout < 0) fout = 0;
      p.o = p.a * fin * fout;
      return p.y < h + 12 && p.x > -30 && p.x < w + 30;
    },
    draw: function (ctx, p) {
      if (p.o <= 0.01) return;
      var s = p.s, i, gx;
      ctx.save();
      ctx.globalAlpha = p.o;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.kind === 0) {
        ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.cos(p.flip)));
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.quadraticCurveTo(-s * 0.1, -s * 0.62, s, 0);
        ctx.quadraticCurveTo(0, s * 0.56, -s, 0);
        ctx.fillStyle = p.c; ctx.fill();
        ctx.beginPath(); ctx.moveTo(-s * 1.25, 0); ctx.lineTo(s * 0.7, 0);
        ctx.strokeStyle = 'rgba(74,59,46,.32)'; ctx.lineWidth = 0.6; ctx.stroke();
      } else if (p.kind === 1) {
        ctx.strokeStyle = p.c; ctx.fillStyle = p.c; ctx.lineWidth = 0.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke();
        for (i = 0; i < 3; i++) {
          gx = -s * 0.1 + i * s * 0.36;
          ctx.beginPath(); ctx.ellipse(gx, -s * 0.2, s * 0.26, s * 0.12, -0.5, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(gx, s * 0.2, s * 0.26, s * 0.12, 0.5, 0, 6.283); ctx.fill();
        }
        ctx.beginPath(); ctx.ellipse(s, 0, s * 0.26, s * 0.12, 0, 0, 6.283); ctx.fill();
      } else {
        ctx.rotate(-p.rot + Math.sin(p.t * p.sf + p.ph) * 0.3);
        ctx.strokeStyle = 'rgba(122,102,85,.8)'; ctx.lineWidth = 0.55; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, s * 0.7); ctx.lineTo(0, -s * 0.2);
        for (i = -2; i <= 2; i++) { ctx.moveTo(0, -s * 0.2); ctx.lineTo(i * s * 0.32, -s * (0.85 - Math.abs(i) * 0.1)); }
        ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, s * 0.8, s * 0.13, s * 0.26, 0, 0, 6.283);
        ctx.fillStyle = '#9A7A55'; ctx.fill();
      }
      ctx.restore();
    }
  };

  /* ---------- css ---------- */
  var LINEN = 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27220%27 height=%27220%27%3E' +
    '%3Cfilter id=%27a%27 x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.035 .85%27 numOctaves=%272%27 seed=%274%27 stitchTiles=%27stitch%27/%3E' +
    '%3CfeColorMatrix values=%270 0 0 0 .42 0 0 0 0 .30 0 0 0 0 .20 .62 0 0 0 -.225%27/%3E%3C/filter%3E' +
    '%3Cfilter id=%27b%27 x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85 .035%27 numOctaves=%272%27 seed=%279%27 stitchTiles=%27stitch%27/%3E' +
    '%3CfeColorMatrix values=%270 0 0 0 .42 0 0 0 0 .30 0 0 0 0 .20 .62 0 0 0 -.225%27/%3E%3C/filter%3E' +
    '%3Crect width=%27220%27 height=%27220%27 filter=%27url(%23a)%27/%3E%3Crect width=%27220%27 height=%27220%27 filter=%27url(%23b)%27/%3E%3C/svg%3E")';

  var css = [
    'html[data-theme="earth"]{',
    '--bg1:#F5EEE2;--bg2:#ECE0CD;--bg3:#E2D0B6;--bg4:#D8C2A2;',
    '--orb1:rgba(192,138,106,.34);--orb2:rgba(138,154,107,.32);--orb3:rgba(214,172,104,.30);',
    '--text:#4A3B2E;--text-soft:#6F5B4A;',
    '--accent1:#B26E4C;--accent2:#75864F;',
    '--card-bg:rgba(251,245,234,.74);--card-border:rgba(176,116,84,.34);',
    '--card-shadow:0 18px 40px -22px rgba(96,66,40,.42),0 2px 8px -3px rgba(96,66,40,.14);',
    '--card-radius:22px;',
    '--chip-bg:rgba(138,154,107,.22);--chip-text:#55633A;',
    '--danger:#B4513C;',
    '--font-body:"Noto Serif TC","Songti TC","Noto Serif CJK TC","PMingLiU",serif;',
    '--font-display:"Cormorant Garamond","Noto Serif TC","Songti TC","Noto Serif CJK TC",serif;',
    '--font-script:"Great Vibes","Snell Roundhand","Apple Chancery","Cormorant Garamond",cursive;',
    '--earth-linen:' + LINEN + ';',
    '}',
    /* page-wide linen grain: non-interactive overlay */
    'html[data-theme="earth"] body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;',
    'background-image:var(--earth-linen);background-size:220px 220px;opacity:.75}',
    /* cards */
    'html[data-theme="earth"] .card,html[data-theme="earth"] .stat-tile,html[data-theme="earth"] .countdown-card,html[data-theme="earth"] .lock-card{',
    'background-image:linear-gradient(160deg,rgba(255,252,245,.55),rgba(244,232,214,.25) 60%,rgba(232,214,188,.28)),var(--earth-linen);',
    'background-size:auto,220px 220px;border:1px solid var(--card-border);',
    'box-shadow:var(--card-shadow),inset 0 1px 0 rgba(255,255,255,.6)}',
    'html[data-theme="earth"] .stat-tile{border-color:rgba(138,154,107,.42)}',
    'html[data-theme="earth"] .countdown-card,html[data-theme="earth"] .lock-card{outline:1px solid rgba(138,154,107,.42);outline-offset:-6px}',
    'html[data-theme="earth"] .lock-card{border-color:rgba(176,116,84,.42);border-radius:28px}',
    'html[data-theme="earth"] .lock-title{color:#9C5C3C}',
    /* headings */
    'html[data-theme="earth"] .page-title{font-family:var(--font-display);font-weight:600;letter-spacing:.14em}',
    'html[data-theme="earth"] .page-subtitle{color:var(--text-soft);letter-spacing:.1em}',
    /* tab bar */
    'html[data-theme="earth"] .tabbar{background-color:rgba(246,238,225,.9);background-image:var(--earth-linen);background-size:220px 220px;',
    'border-top:1px solid rgba(176,116,84,.3);box-shadow:0 -10px 28px -18px rgba(96,66,40,.4)}',
    'html[data-theme="earth"] .tab{color:#7A6655}',
    'html[data-theme="earth"] .tab.active{color:#9C5C3C;font-weight:600}',
    /* chips, buttons, inputs */
    'html[data-theme="earth"] .chip{background:var(--chip-bg);color:var(--chip-text);box-shadow:inset 0 0 0 1px rgba(110,126,82,.3)}',
    'html[data-theme="earth"] .btn-primary{background:linear-gradient(120deg,#B4704E 0%,#BC8452 48%,#7E8E58 100%);color:#FFFAF1;',
    'border:0;text-shadow:0 1px 1px rgba(74,45,25,.35);box-shadow:0 12px 24px -12px rgba(150,88,54,.7),inset 0 1px 0 rgba(255,255,255,.28)}',
    'html[data-theme="earth"] .progress-bar{background-color:rgba(122,102,85,.16);box-shadow:inset 0 1px 2px rgba(96,66,40,.14)}',
    'html[data-theme="earth"] .search-input{background-color:rgba(255,251,243,.72);border:1px solid rgba(176,116,84,.38);color:var(--text);',
    'box-shadow:inset 0 2px 6px rgba(96,66,40,.07)}',
    'html[data-theme="earth"] .search-input::placeholder{color:#8E7A68}',
    'html[data-theme="earth"] .search-input:focus{outline:0;border-color:#8A9A6B;box-shadow:0 0 0 4px rgba(138,154,107,.25)}',
    'html[data-theme="earth"] .settings-sheet{background-color:#F4ECDD;background-image:var(--earth-linen);background-size:220px 220px;',
    'border-top:1px solid rgba(176,116,84,.35);color:var(--text)}',
    /* runner */
    '.earth-bird{position:absolute;left:0;bottom:1px;width:50px;height:44px;visibility:hidden;pointer-events:auto;cursor:pointer;',
    'will-change:transform;-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;-webkit-user-select:none}',
    '.earth-bird-flip,.earth-bird-bob{width:50px;height:44px;transform-origin:50% 100%}',
    '.earth-bird-svg{display:block;overflow:visible;transform-origin:50% 96%;filter:drop-shadow(0 2px 2px rgba(74,59,46,.22))}',
    '.earth-bird-head{transform-box:fill-box;transform-origin:35% 85%}',
    '.earth-bird-wing,.earth-bird-wing2{transform-box:fill-box;transform-origin:12% 30%}',
    '.earth-bird-eye{transform-box:fill-box;transform-origin:50% 50%;animation:earth-blink 4.6s infinite}',
    '.earth-bird-tail{transform-box:fill-box;transform-origin:100% 60%;animation:earth-tail 3.2s ease-in-out infinite}',
    '.earth-flying .earth-bird-wing{animation:earth-flap .17s ease-in-out infinite alternate}',
    '.earth-flying .earth-bird-wing2{opacity:0}',
    '.earth-flying .earth-bird-legs{opacity:0}',
    '.earth-flying .earth-bird-svg{transform:rotate(-12deg)}',
    '.earth-land .earth-bird-svg{animation:earth-land .6s ease-out}',
    '.earth-hop .earth-bird-svg{animation:earth-squash .25s ease-out}',
    '.earth-peck .earth-bird-svg{animation:earth-peck .98s ease-in-out}',
    '.earth-tilt .earth-bird-head{animation:earth-tilt 1.3s ease-in-out}',
    '.earth-chirp{animation:earth-chirp .5s cubic-bezier(.3,.6,.4,1)}',
    '.earth-note{position:absolute;bottom:38px;width:17px;height:17px;pointer-events:none;animation:earth-note 1.2s ease-out forwards}',
    '@keyframes earth-flap{from{transform:rotate(-62deg) scaleY(1.15)}to{transform:rotate(26deg) scaleY(.9)}}',
    '@keyframes earth-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.12)}}',
    '@keyframes earth-tail{0%,100%{transform:rotate(0)}50%{transform:rotate(7deg)}}',
    '@keyframes earth-land{0%{transform:scale(1.08,.86)}45%{transform:scale(.96,1.05)}100%{transform:scale(1,1)}}',
    '@keyframes earth-squash{0%{transform:scale(1.06,.9)}50%{transform:scale(.95,1.07)}100%{transform:scale(1,1)}}',
    '@keyframes earth-peck{0%,100%{transform:rotate(0)}18%{transform:rotate(40deg)}34%{transform:rotate(12deg)}52%{transform:rotate(42deg)}70%{transform:rotate(10deg)}84%{transform:rotate(-4deg)}}',
    '@keyframes earth-tilt{0%,100%{transform:rotate(0)}22%,58%{transform:rotate(-22deg)}72%,88%{transform:rotate(9deg)}}',
    '@keyframes earth-chirp{0%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.1,.84)}48%{transform:translateY(-15px) scale(.95,1.08)}82%{transform:translateY(0) scale(1.06,.92)}100%{transform:translateY(0) scale(1,1)}}',
    '@keyframes earth-note{0%{opacity:0;transform:translate(0,6px) scale(.5) rotate(-10deg)}18%{opacity:1}100%{opacity:0;transform:translate(var(--earth-nx,10px),-36px) scale(1.05) rotate(12deg)}}',
    '@media (prefers-reduced-motion:reduce){.earth-bird-eye,.earth-bird-tail{animation:none}}'
  ].join('');

  window.WeddingThemes['earth'] = {
    id: 'earth',
    name: '大地色',
    desc: '奶茶、陶土與橄欖綠的自然手感',
    themeColor: '#EDE2D0',
    fonts: ['https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Noto+Serif+TC:wght@300;400;500;600&display=swap'],
    css: css,
    swatch: swatch,
    ornament: ornament,
    lockArt: lockArt,
    cornerMascot: cornerMascot,
    headingIcon: headingIcon,
    particles: particles,
    runner: { mount: mountRunner }
  };
})();
