// ===== Ritza Reels — núcleo: easing, keyframes, utilidades, câmera =====
const W = 1080, H = 1920, FPS = 60, BEAT = 0.5; // 120 BPM
const SAFE_TOP = 250, SAFE_BOTTOM = H - 380;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const inv = (a, b, v) => clamp((v - a) / (b - a));

const E = {
  linear: x => x,
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inCubic: x => x * x * x,
  inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  outQuart: x => 1 - Math.pow(1 - x, 4),
  inQuart: x => x * x * x * x,
  inOutQuart: x => x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
  inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
  outSine: x => Math.sin(x * Math.PI / 2),
  outBack: x => { const c1 = 0.6, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  // mola amortecida: overshoot suave (~6%) e assentamento sem tremor
  spring: x => x >= 1 ? 1 : 1 - Math.exp(-7 * x) * Math.cos(x * Math.PI * 1.2), // ~1% de overshoot, assentamento firme
  softSpring: x => x >= 1 ? 1 : 1 - Math.exp(-7.5 * x) * Math.cos(x * Math.PI * 1.1),
};

// progresso com easing entre t0 e t1
const P = (t, t0, t1, ease = E.inOutCubic) => ease(inv(t0, t1, t));

// keyframes: [[tempo, valor, easing-até-aqui], ...]
function K(t, frames) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1, e] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (t <= t1) {
      const p = (e || E.inOutCubic)((t - t0) / (t1 - t0));
      return v0 + (v1 - v0) * p;
    }
  }
  return frames[frames.length - 1][1];
}

// ruído suave determinístico (deriva de câmera / "respiração" dos cards)
function noise1(x, seed = 0) {
  return Math.sin(x * 1.31 + seed * 12.9) * 0.5 + Math.sin(x * 2.17 + seed * 4.1) * 0.3 + Math.sin(x * 0.61 + seed * 7.7) * 0.2;
}
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

// DOM helpers
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
const _cache = new WeakMap();
function css(el, prop, val) { // evita writes repetidos
  let c = _cache.get(el); if (!c) { c = {}; _cache.set(el, c); }
  if (c[prop] !== val) { el.style[prop] = val; c[prop] = val; }
}
const tf = (el, v) => css(el, 'transform', v);
const op = (el, v) => css(el, 'opacity', String(Math.round(clamp(v) * 1000) / 1000));
const fl = (el, v) => css(el, 'filter', v);
function txt(el, v) { if (el.textContent !== v) el.textContent = v; }
function show(el, v) { css(el, 'display', v ? '' : 'none'); }

// entrada padrão: sobe com mola, desfoque -> nítido
function popIn(el, t, t0, { dur = .8, dy = 90, dx = 0, s0 = .92, rot = 0, blur = 14, ease = E.spring, rx = 0, ry = 0 } = {}) {
  // estilo sóbrio: deslocamentos curtos, sem giros, escala quase neutra
  dy *= .45; dx *= .35; rot = 0; rx *= .15; ry *= .15; s0 = 1 - (1 - s0) * .35; blur = Math.min(blur, 10);
  const p = clamp((t - t0) / dur);
  const e = ease(p);
  const o = E.outCubic(clamp(p * 2.2));
  op(el, o);
  tf(el, `translate3d(${(1 - e) * dx}px, ${(1 - e) * dy}px, 0) scale(${lerp(s0, 1, e)}) rotate(${(1 - e) * rot}deg) rotateX(${(1 - e) * rx}deg) rotateY(${(1 - e) * ry}deg)`);
  fl(el, p < 1 ? `blur(${(1 - E.outCubic(p)) * blur}px)` : 'none');
  return p;
}

// formatação PT-BR
const fmt1 = v => v.toFixed(1).replace('.', ',');
const fmt2 = v => v.toFixed(2).replace('.', ',');
function mmss(sec) { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, '0')}`; }
function hmmss(sec) { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }

// pulso de batida (120 BPM): 1 no ataque, decai em ~0,3 s
function beatPulse(t, from = 0, to = 999) {
  if (t < from || t > to) return 0;
  const ph = ((t - from) % BEAT) / BEAT;
  return Math.exp(-ph * 9);
}
