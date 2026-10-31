// ===== Cena 7 — CTA (31–34 s) =====
scene({
  from: 21.95, to: 26.05,
  map: [[21.95, 30.55], [26.1, 34.7]],
  build() {
    const el = this.el = h(`<div class="scene" id="s7" style="color:#07111F"></div>`);
    this.blobs = [];
    [['rgba(255,255,255,.35)', 1100], ['rgba(0,0,0,.08)', 1300]].forEach(([c, s]) => {
      const b = h(`<div style="position:absolute;left:0;top:0;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(closest-side,${c},rgba(33,209,147,0))"></div>`);
      el.appendChild(b); this.blobs.push(b);
    });
    this.stripes = h(`<div style="position:absolute;left:-600px;top:-400px;width:2400px;height:2800px;opacity:0;background:none"></div>`);
    el.appendChild(this.stripes);
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.appendChild(this.cam);
    this.icon = h(`<div style="position:absolute;left:350px;top:190px;width:380px;height:380px;border-radius:98px;background:#0A0A0A;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12)">
      <img src="../assets/logo_hd.png" style="width:244px">
      <div id="s7shine" style="position:absolute;top:-80px;left:0;width:90px;height:480px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.12),rgba(255,255,255,0))"></div></div>`);
    this.word = h(`<div style="position:absolute;left:0;right:0;top:670px;text-align:center;font-size:164px;font-weight:800;letter-spacing:-.055em;line-height:1;color:#0A0A0A">Ritza</div>`);
    this.head = h(`<div style="position:absolute;left:32px;right:32px;top:900px;text-align:center;font-size:74px;font-weight:600;letter-spacing:-.035em;line-height:1.12;color:#0A0A0A"></div>`);
    this.hw = ['O', 'app', 'da', 'sua', 'assessoria', '<br>', 'de', 'corrida'].map(w => {
      if (w === '<br>') { this.head.appendChild(document.createElement('br')); return null; }
      const s = h(`<span style="display:inline-block;margin:0 .14em">${w}</span>`); this.head.appendChild(s); return s;
    }).filter(Boolean);
    this.btn = h(`<div style="position:absolute;left:32px;top:1210px;width:1016px;height:164px;border-radius:24px;background:#0A0A0A;color:#fff;display:flex;align-items:center;justify-content:center;gap:18px;font-size:46px;font-weight:600;letter-spacing:-.015em;overflow:hidden;box-shadow:0 30px 60px -26px rgba(0,0,0,.6)">
      <svg width="40" height="40" viewBox="0 0 44 44"><rect x="5" y="9" width="34" height="30" rx="6" fill="none" stroke="#21D193" stroke-width="3"/><path d="M5 18 H39 M14 4 V13 M30 4 V13" stroke="#21D193" stroke-width="3" stroke-linecap="round"/></svg>
      Agendar demonstração <span style="color:#21D193">· 20 min</span>
      <div id="s7bshine" style="position:absolute;top:-20px;left:0;width:120px;height:180px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.10),rgba(255,255,255,0));transform:skewX(-20deg)"></div></div>`);
    this.url = h(`<div style="position:absolute;left:0;right:0;top:1446px;text-align:center;font-size:56px;font-weight:700;letter-spacing:-.025em;color:#0A0A0A">ritza.com.br <span style="font-weight:500;opacity:.7">· link na bio</span>
      <svg style="position:absolute;left:178px;top:76px;overflow:visible" width="340" height="20"><path d="M4 10 C 100 2, 240 2, 336 10" fill="none" stroke="#0A0A0A" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div>`);
    this.cam.append(this.icon, this.word, this.head, this.btn, this.url);
    $('#s7host').appendChild(el);
  },
  update(t) {
    // wipe circular verde a partir da notificação do celular
    const w = E.inOutCubic(inv(30.55, 31.15, t));
    css($('#bgGreen'), 'clipPath', `circle(${w * 2300}px at 540px 820px)`);
    css(this.el, 'clipPath', `circle(${w * 2300}px at 540px 820px)`);
    this.blobs.forEach((b, i) => tf(b, `translate(${200 + Math.sin(t * .7 + i * 2) * 400 - 300}px, ${300 + i * 330 + Math.cos(t * .6 + i) * 200}px) scale(1)`));
    tf(this.stripes, `translate(${(t - 31) * -70}px, ${(t - 31) * 40}px)`);
    // logo, marca, título, botão, site — entram nas batidas
    popIn(this.icon, t, 30.9, { dy: 100, s0: .85, blur: 12, dur: .9, ease: E.outExpo });
    tf($('#s7shine'), `translateX(${-120 + E.inOutCubic(inv(31.6, 32.3, t)) * 520}px) rotate(20deg)`);
    popIn(this.word, t, 31.25, { dy: 80, ease: E.outExpo });
    this.hw.forEach((s, i) => popIn(s, t, 31.5 + i * .06, { dy: 70, dur: .7, ease: E.outExpo }));
    popIn(this.btn, t, 32.0, { dy: 100, ease: E.outExpo });
    tf($('#s7bshine'), `translateX(${-200 + (((t - 32.4) % 1) + 1) % 1 * 1300}px) skewX(-20deg)`);
    popIn(this.url, t, 32.25, { dy: 60, ease: E.outExpo });
    css(this.url.querySelector('path'), 'strokeDashoffset', String(1 - P(t, 32.5, 33.0, E.outCubic)));
    // câmera: push-in contínuo, leve paralaxe
    tf(this.cam, `scale(${K(t, [[30.6, 1.08], [31.4, 1, E.outCubic], [34, 1.045, E.inOutSine]])}) translateY(0px)`);
  },
});
