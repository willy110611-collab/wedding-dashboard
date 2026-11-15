/* 香檳晨曦 — the original champagne / blush look. Public file: contains no data. */
(function () {
  'use strict';
  window.WeddingThemes = window.WeddingThemes || {};
  var S = 'html[data-theme="champagne"]';

  var css = `
${S}{
  --bg1:#FFF8EE; --bg2:#F9E6D2; --bg3:#F5D0D3; --bg4:#EFE3F3;
  --orb1:rgba(243,221,180,.62); --orb2:rgba(243,191,198,.62); --orb3:rgba(220,210,240,.45);
  --text:#5B4636; --text-soft:#8A7260;
  --accent1:#D4B483; --accent2:#EBB4B8;
  --card-bg:linear-gradient(145deg,rgba(255,255,255,.62),rgba(255,250,244,.36));
  --card-border:transparent;
  --card-shadow:0 24px 60px -28px rgba(150,104,74,.42),0 2px 10px -4px rgba(150,104,74,.12);
  --card-radius:24px;
  --chip-bg:rgba(255,255,255,.7); --chip-text:#8A7260;
  --danger:#C4747F;
  --font-body:"Noto Serif TC","Songti TC","PingFang TC","Heiti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-display:"Cormorant Garamond","Cormorant","Hoefler Text","Baskerville","Times New Roman","Noto Serif TC","Songti TC","PMingLiU","Noto Serif CJK TC",serif;
  --font-script:"Great Vibes","Snell Roundhand","Apple Chancery","Cormorant Garamond","Hoefler Text","Baskerville","Times New Roman",serif;

  --ink-3:#B09C8B; --accent-ink:#A9824C;
  --hair:rgba(212,180,131,.55); --hair-2:rgba(212,180,131,.28); --hair-b:rgba(235,180,184,.4);
  --mute:rgba(176,156,139,.35); --glow:rgba(245,208,211,.45);
  --bg-grad:linear-gradient(125deg,#FFF8EE 0%,#F9E6D2 16%,#F5D0D3 34%,#EFE3F3 50%,#FBEBD6 66%,#F2CDD0 82%,#FFF4E2 100%);
  --soft-bg:linear-gradient(145deg,rgba(255,255,255,.66),rgba(255,249,242,.42)); --soft-radius:18px;
  --soft-shadow:0 10px 30px -22px rgba(150,104,74,.5);
  --grad-text:linear-gradient(100deg,#B08A52 0%,#D2A868 22%,#DE8F9B 50%,#D2A868 78%,#B08A52 100%);
  --grad-bar:linear-gradient(90deg,#DDBE8A,#EBB4B8);
  --grad-deep:linear-gradient(90deg,#C79A5B,#D77F8D);
  --grad-pale:linear-gradient(90deg,rgba(232,213,176,.95),rgba(245,208,211,.95));
  --g-m:linear-gradient(90deg,#E6CFA0,#D4B483); --g-f:linear-gradient(90deg,#F5D0D3,#E6A3AB); --g-c:linear-gradient(90deg,#E4DDF2,#BFB2DE);
  --d-m:#D4B483; --d-f:#E6A3AB; --d-c:#BFB2DE;
  --ring-track:rgba(255,255,255,.75); --ring-1:#D9B77E; --ring-2:#EBB4B8; --ring-3:#D98C97;
  --btn:linear-gradient(100deg,#D9B77E,#E7A9AE 55%,#DDB37C); --btn-ts:0 1px 2px rgba(140,90,60,.35);
  --btn-sh:0 14px 28px -14px rgba(201,130,120,.9);
  --on:linear-gradient(100deg,#D9B77E,#E7A9AE); --on-ts:0 1px 2px rgba(140,90,60,.3);
  --c-gold-bg:linear-gradient(120deg,rgba(240,224,190,.95),rgba(226,198,150,.7)); --c-gold-ink:#8E6A36;
  --c-blush-bg:linear-gradient(120deg,rgba(250,224,226,.95),rgba(240,196,200,.75)); --c-blush-ink:#A9596A;
  --c-rose-bg:linear-gradient(120deg,#E29AA4,#CF7C8A);
  --c-mist-bg:linear-gradient(120deg,rgba(236,231,247,.95),rgba(222,214,240,.8)); --c-mist-ink:#75689B;
  --alert-bg:linear-gradient(120deg,rgba(250,226,228,.85),rgba(255,244,236,.6)); --alert-ink:#A9596A;
  --booked-item:linear-gradient(135deg,rgba(255,250,240,.9),rgba(250,226,226,.6));
  --bar-bg:rgba(255,248,238,.8); --tabbar-bg:rgba(255,249,241,.95); --sheet-bg:linear-gradient(160deg,rgba(255,252,247,.9),rgba(255,244,236,.82));
  --latin-style:italic; --orn-h:16px;
}
${S} .lock-date,${S} .hero-line b,${S} .latin{font-variant-numeric:lining-nums}
${S} .bg{background:#FBEBDD}
${S} .orb.a{background:radial-gradient(circle,#F3DDB4 0%,rgba(243,221,180,.5) 30%,rgba(243,221,180,0) 70%);opacity:.62}
${S} .orb.b{background:radial-gradient(circle,#F3BFC6 0%,rgba(243,191,198,.5) 30%,rgba(243,191,198,0) 70%);opacity:.62}
${S} .orb.c{background:radial-gradient(circle,#DCD2F0 0%,rgba(220,210,240,.5) 30%,rgba(220,210,240,0) 70%);opacity:.45}
${S} .orb.d{background:radial-gradient(circle,#FFF2D6 0%,rgba(255,242,214,.5) 30%,rgba(255,242,214,0) 70%);opacity:.62}
/* gradient hairline edge on every card */
${S} .card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(226,198,150,.75) 35%,rgba(235,180,184,.7) 65%,rgba(255,255,255,.7));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
${S} .tabbar{border-top-color:rgba(226,198,150,.5)}
/* butterflies */
.champ-fly{position:absolute;left:0;bottom:0;width:26px;height:22px;opacity:0;pointer-events:none;will-change:transform}
.champ-fly svg{display:block;width:100%;height:100%;overflow:visible}
.champ-fly .cw{transform-box:fill-box;animation:champ-flap .26s ease-in-out infinite alternate}
.champ-fly .cw.l{transform-origin:100% 60%}
.champ-fly .cw.r{transform-origin:0% 60%}
.champ-fly.b{width:20px;height:17px}
.champ-fly.b .cw{animation-duration:.22s}
.champ-fly.paused .cw{animation-play-state:paused}
@keyframes champ-flap{from{transform:scaleX(1)}to{transform:scaleX(.22)}}
`;

  var ornament = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 32" width="26" height="16" aria-hidden="true">' +
    '<g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 27C14 25 31 19 49 5"/>' +
    '<path d="M13 24.5c-1.500-5 .5-9 5-11.500 1.500 4.500-.5 9-5 11.500z"/>' +
    '<path d="M24 20c-1-5 1.500-9 6-11 1 5-1.500 9-6 11z"/>' +
    '<path d="M35 14c0-4 2-7 6-8.500 0 4-2 7-6 8.500z"/>' +
    '<path d="M18 23.500c3.500 2.500 7.500 2.500 11.500 0-3.500-2.500-7.500-2.500-11.500 0z"/>' +
    '<path d="M30 17.500c3.500 2 7 1.500 10.500-1-3.500-2-7-1.500-10.500 1z"/></g></svg>';

  var swatch = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<defs><linearGradient id="champSwBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF8EE"/><stop offset=".4" stop-color="#F7D9D4"/><stop offset=".7" stop-color="#EFE3F3"/><stop offset="1" stop-color="#FBEBD6"/></linearGradient>' +
    '<linearGradient id="champSwAc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D2A868"/><stop offset="1" stop-color="#DE8F9B"/></linearGradient>' +
    '<radialGradient id="champSwOrb"><stop offset="0" stop-color="#F3BFC6" stop-opacity=".9"/><stop offset="1" stop-color="#F3BFC6" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="120" height="80" fill="url(#champSwBg)"/><circle cx="100" cy="14" r="34" fill="url(#champSwOrb)"/>' +
    '<rect x="12" y="14" width="96" height="40" rx="11" fill="#fff" fill-opacity=".6" stroke="#E2C696" stroke-opacity=".8" stroke-width=".8"/>' +
    '<text x="24" y="42" font-family="Georgia,serif" font-style="italic" font-size="21" fill="url(#champSwAc)">329</text>' +
    '<g transform="translate(70 22) scale(.62)" fill="none" stroke="#D4B483" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 27C14 25 31 19 49 5"/><path d="M13 24.500c-1.500-5 .5-9 5-11.500 1.500 4.500-.5 9-5 11.500z"/><path d="M24 20c-1-5 1.500-9 6-11 1 5-1.500 9-6 11z"/><path d="M35 14c0-4 2-7 6-8.500 0 4-2 7-6 8.500z"/></g>' +
    '<path d="M22 0c2.500 3.500 2 7.500-1 10.500C18.500 7 19 3 22 0z" transform="translate(74 -4) rotate(24 21 5)" fill="#F1B9BF" opacity=".85"/>' +
    '<path d="M22 0c2.500 3.500 2 7.500-1 10.500C18.500 7 19 3 22 0z" transform="translate(-8 52) rotate(-30 21 5)" fill="#EBC9A0" opacity=".8"/>' +
    '<rect x="12" y="62" width="64" height="6" rx="3" fill="#fff" fill-opacity=".7"/><rect x="12" y="62" width="40" height="6" rx="3" fill="url(#champSwAc)"/></svg>';

  /* ---------- particles: petals + light motes (unchanged from the original page) ---------- */
  var tints = [[245, 208, 211], [235, 180, 184], [232, 213, 176], [255, 244, 232], [228, 221, 242]];
  var seq = 0, freshLeft = 0;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var particles = {
    count: 24,
    init: function (w, h) {
      particles.count = Math.min(30, Math.max(14, Math.round(w * h / 38000)));
      freshLeft = particles.count; seq = 0;
    },
    spawn: function (w, h) {
      var fresh = freshLeft > 0; if (fresh) freshLeft--;
      var mote = (seq++) % 3 === 0, c = tints[Math.floor(Math.random() * (mote ? 4 : 5))];
      var p = {
        mote: mote, x: fresh ? rnd(0, w) : rnd(-w * 0.3, w * 0.8), y: fresh ? rnd(0, h) : rnd(-60, -10),
        s: mote ? rnd(1.2, 2.6) : rnd(6, 13), vx: mote ? rnd(4, 12) : rnd(10, 26), vy: mote ? rnd(-5, 6) : rnd(9, 22),
        rot: rnd(0, 6.28), vr: rnd(-0.5, 0.5), ph: rnd(0, 6.28), sw: rnd(0.4, 1.1), a: mote ? rnd(0.5, 0.95) : rnd(0.4, 0.75),
        rgb: c[0] + ',' + c[1] + ',' + c[2]
      };
      if (!fresh && mote) { p.x = rnd(-20, w * 0.6); p.y = rnd(0, h); }
      return p;
    },
    step: function (p, dt, w, h) {
      p.ph += p.sw * dt; p.rot += p.vr * dt;
      p.x += (p.vx + Math.sin(p.ph) * 12) * dt; p.y += (p.vy + Math.cos(p.ph * 0.7) * 6) * dt;
      return !(p.x > w + 40 || p.y > h + 40 || p.y < -80);
    },
    draw: function (ctx, p) {
      if (p.mote) {
        var tw = p.a * (0.55 + 0.45 * Math.sin(p.ph * 1.6)), r = p.s * 5, g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, 'rgba(255,252,240,' + tw.toFixed(3) + ')'); g.addColorStop(0.25, 'rgba(' + p.rgb + ',' + (tw * 0.55).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + p.rgb + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
      } else {
        var s = p.s; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.45 + 0.55 * Math.abs(Math.cos(p.ph * 0.8)));
        var pg = ctx.createLinearGradient(0, -s, 0, s); pg.addColorStop(0, 'rgba(255,250,246,' + p.a + ')'); pg.addColorStop(1, 'rgba(' + p.rgb + ',' + p.a + ')');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.7, s * 0.65, 0, s); ctx.bezierCurveTo(-s * 0.7, s * 0.65, -s * 0.95, -s * 0.55, 0, -s); ctx.fill();
      }
    }
  };

  /* ---------- runner: a pair of butterflies drifting across now and then ---------- */
  function flySvg(c1, c2) {
    var wing = '<path d="M12 9.500C9.500 3 4 1 2.200 4c-1.900 3.400 3.300 7 9.800 5.500z" fill="' + c1 + '" fill-opacity=".85" stroke="' + c2 + '" stroke-width=".7"/>' +
      '<path d="M12 10.500c-4 .2-7.300 2.800-6.300 5.800 1 2.700 5-.2 6.300-5.800z" fill="' + c1 + '" fill-opacity=".6" stroke="' + c2 + '" stroke-width=".7"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" aria-hidden="true">' +
      '<g class="cw l">' + wing + '</g><g transform="matrix(-1 0 0 1 24 0)"><g class="cw l">' + wing + '</g></g>' +
      '<path d="M12 6.500v9M12 6.500c-.5-1.800-1.300-2.800-2.300-3.200M12 6.500c.5-1.800 1.300-2.800 2.300-3.200" fill="none" stroke="' + c2 + '" stroke-width=".9" stroke-linecap="round"/></svg>';
  }
  function mount(layer) {
    var a = document.createElement('div'), b = document.createElement('div');
    a.className = 'champ-fly'; a.innerHTML = flySvg('#F3C9CE', '#C98E96');
    b.className = 'champ-fly b'; b.innerHTML = flySvg('#EED9B2', '#C3A06A');
    layer.appendChild(a); layer.appendChild(b);
    var timer = 0, anims = [], dead = false, paused = false;
    function path(el, dir, delay, lift) {
      var w = layer.clientWidth || window.innerWidth || 390, n = 14, kf = [], ph = Math.random() * 6.28;
      for (var i = 0; i <= n; i++) {
        var t = i / n, x = dir > 0 ? -40 + (w + 80) * t : w + 40 - (w + 80) * t;
        var y = -(lift + Math.sin(t * 9 + ph) * 16 + Math.sin(t * 23 + ph) * 5 + t * 14);
        kf.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + (dir * (8 + Math.cos(t * 9 + ph) * 10)).toFixed(1) + 'deg)', opacity: i === 0 || i === n ? 0 : 0.95, offset: t });
      }
      if (!el.animate) return null;
      return el.animate(kf, { duration: 9000 + Math.random() * 2500, delay: delay, easing: 'linear', fill: 'both' });
    }
    function pass() {
      if (dead || paused) return;
      var dir = Math.random() < 0.5 ? 1 : -1, lift = 18 + Math.random() * 30;
      anims = [path(a, dir, 0, lift), path(b, dir, 650, lift + 12)].filter(Boolean);
      var lastAnim = anims[anims.length - 1];
      if (lastAnim) lastAnim.onfinish = function () { anims = []; schedule(14000 + Math.random() * 12000); };
    }
    function schedule(ms) { clearTimeout(timer); if (!dead && !paused) timer = setTimeout(pass, ms); }
    schedule(2600);
    return {
      pause: function () { paused = true; clearTimeout(timer); anims.forEach(function (x) { x.pause(); }); a.classList.add('paused'); b.classList.add('paused'); },
      resume: function () { if (dead) return; paused = false; a.classList.remove('paused'); b.classList.remove('paused'); if (anims.length) anims.forEach(function (x) { x.play(); }); else schedule(3000); },
      destroy: function () { dead = true; clearTimeout(timer); anims.forEach(function (x) { x.cancel(); }); anims = []; if (a.parentNode) a.parentNode.removeChild(a); if (b.parentNode) b.parentNode.removeChild(b); }
    };
  }

  window.WeddingThemes.champagne = {
    id: 'champagne', name: '香檳晨曦', desc: '香檳金與粉霧・花瓣柔光', themeColor: '#FFF8EE',
    fonts: [
      'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;500&display=swap',
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap',
      'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'
    ],
    css: css, swatch: swatch, ornament: ornament,
    lockArt: '', cornerMascot: '', headingIcon: '',
    particles: particles, runner: { mount: mount, ground: false }
  };
})();
