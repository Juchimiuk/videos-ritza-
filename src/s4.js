// ===== Cena 5 do roteiro — Evolução (16–19 s): dois números grandes, nada de gráfico ilegível =====
scene({
  from: 15.55, to: 19.0,
  build() {
    const D = DATA;
    const el = this.el = h(`<div class="scene" id="s4" style="color:#0A0A0A"></div>`);
    this.world = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.appendChild(this.world);
    this.head = h(`<div class="chip" style="position:absolute;left:32px;top:172px;background:#0A0A0A;color:#fff;font-size:24px;letter-spacing:.14em;padding:10px 24px 10px 10px">
      <div class="avatar" style="width:46px;height:46px;font-size:17px;background:#21D193;color:#0A0A0A">MC</div>EVOLUÇÃO · MARIANA · 12 SEMANAS</div>`);
    // card 1 — ritmo médio
    const px = i => 10 + i * (900 / 11);
    const ys = D.ritmoSemana.map(v => 16 + (372 - v) / 40 * 190);
    let dpath = `M ${px(0)} ${ys[0]}`;
    for (let i = 1; i < 12; i++) { const xm = (px(i - 1) + px(i)) / 2; dpath += ` C ${xm} ${ys[i - 1]}, ${xm} ${ys[i]}, ${px(i)} ${ys[i]}`; }
    this.A = h(`<div class="glass light card4" style="top:262px;height:580px">
      <div class="k" style="font-size:22px">RITMO MÉDIO</div>
      <div style="display:flex;align-items:baseline;gap:18px;margin-top:18px"><div class="big" style="font-size:168px;letter-spacing:-.055em"><span style="color:#21D193">−</span><span id="e1n">0</span><span style="font-size:64px;letter-spacing:-.03em"> s/km</span></div></div>
      <div style="font-size:34px;font-weight:500;color:#6B6F76;margin-top:10px">de <b style="color:#0A0A0A">6:12</b> para <b style="color:#0A0A0A">5:32</b> por km</div>
      <svg style="position:absolute;left:48px;bottom:40px;overflow:visible" width="920" height="210">
        <defs><linearGradient id="e1a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21D193" stop-opacity=".18"/><stop offset="1" stop-color="#21D193" stop-opacity="0"/></linearGradient>
        <clipPath id="e1c"><rect id="e1cr" x="0" y="-40" width="0" height="300"/></clipPath></defs>
        <g clip-path="url(#e1c)"><path d="${dpath} L ${px(11)} 210 L ${px(0)} 210 Z" fill="url(#e1a)"/><path id="e1p" d="${dpath}" fill="none" stroke="#0A0A0A" stroke-width="6" stroke-linecap="round"/></g>
        <circle id="e1d" r="13" fill="#21D193" stroke="#fff" stroke-width="5"/></svg></div>`);
    // card 2 — recorde
    this.B = h(`<div class="glass light card4" style="top:880px;height:500px;background:#0A0A0A;border-color:#0A0A0A;color:#fff">
      <div style="display:flex;align-items:center;gap:16px"><div class="pill" style="background:#21D193;color:#0A0A0A;font-size:22px;letter-spacing:.16em">NOVO RECORDE</div><div style="font-size:28px;font-weight:600;color:rgba(255,255,255,.6)">5 km · ${D.recorde5k.data}</div></div>
      <div style="display:flex;align-items:center;gap:36px;margin-top:30px">
        <div id="e2m" style="width:190px;height:190px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 3px #21D193;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-size:66px;font-weight:700;letter-spacing:-.04em;line-height:1">5K</div><div style="font-size:17px;font-weight:600;letter-spacing:.24em;color:#21D193;margin-top:6px">RECORDE</div></div>
        <div><div id="e2t" style="font-size:176px;font-weight:700;letter-spacing:-.055em;line-height:.9">29:40</div>
          <div style="font-size:32px;font-weight:500;color:rgba(255,255,255,.6);margin-top:18px">${D.recorde5k.ritmo} · <b style="color:#21D193;font-weight:700">−38 s</b> no melhor tempo</div></div></div></div>`);
    this.world.append(this.head, this.A, this.B);
    $('#scenes').appendChild(el);
    this.lp = this.A.querySelector('#e1p'); this.lpL = this.lp.getTotalLength();
  },
  update(t) {
    // entrada: whip-pan vindo da direita (continua o movimento do Strava)
    const wi = E.outQuart(inv(15.6, 16.1, t));
    if (t < 16.1) { tf(this.el, `translateX(${1400 * (1 - wi)}px)`); mblur(this.el, (1 - wi) * 80); }
    else if (t > 18.55) { // saída por zoom-through no recorde
      const z = E.inExpo(inv(18.55, 19.0, t));
      css(this.el, 'transformOrigin', '540px 1100px');
      tf(this.el, `scale(${Math.pow(12, z)})`); op(this.el, 1 - E.inCubic(inv(18.7, 19.0, t))); fl(this.el, `blur(${z * 12}px)`);
    } else { tf(this.el, 'none'); fl(this.el, 'none'); op(this.el, 1); }
    tf(this.world, `translateY(${Math.sin(t * .9) * 4}px) scale(${K(t, [[16, 1], [18.6, 1.03, E.inOutSine]])})`);
    popIn(this.head, t, 15.95, { dy: 40 });
    popIn(this.A, t, 16.0, { dy: 140 });
    popIn(this.B, t, 16.5, { dy: 160 });
    // −40 s/km contando + linha desenhando
    txt($('#e1n'), String(Math.round(40 * P(t, 16.15, 17.0, E.outCubic))));
    const lp = P(t, 16.1, 17.1, E.inOutCubic);
    $('#e1cr').setAttribute('width', String(920 * lp + 14));
    const pt = this.lp.getPointAtLength(this.lpL * lp);
    const d = $('#e1d'); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y);
    // 29:40 -> 27:00
    txt($('#e2t'), mmss(lerp(29 * 60 + 40, 27 * 60, P(t, 16.75, 17.6, E.outCubic))));
    const m = E.spring(inv(16.9, 17.6, t));
    tf($('#e2m'), `scale(${lerp(.85, 1, m)}) rotate(${(1 - m) * -20}deg)`); op($('#e2m'), m);
  },
});
