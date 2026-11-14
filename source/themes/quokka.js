/* Wedding dashboard theme: Quokka — pencil-crayon ("B 色鉛筆手繪") pair of original quokkas.
   All art is generated here as plain SVG geometry (wobbly double pencil outline + real hatch strokes),
   so it needs no filters / patterns / ids and stays crisp at any size. */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};

  /* ---------- palette (from the approved concept sheet) ---------- */
  var INK = '#5A4A42';      // graphite
  var PAPER = '#FFFCF5';
  var BLUSH = '#F0938C';
  var HEART = '#EE8A86';
  var SAGE = '#9DBF86';
  var GOLD = '#F2BE4A';
  var PAL = {
    groom: { fur: '#C2A088', light: '#F5E6D2', acc: '#6FA39A' },
    bride: { fur: '#D9BC9F', light: '#FBEEDD', acc: '#FFF6EA' }
  };
  function mix(c, t, k) {
    var a = parseInt(c.slice(1), 16), b = parseInt(t.slice(1), 16), o = '#', i, x, y;
    for (i = 16; i >= 0; i -= 8) {
      x = (a >> i) & 255; y = (b >> i) & 255;
      o += ('0' + Math.round(x + (y - x) * k).toString(16)).slice(-2);
    }
    return o;
  }
  function darken(c, k) { return mix(c, '#5A2E12', k); }
  ['groom', 'bride'].forEach(function (r) {
    var P = PAL[r];
    P.inner = '#E2ADA0'; P.nose = '#46342C'; P.far = darken(P.fur, 0.14);
  });

  /* ---------- seeded random + tiny affine ---------- */
  var sd = 1;
  function seed(n) { sd = n >>> 0; }
  function rnd() {
    sd = (sd + 0x6D2B79F5) >>> 0;
    var t = sd;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function R(a, b) { return a + (b - a) * rnd(); }
  function mul(m, o) {
    return [m[0] * o[0] + m[2] * o[1], m[1] * o[0] + m[3] * o[1], m[0] * o[2] + m[2] * o[3], m[1] * o[2] + m[3] * o[3],
      m[0] * o[4] + m[2] * o[5] + m[4], m[1] * o[4] + m[3] * o[5] + m[5]];
  }
  function pt(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  function Tr(x, y) { return [1, 0, 0, 1, x, y]; }
  function Rot(deg) { var r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; }
  function Sc(x, y) { return [x, 0, 0, y == null ? x : y, 0, 0]; }
  function T(x, y, rot, sx, sy) { return mul(mul(Tr(x, y), Rot(rot || 0)), Sc(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy)); }
  function f(v) { return String(Math.round(v * 10) / 10); }

  /* ---------- paths ---------- */
  function ctrl(pts, i, n, closed) {
    var p0 = pts[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)], p1 = pts[i],
      p2 = pts[closed ? (i + 1) % n : i + 1], p3 = pts[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
    return [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]];
  }
  function closedD(pts) {
    var n = pts.length, d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]), i, c;
    for (i = 0; i < n; i++) { c = ctrl(pts, i, n, true); d += 'C' + f(c[0]) + ' ' + f(c[1]) + ' ' + f(c[2]) + ' ' + f(c[3]) + ' ' + f(c[4]) + ' ' + f(c[5]); }
    return d + 'Z';
  }
  function openD(pts) {
    var n = pts.length, d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]), i, c;
    for (i = 0; i < n - 1; i++) { c = ctrl(pts, i, n, false); d += 'C' + f(c[0]) + ' ' + f(c[1]) + ' ' + f(c[2]) + ' ' + f(c[3]) + ' ' + f(c[4]) + ' ' + f(c[5]); }
    return d;
  }
  function polyD(pts) {
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]), i;
    for (i = 1; i < pts.length; i++) d += 'L' + f(pts[i][0]) + ' ' + f(pts[i][1]);
    return d + 'Z';
  }
  function sampleClosed(pts) {
    var n = pts.length, out = [], i, j, c, p, t, u;
    for (i = 0; i < n; i++) {
      c = ctrl(pts, i, n, true); p = pts[i];
      for (j = 1; j <= 4; j++) {
        t = j / 4; u = 1 - t;
        out.push([u * u * u * p[0] + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4],
          u * u * u * p[1] + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5]]);
      }
    }
    return out;
  }

  /* ---------- crayon hatching: real strokes at -38deg that slightly miss the outline ---------- */
  var HA = 38 * Math.PI / 180, HC = Math.cos(HA), HS = Math.sin(HA);
  function hatchD(poly, sp) {
    var n = poly.length, P = [], i, v, vmin = 1e9, vmax = -1e9, d = '', xs, a, b, x0, x1, g;
    for (i = 0; i < n; i++) {
      a = poly[i]; b = [a[0] * HC - a[1] * HS, a[0] * HS + a[1] * HC]; P.push(b);
      if (b[1] < vmin) vmin = b[1]; if (b[1] > vmax) vmax = b[1];
    }
    function emit(u0, u1) {
      var v0 = v + R(-0.14, 0.14) * sp + sp * 0.3, v1 = v + R(-0.14, 0.14) * sp + sp * 0.3;
      u0 += sp * 0.35; u1 += sp * 0.35;
      d += 'M' + f(u0 * HC + v0 * HS) + ' ' + f(-u0 * HS + v0 * HC) + 'L' + f(u1 * HC + v1 * HS) + ' ' + f(-u1 * HS + v1 * HC);
    }
    for (v = vmin + sp * R(0.25, 0.6); v < vmax; v += sp * R(0.84, 1.16)) {
      xs = [];
      for (i = 0; i < n; i++) {
        a = P[i]; b = P[(i + 1) % n];
        if ((a[1] <= v) !== (b[1] <= v)) xs.push(a[0] + (v - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
      }
      xs.sort(function (p, q) { return p - q; });
      for (i = 0; i + 1 < xs.length; i += 2) {
        x0 = xs[i] + R(-0.3, 0.75) * sp; x1 = xs[i + 1] - R(-0.3, 0.75) * sp;
        if (x1 - x0 < sp * 0.5 || rnd() < 0.045) continue;
        if (x1 - x0 > sp * 8 && rnd() < 0.4) { g = R(x0 + sp * 2.5, x1 - sp * 2.5); emit(x0, g - sp * 0.45); emit(g + sp * 0.45, x1); }
        else emit(x0, x1);
      }
    }
    return d;
  }

  /* ---------- drawing style (px values; geometry is always baked to final px) ---------- */
  var Z = { lw: 1.1, sp: 2.1, hw: 1.5, jit: 0.6, dk: 0.6 };
  function withZ(z, fn) { var old = Z, r; Z = z; try { r = fn(); } finally { Z = old; } return r; }
  function dash(arr) { return arr.map(function (v) { return f(v * Z.dk); }).join(' '); }

  /* closed shape: paper + crayon hatch + broken double pencil line */
  function shape(pts, col, o) {
    o = o || {};
    var d = o.poly ? polyD(pts) : closedD(pts);
    var poly = o.poly ? pts : sampleClosed(pts);
    var i, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, s = '', op = o.op == null ? 1 : o.op;
    for (i = 0; i < poly.length; i++) {
      if (poly[i][0] < x0) x0 = poly[i][0]; if (poly[i][0] > x1) x1 = poly[i][0];
      if (poly[i][1] < y0) y0 = poly[i][1]; if (poly[i][1] > y1) y1 = poly[i][1];
    }
    var small = Math.min(x1 - x0, y1 - y0) < Z.sp * 3.2;
    if (o.paper !== false) s += '<path d="' + d + '" fill="' + mix(col, PAPER, small ? 0.14 : 0.5) + '"/>';
    else if (!o.bare) s += '<path d="' + d + '" fill="' + col + '" opacity="' + f((small ? 0.9 : 0.45) * op) + '"/>';
    if (!small || o.bare) {
      s += '<path d="' + hatchD(poly, Z.sp * (o.hs || 1)) + '" fill="none" stroke="' + col + '" stroke-width="' + f(Z.hw * (o.hs || 1) * (o.paper === false ? 1.12 : 1)) +
        '" stroke-linecap="round"' + (op < 1 ? ' opacity="' + op + '"' : '') + '/>';
    }
    if (o.outline !== false) {
      s += '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + f(Z.lw) + '" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="' + dash([90, 5, 46, 7, 130, 4]) + '"/>';
      if (Z.dbl !== false) {
        var d2;
        if (o.poly) d2 = d;
        else { var q = []; for (i = 0; i < pts.length; i++) q.push([pts[i][0] + R(-Z.jit, Z.jit), pts[i][1] + R(-Z.jit, Z.jit)]); d2 = closedD(q); }
        s += '<path d="' + d2 + '" fill="none" stroke="' + INK + '" stroke-width="' + f(Z.lw * 0.72) + '" stroke-linecap="round" opacity=".6" stroke-dasharray="' +
          dash([34, 22, 60, 30]) + '" stroke-dashoffset="' + f(R(0, 40) * Z.dk) + '" transform="translate(' + f(-Z.jit * 0.6) + ' ' + f(Z.jit * 0.7) + ')"/>';
      }
    }
    return s;
  }
  function stroke(pts, w, col, op) {
    return '<path d="' + openD(pts) + '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + f(w || Z.lw) + '" stroke-linecap="round" stroke-linejoin="round"' +
      (op ? ' opacity="' + op + '"' : '') + '/>';
  }
  function line(m, pts, w, col, op) { return stroke(pts.map(function (p) { return pt(m, p[0], p[1]); }), w, col, op); }
  function dot(m, x, y, rx, ry, col) {
    return '<path d="' + closedD(blob(m, x, y, rx, ry || rx, { wob: 0.05, n: 8 })) + '" fill="' + (col || INK) + '" opacity=".94"/>';
  }

  /* ---------- primitive shapes (ported from concepts/gen.py) ---------- */
  function blob(m, cx, cy, rx, ry, o) {
    o = o || {};
    var n = o.n || 12, wob = o.wob == null ? 0.03 : o.wob, egg = o.egg || 0, bend = o.bend || 0, taper = o.taper || 0;
    var mm = mul(mul(m, Tr(cx, cy)), Rot(o.rot || 0)), pts = [], i, t, k, x, y;
    for (i = 0; i < n; i++) {
      t = 2 * Math.PI * i / n + R(-0.06, 0.06); k = 1 + R(-wob, wob);
      x = rx * Math.cos(t) * (1 + egg * Math.sin(t)) * k; y = ry * Math.sin(t) * k * (1 + taper * Math.cos(t));
      x += bend * rx * (y / ry) * (y / ry);
      pts.push(pt(mm, x, y));
    }
    return pts;
  }
  function capsule(m, x1, y1, x2, y2, r1, r2) {
    var a = Math.atan2(y2 - y1, x2 - x1), pts = [], i, t, k;
    for (i = 0; i < 5; i++) { t = a + Math.PI / 2 + Math.PI * i / 4; k = 1 + R(-0.04, 0.04); pts.push(pt(m, x1 + r1 * k * Math.cos(t), y1 + r1 * k * Math.sin(t))); }
    for (i = 0; i < 5; i++) { t = a - Math.PI / 2 + Math.PI * i / 4; k = 1 + R(-0.04, 0.04); pts.push(pt(m, x2 + r2 * k * Math.cos(t), y2 + r2 * k * Math.sin(t))); }
    return pts;
  }
  function tube(m, x1, y1, cx, cy, x2, y2, r1, r2) {
    var L = [], Rr = [], i, t, u, x, y, dx, dy, n, r, s0, e0;
    for (i = 0; i < 7; i++) {
      t = i / 6; u = 1 - t;
      x = u * u * x1 + 2 * u * t * cx + t * t * x2; y = u * u * y1 + 2 * u * t * cy + t * t * y2;
      dx = 2 * u * (cx - x1) + 2 * t * (x2 - cx); dy = 2 * u * (cy - y1) + 2 * t * (y2 - cy); n = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= n; dy /= n; r = r1 + (r2 - r1) * t;
      L.push(pt(m, x - dy * r, y + dx * r)); Rr.push(pt(m, x + dy * r, y - dx * r));
      if (i === 0) s0 = pt(m, x - dx * r * 0.8, y - dy * r * 0.8);
      if (i === 6) e0 = pt(m, x + dx * r, y + dy * r);
    }
    return L.concat([e0], Rr.reverse(), [s0]);
  }
  function quadPts(m, out, p0, p1, p2, n) {
    for (var j = 1; j <= n; j++) { var t = j / n, u = 1 - t; out.push(pt(m, u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])); }
  }
  function cubPts(m, out, p0, p1, p2, p3, n) {
    for (var j = 1; j <= n; j++) {
      var t = j / n, u = 1 - t;
      out.push(pt(m, u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]));
    }
  }

  /* ---------- props (m maps prop units -> px) ---------- */
  function heart(m, col, o) {
    var p = []; cubPts(m, p, [0, 7], [-15, -3], [-9, -15], [0, -6], 9); cubPts(m, p, [0, -6], [8, -15], [16, -4], [0, 7], 9);
    o = o || {}; o.poly = true;
    return shape(p, col || HEART, o);
  }
  function sparkle(m, col) {
    var p = [];
    quadPts(m, p, [0, -11], [1.6, -1.6], [10, 0], 4); quadPts(m, p, [10, 0], [1.6, 1.6], [0, 11], 4);
    quadPts(m, p, [0, 11], [-1.6, 1.6], [-10, 0], 4); quadPts(m, p, [-10, 0], [-1.6, -1.6], [0, -11], 4);
    return shape(p, col || GOLD, { poly: true });
  }
  function leaf(m, col) {
    var p = []; col = col || SAGE;
    quadPts(m, p, [0, 0], [9, -13], [25, -5], 7); quadPts(m, p, [25, -5], [13, 9], [0, 0], 7);
    return shape(p, col, { poly: true }) + line(m, [[3, -1], [11, -4.4], [20, -4]], Z.lw * 0.8, darken(col, 0.3), 0.8);
  }
  function flower(m, x, y, s, pet, ctr) {
    var o = '', i, a;
    for (i = 0; i < 5; i++) {
      a = (72 * i - 82) * Math.PI / 180;
      o += shape(blob(m, x + 5.6 * s * Math.cos(a), y + 5.6 * s * Math.sin(a), 5 * s, 4.4 * s, { rot: 72 * i, n: 8 }), pet || '#FFF6EA');
    }
    return o + dot(m, x, y, 3.2 * s, 3.2 * s, ctr || '#F3C55B');
  }
  function bowtie(m, x, y, col, s) {
    function half(a) { return shape(a.map(function (q) { return pt(m, x + q[0] * s, y + q[1] * s); }), col); }
    return half([[-1, 0], [-12, -7.5], [-14.5, 0], [-12, 7]]) + half([[1, 0], [12, -7], [14.5, 0.5], [12, 7.5]]) +
      shape(blob(m, x, y, 3.8 * s, 4.4 * s, { n: 8 }), darken(col, 0.12));
  }
  function phone(m) {
    var p = [[-8, -12], [-5, -15], [5, -15], [8, -12], [8, 12], [5, 15], [-5, 15], [-8, 12]].map(function (q) { return pt(m, q[0], q[1]); });
    return shape(p, '#8FA9B8', { poly: true }) + dot(m, -3, -9.5, 1.8, 1.8, '#FFFFFF');
  }
  function ground(m, x, y, rx, ry, col, op) {
    return shape(blob(m, x, y, rx, ry, { wob: 0.04 }), col || '#B9A292', { paper: false, bare: true, outline: false, op: op || 0.7 });
  }

  /* ---------- face (quokka: wide dark nose, broad smile, pale chin) ---------- */
  function face(m, P, fx, fy) {
    var side = Math.abs(fx) >= 10, sgn = fx >= 0 ? 1 : -1, ex = 25, ey = -3, er = 4.2, hw = er * 1.3;
    var nx = fx * 1.2, ny = fy + 6, nrx = 8.6, nry = 5.6, my = ny + nry, w = 14;
    var o = { blush: '', open: '', happy: '', shut: '' }, sdv, far, x, y;
    for (sdv = -1; sdv <= 1; sdv += 2) {
      far = side && sdv === sgn;
      x = fx + sdv * ex * (far ? 0.8 : 1); y = fy + ey;
      if (!far) o.blush += shape(blob(m, fx + sdv * 39 * (side ? 0.9 : 1), fy + 12, 9, 5.5, { wob: 0.05, n: 8 }), BLUSH, { paper: false, bare: true, outline: false, op: 0.85, hs: 0.8 });
      o.open += dot(m, x, y, er, er * 1.12);
      o.happy += line(m, [[x - hw, y + 1.5], [x, y - hw * 0.7], [x + hw, y + 1.5]], Z.lw * 1.15);
      o.shut += line(m, [[x - hw * 0.9, y + 0.6], [x, y + 1.6], [x + hw * 0.9, y + 0.6]], Z.lw * 1.1);
    }
    o.nose = dot(m, nx, ny, nrx, nry, P.nose);
    var philtrum = line(m, [[nx, my - 1], [nx, my + 4]], Z.lw * 0.9);
    var smile = line(m, [[nx - w - 1.5, my - 1.5], [nx - w, my + 1.6], [nx - w / 2, my + 4.6], [nx, my + 4.8], [nx + w / 2, my + 4.6], [nx + w, my + 1.6], [nx + w + 1.5, my - 1.5]], Z.lw);
    o.smile = philtrum + smile;
    var mp = [[-w + 3, 3.4], [-w / 2, 4.8], [0, 5], [w / 2, 4.8], [w - 3, 3.4], [w / 2, 10], [0, 12], [-w / 2, 10]].map(function (q) { return pt(m, nx + q[0], my + q[1]); });
    o.mopen = '<path d="' + closedD(mp) + '" fill="#7A4A44"/>' + dot(m, nx, my + 10, 3.6, 2.2, '#E58C86') + philtrum + smile;
    o.munch = line(m, [[nx - 5, my + 4], [nx, my + 6], [nx + 5, my + 4]], Z.lw);
    return o;
  }

  /* head pieces shared by every drawing: ears, skull, pale chin, accessory */
  function headBits(hm, role, fx, fy, o) {
    o = o || {};
    var P = PAL[role], ears = o.ears || [[-37, -35], [37, -35]], r = { ears: [] }, i;
    for (i = 0; i < 2; i++) {
      r.ears.push(shape(blob(hm, ears[i][0], ears[i][1], 12.5, 13, { n: 9 }), P.fur) +
        shape(blob(hm, ears[i][0] * 0.97, ears[i][1] + 1.5, 6.8, 7.2, { n: 8 }), P.inner, { paper: false, outline: false }));
    }
    r.skull = shape(blob(hm, 0, 0, 55, 44, { egg: 0.26 }), P.fur) +
      shape(blob(hm, fx * 1.15, fy + 22, 31, 15.5, { egg: -0.1 }), P.light, { paper: false, outline: false, op: 0.92 });
    if (role === 'groom') { var b = o.bow || [fx * 0.7, 45]; r.acc = bowtie(hm, b[0], b[1], P.acc, 0.95); }
    else {
      var fl = o.flower || [20, -40];
      r.acc = leaf(mul(hm, T(fl[0] + 4, fl[1] + 3, -20, 0.6))) + flower(hm, fl[0], fl[1], 1.05, P.acc);
    }
    return r;
  }

  /* ---------- front-view character (static art). M places concept units; origin = body centre, feet at y~+40 ---------- */
  function frontQuokka(role, M, p) {
    p = p || {};
    var P = PAL[role], hd = p.head || [0, -58, 0], fx = (p.face || [0, 0])[0], fy = (p.face || [0, 0])[1];
    var hm = mul(M, T(hd[0], hd[1], hd[2], 1.06, 1.04)), s = '', i;
    var hb = headBits(hm, role, fx, fy, p), fc = face(hm, P, fx, fy);
    function limb(l) { return shape(capsule(M, l[0], l[1], l[2], l[3], l[4] * 0.82, l[5] * 0.82), P.fur); }
    if (!p.headOnly) {
      s += shape(tube(M, -22, 28, -38, 40, -54, 31, 7, 3.5), P.far);
      s += shape(blob(M, 0, 0, 29, 32.2, { egg: 0.3 }), P.fur);
      s += shape(blob(M, 0, 8, 19.2, 22.5, { egg: 0.2 }), P.light, { paper: false, outline: false });
      s += shape(blob(M, -21, 32, 17, 7.5, { rot: -5 }), P.fur) + shape(blob(M, 21, 32, 17, 7.5, { rot: 5 }), P.fur);
      var limbs = p.limbs || [[-13, -10, -5, 7, 5.5, 5.5], [13, -10, 5, 7, 5.5, 5.5]];
      for (i = 0; i < limbs.length; i++) s += limb(limbs[i]);
    }
    s += hb.ears[0] + hb.ears[1] + hb.skull + fc.blush + (p.eyes === 'happy' ? fc.happy : fc.open) + fc.nose + (p.mouth === 'open' ? fc.mopen : fc.smile) + hb.acc;
    return s;
  }
  function svgOpen(w, h, extra) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" ' + (extra || 'aria-hidden="true"') + '>';
  }

  /* ---------- static art ---------- */
  var lockArt = withZ({ lw: 0.92, sp: 2.1, hw: 1.5, jit: 0.9, dk: 0.62 }, function () {
    seed(4011);
    var k = 0.62, gy = 122, oy = gy - 40.5 * k, s = svgOpen(220, 132, 'role="img" aria-label="一對微笑的小袋鼠"');
    s += withZ({ lw: 1, sp: 2.5, hw: 1.7, jit: 0.6, dk: 0.6 }, function () {
      return shape(blob(T(110, 70, -4), 0, 0, 106, 60, { wob: 0.05 }), '#E3EBD6', { paper: false, bare: true, outline: false, op: 0.9 });
    });
    s += ground(T(0, 0), 110, gy + 1, 84, 4.6);
    s += frontQuokka('groom', T(65, oy, 0, k), { head: [0, -58, 5], face: [4, 0] });
    s += frontQuokka('bride', T(155, oy + 2.4 * k, 0, -k * 0.94, k * 0.94), { head: [0, -58, 6], face: [4, 0], eyes: 'happy' });
    s += heart(T(110, 24, -8, 0.9)) + heart(T(125, 10, 14, 0.5), '#F4ABA5');
    s += sparkle(T(22, 34, 0, 0.5)) + sparkle(T(201, 42, 12, 0.36), '#F4ABA5');
    return s + '</svg>';
  });

  var cornerMascot = withZ({ lw: 0.95, sp: 2.1, hw: 1.5, jit: 0.85, dk: 0.6 }, function () {
    seed(5207);
    var k = 0.6, P = PAL.bride, I = T(0, 0), s = svgOpen(88, 60);
    // nested viewport = clip at the card edge without needing a clipPath id
    s += '<svg x="0" y="0" width="88" height="54" viewBox="0 0 88 54">' + frontQuokka('bride', T(44, 39 + 58 * k, 0, k), { headOnly: true, head: [0, -58, -3], flower: [22, -41] }) + '</svg>';
    function paw(x) {
      return shape(blob(I, x, 52.6, 7.4, 5.6, { n: 10 }), P.fur) + line(I, [[x - 2.4, 53], [x - 2.4, 56.6]], 0.9) + line(I, [[x + 2.4, 53], [x + 2.4, 56.6]], 0.9);
    }
    return s + paw(21) + paw(66) + '</svg>';
  });

  var headingIcon = withZ({ lw: 1.3, sp: 2.5, hw: 1.9, jit: 0.6, dk: 0.5, dbl: false }, function () {
    seed(6101);
    var k = 0.345;
    return svgOpen(44, 44).replace('width="44" height="44"', 'width="28" height="28"') +
      frontQuokka('groom', T(22, 22.5 + 58 * k, 0, k), { headOnly: true, bow: [0, 44] }) + '</svg>';
  });

  var ornament = withZ({ lw: 1, sp: 2, hw: 1.4, jit: 0.4, dk: 0.5, dbl: false }, function () {
    seed(7103);
    var I = T(0, 0);
    return svgOpen(132, 18) +
      line(I, [[6, 9.6], [18, 8.6], [31, 9.5], [44, 8.8]], 1.1, INK, 0.55) + line(I, [[88, 8.9], [101, 9.6], [114, 8.5], [126, 9.3]], 1.1, INK, 0.55) +
      leaf(T(59, 10, 168, 0.5)) + leaf(T(73, 10, 12, 0.5)) + flower(I, 66, 9, 0.62, '#FFF6EA') + '</svg>';
  });

  var swatch = withZ({ lw: 0.9, sp: 2.1, hw: 1.5, jit: 0.7, dk: 0.6 }, function () {
    seed(8105);
    var I = T(0, 0), s = svgOpen(120, 80);
    function box(x, y, w, h, r, col, o) {
      var p = [[x + r, y], [x + w / 2, y + R(-0.5, 0.5)], [x + w - r, y], [x + w, y + r], [x + w + R(-0.4, 0.4), y + h / 2], [x + w, y + h - r], [x + w - r, y + h], [x + w / 2, y + h + R(-0.5, 0.5)], [x + r, y + h], [x, y + h - r], [x + R(-0.4, 0.4), y + h / 2], [x, y + r]];
      return shape(p, col, o);
    }
    s += '<rect width="120" height="80" fill="#FFF6E8"/>';
    s += shape(blob(I, 96, 62, 44, 34, { wob: 0.05 }), '#E3EBD6', { paper: false, bare: true, outline: false, op: 0.9, hs: 1.15 });
    s += '<path d="' + closedD([[12, 11], [40, 10.4], [69, 11], [73, 15], [73.5, 30], [73, 45], [69, 49], [40, 49.6], [12, 49], [8, 45], [7.6, 30], [8, 15]]) + '" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.1" stroke-dasharray="70 4 38 5"/>';
    s += box(15, 18, 30, 8.5, 4, '#EFA875') + box(15, 33, 51, 6.5, 3, '#F3E6D2', { outline: false }) + box(15, 33, 31, 6.5, 3, SAGE);
    s += sparkle(T(88, 16, 0, 0.42)) + leaf(T(10, 68, -35, 0.5)) + flower(I, 30, 66, 0.55, '#FFF6EA');
    s += frontQuokka('bride', T(87, 56 + 58 * 0.5, 0, 0.5), { headOnly: true, head: [0, -58, 4], eyes: 'happy', flower: [22, -41] });
    return s + '</svg>';
  });

  /* ---------- CSS helpers: data-uri pencil frames, wobbly rule, paper grain ---------- */
  function uri(svg) {
    return 'url("data:image/svg+xml,' + svg.replace(/#/g, '%23').replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E') + '")';
  }
  function frame(S, r, sl, op, sd0) {
    seed(sd0);
    // points that sit on the 9-slice cuts are left un-jittered so the repeated edge tiles join up
    var a = 1.4, b = S - 1.4, pts = [], fix = [], j = 0.6, i, t, n = Math.round((S - 2 * sl) / 13), st = (S - 2 * sl) / n;
    function P(x, y, fx) { pts.push(fx ? [x, y] : [x + R(-j, j), y + R(-j, j)]); fix.push(!!fx); }
    function arc(cx, cy, a0) { for (i = 1; i < 3; i++) { t = (a0 + i * 30) * Math.PI / 180; P(cx + r * Math.cos(t), cy + r * Math.sin(t)); } }
    function side(fn) { fn(a + r, 0); for (i = 0; i <= n; i++) fn(sl + i * st, i === 0 || i === n); fn(b - r, 0); }
    side(function (u, fx) { P(u, a, fx); });
    arc(b - r, a + r, -90);
    side(function (u, fx) { P(b, u, fx); });
    arc(b - r, b - r, 0);
    side(function (u, fx) { P(S - u, b, fx); });
    arc(a + r, b - r, 90);
    side(function (u, fx) { P(a, S - u, fx); });
    arc(a + r, a + r, 180);
    var d = closedD(pts), q = pts.map(function (p, k) { return fix[k] ? [p[0], p[1]] : [p[0] + R(-0.8, 0.8), p[1] + R(-0.8, 0.8)]; });
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '">' +
      '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="1.2" stroke-linecap="round" opacity="' + op + '"/>' +
      '<path d="' + closedD(q) + '" fill="none" stroke="' + INK + '" stroke-width=".8" stroke-linecap="round" opacity="' + f(op * 0.5) + '" stroke-dasharray="38 26 64 40"/></svg>');
  }
  var FRAME_CARD = frame(180, 20, 30, 0.8, 9101), FRAME_SOFT = frame(150, 15, 22, 0.5, 9102), FRAME_PILL = frame(170, 25, 30, 0.85, 9103);
  var RULE = (function () {
    seed(9104);
    var p = [], x;
    for (x = 0; x <= 240; x += 20) p.push([x, x === 0 || x === 240 ? 2 : 2 + R(-0.7, 0.7)]);
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="4" viewBox="0 0 240 4"><path d="' + openD(p) + '" fill="none" stroke="' + INK + '" stroke-width="1.2" opacity=".6" stroke-dasharray="120 4 70 6"/></svg>');
  })();
  var GRAIN = uri('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="g" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="11" stitchTiles="stitch"/>' +
    '<feColorMatrix values="0 0 0 0 .5  0 0 0 0 .37  0 0 0 0 .26  .9 0 0 0 -.4"/></filter><rect width="160" height="160" filter="url(#g)"/></svg>');
  var DAISY = withZ({ lw: 1, sp: 2, hw: 1.4, jit: 0.4, dk: 0.5, dbl: false }, function () {
    seed(9105);
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" viewBox="0 0 26 22">' + leaf(T(13, 14, 14, 0.46)) + flower(T(0, 0), 9, 10, 0.72, '#FFF6EA') + '</svg>');
  });

  /* ---------- theme CSS ---------- */
  var S = 'html[data-theme="quokka"]';
  var css = `
${S}{
  --bg1:#FFF9EE; --bg2:#FFF3E2; --bg3:#FDEBD6; --bg4:#F6F1DC;
  --orb1:rgba(247,200,150,.30); --orb2:rgba(170,200,146,.26); --orb3:rgba(250,216,160,.28);
  --text:#5A4A42; --text-soft:#8A776B;
  --accent1:#E08C58; --accent2:#86AD72;
  --card-bg:#FFFCF5;
  --card-border:rgba(90,74,66,.5);
  --card-shadow:2px 3px 0 rgba(90,74,66,.07);
  --card-radius:21px;
  --chip-bg:var(--qk-hatch),#E6EFD8; --chip-text:#52733F;
  --danger:#D4614F;
  --font-body:'Chiron GoRound TC','Zen Maru Gothic','M PLUS Rounded 1c','PingFang TC','Heiti TC','Noto Sans TC','Microsoft JhengHei',system-ui,sans-serif;
  --font-display:'Fredoka','Baloo 2','Chiron GoRound TC','Zen Maru Gothic','PingFang TC',system-ui,sans-serif;
  --font-script:'Caveat','Patrick Hand','Bradley Hand','Segoe Print','Fredoka','Zen Maru Gothic',cursive;
  --script-style:normal; --script-w:700; --body-w:400;
  --qk-ink:#5A4A42; --qk-paper:#FFFCF5; --qk-sage:#9DBF86; --qk-sage-deep:#6F9A5C; --qk-apricot:#EFA875; --qk-apricot-pale:#F9DCC0;
  /* crayon hatching: paper showing through at -38deg, uneven on purpose */
  --qk-hatch:repeating-linear-gradient(-38deg,rgba(255,252,245,0) 0 1.7px,rgba(255,252,245,.5) 1.7px 2.3px,rgba(255,252,245,0) 2.3px 4.3px,rgba(255,252,245,.3) 4.3px 4.7px,rgba(255,252,245,0) 4.7px 6.2px,rgba(255,252,245,.62) 6.2px 6.7px,rgba(255,252,245,0) 6.7px 9.4px,rgba(255,252,245,.38) 9.4px 9.9px);
  --qk-grain:${GRAIN};
  --hair:rgba(90,74,66,.42); --hair-2:rgba(90,74,66,.2); --hair-b:rgba(134,173,114,.6); --mute:rgba(90,74,66,.3);
  --glow:rgba(157,191,134,.32);
  --accent-ink:#B5683A;
  --grad-text:linear-gradient(100deg,#D27D4A 0%,#E59A63 50%,#D27D4A 100%);
  --grad-bar:var(--qk-hatch),linear-gradient(90deg,#8DB678,#A9CB90);
  --grad-deep:var(--qk-hatch),linear-gradient(90deg,#E08C58,#E9A06C);
  --grad-pale:var(--qk-hatch),linear-gradient(90deg,#F6D5B6,#F9E0C8);
  --d-m:#8DB678; --d-f:#EFA875; --d-c:#C9B6A4;
  --g-m:var(--qk-hatch),linear-gradient(90deg,#A9CB90,#8DB678);
  --g-f:var(--qk-hatch),linear-gradient(90deg,#F6C39B,#EFA875);
  --g-c:var(--qk-hatch),linear-gradient(90deg,#DDCFC1,#C9B6A4);
  --track:#FBF1E2; --ring-track:rgba(90,74,66,.12);
  --ring-1:#A9CB90; --ring-2:#8DB678; --ring-3:#6F9A5C;
  --btn:var(--qk-hatch),linear-gradient(100deg,#EFA875,#F3B88A); --btn-ink:#4B3C35; --btn-ts:none; --btn-sh:2px 3px 0 rgba(90,74,66,.16);
  --on:var(--qk-hatch),linear-gradient(100deg,#EFA875,#F3B88A); --on-ink:#4B3C35; --on-ts:none;
  --field:#FFFCF5; --field-f:#FFFEFA;
  --c-gold-bg:var(--qk-hatch),#F9DCC0; --c-gold-ink:#9A562C;
  --c-blush-bg:var(--qk-hatch),#F8D5CF; --c-blush-ink:#A2493F;
  --c-rose-bg:var(--qk-hatch),#DD7A69; --c-rose-ink:#fff;
  --c-mist-bg:var(--qk-hatch),#EDE4D8; --c-mist-ink:#7A685D;
  --alert-bg:#FCE9E2;
  --bar-bg:rgba(255,249,238,.92); --tabbar-bg:#FFF9EE; --sheet-bg:#FFF9EE;
  --soft-bg:#FFF9EE; --soft-shadow:none; --booked-item:#FFFCF5;
  --num-w:600; --head-w:600;
}
${S} body{font-family:var(--font-body);color:var(--text);letter-spacing:.01em}
${S} .bg::after{content:"";position:absolute;inset:0;background-image:var(--qk-grain);background-size:160px 160px;opacity:.8;pointer-events:none}

/* cards: paper with a thin, slightly wobbly, broken double pencil line */
${S} .card,
${S} .lock-card{
  background:var(--qk-grain) 0 0/160px 160px,var(--card-bg);
  border:2px solid transparent;
  border-image:${FRAME_CARD} 30 / 30px / 0 round;
  border-radius:21px;
  box-shadow:var(--card-shadow);
  -webkit-backdrop-filter:none; backdrop-filter:none;
}
${S} .card.soft{
  background:var(--soft-bg);
  border-image:${FRAME_SOFT} 22 / 22px / 0 round;
  border-radius:16px; box-shadow:none;
}
${S} .stat-tile{font-family:var(--font-display)}
${S} .sum .soft{padding-left:10px;padding-right:8px}
${S} .sum .num{font-size:clamp(17px,5.1vw,24px);letter-spacing:0}
${S} .countdown-card{
  position:relative;
  background:
    radial-gradient(130px 84px at 100% 0%,rgba(239,168,117,.20),rgba(239,168,117,0) 70%),
    radial-gradient(120px 84px at 0% 100%,rgba(157,191,134,.24),rgba(157,191,134,0) 70%),
    var(--qk-grain) 0 0/160px 160px,var(--card-bg);
}
${S} .countdown-card::after{
  content:""; position:absolute; left:10px; bottom:6px; width:26px; height:22px; pointer-events:none;
  background:${DAISY} center/contain no-repeat;
}
${S} .countdown-card>div+div::before{background:var(--hair-2)}
${S} .lock-card{border-image-slice:30;border-radius:22px}

${S} .page-title{font-family:var(--font-display);font-weight:600;letter-spacing:.06em;padding-left:.06em;color:var(--text)}
${S} .page-subtitle{color:var(--accent-ink);font-family:var(--font-script);font-size:21px;line-height:1.2}
${S} .gt{animation:none;background-size:100% 100%}
${S} .hero-title,${S} .lock-title{font-family:var(--font-script);font-weight:700;letter-spacing:.01em}
${S} .lock-title{line-height:1.15}
${S} .count-cap,${S} .foot .latin{font-family:var(--font-script);font-size:19px}
${S} .orn::before{background:linear-gradient(90deg,transparent,rgba(90,74,66,.45))}
${S} .orn::after{background:linear-gradient(90deg,rgba(90,74,66,.45),transparent)}
${S} .sub::after{background:${RULE} left center/240px 4px repeat-x;height:4px;opacity:.7}

${S} .topbar{border-bottom:0;background:${RULE} left bottom/240px 4px repeat-x,var(--bar-bg)}
${S} .tabbar{
  background:${RULE} left top/240px 4px repeat-x,var(--tabbar-bg);
  border-top:0; box-shadow:none;
  -webkit-backdrop-filter:none; backdrop-filter:none;
}
${S} .tab{color:var(--text-soft);font-family:var(--font-body);font-weight:500;border-radius:14px;margin:5px 2px 4px;transition:color .2s}
${S} .tab::before{display:none}
${S} .tab.active{
  color:#8A4B25; font-weight:700; text-shadow:none;
  background:var(--qk-hatch),#F9DCC0;
  box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.55);
}
@media (min-width:900px){
  ${S} .tabbar{background:var(--tabbar-bg);border:2px solid transparent;border-image:${FRAME_PILL} 30 / 30px / 0 round;box-shadow:var(--card-shadow)}
  ${S} .tab{margin:0;border-radius:999px}
}

${S} .chip{
  background:var(--chip-bg); color:var(--chip-text);
  box-shadow:inset 0 0 0 1.1px rgba(90,74,66,.42);
  border-radius:999px; font-weight:700;
}

${S} .btn-primary{
  font-family:var(--font-display); font-weight:600; letter-spacing:.3em; padding-left:.3em;
  color:var(--btn-ink); text-shadow:none;
  background:var(--btn); background-size:auto;
  border:2px solid transparent; border-image:${FRAME_PILL} 30 / 30px / 0 round; border-radius:26px;
  box-shadow:var(--btn-sh);
  transition:transform .12s, box-shadow .12s;
}
${S} .btn-primary:active{transform:translate(1px,2px);box-shadow:0 0 0 rgba(90,74,66,.16)}
${S} .field input[type=password]{box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.5)}
${S} .field input[type=password]:focus{box-shadow:inset 0 0 0 1.5px var(--qk-sage-deep),0 0 0 4px var(--glow)}
${S} .remember input{box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.6);border-radius:4px}
${S} .remember input:checked{background:var(--qk-hatch),#8DB678;box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.6)}
${S} .gear.fab{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--qk-paper);box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.5)}

${S} .settings-sheet{
  border-radius:24px 24px 0 0; background:var(--qk-grain) 0 0/160px 160px,var(--sheet-bg);
  -webkit-backdrop-filter:none; backdrop-filter:none;
  box-shadow:0 -1.5px 0 rgba(90,74,66,.55),0 -18px 40px -24px rgba(60,40,26,.4);
}
${S} .sw{background:var(--qk-paper);box-shadow:inset 0 0 0 1.1px rgba(90,74,66,.35)}
${S} .sw[aria-checked="true"]{box-shadow:inset 0 0 0 2px var(--qk-ink)}
${S} .sw-ok{background:var(--qk-sage-deep)}

${S} .progress-bar{background:var(--track);box-shadow:inset 0 0 0 1px rgba(90,74,66,.42)}
${S} .progress-bar i{box-shadow:inset 0 0 0 1px rgba(90,74,66,.38)}
${S} .split i{box-shadow:inset 0 0 0 1px rgba(90,74,66,.38)}
${S} .done .name::before{color:var(--qk-sage-deep)}

${S} .search-input{
  font-family:var(--font-body); color:var(--text);
  background:var(--qk-paper); border:0; border-radius:999px;
  box-shadow:inset 0 0 0 1.2px rgba(90,74,66,.5);
  outline:none; transition:box-shadow .2s;
}
${S} .search-input::placeholder{color:#A8978B}
${S} .search-input:focus{box-shadow:inset 0 0 0 1.5px var(--qk-sage-deep),0 0 0 4px var(--glow)}
`;

  /* ---------- canvas particles: pencil-drawn leaves, daisies, sparkles (pre-rendered sprites) ---------- */
  var TAU = Math.PI * 2;
  var sprites = null;
  function buildSprites() {
    sprites = [];
    var defs = withZ({ lw: 1.3, sp: 2.6, hw: 1.7, jit: 0.5, dk: 0.6, dbl: false }, function () {
      seed(9301);
      var I = T(0, 0);
      return [
        leaf(T(8, 26, -38, 1.0), SAGE), leaf(T(8, 26, -38, 1.0), '#B7CF9C'),
        flower(I, 20, 20, 1.25, '#FFF6EA'), flower(I, 20, 20, 1.25, '#FBDCD3', '#EFA875'),
        sparkle(T(20, 20, 0, 1.25), GOLD), sparkle(T(20, 20, 0, 1.25), '#F6CFA8')
      ];
    });
    defs.forEach(function (inner, i) {
      var sp = { ok: false, cv: null };
      sprites[i] = sp;
      try {
        var img = new Image();
        img.onload = function () {
          try {
            var cv = document.createElement('canvas'); cv.width = 120; cv.height = 120;
            cv.getContext('2d').drawImage(img, 0, 0, 120, 120);
            sp.cv = cv; sp.ok = true;
          } catch (e) { /* stay hidden */ }
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 40 40">' + inner + '</svg>');
      } catch (e) { /* no Image: particles simply stay invisible */ }
    });
  }
  var particles = {
    count: 9,
    spawn: function (w, h) {
      if (!sprites) buildSprites();
      var r = Math.random();
      var type = r < 0.4 ? 0 : (r < 0.7 ? 1 : 2); // 0 leaf, 1 daisy, 2 sparkle
      return {
        type: type,
        spr: type * 2 + (Math.random() < 0.6 ? 0 : 1),
        x: Math.random() * w,
        y: Math.random() * h * (type === 2 ? 0.8 : 0.9) - 20,
        vx: (Math.random() - 0.5) * 8,
        vy: type === 2 ? -2 - Math.random() * 3 : 8 + Math.random() * 8,
        size: type === 2 ? 6 + Math.random() * 4 : (type === 1 ? 8 + Math.random() * 3 : 9 + Math.random() * 4),
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * (type === 0 ? 1.0 : 0.45),
        sway: Math.random() * TAU,
        swaySpeed: 0.6 + Math.random() * 0.7,
        age: 0,
        life: type === 2 ? 3.5 + Math.random() * 3 : 13 + Math.random() * 10
      };
    },
    step: function (p, dt, w, h) {
      p.age += dt;
      p.sway += p.swaySpeed * dt;
      p.rot += p.vr * dt;
      p.x += (p.vx + Math.sin(p.sway) * (p.type === 2 ? 2 : 10)) * dt;
      p.y += p.vy * dt;
      if (p.age >= p.life) return false;
      if (p.y > h + 24 || p.x < -30 || p.x > w + 30) return false;
      return true;
    },
    draw: function (ctx, p) {
      var sp = sprites && sprites[p.spr];
      if (!sp || !sp.ok) return;
      var fadeIn = Math.min(1, p.age / 1.4), fadeOut = Math.min(1, (p.life - p.age) / 1.6);
      var a = Math.max(0, Math.min(fadeIn, fadeOut)), s = p.size;
      if (p.type === 2) a *= 0.55 + 0.45 * Math.sin(p.sway * 3.2);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.type === 2 ? Math.sin(p.sway) * 0.3 : p.rot + (p.type === 0 ? Math.sin(p.sway) * 0.5 : 0));
      ctx.globalAlpha = a * 0.78;
      ctx.drawImage(sp.cv, -s, -s, s * 2, s * 2);
    }
  };

  /* ---------- runner: 3/4-view characters built from separately composited parts ---------- */
  var QW = 62, QH = 68, RK = 0.43, ROX = 28, ROY = QH - 2 - 42 * RK;
  var RHEAD = [17, -47], RFACE = [13, 0];
  function upx(x, y) { return f(ROX + x * RK) + 'px ' + f(ROY + y * RK) + 'px'; }
  function hpx(x, y) { return upx(RHEAD[0] + x * 1.06, RHEAD[1] + y * 1.04); }
  var PSVG = '<svg viewBox="0 0 ' + QW + ' ' + QH + '" width="' + QW + '" height="' + QH + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  function part(cls, inner) { return '<div class="qk-p ' + cls + '">' + PSVG + inner + '</svg></div>'; }
  function runnerHTML(role) {
    return withZ({ lw: 0.85, sp: 1.9, hw: 1.38, jit: 0.62, dk: 0.5 }, function () {
      seed(role === 'bride' ? 2101 : 2203);
      var P = PAL[role], M = T(ROX, ROY, 0, RK), hm = mul(M, T(RHEAD[0], RHEAD[1], 0, 1.06, 1.04));
      var hb = headBits(hm, role, RFACE[0], RFACE[1], { ears: [[-30, -38], [8, -45]], flower: [-12, -43], bow: [8, 42] });
      var fc = face(hm, P, RFACE[0], RFACE[1]);
      var s = '';
      s += part('qk-tail', shape(tube(M, -18, 24, -38, 38, -58, 29, 7.5, 3.5), P.far));
      s += part('qk-foot qk-foot-far', shape(capsule(M, 4, 31, 35, 34.6, 6.6, 4.9), P.far));
      s += part('qk-arm2', shape(capsule(M, 17, -1, 33, 3, 4.5, 4.1), P.far));
      s += part('qk-body', shape(blob(mul(M, Rot(12)), 0, 0, 26.4, 33, { egg: 0.3 }), P.fur) +
        shape(blob(mul(M, Rot(12)), 5, 8, 17.4, 23, { egg: 0.2 }), P.light, { paper: false, outline: false }));
      s += part('qk-foot qk-foot-near', shape(capsule(M, -6, 33.4, 27, 36.6, 7, 5.1), P.fur));
      s += '<div class="qk-p qk-head">' + part('qk-ear qk-ear-l', hb.ears[0]) + part('qk-ear qk-ear-r', hb.ears[1]) +
        part('qk-face', hb.skull + fc.blush +
          '<g class="qk-eyes-open">' + fc.open + '</g><g class="qk-eyes-happy">' + fc.happy + '</g><g class="qk-eyes-shut">' + fc.shut + '</g>' + fc.nose +
          '<g class="qk-m-smile">' + fc.smile + '</g><g class="qk-m-open">' + fc.mopen + '</g><g class="qk-m-munch">' + fc.munch + '</g>' + hb.acc) + '</div>';
      s += part('qk-arm', shape(capsule(M, 11, 2, 27, 8, 4.5, 4.1), P.fur) +
        '<g class="qk-leaf">' + leaf(mul(M, T(25, 9, -62, 1.05))) + '</g><g class="qk-phone">' + phone(mul(M, T(33, 3, 24, 0.82))) + '</g>');
      return s;
    });
  }
  var SHADOW = withZ({ lw: 1, sp: 1.9, hw: 1.3, jit: 0.4, dk: 0.5 }, function () {
    seed(2307);
    return '<svg viewBox="0 0 48 10" width="48" height="10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + ground(T(0, 0), 24, 5, 21, 3.3, '#A8917F', 0.62) + '</svg>';
  });

  var RUNNER_CSS = `
.qk-root{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;overflow:visible;-webkit-user-select:none;user-select:none}
.qk-q{position:absolute;left:0;bottom:0;width:${QW}px;height:${QH}px;pointer-events:auto;cursor:pointer;will-change:transform;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;--qk-p:0}
.qk-q::before{content:"";position:absolute;left:-4px;right:-4px;top:-8px;bottom:-4px}
.qk-shadow{position:absolute;left:7px;bottom:-3px;width:48px;height:10px;transform-origin:50% 50%;will-change:transform}
.qk-shadow svg{display:block}
/* direction flip is instant (no pass through scaleX(0), which used to look paper-thin); a tiny squash sells the turn */
.qk-flip{position:absolute;left:0;top:0;right:0;bottom:0;transform-origin:50% 100%;animation:qk-turn-r .22s cubic-bezier(.3,1.4,.6,1) both}
.qk-q.qk-left .qk-flip{transform:scaleX(-1);animation-name:qk-turn-l}
@keyframes qk-turn-r{0%{transform:scale(.88,1.07)}100%{transform:scale(1,1)}}
@keyframes qk-turn-l{0%{transform:scale(-.88,1.07)}100%{transform:scale(-1,1)}}
.qk-jump{position:absolute;left:0;top:0;right:0;bottom:0;transform-origin:50% 100%;will-change:transform}
.qk-p{position:absolute;left:0;top:0;width:${QW}px;height:${QH}px;will-change:transform}
.qk-p svg{display:block;width:${QW}px;height:${QH}px;overflow:visible}
.qk-tail{transform-origin:${upx(-18, 25)}}
.qk-foot-near{transform-origin:${upx(-4, 33)}}
.qk-foot-far{transform-origin:${upx(6, 31)}}
.qk-head{transform-origin:${upx(12, -12)}}
.qk-ear-l{transform-origin:${hpx(-24, -29)}}
.qk-ear-r{transform-origin:${hpx(6, -35)}}
.qk-arm{transform-origin:${upx(11, 2)}}
.qk-arm2{transform-origin:${upx(17, -1)}}
.qk-eyes-happy,.qk-eyes-shut,.qk-m-open,.qk-m-munch,.qk-leaf,.qk-phone{opacity:0}
.qk-leaf{transform-origin:${upx(26, 8)}}
.qk-blink .qk-eyes-open{opacity:0}
.qk-blink .qk-eyes-shut{opacity:1}
.qk-paused *,.qk-paused *::before,.qk-paused *::after{animation-play-state:paused !important}

/* --- hop: scrubbed by --qk-p (0..1) so the pose always matches the ground travel --- */
.qk-s-hop .qk-jump,.qk-s-hop .qk-shadow,.qk-s-hop .qk-tail,.qk-s-hop .qk-foot,.qk-s-hop .qk-head,.qk-s-hop .qk-ear,.qk-s-hop .qk-arm,.qk-s-hop .qk-arm2{
  animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;animation-play-state:paused;
  animation-delay:calc(var(--qk-p) * -1s)}
.qk-s-hop .qk-jump{animation-name:qk-hop-body}
.qk-s-hop .qk-shadow{animation-name:qk-hop-shadow}
.qk-s-hop .qk-tail{animation-name:qk-hop-tail}
.qk-s-hop .qk-foot-near{animation-name:qk-hop-foot}
.qk-s-hop .qk-foot-far{animation-name:qk-hop-foot2}
.qk-s-hop .qk-head{animation-name:qk-hop-head}
.qk-s-hop .qk-ear{animation-name:qk-hop-ear}
.qk-s-hop .qk-arm{animation-name:qk-hop-arm}
.qk-s-hop .qk-arm2{animation-name:qk-hop-arm2}
.qk-s-hop .qk-m-smile{opacity:0}
.qk-s-hop .qk-m-open{opacity:1}
@keyframes qk-hop-body{
  0%{transform:translateY(0) scale(1.06,.92) rotate(0deg);animation-timing-function:ease-out}
  14%{transform:translateY(0) scale(1.13,.82) rotate(3deg);animation-timing-function:cubic-bezier(.3,0,.5,1)}
  30%{transform:translateY(-8px) scale(.92,1.11) rotate(8deg);animation-timing-function:ease-out}
  52%{transform:translateY(-18px) scale(.98,1.03) rotate(3deg);animation-timing-function:ease-in}
  74%{transform:translateY(-7px) scale(.94,1.07) rotate(-4deg);animation-timing-function:ease-in}
  86%{transform:translateY(0) scale(1.15,.82) rotate(-2deg);animation-timing-function:ease-out}
  100%{transform:translateY(0) scale(1.06,.92) rotate(0deg)}}
@keyframes qk-hop-shadow{
  0%,14%{transform:scale(1.06);opacity:1}
  52%{transform:scale(.62);opacity:.55}
  86%{transform:scale(1.1);opacity:1}
  100%{transform:scale(1.06);opacity:1}}
@keyframes qk-hop-tail{
  0%{transform:rotate(0deg)}14%{transform:rotate(-10deg)}30%{transform:rotate(8deg)}
  52%{transform:rotate(24deg)}74%{transform:rotate(14deg)}86%{transform:rotate(-12deg)}100%{transform:rotate(0deg)}}
@keyframes qk-hop-foot{
  0%,14%{transform:translate(0,0) rotate(0deg)}
  30%{transform:translate(-3px,0) rotate(32deg)}
  52%{transform:translate(1px,-4px) rotate(6deg)}
  74%{transform:translate(4px,-2px) rotate(-20deg)}
  86%,100%{transform:translate(0,0) rotate(0deg)}}
@keyframes qk-hop-foot2{
  0%,14%{transform:translate(0,0) rotate(0deg)}
  30%{transform:translate(-4px,0) rotate(26deg)}
  52%{transform:translate(0,-4px) rotate(10deg)}
  74%{transform:translate(3px,-3px) rotate(-16deg)}
  86%,100%{transform:translate(0,0) rotate(0deg)}}
@keyframes qk-hop-head{
  0%{transform:translateY(.5px) rotate(0deg)}14%{transform:translateY(1.6px) rotate(3deg)}
  30%{transform:translateY(-1px) rotate(-5deg)}52%{transform:translateY(-.5px) rotate(-1deg)}
  74%{transform:translateY(-1px) rotate(3deg)}86%{transform:translateY(2px) rotate(4deg)}100%{transform:translateY(.5px) rotate(0deg)}}
@keyframes qk-hop-ear{
  0%{transform:rotate(0deg)}14%{transform:rotate(8deg)}30%{transform:rotate(-18deg)}52%{transform:rotate(-6deg)}
  74%{transform:rotate(-12deg)}86%{transform:rotate(16deg)}100%{transform:rotate(0deg)}}
@keyframes qk-hop-arm{
  0%{transform:rotate(0deg)}14%{transform:rotate(12deg)}30%{transform:rotate(-34deg)}52%{transform:rotate(-48deg)}
  74%{transform:rotate(-24deg)}86%{transform:rotate(14deg)}100%{transform:rotate(0deg)}}
@keyframes qk-hop-arm2{
  0%{transform:rotate(0deg)}14%{transform:rotate(10deg)}30%{transform:rotate(-26deg)}52%{transform:rotate(-38deg)}
  74%{transform:rotate(-18deg)}86%{transform:rotate(10deg)}100%{transform:rotate(0deg)}}

/* --- idle --- */
.qk-s-idle .qk-jump{animation:qk-breathe 1.7s ease-in-out infinite}
.qk-s-idle .qk-ear-r{animation:qk-twitch 3.1s ease-in-out infinite}
.qk-s-idle .qk-tail{animation:qk-wag 1.7s ease-in-out infinite}
@keyframes qk-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.025,.972)}}
@keyframes qk-twitch{0%,82%,100%{transform:rotate(0deg)}86%{transform:rotate(14deg)}90%{transform:rotate(-4deg)}94%{transform:rotate(10deg)}}
@keyframes qk-wag{0%,100%{transform:rotate(0deg)}50%{transform:rotate(10deg)}}

/* --- sit --- */
.qk-s-sit .qk-jump{animation:qk-sit 2.4s ease-in-out both}
.qk-s-sit .qk-foot-near{animation:qk-sit-foot 2.4s ease-in-out both}
.qk-s-sit .qk-foot-far{animation:qk-sit-foot2 2.4s ease-in-out both}
.qk-s-sit .qk-head{animation:qk-sit-head 2.4s ease-in-out both}
.qk-s-sit .qk-ear-l{animation:qk-twitch 1.2s ease-in-out infinite}
.qk-s-sit .qk-tail{animation:qk-wag .8s ease-in-out infinite}
.qk-s-sit .qk-eyes-open{animation:qk-sit-eyes 2.4s both}
.qk-s-sit .qk-eyes-happy{animation:qk-sit-eyes2 2.4s both}
@keyframes qk-sit{
  0%{transform:translateY(0) scale(1,1)}
  12%{transform:translateY(1px) scale(1.1,.88)}
  22%,86%{transform:translateY(1px) scale(1.06,.93)}
  50%{transform:translateY(1px) scale(1.08,.91)}
  94%{transform:translateY(0) scale(.97,1.04)}
  100%{transform:translateY(0) scale(1,1)}}
@keyframes qk-sit-foot{0%,100%{transform:none}14%,88%{transform:translate(4px,0) rotate(-5deg)}}
@keyframes qk-sit-foot2{0%,100%{transform:none}14%,88%{transform:translate(4px,0) rotate(-8deg)}}
@keyframes qk-sit-head{0%,100%{transform:none}25%{transform:rotate(-6deg)}55%{transform:rotate(5deg)}80%{transform:rotate(-3deg)}}
@keyframes qk-sit-eyes{0%,30%,62%,100%{opacity:1}34%,58%{opacity:0}}
@keyframes qk-sit-eyes2{0%,30%,62%,100%{opacity:0}34%,58%{opacity:1}}

/* --- wave --- */
.qk-s-wave .qk-jump{animation:qk-wave-body 1.9s ease-in-out both}
.qk-s-wave .qk-arm{animation:qk-wave-arm 1.9s ease-in-out both}
.qk-s-wave .qk-head{animation:qk-wave-head 1.9s ease-in-out both}
.qk-s-wave .qk-eyes-open,.qk-s-wave .qk-m-smile{opacity:0}
.qk-s-wave .qk-eyes-happy,.qk-s-wave .qk-m-open{opacity:1}
@keyframes qk-wave-body{0%,100%{transform:none}10%{transform:scale(1.06,.93)}20%,85%{transform:scale(.98,1.03) rotate(-3deg)}}
@keyframes qk-wave-arm{
  0%,100%{transform:rotate(0deg)}
  16%{transform:translate(8px,-1px) rotate(-78deg)}
  28%{transform:translate(8px,-1px) rotate(-44deg)}
  40%{transform:translate(8px,-1px) rotate(-82deg)}
  52%{transform:translate(8px,-1px) rotate(-44deg)}
  64%{transform:translate(8px,-1px) rotate(-82deg)}
  76%{transform:translate(8px,-1px) rotate(-48deg)}
  86%{transform:translate(8px,-1px) rotate(-76deg)}}
@keyframes qk-wave-head{0%,100%{transform:none}20%,85%{transform:rotate(-6deg)}}

/* --- munch a leaf --- */
.qk-s-munch .qk-jump{animation:qk-sit 2.7s ease-in-out both}
.qk-s-munch .qk-foot-near{animation:qk-sit-foot 2.7s ease-in-out both}
.qk-s-munch .qk-foot-far{animation:qk-sit-foot2 2.7s ease-in-out both}
.qk-s-munch .qk-arm{animation:qk-munch-arm 2.7s ease-in-out both}
.qk-s-munch .qk-arm2{animation:qk-munch-arm2 2.7s ease-in-out both}
.qk-s-munch .qk-leaf{animation:qk-munch-leaf 2.7s linear both}
.qk-s-munch .qk-head{animation:qk-munch-head .34s ease-in-out .5s 5}
.qk-s-munch .qk-ear{animation:qk-munch-ear .34s ease-in-out .5s 5}
.qk-s-munch .qk-eyes-open,.qk-s-munch .qk-m-smile{opacity:0}
.qk-s-munch .qk-eyes-happy,.qk-s-munch .qk-m-munch{opacity:1}
@keyframes qk-munch-arm{0%,100%{transform:none}14%,84%{transform:translate(4.5px,-5px) rotate(-76deg)}49%{transform:translate(4.5px,-5.6px) rotate(-82deg)}}
@keyframes qk-munch-arm2{0%,100%{transform:none}14%,84%{transform:translate(1px,-4px) rotate(-70deg)}}
@keyframes qk-munch-leaf{0%,6%{opacity:0;transform:scale(1)}12%,30%{opacity:1;transform:scale(1)}50%{opacity:1;transform:scale(.8)}66%{opacity:1;transform:scale(.6)}76%{opacity:1;transform:scale(.4)}84%,100%{opacity:0;transform:scale(.3)}}
@keyframes qk-munch-head{0%,100%{transform:none}50%{transform:translateY(1.2px) scale(1.03,.97)}}
@keyframes qk-munch-ear{0%,100%{transform:rotate(0deg)}50%{transform:rotate(6deg)}}

/* --- selfie smile --- */
.qk-s-selfie .qk-jump{animation:qk-selfie-body 2.2s ease-in-out both}
.qk-s-selfie .qk-head{animation:qk-selfie-head 2.2s ease-in-out both}
.qk-s-selfie .qk-arm{animation:qk-selfie-arm 2.2s ease-in-out both}
.qk-s-selfie .qk-phone{animation:qk-selfie-phone 2.2s linear both}
.qk-s-selfie .qk-ear{animation:qk-twitch 1.1s ease-in-out infinite}
.qk-s-selfie .qk-eyes-open{animation:qk-selfie-eyes 2.2s both}
.qk-s-selfie .qk-eyes-happy{animation:qk-selfie-eyes2 2.2s both}
.qk-s-selfie .qk-m-smile{opacity:0}
.qk-s-selfie .qk-m-open{opacity:1}
@keyframes qk-selfie-body{0%,100%{transform:none}10%{transform:scale(1.08,.9)}22%,86%{transform:scale(.97,1.04) rotate(-2deg)}40%{transform:scale(.99,1.02) rotate(-2deg)}}
@keyframes qk-selfie-head{0%,100%{transform:none}22%,86%{transform:rotate(7deg) translateY(-.6px)}}
@keyframes qk-selfie-arm{0%,100%{transform:none}22%,86%{transform:translate(15px,0) rotate(-24deg)}55%{transform:translate(15px,-1px) rotate(-28deg)}}
@keyframes qk-selfie-phone{0%,8%,94%,100%{opacity:0}16%,88%{opacity:1}}
@keyframes qk-selfie-eyes{0%,26%,90%,100%{opacity:1}30%,86%{opacity:0}}
@keyframes qk-selfie-eyes2{0%,26%,90%,100%{opacity:0}30%,86%{opacity:1}}

/* --- look at each other --- */
.qk-s-love .qk-jump{animation:qk-love-body 2.4s ease-in-out both}
.qk-s-love .qk-head{animation:qk-love-head 2.4s ease-in-out both}
.qk-s-love .qk-tail{animation:qk-wag .5s ease-in-out infinite}
.qk-s-love .qk-arm{animation:qk-love-arm 2.4s ease-in-out both}
.qk-s-love .qk-eyes-open{animation:qk-selfie-eyes 2.4s both}
.qk-s-love .qk-eyes-happy{animation:qk-selfie-eyes2 2.4s both}
@keyframes qk-love-body{0%,100%{transform:none}8%{transform:scale(1.06,.93)}
  30%{transform:translateY(-4px) rotate(4deg)}40%{transform:translateY(0) scale(1.05,.95) rotate(4deg)}
  52%{transform:translateY(-4px) rotate(4deg)}62%,88%{transform:translateY(0) rotate(4deg)}}
@keyframes qk-love-head{0%,100%{transform:none}25%,88%{transform:rotate(6deg)}}
@keyframes qk-love-arm{0%,100%{transform:none}25%,88%{transform:translate(2px,-2px) rotate(-38deg)}}

/* --- tap: big happy hop --- */
.qk-s-joy{z-index:3}
.qk-s-joy .qk-jump{animation:qk-joy-body .95s both}
.qk-s-joy .qk-shadow{animation:qk-joy-shadow .95s both}
.qk-s-joy .qk-arm{animation:qk-joy-arm .95s both}
.qk-s-joy .qk-arm2{animation:qk-joy-arm2 .95s both}
.qk-s-joy .qk-foot-near{animation:qk-joy-foot .95s both}
.qk-s-joy .qk-foot-far{animation:qk-joy-foot .95s both}
.qk-s-joy .qk-ear{animation:qk-joy-ear .95s both}
.qk-s-joy .qk-tail{animation:qk-wag .24s ease-in-out infinite}
.qk-s-joy .qk-eyes-open,.qk-s-joy .qk-m-smile{opacity:0}
.qk-s-joy .qk-eyes-happy,.qk-s-joy .qk-m-open{opacity:1}
@keyframes qk-joy-body{
  0%{transform:translateY(0) scale(1,1);animation-timing-function:ease-out}
  14%{transform:translateY(0) scale(1.2,.74);animation-timing-function:cubic-bezier(.2,.7,.4,1)}
  46%{transform:translateY(-36px) scale(.92,1.1) rotate(-6deg);animation-timing-function:cubic-bezier(.6,0,.9,.5)}
  72%{transform:translateY(0) scale(1.2,.76) rotate(0deg);animation-timing-function:ease-out}
  84%{transform:translateY(-6px) scale(.96,1.05)}
  93%{transform:translateY(0) scale(1.06,.94)}
  100%{transform:translateY(0) scale(1,1)}}
@keyframes qk-joy-shadow{0%,14%,72%,100%{transform:scale(1.08);opacity:1}46%{transform:scale(.45);opacity:.4}}
@keyframes qk-joy-arm{0%,100%{transform:none}22%,62%{transform:translate(9px,-2px) rotate(-84deg)}76%{transform:rotate(10deg)}}
@keyframes qk-joy-arm2{0%,100%{transform:rotate(0deg)}22%,62%{transform:translate(6px,0) rotate(-60deg)}76%{transform:rotate(0deg)}}
@keyframes qk-joy-foot{0%,14%,72%,100%{transform:none}40%,52%{transform:translate(1px,-3px) rotate(14deg)}}
@keyframes qk-joy-ear{0%,100%{transform:rotate(0deg)}14%{transform:rotate(10deg)}35%{transform:rotate(-20deg)}60%{transform:rotate(-12deg)}74%{transform:rotate(18deg)}86%{transform:rotate(-6deg)}}

/* --- emotes and bursts --- */
.qk-emote{position:absolute;left:0;bottom:0;width:22px;height:22px;margin-left:-11px;pointer-events:none;z-index:4}
.qk-emote svg{display:block;width:100%;height:100%;overflow:visible}
.qk-emote-in{width:100%;height:100%;animation:qk-emote-pop 1.5s cubic-bezier(.3,1.5,.5,1) both}
.qk-emote-heart .qk-emote-in{animation:qk-emote-heart 1.9s ease-out both}
.qk-emote-flash .qk-emote-in{animation:qk-emote-flash .5s ease-out both}
@keyframes qk-emote-pop{
  0%{transform:scale(0) rotate(-40deg);opacity:0}
  22%{transform:scale(1.25) rotate(10deg);opacity:1}
  40%{transform:scale(.9) rotate(0deg)}55%{transform:scale(1.1) rotate(8deg)}
  80%{transform:scale(1) rotate(0deg);opacity:1}
  100%{transform:scale(.4) rotate(30deg);opacity:0}}
@keyframes qk-emote-heart{
  0%{transform:translateY(8px) scale(0);opacity:0}
  18%{transform:translateY(0) scale(1.3);opacity:1}
  30%{transform:translateY(-2px) scale(.95)}42%{transform:translateY(-4px) scale(1.12)}
  54%{transform:translateY(-6px) scale(1)}
  100%{transform:translateY(-22px) scale(.9);opacity:0}}
@keyframes qk-emote-flash{0%{transform:scale(.2);opacity:.9}100%{transform:scale(2.4);opacity:0}}
.qk-bit{position:absolute;left:0;bottom:0;width:15px;height:15px;margin-left:-7px;pointer-events:none;z-index:4;
  animation:qk-bit-fly .95s cubic-bezier(.15,.7,.3,1) both}
.qk-bit svg{display:block;width:100%;height:100%;overflow:visible;animation:qk-bit-fall .95s cubic-bezier(.6,0,.9,.6) both}
@keyframes qk-bit-fly{
  0%{transform:translate(0,0) scale(.2) rotate(0deg);opacity:0}
  15%{opacity:1}
  70%{opacity:1}
  100%{transform:translate(var(--qk-dx),var(--qk-dy)) scale(var(--qk-sc)) rotate(var(--qk-rot));opacity:0}}
@keyframes qk-bit-fall{0%{transform:translateY(0)}100%{transform:translateY(22px)}}
`;

  var EMOTE = withZ({ lw: 1.1, sp: 1.9, hw: 1.35, jit: 0.4, dk: 0.5, dbl: false }, function () {
    seed(3301);
    var V = '<svg viewBox="-11 -11 22 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">', I = T(0, 0);
    return {
      heart: V + heart(T(0, 1.5, -6, 0.72)) + '</svg>',
      sparkle: V + sparkle(T(-1, 1, 0, 0.72)) + sparkle(T(7, -7, 0, 0.3), '#F6CFA8') + '</svg>',
      flash: V + '<circle r="8" fill="#FFFBEA"/>' + line(I, [[-8, -1], [-5.6, -5.8], [-0.6, -8], [5, -6.2], [8, -0.6], [6, 5.4], [0.4, 8], [-5.4, 6], [-8, -1]], 1.1, GOLD) + '</svg>',
      flower: V + flower(I, 0, 0, 0.82, '#FFF6EA') + '</svg>',
      flowerPink: V + flower(I, 0, 0, 0.82, '#FBD5CD', '#EFA875') + '</svg>',
      heartSmall: V + heart(T(0, 1.5, 8, 0.62)) + '</svg>',
      leaf: V + leaf(T(-8, 3, -20, 0.7)) + '</svg>',
      note: V + sparkle(T(0, 0, 0, 0.62), '#F6CFA8') + '</svg>',
      wave: V + line(I, [[1, 5], [-3, 0], [-1, -6]], 1.1, INK, 0.75) + line(I, [[-4, 7], [-9, 0.5], [-6, -8]], 1.1, INK, 0.75) + '</svg>'
    };
  });

  var HOP_T = 0.6;        // seconds per hop
  var HOP_LEN = 34;       // px travelled per hop
  var AIR_A = 0.14, AIR_B = 0.86;
  var GAP = 66;           // following distance
  var ACT_DUR = { sit: 2.4, selfie: 2.2, munch: 2.7, wave: 1.9, love: 2.4 };
  var ACTS = ['selfie', 'love', 'munch', 'wave', 'sit'];
  var PARTS = { bride: runnerHTML('bride'), groom: runnerHTML('groom') };

  function mountRunner(layer) {
    var doc = layer.ownerDocument || document;
    var win = doc.defaultView || window;
    var style = doc.getElementById('qk-runner-style');
    var ownStyle = false;
    if (!style) {
      style = doc.createElement('style');
      style.id = 'qk-runner-style';
      style.textContent = RUNNER_CSS;
      doc.head.appendChild(style);
      ownStyle = true;
    }
    var root = doc.createElement('div');
    root.className = 'qk-root';
    layer.appendChild(root);

    var W = layer.clientWidth || win.innerWidth || 390;
    var timers = [];
    var raf = 0, last = 0, running = false, dead = false;

    function later(fn, ms) {
      var id = win.setTimeout(function () {
        var i = timers.indexOf(id);
        if (i >= 0) timers.splice(i, 1);
        if (!dead) fn();
      }, ms);
      timers.push(id);
      return id;
    }

    function make(kind, x, dir) {
      var el = doc.createElement('div');
      el.innerHTML = '<div class="qk-shadow">' + SHADOW + '</div><div class="qk-flip"><div class="qk-jump">' + PARTS[kind] + '</div></div>';
      var c = { kind: kind, el: el, x: x, dir: dir, state: '', phase: 0, t: 0, dur: 0, next: null, turnTo: 0, savedDir: 0, lastX: null, lastDir: 0,
        blink: false, blinkIn: 1.5 + Math.random() * 3 };
      c.onTap = function (e) { if (e && e.preventDefault) e.preventDefault(); tap(c); };
      el.addEventListener('pointerdown', c.onTap);
      root.appendChild(el);
      return c;
    }

    var minX = 4, maxX = Math.max(minX + 40, W - QW - 4);
    var startX = Math.min(maxX, Math.max(minX + GAP, W * 0.3));
    var chars = [make('bride', startX, 1), make('groom', startX - GAP, 1)];
    var lead = 0;
    var actTimer = 2.6 + Math.random() * 1.5;
    var bag = [];

    function cls(c) {
      c.el.className = 'qk-q qk-' + c.kind + ' qk-s-' + c.state + (c.dir < 0 ? ' qk-left' : '') + (c.blink ? ' qk-blink' : '');
    }
    function setState(c, s, dur) {
      c.state = s; c.t = 0; c.dur = dur || 0;
      if (s === 'hop') c.phase = 0;
      c.blink = false;
      cls(c);
      if (s === 'hop') c.el.style.setProperty('--qk-p', '0');
    }
    function face(c, dir) {
      if (!dir || c.dir === dir) return;
      c.dir = dir;
      cls(c);
    }
    function place(c) {
      if (c.x !== c.lastX) {
        c.el.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,0,0)';
        c.lastX = c.x;
      }
    }
    function emote(type, x, bottom, cls2, life) {
      var e = doc.createElement('div');
      e.className = 'qk-emote ' + (cls2 || '');
      e.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (-bottom).toFixed(1) + 'px,0)';
      e.innerHTML = '<div class="qk-emote-in">' + EMOTE[type] + '</div>';
      root.appendChild(e);
      later(function () { if (e.parentNode) e.parentNode.removeChild(e); }, life || 1600);
    }
    function burst(c) {
      var kinds = ['flower', 'heartSmall', 'flowerPink', 'heartSmall', 'flower', 'note', 'flowerPink', 'heartSmall', 'leaf'];
      var n = kinds.length, i, b, a, d;
      var cx = c.x + QW / 2;
      for (i = 0; i < n; i++) {
        a = Math.PI * (0.08 + 0.84 * (i + Math.random() * 0.6) / n);
        d = 34 + Math.random() * 26;
        b = doc.createElement('div');
        b.className = 'qk-bit';
        b.style.left = cx.toFixed(1) + 'px';
        b.style.bottom = '40px';
        b.style.setProperty('--qk-dx', (Math.cos(a) * d).toFixed(1) + 'px');
        b.style.setProperty('--qk-dy', (-Math.sin(a) * d - 10).toFixed(1) + 'px');
        b.style.setProperty('--qk-sc', (0.8 + Math.random() * 0.6).toFixed(2));
        b.style.setProperty('--qk-rot', ((Math.random() - 0.5) * 240).toFixed(0) + 'deg');
        b.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
        b.innerHTML = EMOTE[kinds[i]];
        root.appendChild(b);
        (function (node) { later(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1150); })(b);
      }
    }
    function tap(c) {
      if (dead || c.state === 'joy') return;
      if (c.savedDir) { face(c, c.savedDir); c.savedDir = 0; }
      c.next = null;
      setState(c, 'joy', 0.95);
      burst(c);
    }

    function pickAct() {
      if (!bag.length) {
        bag = ACTS.slice();
        for (var i = bag.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1)), tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
        }
      }
      return bag.pop();
    }
    function isAct(s) { return s === 'sit' || s === 'selfie' || s === 'munch' || s === 'wave' || s === 'love'; }

    function startAct(c, act, dur) {
      var other = chars[c === chars[0] ? 1 : 0];
      var cx = c.x + QW / 2;
      if (act === 'love') {
        c.savedDir = c.dir;
        face(c, other.x >= c.x ? 1 : -1);
      }
      setState(c, act, dur || ACT_DUR[act]);
      if (act === 'selfie' && c === chars[lead]) {
        later(function () { if (c.state === 'selfie') { emote('flash', cx + c.dir * 33, 24, 'qk-emote-flash', 560); } }, 620);
        later(function () { if (c.state === 'selfie') { emote('sparkle', cx + c.dir * 36, 40, '', 1500); } }, 700);
      }
      if (act === 'love' && c === chars[lead]) {
        later(function () {
          if (c.state !== 'love') return;
          var near = Math.abs(other.x - c.x) < 130;
          emote('heart', near ? (c.x + other.x) / 2 + QW / 2 : cx, 66, 'qk-emote-heart', 1950);
        }, 650);
      }
      if (act === 'wave') {
        later(function () { if (c.state === 'wave') emote('wave', cx + c.dir * 38, 32, '', 1300); }, 420);
      }
    }
    function endAct(c) {
      if (c.savedDir) { face(c, c.savedDir); c.savedDir = 0; }
    }

    function followerThink(c, landed) {
      var L = chars[lead];
      var acting = isAct(L.state) || L.state === 'joy';
      var gap = acting ? 56 : GAP;
      var tx = L.x - L.dir * gap;
      if (L.state === 'love') tx = L.x + L.dir * 60;      // leader turned round to look at us
      tx = Math.max(minX, Math.min(maxX, tx));
      var dx = tx - c.x;
      var tol = c.state === 'hop' ? 12 : 26;
      if (Math.abs(dx) > tol) {
        if (c.state !== 'hop') { face(c, dx > 0 ? 1 : -1); setState(c, 'hop'); }
        else if (landed) face(c, dx > 0 ? 1 : -1);
        return;
      }
      // close enough
      if (isAct(L.state)) {
        var remain = L.dur - L.t;
        if (remain > 1.2 && (c.state === 'hop' || c.state === 'idle')) {
          var act = L.state;
          if (act === 'munch' && Math.random() < 0.5) act = 'sit';
          if (act === 'love') face(c, L.x >= c.x ? 1 : -1); else face(c, L.dir);
          var d = Math.min(ACT_DUR[act], remain + 0.15);
          if (act === 'love') { c.savedDir = 0; setState(c, 'love', d); }
          else startAct(c, act, d);
          return;
        }
      }
      if (c.state === 'hop') {
        face(c, L.x + (L.state === 'love' ? 0 : L.dir) >= c.x ? 1 : -1);
        setState(c, 'idle');
      }
    }

    function leaderLanded(c) {
      if (c.turnTo) { face(c, c.turnTo); c.turnTo = 0; }
      if (c.next) { var a = c.next; c.next = null; startAct(c, a); return; }
      var atEdge = (c.dir > 0 && c.x >= maxX - 1) || (c.dir < 0 && c.x <= minX + 1);
      if (atEdge) {
        // the one behind becomes the leader and heads back the other way
        var o = chars[1 - lead];
        var nd = -c.dir;
        lead = 1 - lead;
        if (o.state === 'hop') o.turnTo = nd;
        else if (o.state === 'idle') { face(o, nd); setState(o, 'hop'); }
        else o.turnTo = nd;
        face(c, nd);
        setState(c, 'idle');
        c.t = 0;
      }
    }

    function update(dt) {
      var i, c, p, v;
      var L = chars[lead];
      if (L.state === 'hop' && !L.next) {
        actTimer -= dt;
        if (actTimer <= 0) {
          var roomAhead = L.dir > 0 ? (maxX - L.x) : (L.x - minX);
          if (roomAhead > 30) { L.next = pickAct(); actTimer = 3.2 + Math.random() * 3; }
          else actTimer = 0.4;
        }
      }
      for (i = 0; i < 2; i++) {
        c = chars[i];
        // blink only while the plain open eyes are showing
        c.blinkIn -= dt;
        if (c.blinkIn <= 0) {
          if (c.blink) { c.blink = false; c.blinkIn = 2.4 + Math.random() * 3.2; cls(c); }
          else if (c.state === 'hop' || c.state === 'idle') { c.blink = true; c.blinkIn = 0.13; cls(c); }
          else c.blinkIn = 0.6;
        }
        if (c.state === 'hop') {
          p = c.phase + dt / HOP_T;
          if (p > AIR_A && c.phase < AIR_B) {
            var p0 = Math.max(c.phase, AIR_A), p1 = Math.min(p, AIR_B);
            // integral of a sine bump whose total area is 1
            v = (Math.cos(Math.PI * (p0 - AIR_A) / (AIR_B - AIR_A)) - Math.cos(Math.PI * (p1 - AIR_A) / (AIR_B - AIR_A))) / 2;
            c.x += c.dir * HOP_LEN * v;
            if (c.x > maxX) c.x = maxX;
            if (c.x < minX) c.x = minX;
          }
          if (p >= 1) {
            c.phase = 0;
            c.el.style.setProperty('--qk-p', '0');
            if (i === lead) leaderLanded(c); else followerThink(c, true);
          } else {
            c.phase = p;
            c.el.style.setProperty('--qk-p', p.toFixed(3));
          }
        } else {
          c.t += dt;
          if (c.state === 'idle') {
            if (i === lead) {
              // leader never idles for long
              if (c.t > 0.35) { if (c.turnTo) { face(c, c.turnTo); c.turnTo = 0; } setState(c, 'hop'); }
            } else followerThink(c, false);
          } else if (c.t >= c.dur) {
            endAct(c);
            if (c.turnTo) { face(c, c.turnTo); c.turnTo = 0; }
            if (i === lead) setState(c, 'hop'); else { setState(c, 'idle'); }
          }
        }
        place(c);
      }
    }

    function frame(now) {
      if (!running) return;
      var dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      if (dt > 0) update(dt);
      raf = win.requestAnimationFrame(frame);
    }
    function onResize() {
      var w = layer.clientWidth || win.innerWidth || 390;
      if (w === W) return;
      W = w;
      maxX = Math.max(minX + 40, W - QW - 4);
      for (var i = 0; i < 2; i++) { if (chars[i].x > maxX) chars[i].x = maxX; }
    }
    function start() {
      if (running || dead) return;
      running = true;
      root.classList.remove('qk-paused');
      last = (win.performance && win.performance.now) ? win.performance.now() : Date.now();
      raf = win.requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) { win.cancelAnimationFrame(raf); raf = 0; }
      root.classList.add('qk-paused');
    }

    setState(chars[0], 'hop');
    setState(chars[1], 'hop');
    chars[1].phase = 0.45;
    place(chars[0]); place(chars[1]);
    win.addEventListener('resize', onResize);
    start();

    return {
      pause: function () { stop(); },
      resume: function () { start(); },
      destroy: function () {
        if (dead) return;
        stop();
        dead = true;
        while (timers.length) win.clearTimeout(timers.pop());
        win.removeEventListener('resize', onResize);
        for (var i = 0; i < chars.length; i++) chars[i].el.removeEventListener('pointerdown', chars[i].onTap);
        if (root.parentNode) root.parentNode.removeChild(root);
        if (ownStyle && style.parentNode && !doc.querySelector('.qk-root')) style.parentNode.removeChild(style);
      }
    };
  }

  window.WeddingThemes['quokka'] = {
    id: 'quokka',
    name: 'Quokka',
    desc: '色鉛筆手繪、微笑小袋鼠',
    themeColor: '#FFF9EE',
    fonts: [
      'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap'
    ],
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
