/* Theme: puppy — pencil-crayon pups (concept B 色鉛筆手繪; original characters drawn for this page).
   All art is generated here: wobbly blobs (same construction as concepts/gen.py) drawn with a thin broken
   double pencil line and a diagonal crayon hatch that slightly misses the line. */
(function () {
  'use strict';

  var INK = '#5A4A42';      // graphite
  var PAPER = '#FFF9F0';
  var CARD = '#FFFDF8';
  var PEACH = '#FBE1D2';
  var BUTTER = '#FFEFC4';
  var PINK = '#F9D5D3';
  var HEART = '#EE8A86';
  var HEART2 = '#F4ABA5';
  var NOSE = '#4A352B';

  /* ---------- geometry (port of the concept generator) ---------- */
  function mul(s, o) {
    return [s[0] * o[0] + s[2] * o[1], s[1] * o[0] + s[3] * o[1], s[0] * o[2] + s[2] * o[3], s[1] * o[2] + s[3] * o[3],
      s[0] * o[4] + s[2] * o[5] + s[4], s[1] * o[4] + s[3] * o[5] + s[5]];
  }
  function cat() { var m = arguments[0]; for (var i = 1; i < arguments.length; i++) m = mul(m, arguments[i]); return m; }
  function Tr(x, y) { return [1, 0, 0, 1, x, y]; }
  function Rot(d) { var r = d * Math.PI / 180; return [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]; }
  function Sc(x, y) { return [x, 0, 0, y === undefined ? x : y, 0, 0]; }
  var BB = null;
  function pt(m, x, y) {
    var p = [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    if (BB) { if (p[0] < BB[0]) BB[0] = p[0]; if (p[1] < BB[1]) BB[1] = p[1]; if (p[0] > BB[2]) BB[2] = p[0]; if (p[1] > BB[3]) BB[3] = p[1]; }
    return p;
  }
  function f(v) { return String(Math.round(v * 100) / 100); }
  function seg(p0, p1, p2, p3) {
    return 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
      f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ',' + f(p2[1]);
  }
  function closed(p) {
    var n = p.length, d = 'M' + f(p[0][0]) + ',' + f(p[0][1]);
    for (var i = 0; i < n; i++) d += seg(p[(i + n - 1) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]);
    return d + 'Z';
  }
  function opened(p) {
    var n = p.length, d = 'M' + f(p[0][0]) + ',' + f(p[0][1]);
    for (var i = 0; i < n - 1; i++) d += seg(p[Math.max(i - 1, 0)], p[i], p[i + 1], p[Math.min(i + 2, n - 1)]);
    return d;
  }
  var seedN = 1;
  function rng() {
    var a = (++seedN) * 7919 >>> 0;
    return function (lo, hi) {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return lo + (((t ^ (t >>> 14)) >>> 0) / 4294967296) * (hi - lo);
    };
  }
  function blob(m, cx, cy, rx, ry, o) {
    o = o || {};
    var r = rng(), mm = cat(m, Tr(cx, cy), Rot(o.rot || 0)), n = o.n || 12, wob = o.wob === undefined ? 0.03 : o.wob, pts = [];
    for (var i = 0; i < n; i++) {
      var t = 2 * Math.PI * i / n + r(-0.06, 0.06), k = 1 + r(-wob, wob);
      var x = rx * Math.cos(t) * (1 + (o.egg || 0) * Math.sin(t)) * k, y = ry * Math.sin(t) * k * (1 + (o.taper || 0) * Math.cos(t));
      x += (o.bend || 0) * rx * (y / ry) * (y / ry);
      pts.push(pt(mm, x, y));
    }
    return closed(pts);
  }
  function capsule(m, x1, y1, x2, y2, r1, r2) {
    var r = rng(), a = Math.atan2(y2 - y1, x2 - x1), pts = [], i, t, k;
    for (i = 0; i < 5; i++) { t = a + Math.PI / 2 + Math.PI * i / 4; k = 1 + r(-0.04, 0.04); pts.push(pt(m, x1 + r1 * k * Math.cos(t), y1 + r1 * k * Math.sin(t))); }
    for (i = 0; i < 5; i++) { t = a - Math.PI / 2 + Math.PI * i / 4; k = 1 + r(-0.04, 0.04); pts.push(pt(m, x2 + r2 * k * Math.cos(t), y2 + r2 * k * Math.sin(t))); }
    return closed(pts);
  }
  function tube(m, x1, y1, cx, cy, x2, y2, r1, r2) {
    var L = [], R = [], s0, e0;
    for (var i = 0; i < 7; i++) {
      var t = i / 6, u = 1 - t, x = u * u * x1 + 2 * u * t * cx + t * t * x2, y = u * u * y1 + 2 * u * t * cy + t * t * y2;
      var dx = 2 * u * (cx - x1) + 2 * t * (x2 - cx), dy = 2 * u * (cy - y1) + 2 * t * (y2 - cy), n = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= n; dy /= n; var rr = r1 + (r2 - r1) * t;
      L.push(pt(m, x - dy * rr, y + dx * rr)); R.push(pt(m, x + dy * rr, y - dx * rr));
      if (i === 0) s0 = pt(m, x - dx * rr * 0.8, y - dy * rr * 0.8);
      if (i === 6) e0 = pt(m, x + dx * rr, y + dy * rr);
    }
    return closed(L.concat([e0], R.reverse(), [s0]));
  }
  function poly(m, pts) { return closed(pts.map(function (p) { return pt(m, p[0], p[1]); })); }
  function line(m, pts) { return opened(pts.map(function (p) { return pt(m, p[0], p[1]); })); }
  function rrect(m, x, y, w, h, r, wob) {
    var q = rng(), j = function () { return q(-(wob || 0.5), wob || 0.5); }, c = r * 0.3;
    var P = [[x + r, y], [x + w / 2, y], [x + w - r, y], [x + w - c, y + c], [x + w, y + r], [x + w, y + h / 2], [x + w, y + h - r], [x + w - c, y + h - c],
      [x + w - r, y + h], [x + w / 2, y + h], [x + r, y + h], [x + c, y + h - c], [x, y + h - r], [x, y + h / 2], [x, y + r], [x + c, y + c]];
    return closed(P.map(function (p) { return pt(m, p[0] + j(), p[1] + j()); }));
  }
  function heartD(m) {
    var P = [[0, 7], [-15, -3], [-9, -15], [0, -6], [8, -15], [16, -4], [0, 7]].map(function (p) { return pt(m, p[0], p[1]); });
    var c = function (i) { return f(P[i][0]) + ',' + f(P[i][1]); };
    return 'M' + c(0) + 'C' + c(1) + ' ' + c(2) + ' ' + c(3) + 'C' + c(4) + ' ' + c(5) + ' ' + c(6) + 'Z';
  }
  function mix(c, t, k) {
    var o = '#';
    for (var i = 1; i < 6; i += 2) {
      var a = parseInt(c.substr(i, 2), 16), b = parseInt(t.substr(i, 2), 16);
      o += ('0' + Math.round(a + (b - a) * k).toString(16)).slice(-2);
    }
    return o.toUpperCase();
  }
  function darken(c, k) { return mix(c, '#5A2E12', k); }

  /* ---------- pencil + crayon renderer ----------
     z = px per concept unit. Geometry is emitted in px so the filters always work at screen scale.
     lite = no filters at all (single wobbly line + hatch pattern): used for the small animated runner. */
  function Pen(z, lite) {
    this.z = z; this.lite = !!lite; this.r = z / 1.25;
    this.lw = Math.max(lite ? 1.05 : 1, 1.9 * this.r);
    this.pats = {}; this.np = 0;
  }
  Pen.prototype.dash = function (a) { var z = this.z; return a.map(function (v, i) { return f(i % 2 ? Math.max(1.8, v * z) : Math.max(6, v * z)); }).join(' '); };
  Pen.prototype.pat = function (col) { if (!this.pats[col]) this.pats[col] = 'h' + (this.np++); return this.pats[col]; };
  Pen.prototype.fill = function (d, col, op) {
    var ox = f(2 * this.r), oy = f(1.25 * this.r);
    if (this.lite) {
      return '<g transform="translate(' + ox + ',' + oy + ')" opacity="' + op + '"><path d="' + d + '" fill="' + col + '" opacity=".5"/><path d="' + d + '" fill="url(#' + this.pat(col) + ')"/></g>';
    }
    return '<g transform="rotate(-38)" opacity="' + op + '"><g filter="url(#cr)"><path transform="rotate(38) translate(' + ox + ',' + oy + ')" d="' + d + '" fill="' + col + '"/></g></g>';
  };
  Pen.prototype.shape = function (d, col, o) {
    o = o || {};
    var s = '';
    if (o.paper !== false) s += '<path d="' + d + '" fill="' + (o.paperCol || '#FFFCF5') + '"/>';
    if (col) s += this.fill(d, col, o.op === undefined ? 1 : o.op);
    if (o.outline !== false) {
      var a = ' fill="none" stroke="' + INK + '" stroke-linecap="round" stroke-linejoin="round"';
      var p1 = '<path d="' + d + '"' + a + ' stroke-width="' + f(this.lw) + '" stroke-dasharray="' + this.dash([90, 5, 46, 7, 130, 4]) + '"/>';
      var p2 = '<path d="' + d + '"' + a + ' stroke-width="' + f(this.lw * 0.72) + '" stroke-dasharray="' + this.dash([34, 22, 60, 30]) + '" transform="translate(' + f(-1 * this.r - 0.2) + ',' + f(1.1 * this.r + 0.2) + ')"/>';
      if (this.lite) s += p1 + '<g opacity=".42">' + p2 + '</g>';
      else s += '<g filter="url(#pc1)">' + p1 + '</g><g filter="url(#pc2)" opacity=".55">' + p2 + '</g>';
    }
    return s;
  };
  Pen.prototype.stroke = function (d, w, col, op) {
    return '<path d="' + d + '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + f(w || this.lw) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (op || 1) + '"/>';
  };
  Pen.prototype.pencil = function (s) { return this.lite ? s : '<g filter="url(#pcs)">' + s + '</g>'; };
  Pen.prototype.dot = function (m, x, y, rx, ry, col) {
    col = col || NOSE;
    return '<path d="' + blob(m, x, y, rx, ry || rx, { wob: 0.05, n: 8 }) + '" fill="' + col + '" opacity=".92" stroke="' + col + '" stroke-width="' + f(0.8 * this.z) + '"/>';
  };
  Pen.prototype.blush = function (m, x, y, rx, ry) { return this.fill(blob(m, x, y, rx, ry, { wob: 0.05, n: 8 }), '#F0938C', this.lite ? 0.75 : 0.8); };
  Pen.prototype.ground = function (m, x, y, rx, ry) {
    var d = blob(m, x, y, rx, ry, { wob: 0.04 });
    if (this.lite) return '<path d="' + d + '" fill="#B9A292" opacity=".22"/><path d="' + d + '" fill="url(#' + this.pat('#B9A292') + ')" opacity=".5"/>';
    return '<g transform="rotate(-8)"><g filter="url(#cr)"><path transform="rotate(8)" d="' + d + '" fill="#B9A292" opacity=".7"/></g></g>';
  };
  Pen.prototype.defs = function () {
    var o = '', r = this.r, k;
    if (this.lite) {
      for (k in this.pats) {
        o += '<pattern id="' + this.pats[k] + '" patternUnits="userSpaceOnUse" width="36" height="7.2" patternTransform="rotate(-38)" fill="none" stroke="' + k + '" stroke-linecap="round">' +
          '<path d="M-2,1.2Q8,.5 18,1.4T38,1.2" stroke-width="1.5" opacity=".95"/><path d="M-2,3.7Q9,4.3 18,3.5T38,3.7" stroke-width="1" opacity=".75" stroke-dasharray="21 3 12 0"/>' +
          '<path d="M-2,6Q8,5.5 18,6.2T38,6" stroke-width="1.3" opacity=".9" stroke-dasharray="9 2 25 0"/></pattern>';
      }
      return o ? '<defs>' + o + '</defs>' : '';
    }
    o += '<filter id="cr" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="' + f(Math.min(0.09, 0.024 / r)) + ' 0.42" numOctaves="2" seed="4" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.4 0 0 0 2.35" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter>';
    var F = [['pc1', 2, 5], ['pc2', 9, 8.1], ['pcs', 5, 2.5]];
    for (var i = 0; i < 3; i++) {
      o += '<filter id="' + F[i][0] + '" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="' + f(Math.min(0.12, 0.032 / r)) + '" numOctaves="2" seed="' + F[i][1] + '" result="w"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="w" scale="' + f(Math.max(0.9, F[i][2] * r)) + '" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="2" seed="5" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.2" result="na"/><feComposite in="d" in2="na" operator="in"/></filter>';
    }
    return '<defs>' + o + '</defs>';
  };

  /* one self-contained picture; box = fixed [x,y,w,h] or omitted for a tight box */
  function art(z, lite, draw, box, pad) {
    var S = new Pen(z, lite);
    BB = [1e9, 1e9, -1e9, -1e9];
    var body = draw(S), b = BB;
    BB = null;
    pad = pad === undefined ? 4 : pad;
    var x = box ? box[0] : Math.floor(b[0] - pad), y = box ? box[1] : Math.floor(b[1] - pad);
    var w = box ? box[2] : Math.ceil(b[2] + pad) - x, h = box ? box[3] : Math.ceil(b[3] + pad) - y;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + x + ' ' + y + ' ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' + S.defs() + body + '</svg>';
    return { x: x, y: y, w: w, h: h, src: 'data:image/svg+xml,' + encodeURIComponent(svg) };
  }
  /* inline <svg> root (the framework sizes slot svgs) that just shows cached pictures */
  function image(a, x, y) {
    return '<image href="' + a.src + '" x="' + (x === undefined ? a.x : x) + '" y="' + (y === undefined ? a.y : y) + '" width="' + a.w + '" height="' + a.h + '"/>';
  }
  function frame(a, cls, inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg"' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="' + a.x + ' ' + a.y + ' ' + a.w + ' ' + a.h + '" width="' + a.w + '" height="' + a.h + '" aria-hidden="true">' + (inner || image(a)) + '</svg>';
  }

  /* ---------- the characters (concept B) ---------- */
  var PAL = {
    groom: { fur: '#F3C48D', ear: '#D9986A', light: '#FFF3DF', acc: '#7FA6BF' },
    bride: { fur: '#FBE6C6', ear: '#F3B19C', light: '#FFFAF0', acc: '#F4A6A6' }
  };
  PAL.groom.far = darken(PAL.groom.fur, 0.14); PAL.bride.far = darken(PAL.bride.fur, 0.14);
  var EARS = [[-41, -27, 103, 43], [41, -27, 77, 43]];

  function headM(g, hx, hy, hr) { return cat(g, Tr(hx, hy), Rot(hr || 0), Sc(1.06, 1.04)); }
  function ear(S, hm, role, e) {
    var a = e[2] * Math.PI / 180, ln = e[3] * 1.18;
    return S.shape(blob(hm, e[0] + Math.cos(a) * ln * 0.45, e[1] + Math.sin(a) * ln * 0.45, ln * 0.62, 14, { rot: e[2], wob: 0.04, taper: 0.28 }), PAL[role].ear);
  }
  function headBase(S, hm, role, fx, fy) {
    var s = S.shape(blob(hm, 0, 0, 58, 47, { egg: 0.1, bend: 0.03 }), PAL[role].fur);
    if (role === 'groom') s += S.shape(blob(hm, fx * 1.25, fy + 17, 20, 14), PAL.groom.light, { outline: false, paper: false });
    return s;
  }
  function eyes(S, hm, fx, fy, kind) {
    var o = '', side = Math.abs(fx) >= 10, sgn = fx >= 0 ? 1 : -1, hw = 5.2;
    for (var sd = -1; sd <= 1; sd += 2) {
      var x = fx + sd * 21 * (side && sd === sgn ? 0.8 : 1), y = fy + 2;
      if (kind === 'dot') o += S.dot(hm, x, y, 4, 4.5);
      else o += S.stroke(line(hm, [[x - hw, y + 1.5], [x, y - hw * 0.7], [x + hw, y + 1.5]]));
    }
    return kind === 'dot' ? o : S.pencil(o);
  }
  function flower(S, m, x, y, s) {
    var o = '';
    for (var i = 0; i < 5; i++) {
      var a = (72 * i - 82) * Math.PI / 180;
      o += S.shape(blob(m, x + 5.6 * s * Math.cos(a), y + 5.6 * s * Math.sin(a), 5 * s, 4.4 * s, { rot: 72 * i, n: 8 }), PAL.bride.acc);
    }
    return o + S.dot(m, x, y, 3.2 * s, 3.2 * s, '#F3C55B');
  }
  function bowtie(S, m, x, y, s) {
    var c = PAL.groom.acc, P = function (a) { return poly(m, a.map(function (p) { return [x + p[0] * s, y + p[1] * s]; })); };
    return S.shape(P([[-1, 0], [-12, -7.5], [-14.5, 0], [-12, 7]]), c) + S.shape(P([[1, 0], [12, -7], [14.5, 0.5], [12, 7.5]]), c) +
      S.shape(blob(m, x, y, 3.8 * s, 4.4 * s, { n: 8 }), darken(c, 0.12));
  }
  /* blush, nose, mouth and the accessory; drawn over the ears */
  function face(S, hm, role, fx, fy, o) {
    o = o || {};
    var s = '', side = Math.abs(fx) >= 10, sgn = fx >= 0 ? 1 : -1, nx = fx * 1.25, ny = fy + 11, my = ny + 4.3, w = S.lw;
    for (var sd = -1; sd <= 1; sd += 2) if (!(side && sd === sgn)) s += S.blush(hm, fx + sd * 35 * (side ? 0.9 : 1), fy + 16, 9, 5.5);
    s += S.dot(hm, nx, ny, 5.6, 4.3);
    if (o.mouth === 'open') s += S.dot(hm, nx, my + 5.5, 4.6, 5, '#D4706C');
    s += S.pencil(S.stroke(line(hm, [[nx - 0.4, my - 1], [nx + 0.4, my + 2]]), w * 0.8) +
      S.stroke(line(hm, [[nx - 7, my + 1], [nx - 3.5, my + 4.2], [nx, my + 1.8]]), w * 0.85) +
      S.stroke(line(hm, [[nx, my + 1.8], [nx + 3.5, my + 4.2], [nx + 7, my + 1]]), w * 0.85));
    if (o.acc !== false) {
      if (role === 'groom') s += bowtie(S, hm, o.bow ? o.bow[0] : fx * 0.7, o.bow ? o.bow[1] : 45, 0.95);
      else s += flower(S, hm, o.flower ? o.flower[0] : 30, o.flower ? o.flower[1] : -36, 1.05);
    }
    return s;
  }
  function head(S, hm, role, fx, fy, o) {
    o = o || {};
    return headBase(S, hm, role, fx, fy) + ear(S, hm, role, EARS[0]) + ear(S, hm, role, EARS[1]) + face(S, hm, role, fx, fy, o) + eyes(S, hm, fx, fy, o.eyes || 'dot');
  }
  function limb(S, g, l, col) { return S.shape(capsule(g, l[0], l[1], l[2], l[3], l[4] * 0.82, l[5] * 0.82), col); }
  function sitBody(S, g, role, noTail) {
    var P = PAL[role], s = '';
    if (!noTail) s += S.shape(tube(g, -24, 24, -42, 24, -48, 2, 6, 4), P.ear);
    s += S.shape(blob(g, 0, 0, 33 * 0.88, 35 * 0.92, { egg: 0.16 }), P.fur);
    s += S.shape(blob(g, -19, 31, 13, 8.5, { rot: -8 }), P.fur) + S.shape(blob(g, 19, 31, 13, 8.5, { rot: 8 }), P.fur);
    s += limb(S, g, [-13, -10, -11, 19, 7, 7.5], P.fur) + limb(S, g, [13, -10, 11, 19, 7, 7.5], P.fur);
    return s;
  }
  /* whole sitting pup (front view), origin = body centre */
  function sitting(S, g, role, tilt, fx, eyeKind) {
    return sitBody(S, g, role) + head(S, headM(g, 0, -58, tilt), role, fx, 0, { eyes: eyeKind });
  }
  function heart(S, m, col) { return S.shape(heartD(m), col || HEART); }

  /* ---------- static art ---------- */
  var LZ = 0.8;
  var lockMain = art(LZ, false, function (S) {
    var g = Sc(LZ), s = S.ground(g, 0, 43, 168, 9);
    s += sitting(S, cat(g, Tr(-80, 0)), 'groom', 5, 4, 'dot');
    s += sitting(S, cat(g, Tr(80, 3), Sc(-0.94, 0.94)), 'bride', 6, 4, 'joy');
    s += heart(S, cat(g, Tr(27, -128), Rot(14), Sc(0.8)), HEART2);
    return s;
  }, [-132, -112, 264, 152]);
  var lockHeart = art(LZ, false, function (S) { return heart(S, cat(Sc(LZ), Rot(-8), Sc(1.5))); });
  var lockArt = '<span class="pup-c-lock">' + frame(lockMain, 'pup-c-art') +
    '<span class="pup-c-heart" style="left:' + f((lockHeart.x + 2 * LZ - lockMain.x) / lockMain.w * 100) + '%;top:' + f((-101 * LZ + lockHeart.y - lockMain.y) / lockMain.h * 100) +
    '%;width:' + f(lockHeart.w / lockMain.w * 100) + '%">' + frame(lockHeart) + '</span></span>';

  /* 100 x 64 box, drawn 1:1; the card's top edge is the line y = 59 */
  var CZ = 0.52;
  var cornerHead = art(CZ, false, function (S) { return head(S, headM(cat(Tr(50, 37), Sc(CZ)), 0, 0, -3), 'groom', 0, 0, { acc: false }); }, [0, 0, 100, 59]);
  var cornerPaws = art(CZ, false, function (S) {
    var g = cat(Tr(50, 57), Sc(CZ)), s = '', w = S.lw * 0.8;
    for (var sd = -1; sd <= 1; sd += 2) {
      s += S.shape(blob(g, sd * 37, -1, 13.5, 9.5, { rot: sd * 6 }), PAL.groom.fur);
      s += S.pencil(S.stroke(line(g, [[sd * 37 - 4, 1], [sd * 37 - 4.4, 7]]), w) + S.stroke(line(g, [[sd * 37 + 4, 1], [sd * 37 + 4.4, 7]]), w));
    }
    return s;
  }, [0, 0, 100, 64]);
  var cornerMascot = frame({ x: 0, y: 0, w: 100, h: 64 }, 'pup-c-corner', '<g class="pup-c-peek">' + image(cornerHead) + '</g>' + image(cornerPaws));

  var HZ = 0.3;
  var headIcon = art(HZ, false, function (S) { return head(S, headM(Sc(HZ), 0, 0, 0), 'bride', 0, 0); }, null, 2);
  var headingIcon = frame(headIcon);

  var ornament =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 18" width="150" height="18" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 10 Q11 2.4 18 10 T32 10 T46 10 T60 10 T74 10 T88 10 T102 10" stroke="#F8C9BF" stroke-width="3.6" opacity=".9"/>' +
    '<path d="M4 10 Q11 2 18 10 T32 10 T46 10 T60 10 T74 10 T88 10 T102 10" stroke="' + INK + '" stroke-width="1" opacity=".7" stroke-dasharray="40 3 26 4 60 3" transform="translate(1.2 1.8)"/>' +
    '<g transform="translate(125 9.5) rotate(18)" stroke="' + INK + '" stroke-width="1" fill="#FBE0B8">' +
    '<path d="M0 6.5 C-5 6.5 -5.5 1.5 0 0.3 C5.5 1.5 5 6.5 0 6.5 Z"/><circle cx="-5.2" cy="-1.6" r="1.7"/><circle cx="-1.8" cy="-4.6" r="1.7"/><circle cx="2.2" cy="-4.6" r="1.7"/><circle cx="5.4" cy="-1.4" r="1.7"/></g>' +
    '</svg>';

  var swatchArt = art(0.3, false, function (S) {
    var I = Sc(1), s = '<rect width="120" height="80" fill="' + PAPER + '"/>';
    s += S.shape(blob(I, 14, 12, 22, 19), PEACH, { outline: false, paper: false, op: 0.9 });
    s += S.shape(blob(I, 108, 70, 24, 20), BUTTER, { outline: false, paper: false, op: 0.95 });
    s += S.shape(rrect(I, 8, 15, 56, 49, 11, 0.35), null, { paperCol: CARD });
    s += S.shape(rrect(I, 15, 23, 24, 5, 2.5, 0.3), INK, { outline: false, paper: false, op: 0.85 });
    s += S.shape(rrect(I, 15, 35, 42, 7, 3.5, 0.3), null, { paperCol: '#FFFFFF' }) + S.shape(rrect(I, 16, 36, 25, 5, 2.5, 0.3), HEART2, { outline: false, paper: false });
    s += S.shape(rrect(I, 15, 49, 18, 8, 4, 0.3), '#F8D58A') + S.shape(rrect(I, 37, 49, 18, 8, 4, 0.3), '#F6B9AE');
    s += head(S, headM(cat(Tr(93, 49), Sc(0.3)), 0, 0, 5), 'groom', 0, 0);
    s += heart(S, cat(Tr(78, 21), Rot(-10), Sc(0.6)));
    return s;
  }, [0, 0, 120, 80]);
  var swatch = frame(swatchArt);

  /* ---------- page furniture: pencil 9-slice outline, crayon hatch, paper grain ---------- */
  function uri(svg) {
    return "url(\"data:image/svg+xml," + svg.replace(/#/g, '%23').replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E') + "\")";
  }
  /* four pencil strokes that do not quite meet at the corners, plus a fainter second pass.
     The middle 40px of every side is a plain line so the stretched edges stay clean. */
  function wobble(fill) {
    var st = [
      'M3.8 33 C3.2 15 12 4.6 30 4.3 C50 3.6 70 5 90 4.2 L97 4',
      'M88 3.5 C106 3.2 116.2 12 116.4 30 C117 50 115.8 70 116.2 90 L116.5 96',
      'M117 87 C117.2 106 108 116 90 116.3 C70 117 50 115.8 30 116.2 L23 116.6',
      'M32 116.8 C13.5 117 4 108 3.8 90 C3.2 70 4.6 50 4 30 L3.9 24'
    ];
    var a = '', b = '';
    for (var i = 0; i < 4; i++) { a += '<path d="' + st[i] + '"/>'; b += '<path d="' + st[i] + '" stroke-dasharray="30 7 200"/>'; }
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">' +
      (fill ? '<path d="M30 4.3 C50 3.6 70 5 90 4.2 C107 3.4 116.2 12.6 116.4 30 C117 50 115.8 70 116.2 90 C116.6 107 107.6 116.1 90 116.3 C70 117 50 115.8 30 116.2 C13 116.6 4 107.4 3.8 90 C3.2 70 4.6 50 4 30 C3.4 13.2 12.8 4.4 30 4.3 Z" fill="' + fill + '"/>' : '') +
      '<g fill="none" stroke="' + INK + '" stroke-linecap="round"><g stroke-width="1.25" opacity=".92">' + a + '</g><g stroke-width=".9" opacity=".38" transform="translate(-.9 1.1)">' + b + '</g></g></svg>');
  }
  var W_CARD = wobble(CARD), W_LINE = wobble('');
  var GRAIN = uri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="g" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" stitchTiles="stitch"/>' +
    '<feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .4  0 0 0 0 .3  0 0 0 1.5 -.62"/></filter><rect width="220" height="220" filter="url(#g)"/></svg>');
  function hatch(c, a, b) { return 'repeating-linear-gradient(142deg,' + c + ' 0 ' + a + 'px,transparent ' + a + 'px ' + b + 'px)'; }
  var H_WHITE = hatch('rgba(255,253,248,.6)', 1.2, 4.2);

  /* ---------- css ---------- */
  var S = 'html[data-theme="puppy"]';
  var FONT = '"Iansui","PingFang TC","Heiti TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif';
  var FONT_EN = '"Patrick Hand","Bradley Hand","Segoe Print","Iansui","PingFang TC","Heiti TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif';
  var LINE = 'rgba(90,74,66,.82)';

  /* runner rig (px); RZ = px per concept unit */
  var RZ = 0.47, PW = 84, PH = 68;
  var OX = 37, OY = PH - 3 - 43.5 * RZ;
  var HX = 32, HY = -36, SITX = 9;
  function px(v) { return f(v * RZ) + 'px'; }

  var css = `
${S}{
  --bg1:${PAPER}; --bg2:#FFF6E9; --bg3:#FFF3EA; --bg4:#FFF8EC;
  --orb1:rgba(255,236,196,.6); --orb2:rgba(251,221,208,.62); --orb3:rgba(249,213,211,.45);
  --text:#4F4039; --text-soft:#8B776A;
  --accent1:#E98B7F; --accent2:#EFAF58;
  --card-bg:${CARD}; --card-border:${INK}; --card-shadow:3px 4px 0 rgba(246,200,180,.5); --card-radius:26px;
  --chip-bg:${BUTTER}; --chip-text:#5A4A42; --danger:#DD6B6B;
  --font-body:${FONT}; --font-display:${FONT_EN}; --font-script:${FONT_EN};
  --track:#FFFEFB; --field:#FFFEFB; --field-f:#FFFEFB;
  --hair:rgba(90,74,66,.3); --hair-2:rgba(90,74,66,.2); --mute:rgba(90,74,66,.3);
  --btn-ink:#4F4039; --btn-ts:none; --on-ink:#4F4039; --on-ts:none;
  --on:${H_WHITE},linear-gradient(100deg,#F9C3B8,#FBDFA0);
  --c-gold-bg:#FCE7B4; --c-gold-ink:#7A5A26; --c-blush-bg:#FBD9D2; --c-blush-ink:#8E4F47;
  --c-rose-bg:#F2A29C; --c-rose-ink:#5A2A26; --c-mist-bg:#F1E8DF; --c-mist-ink:#7A695E;
  --ring-track:rgba(90,74,66,.1);
  color:var(--text); font-family:var(--font-body);
}
${S} body{font-family:var(--font-body);font-weight:500;letter-spacing:.01em}
${S} .bg::after{content:"";position:absolute;inset:0;pointer-events:none;background-image:${GRAIN};background-size:220px 220px;opacity:.3}

/* cards: thin pencil outline (9-slice SVG on ::before), strokes not quite meeting at the corners */
${S} .card,${S} .stat-tile,${S} .countdown-card,${S} .lock-card{
  position:relative; isolation:isolate; background:transparent; border-color:transparent;
  border-radius:var(--card-radius); box-shadow:3px 4px 0 rgba(246,200,180,.45);
  -webkit-backdrop-filter:none; backdrop-filter:none;
}
${S} .card::before,${S} .stat-tile::before,${S} .countdown-card::before,${S} .lock-card::before{
  content:""; position:absolute; inset:-1px; z-index:-1; pointer-events:none; box-sizing:border-box;
  border:1px solid transparent; border-radius:0; background:none;
  border-image-source:${W_CARD}; border-image-slice:40 fill; border-image-width:40px; border-image-repeat:stretch;
}
${S} .stat-tile{box-shadow:3px 4px 0 rgba(255,226,160,.6); border-radius:24px}
${S} .stat-tile:nth-child(3n+2){box-shadow:3px 4px 0 rgba(249,205,200,.6)}
${S} .stat-tile:nth-child(3n){box-shadow:3px 4px 0 rgba(246,200,180,.55)}
/* hero: crayon-hatched peach/butter fill that slightly misses its pencil line */
${S} .countdown-card{
  box-shadow:none; border:0;
  background:${hatch('rgba(255,253,248,.55)', 1.4, 4.6)},linear-gradient(110deg,#FFE9BE 0%,#FCDCCB 60%,#F9D2CE 100%);
  background-origin:border-box; border-radius:25px 27px 24px 28px / 27px 24px 28px 25px;
}
${S} .countdown-card::before{inset:-4px -5px -2px -2px; border-image-source:${W_LINE}}
${S} .countdown-card>div+div::before{background:none;border-left:1px dashed rgba(90,74,66,.35);width:0}
${S} .lock-card{box-shadow:4px 5px 0 rgba(249,205,200,.55)}

${S} .page-title{
  font-family:var(--font-display); font-weight:900; letter-spacing:.04em; color:var(--text);
  background:none; -webkit-background-clip:border-box; background-clip:border-box; -webkit-text-fill-color:currentColor;
}
${S} .page-subtitle{color:var(--text-soft); font-weight:500}
${S} .lock-title{
  font-family:var(--font-display); font-weight:900; letter-spacing:.02em; color:var(--text);
  background:none; -webkit-background-clip:border-box; background-clip:border-box; -webkit-text-fill-color:currentColor;
  text-shadow:2px 2.5px 0 #F9D2C8;
}
${S} .pup-c-lock{position:relative; display:block; width:264px; max-width:100%; line-height:0}
${S} .pup-c-lock svg{display:block; width:100%; height:auto; max-width:none; max-height:none}
${S} .pup-c-lock .pup-c-heart{position:absolute; display:block; animation:pup-kf-beat 1.5s ease-in-out infinite; transform-origin:50% 60%; will-change:transform}
${S} .corner-slot svg{height:64px}
${S} .heading-icon{margin-right:.28em}
${S} .heading-icon svg{height:1.25em; margin-top:-.1em}
${S} .empty .heading-icon svg{height:44px}

${S} .chip{
  background:${H_WHITE},var(--chip-bg); color:var(--chip-text); font-weight:700;
  border:1px solid ${LINE}; border-radius:999px 940px 999px 960px / 960px 999px 940px 999px; box-shadow:none;
}
${S}:root .chip.gold,${S}:root .chip.blush,${S}:root .chip.rose,${S}:root .chip.mist{background-image:${H_WHITE}}
${S} .btn-primary{
  font-family:var(--font-body); font-weight:900; letter-spacing:.08em; color:#4F4039;
  background:${H_WHITE},linear-gradient(110deg,#F9C3B8 0%,#FBDFA0 100%);
  border:1.3px solid ${INK}; border-radius:999px 960px 999px 950px / 950px 999px 960px 999px;
  box-shadow:2px 3px 0 rgba(90,74,66,.28); text-shadow:none;
  transition:transform .12s ease, box-shadow .12s ease;
}
${S} .btn-primary:active{transform:translate(1px,2px); box-shadow:1px 1px 0 rgba(90,74,66,.28)}

${S} .search-input,${S} .lock-card input[type=password]{
  font-family:var(--font-body); font-weight:700; color:#4F4039; background:#FFFEFB;
  border:1.3px solid ${LINE}; border-radius:18px 22px 17px 21px / 21px 17px 22px 18px;
  box-shadow:1.5px 2px 0 rgba(90,74,66,.1); outline:none;
}
${S} .search-input::placeholder,${S} .lock-card input::placeholder{color:#BBAA9D; font-weight:500}
${S} .search-input:focus,${S} .lock-card input[type=password]:focus{box-shadow:0 0 0 4px rgba(251,223,160,.75)}
${S} .fchips button{border:1px solid ${LINE}; box-shadow:none; background:#FFFEFB; font-weight:700}
${S} .fchips button.on{font-weight:700}

${S} .progress-bar{background:#FFFEFB; border:1px solid ${LINE}; border-radius:999px; overflow:hidden; box-shadow:none; min-height:10px}
${S} .progress-bar > i::after{content:""; position:absolute; inset:0; background:${hatch('rgba(255,253,248,.62)', 1.3, 4.4)}}
${S} .split{border:1px solid ${LINE}}

${S} .topbar{background:rgba(255,249,240,.9); border-bottom:1px solid rgba(90,74,66,.28)}
${S} .tabbar{
  background:${PAPER}; border:1.2px solid ${LINE}; border-bottom:0;
  border-radius:24px 28px 0 0 / 26px 23px 0 0;
  box-shadow:0 -3px 0 rgba(246,200,180,.4); -webkit-backdrop-filter:none; backdrop-filter:none;
}
${S} .tab{color:#9C8A7D; font-weight:700; font-family:var(--font-body); border-radius:18px 20px 17px 21px / 20px 17px 21px 18px}
${S} .tab::before{display:none}
${S} .tab.active{color:#4F4039; background:${hatch('rgba(255,253,248,.6)', 1.3, 4.4)},linear-gradient(120deg,#FAD3CB,#FDE7B4); box-shadow:inset 0 0 0 1.1px ${LINE}; margin:5px 2px}

${S} .settings-sheet{
  background:${PAPER}; color:var(--text); border:1.2px solid ${LINE}; border-bottom:0;
  border-radius:28px 32px 0 0 / 32px 28px 0 0; box-shadow:0 -4px 0 rgba(246,200,180,.45);
  -webkit-backdrop-filter:none; backdrop-filter:none;
}
${S} .sw{box-shadow:inset 0 0 0 1px rgba(90,74,66,.35)}
${S} .sw[aria-checked="true"]{box-shadow:inset 0 0 0 2px #D9796E}

/* little life in the static art */
${S} .pup-c-peek{animation:pup-kf-peek 6s ease-in-out infinite}
@keyframes pup-kf-beat{0%,100%{transform:scale(1)}18%{transform:scale(1.16)}36%{transform:scale(1)}54%{transform:scale(1.1)}}
@keyframes pup-kf-peek{0%,52%,100%{transform:translateY(0)}60%{transform:translateY(-3.5px)}74%{transform:translateY(-3.5px)}84%{transform:translateY(1.5px)}}
@keyframes pup-kf-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.12)}}

/* ================= runner ================= */
.pup-stage{position:absolute; left:0; right:0; bottom:0; height:100%; pointer-events:none; overflow:visible;
  -webkit-user-select:none; user-select:none; -webkit-tap-highlight-color:transparent}
.pup-actor{position:absolute; left:0; bottom:2px; width:${PW}px; height:${PH}px; pointer-events:auto; cursor:pointer;
  will-change:transform; touch-action:manipulation; -webkit-tap-highlight-color:transparent}
.pup-actor img{position:absolute; display:block; max-width:none; pointer-events:none; -webkit-user-drag:none; user-select:none; -webkit-user-select:none}
.pup-shadow{left:8px; bottom:-4px; width:68px; height:10px}
.pup-flip{position:absolute; inset:0; transition:transform .2s cubic-bezier(.3,1.4,.6,1)}
.pup-actor.pup-left .pup-flip{transform:scaleX(-1)}
.pup-pose{position:absolute; inset:0; transform-origin:50% 62%}
.pup-all,.pup-side,.pup-sitb,.pup-head{position:absolute; left:0; top:0; width:0; height:0}
.pup-all{left:${f(OX)}px; top:${f(OY)}px; transform-origin:0 ${px(30)}}
.pup-head,.pup-leg,.pup-tail,.pup-ear,.pup-ear2,.pup-side{transition:transform .2s ease-out}
.pup-side{transform-origin:${px(-30)} ${px(40)}; transition:transform .2s ease-out,opacity .1s linear}
.pup-sitb{opacity:0; transition:opacity .1s linear; transform:translateX(${px(SITX)})}
.pup-head{transform-origin:${px(HX - 6)} ${px(HY + 40)}}
.pup-tail{animation:pup-kf-wag .5s ease-in-out infinite alternate}
.pup-eyes{animation:pup-kf-blink 3.9s infinite}
.pup-groom .pup-eyes{animation-duration:4.7s; animation-delay:-1.3s}
.pup-eyes-joy{opacity:0}
.pup-paused,.pup-paused *{animation-play-state:paused !important}

/* run */
.pup-s-run .pup-all{animation:pup-kf-bob .36s ease-in-out infinite}
.pup-s-run .pup-head{animation:pup-kf-nod .36s ease-in-out infinite}
.pup-s-run .pup-leg-fn{animation:pup-kf-legf .36s ease-in-out infinite}
.pup-s-run .pup-leg-ff{animation:pup-kf-legf .36s ease-in-out -.18s infinite}
.pup-s-run .pup-leg-bn{animation:pup-kf-legb .36s ease-in-out -.18s infinite}
.pup-s-run .pup-leg-bf{animation:pup-kf-legb .36s ease-in-out infinite}
.pup-s-run .pup-ear{animation:pup-kf-ear .36s ease-in-out infinite}
.pup-s-run .pup-ear2{animation:pup-kf-ear2 .36s ease-in-out infinite}
.pup-s-run .pup-tail{animation:pup-kf-wag .18s ease-in-out infinite alternate}
.pup-s-run .pup-shadow{animation:pup-kf-shadow .36s ease-in-out infinite}
@keyframes pup-kf-bob{0%,100%{transform:translateY(.5px) rotate(2deg)}50%{transform:translateY(-4px) rotate(-3deg)}}
@keyframes pup-kf-nod{0%,100%{transform:rotate(-7deg) translateY(0)}50%{transform:rotate(-2deg) translateY(1px)}}
@keyframes pup-kf-legf{0%,100%{transform:rotate(42deg)}50%{transform:rotate(-58deg)}}
@keyframes pup-kf-legb{0%,100%{transform:rotate(-40deg)}50%{transform:rotate(54deg)}}
@keyframes pup-kf-ear{0%,100%{transform:rotate(62deg)}50%{transform:rotate(92deg)}}
@keyframes pup-kf-ear2{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(-38deg)}}
@keyframes pup-kf-wag{0%{transform:rotate(-16deg)}100%{transform:rotate(22deg)}}
@keyframes pup-kf-shadow{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.84)}}

/* sit: turn to face us, like the concept's 並肩坐著 */
.pup-s-sit .pup-side{opacity:0}
.pup-s-sit .pup-sitb{opacity:1}
.pup-s-sit .pup-head{transform:translate(${px(SITX - HX)},${px(-58 - HY)}); animation:pup-kf-sithead 2.4s ease-in-out .25s infinite}
.pup-s-sit .pup-pose{animation:pup-kf-plop .3s ease-out both}
.pup-s-sit .pup-tail{animation:pup-kf-wagsit .26s ease-in-out infinite alternate}
@keyframes pup-kf-sithead{0%,100%{transform:translate(${px(SITX - HX)},${px(-58 - HY)}) rotate(0)}50%{transform:translate(${px(SITX - HX)},${px(-58 - HY)}) rotate(6deg)}}
@keyframes pup-kf-plop{0%{transform:scale(1.06,.92)}60%{transform:scale(.97,1.04)}100%{transform:scale(1,1)}}
@keyframes pup-kf-wagsit{0%{transform:rotate(-22deg)}100%{transform:rotate(12deg)}}

/* look around */
.pup-s-look .pup-head{animation:pup-kf-look 1.5s ease-in-out infinite}
.pup-s-look .pup-ear{animation:pup-kf-earperk 1.5s ease-in-out infinite}
.pup-s-look .pup-ear2{animation:pup-kf-earperk2 1.5s ease-in-out infinite}
@keyframes pup-kf-look{0%,100%{transform:rotate(0)}18%,38%{transform:rotate(-13deg) translate(-2px,0)}58%,80%{transform:rotate(9deg) translate(1px,1px)}}
@keyframes pup-kf-earperk{0%,100%{transform:rotate(0)}18%,38%{transform:rotate(16deg)}58%,80%{transform:rotate(-6deg)}}
@keyframes pup-kf-earperk2{0%,100%{transform:rotate(0)}18%,38%{transform:rotate(8deg)}58%,80%{transform:rotate(-14deg)}}

/* sniff */
.pup-s-sniff .pup-side{transform:rotate(7deg)}
.pup-s-sniff .pup-leg-fn,.pup-s-sniff .pup-leg-ff{transform:rotate(-30deg)}
.pup-s-sniff .pup-head{animation:pup-kf-sniff .5s ease-in-out infinite}
.pup-s-sniff .pup-tail{animation:pup-kf-wag .2s ease-in-out infinite alternate}
.pup-s-sniff .pup-ear{transform:rotate(-10deg)}
.pup-s-sniff .pup-ear2{transform:rotate(-16deg)}
@keyframes pup-kf-sniff{0%,100%{transform:rotate(15deg) translate(3px,6px)}50%{transform:rotate(19deg) translate(4.5px,7.5px)}}

/* hop / love / happy / roll act on the whole pose */
.pup-s-hop .pup-pose{animation:pup-kf-hop .62s cubic-bezier(.3,.6,.4,1) both}
.pup-s-hop .pup-shadow{animation:pup-kf-shadowhop .62s ease-in-out both}
.pup-s-hop .pup-leg-fn,.pup-s-hop .pup-leg-ff{animation:pup-kf-tuckf .62s ease-in-out both}
.pup-s-hop .pup-leg-bn,.pup-s-hop .pup-leg-bf{animation:pup-kf-tuckb .62s ease-in-out both}
.pup-s-hop .pup-ear{animation:pup-kf-earhop .62s ease-in-out both}
.pup-s-hop .pup-ear2{animation:pup-kf-earhop2 .62s ease-in-out both}
@keyframes pup-kf-hop{0%{transform:translateY(0) scale(1,1)}14%{transform:translateY(2px) scale(1.1,.86)}48%{transform:translateY(-20px) scale(.95,1.07)}82%{transform:translateY(0) scale(1.07,.92)}100%{transform:translateY(0) scale(1,1)}}
@keyframes pup-kf-shadowhop{0%,100%{transform:scaleX(1);opacity:1}48%{transform:scaleX(.6);opacity:.55}}
@keyframes pup-kf-tuckf{0%,100%{transform:rotate(0)}48%{transform:rotate(-50deg)}}
@keyframes pup-kf-tuckb{0%,100%{transform:rotate(0)}48%{transform:rotate(48deg)}}
@keyframes pup-kf-earhop{0%,100%{transform:rotate(0)}50%{transform:rotate(78deg)}78%{transform:rotate(-12deg)}}
@keyframes pup-kf-earhop2{0%,100%{transform:rotate(0)}50%{transform:rotate(-78deg)}78%{transform:rotate(12deg)}}

.pup-s-love .pup-pose{animation:pup-kf-love 1.1s ease-in-out both}
.pup-s-love .pup-tail,.pup-s-happy .pup-tail{animation:pup-kf-wag .14s ease-in-out infinite alternate}
.pup-s-love .pup-eyes,.pup-s-happy .pup-eyes{opacity:0}
.pup-s-love .pup-eyes-joy,.pup-s-happy .pup-eyes-joy{opacity:1}
.pup-s-love .pup-head{animation:pup-kf-nuzzle 1.1s ease-in-out both}
@keyframes pup-kf-love{0%,100%{transform:translateY(0)}20%{transform:translateY(-7px) rotate(-3deg)}40%{transform:translateY(0)}60%{transform:translateY(-5px) rotate(-2deg)}80%{transform:translateY(0)}}
@keyframes pup-kf-nuzzle{0%,100%{transform:rotate(0)}30%{transform:rotate(9deg) translateX(2px)}70%{transform:rotate(6deg) translateX(2px)}}

.pup-s-happy .pup-pose{animation:pup-kf-happy .95s cubic-bezier(.3,.6,.4,1) both}
.pup-s-happy .pup-shadow{animation:pup-kf-shadowhop .475s ease-in-out 2 both}
.pup-s-happy .pup-leg-fn,.pup-s-happy .pup-leg-ff{animation:pup-kf-tuckf .475s ease-in-out 2 both}
.pup-s-happy .pup-leg-bn,.pup-s-happy .pup-leg-bf{animation:pup-kf-tuckb .475s ease-in-out 2 both}
.pup-s-happy .pup-ear{animation:pup-kf-earhop .475s ease-in-out 2 both}
.pup-s-happy .pup-ear2{animation:pup-kf-earhop2 .475s ease-in-out 2 both}
@keyframes pup-kf-happy{0%{transform:translateY(0) scale(1,1)}8%{transform:translateY(2px) scale(1.12,.84)}28%{transform:translateY(-26px) scale(.94,1.08) rotate(-6deg)}48%{transform:translateY(0) scale(1.08,.9)}56%{transform:translateY(1px) scale(1.08,.9)}76%{transform:translateY(-17px) scale(.96,1.05) rotate(5deg)}94%{transform:translateY(0) scale(1.05,.95)}100%{transform:translateY(0) scale(1,1)}}

.pup-s-roll .pup-pose{animation:pup-kf-roll .95s cubic-bezier(.45,.05,.4,1) both}
.pup-s-roll .pup-leg-fn,.pup-s-roll .pup-leg-ff{transform:rotate(-55deg)}
.pup-s-roll .pup-leg-bn,.pup-s-roll .pup-leg-bf{transform:rotate(55deg)}
.pup-s-roll .pup-eyes{opacity:0}
.pup-s-roll .pup-eyes-joy{opacity:1}
.pup-s-roll .pup-ear{animation:pup-kf-ear .3s ease-in-out infinite}
.pup-s-roll .pup-ear2{animation:pup-kf-ear2 .3s ease-in-out infinite}
@keyframes pup-kf-roll{0%{transform:translateY(0) rotate(0)}15%{transform:translateY(-4px) rotate(30deg)}50%{transform:translateY(-15px) rotate(180deg)}85%{transform:translateY(-4px) rotate(330deg)}100%{transform:translateY(0) rotate(360deg)}}

/* idle (short pause): gentle breathing */
.pup-s-idle .pup-all{animation:pup-kf-breathe 1.4s ease-in-out infinite}
@keyframes pup-kf-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}

/* fx hearts */
.pup-fx{position:absolute; left:0; bottom:0; width:0; height:0; pointer-events:none; will-change:transform,opacity}
.pup-fx img{position:absolute; display:block; max-width:none}
.pup-fx-pop{animation:pup-kf-pop 1.15s cubic-bezier(.2,.8,.3,1) both}
.pup-fx-burst{animation:pup-kf-burst .95s cubic-bezier(.15,.8,.3,1) both}
@keyframes pup-kf-pop{0%{transform:translate(var(--pup-x),var(--pup-y)) scale(0)}22%{transform:translate(var(--pup-x),calc(var(--pup-y) - 10px)) scale(1.25)}40%{transform:translate(var(--pup-x),calc(var(--pup-y) - 14px)) scale(1)}100%{transform:translate(var(--pup-x),calc(var(--pup-y) - 34px)) scale(.9);opacity:0}}
@keyframes pup-kf-burst{0%{transform:translate(var(--pup-x),var(--pup-y)) scale(0) rotate(0)}30%{opacity:1}100%{transform:translate(calc(var(--pup-x) + var(--pup-dx)),calc(var(--pup-y) + var(--pup-dy))) scale(1) rotate(var(--pup-r));opacity:0}}

@media (prefers-reduced-motion:reduce){
  .pup-stage *,${S} .pup-c-heart,${S} .pup-c-peek{animation-duration:0s !important; animation-iteration-count:1 !important}
}
`;

  /* ---------- runner pups: every part is its own small picture, rasterised once and moved with transforms ---------- */
  var RLITE = true;
  var built = null;
  function part(cls, a, pivot) {
    return '<img class="' + cls + '" alt="" draggable="false" src="' + a.src + '" style="left:' + a.x + 'px;top:' + a.y + 'px;width:' + a.w + 'px;height:' + a.h + 'px' +
      (pivot ? ';transform-origin:' + f(pivot[0] * RZ - a.x) + 'px ' + f(pivot[1] * RZ - a.y) + 'px' : '') + '">';
  }
  function pupHtml(role) {
    var P = PAL[role], g = Sc(RZ), hm = headM(g, HX, HY, 0), fx = 6;
    var A = function (draw) { return art(RZ, RLITE, draw, null, 3); };
    var leg = function (cls, x, col) { return part('pup-leg ' + cls, A(function (S) { return limb(S, g, [x, 15, x, 38, 6.5, 6.5], col); }), [x, 13]); };
    var s = '<div class="pup-all">';
    s += '<div class="pup-side">';
    s += part('pup-tail', A(function (S) { return S.shape(tube(g, -40, -2, -55, -9, -60, -32, 6, 4), P.ear); }), [-38, 0]);
    s += leg('pup-leg-bf', -25, P.far) + leg('pup-leg-ff', 17, P.far);
    s += part('pup-body', A(function (S) { return S.shape(blob(cat(g, Tr(-11, 4), Rot(-5)), 0, 0, 36, 25, { egg: 0.16 }), P.fur); }));
    s += leg('pup-leg-bn', -34, P.fur) + leg('pup-leg-fn', 8, P.fur);
    s += '</div><div class="pup-sitb">';
    s += part('pup-tail', A(function (S) { return S.shape(tube(g, -24, 24, -42, 24, -48, 2, 6, 4), P.ear); }), [-22, 24]);
    s += part('pup-body', A(function (S) { return sitBody(S, g, role, true); }));
    s += '</div><div class="pup-head">';
    s += part('pup-hb', A(function (S) { return headBase(S, hm, role, fx, 0); }));
    s += part('pup-ear', A(function (S) { return ear(S, hm, role, EARS[0]); }), [HX - 41 * 1.06, HY - 27 * 1.04]);
    s += part('pup-ear2', A(function (S) { return ear(S, hm, role, EARS[1]); }), [HX + 41 * 1.06, HY - 27 * 1.04]);
    s += part('pup-face', A(function (S) { return face(S, hm, role, fx, 0); }));
    s += part('pup-eyes', A(function (S) { return eyes(S, hm, fx, 0, 'dot'); }));
    s += part('pup-eyes-joy', A(function (S) { return eyes(S, hm, fx, 0, 'joy'); }));
    return s + '</div></div>';
  }
  function build() {
    if (built) return built;
    seedN = 500;
    built = {
      groom: pupHtml('groom'), bride: pupHtml('bride'),
      shadow: art(RZ, RLITE, function (S) { return S.ground(Sc(RZ), 0, 0, 62, 7); }, null, 2),
      heart: art(0.62, RLITE, function (S) { return heart(S, cat(Rot(-8), Sc(0.62))); }, null, 2),
      heart2: art(0.5, RLITE, function (S) { return heart(S, cat(Rot(6), Sc(0.5)), HEART2); }, null, 2)
    };
    return built;
  }

  function mount(layer) {
    var GAP = 94, SPEED = 78;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var B = build();
    var stage = document.createElement('div');
    stage.className = 'pup-stage';
    layer.appendChild(stage);

    var W = layer.clientWidth || window.innerWidth || 390;
    var clock = 0, last = 0, raf = 0, running = false, dead = false;
    var fx = [];
    var lastMeet = -10;

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function clampX(x) { return Math.max(4, Math.min(W - PW - 4, x)); }

    function make(kind, x) {
      var el = document.createElement('div');
      el.innerHTML = '<img class="pup-shadow" alt="" draggable="false" src="' + B.shadow.src + '"><div class="pup-flip"><div class="pup-pose">' + B[kind] + '</div></div>';
      var p = { kind: kind, el: el, x: x, dir: 1, state: '', until: 0, target: x, met: false, wait: 0 };
      p.onTap = function (e) { if (e) e.preventDefault(); happy(p); };
      el.addEventListener('pointerdown', p.onTap);
      stage.appendChild(el);
      set(p, 'idle', 0.6);
      place(p);
      return p;
    }
    function cls(p) { p.el.className = 'pup-actor pup-' + p.kind + ' pup-s-' + p.state + (p.dir < 0 ? ' pup-left' : ''); }
    function set(p, state, dur) { p.state = state; p.until = clock + (dur || 0); cls(p); }
    function face(p, dir) { if (dir && dir !== p.dir) { p.dir = dir; cls(p); } }
    function place(p) { p.el.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,0,0)'; }

    function heartFx(x, y, burst) {
      var n = burst ? 3 : 1;
      for (var i = 0; i < n; i++) {
        var h = document.createElement('div'), a = burst && i !== 1 ? B.heart2 : B.heart;
        h.className = 'pup-fx ' + (burst ? 'pup-fx-burst' : 'pup-fx-pop');
        h.innerHTML = '<img alt="" src="' + a.src + '" style="left:' + a.x + 'px;top:' + a.y + 'px;width:' + a.w + 'px;height:' + a.h + 'px">';
        h.style.setProperty('--pup-x', x.toFixed(1) + 'px');
        h.style.setProperty('--pup-y', (-y).toFixed(1) + 'px');
        if (burst) {
          h.style.setProperty('--pup-dx', ((i - 1) * 26 + rnd(-5, 5)).toFixed(1) + 'px');
          h.style.setProperty('--pup-dy', (-(i === 1 ? 44 : 30) + rnd(-4, 4)).toFixed(1) + 'px');
          h.style.setProperty('--pup-r', ((i - 1) * 22) + 'deg');
          h.style.animationDelay = (i * 0.05) + 's';
        }
        stage.appendChild(h);
        fx.push({ el: h, die: clock + 1.4 });
      }
    }
    function happy(p) {
      if (dead) return;
      set(p, 'happy', 0.98);
      heartFx(p.x + PW / 2, 66, true);
    }

    var ACTS = [['sit', 26], ['look', 20], ['hop', 20], ['sniff', 18], ['roll', 10], ['idle', 6]];
    function pickAct() {
      var r = Math.random() * 100, a = 0;
      for (var i = 0; i < ACTS.length; i++) { a += ACTS[i][1]; if (r < a) return ACTS[i][0]; }
      return 'sit';
    }
    function act(p, name) {
      if (name === 'roll' && (p.x < 70 || p.x > W - PW - 70)) name = 'hop';
      switch (name) {
        case 'sit': set(p, 'sit', rnd(1.9, 3)); break;
        case 'look': set(p, 'look', 1.5); break;
        case 'hop': set(p, 'hop', 0.66); heartFx(p.x + PW / 2 + p.dir * 6, 72, false); break;
        case 'sniff': set(p, 'sniff', rnd(1.4, 2)); break;
        case 'roll': set(p, 'roll', 0.95); break;
        default: set(p, 'idle', rnd(0.5, 1));
      }
    }
    function newTarget(p) {
      var lo = 4, hi = W - PW - 4, t;
      if (Math.random() < 0.7) t = p.x < (lo + hi) / 2 ? rnd((lo + hi) / 2 + 20, hi) : rnd(lo, (lo + hi) / 2 - 20);
      else t = rnd(lo, hi);
      if (Math.abs(t - p.x) < 70) t = p.x + (p.x < (lo + hi) / 2 ? 90 : -90);
      p.target = clampX(t);
      face(p, p.target > p.x ? 1 : -1);
      set(p, 'run', 0);
    }
    function moveTo(p, tx, speed, dt) {
      var d = tx - p.x, step = speed * dt;
      face(p, d > 0 ? 1 : -1);
      if (Math.abs(d) <= step) { p.x = tx; return true; }
      p.x += (d > 0 ? 1 : -1) * step;
      return false;
    }

    var a = make('bride', clampX(W * 0.5));
    var b = make('groom', clampX(W * 0.5 - 110));
    var lead = a, chase = b;

    function meet() {
      var mid = (lead.x + chase.x) / 2 + PW / 2;
      face(lead, chase.x > lead.x ? 1 : -1);
      face(chase, lead.x > chase.x ? 1 : -1);
      set(lead, 'love', 1.25);
      set(chase, 'love', 1.25);
      heartFx(mid, 74, false);
      lastMeet = clock;
      if (Math.random() < 0.5) { var t = lead; lead = chase; chase = t; lead.until = clock + 1.25; chase.until = clock + 1.6; }
    }

    function tickLead(p, dt) {
      if (p.state === 'run') {
        if (moveTo(p, p.target, SPEED, dt)) { chase.met = false; act(p, pickAct()); }
      } else {
        if (p.state === 'roll') p.x = clampX(p.x + p.dir * 52 * dt);
        if (clock >= p.until) newTarget(p);
      }
    }
    function tickChase(p, dt) {
      var busy = p.state !== 'run' && clock < p.until;
      if (p.state === 'roll') p.x = clampX(p.x + p.dir * 52 * dt);
      if (busy) {
        // don't keep sitting for long once the other one has run off
        if (lead.state === 'run' && (p.state === 'sit' || p.state === 'sniff' || p.state === 'look' || p.state === 'idle') && p.until - clock > 0.45) p.until = clock + 0.45;
        return;
      }
      var want;
      if (lead.state === 'run') want = lead.x - lead.dir * GAP;
      else want = lead.x + (p.x >= lead.x ? 1 : -1) * (GAP - 6);
      want = clampX(want);
      if (lead.state !== 'run' && Math.abs(want - lead.x) < GAP - 26) want = clampX(lead.x + (lead.x > W / 2 ? -1 : 1) * (GAP - 6));
      var d = Math.abs(want - p.x);
      if (d > 5 || lead.state === 'run') {
        if (p.state !== 'run') set(p, 'run', 0);
        if (d > 3) moveTo(p, want, d > 40 ? SPEED * 1.32 : SPEED * 0.98, dt);
        else face(p, lead.dir);
      } else {
        face(p, lead.x > p.x ? 1 : -1);
        var canMeet = !p.met && lead.state !== 'happy' && lead.state !== 'roll' && lead.state !== 'hop' && clock - lastMeet > 5 && lead.until - clock > 0.5;
        p.met = true;
        if (canMeet && Math.random() < 0.6) meet();
        else {
          var n = pickAct();
          if (n === 'roll') n = 'sit';
          act(p, n);
        }
      }
    }

    function frameTick(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      clock += dt;
      if (!reduce) { tickLead(lead, dt); tickChase(chase, dt); place(a); place(b); }
      for (var i = fx.length - 1; i >= 0; i--) {
        if (clock > fx[i].die) { if (fx[i].el.parentNode) fx[i].el.parentNode.removeChild(fx[i].el); fx.splice(i, 1); }
      }
      raf = requestAnimationFrame(frameTick);
    }
    function onResize() {
      W = layer.clientWidth || window.innerWidth || W;
      a.x = clampX(a.x); b.x = clampX(b.x);
      a.target = clampX(a.target); b.target = clampX(b.target);
      place(a); place(b);
    }
    function start() {
      if (running || dead) return;
      running = true;
      stage.classList.remove('pup-paused');
      last = performance.now();
      raf = requestAnimationFrame(frameTick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      stage.classList.add('pup-paused');
    }
    window.addEventListener('resize', onResize);
    if (reduce) { set(a, 'sit', 1e9); set(b, 'sit', 1e9); face(b, 1); face(a, -1); }
    start();

    return {
      pause: stop,
      resume: start,
      destroy: function () {
        if (dead) return;
        stop();
        dead = true;
        window.removeEventListener('resize', onResize);
        a.el.removeEventListener('pointerdown', a.onTap);
        b.el.removeEventListener('pointerdown', b.onTap);
        fx.length = 0;
        if (stage.parentNode) stage.parentNode.removeChild(stage);
      }
    };
  }

  /* ---------- particles: sparse pencil-drawn hearts, bones and paw prints (thin line + light hatch) ---------- */
  var SPR = null, SPR_R = 22;
  function sprites() {
    if (SPR) return SPR;
    SPR = {};
    var I = Sc(1), mk = function (kind, col, paths) {
      var c = document.createElement('canvas'), k = 2, n = SPR_R * 2;
      c.width = c.height = n * k;
      var x = c.getContext('2d');
      x.scale(k, k); x.translate(SPR_R, SPR_R);
      x.lineCap = 'round'; x.lineJoin = 'round';
      for (var i = 0; i < paths.length; i++) {
        var p = new Path2D(paths[i]);
        x.save(); x.translate(0.9, 0.6); x.clip(p);
        x.rotate(-38 * Math.PI / 180); x.strokeStyle = col;
        for (var y = -SPR_R, j = 0; y < SPR_R; y += 2.9, j++) {
          x.globalAlpha = 0.5 + ((j * 37) % 5) * 0.1; x.lineWidth = 1 + ((j * 13) % 3) * 0.25;
          x.beginPath(); x.moveTo(-SPR_R, y); x.lineTo(SPR_R, y + ((j % 2) ? 0.5 : -0.4)); x.stroke();
        }
        x.restore();
        x.strokeStyle = INK; x.globalAlpha = 0.85; x.lineWidth = 1; x.setLineDash([26, 3, 14, 2.5]); x.stroke(p);
        x.save(); x.translate(-0.6, 0.7); x.globalAlpha = 0.32; x.lineWidth = 0.8; x.setLineDash([9, 7, 15, 9]); x.stroke(p); x.restore();
      }
      SPR[kind] = c;
    };
    seedN = 900;
    mk('heart', '#F2A19A', [heartD(cat(Rot(-8), Sc(0.82)))]);
    mk('bone', '#F3D08C', [poly(I, [[-8, -2.4], [-9.6, -5.6], [-13.4, -5.8], [-15, -2.4], [-13.4, 0], [-15, 2.6], [-13.2, 5.8], [-9.6, 5.6], [-8, 2.5], [0, 2.9], [8, 2.4], [9.6, 5.6], [13.4, 5.8], [15, 2.4], [13.4, 0],
      [15, -2.6], [13.2, -5.8], [9.6, -5.6], [8, -2.5], [0, -2.9]])]);
    mk('paw', '#E9B98A', [blob(I, 0, 4, 6.4, 5.2, { n: 9, egg: 0.12 }), blob(I, -8.2, -2.2, 2.7, 3.3, { n: 7, rot: -24 }), blob(I, -3, -6.8, 2.7, 3.4, { n: 7, rot: -8 }),
      blob(I, 3, -6.8, 2.7, 3.4, { n: 7, rot: 8 }), blob(I, 8.2, -2.2, 2.7, 3.3, { n: 7, rot: 24 })]);
    return SPR;
  }
  var seeded = 0;
  var particles = {
    count: 8,
    spawn: function (w, h) {
      var first = seeded < 8;
      seeded++;
      var kinds = ['heart', 'bone', 'paw', 'heart'];
      return {
        kind: kinds[(Math.random() * 4) | 0],
        x: Math.random() * w,
        y: first ? Math.random() * h : h + 26,
        vy: -(6 + Math.random() * 8),
        sway: 8 + Math.random() * 12,
        ph: Math.random() * 6.28,
        rot: (Math.random() - 0.5) * 1.2,
        vr: (Math.random() - 0.5) * 0.3,
        size: 0.75 + Math.random() * 0.4,
        a: 0.3 + Math.random() * 0.18,
        t: 0
      };
    },
    step: function (p, dt, w, h) {
      p.t += dt;
      p.y += p.vy * dt;
      p.x += Math.cos(p.t * 0.6 + p.ph) * p.sway * dt;
      p.rot += p.vr * dt;
      return p.y > -30 && p.x > -30 && p.x < w + 30;
    },
    draw: function (ctx, p) {
      var c = sprites()[p.kind];
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.size, p.size);
      ctx.globalAlpha = p.a * Math.min(1, p.t * 1.2 + 0.25);
      ctx.drawImage(c, -SPR_R, -SPR_R, SPR_R * 2, SPR_R * 2);
    }
  };

  window.WeddingThemes = window.WeddingThemes || {};
  window.WeddingThemes['puppy'] = {
    id: 'puppy',
    name: '可愛線條小狗',
    desc: '色鉛筆手繪、軟萌療癒',
    themeColor: PAPER,
    fonts: [
      'https://fonts.googleapis.com/css2?family=Iansui&display=swap',
      'https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap'
    ],
    css: css,
    swatch: swatch,
    ornament: ornament,
    lockArt: lockArt,
    cornerMascot: cornerMascot,
    headingIcon: headingIcon,
    particles: particles,
    runner: { mount: mount }
  };
})();
