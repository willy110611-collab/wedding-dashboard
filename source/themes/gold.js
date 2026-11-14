/* 金色奢華 — antique gold foil on ivory, satin champagne panels, art-deco filigree. Public file: contains no data. */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};
  var S = 'html[data-theme="gold"]';

  /* foil text gradient is periodic (0–38.5% == 61.5–100%) so the light sweep loops without a seam */
  var css = `
${S}{
  --bg1:#FDF8EC; --bg2:#F8EDD3; --bg3:#F1DEB0; --bg4:#FBF3E0;
  --orb1:rgba(240,214,150,.5); --orb2:rgba(255,246,222,.75); --orb3:rgba(226,190,112,.34);
  --text:#3B2A1A; --text-soft:#66503A;
  --accent1:#B8913F; --accent2:#9C7A35;
  --foil:linear-gradient(135deg,#7A5A22 0%,#E6C877 16%,#A8822F 32%,#F6E3A4 48%,#9C7A35 64%,#DDBB66 82%,#7A5A22 100%);
  --ivory:linear-gradient(155deg,#FFFEF9 0%,#FDF8EC 55%,#F9F0DC 100%);
  --card-bg:var(--ivory) padding-box,var(--foil) border-box;
  --card-border:transparent;
  --card-shadow:0 28px 46px -32px rgba(96,66,14,.6),0 3px 8px -3px rgba(96,66,14,.16),inset 0 1px 0 #fff,inset 0 -1px 0 rgba(168,130,47,.22);
  --card-radius:12px;
  --chip-bg:#FFFCF3; --chip-text:#66503A;
  --danger:#8C3A48;
  --font-body:"Noto Serif TC","Songti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-display:"Cormorant Garamond","Cormorant","Hoefler Text","Baskerville","Times New Roman","Noto Serif TC","Songti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-script:"Great Vibes","Pinyon Script","Snell Roundhand","Apple Chancery","Cormorant Garamond","Hoefler Text","Baskerville","Times New Roman",serif;

  --ink-3:#8A7353; --accent-ink:#76561C;
  --hair:rgba(168,130,47,.62); --hair-2:rgba(168,130,47,.34); --hair-b:rgba(168,130,47,.2);
  --mute:rgba(150,122,70,.42); --glow:rgba(226,190,112,.42);
  --bg-grad:linear-gradient(125deg,#FEFAF0 0%,#F9EFD6 16%,#F2DFB0 32%,#FCF5E3 48%,#EDD59C 64%,#F8ECCF 82%,#FEFAF0 100%);
  --soft-bg:linear-gradient(155deg,#FFFEFA,#FBF4E3) padding-box,var(--foil) border-box; --soft-radius:10px;
  --soft-shadow:0 16px 26px -22px rgba(96,66,14,.55),inset 0 1px 0 #fff,inset 0 -1px 0 rgba(168,130,47,.18);
  --blur:none;
  --grad-text:linear-gradient(100deg,#6E5120 0%,#B08A3C 13%,#8A6A2F 26%,#6E5120 38.5%,#7A5A22 47%,#B8913F 49%,#F6E3A4 50%,#B8913F 51%,#7A5A22 53%,#6E5120 61.5%,#B08A3C 74.5%,#8A6A2F 87.5%,#6E5120 100%);
  --grad-bar:linear-gradient(180deg,rgba(255,250,225,.75) 0%,rgba(255,250,225,0) 46%,rgba(80,54,10,.26) 100%),linear-gradient(90deg,#8A6A2F 0%,#C9A24B 26%,#F3DE9A 50%,#D4AF5A 72%,#9C7A35 100%);
  --grad-deep:linear-gradient(180deg,rgba(255,240,200,.4) 0%,rgba(255,240,200,0) 46%,rgba(40,24,0,.3) 100%),linear-gradient(90deg,#5E4315,#8A6A2F 55%,#6E5120);
  --grad-pale:linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0) 50%,rgba(120,90,30,.16)),linear-gradient(90deg,#EFDCA6,#DDBE74);
  --g-m:linear-gradient(180deg,rgba(255,250,225,.6),rgba(255,250,225,0) 50%,rgba(80,54,10,.2)),linear-gradient(90deg,#E3C678,#B08A3C);
  --g-f:linear-gradient(180deg,rgba(255,240,235,.55),rgba(255,240,235,0) 50%,rgba(80,30,30,.2)),linear-gradient(90deg,#D9A49C,#A8626A);
  --g-c:linear-gradient(180deg,rgba(255,250,240,.5),rgba(255,250,240,0) 50%,rgba(40,28,14,.22)),linear-gradient(90deg,#A8947A,#6B5642);
  --d-m:#B8913F; --d-f:#B5727A; --d-c:#7A6650;
  --track:#F3EBD8; --ring-track:#EDE0C0;
  --ring-1:#7A5A22; --ring-2:#E9CC7A; --ring-3:#9C7A35;
  --btn:linear-gradient(100deg,#9C7A35 0%,#D4AF5A 20%,#F6E3A4 42%,#D9B761 60%,#A8822F 80%,#D4AF5A 100%); --btn-ink:#2E1F0E; --btn-ts:0 1px 0 rgba(255,244,205,.7);
  --btn-sh:0 16px 26px -16px rgba(96,66,14,.85),inset 0 1px 0 rgba(255,250,225,.85),inset 0 -1px 0 rgba(80,54,10,.4),inset 0 0 0 1px rgba(110,81,32,.55);
  --on:linear-gradient(100deg,#B08A3C,#EBD189 50%,#B8913F); --on-ink:#2E1F0E; --on-ts:0 1px 0 rgba(255,244,205,.6);
  --field:#FFFDF6; --field-f:#FFFEFA;
  --c-gold-bg:linear-gradient(120deg,#F8EBC2,#E6CB85); --c-gold-ink:#553C10;
  --c-blush-bg:linear-gradient(120deg,#F7E9E2,#EBD0C8); --c-blush-ink:#7A3E44;
  --c-rose-bg:linear-gradient(120deg,#A04E5B,#7E3040); --c-rose-ink:#FFF6E6;
  --c-mist-bg:linear-gradient(120deg,#F3ECDD,#E4D8C0); --c-mist-ink:#5E4D38;
  --alert-bg:linear-gradient(120deg,#F9ECE8,#FFFBF4); --alert-ink:#8C3A48;
  --booked-item:var(--soft-bg);
  --bar-bg:rgba(253,248,236,.9); --tabbar-bg:rgba(254,250,240,.97); --sheet-bg:linear-gradient(160deg,#FFFEFA,#FAF1DC); --scrim:rgba(46,31,14,.42);
  --latin-style:normal; --num-w:600; --head-w:500; --orn-h:20px;
  --satin:linear-gradient(112deg,rgba(255,255,255,0) 0%,rgba(255,252,236,.6) 14%,rgba(255,255,255,0) 30%,rgba(120,84,20,.12) 46%,rgba(255,250,228,.5) 62%,rgba(255,255,255,0) 78%,rgba(120,84,20,.1) 90%,rgba(255,255,255,0) 100%);
}
@keyframes goldSweep{0%{background-position:100% 50%}58%,100%{background-position:0% 50%}}
@keyframes goldSatin{0%{transform:translate3d(-18%,0,0)}100%{transform:translate3d(18%,0,0)}}
@keyframes goldPanel{0%,100%{background-position:0% 0,0 0,0 0}50%{background-position:100% 0,0 0,0 0}}
@keyframes goldGlint{0%,55%{transform:translateX(-130%)}85%,100%{transform:translateX(130%)}}

/* page: ivory -> champagne -> honey, with a slow diagonal satin sheen */
${S} .bg{background:#F8EDD3}
${S} .bg::after{content:"";position:absolute;inset:-20% -60%;pointer-events:none;will-change:transform;
  background:repeating-linear-gradient(112deg,rgba(255,255,255,0) 0,rgba(255,255,255,.34) 70px,rgba(255,255,255,0) 150px,rgba(150,108,30,.07) 230px,rgba(255,255,255,0) 310px);
  animation:goldSatin 34s ease-in-out infinite alternate}

/* gold foil text with a slow light sweep */
${S} .gt{background-size:260% 100%;filter:drop-shadow(0 .5px .4px rgba(80,54,10,.4));animation:goldSweep 7.5s cubic-bezier(.4,0,.25,1) infinite}
${S} .hero-title,${S} .lock-title,${S} .page-title .gt,${S} .countdown-card .num,${S} .bignum,${S} .ring .num{filter:drop-shadow(0 1px 0 rgba(255,252,236,.9)) drop-shadow(0 2px 2px rgba(80,54,10,.22))}
${S} .hero-title,${S} .lock-title{padding:.12em .1em 0}

/* cards: foil rim (via border-box layer), embossed, fine inner hairline */
${S} .panel::after,${S} .stat-tile::after,${S} .booked::after,${S} .lock-card::after,${S} .countdown-card::after{content:"";position:absolute;inset:4px;
  border-radius:calc(var(--card-radius) - 4px);border:1px solid rgba(168,130,47,.36);pointer-events:none}
${S} .lock-card::after,${S} .countdown-card::after{inset:5px;border-color:rgba(94,67,21,.5);box-shadow:inset 0 0 0 1px rgba(255,250,228,.55),0 0 0 1px rgba(255,250,228,.35)}

/* hero panels: champagne-to-gold satin */
${S} .countdown-card,${S} .lock-card{
  background:var(--satin) padding-box,linear-gradient(160deg,#FBEFCB 0%,#EBD08D 34%,#D9B865 58%,#E9CD88 80%,#F6E6B8 100%) padding-box,var(--foil) border-box;
  background-size:220% 100%,100% 100%,100% 100%;animation:goldPanel 16s ease-in-out infinite;
  box-shadow:0 34px 54px -30px rgba(80,54,10,.75),0 4px 10px -4px rgba(80,54,10,.25),inset 0 1px 0 rgba(255,252,236,.95),inset 0 -1px 0 rgba(94,67,21,.35)}
${S} .lock-card{animation:rise 1.2s cubic-bezier(.2,.7,.2,1) both,goldPanel 16s ease-in-out infinite;padding-top:34px;
  background:var(--satin) padding-box,linear-gradient(165deg,#FDF5DC 0%,#F3E0AC 38%,#E6CB85 66%,#F1DDA6 86%,#FBF0CF 100%) padding-box,var(--foil) border-box;background-size:220% 100%,100% 100%,100% 100%}
${S} .countdown-card{padding:24px 14px 18px}
${S} .countdown-card .gt,${S} .lock-card .gt{background-image:linear-gradient(100deg,#3F2A0C 0%,#76561C 13%,#553C10 26%,#3F2A0C 38.5%,#4A3414 47%,#8A6A2F 49%,#FFF3C8 50%,#8A6A2F 51%,#4A3414 53%,#3F2A0C 61.5%,#76561C 74.5%,#553C10 87.5%,#3F2A0C 100%)}
${S} .countdown-card .num,${S} .lock-title{filter:drop-shadow(0 1px 0 rgba(255,250,225,.75))}
${S} .countdown-card>div>span:last-child{color:#4A3414;font-weight:500}
${S} .countdown-card>div+div::before{background:linear-gradient(180deg,transparent,rgba(94,67,21,.6),transparent);box-shadow:1px 0 0 rgba(255,250,228,.5)}
${S} .lock-date{color:#33230F;font-weight:600}
${S} .lock-venue,${S} .remember{color:#4A3414}
${S} .lock-card .orn{color:#76561C}
${S} .lock-card .orn svg{filter:brightness(.6) saturate(1.25)}
${S} .lock-card .field input[type=password]{box-shadow:inset 0 0 0 1px rgba(94,67,21,.6),inset 0 2px 6px rgba(80,54,10,.14),0 1px 0 rgba(255,250,228,.7)}
${S} .lock-card .msg{color:#7A2634;font-weight:500}
${S} .lock-art svg{max-width:220px;max-height:126px}
${S} .corner-slot{right:50%;transform:translateX(50%);bottom:calc(100% - 8px)}
${S} .corner-slot svg{height:34px}
${S} .countdown-card.has-corner{margin-top:48px}

/* engraved small caps */
${S} .page-subtitle{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.52em;padding-left:.52em;opacity:1;margin-bottom:4px}
${S} .count-cap{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.34em;padding-left:.34em;margin-top:16px}
${S} .booked .lab{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.36em}
${S} .sub small{font-weight:600;font-size:13px;letter-spacing:.14em}
${S} .foot .latin{font-size:12px;letter-spacing:.2em;text-transform:uppercase}
${S} .page-title{letter-spacing:.4em;padding-left:.4em}
${S} .hero-line b{font-weight:600;letter-spacing:.36em;padding-left:.36em}
${S} .sum .lab,${S} .g5 .lab{letter-spacing:.3em;padding-left:.3em;font-weight:500}
${S} .stat-tile .lab{letter-spacing:.12em}
${S} .stat-tile .go{letter-spacing:.24em}
${S} .sub{letter-spacing:.3em}
${S} .sub::before{content:"";flex:none;width:6px;height:6px;margin:0 2px;transform:rotate(45deg);background:linear-gradient(135deg,#E6C877,#8A6A2F)}
${S} .sub::after{height:3px;background:linear-gradient(90deg,var(--hair),transparent) top/100% 1px no-repeat,linear-gradient(90deg,var(--hair-2),transparent 70%) bottom/100% 1px no-repeat}
${S} .stage-tag{letter-spacing:.3em}
${S} .done .name::before{content:"◆";font-size:8px;color:#B08A3C}

/* ornament rules: double hairlines */
${S} .orn{max-width:280px;gap:8px}
${S} .head .orn{max-width:250px;margin-top:10px}
${S} .orn::before{height:4px;background:linear-gradient(90deg,transparent,currentColor) top/100% 1px no-repeat,linear-gradient(90deg,transparent 35%,currentColor) bottom/100% 1px no-repeat}
${S} .orn::after{height:4px;background:linear-gradient(90deg,currentColor,transparent) top/100% 1px no-repeat,linear-gradient(90deg,currentColor,transparent 65%) bottom/100% 1px no-repeat}

/* bars + rings */
${S} .progress-bar{box-shadow:inset 0 0 0 1px rgba(168,130,47,.4),inset 0 2px 3px rgba(96,66,14,.16)}
${S} .progress-bar i{overflow:hidden;box-shadow:inset 0 0 0 .5px rgba(94,67,21,.55)}
${S} .progress-bar i::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,252,232,.85) 50%,transparent 70%);animation:goldGlint 7.5s ease-in-out infinite}
${S} .progress-bar i.pale::after{display:none}
${S} .ring circle.fg{filter:drop-shadow(0 1px 1px rgba(80,54,10,.35))}
${S} .split{box-shadow:0 0 0 1px rgba(168,130,47,.4);padding:0}
${S} .tab::before{height:3px;border-radius:0 0 2px 2px}
${S} .tabbar{border-top:1px solid transparent;border-image:linear-gradient(90deg,#9C7A35,#F3DE9A 30%,#B08A3C 50%,#F3DE9A 70%,#9C7A35) 1;box-shadow:0 -12px 30px -20px rgba(96,66,14,.6),inset 0 1px 0 #fff}
${S} .topbar{border-bottom:1px solid transparent;border-image:linear-gradient(90deg,transparent,#B08A3C 25%,#EBD189 50%,#B08A3C 75%,transparent) 1}
${S} .topbar-title{letter-spacing:.5em;padding-left:.5em}
${S} .tab{font-weight:500}
${S} .tab svg{stroke-width:1.2}
@media (min-width:900px){${S} .tabbar{border-image:none;border:1px solid rgba(168,130,47,.55)}${S} .topbar{border-image:none;border:0}}

/* chips, buttons, fields */
${S} .chip{font-weight:500;letter-spacing:.1em;box-shadow:inset 0 0 0 1px rgba(168,130,47,.7)}
${S} .chip.gold{box-shadow:inset 0 0 0 1px rgba(110,81,32,.45),inset 0 1px 0 rgba(255,252,236,.8)}
${S} .chip.blush,${S} .chip.mist{box-shadow:inset 0 0 0 1px rgba(110,81,32,.18)}
${S} .chip.rose{box-shadow:inset 0 1px 0 rgba(255,220,215,.35)}
${S} .btn-primary{font-weight:600;letter-spacing:.62em;padding-left:.62em;background-size:220% 100%}
${S} .remember input:checked::after{border-color:#2E1F0E}
${S} .remember input{box-shadow:inset 0 0 0 1px #76561C}
${S} .fchips button.on{box-shadow:inset 0 0 0 1px rgba(110,81,32,.55),inset 0 1px 0 rgba(255,250,225,.8)}
${S} .gear.fab{box-shadow:inset 0 0 0 1px rgba(168,130,47,.75),0 8px 18px -10px rgba(96,66,14,.7)}
${S} .gear{color:#76561C}
${S} .alert{border-radius:10px}
${S} .settings-sheet{border-radius:18px 18px 0 0;box-shadow:0 -20px 50px -22px rgba(60,40,10,.6),inset 0 1px 0 #fff,inset 0 2px 0 rgba(201,162,75,.7)}
${S} .sw{border-radius:12px}
${S} .sw-pv{border-radius:8px}
${S} .gold-comet{position:absolute;left:0;bottom:0;width:100%;height:240px;pointer-events:none}
`;

  /* ---------- art-deco line art ---------- */
  function f(n) { return (Math.round(n * 10) / 10).toString(); }
  function dia(x, y, rx, ry) { return 'M' + f(x) + ' ' + f(y - ry) + 'l' + f(rx) + ' ' + f(ry) + '-' + f(rx) + ' ' + f(ry) + '-' + f(rx) + '-' + f(ry) + 'z'; }
  function star(x, y, s) {
    var k = s * 0.22;
    return 'M' + f(x) + ' ' + f(y - s) + 'c' + f(k * 0.5) + ' ' + f(s - k) + ' ' + f(k) + ' ' + f(s - k * 0.5) + ' ' + f(s) + ' ' + f(s) +
      'c-' + f(s - k) + ' ' + f(k * 0.5) + '-' + f(s - k * 0.5) + ' ' + f(k) + '-' + f(s) + ' ' + f(s) +
      'c-' + f(k * 0.5) + '-' + f(s - k) + '-' + f(k) + '-' + f(s - k * 0.5) + '-' + f(s) + '-' + f(s) +
      'c' + f(s - k) + '-' + f(k * 0.5) + ' ' + f(s - k * 0.5) + '-' + f(k) + ' ' + f(s) + '-' + f(s) + 'z';
  }
  function fan(cx, cy, r0, lens, a0, a1) {
    var d = '', n = lens.length;
    for (var i = 0; i < n; i++) {
      var a = a0 + (a1 - a0) * i / (n - 1), c = Math.cos(a), s = Math.sin(a);
      d += 'M' + f(cx + r0 * c) + ' ' + f(cy + r0 * s) + 'L' + f(cx + lens[i] * c) + ' ' + f(cy + lens[i] * s);
    }
    return d;
  }
  function foilDef(id, x1, y1, x2, y2, dark) {
    var st = dark
      ? ['#5E4315', '#B08A3C', '#76561C', '#D9B761', '#6E5120', '#A8822F', '#5E4315']
      : ['#8A6A2F', '#DDBB66', '#9C7A35', '#F3DE9A', '#A8822F', '#D4AF5A', '#8A6A2F'];
    var s = '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">';
    for (var i = 0; i < st.length; i++) s += '<stop offset="' + f(i / (st.length - 1)) + '" stop-color="' + st[i] + '"/>';
    return s + '</linearGradient>';
  }
  var PI = Math.PI;

  /* multi-instance art (ornament, headingIcon) must not rely on <defs> gradients: a gradient that lives in a
     hidden page stops painting everywhere. Foil is faked with per-segment tones instead. */
  var TONES = [[122, 90, 34], [201, 162, 75], [138, 106, 47], [224, 192, 108], [138, 106, 47], [201, 162, 75], [122, 90, 34]];
  function tone(u) {
    u = Math.max(0, Math.min(0.9999, u)) * (TONES.length - 1);
    var i = Math.floor(u), t = u - i, a = TONES[i], b = TONES[i + 1];
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function hline(x1, x2, y, sw, W) {
    var s = '', step = 6;
    for (var x = x1; x < x2; x += step) { var e = Math.min(x2, x + step + 0.3); s += '<path d="M' + f(x) + ' ' + f(y) + 'H' + f(e) + '" stroke="' + tone((x + e) / 2 / W) + '" stroke-width="' + sw + '"/>'; }
    return s;
  }
  function rays(cx, cy, r0, lens, a0, a1, sw, W) {
    var s = '', n = lens.length;
    for (var i = 0; i < n; i++) {
      var a = a0 + (a1 - a0) * i / (n - 1), c = Math.cos(a), sn = Math.sin(a);
      s += '<path d="M' + f(cx + r0 * c) + ' ' + f(cy + r0 * sn) + 'L' + f(cx + lens[i] * c) + ' ' + f(cy + lens[i] * sn) + '" stroke="' + tone(i % 2 ? 0.18 + 0.1 * (i % 3) : 0.5) + '" stroke-width="' + sw + '"/>';
    }
    return s;
  }

  /* ornament: symmetric deco fan / sunburst with double-hairline side filigree */
  var ornament = (function () {
    var lens = [], i, W = 132;
    for (i = 0; i < 13; i++) lens.push(i % 2 ? 11.5 : (i === 6 ? 17 : 14.5));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 22" width="132" height="22" aria-hidden="true">' +
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      rays(66, 20, 5.5, lens, PI * 1.06, PI * 1.94, 0.9, W) +
      '<path d="M60.500 20a5.500 5.500 0 0 1 11 0" stroke="#8A6A2F" stroke-width=".9"/>' +
      hline(47.5, 84.5, 20, 1.1, W) + hline(2, 38, 17.5, 0.9, W) + hline(94, 130, 17.5, 0.9, W) + hline(12, 40, 20.5, 0.6, W) + hline(92, 120, 20.5, 0.6, W) +
      '<path d="' + dia(43.5, 17.5, 3, 3.6) + dia(88.5, 17.5, 3, 3.6) + '" stroke="#8A6A2F" stroke-width=".9"/>' +
      '</g><path d="' + dia(66, 20, 2.2, 2.2) + dia(66, 1.6, 1.1, 1.5) + '" fill="#7A5A22"/>' +
      '<path d="' + dia(43.5, 17.5, 1.2, 1.5) + dia(88.5, 17.5, 1.2, 1.5) + '" fill="#C9A24B"/>' +
      '<circle cx="8" cy="20.500" r=".8" fill="#B08A3C"/><circle cx="124" cy="20.500" r=".8" fill="#B08A3C"/></svg>';
  })();

  /* lock art: deco arch with sunburst rays, two interlocking rings, diamonds */
  var lockArt = (function () {
    var cx = 110, cy = 80, lens = [], i;
    for (i = 0; i < 25; i++) lens.push(i % 4 === 0 ? 57 : (i % 2 === 0 ? 51 : 44));
    var dots = '';
    for (i = 0; i < 25; i += 4) { var a = PI + PI * i / 24; dots += '<circle cx="' + f(cx + 59.5 * Math.cos(a)) + '" cy="' + f(cy + 59.5 * Math.sin(a)) + '" r="1"/>'; }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 126" width="220" height="126" aria-hidden="true">' +
      '<defs>' + foilDef('goldLkG', 20, 0, 200, 126, true) +
      '<linearGradient id="goldLkR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBEBB4"/><stop offset=".3" stop-color="#B8913F"/><stop offset=".55" stop-color="#6E5120"/><stop offset=".8" stop-color="#D9B761"/><stop offset="1" stop-color="#8A6A2F"/></linearGradient></defs>' +
      '<g fill="none" stroke="url(#goldLkG)" stroke-linecap="round" stroke-linejoin="round">' +
      /* rays */
      '<path d="' + fan(cx, cy, 30, lens, PI, PI * 2) + '" stroke-width=".7"/>' +
      /* arch: double hairline + stepped shoulders */
      '<path d="M44 102V80a66 66 0 0 1 132 0v22" stroke-width="1.300"/>' +
      '<path d="M47.500 102V80a62.500 62.500 0 0 1 125 0v22" stroke-width=".55"/>' +
      '<path d="M80 80a30 30 0 0 1 60 0" stroke-width=".55"/>' +
      '<path d="M44 86H24M44 92H30M44 98H36M176 86h20M176 92h14M176 98h8" stroke-width=".8"/>' +
      '<path d="M24 86v-5M196 86v-5" stroke-width=".8"/>' +
      /* plinth: double line + feet */
      '<path d="M18 102h184" stroke-width="1.300"/><path d="M26 105.500h168" stroke-width=".55"/>' +
      '<path d="M40 109h46M134 109h46" stroke-width=".55"/>' +
      '<path d="' + dia(110, 109, 5.5, 5.5) + dia(94, 109, 2.2, 2.6) + dia(126, 109, 2.2, 2.6) + '" stroke-width=".8"/>' +
      /* keystone */
      '<path d="' + dia(110, 13, 5, 8) + '" stroke-width=".9" fill="#FFF6D6"/>' +
      '<path d="M100 20l-6-3M120 20l6-3M97 25l-4-1M123 25l4-1" stroke-width=".6"/>' +
      '</g>' +
      '<g fill="url(#goldLkG)">' + dots +
      '<path d="' + dia(110, 109, 2.4, 2.4) + dia(110, 13, 1.8, 3.2) + dia(18, 102, 2, 2.6) + dia(202, 102, 2, 2.6) + dia(24, 79, 1.6, 2.2) + dia(196, 79, 1.6, 2.2) + '"/>' +
      '<path d="' + star(28, 30, 5) + star(192, 30, 5) + star(46, 14, 2.6) + star(174, 14, 2.6) + '"/></g>' +
      /* rings */
      '<g fill="none" stroke-linecap="round">' +
      '<circle cx="119.500" cy="82" r="14.500" stroke="url(#goldLkR)" stroke-width="3.200"/><circle cx="119.500" cy="82" r="14.500" stroke="#FFF4C8" stroke-opacity=".75" stroke-width=".6"/>' +
      '<circle cx="100.500" cy="82" r="14.500" stroke="url(#goldLkR)" stroke-width="3.200"/><circle cx="100.500" cy="82" r="14.500" stroke="#FFF4C8" stroke-opacity=".75" stroke-width=".6"/>' +
      '<path d="M107.300 74.200A14.500 14.500 0 0 1 113.800 68.700" stroke="url(#goldLkR)" stroke-width="3.200" stroke-linecap="butt"/><path d="M107.300 74.200A14.500 14.500 0 0 1 113.800 68.700" stroke="#FFF4C8" stroke-opacity=".75" stroke-width=".6"/>' +
      '</g>' +
      '<path d="' + dia(100.5, 63.2, 3.6, 4.4) + '" fill="#FFF8DC" stroke="#6E5120" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="M97.800 62.400h5.400M100.500 62.400v4.800" stroke="#8A6A2F" stroke-width=".45" fill="none"/></svg>';
  })();

  /* heading icon: small faceted deco diamond */
  var headingIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24" width="20" height="24" aria-hidden="true">' +
    '<path d="M10 2l7 10-7 10z" fill="#E6C877"/><path d="M10 2L3 12l7 10z" fill="#9C7A35"/>' +
    '<path d="M10 2l7 10-7-2.500z" fill="#F6E3A4"/><path d="M10 2L3 12l7-2.500z" fill="#C9A24B"/>' +
    '<path d="' + dia(10, 12, 7, 10) + 'M3 12l7-2.500 7 2.500M10 9.500V22" fill="none" stroke="#6E5120" stroke-width=".7" stroke-linejoin="round"/></svg>';

  /* crest above the countdown panel: little sunburst with a diamond and two sparkles */
  var cornerMascot = (function () {
    var lens = [], i;
    for (i = 0; i < 11; i++) lens.push(i % 2 ? 17 : (i === 5 ? 25 : 21));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 34" width="84" height="34" aria-hidden="true">' +
      '<defs>' + foilDef('goldCrG', 0, 0, 84, 34, false) + '</defs>' +
      '<g fill="none" stroke="url(#goldCrG)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + fan(42, 32, 9, lens, PI * 1.1, PI * 1.9) + '"/><path d="M33 32a9 9 0 0 1 18 0"/><path d="M14 32h56" stroke-width="1.200"/></g>' +
      '<g fill="url(#goldCrG)"><path d="' + dia(42, 28.5, 3, 3.4) + star(14, 17, 5) + star(70, 17, 5) + star(24, 7, 2.4) + star(60, 7, 2.4) + '"/></g></svg>';
  })();

  var swatch = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<defs><linearGradient id="goldSwBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDF6E2"/><stop offset=".5" stop-color="#F0DBA2"/><stop offset="1" stop-color="#DDBB66"/></linearGradient>' +
    '<linearGradient id="goldSwF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5A22"/><stop offset=".22" stop-color="#E6C877"/><stop offset=".42" stop-color="#A8822F"/><stop offset=".6" stop-color="#F6E3A4"/><stop offset=".8" stop-color="#9C7A35"/><stop offset="1" stop-color="#D4AF5A"/></linearGradient>' +
    '<linearGradient id="goldSwP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBEFCB"/><stop offset=".45" stop-color="#E3C377"/><stop offset=".7" stop-color="#F3E0A8"/><stop offset="1" stop-color="#D2AC5A"/></linearGradient>' +
    '<linearGradient id="goldSwT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3F2A0C"/><stop offset=".5" stop-color="#8A6A2F"/><stop offset="1" stop-color="#4A3414"/></linearGradient></defs>' +
    '<rect width="120" height="80" fill="url(#goldSwBg)"/>' +
    '<path d="M-10 60L50-10h14L4 60zM60 90l60-70v16L74 90z" fill="#fff" opacity=".28"/>' +
    '<rect x="11" y="12" width="98" height="42" rx="5" fill="url(#goldSwP)" stroke="url(#goldSwF)" stroke-width="1.400"/>' +
    '<rect x="14" y="15" width="92" height="36" rx="3" fill="none" stroke="#6E5120" stroke-opacity=".55" stroke-width=".5"/>' +
    '<text x="22" y="42" font-family="Georgia,serif" font-weight="bold" font-size="22" fill="url(#goldSwT)">329</text>' +
    '<g fill="none" stroke="url(#goldSwF)" stroke-width="2"><circle cx="78" cy="34" r="8"/><circle cx="89" cy="34" r="8"/></g>' +
    '<path d="' + star(101, 21, 4) + '" fill="#FFF8DC" stroke="#8A6A2F" stroke-width=".4"/>' +
    '<rect x="11" y="63" width="66" height="5" rx="2.500" fill="#EFE3C6" stroke="#B08A3C" stroke-opacity=".5" stroke-width=".5"/><rect x="11" y="63" width="42" height="5" rx="2.500" fill="url(#goldSwF)"/>' +
    '<path d="' + dia(98, 65.5, 4, 5) + '" fill="none" stroke="url(#goldSwF)" stroke-width="1"/><path d="' + dia(98, 65.5, 1.6, 2) + '" fill="url(#goldSwF)"/>' +
    '<path d="M84 65.500h8M104 65.500h8" stroke="#9C7A35" stroke-width=".7"/></svg>';

  /* ---------- particles: tumbling gold-leaf flakes + a few twinkling stars ---------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var COUNT = 22, seeded = 0;
  function mix(a, b, t) { return Math.round(a + (b - a) * t); }
  var particles = {
    count: COUNT,
    init: function () { seeded = 0; },
    spawn: function (w, h) {
      var first = seeded < COUNT; seeded++;
      if (Math.random() < 0.24) {
        return { star: true, x: rnd(0, w), y: rnd(0, h), s: rnd(2.2, 4.6), ph: rnd(0, 6.28), sw: rnd(1.2, 2.4), life: rnd(5, 10), t: 0 };
      }
      var n = 4 + Math.floor(Math.random() * 3), v = [], depth = rnd(0.55, 1);
      for (var i = 0; i < n; i++) { var a = (i + rnd(-0.28, 0.28)) / n * 6.2832, r = rnd(0.5, 1); v.push(Math.cos(a) * r, Math.sin(a) * r * rnd(0.6, 1)); }
      return {
        star: false, v: v, s: rnd(4, 8.5) * depth, depth: depth,
        x: rnd(-10, w + 10), y: first ? rnd(-20, h) : rnd(-60, -12),
        vy: rnd(13, 26) * depth, sway: rnd(8, 22), sf: rnd(0.3, 0.8), ph: rnd(0, 6.28),
        rot: rnd(0, 6.28), vr: rnd(0.25, 0.9) * (Math.random() < 0.5 ? -1 : 1),
        tum: rnd(0, 6.28), vt: rnd(0.9, 2.3), t: 0
      };
    },
    step: function (p, dt, w, h) {
      p.t += dt;
      if (p.star) { p.ph += p.sw * dt; return p.t < p.life; }
      p.ph += p.sf * dt; p.rot += p.vr * dt; p.tum += p.vt * dt;
      p.y += p.vy * dt; p.x += Math.cos(p.ph) * p.sway * dt;
      return p.y < h + 20;
    },
    draw: function (ctx, p) {
      if (p.star) {
        var edge = Math.max(0, Math.min(1, p.t / 1.2, (p.life - p.t) / 1.2)), tw = edge * Math.pow(0.5 + 0.5 * Math.sin(p.ph), 2);
        var r = p.s * 2.8, g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, 'rgba(255,240,190,' + (tw * 0.6).toFixed(3) + ')'); g.addColorStop(1, 'rgba(230,196,110,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        var s = p.s * (0.6 + 0.6 * tw);
        ctx.translate(p.x, p.y); ctx.fillStyle = 'rgba(196,154,62,' + (tw * 0.95).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
        ctx.fillStyle = 'rgba(255,252,236,' + tw.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(0, 0, s * 0.18, 0, 6.2832); ctx.fill();
        return;
      }
      var c = Math.cos(p.tum), face = Math.abs(c), flash = Math.pow(face, 4), sy = (c < 0 ? -1 : 1) * Math.max(0.1, face);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(p.s, p.s * sy);
      var g2 = ctx.createLinearGradient(-1, -1, 1, 1);
      g2.addColorStop(0, 'rgb(' + mix(122, 201, face) + ',' + mix(90, 162, face) + ',' + mix(34, 75, face) + ')');
      g2.addColorStop(0.5, 'rgb(' + mix(176, 255, flash) + ',' + mix(138, 244, flash) + ',' + mix(60, 196, flash) + ')');
      g2.addColorStop(1, 'rgb(' + mix(110, 212, face) + ',' + mix(81, 175, face) + ',' + mix(32, 90, face) + ')');
      ctx.globalAlpha = (0.5 + 0.42 * face) * p.depth;
      ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(p.v[0], p.v[1]);
      for (var i = 2; i < p.v.length; i += 2) ctx.lineTo(p.v[i], p.v[i + 1]);
      ctx.closePath(); ctx.fill();
    }
  };

  /* ---------- runner: an occasional shooting-star shimmer with a fading sparkle trail (not interactive) ---------- */
  function mount(layer) {
    var cv = document.createElement('canvas');
    cv.className = 'gold-comet';
    layer.appendChild(cv);
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return { destroy: function () { if (cv.parentNode) cv.parentNode.removeChild(cv); } };
    var W = 0, H = 240, dpr = 1, raf = 0, timer = 0, last = 0, dead = false, paused = false;
    var pass = null, sparks = [];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = layer.clientWidth || window.innerWidth || 390;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function pos(u) {
      var x = pass.x0 + (pass.x1 - pass.x0) * u, y = pass.y0 + (pass.y1 - pass.y0) * u - pass.arc * 4 * u * (1 - u);
      return [x, y];
    }
    function star4(x, y, s, fill) {
      ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
    }
    function begin() {
      if (dead || paused) return;
      size();
      var dir = Math.random() < 0.5 ? 1 : -1;
      pass = {
        t: 0, dur: rnd(2.6, 3.3), x0: dir > 0 ? -30 : W + 30, x1: dir > 0 ? W + 30 : -30,
        y0: H - rnd(30, 70), y1: H - rnd(80, 130), arc: rnd(70, 100), emit: 0
      };
      cv.setAttribute('data-active', '1');
      last = performance.now(); if (!raf) raf = requestAnimationFrame(frame);
    }
    function schedule(ms) { clearTimeout(timer); if (!dead && !paused) timer = setTimeout(begin, ms); }
    function frame(now) {
      raf = 0; if (dead || paused) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0), i; last = now;
      ctx.clearRect(0, 0, W, H);
      if (pass) {
        pass.t += dt;
        var u = pass.t / pass.dur;
        if (u >= 1) { pass = null; schedule(rnd(12000, 20000)); }
        else {
          var e = u * u * (3 - 2 * u), vis = Math.min(1, u / 0.12, (1 - u) / 0.18), h = pos(e);
          /* tapered tail */
          var n = 22, span = 0.2;
          ctx.lineCap = 'round';
          for (i = 0; i < n; i++) {
            var a = Math.max(0, e - span * i / n), b = Math.max(0, e - span * (i + 1) / n), pa = pos(a), pb = pos(b), k = 1 - i / n;
            ctx.strokeStyle = 'rgba(' + mix(168, 236, k) + ',' + mix(125, 196, k) + ',' + mix(40, 96, k) + ',' + (vis * k * k * 0.85).toFixed(3) + ')';
            ctx.lineWidth = 0.6 + 2.6 * k; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
          }
          /* head */
          var g = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 20);
          g.addColorStop(0, 'rgba(255,244,200,' + (vis * 0.95).toFixed(3) + ')'); g.addColorStop(0.35, 'rgba(226,180,80,' + (vis * 0.6).toFixed(3) + ')'); g.addColorStop(1, 'rgba(201,150,50,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h[0], h[1], 20, 0, 6.2832); ctx.fill();
          star4(h[0], h[1], 11, 'rgba(184,140,50,' + (vis * 0.95).toFixed(3) + ')'); star4(h[0], h[1], 7, 'rgba(255,250,224,' + vis.toFixed(3) + ')');
          /* sparkle trail */
          pass.emit += dt * 46 * vis;
          while (pass.emit >= 1 && sparks.length < 90) {
            pass.emit -= 1;
            sparks.push({ x: h[0] + rnd(-5, 5), y: h[1] + rnd(-5, 5), vx: rnd(-10, 10), vy: rnd(-6, 14), s: rnd(1.4, 4.2), t: 0, life: rnd(0.9, 2.1), ph: rnd(0, 6.28), sw: rnd(6, 13), st: Math.random() < 0.55 });
          }
        }
      }
      for (i = sparks.length - 1; i >= 0; i--) {
        var p = sparks[i]; p.t += dt;
        if (p.t >= p.life) { sparks.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 9 * dt; p.ph += p.sw * dt;
        var al = (1 - p.t / p.life) * (0.45 + 0.55 * Math.abs(Math.sin(p.ph)));
        if (p.st) { star4(p.x, p.y, p.s * 1.5, 'rgba(168,125,40,' + al.toFixed(3) + ')'); star4(p.x, p.y, p.s * 0.75, 'rgba(255,240,186,' + al.toFixed(3) + ')'); }
        else { ctx.fillStyle = 'rgba(190,146,56,' + al.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.5, 0, 6.2832); ctx.fill(); }
      }
      if (pass || sparks.length) raf = requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, W, H); cv.removeAttribute('data-active'); }
    }
    size();
    schedule(3500);
    return {
      pause: function () { paused = true; clearTimeout(timer); if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      resume: function () {
        if (dead || !paused) return; paused = false;
        if (pass || sparks.length) { last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); } else schedule(4000);
      },
      destroy: function () {
        dead = true; clearTimeout(timer); if (raf) { cancelAnimationFrame(raf); raf = 0; }
        pass = null; sparks = []; if (cv.parentNode) cv.parentNode.removeChild(cv);
      }
    };
  }

  window.WeddingThemes.gold = {
    id: 'gold', name: '金色奢華', desc: '鎏金箔光・Art Deco 典雅', themeColor: '#FBF3DF',
    fonts: ['https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Pinyon+Script&display=swap'],
    css: css, swatch: swatch, ornament: ornament,
    lockArt: lockArt, cornerMascot: cornerMascot, headingIcon: headingIcon,
    particles: particles, runner: { mount: mount, ground: false }
  };
})();
