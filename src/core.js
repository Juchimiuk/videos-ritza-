// ===== Ritza Reels — núcleo: easing, keyframes, utilidades, câmera =====
const W = 1080, H = 1920, FPS = 60, BEAT = 0.5; // 120 BPM
const SAFE_TOP = 250, SAFE_BOTTOM = H - 380;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const inv = (a, b, v) => clamp((v - a) / (b - a));

// ---------- Motion (motion.dev) ----------
// Todas as curvas e molas do vídeo vêm da biblioteca Motion. Como o vídeo é renderizado quadro a quadro,
// usamos os geradores da Motion de forma determinística: a mola física (Motion.spring) é amostrada em
// tabela e as curvas de easing são as funções cubicBezier da própria Motion.
const M = window.Motion;
const _springs = new Map();
// mola física da Motion: devolve f(segundos decorridos) -> 0..1
function mspring(bounce = .1, visualDuration = .5) {
  const key = bounce + '|' + visualDuration;
  if (_springs.has(key)) return _springs.get(key);
  const g = M.spring({ keyframes: [0, 1], bounce, visualDuration });
  const N = 3000, lut = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) lut[i] = g.next(i).value;
  const f = sec => { if (sec <= 0) return 0; const ms = sec * 1000; if (ms >= N) return 1; const i = Math.floor(ms); return lut[i] + (lut[i + 1] - lut[i]) * (ms - i); };
  _springs.set(key, f); return f;
}
const cb = (a, b, c, d) => M.cubicBezier(a, b, c, d);
const E = {
  linear: x => x,
  outCubic: cb(.33, 1, .68, 1),
  inCubic: cb(.32, 0, .67, 0),
  inOutCubic: cb(.65, 0, .35, 1),
  outQuart: cb(.25, 1, .5, 1),
  inQuart: cb(.5, 0, .75, 0),
  inOutQuart: cb(.76, 0, .24, 1),
  outExpo: cb(.16, 1, .3, 1),
  inExpo: cb(.7, 0, .84, 0),
  inOutExpo: cb(.87, 0, .13, 1),
  inOutSine: M.easeInOut,
  outSine: M.easeOut,
  outBack: cb(.34, 1.18, .64, 1),
  // molas físicas da Motion (tempo normalizado: 1 = 1 s)
  spring: (() => { const f = mspring(.1, .55); return x => x >= 1 ? 1 : f(x); })(),
  softSpring: (() => { const f = mspring(.05, .7); return x => x >= 1 ? 1 : f(x); })(),
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
  // padrão: mola física da Motion medida em tempo real decorrido (não normalizado)
  const e = ease === E.spring ? mspring(.1, dur * .6)(t - t0) : ease(p);
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
