// ===== Cena 2 — Quem treinou (3–8 s) =====
const esfColor = n => n == null ? '#0A0A0A' : '#21D193';
scene({
  from: 2.5, to: 8.1,
  build() {
    const el = this.el = h(`<div class="scene" id="s2"></div>`);
    this.cam = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.appendChild(this.cam);
    // bolhas de fundo (camada de paralaxe distante)
    this.bub = [];
    [].forEach(([x, y, s, c]) => {
      const b = h(`<div style="position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,${c} 70%);opacity:.35;filter:blur(6px)"></div>`);
      this.cam.appendChild(b); this.bub.push(b);
    });
    this.world = h(`<div class="layer" style="transform-origin:540px 820px;transform-style:preserve-3d"></div>`);
    this.cam.appendChild(this.world);
    const d = DATA;
    this.chip = h(`<div class="chip" style="position:absolute;left:60px;top:276px;background:#0A0A0A;color:#fff"><span class="dot" style="background:#21D193"></span>HOJE · ${d.hoje}</div>`);
    this.title = h(`<div style="position:absolute;left:58px;top:352px;font-size:96px;font-weight:800;letter-spacing:-.045em;color:#0A0A0A;line-height:1">Quem treinou</div>`);
    this.sub = h(`<div style="position:absolute;left:62px;top:468px;font-size:30px;font-weight:500;color:#6B6F76"><b id="s2n" style="color:#0A0A0A;font-weight:700">0</b> de ${d.ativos} alunos já treinaram</div>`);
    this.ring = h(`<svg style="position:absolute;left:836px;top:300px;overflow:visible" width="184" height="184" viewBox="0 0 184 184">
      <circle cx="92" cy="92" r="76" fill="none" stroke="#ECEDEF" stroke-width="8"/>
      <circle id="s2arc" cx="92" cy="92" r="76" fill="none" stroke="#21D193" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 92 92)"/>
      <defs><linearGradient id="s2g" x1="0" x2="1"><stop offset="0" stop-color="#21D193"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs>
      <text x="92" y="104" text-anchor="middle" font-size="40" font-weight="700" fill="#0A0A0A" font-family="Inter Display" id="s2pct">0%</text></svg>`);
    this.world.append(this.chip, this.title, this.sub, this.ring);
    this.rows = d.alunos.map((a, i) => {
      const c = esfColor(a.esf);
      const segs = Array.from({ length: 10 }, () => '<i></i>').join('');
      const r = h(`<div class="row glass light" style="top:${560 + i * 134}px">
        <div class="avatar" style="width:76px;height:76px;font-size:26px;background:${a.ok ? '#F1F2F3' : '#1C1D1F'};color:${a.ok ? '#0A0A0A' : '#fff'}">${a.ini}</div>
        <div style="min-width:0"><div class="name">${a.nome}</div>
          <div class="st" style="${a.ok ? '' : 'color:#0A0A0A;font-weight:600'}"><span class="dot" style="${a.ok ? 'background:#21D193' : 'border:2.5px solid #0A0A0A'}"></span>${a.st}</div></div>
        <div class="esf">${a.esf == null
          ? `<div class="n" style="color:#0A0A0A;font-size:40px">—</div><div class="lbl" style="color:#0A0A0A">PENDENTE</div>`
          : `<div class="n" style="color:#0A0A0A">${a.esf}<span style="font-size:20px;color:#8A8E95;font-weight:500">/10</span></div><div class="lbl">ESFORÇO</div><div class="esfbar">${segs}</div>`}</div>
      </div>`);
      this.world.appendChild(r);
      return r;
    });
    // anel pulsante e brilho laranja do Guilherme
    const g = this.rows[3];
    this.gRing = h(`<div style="position:absolute;left:30px;top:22px;width:76px;height:76px;border-radius:50%;border:2px solid #21D193"></div>`);
    this.gRing2 = this.gRing.cloneNode();
    g.append(this.gRing, this.gRing2);
    $('#scenes').appendChild(el);
  },
  update(t) {
    const d = DATA;
    // entrada por zoom-through (vindo da cena 1)
    const zin = E.outCubic(inv(2.5, 3.25, t));
    // parallax das bolhas
    this.bub.forEach((b, i) => tf(b, `translate3d(${Math.sin(t * .8 + i) * 30}px, ${-(t - 3) * (14 + i * 6) + Math.cos(t + i) * 20}px, 0) scale(${1 + .1 * Math.sin(t * 1.4 + i)})`));
    // cabeçalho
    popIn(this.chip, t, 2.6, { dy: 40, blur: 8 });
    popIn(this.title, t, 2.65, { dy: 80, rx: -40 });
    popIn(this.sub, t, 2.8, { dy: 40 });
    popIn(this.ring, t, 2.7, { dy: 0, s0: .3, rot: -90 });
    const pr = P(t, 3.3, 4.6, E.outQuart);
    const n = Math.round(d.treinaramHoje * pr);
    txt($('#s2n'), String(n));
    css($('#s2arc'), 'strokeDashoffset', String(100 - 100 * d.treinaramHoje / d.ativos * pr));
    txt($('#s2pct'), Math.round(100 * n / d.ativos) + '%');
    // linhas entram nas batidas 3,5 / 3,75 / 4,0 ...
    this.rows.forEach((r, i) => {
      const t0 = 3.5 + i * .25;
      popIn(r, t, t0, { dy: 70, blur: 8, dur: .8, ease: E.outExpo });
      const a = d.alunos[i];
      if (a.esf != null) {
        const segs = r.querySelectorAll('.esfbar i');
        const c = esfColor(a.esf);
        segs.forEach((s, k) => {
          const on = k < a.esf && t > t0 + .35 + k * .05;
          css(s, 'background', on ? c : '#E2E4E7');
        });
      }
      css(r, '--ga', `${120 + t * 40 + i * 30}deg`);
    });
    // Guilherme pulsa em laranja (a partir de 5,5 s, nas batidas)
    const g = this.rows[3];
    const gp = P(t, 5.3, 5.8, E.outCubic);
    const bp = beatPulse(t, 5.5, 8.5) * gp;
    css(g, 'background', gp > 0 ? `rgb(${Math.round(lerp(255, 10, gp))},${Math.round(lerp(255, 10, gp))},${Math.round(lerp(255, 10, gp))})` : '#fff');
    css(g, 'boxShadow', `0 30px 60px -24px rgba(0,0,0,${.2 + .35 * gp})`);
    const inv2 = gp > .5;
    g.querySelector('.name').style.color = inv2 ? '#fff' : '#0A0A0A';
    g.querySelector('.st').style.color = inv2 ? 'rgba(255,255,255,.75)' : '#0A0A0A';
    g.querySelector('.st .dot').style.borderColor = inv2 ? '#fff' : '#0A0A0A';
    g.querySelectorAll('.esf .n, .esf .lbl').forEach(e => e.style.color = inv2 ? '#fff' : '#0A0A0A');
    g.querySelector('.avatar').style.background = inv2 ? '#21D193' : '#1C1D1F';
    g.querySelector('.avatar').style.color = inv2 ? '#0A0A0A' : '#fff';
    [this.gRing, this.gRing2].forEach((rg, k) => {
      const ph = ((t - 5.5 + k * .25) % BEAT) / BEAT;
      op(rg, t > 5.5 ? (1 - ph) * gp : 0);
      tf(rg, `scale(${1 + ph * .6})`);
    });
    // câmera: deriva 3D, depois zoom no card do Guilherme
    const zk = E.inOutCubic(inv(6.3, 7.4, t));
    const rx = K(t, [[2.5, 6], [4.5, 2, E.outCubic], [6.3, 1, E.inOutSine], [7.4, 0]]);
    const ry = K(t, [[2.5, -3], [4.5, 1, E.outCubic], [6.3, -1, E.inOutSine], [7.4, 2]]);
    const sc = lerp(.62, 1, zin) * K(t, [[3, 1], [6.3, 1.04, E.inOutSine], [7.4, 1.3, E.inOutCubic], [8.1, 1.36, E.outCubic]]);
    const fxp = lerp(540, 400, zk), fyp = lerp(820, 1022, zk);
    const dx = lerp(0, 520 - 400, zk), dy = lerp(0, 820 - 1022, zk);
    css(this.world, 'transformOrigin', `${fxp}px ${fyp}px`);
    tf(this.world, `perspective(1800px) translate3d(${dx}px, ${dy}px, 0) scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(0deg)`);
    // profundidade de campo: desfoca os outros cards no zoom
    this.rows.forEach((r, i) => { if (i !== 3 && t > 6.3) { fl(r, `blur(${zk * 7}px)`); op(r, 1 - zk * .45); } });
    [this.chip, this.title, this.sub, this.ring].forEach(e => { if (t > 6.3) { fl(e, `blur(${zk * 8}px)`); op(e, 1 - zk * .6); } });
    op(this.cam, Math.min(E.outCubic(inv(2.5, 2.9, t)), 1));
    fl(this.cam, t < 3.25 ? `blur(${(1 - zin) * 18}px)` : 'none');
    // whip-pan para a esquerda (7,55–8,05)
    const wp = E.inQuart(inv(7.55, 8.05, t));
    if (t > 7.55) { tf(this.el, `translateX(${-1400 * wp}px)`); mblur(this.el, Math.sin(Math.PI * Math.min(1, wp * 1.1)) * 70 + wp * 20); }
    else { tf(this.el, 'none'); if (t >= 3.25) fl(this.el, 'none'); }
  },
});
