/* 純白系列 — pure white / pearl with fine gold hairlines. Public file: contains no data. */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};
  var S = 'html[data-theme="white"]';

  var css = `
${S}{
  --bg1:#FFFFFF; --bg2:#FAF8F5; --bg3:#F4F1EC; --bg4:#FFFFFF;
  --orb1:rgba(241,238,233,.55); --orb2:rgba(246,239,222,.5); --orb3:rgba(238,238,240,.5);
  --text:#3A3A3A; --text-soft:#75706A;
  --accent1:#C9B27C; --accent2:#B79E64;
  --card-bg:linear-gradient(145deg,rgba(255,255,255,.96),rgba(255,255,255,.84));
  --card-border:rgba(201,178,124,.5);
  --card-shadow:0 30px 60px -44px rgba(110,96,64,.32),0 1px 3px rgba(110,96,64,.05);
  --card-radius:14px;
  --chip-bg:#FFFFFF; --chip-text:#75706A;
  --danger:#A9604E;
  --font-body:"Noto Serif TC","Songti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-display:"Cormorant Garamond","Cormorant","Hoefler Text","Baskerville","Times New Roman","Noto Serif TC","Songti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-script:"Great Vibes","Snell Roundhand","Apple Chancery","Cormorant Garamond","Hoefler Text","Baskerville","Times New Roman",serif;

  --ink-3:#A6A199; --accent-ink:#8F7843;
  --hair:rgba(201,178,124,.6); --hair-2:rgba(201,178,124,.3); --hair-b:rgba(201,178,124,.2);
  --mute:rgba(176,170,160,.45); --glow:rgba(236,226,200,.6);
  --bg-grad:linear-gradient(125deg,#FFFFFF 0%,#FAF8F5 18%,#F3F0EA 36%,#FFFFFF 52%,#F6F2EA 68%,#FAF8F5 84%,#FFFFFF 100%);
  --soft-bg:linear-gradient(145deg,#FFFFFF,rgba(253,252,250,.9)); --soft-radius:10px;
  --soft-shadow:0 14px 30px -28px rgba(110,96,64,.4);
  --blur:blur(12px);
  --grad-text:linear-gradient(100deg,#8F7843 0%,#BFA468 26%,#9A8350 50%,#BFA468 74%,#8F7843 100%);
  --grad-bar:linear-gradient(90deg,#DCCB9E,#C9B27C);
  --grad-deep:linear-gradient(90deg,#B39A5E,#8F7843);
  --grad-pale:linear-gradient(90deg,#EFE8D6,#E6DCC2);
  --g-m:linear-gradient(90deg,#DFD2AA,#C9B27C); --g-f:linear-gradient(90deg,#EADDD6,#CDB5AA); --g-c:linear-gradient(90deg,#DEDEE2,#B9BAC0);
  --d-m:#C9B27C; --d-f:#CDB5AA; --d-c:#B9BAC0;
  --track:#F4F1EB; --ring-track:#F1EEE9;
  --ring-1:#DCCB9E; --ring-2:#C9B27C; --ring-3:#A8905A;
  --btn:linear-gradient(100deg,#9A8350,#B89F66 55%,#9A8350); --btn-ts:0 1px 1px rgba(90,74,40,.3);
  --btn-sh:0 14px 26px -18px rgba(143,120,67,.8);
  --on:linear-gradient(100deg,#A38B56,#BBA36B); --on-ts:0 1px 1px rgba(90,74,40,.3);
  --field:#FFFFFF; --field-f:#FFFFFF;
  --c-gold-bg:linear-gradient(120deg,#F7F1E0,#ECE1C4); --c-gold-ink:#7A6736;
  --c-blush-bg:linear-gradient(120deg,#F8F1EE,#EDDFD8); --c-blush-ink:#8A6558;
  --c-rose-bg:linear-gradient(120deg,#BE8E7E,#A9604E);
  --c-mist-bg:linear-gradient(120deg,#F3F3F5,#E5E5E9); --c-mist-ink:#686A74;
  --alert-bg:linear-gradient(120deg,#FBF3F0,#FFFFFF); --alert-ink:#A9604E;
  --booked-item:linear-gradient(135deg,#FFFFFF,#FBF8F1);
  --bar-bg:rgba(255,255,255,.88); --tabbar-bg:rgba(255,255,255,.97); --sheet-bg:linear-gradient(160deg,rgba(255,255,255,.97),rgba(250,248,245,.94)); --scrim:rgba(40,38,34,.26);
  --latin-style:italic; --head-w:300; --orn-h:14px;
}
${S} .bg{background:#FCFBF9}
/* lots of air, thin type */
${S} .page-title{letter-spacing:.44em;padding-left:.44em}
${S} .page-subtitle{letter-spacing:.12em}
${S} .sub{font-weight:300;letter-spacing:.3em;margin-top:34px}
${S} .panel{padding:24px 20px}
${S} .tiles,${S} .grid{gap:12px}
${S} .item{padding:15px 16px}
${S} .head{margin-bottom:26px}
${S} .progress-bar{height:6px;box-shadow:none}
${S} .meter .progress-bar{height:10px}
${S} .btn-primary{letter-spacing:.62em;padding-left:.62em;font-weight:300}
${S} .chip{font-weight:300;box-shadow:inset 0 0 0 1px rgba(201,178,124,.45)}
${S} .chip.gold,${S} .chip.blush,${S} .chip.rose,${S} .chip.mist{box-shadow:none}
${S} .topbar-title{font-weight:300}
${S} .tab{font-weight:300}
${S} .tab svg{stroke-width:1}
${S} .tabbar,${S} .topbar{border-color:rgba(201,178,124,.38)}
${S} .lock-card{padding-top:36px}
${S} .lock-card::after,${S} .countdown-card::after{content:"";position:absolute;inset:5px;border-radius:calc(var(--card-radius) - 4px);border:1px solid rgba(201,178,124,.28);pointer-events:none}
${S} .settings-sheet{box-shadow:0 -18px 50px -24px rgba(60,54,40,.35),inset 0 1px 0 rgba(201,178,124,.45)}
`;

  var ornament = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 14" width="54" height="14" aria-hidden="true">' +
    '<g fill="none" stroke="currentColor" stroke-width=".9" stroke-linejoin="round">' +
    '<path d="M27 1.500l5 5.500-5 5.500-5-5.500z"/><path d="M27 4.500l2.300 2.500-2.300 2.500-2.300-2.500z" fill="currentColor" stroke="none"/>' +
    '<path d="M2 7h14M38 7h14" stroke-linecap="round"/>' +
    '<circle cx="19" cy="7" r=".9" fill="currentColor" stroke="none"/><circle cx="35" cy="7" r=".9" fill="currentColor" stroke="none"/></g></svg>';

  /* two fine interlocking rings with a tiny sparkle */
  var lockArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 52" width="76" height="47" aria-hidden="true">' +
    '<g fill="none" stroke="#C9B27C" stroke-linecap="round">' +
    '<circle cx="32" cy="30" r="16" stroke-width="1.100"/><circle cx="32" cy="30" r="13.600" stroke-width=".5" opacity=".7"/>' +
    '<path d="M38.700 19.400A16 16 0 1 1 38.700 40.600" stroke-width="1.100"/><path d="M40.300 21.600A13.600 13.600 0 1 1 40.300 38.400" stroke-width=".5" opacity=".7"/>' +
    '<path d="M32 9.500l2.600-4.200h-5.200z" stroke-width=".9" stroke-linejoin="round" fill="#fff"/>' +
    '</g><path d="M66 3c.5 3 1.500 4 4.500 4.500-3 .5-4 1.500-4.500 4.500-.5-3-1.500-4-4.500-4.500 3-.5 4-1.500 4.500-4.500z" fill="#C9B27C"/>' +
    '<path d="M12 6c.3 1.800.9 2.400 2.700 2.700-1.800.3-2.400.9-2.700 2.700-.3-1.800-.9-2.400-2.700-2.700 1.800-.3 2.400-.9 2.700-2.700z" fill="#D9C79A"/></svg>';

  var swatch = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<defs><linearGradient id="whiteSwBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F6F3EE"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>' +
    '<linearGradient id="whiteSwAc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DCCB9E"/><stop offset="1" stop-color="#A8905A"/></linearGradient></defs>' +
    '<rect width="120" height="80" fill="url(#whiteSwBg)"/>' +
    '<rect x="12" y="14" width="96" height="40" rx="6" fill="#fff" stroke="#C9B27C" stroke-width=".8"/>' +
    '<rect x="15" y="17" width="90" height="34" rx="4" fill="none" stroke="#C9B27C" stroke-opacity=".4" stroke-width=".5"/>' +
    '<text x="24" y="42" font-family="Georgia,serif" font-style="italic" font-size="21" fill="url(#whiteSwAc)">329</text>' +
    '<g transform="translate(70 27)" fill="none" stroke="#C9B27C" stroke-width=".9"><circle cx="9" cy="8" r="7.500"/><circle cx="19" cy="8" r="7.500"/></g>' +
    '<path d="M100 22c.4 2.400 1.200 3.200 3.600 3.600-2.400.4-3.200 1.200-3.600 3.600-.4-2.400-1.200-3.200-3.600-3.600 2.400-.4 3.200-1.200 3.600-3.600z" fill="#C9B27C"/>' +
    '<rect x="12" y="63" width="64" height="4" rx="2" fill="#F1EEE9"/><rect x="12" y="63" width="40" height="4" rx="2" fill="url(#whiteSwAc)"/></svg>';

  /* ---------- particles: a few tiny gold / white sparkles ---------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var golds = ['201,178,124', '214,196,150', '186,160,104'];
  var particles = {
    count: 9,
    spawn: function (w, h) {
      return {
        x: rnd(0, w), y: rnd(0, h), s: rnd(2.2, 5), vx: rnd(-3, 5), vy: rnd(-7, -2),
        ph: rnd(0, 6.28), sw: rnd(0.7, 1.5), life: rnd(7, 13), t: 0, star: Math.random() < 0.6, rgb: golds[Math.floor(Math.random() * 3)]
      };
    },
    step: function (p, dt, w, h) {
      p.t += dt; p.ph += p.sw * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      return p.t < p.life && p.y > -20 && p.x > -20 && p.x < w + 20;
    },
    draw: function (ctx, p) {
      var edge = Math.min(1, p.t / 1.2, (p.life - p.t) / 1.2), tw = Math.max(0, edge) * (0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(p.ph * 2.2), 2));
      var r = p.s * 2.6, g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, 'rgba(' + p.rgb + ',' + (tw * 0.5).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + p.rgb + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
      if (p.star) {
        var s = p.s * (0.7 + 0.5 * tw);
        ctx.translate(p.x, p.y); ctx.fillStyle = 'rgba(' + p.rgb + ',' + (tw * 0.95).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,' + tw.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.28, 0, 6.2832); ctx.fill();
      }
    }
  };

  window.WeddingThemes.white = {
    id: 'white', name: '純白系列', desc: '珍珠白・極簡金線', themeColor: '#FFFFFF',
    fonts: [], css: css, swatch: swatch, ornament: ornament,
    lockArt: lockArt, cornerMascot: '', headingIcon: '',
    particles: particles, runner: null
  };
})();
