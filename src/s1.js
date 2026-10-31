// ===== Cena 1 — Gancho (0–3 s): a dor do dono de assessoria, legível desde o quadro 0 =====
scene({
  from: 0, to: 3.05,
  build() {
    const el = this.el = h(`<div class="scene" id="s1"></div>`);
    this.lines = [];
    for (let i = 0; i < 3; i++) {
      const s = h(`<div style="position:absolute;left:-200px;top:${1300 + i * 26}px;width:1480px;height:2px;background:linear-gradient(90deg,rgba(33,209,147,0),rgba(33,209,147,${.55 - i * .15}) 50%,rgba(33,209,147,0));transform-origin:0 50%"></div>`);
      el.appendChild(s); this.lines.push(s);
    }
    this.cam = h(`<div class="layer" style="transform-origin:540px 760px"></div>`); el.appendChild(this.cam);
    this.kicker = h(`<div style="position:absolute;left:0;right:0;top:250px;text-align:center"><span style="display:inline-block;padding:14px 30px;border-radius:999px;border:1.5px solid rgba(33,209,147,.6);font-size:34px;font-weight:700;letter-spacing:.16em;color:#21D193">PARA DONOS DE ASSESSORIA</span></div>`);
    const L = (y, text, color = '#fff') => h(`<div style="position:absolute;left:0;right:0;top:${y}px;text-align:center;font-size:124px;font-weight:800;letter-spacing:-.045em;line-height:1;white-space:nowrap;color:${color}">${text}</div>`);
    this.l = [L(400, 'Quantos alunos'), L(530, 'v<span id="s1o">o</span>cê perdeu'), L(660, 'este mês'), L(790, 'sem perceber?', '#21D193')];
    this.rule = h(`<div style="position:absolute;left:250px;top:935px;width:580px;height:4px;background:#21D193;transform-origin:0 50%"></div>`);
    this.sub = h(`<div style="position:absolute;left:60px;right:60px;top:1000px;text-align:center;font-size:44px;font-weight:500;line-height:1.3;color:rgba(255,255,255,.78)">O Ritza mostra quem está sumindo<br><b style="color:#fff;font-weight:700">antes de o aluno cancelar.</b></div>`);
    this.cam.append(this.kicker, ...this.l, this.rule, this.sub);
    $('#scenes').appendChild(el);
  },
  measure() {
    let e = $('#s1o'), x = e.offsetWidth / 2, y = e.offsetHeight * .58;
    while (e && e !== this.cam) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    this.fx = x; this.fy = y;
  },
  update(t) {
    if (this.fx === undefined) this.measure();
    this.lines.forEach((s, i) => tf(s, `translateX(${(t - 1.5) * -40}px) scaleX(${E.outExpo(inv(.1 + i * .08, 1.1 + i * .08, t))})`));
    // a pergunta já está inteira no quadro 0; só assenta com um leve movimento
    this.l.forEach((l, i) => { const p = E.outExpo(inv(0, .9 + i * .08, t)); tf(l, `translateY(${(1 - p) * (14 + i * 6)}px)`); op(l, 1); });
    tf(this.kicker, `translateY(${(1 - E.outExpo(inv(0, .8, t))) * -10}px)`);
    tf(this.rule, `scaleX(${E.outExpo(inv(.45, 1.1, t))})`);
    const sp = E.outExpo(inv(.9, 1.6, t));
    op(this.sub, sp); tf(this.sub, `translateY(${(1 - sp) * 30}px)`);
    // câmera: push-in lento, depois zoom-through no "o" de "você"
    const drift = K(t, [[0, 1], [2.0, 1.05, E.inOutSine]]);
    const zt = inv(2.0, 3.0, t);
    const z = drift * Math.pow(46, E.inQuart(zt));
    const fk = E.inOutCubic(inv(1.95, 2.5, t));
    const fxp = lerp(540, this.fx, fk), fyp = lerp(760, this.fy, fk);
    css(this.cam, 'transformOrigin', `${fxp}px ${fyp}px`);
    tf(this.cam, `translate(${(540 - fxp) * fk}px, ${(760 - fyp) * fk}px) scale(${z})`);
    fl(this.cam, zt > .35 ? `blur(${(zt - .35) * 12}px)` : 'none');
    op(this.el, 1 - P(t, 2.6, 2.95, E.inCubic));
  },
});
