/* Theme: lele — 樂樂, the couple's own red toy poodle, drawn for this page (public file: contains no data).
   Art: layered SVG "fur" pieces (scalloped outlines + soft gradients + curl marks) assembled into one small rig
   whose pose is a plain set of numbers, so the pet can blend smoothly between walking, sitting, lying, etc. */
(function () {
  'use strict';

  var C = {
    deep: '#B4693A', mid: '#C9814F', hi: '#DDA373', gold: '#E9BE90', shade: '#96522B', line: '#8A4A26',
    nose: '#B07A6C', noseD: '#74463F', tongue: '#E07A8A', tongueD: '#C65D70', eye: '#1C120F', mouth: '#5B2B27',
    red: '#D8473C', redD: '#B5352C', cream: '#FCF8EE', creamD: '#E4DAC6', heart: '#EC8A8F', ink: '#5E4030'
  };
  var D = Math.PI / 180;

  /* ---------- tiny geometry kit ---------- */
  function f(v, p) { var k = p === 3 ? 1000 : 10; return String(Math.round(v * k) / k); }
  function RNG(seed) {
    var a = seed >>> 0;
    return function (lo, hi) {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      var r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      return lo === undefined ? r : lo + r * (hi - lo);
    };
  }
  /* outline points run clockwise on screen */
  function ell(cx, cy, rx, ry, rot, n, rng, jit) {
    var p = [], c = Math.cos((rot || 0) * D), s = Math.sin((rot || 0) * D);
    for (var i = 0; i < n; i++) {
      var t = 2 * Math.PI * (i + (rng ? rng(-0.22, 0.22) : 0)) / n, k = 1 + (rng ? rng(-(jit || 0.03), jit || 0.03) : 0);
      var x = rx * k * Math.cos(t), y = ry * k * Math.sin(t);
      p.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return p;
  }
  function smooth(ctrl, step) {
    var n = ctrl.length, pts = [], i, k;
    for (i = 0; i < n; i++) {
      var p0 = ctrl[(i + n - 1) % n], p1 = ctrl[i], p2 = ctrl[(i + 1) % n], p3 = ctrl[(i + 2) % n];
      for (k = 0; k < 10; k++) {
        var t = k / 10, t2 = t * t, t3 = t2 * t;
        pts.push([
          0.5 * (2 * p1[0] + (p2[0] - p0[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (3 * p1[0] - p0[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (p2[1] - p0[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (3 * p1[1] - p0[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    var out = [pts[0]], acc = 0;
    for (i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (acc >= step) { out.push(pts[i]); acc = 0; }
    }
    if (out.length > 3 && Math.hypot(out[out.length - 1][0] - out[0][0], out[out.length - 1][1] - out[0][1]) < step * 0.5) out.pop();
    return out;
  }
  function tube(c, step) {
    var A = [], B = [], n = c.length, e0, s0;
    for (var i = 0; i < n; i++) {
      var a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, r = c[i][2];
      dx /= L; dy /= L;
      A.push([c[i][0] + dy * r, c[i][1] - dx * r]); B.push([c[i][0] - dy * r, c[i][1] + dx * r]);
      if (i === n - 1) e0 = [c[i][0] + dx * r, c[i][1] + dy * r];
      if (i === 0) s0 = [c[0][0] - dx * r, c[0][1] - dy * r];
    }
    /* A is the left-hand side of travel on screen; walk it backwards to keep the outline clockwise */
    return smooth([s0].concat(A, [e0], B.reverse()), step);
  }
  /* fluffy outline: one bump per edge */
  function scallop(p, h, rng) {
    var n = p.length, d = 'M' + f(p[0][0]) + ',' + f(p[0][1]);
    for (var i = 0; i < n; i++) {
      var a = p[i], b = p[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, hh = 2 * h * (rng ? rng(0.65, 1.35) : 1);
      d += 'Q' + f((a[0] + b[0]) / 2 + dy / L * hh) + ',' + f((a[1] + b[1]) / 2 - dx / L * hh) + ' ' + f(b[0]) + ',' + f(b[1]);
    }
    return d + 'Z';
  }
  function plain(p) {
    var d = 'M' + f(p[0][0]) + ',' + f(p[0][1]);
    for (var i = 1; i < p.length; i++) d += 'L' + f(p[i][0]) + ',' + f(p[i][1]);
    return d + 'Z';
  }
  /* little "c" curls scattered inside a list of ellipses [cx,cy,rx,ry,rot] */
  function curls(rng, list, dens) {
    var d = '';
    list.forEach(function (e) {
      var n = Math.round(Math.PI * e[2] * e[3] * (dens || 0.03)), c = Math.cos((e[4] || 0) * D), s = Math.sin((e[4] || 0) * D);
      for (var i = 0; i < n; i++) {
        var a = rng(0, 6.283), q = Math.sqrt(rng()) * 0.8, x = e[2] * q * Math.cos(a), y = e[3] * q * Math.sin(a);
        var px = e[0] + x * c - y * s, py = e[1] + x * s + y * c, r = rng(1.5, 2.7), a0 = rng(0, 6.283), a1 = a0 + rng(3.3, 4.7);
        d += 'M' + f(px + r * Math.cos(a0)) + ',' + f(py + r * Math.sin(a0)) + 'A' + f(r) + ',' + f(r) + ' 0 1 1 ' + f(px + r * Math.cos(a1)) + ',' + f(py + r * Math.sin(a1));
      }
    });
    return d;
  }

  /* ---------- paint ---------- */
  var uidN = 0;
  function Paint(flat) {
    this.flat = !!flat; this.pre = 'll' + (uidN++) + '-';
  }
  Paint.prototype.fill = function (name) {
    if (this.flat) return { fur: C.mid, furD: '#B26A3C', muz: '#DCA774', ear: '#CE8B58', nose: C.nose, tongue: C.tongue, hat: C.cream, eye: C.eye }[name];
    return 'url(#' + this.pre + name + ')';
  };
  Paint.prototype.defs = function () {
    if (this.flat) return '';
    var p = this.pre, st = function (o, c, a) { return '<stop offset="' + o + '" stop-color="' + c + '"' + (a === undefined ? '' : ' stop-opacity="' + a + '"') + '/>'; };
    return '<defs>' +
      '<radialGradient id="' + p + 'fur" cx=".36" cy=".28" r=".9">' + st(0, '#E2AC7B') + st(0.45, '#CB8552') + st(1, '#AE6336') + '</radialGradient>' +
      '<radialGradient id="' + p + 'furD" cx=".4" cy=".25" r=".9">' + st(0, '#BF7847') + st(1, '#99552D') + '</radialGradient>' +
      '<radialGradient id="' + p + 'muz" cx=".5" cy=".3" r=".8">' + st(0, '#EFC9A0') + st(0.55, '#DDA674') + st(1, '#C58452') + '</radialGradient>' +
      '<linearGradient id="' + p + 'ear" x1=".5" y1="0" x2=".5" y2="1">' + st(0, '#BC7343') + st(0.45, '#CD8956') + st(1, '#E9BE90') + '</linearGradient>' +
      '<radialGradient id="' + p + 'nose" cx=".4" cy=".28" r=".8">' + st(0, '#CB9A8E') + st(0.6, '#B07A6C') + st(1, '#93625A') + '</radialGradient>' +
      '<linearGradient id="' + p + 'tongue" x1="0" y1="0" x2="0" y2="1">' + st(0, '#D4667A') + st(1, '#EF98A4') + '</linearGradient>' +
      '<radialGradient id="' + p + 'eye" cx=".5" cy=".62" r=".6">' + st(0, '#4A2C1E') + st(0.55, '#24150F') + st(1, '#150D0A') + '</radialGradient>' +
      '<linearGradient id="' + p + 'hat" x1="0" y1="0" x2="0" y2="1">' + st(0, '#FFFFFF') + st(1, '#EAE2D0') + '</linearGradient>' +
      '</defs>';
  };
  Paint.prototype.fur = function (d, name, marks, o) {
    o = o || {};
    var s = '<path d="' + d + '" fill="' + this.fill(name || 'fur') + '"' + (this.flat ? '' : ' stroke="' + C.line + '" stroke-opacity="' + (o.so === undefined ? 0.22 : o.so * 0.7) + '" stroke-width=".7" stroke-linejoin="round"') + '/>';
    if (marks && !this.flat) {
      s += '<path d="' + marks + '" fill="none" stroke="' + (o.dk || C.shade) + '" stroke-opacity="' + (o.da || 0.2) + '" stroke-width=".8" stroke-linecap="round"/>' +
        '<path d="' + marks + '" transform="translate(-.6,-.7)" fill="none" stroke="' + (o.lt || '#F3CDA4') + '" stroke-opacity="' + (o.la || 0.42) + '" stroke-width=".8" stroke-linecap="round"/>';
    }
    return s;
  };
  function show(on) { return on ? '' : ' display="none"'; }

  /* ---------- 樂樂's head (local units; skull centre at 0,0, radius ~25) ---------- */
  function headParts(g, o) {
    o = o || {};
    var r = RNG(o.seed || 11), eyes = o.eyes || 0, mouth = o.mouth || 0, acc = o.acc || 0, P = {};
    /* ears: big curly puffs flaring out like little wings, lighter at the tips */
    var earD = scallop(ell(-9.5, 10.5, 13, 18, 22, 11, r, 0.05), 2.6, r);
    var earM = curls(r, [[-9.5, 10.5, 11, 16, 22]], 0.04);
    var ear = '<g transform="translate(-20,-9)">' + g.fur(earD, 'ear', earM, { lt: '#F8DDBB', la: 0.42 }) + '</g>';
    P.earL = ear; P.earR = '<g transform="scale(-1,1)">' + ear + '</g>';
    /* skull: round afro */
    var sk = scallop(ell(0, -2.4, 25.6, 24.6, 0, 17, r, 0.025), 2.3, r);
    P.skull = g.fur(sk, 'fur', curls(r, [[0, -4, 24, 20, 0]], 0.028));
    /* face */
    var s = '';
    if (!g.flat) {
      s += '<ellipse cx="-10" cy="-1.5" rx="7" ry="6.5" fill="' + C.shade + '" opacity=".2"/><ellipse cx="10" cy="-1.5" rx="7" ry="6.5" fill="' + C.shade + '" opacity=".2"/>';
    }
    /* muzzle: the round, lighter "cheeks" */
    var mz = scallop(ell(0, 12.8, 19.4, 13, 0, 13, r, 0.03), 2.1, r);
    var muz = g.fur(mz, 'muz', curls(r, [[-9, 14, 6, 7, 0], [9, 14, 6, 7, 0]], 0.035), { so: 0.3, dk: '#A9683C', da: 0.22, lt: '#FBE6C8' });
    if (!g.flat) muz += '<ellipse cx="-7.4" cy="17.4" rx="4" ry="3.2" fill="#8E4E2A" opacity=".16"/><ellipse cx="7.4" cy="17.4" rx="4" ry="3.2" fill="#8E4E2A" opacity=".16"/>';
    /* mouths */
    var lip = '<path d="M0,13.6V15.2M-7,14.6Q-3.6,18.8 0,15.2Q3.6,18.8 7,14.6" fill="none" stroke="' + C.mouth + '" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>';
    var tongue = '<g data-p="tongue"><path d="M-4.1,19Q-4.9,28.8 0,29.4Q4.9,28.8 4.1,19Q0,17.4 -4.1,19Z" fill="' + g.fill('tongue') + '"/>' +
      '<path d="M0,21.4V27" stroke="' + C.tongueD + '" stroke-width=".7" stroke-linecap="round" opacity=".6"/></g>';
    muz += '<g data-p="mouth0"' + show(mouth === 0) + '>' + lip + '</g>';
    muz += '<g data-p="mouth1"' + show(mouth === 1) + '><path d="M-6.8,16Q0,18.2 6.8,16Q7.4,22.6 0,24.6Q-7.4,22.6 -6.8,16Z" fill="' + C.mouth + '"/>' + tongue + lip + '</g>';
    muz += '<g data-p="mouth2"' + show(mouth === 2) + '><ellipse cx="0" cy="21.4" rx="6.8" ry="7.8" fill="' + C.mouth + '"/><ellipse cx="0" cy="25.6" rx="4.2" ry="3" fill="' + g.fill('tongue') + '"/>' + lip + '</g>';
    /* nose: soft pinkish brown */
    muz += '<g transform="translate(0,8.4) scale(1.36) translate(0,-8.4)"><path d="M-5.4,6.1Q0,4 5.4,6.1Q6.3,8.9 3.1,11.1Q0,12.8 -3.1,11.1Q-6.3,8.9 -5.4,6.1Z" fill="' + g.fill('nose') + '"/>' +
      '<ellipse cx="-2.2" cy="9.3" rx="1.15" ry=".85" fill="' + C.noseD + '"/><ellipse cx="2.2" cy="9.3" rx="1.15" ry=".85" fill="' + C.noseD + '"/>' +
      (g.flat ? '' : '<ellipse cx="-1" cy="6.5" rx="2.3" ry=".8" fill="#fff" opacity=".4"/>') + '</g>';
    s += '<g data-p="muz">' + muz + '</g>';
    /* eyes: big, round, very dark and glossy */
    function eye(x) {
      return '<g transform="translate(' + x + ',-2.8)"><circle r="4.5" fill="' + g.fill('eye') + '"' + (g.flat ? '' : ' stroke="#3A2116" stroke-width=".7"') + '/>' +
        '<circle cx="-1.5" cy="-1.6" r="1.4" fill="#fff"/><circle cx="1.5" cy="1.5" r=".6" fill="#fff" opacity=".6"/></g>';
    }
    function arc(x, d2) { return '<path transform="translate(' + x + ',-2.2)" d="' + d2 + '" fill="none" stroke="#3A2116" stroke-width="1.5" stroke-linecap="round"/>'; }
    s += '<g data-p="eyes0"' + show(eyes === 0) + '>' + eye(-11.3) + eye(11.3) + '</g>';
    s += '<g data-p="eyes1"' + show(eyes === 1) + '>' + arc(-11.3, 'M-4.4,-.4Q0,3.2 4.4,-.4') + arc(11.3, 'M-4.4,-.4Q0,3.2 4.4,-.4') + '</g>';
    s += '<g data-p="eyes2"' + show(eyes === 2) + '>' + arc(-11.3, 'M-4.4,1.4Q0,-3.6 4.4,1.4') + arc(11.3, 'M-4.4,1.4Q0,-3.6 4.4,1.4') + '</g>';
    /* sweet, slightly worried brows of lighter fur */
    if (!g.flat) {
      s += '<path d="M-16.2,-8.2Q-11,-12.6 -5.6,-10.6M16.2,-8.2Q11,-12.6 5.6,-10.6" fill="none" stroke="#E8B98A" stroke-width="2.3" stroke-linecap="round" opacity=".8"/>';
    }
    P.face = s;
    /* accessories */
    var hb = '', hf = '';
    /* crochet hat: cream scalloped brim standing up round the face, red lining */
    var k, a, ring = '';
    for (k = 0; k < 9; k++) { a = (198 + k * 18) * D; ring += '<circle cx="' + f(31.5 * Math.cos(a)) + '" cy="' + f(-1 + 30 * Math.sin(a)) + '" r="6.3" fill="' + C.cream + '" stroke="' + C.creamD + '" stroke-width=".8"/>'; }
    for (k = 0; k < 9; k++) { a = (198 + k * 18) * D; ring += '<path d="M' + f(31.5 * Math.cos(a) - 2.6) + ',' + f(-1 + 30 * Math.sin(a) - 1) + 'q2.6,-3 5.2,0" fill="none" stroke="' + C.creamD + '" stroke-width=".7" stroke-linecap="round"/>'; }
    hb += '<g data-p="hat2b"' + show(acc === 2) + '><path d="M-29,-9A29,28 0 0 1 29,-9" fill="none" stroke="' + C.red + '" stroke-width="7" stroke-linecap="round"/>' + ring + '</g>';
    /* white bucket hat, tipped back */
    hf += '<g data-p="hat1"' + show(acc === 1) + ' transform="rotate(-7)">' +
      '<path d="M-17,-16Q-19,-35 0,-36Q19,-35 17,-16Z" fill="' + g.fill('hat') + '" stroke="' + C.creamD + '" stroke-width=".8"/>' +
      '<path d="M-31,-14.5Q-30,-23.5 0,-25Q30,-23.5 31,-14.5Q29,-8.2 0,-11.2Q-29,-8.2 -31,-14.5Z" fill="' + g.fill('hat') + '" stroke="' + C.creamD + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="M-27,-14.2Q0,-19 27,-14.2M-23.5,-17.5Q0,-21.6 23.5,-17.5M-15.6,-24.6Q0,-27 15.6,-24.6" fill="none" stroke="' + C.creamD + '" stroke-width=".7" stroke-dasharray="2.2 1.8" stroke-linecap="round"/></g>';
    P.hatBack = hb; P.hatFront = hf;
    return P;
  }
  /* neckwear, origin = under the chin */
  function neckwear(g, acc) {
    return '<g data-p="scarf1"' + show(acc === 1) + '>' +
      '<path d="M-1.5,2Q-10,9 -8.5,23Q-5,20.6 -2,23.4Q0,12 2.4,3Z" fill="' + g.fill('hat') + '" stroke="' + C.creamD + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="M1,2.4Q8.6,7 9.6,16.6Q6.6,15 4.4,17.6Q3.4,9 -1,3.6Z" fill="' + g.fill('hat') + '" stroke="' + C.creamD + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="M-13,-3.4Q0,4.6 13,-3.4Q12,1.2 4,4Q0,5.4 -4,4Q-12,1.2 -13,-3.4Z" fill="' + g.fill('hat') + '" stroke="' + C.creamD + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<ellipse cx="0" cy="3" rx="3.4" ry="2.8" fill="#fff" stroke="' + C.creamD + '" stroke-width=".8"/></g>' +
      '<g data-p="scarf2"' + show(acc === 2) + '><path d="M0,2.6L-6.5,-.6Q-8,3 -6.5,6.6ZM0,2.6L6.5,-.6Q8,3 6.5,6.6Z" fill="' + C.red + '" stroke="' + C.redD + '" stroke-width=".6" stroke-linejoin="round"/>' +
      '<path d="M-1,3.6L-3.4,9.6M1,3.6L3.4,9.6" stroke="' + C.red + '" stroke-width="1.6" stroke-linecap="round"/><circle cx="0" cy="2.8" r="1.9" fill="' + C.redD + '"/></g>';
  }
  function heartPath(x, y, k) {
    return '<path transform="translate(' + x + ',' + y + ') scale(' + k + ')" d="M0,7C-13,-2 -8,-12 0,-5C8,-12 13,-2 0,7Z"';
  }

  /* ---------- side rig ---------- */
  var HS = 0.78, HIP = [-15, -33];
  var CH = ['by', 'br', 'hn', 'hf', 'fn', 'ff', 'hns', 'hfs', 'fns', 'ffs', 'hx', 'hy', 'hr', 'lx', 'ly', 'earL', 'earR', 'tail', 'jump', 'rot', 'sx', 'sy', 'tl', 'tr'];
  var BASE = { by: 0, br: 0, hn: 0, hf: 0, fn: 0, ff: 0, hns: 1, hfs: 1, fns: 1, ffs: 1, hx: 0, hy: 0, hr: 0, lx: 0.5, ly: 0, earL: 0, earR: 0, tail: -8, jump: 0, rot: 0, sx: 1, sy: 1, tl: 1, tr: 0 };
  function pose(over, over2) {
    var P = {}, k;
    for (k in BASE) P[k] = BASE[k];
    if (over) for (k in over) P[k] = over[k];
    if (over2) for (k in over2) P[k] = over2[k];
    return P;
  }
  var POSE = {
    stand: {},
    sit: { by: 21, br: -43, hn: -72, hf: -68, hns: 0.8, hfs: 0.8, fn: 3, ff: -3, hx: 2, hy: -2, lx: 0.2, tail: 28 },
    lie: { by: 22, hn: -80, hf: -76, hns: 0.72, hfs: 0.72, fn: -82, ff: -78, fns: 0.82, ffs: 0.82, hx: 8, hy: 21, lx: 0.3, ly: 0.3, tail: 36 },
    sleep: { by: 22, hn: -80, hf: -76, hns: 0.72, hfs: 0.72, fn: -82, ff: -78, fns: 0.82, ffs: 0.82, hx: 8, hy: 22.5, hr: 9, lx: 0.1, ly: 0.6, tail: 52, earL: -5, earR: 5 },
    bow: { br: 20, by: 2, fn: -56, ff: -50, fns: 0.9, ffs: 0.9, hx: 7, hy: 15, tail: -30, lx: 0.4 },
    eat: { br: 9, fn: -4, ff: -8, fns: 0.87, ffs: 0.87, hx: 8, hy: 33, lx: 0.25, ly: 1, tail: -4 },
    dangle: { br: -62, by: -4, hn: 7, hf: -5, fn: 9, ff: -7, hx: 5, hy: 5, lx: 0, tail: 42, earL: 9, earR: -9 },
    roll: { rot: 180, jump: -24, hn: -38, hf: -28, fn: 28, ff: 40, lx: 0, hy: 27, hx: 7, hr: -70, tail: 10 },
    paw: { by: 21, br: -43, hn: -72, hf: -68, hns: 0.8, hfs: 0.8, fn: -72, fns: 0.86, ff: -3, hx: 2, hy: -2, hr: -7, lx: 0.1, tail: 28 },
    scratch: { by: 21, br: -38, hn: -118, hns: 0.95, hf: -68, hfs: 0.8, fn: 3, ff: -3, hx: -2, hy: 5, hr: 17, lx: 0.1, tail: 20 }
  };
  function xf(P, out) {
    var a = P.br * D, ca = Math.cos(a), sa = Math.sin(a);
    function tp(x, y) { var dx = x - HIP[0], dy = y - HIP[1]; return [HIP[0] + dx * ca - dy * sa, HIP[1] + dx * sa + dy * ca + P.by]; }
    function at(p, r, s) { return 'translate(' + f(p[0]) + ',' + f(p[1]) + ') rotate(' + f(r) + ') scale(1,' + f(s, 3) + ')'; }
    var hipN = tp(-15, -33), hipF = tp(-11, -33.5), shN = tp(15, -33.5), shF = tp(19, -34), tl = tp(-24, -43), nk = tp(16, -44);
    var hc = [shN[0] + 11 + P.hx, shN[1] - 27 + P.hy];
    out.root = 'translate(0,' + f(-P.jump) + ') rotate(' + f(P.rot) + ',0,-36) scale(' + f((P.flip === undefined ? 1 : P.flip) * P.sx, 3) + ',' + f(P.sy, 3) + ')';
    out.torso = 'translate(0,' + f(P.by) + ') rotate(' + f(P.br) + ',' + HIP[0] + ',' + HIP[1] + ')';
    out.hn = at(hipN, P.hn, P.hns); out.hf = at(hipF, P.hf, P.hfs); out.fn = at(shN, P.fn, P.fns); out.ff = at(shF, P.ff, P.ffs);
    out.tail = 'translate(' + f(tl[0]) + ',' + f(tl[1]) + ') rotate(' + f(P.tail + P.br * 0.4) + ')';
    var nx = hc[0] - 2, ny = hc[1] + 9, L = Math.hypot(nx - nk[0], ny - nk[1]);
    out.neck = 'translate(' + f((nx + nk[0]) / 2) + ',' + f((ny + nk[1]) / 2) + ') rotate(' + f(Math.atan2(ny - nk[1], nx - nk[0]) / D) + ') scale(' + f(Math.max(0.5, (L + 14) / 22), 3) + ',1)';
    out.head = 'translate(' + f(hc[0]) + ',' + f(hc[1]) + ') rotate(' + f(P.hr) + ') scale(' + HS + ')';
    out.earL = 'translate(' + f(-P.lx * 1.6) + ',0) rotate(' + f(P.earL) + ',-20,-9)';
    out.earR = 'translate(' + f(-P.lx * 1.6) + ',0) rotate(' + f(P.earR) + ',20,-9)';
    out.face = 'translate(' + f(P.lx * 3) + ',' + f(P.ly * 1.6) + ')';
    out.muz = 'translate(' + f(P.lx * 1.6) + ',' + f(P.ly * 1) + ')';
    out.tongue = 'translate(0,18) rotate(' + f(P.tr) + ') scale(1,' + f(P.tl, 3) + ') translate(0,-18)';
    out.held = 'translate(' + f(P.lx * 4.6) + ',' + f(21 + P.ly * 2.6) + ')';
    out.scarf = 'translate(' + f(hc[0] + P.lx * 2) + ',' + f(hc[1] + 19.5 * HS) + ') rotate(' + f(P.hr * 0.5) + ') scale(' + HS + ')';
    out.hc = hc;
    return out;
  }
  var PARTS = ['root', 'torso', 'hn', 'hf', 'fn', 'ff', 'tail', 'neck', 'head', 'earL', 'earR', 'face', 'muz', 'tongue', 'held', 'scarf'];
  function legArt(g, r, front, far) {
    var c = front ? [[0, 1.5, 5], [0, 9, 4.1], [0.3, 18, 3], [0.8, 27, 2.7]] : [[0, 2, 7.2], [-0.6, 10, 5.8], [0.8, 19, 3.2], [1.4, 27, 2.8]];
    var name = far ? 'furD' : 'fur';
    var leg = g.fur(scallop(tube(c, 5), 1.1, r), name, curls(r, front ? [[0, 10, 3.6, 9, 0]] : [[-0.3, 9, 5, 7, 0]], 0.035), { so: 0.3 });
    var paw = g.fur(scallop(ell(2, 30.2, 5.6, 4.2, 0, 7, r, 0.04), 1.4, r), name, null, { so: 0.3 });
    return leg + paw;
  }
  function ballArt(rad) {
    return '<circle r="' + rad + '" fill="#49BDB2"/><path d="M' + f(-rad * 0.96) + ',' + f(-rad * 0.25) + 'Q0,' + f(rad * 0.35) + ' ' + f(rad * 0.96) + ',' + f(-rad * 0.25) + '" fill="none" stroke="#fff" stroke-width="' + f(rad * 0.3) + '" stroke-linecap="round" opacity=".92"/>' +
      '<circle r="' + rad + '" fill="none" stroke="#2F9A90" stroke-width=".8"/><ellipse cx="' + f(-rad * 0.35) + '" cy="' + f(-rad * 0.45) + '" rx="' + f(rad * 0.3) + '" ry="' + f(rad * 0.18) + '" fill="#fff" opacity=".5" transform="rotate(-30)"/>';
  }
  function rig(g, o) {
    o = o || {};
    var r = RNG(o.seed || 5), P = o.pose || pose(), X = xf(P, {}), acc = o.acc || 0;
    function grp(name, inner, extra) { return '<g data-p="' + name + '" transform="' + X[name] + '"' + (extra || '') + '>' + inner + '</g>'; }
    var hp = headParts(g, { eyes: o.eyes, mouth: o.mouth, acc: acc, seed: 11 });
    var torso = g.fur(scallop(smooth([[-18, -48.5], [0, -49.6], [14, -50.8], [23.5, -47], [27, -39], [23.5, -30], [9, -25.6], [-8, -27], [-19, -27], [-26.6, -34.5], [-25.2, -44]], 6.4), 1.8, r),
      'fur', curls(r, [[-1, -38, 23, 9.5, 0], [19, -40, 6, 7, 0]], 0.03));
    /* red collar + tag */
    torso += '<path d="M12.6,-51.4Q22,-49.6 26.6,-41.6" fill="none" stroke="' + C.red + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="24.6" cy="-39.6" r="2" fill="#F3C552" stroke="#C99A2E" stroke-width=".5"/>';
    var tail = g.fur(scallop(tube([[0, 1, 2.6], [-2, -5, 2.4], [-3.4, -9, 2.4]], 3), 0.9, r), 'fur', null, { so: 0.3 }) +
      g.fur(scallop(ell(-4.6, -13, 6.6, 6.6, 0, 8, r, 0.05), 1.9, r), 'fur', curls(r, [[-4.6, -13, 5, 5, 0]], 0.04));
    var neck = g.fur(scallop(ell(0, 0, 11, 8.2, 0, 9, r, 0.03), 1.4, r), 'fur', null, { so: 0.2 });
    var head = '<g data-p="earL" transform="' + X.earL + '">' + hp.earL + '</g><g data-p="earR" transform="' + X.earR + '">' + hp.earR + '</g>' + hp.hatBack + hp.skull +
      '<g data-p="face" transform="' + X.face + '">' + hp.face.replace('<g data-p="muz">', '<g data-p="muz" transform="' + X.muz + '">').replace('<g data-p="tongue">', '<g data-p="tongue" transform="' + X.tongue + '">') +
      '<g data-p="held" transform="' + X.held + '"' + show(!!o.held) + '>' + ballArt(9.4) + '</g></g>' + hp.hatFront;
    return grp('root',
      grp('tail', tail) + grp('hf', legArt(g, r, false, true)) + grp('ff', legArt(g, r, true, true)) +
      grp('torso', torso) + grp('hn', legArt(g, r, false, false)) + grp('fn', legArt(g, r, true, false)) +
      grp('neck', neck) + grp('scarf', neckwear(g, acc)) + grp('head', head));
  }
  function svgOpen(vb, w, h, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + (w ? ' width="' + w + '" height="' + h + '"' : '') + ' aria-hidden="true"' + (extra || '') + '>';
  }

  /* ---------- front-sitting 樂樂 (static art) ---------- */
  function frontSit(g, o) {
    o = o || {};
    var r = RNG(o.seed || 23), acc = o.acc || 0, hp = headParts(g, { eyes: o.eyes, mouth: o.mouth, acc: acc, seed: 11 }), s = '';
    function mir(x) { return '<g transform="scale(-1,1)">' + x + '</g>'; }
    s += '<ellipse cx="0" cy="-1" rx="27" ry="4.2" fill="#9A6A48" opacity=".16"/>';
    s += g.fur(scallop(ell(18.5, -12, 6, 6, 0, 8, r, 0.05), 1.8, r), 'fur', curls(r, [[18.5, -12, 4.5, 4.5, 0]], 0.04));
    var haunch = g.fur(scallop(ell(-13.8, -10.5, 8.4, 10.4, -8, 10, r, 0.04), 1.7, r), 'furD', curls(r, [[-15, -11, 5, 7.5, 0]], 0.03)) +
      g.fur(scallop(ell(-17, -3, 6.2, 4.2, 0, 7, r, 0.04), 1.4, r), 'fur', null);
    s += haunch + mir(haunch);
    s += g.fur(scallop(smooth([[-7, -44], [7, -44], [11.6, -32], [12.6, -17], [9, -6.5], [-9, -6.5], [-12.6, -17], [-11.6, -32]], 6.2), 1.8, r), 'fur', curls(r, [[0, -24, 9.5, 14, 0]], 0.03));
    var leg = g.fur(scallop(tube([[-6.2, -28, 4.3], [-6.6, -17, 3.1], [-6.6, -6, 2.8]], 5), 1.1, r), 'fur', curls(r, [[-6.4, -19, 2.6, 7, 0]], 0.035), { so: 0.42 }) +
      g.fur(scallop(ell(-6.8, -2.6, 5.4, 4, 0, 7, r, 0.04), 1.4, r), 'fur', null, { so: 0.3 });
    s += leg + mir(leg);
    if (acc !== 1) s += '<path d="M-9.4,-40.6Q0,-35 9.4,-40.6" fill="none" stroke="' + C.red + '" stroke-width="3.2" stroke-linecap="round"/><circle cx="0" cy="-34.4" r="2.2" fill="#F3C552" stroke="#C99A2E" stroke-width=".5"/>';
    var hy = -58.5, hs = 0.82;
    s += '<g transform="translate(0,' + f(hy + 19.5 * hs) + ') scale(' + hs + ')">' + neckwear(g, acc) + '</g>';
    s += '<g transform="translate(0,' + hy + ') rotate(' + (o.tilt || 0) + ') scale(' + hs + ')"><g transform="rotate(' + (o.ear || 0) + ',-20,-9)">' + hp.earL + '</g><g transform="rotate(' + (-(o.ear || 0)) + ',20,-9)">' + hp.earR + '</g>' + hp.hatBack + hp.skull + hp.face + hp.hatFront + '</g>';
    return s;
  }
  function heartArt(x, y, k, col) { return heartPath(x, y, k) + ' fill="' + (col || C.heart) + '"/>'; }

  /* ---------- theme slots ---------- */
  var lockArt = (function () {
    var g = new Paint();
    return svgOpen('-52 -96 104 100', 163, 150) + g.defs() + frontSit(g, { acc: 1, mouth: 1, ear: 4 }) +
      heartArt(37, -70, 0.62) + heartArt(45, -56, 0.34, '#F2A9A6') + '</svg>';
  })();
  var cornerMascot = (function () {
    var g = new Paint(), r = RNG(41), hp = headParts(g, { eyes: 0, mouth: 0, seed: 11 });
    var paw = g.fur(scallop(ell(-12.5, 23, 6.4, 4.6, 0, 7, r, 0.04), 1.4, r), 'fur', null, { so: 0.3 });
    return svgOpen('-50 -30 100 57', 109, 62) + g.defs() + '<g transform="rotate(4)"><g transform="rotate(8,-20,-9)">' + hp.earL + '</g><g transform="rotate(-8,20,-9)">' + hp.earR + '</g>' + hp.skull +
      '<g transform="translate(0,1.4)">' + hp.face + '</g></g>' + paw + '<g transform="scale(-1,1)">' + paw + '</g></svg>';
  })();
  function flatFace(vb, w, h, bg) {
    var g = new Paint(true), hp = headParts(g, { eyes: 0, mouth: 0, seed: 11 });
    return svgOpen(vb, w, h) + (bg || '') + hp.earL + hp.earR + hp.skull + hp.face + '</svg>';
  }
  var headingIcon = flatFace('-50 -30 100 60', 40, 24);
  function pawD(x, y, k, rot) {
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + (rot || 0) + ') scale(' + k + ')"><ellipse cx="0" cy="3.6" rx="5.6" ry="4.6"/><ellipse cx="-6.6" cy="-2.4" rx="2.3" ry="3" transform="rotate(-24 -6.6 -2.4)"/>' +
      '<ellipse cx="-2.4" cy="-6.2" rx="2.3" ry="3.1" transform="rotate(-8 -2.4 -6.2)"/><ellipse cx="2.4" cy="-6.2" rx="2.3" ry="3.1" transform="rotate(8 2.4 -6.2)"/><ellipse cx="6.6" cy="-2.4" rx="2.3" ry="3" transform="rotate(24 6.6 -2.4)"/></g>';
  }
  var BONE = 'M-7,-2.2Q-8,-6 -11.6,-5.4Q-14.6,-4 -13,-0.6Q-15,2.6 -12,4.8Q-8.4,6 -7,2.2L7,2.2Q8.4,6 12,4.8Q15,2.6 13,-0.6Q14.6,-4 11.6,-5.4Q8,-6 7,-2.2Z';
  var ornament = svgOpen('0 0 112 22', 112, 22) + '<g fill="' + C.mid + '">' + pawD(14, 12, 0.78, -18) + pawD(98, 12, 0.78, 18) + '</g>' +
    '<g fill="#E8958A" opacity=".9">' + pawD(34, 9, 0.5, 12) + pawD(78, 9, 0.5, -12) + '</g>' +
    '<path transform="translate(56,11) rotate(-8)" d="' + BONE + '" fill="#F6E2C6" stroke="' + C.mid + '" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var swatch = (function () {
    var g = new Paint(), hp = headParts(g, { eyes: 0, mouth: 1, seed: 11 });
    return svgOpen('0 0 120 80', 120, 80) + g.defs() + '<defs><linearGradient id="' + g.pre + 'bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4E6"/><stop offset=".55" stop-color="#F9D9BC"/><stop offset="1" stop-color="#F0BC93"/></linearGradient></defs>' +
      '<rect width="120" height="80" fill="url(#' + g.pre + 'bg)"/><g fill="#fff" opacity=".55">' + pawD(18, 20, 0.9, -20) + pawD(104, 58, 0.8, 18) + '</g>' + heartArt(100, 20, 0.6) +
      '<g transform="translate(60,40) scale(.98)">' + hp.earL + hp.earR + hp.skull + hp.face + '</g></svg>';
  })();

  /* character sheet helper (also used by the dev harness) */
  function art(kind, o) {
    o = o || {};
    var g = new Paint();
    if (kind === 'front') return svgOpen('-52 -96 104 100') + g.defs() + frontSit(g, o) + '</svg>';
    var P = pose(POSE[o.pose || 'stand'], o.over);
    return svgOpen('-75 -105 150 125') + g.defs() + '<ellipse cx="0" cy="0" rx="30" ry="4.4" fill="#9A6A48" opacity=".16"/>' + rig(g, { pose: P, eyes: o.eyes, mouth: o.mouth, acc: o.acc, held: o.held }) + '</svg>';
  }

  /* ---------- theme css ---------- */
  var S = 'html[data-theme="lele"]';
  var css = `
${S}{
  --bg1:#FFF9F0; --bg2:#FCEBD9; --bg3:#F9DDC7; --bg4:#FFF2E2;
  --orb1:rgba(240,190,140,.42); --orb2:rgba(246,196,176,.45); --orb3:rgba(255,232,196,.5);
  --text:#5E4030; --text-soft:#93705B; --accent1:#C9814F; --accent2:#E8958A;
  --card-bg:rgba(255,253,249,.88); --card-border:rgba(221,163,115,.32);
  --card-shadow:0 18px 40px -24px rgba(180,105,58,.5),0 2px 8px -3px rgba(180,105,58,.14); --card-radius:28px;
  --chip-bg:#FFF3E4; --chip-text:#93705B; --danger:#D9736B;
  --font-body:"LXGW WenKai TC","Quicksand","PingFang TC","Microsoft JhengHei","Noto Sans TC","Noto Sans CJK TC",sans-serif;
  --font-display:"Quicksand","LXGW WenKai TC","PingFang TC","Microsoft JhengHei","Noto Sans TC",sans-serif;
  --font-script:"Sacramento","Snell Roundhand","Apple Chancery","Quicksand",cursive;
  --latin-style:normal; --script-style:normal; --script-w:400; --body-w:400; --head-w:700; --num-w:600;
  --accent-ink:#A85F33; --ink-3:#B79A86;
  --hair:rgba(201,129,79,.4); --hair-2:rgba(201,129,79,.2); --hair-b:rgba(232,149,138,.4);
  --mute:rgba(147,112,91,.22); --glow:rgba(232,149,138,.28);
  --bg-grad:linear-gradient(125deg,#FFF9F0 0%,#FDEEDD 18%,#FADFC8 36%,#FFF3E2 52%,#FBE4D2 68%,#F8D9C0 84%,#FFF8EE 100%);
  --soft-bg:#FFF6EA; --soft-radius:20px; --soft-shadow:0 8px 22px -18px rgba(180,105,58,.55);
  --blur:none;
  --grad-text:linear-gradient(100deg,#B4693A 0%,#D58957 28%,#E58B80 52%,#D08A54 78%,#B4693A 100%);
  --grad-bar:linear-gradient(90deg,#D99766,#EBA093);
  --grad-deep:linear-gradient(90deg,#C17A48,#DD8478);
  --grad-pale:linear-gradient(90deg,#F6DCC2,#F9D6CC);
  --g-m:linear-gradient(90deg,#E7B58C,#C9814F); --g-f:linear-gradient(90deg,#F6C3BA,#E8958A); --g-c:linear-gradient(90deg,#F6E3C4,#E3C08E);
  --d-m:#C9814F; --d-f:#E8958A; --d-c:#E3C08E;
  --track:#F8E6D3; --ring-track:#F8E6D3; --ring-1:#DDA373; --ring-2:#D98A5A; --ring-3:#E58B80;
  --btn:linear-gradient(100deg,#D18B55,#E8958A 55%,#D18B55); --btn-ts:0 1px 2px rgba(140,80,40,.35);
  --btn-sh:0 12px 24px -14px rgba(201,129,79,.95);
  --on:linear-gradient(100deg,#CF8853,#E59383); --on-ts:0 1px 2px rgba(140,80,40,.3);
  --field:#FFF6EA; --field-f:#FFFDF9;
  --c-gold-bg:#FBE6CE; --c-gold-ink:#9A5A2E; --c-blush-bg:#FBDDD6; --c-blush-ink:#B25A50;
  --c-rose-bg:#E28378; --c-mist-bg:#F3E9DD; --c-mist-ink:#8A6E5C;
  --alert-bg:#FDE9E3; --alert-ink:#B4574C; --booked-item:#FFF6EA;
  --bar-bg:rgba(255,249,240,.88); --tabbar-bg:rgba(255,250,243,.97); --sheet-bg:rgba(255,250,243,.97);
  --orn-h:20px;
}
${S} .bg{background:#FCEBD9}
${S} .orb.a{background:radial-gradient(circle,#F3C9A0 0%,rgba(243,201,160,.45) 32%,rgba(243,201,160,0) 70%);opacity:.6}
${S} .orb.b{background:radial-gradient(circle,#F8CDBD 0%,rgba(248,205,189,.45) 32%,rgba(248,205,189,0) 70%);opacity:.6}
${S} .orb.c{background:radial-gradient(circle,#FFE9C8 0%,rgba(255,233,200,.5) 32%,rgba(255,233,200,0) 70%);opacity:.7}
${S} .card{border-width:1.5px}
${S} .card.soft{border-color:rgba(221,163,115,.22)}
${S} .lock-art{margin:-14px 0 0}
${S} .lock-art svg{max-width:230px;max-height:150px}
${S} .hero-title,${S} .lock-title{font-family:var(--font-script);letter-spacing:0;line-height:1.3;padding:.08em .16em 0}
${S} .lock-title{font-size:clamp(52px,16.5vw,68px)}
${S} .hero-title{font-size:clamp(54px,17vw,72px)}
${S} .lock-date,${S} .hero-line b{font-weight:600;letter-spacing:.26em;padding-left:.26em}
${S} .page-subtitle{font-family:var(--font-script);font-size:25px;line-height:1.15}
${S} .count-cap,${S} .foot .latin{font-family:var(--font-script);font-size:23px;line-height:1.3}
${S} .page-title{letter-spacing:.22em;padding-left:.22em}
${S} .heading-icon svg{height:1.12em}
${S} .corner-slot{right:18px;bottom:calc(100% - 9px)}
${S} .corner-slot svg{height:60px}
${S} .countdown-card.has-corner{margin-top:64px}
${S} .btn-primary{font-weight:700}
${S} .tab,${S} .chip,${S} .sub{font-weight:700}
${S} .topbar-title{font-weight:700}
${S} .tabbar{border-top-color:rgba(221,163,115,.35)}
${S} .sw-n{font-weight:700}
@media (min-width:760px){${S} .hero-title{font-size:104px}${S} .lock-title{font-size:76px}}

/* ---- 樂樂 the pet: one fixed full-screen layer; only the dog and his props take pointer events ---- */
.lele-layer{position:fixed;inset:0;z-index:11;pointer-events:none;overflow:hidden;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.lele-layer[hidden]{display:none}
.lele-pet,.lele-prop{position:absolute;left:0;top:0;will-change:transform}
.lele-pet svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none}
.lele-hit{position:absolute;left:29%;top:20%;width:48%;height:80%;border-radius:46%;pointer-events:auto;touch-action:none;cursor:grab;-webkit-tap-highlight-color:transparent}
.lele-hit:active{cursor:grabbing}
.lele-prop{opacity:0;transition:opacity .35s ease}
.lele-prop.on{opacity:1}
.lele-prop svg{display:block;overflow:visible}
.lele-prop.on>svg{animation:leleIn .38s cubic-bezier(.3,1.5,.5,1) both}
.lele-ball{z-index:3;padding:9px;margin:-9px;border-radius:50%}
.lele-ball.on{pointer-events:auto;touch-action:none;cursor:grab}
.lele-ball i{position:absolute;left:18%;right:18%;bottom:5px;height:5px;border-radius:50%;background:rgba(154,106,72,.22)}
.lele-bowl{z-index:2}
.lele-pet{z-index:1}
.lele-fx{position:absolute;z-index:5;pointer-events:none;line-height:0}
.lele-fx svg{display:block}
@keyframes leleIn{from{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.14)}to{opacity:1;transform:none}}
@keyframes leleUp{0%{opacity:0;transform:translate(0,4px) scale(.4)}22%{opacity:1;transform:translate(calc(var(--dx,0px)*.25),-10px) scale(1.12)}100%{opacity:0;transform:translate(var(--dx,0px),-54px) scale(.9)}}
.lele-heart{animation:leleUp 1.15s ease-out forwards}
@keyframes leleZ{0%{opacity:0;transform:translate(0,0) scale(.5)}25%{opacity:.95}100%{opacity:0;transform:translate(18px,-46px) scale(1.3) rotate(12deg)}}
.lele-z{font:700 19px/1 "Quicksand","LXGW WenKai TC",sans-serif;color:#B4693A;text-shadow:0 0 3px #fff,0 0 6px #fff;animation:leleZ 2.4s ease-out forwards}
@keyframes leleCrumb{0%{opacity:1;transform:translate(0,0) scale(1)}60%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0px),var(--dy,0px)) scale(.6)}}
.lele-crumb{width:4px;height:4px;border-radius:50%;background:#A7653A;animation:leleCrumb .5s cubic-bezier(.2,.6,.4,1) forwards}
.lele-crumb.w{background:#8FCBE6;border-radius:50% 50% 50% 0}
@keyframes leleSpark{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.1) rotate(40deg)}100%{opacity:0;transform:translate(var(--dx,0px),var(--dy,0px)) scale(.5) rotate(120deg)}}
.lele-spark{animation:leleSpark .8s ease-out forwards}
@keyframes lelePop{0%{opacity:0;transform:scale(.3)}16%{opacity:1;transform:scale(1.14)}28%{transform:scale(1)}78%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.96) translateY(-7px)}}
.lele-bub{width:0;height:0}
.lele-bub span{position:absolute;right:-22px;bottom:4px;transform-origin:70% 100%;white-space:nowrap;line-height:1.2;
  font:700 14px/1.2 "LXGW WenKai TC","Quicksand",sans-serif;color:#A85F33;background:#FFFDF9;border:1.5px solid #E7B58C;border-radius:14px 14px 14px 4px;padding:3px 10px 4px;
  box-shadow:0 6px 14px -8px rgba(180,105,58,.6);animation:lelePop 1.25s ease-out forwards}
.lele-bub.l span{right:auto;left:-22px;border-radius:14px 14px 4px 14px;transform-origin:30% 100%}
@keyframes lelePat{0%,100%{transform:translateY(-10px) rotate(-10deg)}50%{transform:translateY(3px) rotate(4deg)}}
.lele-hand svg{animation:lelePat .44s ease-in-out infinite}
@keyframes leleLick{0%{opacity:0;transform:scale(.3)}25%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.3)}}
.lele-lick{animation:leleLick 1.1s ease-out forwards}
.lele-paused *{animation-play-state:paused!important}
.lele-toggle{position:absolute;left:6px;bottom:1px;width:44px;height:44px;display:grid;place-items:center;border:0;padding:0;background:none;cursor:pointer;color:#C9814F;
  -webkit-tap-highlight-color:transparent;pointer-events:auto}
.lele-toggle svg{width:22px;height:22px;transition:transform .25s cubic-bezier(.3,1.5,.5,1),opacity .25s}
.lele-toggle:active svg{transform:scale(.86)}
.lele-toggle[aria-pressed="false"] svg{opacity:.38}
.lele-toggle[aria-pressed="false"]::after{content:"";position:absolute;left:11px;right:11px;top:50%;height:2px;border-radius:2px;background:#B79A86;transform:rotate(-38deg)}
@media (min-width:900px){.lele-toggle{left:22px;top:14px;bottom:auto;border-radius:50%;background:var(--bar-bg);box-shadow:inset 0 0 0 1px var(--hair-2)}}
`;

  /* ---------- particles: a few paw prints, hearts and tiny bones drifting up ---------- */
  var PP = null, seeded = 0;
  var particles = {
    count: 10,
    spawn: function (w, h) {
      var first = seeded < 10; seeded++;
      var kinds = ['paw', 'heart', 'paw', 'bone', 'paw'];
      return {
        kind: kinds[(Math.random() * kinds.length) | 0], x: Math.random() * w, y: first ? Math.random() * h : h + 24,
        vy: -(5 + Math.random() * 7), sway: 6 + Math.random() * 10, ph: Math.random() * 6.28, rot: (Math.random() - 0.5) * 1.2,
        vr: (Math.random() - 0.5) * 0.25, size: 0.8 + Math.random() * 0.5, a: 0.16 + Math.random() * 0.14, t: 0
      };
    },
    step: function (p, dt, w) {
      p.t += dt; p.y += p.vy * dt; p.x += Math.cos(p.t * 0.6 + p.ph) * p.sway * dt; p.rot += p.vr * dt;
      return p.y > -30 && p.x > -30 && p.x < w + 30;
    },
    draw: function (ctx, p) {
      if (!PP) PP = { heart: new Path2D('M0,7C-13,-2 -8,-12 0,-5C8,-12 13,-2 0,7Z'), bone: new Path2D(BONE) };
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(p.size, p.size);
      ctx.globalAlpha = p.a * Math.min(1, p.t * 1.2 + 0.25);
      if (p.kind === 'paw') {
        ctx.fillStyle = '#D0895A';
        var e = [[0, 3.6, 5.6, 4.6, 0], [-6.6, -2.4, 2.3, 3, -0.42], [-2.4, -6.2, 2.3, 3.1, -0.14], [2.4, -6.2, 2.3, 3.1, 0.14], [6.6, -2.4, 2.3, 3, 0.42]];
        for (var i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(e[i][0], e[i][1], e[i][2], e[i][3], e[i][4], 0, 6.2832); ctx.fill(); }
      } else if (p.kind === 'heart') { ctx.fillStyle = '#EC8A8F'; ctx.fill(PP.heart); }
      else { ctx.scale(0.8, 0.8); ctx.fillStyle = '#F4DDBE'; ctx.fill(PP.bone); ctx.strokeStyle = '#D0895A'; ctx.lineWidth = 1.2; ctx.stroke(PP.bone); }
    }
  };

  /* ---------- 樂樂 the pet ---------- */
  var PET_KEY = 'wedding-dash-lele-pet', ACC_KEY = 'wedding-dash-lele-acc';
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { } }
  var HEART_SVG = '<svg width="16" height="15" viewBox="-11 -11 22 20">' + heartPath(0, 0, 1) + ' fill="' + C.heart + '"/></svg>';
  var PAW_SVG = '<svg viewBox="-11 -11 22 22" aria-hidden="true"><g fill="currentColor">' + pawD(0, 1, 1, 0) + '</g></svg>';
  var HAND_SVG = '<svg width="34" height="30" viewBox="-17 -15 34 30"><path d="M-11,6Q-15,-2 -10.5,-6Q-9,-12.5 -5,-10.5Q-3,-15 1,-11.5Q5,-14.5 7,-9.5Q11.5,-10.5 11,-4Q15.5,-1 12,4Q10,11 0,11.5Q-8,11.5 -11,6Z" fill="#FFE9D6" stroke="#D9A07E" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M-5,-10V-4M1,-11V-4.5M7,-9V-3.5" stroke="#D9A07E" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg>';
  var SPARK_SVG = '<svg width="12" height="12" viewBox="-6 -6 12 12"><path d="M0,-6Q1,-1 6,0Q1,1 0,6Q-1,1 -6,0Q-1,-1 0,-6Z" fill="#F6C860"/></svg>';
  var LICK_SVG = '<svg width="40" height="34" viewBox="-20 -17 40 34"><path d="M-14,-6Q-4,-16 8,-11Q18,-6 14,5Q8,15 -5,12Q-18,8 -14,-6Z" fill="#BFE4F4" opacity=".75"/><path d="M-8,-5Q-2,-10 5,-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/></svg>';
  function bowlSVG(s, water) {
    var k = '';
    if (!water) [[-8, -10.2], [-3, -11.4], [3, -11], [8, -10], [-5.5, -8.6], [0.5, -8.8], [6, -8.4]].forEach(function (p) { k += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.3" fill="#A7653A" stroke="#8A4E2A" stroke-width=".5"/>'; });
    return '<svg width="' + f(48 * s) + '" height="' + f(26 * s) + '" viewBox="-24 -19 48 26"><ellipse cx="0" cy="4.4" rx="21" ry="2.6" fill="#9A6A48" opacity=".18"/>' +
      '<path d="M-18.5,-9Q-17.5,3.4 -11,4.6L11,4.6Q17.5,3.4 18.5,-9Z" fill="' + (water ? '#D9EEF6' : '#F9E6CF') + '" stroke="' + (water ? '#9CC7DA' : '#D9A878') + '" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<ellipse cx="0" cy="-9" rx="18.5" ry="4.6" fill="#FFFAF2" stroke="' + (water ? '#9CC7DA' : '#D9A878') + '" stroke-width="1.1"/>' +
      '<g data-c><ellipse cx="0" cy="-9" rx="15.4" ry="3.3" fill="' + (water ? '#9AD4EA' : '#8E5530') + '"/>' + (water ? '<path d="M-9,-9.6Q-5,-10.8 -1,-9.6" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/>' : k) + '</g>' +
      '<g fill="' + (water ? '#9CC7DA' : '#E0A878') + '" transform="translate(0,-1.4) scale(.42)">' + pawD(0, 0, 1, 0) + '</g></svg>';
  }

  function mount() {
    var doc = document, reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var W = window.innerWidth, VH = window.innerHeight, S_ = W >= 900 ? 1.3 : (W >= 600 ? 1.15 : 1);
    var OX = 75, OY = 105, dead = false, raf = 0, last = 0, T = 0, DT = 0.016, paused = false;
    function el(tag, cls) { var e = doc.createElement(tag); if (cls) e.className = cls; return e; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    var layer = el('div', 'lele-layer'); layer.setAttribute('aria-hidden', 'true');
    var bowlEl = el('div', 'lele-prop lele-bowl'), ballEl = el('div', 'lele-prop lele-ball'), petEl = el('div', 'lele-pet');
    var g = new Paint(), acc = 0, accSaved = lsGet(ACC_KEY);
    if (accSaved === '0' || accSaved === '1' || accSaved === '2') acc = +accSaved; else acc = Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : 2) : 0;
    petEl.style.width = f(150 * S_) + 'px'; petEl.style.height = f(125 * S_) + 'px';
    petEl.innerHTML = svgOpen('-75 -105 150 125') + g.defs() + '<ellipse data-p="shadow" cx="0" cy="0.5" rx="27" ry="4.2" fill="#9A6A48" opacity=".17"/>' +
      rig(g, { pose: pose(POSE.sit), acc: acc }) + '</svg><div class="lele-hit"></div>';
    var BR = 7.5 * S_;
    ballEl.innerHTML = '<i></i><svg width="' + f(BR * 2) + '" height="' + f(BR * 2) + '" viewBox="-8 -8 16 16"><g>' + ballArt(7.5) + '</g></svg>';
    layer.appendChild(bowlEl); layer.appendChild(petEl); layer.appendChild(ballEl);
    doc.body.appendChild(layer);
    var hit = petEl.querySelector('.lele-hit'), N = {}, lastX = {}, X = {}, vis = {};
    [].forEach.call(petEl.querySelectorAll('[data-p]'), function (n) { N[n.getAttribute('data-p')] = n; });
    var ballG = ballEl.querySelector('g'), ballSh = ballEl.querySelector('i');

    /* show / hide toggle (paw button in the header) */
    var shown = lsGet(PET_KEY) !== '0', topbar = doc.querySelector('.topbar'), tog = el('button', 'lele-toggle');
    tog.type = 'button'; tog.innerHTML = PAW_SVG;
    function syncToggle() {
      tog.setAttribute('aria-pressed', shown ? 'true' : 'false'); tog.setAttribute('aria-label', shown ? '讓樂樂躲起來' : '叫樂樂出來'); tog.title = shown ? '讓樂樂躲起來' : '叫樂樂出來';
      layer.hidden = !shown;
    }
    function onToggle() {
      shown = !shown; lsSet(PET_KEY, shown ? '1' : '0'); syncToggle();
      if (shown) { if (!reduce) { start('enter'); run(); } } else stop();
    }
    tog.addEventListener('click', onToggle);
    if (topbar) topbar.appendChild(tog);

    /* ---- state ---- */
    var B = { l: 40, r: W - 40, t: 150, b: VH - 70 };
    function measure() {
      W = window.innerWidth; VH = window.innerHeight;
      var tb = doc.getElementById('tabbar'), tr = tb && tb.getBoundingClientRect(), pr = topbar && topbar.getBoundingClientRect();
      var t = pr && pr.height ? pr.bottom : 0, b = VH - 8;
      if (tr && tr.height) { if (tr.top > VH / 2) b = tr.top - 6; else t = Math.max(t, tr.bottom); }
      B = { l: 38 * S_, r: W - 38 * S_, t: t + 92 * S_, b: b };
      if (B.t > B.b - 20) B.t = B.b - 20;
      if (B.l > B.r) B.l = B.r = W / 2;
    }
    var pet = { x: -50, y: 300, face: 1 }, flipC = 1, cur = pose(POSE.stand), Tg = pose(POSE.stand), O = {}, Pf = pose();
    var mouth = 0, eyes = 0, wagA = 5, wagS = 5, ph = 0, blinkAt = 2.5, heldBall = false, asleep = false;
    var gen = null, genName = '', cleanups = [], lastB = '', since = { ball: -99, eat: -99, drink: -99, sleep: -20, zoom: -30 };
    var press = null, carrying = false, carry = { x: 0, y: 0, vx: 0 }, lastTap = -9, bag = [];
    var ball = { on: false, x: 0, y: 0, vx: 0, vy: 0, z: 0, vz: 0, rot: 0, drag: false, life: 0, samples: [] };
    function setTg(name, over) { Tg = pose(POSE[name], over); }
    function wag(a, s) { wagA = a; wagS = s; }

    /* ---- effects ---- */
    function fxEl(cls, x, y, html, life) {
      var e = el('div', 'lele-fx ' + cls); e.style.left = f(x) + 'px'; e.style.top = f(y) + 'px';
      if (html) e.innerHTML = html;
      layer.appendChild(e);
      setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, life);
      return e;
    }
    function headPos() {
      var hc = X.hc || [26, -60];
      return { x: pet.x + flipC * hc[0] * S_, y: pet.y + (hc[1] - Pf.jump) * S_ };
    }
    function heart(x, y) { fxEl('lele-heart', x - 8, y - 8, HEART_SVG, 1200).style.setProperty('--dx', f(rand(-20, 20)) + 'px'); }
    function heartUp() { var h = headPos(); heart(h.x + rand(-12, 12) * S_, h.y - 24 * S_); }
    function bubble(txt) {
      var h = headPos(), left = h.x < 86;
      var e = fxEl('lele-bub' + (left ? ' l' : ''), h.x + (left ? 14 : -14) * S_, h.y - 22 * S_, '', 1300), s = el('span'); s.textContent = txt; e.appendChild(s);
    }
    function zzz() { var h = headPos(); fxEl('lele-z', h.x + 8 * S_ * pet.face, h.y - 22 * S_, '', 2450).textContent = 'z'; }
    function crumbs(x, y, water) {
      for (var i = 0; i < 2; i++) { var e = fxEl('lele-crumb' + (water ? ' w' : ''), x + rand(-5, 5), y, '', 520); e.style.setProperty('--dx', f(rand(-16, 16)) + 'px'); e.style.setProperty('--dy', f(rand(-16, -5)) + 'px'); }
    }
    function sparkles(x, y) {
      for (var i = 0; i < 6; i++) { var a = i / 6 * 6.283 + rand(-0.3, 0.3), e = fxEl('lele-spark', x - 6 + Math.cos(a) * 10, y - 6 + Math.sin(a) * 8, SPARK_SVG, 820); e.style.setProperty('--dx', f(Math.cos(a) * 22) + 'px'); e.style.setProperty('--dy', f(Math.sin(a) * 18) + 'px'); }
    }

    /* ---- props ---- */
    function ballDraw() {
      var pad = 9;
      ballEl.style.transform = 'translate3d(' + f(ball.x - BR - pad + 9) + 'px,' + f(ball.y - 2 * BR - ball.z - pad + 9) + 'px,0)';
      ballG.setAttribute('transform', 'rotate(' + f(ball.rot) + ')');
      ballSh.style.transform = 'translateY(' + f(ball.z) + 'px) scale(' + f(clamp(1 - ball.z / 60, 0.4, 1), 3) + ')';
    }
    function spawnBall(x, y) {
      ball.on = true; ball.x = x; ball.y = y; ball.vx = rand(-40, 40); ball.vy = rand(-20, 20); ball.z = 46; ball.vz = 0; ball.life = 0; ball.drag = false;
      ballEl.classList.add('on'); ballDraw();
    }
    function ballOff() { ball.on = false; ball.drag = false; ballEl.classList.remove('on'); }
    function grabBall() { heldBall = true; ballEl.classList.remove('on'); }
    function dropBall() {
      if (!heldBall) return;
      heldBall = false; var h = headPos();
      ball.x = clamp(h.x + pet.face * 6 * S_, 12, W - 12); ball.y = clamp(pet.y + 2, B.t - 26 * S_, B.b); ball.z = Math.max(0, pet.y - h.y - 16 * S_); ball.vz = 40;
      ball.vx = pet.face * 46; ball.vy = 6; ball.on = true; ballEl.classList.add('on'); ballDraw();
    }
    function ballStep() {
      if (!ball.on || heldBall) return;
      if (!ball.drag) {
        ball.vz -= 950 * DT; ball.z += ball.vz * DT;
        if (ball.z <= 0) { ball.z = 0; ball.vz = ball.vz < -70 ? -ball.vz * 0.52 : 0; }
        ball.x += ball.vx * DT; ball.y += ball.vy * DT;
        var k = Math.exp(-(ball.z > 0 ? 0.3 : 1.7) * DT); ball.vx *= k; ball.vy *= k;
        var l = BR + 4, r = W - BR - 4, t = B.t - 26 * S_, b = B.b;
        if (ball.x < l) { ball.x = l; ball.vx = Math.abs(ball.vx) * 0.7; } else if (ball.x > r) { ball.x = r; ball.vx = -Math.abs(ball.vx) * 0.7; }
        if (ball.y < t) { ball.y = t; ball.vy = Math.abs(ball.vy) * 0.7; } else if (ball.y > b) { ball.y = b; ball.vy = -Math.abs(ball.vy) * 0.7; }
        ball.rot += ball.vx * DT / BR * 57.3;
        if (ball.life && T > ball.life) { ballOff(); return; }
      }
      ballDraw();
    }
    function ballDown(e) {
      if (!ball.on) return;
      e.preventDefault(); try { ballEl.setPointerCapture(e.pointerId); } catch (x) { }
      ball.drag = true; ball.life = 0; ball.z = 0; ball.vz = 0; ball.samples = [];
      if (genName !== 'ball') start('ball');
    }
    function ballMove(e) {
      if (!ball.drag) return;
      ball.x = clamp(e.clientX, 8, W - 8); ball.y = clamp(e.clientY + BR, 20, VH - 4);
      ball.samples.push([performance.now(), e.clientX, e.clientY]); if (ball.samples.length > 6) ball.samples.shift();
      if (paused || !raf) ballDraw();
    }
    function ballUp() {
      if (!ball.drag) return;
      ball.drag = false;
      var s = ball.samples, n = s.length, vx = 0, vy = 0;
      if (n > 1) { var a = s[0], b = s[n - 1], dt = (b[0] - a[0]) / 1000; if (dt > 0.008 && performance.now() - b[0] < 120) { vx = (b[1] - a[1]) / dt; vy = (b[2] - a[2]) / dt; } }
      var v = Math.hypot(vx, vy), m = 1500; if (v > m) { vx *= m / v; vy *= m / v; }
      ball.vx = vx; ball.vy = vy; ball.vz = 120 + Math.min(200, v * 0.12);
      ball.y = clamp(ball.y, B.t - 26 * S_, B.b);
      if (genName !== 'ball' && !reduce) start('ball');
    }
    ballEl.addEventListener('pointerdown', ballDown); ballEl.addEventListener('pointermove', ballMove);
    ballEl.addEventListener('pointerup', ballUp); ballEl.addEventListener('pointercancel', ballUp);
    function showBowl(x, y, water) {
      bowlEl.innerHTML = bowlSVG(S_, water); bowlEl.style.transform = 'translate3d(' + f(x - 24 * S_) + 'px,' + f(y - 21 * S_) + 'px,0)';
      void bowlEl.offsetWidth; bowlEl.classList.add('on');
    }
    function bowlLevel(u) { var c = bowlEl.querySelector('[data-c]'); if (c) c.setAttribute('transform', 'translate(0,-9) scale(' + f(1 - 0.5 * u, 3) + ') translate(0,9)'); }
    function hideBowl() { bowlEl.classList.remove('on'); }

    /* ---- movement ---- */
    function gait(du, run2) {
      var s, c;
      if (run2) {
        ph += du * 0.085; s = Math.sin(ph);
        O.fn = -8 + 36 * s; O.ff = -8 + 36 * Math.sin(ph + 0.5); O.hn = 6 + 34 * Math.sin(ph + 2.2); O.hf = 6 + 34 * Math.sin(ph + 2.7);
        O.br = 6 * Math.sin(ph + 1.2); O.jump = 4.5 * Math.max(0, Math.sin(ph + 0.8)); O.earL = 34 + 7 * Math.sin(ph * 2); O.earR = 26 + 7 * Math.sin(ph * 2 + 0.6); O.hy = 1.5 * s;
        Tg.tail = -38; Tg.lx = 0.75; mouth = 1; O.tl = 0.12 * s; wag(6, 10);
      } else {
        ph += du * 0.16; s = Math.sin(ph); c = Math.cos(ph);
        O.hn = 21 * s; O.ff = 19 * s; O.hf = -21 * s; O.fn = -19 * s;
        O.hns = -0.11 * Math.max(0, -c); O.ffs = -0.1 * Math.max(0, -c); O.hfs = -0.11 * Math.max(0, c); O.fns = -0.1 * Math.max(0, c);
        O.by = -1.1 * Math.abs(c); O.hy = 0.9 * Math.sin(ph * 2); O.earL = 4 * Math.sin(ph * 2 + 0.5); O.earR = O.earL; O.br = 1.2 * Math.sin(ph * 2);
        wag(14, 9);
      }
    }
    function moveStep(tx, ty, sp, run2) {
      var dx = tx - pet.x, dy = ty - pet.y, d = Math.hypot(dx, dy);
      if (d < 0.6) return true;
      var st = Math.min(d, sp * S_ * DT);
      pet.x += dx / d * st; pet.y += dy / d * st;
      if (Math.abs(dx) > 3) pet.face = dx > 0 ? 1 : -1;
      gait(st / S_, run2);
      return d - st < 0.6;
    }
    function* hold(sec, fn) { var t = 0; while (t < sec) { if (fn) fn(t, t / sec); t += DT; yield; } }
    function* walkTo(tx, ty, o) {
      o = o || {};
      var guard = 0;
      while (guard++ < 2400) {
        var done = moveStep(tx, ty, o.sp || 42, !!o.run);
        if (o.each) o.each();
        if (done) break;
        yield;
      }
    }
    function pickSpot(o) {
      o = o || {};
      var best = null, bs = -1e9;
      for (var i = 0; i < 8; i++) {
        var x, y, r = Math.random();
        if (o.bottom || r < 0.3) { x = rand(B.l, B.r); y = rand(Math.max(B.t, B.b - 90), B.b); }
        else if (r < 0.55) { x = Math.random() < 0.5 ? rand(B.l, B.l + 44) : rand(B.r - 44, B.r); y = rand(B.t, B.b); }
        else { x = rand(B.l, B.r); y = rand(B.t, B.b); }
        var sc = Math.random() * 1.5, d = Math.hypot(x - pet.x, y - pet.y);
        if (d < (o.far ? 170 : 70)) sc -= 2;
        var e = doc.elementFromPoint(clamp(x, 1, W - 1), clamp(y - 34 * S_, 1, VH - 1));
        if (e && e.closest && e.closest('.card,a,button,input,label,.chip')) sc -= 1.6;
        if (sc > bs) { bs = sc; best = { x: x, y: y }; }
      }
      return best;
    }

    /* ---- behaviours (generators: one yield per frame) ---- */
    var Bh = {};
    Bh.enter = function* () {
      measure();
      pet.x = -40 * S_; pet.y = B.b - rand(4, 50); pet.face = 1;
      yield* walkTo(B.l + rand(26, 90), pet.y, { sp: 64 });
      yield* hold(0.5, function () { setTg('sit'); wag(20, 14); });
      yield* Bh.bark();
      yield* hold(1.2, function (t) { setTg('sit', { lx: 0, hr: t > 0.3 ? 12 : 0 }); wag(20, 14); mouth = 1; });
    };
    Bh.walk = function* () {
      var p = pickSpot();
      yield* walkTo(p.x, p.y, { sp: rand(36, 52) });
      yield* hold(rand(0.5, 1.4), function () { setTg('stand'); });
    };
    Bh.zoom = function* () {
      since.zoom = T;
      yield* hold(0.35, function () { setTg('bow'); wag(30, 22); mouth = 1; });
      var n = 3 + ((Math.random() * 3) | 0);
      for (var i = 0; i < n; i++) { var p = pickSpot({ far: true }); yield* walkTo(p.x, p.y, { sp: 250, run: true }); }
      yield* Bh.pant();
    };
    Bh.sit = function* () {
      var tilt = Math.random() < 0.5 ? -13 : 13, dur = rand(3, 5.2);
      yield* hold(dur, function (t) {
        setTg('sit', { lx: 0, hr: t > 1 && t < 2.5 ? tilt : (t > 3.1 && t < 4.3 ? -tilt * 0.7 : 0) });
        wag(12, 8); if (t > 2.6) { mouth = 1; O.tl = 0.1 * Math.sin(t * 13); }
      });
    };
    Bh.pant = function* () {
      yield* hold(rand(2.2, 3.4), function (t) { setTg('sit', { lx: 0.1 }); mouth = 1; O.tl = 0.16 * Math.sin(t * 15); O.sy = 0.02 * Math.sin(t * 15); O.hy = 0.7 * Math.sin(t * 15); wag(10, 8); });
    };
    Bh.scratch = function* () {
      yield* hold(0.45, function () { setTg('sit'); });
      yield* hold(1.7, function (t) { setTg('scratch'); O.hn = 13 * Math.sin(t * 30); O.hy = 0.8 * Math.sin(t * 30); O.earR = -8 + 6 * Math.sin(t * 30); eyes = 2; wag(3, 6); });
      yield* hold(0.4, function () { setTg('sit'); });
    };
    Bh.shake = function* () {
      yield* hold(0.95, function (t, u) {
        setTg('stand', { lx: 0.1 });
        var w = Math.sin(t * 38), en = Math.sin(u * Math.PI);
        O.hr = 16 * w * en; O.earL = 30 * w * en; O.earR = 30 * w * en; O.br = 2.5 * Math.sin(t * 38 + 1) * en; O.sx = 0.03 * w * en; eyes = 1; wag(20 * en, 38);
      });
      yield* hold(0.3, function () { setTg('stand'); });
    };
    Bh.sniff = function* () {
      var n = 2 + ((Math.random() * 2) | 0);
      for (var i = 0; i < n; i++) {
        var tx = clamp(pet.x + rand(-80, 80) * S_, B.l, B.r), ty = clamp(pet.y + rand(-34, 34) * S_, B.t, B.b);
        yield* walkTo(tx, ty, { sp: 24, each: function () { Tg.hy = 33; Tg.hx = 8; Tg.br = 9; Tg.ly = 1; Tg.fns = 0.87; Tg.ffs = 0.87; O.hy = (O.hy || 0) + 1.2 * Math.sin(T * 13); } });
        yield* hold(rand(0.5, 1.1), function (t) { setTg('eat', { hy: 34 }); O.hy = 1.3 * Math.sin(t * 14); O.hx = 2 * Math.sin(t * 3); });
      }
    };
    Bh.ball = function* () {
      since.ball = T;
      if (!ball.on && !heldBall) { var q = pickSpot({ far: true }); spawnBall(q.x, q.y); }
      cleanups.push(function () { if (heldBall) dropBall(); ball.life = T + 6; });
      var plays = 0;
      while ((ball.on || heldBall) && plays < 5) {
        while (ball.on) {
          var side = pet.x <= ball.x ? -1 : 1, tx = clamp(ball.x + side * 27 * S_, B.l - 24, B.r + 24), ty = clamp(ball.y + 2, B.t, B.b);
          var d = Math.hypot(tx - pet.x, ty - pet.y), sp = Math.hypot(ball.vx, ball.vy);
          if (d < 12 * S_ && sp < 80 && !ball.drag && ball.z < 6) break;
          if (d < 12 * S_) { pet.face = -side; setTg(ball.drag ? 'bow' : 'stand'); wag(30, 22); mouth = 1; if (ball.drag) O.jump = Math.abs(Math.sin(T * 9)) * 5; }
          else moveStep(tx, ty, d > 70 * S_ ? 240 : 120, d > 70 * S_);
          yield;
        }
        if (!ball.on) break;
        pet.face = ball.x >= pet.x ? 1 : -1;
        yield* hold(0.32, function (t, u) { setTg('bow'); O.jump = Math.sin(u * Math.PI) * 12; mouth = 1; wag(30, 22); });
        if (ball.drag || !ball.on) continue;
        if (Math.random() < 0.42 && plays < 3) {
          var a = rand(0, 6.283), v = rand(200, 300) * S_;
          ball.vx = Math.cos(a) * v; ball.vy = Math.sin(a) * v * 0.7; ball.vz = 200; plays++;
          yield* hold(0.3, function () { setTg('bow'); wag(30, 22); mouth = 1; });
          continue;
        }
        grabBall();
        yield* hold(0.4, function () { setTg('stand', { hy: -3 }); wag(26, 18); });
        var p = pickSpot();
        yield* walkTo(p.x, p.y, { sp: 84, each: function () { Tg.hy = -3; wag(24, 16); } });
        yield* hold(0.5, function () { setTg('sit'); wag(18, 12); });
        dropBall();
        yield* hold(1.9, function (t) { setTg('sit', { ly: 0.8, lx: 0.4 }); mouth = 1; O.tl = 0.14 * Math.sin(t * 14); wag(22, 14); });
        plays += 2;
        if (Math.random() < 0.45) break;
      }
    };
    Bh.eat = function* (water) {
      since[water ? 'drink' : 'eat'] = T;
      var p = pickSpot({ bottom: true }), dir = p.x < W / 2 ? 1 : -1, off = 34 * S_;
      var bx = clamp(p.x, B.l + off, B.r - off) + dir * off * 0.5, by = p.y;
      showBowl(bx, by, water); cleanups.push(hideBowl);
      yield* walkTo(bx - dir * off, by - 1, { sp: 96 });
      pet.face = dir;
      yield* hold(0.4, function () { setTg('stand', { ly: 0.8 }); wag(24, 16); });
      var n = 0;
      yield* hold(water ? 3.2 : 4.4, function (t, u) {
        setTg('eat'); var b = Math.abs(Math.sin(t * (water ? 11 : 8.5)));
        O.hy = -4 * b; wag(10, 8);
        if (water) { mouth = 1; O.tl = -0.3 + 0.5 * b; } else { mouth = b > 0.5 ? 1 : 0; O.tl = -0.75; }
        if (t > n * 0.3) { n++; crumbs(bx, by - 15 * S_, water); }
        if (!water) bowlLevel(u);
      });
      yield* hold(1.1, function (t) { setTg('stand', { lx: 0.2 }); mouth = 1; eyes = 2; O.tr = 34 * Math.sin(t * 13); O.tl = -0.25; wag(18, 12); });
      hideBowl();
    };
    Bh.drink = function* () { yield* Bh.eat(true); };
    function* snooze(dur) {
      asleep = true; cleanups.push(function () { asleep = false; });
      var z = 0.6;
      yield* hold(dur, function (t) {
        setTg('sleep'); eyes = 1; wag(0, 1); O.sy = 0.035 * Math.sin(t * 1.7); O.hy = 0.5 * Math.sin(t * 1.7);
        if (t > z) { z = t + 1.5; zzz(); }
      });
      asleep = false;
    }
    function* wake() {
      yield* hold(0.6, function (t) { setTg('lie'); eyes = t < 0.35 ? 1 : 0; wag(0, 1); });
      yield* hold(1.25, function (t, u) { setTg('bow', { hy: 12 }); eyes = 1; mouth = u > 0.2 && u < 0.85 ? 2 : 0; wag(8, 6); });
      yield* hold(0.35, function () { setTg('stand'); });
      yield* Bh.shake();
    }
    Bh.sleep = function* () {
      since.sleep = T;
      var p = pickSpot({ bottom: true });
      yield* walkTo(p.x, p.y, { sp: 34 });
      for (var i = 0; i < 3; i++) { pet.face = -pet.face; yield* walkTo(clamp(pet.x + pet.face * 12 * S_, B.l, B.r), pet.y + (i % 2 ? 2 : -2), { sp: 30 }); }
      yield* hold(0.7, function () { setTg('lie'); wag(4, 5); });
      yield* hold(1.0, function (t, u) { setTg('lie'); eyes = 1; mouth = u > 0.15 && u < 0.85 ? 2 : 0; wag(0, 1); });
      yield* snooze(rand(10, 17));
      yield* wake();
    };
    /* tap reactions */
    Bh.jump = function* () {
      heartUp(); heartUp();
      for (var i = 0; i < 2; i++) {
        if (i) heartUp();
        yield* hold(0.44, function (t, u) {
          var s = Math.sin(u * Math.PI);
          setTg('stand', { hy: -3, lx: 0.2 }); O.jump = 25 * s; O.fn = -30 * s; O.ff = -22 * s; O.hn = 20 * s; O.hf = 14 * s; O.earL = 24 * s; O.earR = -24 * s;
          O.sy = u < 0.1 || u > 0.9 ? -0.08 : 0.04 * s; eyes = 2; mouth = 1; wag(30, 24);
        });
      }
      yield* hold(0.4, function () { setTg('stand'); eyes = 2; mouth = 1; wag(30, 24); });
    };
    Bh.spin = function* () {
      var cx = pet.x, cy = pet.y, R = 13 * S_, t = 0, dur = 1.3, a0 = pet.face > 0 ? Math.PI : 0, dir = pet.face;
      while (t < dur) {
        t += DT;
        var a = a0 + Math.min(1, t / dur) * Math.PI * 4 * dir, nx = cx + (Math.cos(a) - Math.cos(a0)) * R, ny = cy + Math.sin(a) * R * 0.45, dx = nx - pet.x;
        if (Math.abs(dx) > 0.25) pet.face = dx > 0 ? 1 : -1;
        gait(Math.hypot(nx - pet.x, ny - pet.y) / S_ * 1.3, false);
        pet.x = nx; pet.y = ny; mouth = 1; wag(26, 20); O.earL = 16; O.earR = 12;
        yield;
      }
      heartUp();
      yield* hold(0.7, function () { setTg('sit'); eyes = 2; mouth = 1; wag(26, 20); });
    };
    Bh.roll = function* () {
      yield* hold(0.3, function () { setTg('lie'); });
      var h = 0.3;
      yield* hold(2.1, function (t) {
        setTg('roll'); O.hn = 14 * Math.sin(t * 10); O.hf = 14 * Math.sin(t * 10 + 2); O.fn = 12 * Math.sin(t * 9 + 1); O.ff = 12 * Math.sin(t * 9 + 3);
        eyes = 2; mouth = 1; O.tl = 0.1 * Math.sin(t * 12); wag(18, 16);
        if (t > h) { h = t + 0.5; heart(pet.x + rand(-14, 14) * S_, pet.y - 46 * S_); }
      });
      yield* hold(0.5, function () { setTg('lie'); eyes = 2; });
    };
    Bh.lick = function* () {
      var done = false;
      yield* hold(1.2, function (t) {
        setTg('sit', { lx: 0, hy: -5, hx: 3 }); mouth = 1; O.tl = 0.25 + 0.2 * Math.sin(t * 16); O.tr = 14 * Math.sin(t * 16); eyes = 2; wag(26, 18);
        if (!done && t > 0.3) { done = true; var h = headPos(), x = clamp(h.x + pet.face * 34 * S_, 24, W - 24), y = h.y - 2 * S_; fxEl('lele-lick', x - 20, y - 17, LICK_SVG, 1150); heart(x, y - 22); }
      });
    };
    Bh.wag = function* () {
      heartUp();
      yield* hold(1.5, function (t) { setTg('stand', { lx: 0.2 }); O.br = 3 * Math.sin(t * 26); O.hr = 4 * Math.sin(t * 13); eyes = 2; mouth = 1; O.tl = 0.12 * Math.sin(t * 15); wag(38, 26); });
    };
    Bh.paw = function* () {
      yield* hold(0.3, function () { setTg('sit'); wag(16, 12); });
      var h = false;
      yield* hold(1.5, function (t) { setTg('paw'); O.fn = 6 * Math.sin(t * 8); eyes = 2; mouth = 1; wag(22, 16); if (!h && t > 0.4) { h = true; heartUp(); } });
      yield* hold(0.3, function () { setTg('sit'); });
    };
    Bh.bark = function* () {
      var sit = cur.by > 14 && cur.br < -25;
      for (var i = 0; i < 2; i++) {
        bubble(i ? '汪汪!' : '汪!');
        yield* hold(0.26, function (t, u) { setTg(sit ? 'sit' : 'stand', { hy: sit ? -7 : -5, hr: -9, hx: 3 }); O.jump = 3 * Math.sin(u * Math.PI); mouth = 1; O.tl = -0.6; wag(20, 18); });
        yield* hold(0.24, function () { setTg(sit ? 'sit' : 'stand'); wag(20, 18); });
      }
      yield* hold(0.5, function () { setTg(sit ? 'sit' : 'stand'); mouth = 1; wag(20, 18); });
    };
    Bh.grumble = function* () {
      bubble('嗯…');
      if (Math.random() < 0.5) {
        yield* hold(0.5, function (t) { setTg('sleep', { hr: 4 }); eyes = 1; O.hy = -1.5 * Math.sin(t * 6); });
        pet.face = -pet.face;
        yield* snooze(rand(6, 10));
        yield* wake();
      } else {
        yield* hold(0.9, function (t) { setTg('lie', { lx: 0, hr: t > 0.4 ? 10 : 0 }); eyes = t < 0.3 ? 1 : 0; wag(6, 6); });
        yield* wake();
      }
    };
    Bh.dress = function* () {
      acc = (acc + 1) % 3; lsSet(ACC_KEY, String(acc)); applyAcc();
      var h = headPos(); sparkles(h.x, h.y - 12 * S_);
      yield* hold(1.5, function (t) { setTg('sit', { lx: 0, hr: t > 0.5 ? 10 : 0 }); eyes = t < 0.5 ? 0 : 2; mouth = 1; wag(26, 18); });
    };
    Bh.petting = function* () {
      var t = 0, h = 0.3, hand = fxEl('lele-hand', 0, 0, HAND_SVG, 600000);
      cleanups.push(function () { if (hand.parentNode) hand.parentNode.removeChild(hand); });
      while ((press && press.mode === 'pet') || t < 1.7) {
        t += DT;
        setTg('lie', { lx: 0.1, hy: 20 }); eyes = 2; mouth = t > 0.8 ? 1 : 0; O.hy = 1.4 * Math.abs(Math.sin(t * 7.1)); O.sy = -0.03 * Math.abs(Math.sin(t * 7.1)); wag(24, 15);
        var hp = headPos(); hand.style.left = f(hp.x - 17) + 'px'; hand.style.top = f(hp.y - 44 * S_) + 'px';
        if (t > h) { h = t + 0.45; heartUp(); }
        yield;
      }
      if (hand.parentNode) hand.parentNode.removeChild(hand);
      yield* hold(0.7, function () { setTg('lie'); eyes = 2; wag(18, 12); });
    };
    Bh.drop = function* () {
      var y0 = pet.y, y1 = clamp(pet.y + 12 * S_, B.t, B.b), x0 = pet.x, x1 = clamp(pet.x, B.l, B.r);
      yield* hold(0.22, function (t, u) { pet.y = y0 + (y1 - y0) * u * u; pet.x = x0 + (x1 - x0) * u; setTg('stand'); O.jump = 8 * (1 - u); });
      pet.y = y1; pet.x = x1;
      yield* hold(0.3, function (t, u) { setTg('stand'); O.sy = -0.16 * (1 - u); O.sx = 0.1 * (1 - u); });
      yield* Bh.shake();
    };

    function runCleanups() { var c = cleanups; cleanups = []; for (var i = 0; i < c.length; i++) { try { c[i](); } catch (e) { } } }
    function start(name, arg) { runCleanups(); asleep = false; genName = name; gen = Bh[name](arg); }
    function next() {
      var opts = [['walk', 30], ['sit', 13], ['sniff', 9], ['pant', 5], ['scratch', 5], ['shake', 3],
        ['zoom', T - since.zoom > 30 ? 7 : 0], ['ball', T - since.ball > 26 ? 11 : 0], ['eat', T - since.eat > 70 ? 8 : 0],
        ['drink', T - since.drink > 60 ? 5 : 0], ['sleep', T - since.sleep > 80 ? 8 : 0]];
      var tot = 0, i;
      for (i = 0; i < opts.length; i++) { if (opts[i][0] === lastB && opts[i][0] !== 'walk') opts[i][1] = 0; tot += opts[i][1]; }
      var r = Math.random() * tot, name = 'walk';
      for (i = 0; i < opts.length; i++) { r -= opts[i][1]; if (r <= 0) { name = opts[i][0]; break; } }
      lastB = name; start(name);
    }

    /* ---- frame ---- */
    function setVis(name, on) { if (vis[name] !== on) { vis[name] = on; var n = N[name]; if (n) { if (on) n.removeAttribute('display'); else n.setAttribute('display', 'none'); } } }
    function applyAcc() { setVis('hat1', acc === 1); setVis('scarf1', acc === 1); setVis('hat2b', acc === 2); setVis('scarf2', acc === 2); }
    function draw() {
      var k, i;
      for (i = 0; i < CH.length; i++) { k = CH[i]; Pf[k] = cur[k] + (O[k] || 0); }
      Pf.tail += wagA * Math.sin(T * wagS);
      Pf.flip = flipC;
      xf(Pf, X);
      for (i = 0; i < PARTS.length; i++) { k = PARTS[i]; if (X[k] !== lastX[k]) { lastX[k] = X[k]; N[k].setAttribute('transform', X[k]); } }
      var sh = 'translate(' + f(-3 * flipC) + ',0) scale(' + f(clamp(1 - Pf.jump / 70, 0.5, 1) * (Pf.by > 15 ? 1.12 : 1), 3) + ',1)';
      if (sh !== lastX.shadow) { lastX.shadow = sh; N.shadow.setAttribute('transform', sh); }
      setVis('eyes0', eyes === 0); setVis('eyes1', eyes === 1); setVis('eyes2', eyes === 2);
      setVis('mouth0', mouth === 0); setVis('mouth1', mouth === 1); setVis('mouth2', mouth === 2);
      setVis('held', heldBall);
      petEl.style.transform = 'translate3d(' + f(pet.x - OX * S_) + 'px,' + f(pet.y - OY * S_) + 'px,0)';
    }
    function step() {
      Tg = pose(POSE.stand); O = {}; mouth = 0; wagA = 5; wagS = 5;
      if (T > blinkAt + 0.13) blinkAt = T + rand(2, 5);
      eyes = T > blinkAt ? 1 : 0;
      O.sy = 0.012 * Math.sin(T * 2.4);
      if (carrying) {
        var px = pet.x;
        pet.x += (carry.x - pet.x) * Math.min(1, DT * 18); pet.y += (carry.y + 62 * S_ - pet.y) * Math.min(1, DT * 18);
        carry.vx += ((pet.x - px) / Math.max(DT, 0.001) - carry.vx) * Math.min(1, DT * 8);
        var sw = clamp(-carry.vx * 0.05, -22, 22);
        setTg('dangle'); O.rot = sw; O.hn = sw * 0.8 + 5 * Math.sin(T * 6); O.hf = sw * 0.8 + 5 * Math.sin(T * 6 + 1.5); O.fn = sw * 0.6 + 4 * Math.sin(T * 7); O.ff = sw * 0.6 + 4 * Math.sin(T * 7 + 2);
        eyes = 0; wag(8, 10); O.sy = 0;
      } else {
        if (!gen) next();
        var r = gen.next();
        if (r.done) { runCleanups(); gen = null; }
      }
      ballStep();
      var a = 1 - Math.exp(-DT * 11), ar = 1 - Math.exp(-DT * 8);
      for (var i = 0; i < CH.length; i++) { var k = CH[i]; cur[k] += (Tg[k] - cur[k]) * (k === 'rot' ? ar : a); }
      flipC += (pet.face - flipC) * (1 - Math.exp(-DT * 16));
      if (Math.abs(flipC) < 0.1) flipC = 0.1 * pet.face;
      draw();
    }
    function frame(now) {
      raf = 0; if (dead || paused || !shown) return;
      DT = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now; T += DT;
      try { step(); } catch (e) { if (window.console) console.warn('lele pet stopped:', e); dead = true; layer.hidden = true; return; }
      raf = requestAnimationFrame(frame);
    }
    function run() { if (!raf && !dead && !paused && shown && !reduce && !doc.hidden) { last = performance.now(); layer.classList.remove('lele-paused'); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } layer.classList.add('lele-paused'); }

    /* ---- touch: tap / double tap / long press / drag ---- */
    function tap(x, y) {
      var now = performance.now(), dbl = now - lastTap < 330; lastTap = now;
      if (reduce) { var h = headPos(); heart(h.x, h.y - 26 * S_); bubble('汪!'); return; }
      if (dbl) { start('dress'); return; }
      if (asleep) { start('grumble'); return; }
      var name;
      if (heldBall) name = 'wag';
      else if (genName === 'eat' || genName === 'drink') name = 'bark';
      else {
        if (!bag.length) { bag = ['jump', 'lick', 'spin', 'paw', 'bark', 'roll', 'wag', 'shake']; for (var i = bag.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, q = bag[i]; bag[i] = bag[j]; bag[j] = q; } }
        var sitting = cur.by > 14 && cur.br < -25, pi = sitting ? Math.max(bag.indexOf('paw'), bag.indexOf('lick')) : -1;
        name = pi >= 0 ? bag.splice(pi, 1)[0] : bag.pop();
      }
      start(name, { x: x, y: y });
    }
    function pDown(e) {
      if (press) return;
      e.preventDefault(); try { hit.setPointerCapture(e.pointerId); } catch (x) { }
      press = { id: e.pointerId, x: e.clientX, y: e.clientY, mode: '' };
      if (!reduce) press.timer = setTimeout(function () { if (press && !press.mode) { press.mode = 'pet'; start('petting'); } }, 480);
    }
    function pMove(e) {
      if (!press || e.pointerId !== press.id) return;
      if (!press.mode && !reduce && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 9) {
        clearTimeout(press.timer); press.mode = 'drag'; runCleanups(); gen = null; genName = 'carry'; asleep = false; carrying = true; carry.vx = 0;
      }
      if (press.mode === 'drag') { carry.x = clamp(e.clientX, 10, W - 10); carry.y = clamp(e.clientY, 30, VH - 70 * S_); }
    }
    function pUp(e) {
      if (!press || e.pointerId !== press.id) return;
      clearTimeout(press.timer);
      var m = press.mode; press = null;
      if (m === 'drag') { carrying = false; start('drop'); }
      else if (!m && e.type === 'pointerup') tap(e.clientX, e.clientY);
    }
    hit.addEventListener('pointerdown', pDown); hit.addEventListener('pointermove', pMove);
    hit.addEventListener('pointerup', pUp); hit.addEventListener('pointercancel', pUp);
    hit.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    var rt = 0;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (dead) return;
        measure(); pet.x = clamp(pet.x, B.l, B.r); pet.y = clamp(pet.y, B.t, B.b);
        if (ball.on) { ball.x = clamp(ball.x, 12, W - 12); ball.y = clamp(ball.y, B.t - 26 * S_, B.b); }
        if (reduce) { pet.x = B.r - 8 * S_; pet.y = B.b; draw(); }
      }, 150);
    }
    window.addEventListener('resize', onResize);

    /* ---- go ---- */
    measure(); applyAcc(); syncToggle();
    if (reduce) {
      /* reduced motion: he just sits quietly in the corner (still tappable) */
      pet.x = B.r - 8 * S_; pet.y = B.b; pet.face = -1; flipC = -1; cur = pose(POSE.sit, { lx: 0 }); wagA = 0; draw();
    } else {
      start('enter'); pet.x = -40 * S_; pet.y = B.b - 20; draw(); run();
    }
    var api = {
      pause: function () { paused = true; stop(); },
      resume: function () { paused = false; run(); },
      destroy: function () {
        dead = true; stop(); clearTimeout(rt); if (press) clearTimeout(press.timer);
        window.removeEventListener('resize', onResize);
        if (layer.parentNode) layer.parentNode.removeChild(layer);
        if (tog.parentNode) tog.parentNode.removeChild(tog);
        if (window.WeddingThemes.lele.pet === api) window.WeddingThemes.lele.pet = null;
      },
      play: function (name, arg) { if (!dead && !reduce && Bh[name]) { carrying = false; start(name, arg); } },
      state: function () { return { name: genName, x: pet.x, y: pet.y, asleep: asleep, acc: acc, ball: ball.on, held: heldBall, shown: shown }; }
    };
    window.WeddingThemes.lele.pet = api;
    return api;
  }
  var runner = { mount: mount, ground: false, reducedMotion: true };

  window.WeddingThemes = window.WeddingThemes || {};
  window.WeddingThemes['lele'] = {
    id: 'lele',
    name: '樂樂',
    desc: '我們家的樂樂',
    themeColor: '#FFF7EC',
    fonts: [
      'https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@300;400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Sacramento&display=swap'
    ],
    css: css,
    swatch: swatch,
    ornament: ornament,
    lockArt: lockArt,
    cornerMascot: cornerMascot,
    headingIcon: headingIcon,
    particles: particles,
    runner: runner,
    art: art
  };
})();
