// ===== Cena 1 — Gancho (0–3 s) =====
scene({
  from: 0, to: 3.05,
  build() {
    const el = this.el = h(`<div class="scene" id="s1"></div>`);
    // faixas de pista em paralaxe (eco das linhas do logo)
    this.streaks = [];
    const cols = ['#21D193', '#3B82F6', '#21D193', '#FF3D8B', '#21D193', '#FFC93C'];
    for (let i = 0; i < 6; i++) {
      const s = h(`<div style="position:absolute;left:0;top:0;width:${700 + i * 90}px;height:${10 + (i % 3) * 6}px;border-radius:20px;background:linear-gradient(90deg,rgba(0,0,0,0),${cols[i]})"></div>`);
      el.appendChild(s); this.streaks.push(s);
    }
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`); el.appendChild(this.cam);
    const L = (y, size, words, cls = '') => {
      const line = h(`<div style="position:absolute;left:0;right:0;top:${y}px;text-align:center;font-size:${size}px;font-weight:900;letter-spacing:-.045em;line-height:1.02;white-space:nowrap"></div>`);
      const spans = words.map(w => { const s = h(`<span style="display:inline-block;margin:0 .1em;transform-origin:50% 80%">${w}</span>`); if (cls) s.className = cls; line.appendChild(s); return s; });
      return { line, spans };
    };
    this.A = h(`<div class="layer" style="transform-origin:540px 560px"></div>`);
    const a1 = L(430, 146, ['Quem', 'treinou']);
    const a2 = L(590, 146, ['hoje?']);
    a2.spans[0].style.color = '#21D193';
    this.A.append(a1.line, a2.line);
    this.under = h(`<svg style="position:absolute;left:330px;top:735px;overflow:visible" width="420" height="60"><path d="M6 34 C 110 8, 260 6, 414 26" fill="none" stroke="#FFC93C" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`);
    this.A.appendChild(this.under);
    this.B = h(`<div class="layer"></div>`);
    const b1 = L(820, 176, ['Agora'], 'grad-text');
    const b2 = L(1000, 176, ['você', 'sabe.'], 'grad-text');
    b2.spans[0].innerHTML = 'v<span id="s1o">o</span>cê';
    this.B.append(b1.line, b2.line);
    this.cam.append(this.A, this.B);
    this.words = [...a1.spans, ...a2.spans];
    this.wordsB = [...b1.spans, ...b2.spans];
    // brilho atrás do texto
    this.glow = h(`<div style="position:absolute;left:90px;top:640px;width:900px;height:640px;border-radius:50%;background:radial-gradient(closest-side,rgba(33,209,147,.35),rgba(33,209,147,0))"></div>`);
    this.cam.insertBefore(this.glow, this.B);
    $('#scenes').appendChild(el);
  },
  measure() {
    // ponto de foco do zoom (centro do "o" de "você"), sem transformações
    let e = $('#s1o'), x = e.offsetWidth / 2, y = e.offsetHeight * .56;
    while (e && e !== this.cam) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    this.fx = x; this.fy = y;
  },
  update(t) {
    if (this.fx === undefined) this.measure();
    // faixas de pista
    this.streaks.forEach((s, i) => {
      const sp = 900 + i * 260, y = 300 + i * 190;
      const x = ((t * sp + i * 600) % 2600) - 1300;
      op(s, .22 + .12 * (i % 2));
      tf(s, `translate3d(${x}px, ${y + Math.sin(t * 2 + i) * 20}px, 0) rotate(-18deg)`);
    });
    // palavras do 1º bloco: entram nos tempos 0 / 0,25 / 0,5
    this.words.forEach((w, i) => popIn(w, t, i * .25, { dy: 150, rx: -70, blur: 18, dur: .75, s0: .7 }));
    css(this.under.firstElementChild, 'strokeDashoffset', String(1 - P(t, .62, 1.0, E.outCubic)));
    // bloco A sobe e recua (1,0–1,5)
    const ka = E.spring(inv(1.0, 1.75, t));
    tf(this.A, `translateY(${-210 * ka}px) scale(${lerp(1, .64, ka)})`);
    op(this.A, lerp(1, .5, ka));
    // bloco B: "Agora" "você" "sabe." nos tempos 1,0 / 1,25 / 1,5
    this.wordsB.forEach((w, i) => popIn(w, t, 1.0 + i * .25, { dy: 0, s0: 1.9, blur: 26, dur: .7, rot: i % 2 ? 4 : -4 }));
    op(this.glow, P(t, 1.0, 1.8) * (.7 + .3 * Math.sin(t * 6)));
    tf(this.glow, `scale(${.8 + .25 * P(t, 1, 2.2, E.outCubic) + beatPulse(t, 1, 3) * .06})`);
    // câmera: push-in lento + leve rotação, depois zoom-through no "o" de "você"
    const drift = K(t, [[0, 1], [2.0, 1.09, E.inOutSine]]);
    const zt = inv(1.95, 3.0, t);
    const z = drift * Math.pow(46, E.inQuart(zt)); // exponencial = velocidade constante percebida
    const fxp = lerp(540, this.fx, E.inOutCubic(inv(1.9, 2.5, t)));
    const fyp = lerp(820, this.fy, E.inOutCubic(inv(1.9, 2.5, t)));
    const rot = Math.sin(t * 1.3) * 1.2 * (1 - zt);
    // mantém o ponto de foco fixo na tela enquanto escala
    const tx = 540 - fxp, ty = 820 - fyp;
    css(this.cam, 'transformOrigin', `${fxp}px ${fyp}px`);
    tf(this.cam, `translate(${tx * E.inOutCubic(inv(1.9, 2.5, t))}px, ${ty * E.inOutCubic(inv(1.9, 2.5, t))}px) scale(${z}) rotate(${rot}deg)`);
    fl(this.cam, zt > .3 ? `blur(${(zt - .3) * 14}px)` : 'none');
    op(this.el, 1 - P(t, 2.6, 2.95, E.inCubic));
  },
});
