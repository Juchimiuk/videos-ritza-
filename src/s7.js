// ===== Cena 7 — CTA (31–34 s) =====
scene({
  from: 30.55, to: 34.1,
  build() {
    const el = this.el = h(`<div class="scene" id="s7" style="color:#07111F"></div>`);
    this.blobs = [];
    [['#7DF5CB', 900], ['#12B57C', 1100], ['#B8FFE6', 700], ['#0FA06D', 900]].forEach(([c, s]) => {
      const b = h(`<div style="position:absolute;left:0;top:0;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(closest-side,${c},rgba(33,209,147,0))"></div>`);
      el.appendChild(b); this.blobs.push(b);
    });
    this.stripes = h(`<div style="position:absolute;left:-600px;top:-400px;width:2400px;height:2800px;opacity:.16;background:repeating-linear-gradient(-28deg,#FFFFFF 0 26px,rgba(0,0,0,0) 26px 70px)"></div>`);
    el.appendChild(this.stripes);
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.appendChild(this.cam);
    this.icon = h(`<div style="position:absolute;left:380px;top:300px;width:320px;height:320px;border-radius:84px;background:linear-gradient(150deg,#13263F,#07111F 70%);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 40px 90px -20px rgba(7,17,31,.6),inset 0 2px 0 rgba(255,255,255,.15)">
      <img src="../assets/logo_hd.png" style="width:206px">
      <div id="s7shine" style="position:absolute;top:-80px;left:0;width:90px;height:480px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.35),rgba(255,255,255,0))"></div></div>`);
    this.word = h(`<div style="position:absolute;left:0;right:0;top:660px;text-align:center;font-size:132px;font-weight:900;letter-spacing:-.05em;line-height:1">Ritza</div>`);
    this.head = h(`<div style="position:absolute;left:60px;right:60px;top:820px;text-align:center;font-size:66px;font-weight:900;letter-spacing:-.035em;line-height:1.08"></div>`);
    this.hw = ['O', 'app', 'da', 'sua', 'assessoria', '<br>', 'de', 'corrida'].map(w => {
      if (w === '<br>') { this.head.appendChild(document.createElement('br')); return null; }
      const s = h(`<span style="display:inline-block;margin:0 .14em">${w}</span>`); this.head.appendChild(s); return s;
    }).filter(Boolean);
    this.btn = h(`<div style="position:absolute;left:90px;top:1050px;width:900px;height:136px;border-radius:70px;background:#07111F;color:#fff;display:flex;align-items:center;justify-content:center;gap:18px;font-size:42px;font-weight:800;letter-spacing:-.01em;overflow:hidden;box-shadow:0 30px 60px -18px rgba(7,17,31,.65)">
      <svg width="44" height="44" viewBox="0 0 44 44"><rect x="5" y="9" width="34" height="30" rx="7" fill="none" stroke="#21D193" stroke-width="4"/><path d="M5 18 H39 M14 4 V13 M30 4 V13" stroke="#21D193" stroke-width="4" stroke-linecap="round"/></svg>
      Agendar demonstração <span style="color:#21D193">· 20 min</span>
      <div id="s7bshine" style="position:absolute;top:-20px;left:0;width:120px;height:180px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0));transform:skewX(-20deg)"></div></div>`);
    this.url = h(`<div style="position:absolute;left:0;right:0;top:1236px;text-align:center;font-size:54px;font-weight:900;letter-spacing:-.02em">ritza.com.br
      <svg style="position:absolute;left:330px;top:66px;overflow:visible" width="420" height="20"><path d="M4 10 C 120 2, 300 2, 416 10" fill="none" stroke="#07111F" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div>`);
    this.cam.append(this.icon, this.word, this.head, this.btn, this.url);
    $('#s7host').appendChild(el);
  },
  update(t) {
    // wipe circular verde a partir da notificação do celular
    const w = E.inOutCubic(inv(30.55, 31.15, t));
    css($('#bgGreen'), 'clipPath', `circle(${w * 2300}px at 540px 470px)`);
    css(this.el, 'clipPath', `circle(${w * 2300}px at 540px 470px)`);
    this.blobs.forEach((b, i) => tf(b, `translate(${200 + Math.sin(t * .7 + i * 2) * 400 - 300}px, ${300 + i * 330 + Math.cos(t * .6 + i) * 200}px) scale(${1 + beatPulse(t, 31, 34) * .05})`));
    tf(this.stripes, `translate(${(t - 31) * -70}px, ${(t - 31) * 40}px)`);
    // logo, marca, título, botão, site — entram nas batidas
    popIn(this.icon, t, 30.9, { dy: 120, s0: .3, rot: -18, blur: 16, dur: .8 });
    tf($('#s7shine'), `translateX(${-120 + E.inOutCubic(inv(31.6, 32.3, t)) * 520}px) rotate(20deg)`);
    popIn(this.word, t, 31.25, { dy: 80, rx: -60 });
    this.hw.forEach((s, i) => popIn(s, t, 31.5 + i * .07, { dy: 70, rx: -50, dur: .6 }));
    const bp = popIn(this.btn, t, 32.0, { dy: 100, s0: .7 });
    if (bp >= 1) tf(this.btn, `scale(${1 + beatPulse(t, 32.5, 34) * .035})`);
    tf($('#s7bshine'), `translateX(${-200 + (((t - 32.4) % 1) + 1) % 1 * 1300}px) skewX(-20deg)`);
    popIn(this.url, t, 32.25, { dy: 60 });
    css(this.url.querySelector('path'), 'strokeDashoffset', String(1 - P(t, 32.5, 33.0, E.outCubic)));
    // câmera: push-in contínuo, leve paralaxe
    tf(this.cam, `scale(${K(t, [[30.6, 1.08], [31.4, 1, E.outCubic], [34, 1.045, E.inOutSine]])}) translateY(${Math.sin(t * 1.4) * 6}px) rotate(${Math.sin(t * .9) * .4}deg)`);
  },
});
