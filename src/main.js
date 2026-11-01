// ===== Orquestração global: cenas, fundos, legendas, partículas, grão =====
const SCENES = [];
function scene(def) { SCENES.push(def); return def; }
// limites de cena (segundos) — múltiplos de 0,5 s (120 BPM)
const T = { s1: 0, s2: 2.5, s3: 5.6, s4: 12, s5: 15, s6: 18, s7: 21, end: 26 };
// remapeamento de tempo: cenas reaproveitadas rodam no seu tempo original (map = [[novo, antigo], ...])
function warp(t, map) {
  if (t <= map[0][0]) return map[0][1] + (t - map[0][0]);
  for (let i = 1; i < map.length; i++) if (t <= map[i][0]) { const [a0, b0] = map[i - 1], [a1, b1] = map[i]; return b0 + (b1 - b0) * (t - a0) / (a1 - a0); }
  const [a, b] = map[map.length - 1]; return b + (t - a);
}

// ---------- fundos mesh animados ----------
const BG = { dark: [], light: [] };
function buildBg() {
  const dk = $('#bgDark'), lt = $('#bgLight');
  dk.style.background = '#070707';
  const dc = [['rgba(33,209,147,.16)', 1500], ['rgba(255,255,255,.035)', 1400], ['rgba(33,209,147,.07)', 1200], ['rgba(255,255,255,.025)', 1500], ['rgba(33,209,147,.05)', 900]];
  const lc = [['rgba(33,209,147,.10)', 1500], ['rgba(0,0,0,.035)', 1400], ['rgba(33,209,147,.06)', 1200], ['rgba(0,0,0,.02)', 1500], ['rgba(255,255,255,0)', 900]];
  for (const [c, s] of dc) { const b = h(`<div class="blob" style="width:${s}px;height:${s}px;background:radial-gradient(circle at 50% 50%, ${c} 0%, rgba(0,0,0,0) 62%)"></div>`); dk.appendChild(b); BG.dark.push(b); }
  for (const [c, s] of lc) { const b = h(`<div class="blob" style="width:${s}px;height:${s}px;background:radial-gradient(circle at 50% 50%, ${c} 0%, rgba(255,255,255,0) 62%)"></div>`); lt.appendChild(b); BG.light.push(b); }
}
const BLOBPATH = [[-300, 0, .21], [500, 900, .17], [100, 1300, .26], [-500, 500, .13], [600, -200, .19]];
function updateBg(t) {
  const pulse = beatPulse(t, 0, T.s7);
  [BG.dark, BG.light].forEach((arr, k) => arr.forEach((b, i) => {
    const [x0, y0, f] = BLOBPATH[i];
    const x = x0 + Math.sin(t * f * 1.1 + i * 1.7 + k) * 160;
    const y = y0 + Math.cos(t * f * 0.9 + i * 2.3 + k) * 180;
    tf(b, `translate3d(${x}px, ${y - 400}px, 0)`);
  }));
  // claro/escuro alternando por cena
  const light = K(t, [[0, 1], [11.75, 1], [11.95, 0, E.inOutCubic], [14.98, 0], [15.0, 1, E.linear], [17.98, 1], [18.0, 0, E.linear], [26, 0]]);
  op($('#bgLight'), light);
  css($('#vignette'), 'opacity', String(lerp(1, .35, light)));
}

// ---------- legendas ----------
const CAPS = []; // sem pílulas de legenda: o texto faz parte de cada cena
function updateCaps(t) {
  const pill = $('#capPill');
  const c = CAPS.find(c => t >= c[0] && t <= c[1] + .35);
  if (!c) { op(pill, 0); return; }
  if (pill.dataset.k !== String(c[0])) { pill.innerHTML = c[2]; pill.dataset.k = String(c[0]); }
  const pin = E.spring(inv(c[0], c[0] + .6, t));
  const pout = E.inCubic(inv(c[1], c[1] + .3, t));
  op(pill, Math.min(inv(c[0], c[0] + .2, t), 1 - pout));
  tf(pill, `translateY(${(1 - pin) * 60 + pout * 30}px) scale(${lerp(.9, 1, pin) - pout * .06})`);
  fl(pill, `blur(${(1 - inv(c[0], c[0] + .3, t)) * 10 + pout * 10}px)`);
}

// ---------- motion blur direcional (whip-pan) ----------
function mblur(el, px, vertical = false) {
  if (px < .4) { fl(el, 'none'); return; }
  const g = $(vertical ? '#mblurVG' : '#mblurG');
  g.setAttribute('stdDeviation', vertical ? `0 ${px.toFixed(1)}` : `${px.toFixed(1)} 0`);
  fl(el, vertical ? 'url(#mblurV)' : 'url(#mblur)');
}

// ---------- partículas (canvas) ----------
const fx = { ctx: null, draws: [] };
function burst(ctx, t, t0, x, y, { n = 70, seed = 7, speed = 900, life = 1.1, colors = ['#21D193', '#FFFFFF'], size = 10 } = {}) {
  n = Math.round(n * .3); size *= .45; speed *= .7;
  const dt = t - t0; if (dt < 0 || dt > life) return;
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, sp = speed * (.35 + r() * .9), sz = size * (.4 + r());
    const d = sp * (1 - Math.exp(-dt * 3.2)) / 3.2;
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d + 160 * dt * dt;
    const al = clamp(1 - dt / life) ** 1.4;
    ctx.globalAlpha = al; ctx.fillStyle = colors[i % colors.length];
    ctx.save(); ctx.translate(px, py); ctx.rotate(a + dt * 6 * (r() - .5));
    ctx.beginPath(); ctx.arc(0, 0, sz * .6, 0, 7); ctx.fill();
    ctx.restore();
  }
  // onda de choque
  const sw = E.outCubic(clamp(dt / .55));
  ctx.globalAlpha = (1 - sw) * .8; ctx.strokeStyle = '#21D193'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, 120 + sw * 220, 0, 7); ctx.stroke();
  const sw2 = E.outCubic(clamp((dt - .08) / .6)); ctx.globalAlpha = (1 - sw2) * .4 * (dt > .08); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 120 + sw2 * 360, 0, 7); ctx.stroke();
  ctx.globalAlpha = 1;
}

// ---------- grão de filme ----------
const GRAIN = [];
function buildGrain() {
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = 540; c.height = 960;
    const g = c.getContext('2d'), id = g.createImageData(540, 960), r = rng(99 + k * 31);
    for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    g.putImageData(id, 0, 0); GRAIN.push(c);
  }
}
function updateGrain(frame) { const g = $('#grain').getContext('2d'); g.drawImage(GRAIN[frame % 6], 0, 0); }

// ---------- seek global ----------
function seek(t) {
  const frame = Math.round(t * FPS);
  updateBg(t);
  const ctx = fx.ctx; ctx.clearRect(0, 0, W, H);
  for (const s of SCENES) {
    const on = t >= s.from && t < s.to;
    show(s.el, on);
    if (on) { s.update(s.map ? warp(t, s.map) : t, ctx, t); if (s.post) s.post(t, ctx); }
  }
  updateCaps(t);
  updateGrain(frame);
}
