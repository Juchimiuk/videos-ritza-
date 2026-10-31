// ===== Cena 1 — Gancho (0–3 s): tipografia editorial =====
scene({
  from: 0, to: 3.05,
  build() {
    const el = this.el = h(`<div class="scene" id="s1"></div>`);
    // linhas finas de pista (eco discreto das faixas do logo)
    this.lines = [];
    for (let i = 0; i < 3; i++) {
      const s = h(`<div style="position:absolute;left:-200px;top:${1320 + i * 26}px;width:1480px;height:2px;background:linear-gradient(90deg,rgba(33,209,147,0),rgba(33,209,147,${.55 - i * .15}) 50%,rgba(33,209,147,0));transform-origin:0 50%"></div>`);
      el.appendChild(s); this.lines.push(s);
    }
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`); el.appendChild(this.cam);
    const L = (y, size, words, weight = 800) => {
      const line = h(`<div style="position:absolute;left:0;right:0;top:${y}px;text-align:center;font-size:${size}px;font-weight:${weight};letter-spacing:-.045em;line-height:1.02;white-space:nowrap"></div>`);
      const spans = words.map(w => { const m = h(`<span style="display:inline-block;overflow:hidden;vertical-align:top;padding:0 .08em .24em;margin-bottom:-.16em"><span style="display:inline-block">${w}</span></span>`); line.appendChild(m); return m.firstElementChild; });
      return { line, spans };
    };
    this.kicker = h(`<div style="position:absolute;left:0;right:0;top:286px;text-align:center;font-size:26px;font-weight:600;letter-spacing:.32em;color:rgba(255,255,255,.5)">PARA DONOS DE ASSESSORIA</div>`);
    this.A = h(`<div class="layer" style="transform-origin:540px 500px"></div>`);
    const a1 = L(378, 152, ['Quem', 'treinou']);
    const a2 = L(560, 152, ['hoje?']);
    this.A.append(this.kicker, a1.line, a2.line);
    this.B = h(`<div class="layer"></div>`);
    const b1 = L(800, 188, ['Agora']);
    const b2 = L(1010, 188, ['você', 'sabe.']);
    b2.spans[0].innerHTML = 'v<span id="s1o">o</span>cê';
    b2.spans[1].style.color = '#21D193';
    this.B.append(b1.line, b2.line);
    this.rule = h(`<div style="position:absolute;left:340px;top:1240px;width:400px;height:3px;background:#21D193;transform-origin:50% 50%"></div>`);
    this.B.appendChild(this.rule);
    this.cam.append(this.A, this.B);
    this.words = [...a1.spans, ...a2.spans];
    this.wordsB = [...b1.spans, ...b2.spans];
    $('#scenes').appendChild(el);
  },
  measure() {
    let e = $('#s1o'), x = e.offsetWidth / 2, y = e.offsetHeight * .56;
    while (e && e !== this.cam) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    this.fx = x; this.fy = y;
  },
  // revelação por máscara: a palavra sobe de dentro da própria linha
  mask(w, t, t0, dur = .55) {
    const p = E.outExpo(inv(t0, t0 + dur, t));
    tf(w, `translateY(${(1 - p) * 105}%)`);
  },
  update(t) {
    if (this.fx === undefined) this.measure();
    this.lines.forEach((s, i) => {
      const p = E.outExpo(inv(.1 + i * .08, 1.1 + i * .08, t));
      tf(s, `translateX(${(t - 1.5) * -40}px) scaleX(${p})`);
    });
    op(this.kicker, P(t, 0, .4)); tf(this.kicker, `translateY(${(1 - E.outExpo(inv(0, .6, t))) * 20}px)`);
    this.words.forEach((w, i) => this.mask(w, t, i * .25));
    const ka = E.inOutQuart(inv(1.0, 1.6, t));
    tf(this.A, `translateY(${-150 * ka}px) scale(${lerp(1, .62, ka)})`);
    op(this.A, lerp(1, .32, ka));
    this.wordsB.forEach((w, i) => this.mask(w, t, 1.0 + i * .25, .6));
    tf(this.rule, `scaleX(${E.outExpo(inv(1.7, 2.3, t))})`);
    // câmera: push-in lento, depois zoom-through no "o" de "você"
    const drift = K(t, [[0, 1], [2.0, 1.05, E.inOutSine]]);
    const zt = inv(1.95, 3.0, t);
    const z = drift * Math.pow(46, E.inQuart(zt));
    const fk = E.inOutCubic(inv(1.9, 2.5, t));
    const fxp = lerp(540, this.fx, fk), fyp = lerp(820, this.fy, fk);
    css(this.cam, 'transformOrigin', `${fxp}px ${fyp}px`);
    tf(this.cam, `translate(${(540 - fxp) * fk}px, ${(820 - fyp) * fk}px) scale(${z})`);
    fl(this.cam, zt > .35 ? `blur(${(zt - .35) * 12}px)` : 'none');
    op(this.el, 1 - P(t, 2.6, 2.95, E.inCubic));
  },
});
