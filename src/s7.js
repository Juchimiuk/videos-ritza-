// ===== Cena 7 — Tela verde "Ritza" → morph no ícone do app → CTA (20,6–26 s) =====
scene({
  from: 20.6, to: 26.05,
  build() {
    const el = this.el = h(`<div class="scene" id="s7" style="color:#0A0A0A"></div>`);
    this.bg = h(`<div class="layer" style="background:#FFFFFF"></div>`);
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    this.head = h(`<div style="position:absolute;left:32px;right:32px;top:736px;text-align:center;font-size:78px;font-weight:500;letter-spacing:-.045em;line-height:1.08"></div>`);
    this.hw = ['O', 'app', 'da', 'sua', 'assessoria', '<br>', 'de', '<span style="color:#21D193">corrida.</span>'].map(w => {
      if (w === '<br>') { this.head.appendChild(document.createElement('br')); return null; }
      const m = h(`<span style="display:inline-block;overflow:hidden;vertical-align:top;padding:0 .12em .14em"><span style="display:inline-block">${w}</span></span>`);
      this.head.appendChild(m); return m.firstElementChild;
    }).filter(Boolean);
    this.btn = h(`<div style="position:absolute;left:32px;top:1060px;width:1016px;height:164px;border-radius:26px;background:#0A0A0A;color:#fff;display:flex;align-items:center;justify-content:center;gap:18px;font-size:46px;font-weight:500;letter-spacing:-.02em;overflow:hidden">
      Agendar demonstração <span style="color:#21D193">· 20 min</span>
      <div class="sh" style="position:absolute;top:-20px;left:0;width:140px;height:210px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.12),rgba(255,255,255,0));transform:skewX(-20deg)"></div></div>`);
    this.url = h(`<div style="position:absolute;left:0;right:0;top:1300px;text-align:center;font-size:54px;font-weight:500;letter-spacing:-.03em">ritza.com.br <span style="color:#6B6F76">· link na bio</span></div>`);
    this.line = h(`<div style="position:absolute;left:190px;top:1384px;width:700px;height:3px;background:#0A0A0A;transform-origin:0 50%;transform:scaleX(0)"></div>`);
    this.star = h(`<div style="position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#21D193;box-shadow:0 0 18px 4px rgba(33,209,147,.6);opacity:0"></div>`);
    this.cam.append(this.head, this.btn, this.url, this.line, this.star);
    // tela verde cheia que vira o ícone do app
    this.card = h(`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;background:#21D193;overflow:hidden;display:flex;align-items:center;justify-content:center">
      <div class="wm" style="font-size:280px;font-weight:500;letter-spacing:-.06em;color:#0A0A0A">ritza</div>
      <img class="lg" src="../assets/logo_hd.png" style="position:absolute;left:50%;top:50%;width:64%;transform:translate(-50%,-50%);opacity:0"></div>`);
    el.append(this.bg, this.cam, this.card);
    $('#s7host').appendChild(el);
  },
  update(t) {
    // 1) whip para a tela verde (20,6–21,05)
    const wi = E.outQuart(inv(20.6, 21.05, t));
    // 2) morph: a tela verde encolhe até o ícone (21,6–22,25)
    const m = E.inOutQuart(inv(21.6, 22.25, t));
    const w = lerp(1080, 380, m), hh = lerp(1920, 380, m);
    const cx = 540, cy = lerp(960, 470, m);
    css(this.card, 'width', `${w}px`); css(this.card, 'height', `${hh}px`);
    css(this.card, 'borderRadius', `${lerp(0, 98, m)}px`);
    const g = [33, 209, 147], k = [10, 10, 10], c = g.map((v, i) => Math.round(lerp(v, k[i], E.inOutCubic(inv(21.85, 22.25, t)))));
    css(this.card, 'background', `rgb(${c.join(',')})`);
    css(this.card, 'boxShadow', `0 40px 80px -30px rgba(0,0,0,${.5 * m})`);
    const breathe = K(t, [[21.05, 1], [21.6, 1.03, E.inOutSine]]);
    tf(this.card, `translate(${cx - w / 2 + (1 - wi) * 1300}px, ${cy - hh / 2}px) scale(${m > 0 ? 1 : breathe})`);
    if (t < 21.05) mblur(this.card, (1 - wi) * 90); else fl(this.card, 'none');
    const wm = this.card.querySelector('.wm');
    op(wm, 1 - inv(21.6, 21.85, t)); tf(wm, `scale(${lerp(1, .5, E.inCubic(inv(21.6, 21.85, t)))})`);
    const lg = this.card.querySelector('.lg');
    const lp = E.outExpo(inv(22.0, 22.5, t)); op(lg, lp); tf(lg, `translate(-50%,-50%) scale(${lerp(.85, 1, lp)})`);
    // 3) CTA entra palavra a palavra; um ponto verde risca a linha sob o site
    op(this.bg, t > 21.55 ? 1 : 0); op(this.cam, t > 21.55 ? 1 : 0);
    this.hw.forEach((s, i) => { const p = E.outExpo(inv(22.25 + i * .06, 22.95 + i * .06, t)); tf(s, `translateY(${(1 - p) * 110}%)`); });
    popIn(this.btn, t, 22.7, { dy: 80, ease: E.outExpo });
    tf(this.btn.querySelector('.sh'), `translateX(${-200 + ((((t - 23.3) % 1.4) + 1.4) % 1.4) / 1.4 * 1400}px) skewX(-20deg)`);
    popIn(this.url, t, 22.95, { dy: 50, ease: E.outExpo });
    const lw = E.inOutCubic(inv(23.3, 23.95, t));
    tf(this.line, `scaleX(${lw})`);
    op(this.star, lw > 0 && lw < 1 ? 1 : lw >= 1 ? 1 - inv(23.95, 24.3, t) : 0);
    tf(this.star, `translate(${190 + 700 * lw}px, 1385px) scale(${1 + Math.sin(lw * Math.PI) * .6})`);
    // câmera: push-in contínuo até o fim
    tf(this.cam, `scale(${K(t, [[21.6, 1.03], [22.6, 1, E.outExpo], [26, 1.035, E.inOutSine]])})`);
  },
});
