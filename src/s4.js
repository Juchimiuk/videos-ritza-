// ===== Cena 5 do roteiro — Evolução (16–19 s): dois números grandes, nada de gráfico ilegível =====
scene({
  from: 15.0, to: 18.05,
  build() {
    const D = DATA;
    const el = this.el = h(`<div class="scene" id="s4" style="color:#0A0A0A"></div>`);
    this.world = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.appendChild(this.world);
    const W = (top, html, size) => h(`<div style="position:absolute;left:0;right:0;top:${top}px;text-align:center;font-size:${size}px;font-weight:500;letter-spacing:-.045em;line-height:1;color:#0A0A0A;overflow:hidden;padding-bottom:.14em"><div style="display:inline-block">${html}</div></div>`);
    this.head = W(168, 'Mostre a <span style="color:#21D193">evolução.</span>', 96);
    this.foot = W(1418, 'Aluno motivado fica.', 66);
    this.curtain = h(`<div class="layer" style="background:#070707;transform-origin:50% 100%;transform:scaleY(0)"></div>`);
    // card 1 — ritmo médio
    const px = i => 10 + i * (828 / 11);
    const ys = D.ritmoSemana.map(v => 12 + (372 - v) / 40 * 140);
    let dpath = `M ${px(0)} ${ys[0]}`;
    for (let i = 1; i < 12; i++) { const xm = (px(i - 1) + px(i)) / 2; dpath += ` C ${xm} ${ys[i - 1]}, ${xm} ${ys[i]}, ${px(i)} ${ys[i]}`; }
    this.A = h(`<div class="glass light card4" style="top:318px;height:540px">
      <div class="k" style="font-size:22px">RITMO MÉDIO · MARIANA · 12 SEMANAS</div>
      <div style="display:flex;align-items:baseline;gap:18px;margin-top:18px"><div class="big" style="font-size:168px;letter-spacing:-.055em"><span style="color:#21D193">−</span><span id="e1n">0</span><span style="font-size:64px;letter-spacing:-.03em"> s/km</span></div></div>
      <div style="font-size:34px;font-weight:500;color:#6B6F76;margin-top:10px">de <b style="color:#0A0A0A">6:12</b> para <b style="color:#0A0A0A">5:32</b> por km</div>
      <svg style="position:absolute;left:44px;bottom:40px;overflow:visible" width="848" height="160">
        <defs><linearGradient id="e1a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21D193" stop-opacity=".18"/><stop offset="1" stop-color="#21D193" stop-opacity="0"/></linearGradient>
        <clipPath id="e1c"><rect id="e1cr" x="0" y="-40" width="0" height="300"/></clipPath></defs>
        <g clip-path="url(#e1c)"><path d="${dpath} L ${px(11)} 160 L ${px(0)} 160 Z" fill="url(#e1a)"/><path id="e1p" d="${dpath}" fill="none" stroke="#0A0A0A" stroke-width="6" stroke-linecap="round"/></g>
        <circle id="e1d" r="13" fill="#21D193" stroke="#fff" stroke-width="5"/></svg></div>`);
    // card 2 — recorde
    this.B = h(`<div class="glass light card4" style="top:886px;height:476px;background:#0A0A0A;border-color:#0A0A0A;color:#fff">
      <div style="display:flex;align-items:center;gap:16px"><div class="pill" style="background:#21D193;color:#0A0A0A;font-size:22px;letter-spacing:.16em">NOVO RECORDE</div><div style="font-size:28px;font-weight:600;color:rgba(255,255,255,.6)">5 km · ${D.recorde5k.data}</div></div>
      <div style="display:flex;align-items:center;gap:36px;margin-top:30px">
        <div id="e2m" style="width:190px;height:190px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 3px #21D193;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-size:66px;font-weight:700;letter-spacing:-.04em;line-height:1">5K</div><div style="font-size:17px;font-weight:600;letter-spacing:.24em;color:#21D193;margin-top:6px">RECORDE</div></div>
        <div><div id="e2t" style="font-size:176px;font-weight:500;letter-spacing:-.055em;line-height:.9">29:40</div>
          <div style="font-size:32px;font-weight:500;color:rgba(255,255,255,.6);margin-top:18px">${D.recorde5k.ritmo} · <b style="color:#21D193;font-weight:700">−38 s</b> no melhor tempo</div></div></div></div>`);
    this.world.append(this.head, this.A, this.B, this.foot);
    el.appendChild(this.curtain);
    $('#scenes').appendChild(el);
    this.lp = this.A.querySelector('#e1p'); this.lpL = this.lp.getTotalLength();
  },
  update(t) {
    // entrada por corte seco (inversão escuro → claro) e saída por cortina preta subindo
    tf(this.el, 'none'); fl(this.el, 'none'); op(this.el, 1);
    tf(this.curtain, `scaleY(${E.inOutQuart(inv(17.6, 18.0, t))})`);
    tf(this.world, `scale(${K(t, [[15, 1.02], [15.5, 1, E.outExpo], [18, 1.03, E.inOutSine]])})`);
    const hp = E.outExpo(inv(15.05, 15.65, t)); tf(this.head.firstElementChild, `translateY(${(1 - hp) * 110}%)`);
    const fp = E.outExpo(inv(16.3, 16.9, t)); tf(this.foot.firstElementChild, `translateY(${(1 - fp) * 110}%)`);
    popIn(this.A, t, 15.1, { dy: 120 });
    popIn(this.B, t, 15.45, { dy: 140 });
    txt($('#e1n'), String(Math.round(40 * P(t, 15.25, 16.05, E.outCubic))));
    const lp = P(t, 15.2, 16.2, E.inOutCubic);
    $('#e1cr').setAttribute('width', String(848 * lp + 14));
    const pt = this.lp.getPointAtLength(this.lpL * lp);
    const d = $('#e1d'); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y);
    txt($('#e2t'), mmss(lerp(29 * 60 + 40, 27 * 60, P(t, 15.7, 16.5, E.outCubic))));
    const m = E.spring(inv(15.85, 16.55, t));
    tf($('#e2m'), `scale(${lerp(.85, 1, m)})`); op($('#e2m'), m);
  },
});
