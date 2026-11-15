/* Wedding dashboard theme: earth (大地色) — minimalist lookbook palette.
   Rust, taupe, mustard and near-black on warm concrete white. Public file: contains no data. */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};
  var S = 'html[data-theme="earth"]';

  var RUST = '#A86B4E', TAUPE = '#B39880', MUSTARD = '#BE9450', INK = '#121212';
  var RUST_FILL = '#9F6347'; /* a touch deeper than RUST so white text on it passes 4.5:1 */

  /* ---------- ornament: four colour-swatch dots (the hairlines either side come from .orn) ---------- */
  var ornament = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 8" width="46" height="8" aria-hidden="true">' +
    '<circle cx="4" cy="4" r="3.5" fill="' + RUST + '"/><circle cx="16.700" cy="4" r="3.500" fill="' + TAUPE + '"/>' +
    '<circle cx="29.300" cy="4" r="3.500" fill="' + MUSTARD + '"/><circle cx="42" cy="4" r="3.500" fill="' + INK + '"/></svg>';

  /* ---------- lock art: swatch column beside two thin rings ---------- */
  var lockArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 92" width="132" height="92" aria-hidden="true">' +
    '<circle cx="20" cy="13" r="9" fill="' + RUST + '"/><circle cx="20" cy="35" r="9" fill="' + TAUPE + '"/>' +
    '<circle cx="20" cy="57" r="9" fill="' + MUSTARD + '"/><circle cx="20" cy="79" r="9" fill="' + INK + '"/>' +
    '<path d="M46 4V88" stroke="' + TAUPE + '" stroke-width=".7"/>' +
    '<g fill="none" stroke="' + INK + '" stroke-width=".9">' +
    '<circle cx="80" cy="46" r="19"/><circle cx="104" cy="46" r="19"/></g></svg>';

  /* ---------- swatch 120x80 ---------- */
  var swatch = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<rect width="120" height="80" fill="#EAE5DE"/>' +
    '<rect x="12" y="13" width="96" height="42" rx="3" fill="#F7F4EF" stroke="' + TAUPE + '" stroke-opacity=".6" stroke-width=".7"/>' +
    '<text x="22" y="43" font-family="Jost,\'Helvetica Neue\',Helvetica,Arial,sans-serif" font-weight="200" font-size="25" letter-spacing=".5" fill="' + INK + '">329</text>' +
    '<circle cx="78" cy="24" r="4.200" fill="' + RUST + '"/><circle cx="78" cy="34" r="4.200" fill="' + TAUPE + '"/>' +
    '<circle cx="78" cy="44" r="4.200" fill="' + MUSTARD + '"/><circle cx="90" cy="24" r="4.200" fill="' + INK + '"/>' +
    '<path d="M86 34h14M86 44h10" stroke="' + INK + '" stroke-width=".7"/>' +
    '<rect x="12" y="65" width="96" height="3" fill="' + TAUPE + '" fill-opacity=".3"/>' +
    '<rect x="12" y="65" width="40" height="3" fill="' + RUST + '"/><rect x="53" y="65" width="20" height="3" fill="' + MUSTARD + '"/></svg>';

  /* ---------- particles: a handful of slow, soft-edged colour discs ---------- */
  var RGB = ['168,107,78', '179,152,128', '190,148,80', '179,152,128', '168,107,78', '18,18,18'];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var particles = {
    count: 7,
    spawn: function (w, h) {
      var i = Math.floor(Math.random() * RGB.length);
      return {
        x: rnd(0, w), y: rnd(0, h), r: rnd(2.5, 6.5), vx: rnd(-2, 2), vy: rnd(-3.5, -1),
        rgb: RGB[i], a: i === 5 ? rnd(0.1, 0.16) : rnd(0.2, 0.34), life: rnd(22, 40), t: 0
      };
    },
    step: function (p, dt, w, h) {
      p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      return p.t < p.life && p.y > -40 && p.x > -40 && p.x < w + 40;
    },
    draw: function (ctx, p) {
      var edge = Math.min(1, p.t / 4, (p.life - p.t) / 4), o = p.a * Math.max(0, edge);
      if (o <= 0.004) return;
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, 'rgba(' + p.rgb + ',' + o.toFixed(3) + ')');
      g.addColorStop(0.7, 'rgba(' + p.rgb + ',' + (o * 0.92).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + p.rgb + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
  };

  /* ---------- extremely faint concrete / plaster: large mottling + fine grain ---------- */
  var CONCRETE = 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27360%27 height=%27360%27%3E' +
    '%3Cfilter id=%27m%27 x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.011%27 numOctaves=%273%27 seed=%277%27 stitchTiles=%27stitch%27/%3E' +
    '%3CfeColorMatrix values=%270 0 0 0 .42 0 0 0 0 .38 0 0 0 0 .33 .34 0 0 0 -.14%27/%3E%3C/filter%3E' +
    '%3Cfilter id=%27g%27 x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%272%27 seed=%273%27 stitchTiles=%27stitch%27/%3E' +
    '%3CfeColorMatrix values=%270 0 0 0 .3 0 0 0 0 .26 0 0 0 0 .22 .32 0 0 0 -.1%27/%3E%3C/filter%3E' +
    '%3Crect width=%27360%27 height=%27360%27 filter=%27url(%23m)%27/%3E%3Crect width=%27360%27 height=%27360%27 filter=%27url(%23g)%27 opacity=%27.55%27/%3E%3C/svg%3E")';

  var css = `
${S}{
  --bg1:#EEEAE4; --bg2:#EAE5DE; --bg3:#E6E0D8; --bg4:#ECE7E0;
  --orb1:rgba(179,152,128,.07); --orb2:rgba(255,255,255,.3); --orb3:rgba(190,148,80,.05);
  --text:${INK}; --text-soft:#6A625A;
  --accent1:${RUST}; --accent2:${MUSTARD};
  --card-bg:#F7F4EF; --card-border:rgba(179,152,128,.5);
  --card-shadow:0 1px 0 rgba(18,18,18,.02);
  --card-radius:8px;
  --chip-bg:transparent; --chip-text:#5E564E;
  --danger:#9C4A30;
  --font-body:"Jost","Noto Sans TC","PingFang TC","Heiti TC","Noto Sans CJK TC","Microsoft JhengHei",sans-serif;
  --font-display:"Jost","Noto Sans TC","PingFang TC","Heiti TC","Noto Sans CJK TC","Microsoft JhengHei",sans-serif;
  --font-script:"Jost","Noto Sans TC","PingFang TC","Heiti TC","Noto Sans CJK TC","Microsoft JhengHei",sans-serif;

  --ink-3:#9A9087; --accent-ink:#8A5238;
  --hair:rgba(179,152,128,.6); --hair-2:rgba(179,152,128,.34); --hair-b:rgba(179,152,128,.34);
  --mute:rgba(179,152,128,.55); --glow:rgba(179,152,128,.22);
  --page:#EEEAE4;
  --bg-grad:linear-gradient(160deg,#EEEAE4 0%,#EAE5DE 50%,#E6E0D8 100%);
  --soft-bg:#F7F4EF; --soft-radius:6px; --soft-shadow:none; --blur:none;
  --grad-text:linear-gradient(${INK},${INK});
  --grad-bar:linear-gradient(${RUST},${RUST});
  --grad-deep:linear-gradient(${RUST},${RUST});
  --grad-pale:linear-gradient(#D9CBBD,#D9CBBD);
  --d-m:${RUST}; --d-f:${MUSTARD}; --d-c:${TAUPE};
  --g-m:linear-gradient(${RUST},${RUST}); --g-f:linear-gradient(${MUSTARD},${MUSTARD}); --g-c:linear-gradient(${TAUPE},${TAUPE});
  --track:rgba(179,152,128,.22); --ring-track:rgba(179,152,128,.26);
  --ring-1:${RUST}; --ring-2:${RUST}; --ring-3:${RUST};
  --btn:${INK}; --btn-ink:#fff; --btn-ts:none; --btn-sh:none;
  --on:${INK}; --on-ink:#fff; --on-ts:none;
  --field:#FBF9F5; --field-f:#FFFFFF;
  --c-gold-bg:${RUST_FILL}; --c-gold-ink:#fff;
  --c-blush-bg:${MUSTARD}; --c-blush-ink:${INK};
  --c-rose-bg:${INK}; --c-rose-ink:#fff;
  --c-mist-bg:${TAUPE}; --c-mist-ink:${INK};
  --alert-bg:transparent; --alert-ink:${INK};
  --booked-item:#FBF9F5;
  --bar-bg:#EFEBE5; --tabbar-bg:#F7F4EF; --sheet-bg:#F3EFE9; --scrim:rgba(18,18,18,.3);
  --latin-style:normal; --num-w:300; --head-w:200; --body-w:300; --script-w:200; --script-style:normal; --orn-h:8px;
}
/* background: flat warm plaster, no moving colour, faint concrete grain */
${S} .bg{background:#EAE5DE}
${S} .bg::before{animation:none;inset:0;transform:none}
${S} .orb{display:none}
${S} body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background-image:${CONCRETE};background-size:360px 360px;opacity:.42}

/* type: thin, upright, spaced */
${S} .gt{background:none;-webkit-text-fill-color:currentColor;color:inherit;animation:none}
${S} .script{letter-spacing:.05em;line-height:1.15}
${S} .lock-title{font-size:clamp(34px,10.4vw,44px);color:${INK};margin-bottom:6px}
${S} .hero-title{font-size:clamp(36px,11vw,50px);color:${INK}}
${S} .lock-date{font-size:14px;font-weight:300;letter-spacing:.5em;padding-left:.5em;margin-top:16px}
${S} .lock-venue{font-size:11.5px;letter-spacing:.22em;color:var(--ink-2)}
${S} .hero-line{font-size:11.5px;letter-spacing:.24em;margin-top:16px}
${S} .hero-line b{font-weight:300;font-size:14px;letter-spacing:.5em;padding-left:.5em;margin-bottom:6px}
${S} .page-subtitle,${S} .count-cap,${S} .foot .latin,${S} .booked .lab,${S} .sub small,${S} .stat-tile .go{text-transform:uppercase;font-weight:400}
${S} .page-subtitle{font-size:10.5px;letter-spacing:.46em;padding-left:.46em;color:${RUST};opacity:1;margin-bottom:8px}
${S} .page-title{font-size:30px;letter-spacing:.5em;padding-left:.5em;color:${INK}}
${S} .head{margin:26px 0 30px}
${S} .head .orn{margin-top:16px}
${S} .count-cap{font-size:10px;letter-spacing:.36em;padding-left:.36em;margin-top:18px;color:var(--ink-2)}
${S} .foot .latin{font-size:10px;letter-spacing:.3em;color:var(--ink-3)}
${S} .booked .lab{font-size:11px;letter-spacing:.34em;color:${RUST}}
${S} .sub{font-size:13px;font-weight:400;letter-spacing:.34em;margin:38px 2px 14px;gap:14px}
${S} .sub::after{background:var(--hair)}
${S} .sub small{font-size:10px;letter-spacing:.24em;color:var(--ink-3)}
${S} .topbar-title{font-size:13px;font-weight:400;letter-spacing:.5em;padding-left:.5em}
${S} .stage-tag{font-size:11px;font-weight:400;letter-spacing:.3em;color:${RUST};margin-top:22px}
${S} .item .name,${S} .brow .t,${S} .grow .n,${S} .stat-tile .lab,${S} .sw-n{font-weight:400}
${S} .sheet-h h2{font-size:14px;font-weight:400;letter-spacing:.4em}

/* numbers: thin and large */
${S} .countdown-card .num,${S} .ring .num,${S} .bignum,${S} .sum .num,${S} .g5 .num,${S} .split-l .num{font-weight:200;letter-spacing:.02em}
${S} .countdown-card .num{font-size:44px;color:${INK}}
${S} .countdown-card>div:first-child .num{color:${RUST}}
${S} .countdown-card>div>span:last-child{font-size:11px;color:var(--ink-2)}
${S} .countdown-card>div+div::before{background:var(--hair-2)}
${S} .ring .num{font-size:24px;color:${INK}}
${S} .ring circle{stroke-width:3;stroke-linecap:butt}
${S} .tiles .stat-tile:nth-child(2) .ring circle.fg{stroke:${MUSTARD}}
${S} .bignum{font-size:50px;color:${RUST}}
${S} .g5 .num{font-size:36px}
${S} .g5 .soft:first-child .num{color:${RUST}}
${S} .sum .num small{font-weight:300}
${S} .neg .num{color:var(--danger)}

/* surfaces: flat, hairline, square-ish */
${S} .card{-webkit-backdrop-filter:none;backdrop-filter:none}
${S} .lock-card{padding:44px 30px 34px}
${S} .countdown-card{padding:24px 12px 18px;margin-top:32px}
${S} .tiles{gap:8px;margin-top:26px}
${S} .stat-tile{padding:18px 6px 13px}
${S} .stat-tile .lab{font-size:12px;letter-spacing:.16em}
${S} .stat-tile .go{font-size:10px;letter-spacing:.2em;color:var(--ink-3)}
${S} .panel{padding:22px 18px}
${S} .item{padding:14px 15px}
${S} .grid{gap:8px}
${S} .sum,${S} .g5{gap:8px}
${S} .sum .lab,${S} .g5 .lab{font-size:11px;letter-spacing:.26em}
${S} .orn{gap:14px;max-width:210px}
${S} .orn::before,${S} .orn::after{background:var(--hair)}
${S} .done .name::before{content:"";flex:none;width:5px;height:5px;border-radius:50%;background:${RUST}}
${S} .item .more{color:var(--ink-2)}
${S} .item a.link{color:${INK}}
${S} .morebtn{color:${INK};font-size:12px;letter-spacing:.3em}
${S} .alert{border-radius:0;box-shadow:none;border-left:2px solid ${INK};padding:4px 0 4px 13px;margin-top:16px}

/* chips: solid swatch colours */
${S} .chip{border-radius:3px;font-size:11px;font-weight:400;letter-spacing:.1em;padding:5px 8px;box-shadow:inset 0 0 0 1px var(--hair)}
${S} .chip.gold,${S} .chip.blush,${S} .chip.rose,${S} .chip.mist{box-shadow:none}

/* bars: thin, square, solid */
${S} .progress-bar{height:4px;border-radius:0;box-shadow:none}
${S} .progress-bar i{border-radius:0}
${S} .brow{padding:11px 0}
${S} .brow .progress-bar{margin-top:7px}
${S} .meter .progress-bar{height:8px}
${S} .meter .mark{opacity:1;width:1px;top:-6px;bottom:-6px}
${S} .legend i{border-radius:0;width:14px;height:4px;vertical-align:3px}
${S} .split{height:8px;border-radius:0;gap:3px}
${S} .dot{width:8px;height:8px}

/* controls */
${S} .field input[type=password]{border-radius:6px;font-size:16px;box-shadow:inset 0 0 0 1px var(--hair)}
${S} .field input[type=password]:focus,${S} .search-input:focus{box-shadow:inset 0 0 0 1px ${INK}}
${S} .field input::placeholder{font-size:12.5px;letter-spacing:.34em}
${S} .btn-primary{border-radius:6px;font-size:13px;font-weight:400;letter-spacing:.7em;padding-left:.7em;transition:opacity .3s,transform .2s}
${S} .btn-primary:hover{opacity:.86}
${S} .remember{font-size:12px;letter-spacing:.2em}
${S} .remember input{border-radius:2px;width:15px;height:15px;box-shadow:inset 0 0 0 1px ${INK}}
${S} .search-input{border-radius:6px;font-size:14px;padding:0 16px}
${S} .fchips button{border-radius:3px;font-size:12px;letter-spacing:.2em;padding:7px 13px}
${S} .fchips button.on{font-weight:400}
${S} .gear.fab{box-shadow:inset 0 0 0 1px var(--hair)}

/* bars */
${S} .topbar,${S} .tabbar{-webkit-backdrop-filter:none;backdrop-filter:none}
${S} .tabbar{box-shadow:none;border-top:1px solid var(--hair)}
${S} .tab{font-size:10.5px;font-weight:400;letter-spacing:.24em;color:#8A8178}
${S} .tab span{padding-left:.24em}
${S} .tab::before{height:2px;border-radius:0;width:22px;margin-left:-11px;background:${INK}}
${S} .tab.active{color:${INK}}
${S} .tab.active svg{transform:none}

/* settings sheet */
${S} .settings-sheet{border-radius:12px 12px 0 0;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:0 -1px 0 var(--hair)}
${S} .sw{border-radius:8px}
${S} .sw-pv{border-radius:4px}
${S} .sw[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px ${INK}}
${S} .sw-ok{background:${INK}}
${S} .sheet-h button,${S} .sheet-f button{border-radius:6px}

@media (min-width:760px){
  ${S} .lock-card{padding:56px 46px 42px}
  ${S} .lock-title{font-size:52px}
  ${S} .hero-title{font-size:72px}
  ${S} .hero-line b{font-size:14px;letter-spacing:.4em;padding:0}
  ${S} .countdown-card .num{font-size:62px}
  ${S} .ring .num{font-size:32px}${S} .bignum{font-size:70px}
  ${S} .page-title{font-size:36px}${S} .page-subtitle{font-size:11px}
  ${S} .g5 .num{font-size:46px}
  ${S} .settings-sheet{border-radius:12px}
}
@media (min-width:900px){
  ${S} .tabbar{border-radius:8px;box-shadow:none;border:1px solid var(--hair)}
  ${S} .tab{border-radius:5px;font-size:13px}
  ${S} .tab.active{color:#fff}
}
`;

  window.WeddingThemes.earth = {
    id: 'earth',
    name: '大地色',
    desc: '紅棕、卡其、芥末黃的極簡質感',
    themeColor: '#EEEAE4',
    fonts: [
      'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,200;0,300;0,400;1,300&display=swap',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@200;300;400&display=swap'
    ],
    css: css,
    swatch: swatch,
    ornament: ornament,
    lockArt: lockArt,
    cornerMascot: '',
    headingIcon: '',
    particles: particles,
    runner: null
  };
})();
