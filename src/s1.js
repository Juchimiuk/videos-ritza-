// ===== Cena 1 — Gancho em cortes secos (0–2,5 s): uma ideia por tela, fundo invertendo a cada batida =====
scene({
  from: 0, to: 2.55,
  build() {
    const el = this.el = h(`<div class="scene" id="s1" style="z-index:3"></div>`);
    this.bg = h(`<div class="layer" style="background:#fff"></div>`);
    el.appendChild(this.bg);
    const T = (html, style = '') => h(`<div class="layer" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:500;letter-spacing:-.045em;line-height:1;${style}">${html}</div>`);
    // [início, fundo, conteúdo]
    this.shots = [
      [0.0, '#FFFFFF', T(`<div style="font-size:30px;font-weight:600;letter-spacing:.24em;color:#6B6F76;margin-bottom:46px">PARA DONOS DE ASSESSORIA</div><div style="font-size:132px;color:#0A0A0A">Quantos alunos</div>`)],
      [0.5, '#070707', T(`<div style="font-size:84px;color:rgba(255,255,255,.7)">você</div><div style="font-size:250px;color:#fff;margin-top:6px">perdeu</div>`)],
      [1.0, '#FFFFFF', T(`<div style="font-size:150px;color:#0A0A0A">este mês</div>`)],
      [1.5, '#070707', T(`<div style="font-size:84px;color:rgba(255,255,255,.7)">sem</div><div id="s1p" style="font-size:212px;color:#21D193;margin-top:6px;white-space:nowrap">perceber?</div>`)],
    ];
    this.shots.forEach(s => el.appendChild(s[2]));
    $('#scenes').appendChild(el);
  },
  update(t) {
    let cur = 0; this.shots.forEach((s, i) => { if (t >= s[0]) cur = i; });
    css(this.bg, 'background', this.shots[cur][1]);
    this.shots.forEach(([t0, , el], i) => {
      op(el, i === cur ? 1 : 0);
      if (i !== cur) return;
      // dentro de cada corte, só um assentamento curto + deriva lenta (nada parado)
      const p = E.outExpo(inv(t0, t0 + .35, t));
      tf(el, `scale(${lerp(1.035, 1, p) + (t - t0) * .02})`);
    });
    // saída: o quadro inteiro escorre para o lado (whip com borrão) e revela a próxima cena
    const sm = E.inQuart(inv(2.15, 2.55, t));
    if (t > 2.15) { tf(this.el, `translateX(${sm * 1250}px)`); mblur(this.el, Math.sin(Math.min(1, sm * 1.15) * Math.PI) * 80 + sm * 30); }
    else { tf(this.el, 'none'); fl(this.el, 'none'); }
  },
});
