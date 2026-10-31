// ===== Cena 2 — Quem treinou + aluno em risco (3–6,5 s) =====
const esfColor = n => n == null ? '#0A0A0A' : '#21D193';
scene({
  from: 2.5, to: 7.05,
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
    this.chip = h(`<div class="chip" style="position:absolute;left:32px;top:172px;background:#0A0A0A;color:#fff"><span class="dot" style="background:#21D193"></span>HOJE · ${d.hoje}</div>`);
    this.title = h(`<div style="position:absolute;left:30px;top:262px;font-size:116px;font-weight:800;letter-spacing:-.045em;color:#0A0A0A;line-height:1">Quem treinou</div>`);
    this.sub = h(`<div style="position:absolute;left:34px;top:412px;font-size:34px;font-weight:500;color:#6B6F76"><b id="s2n" style="color:#0A0A0A;font-weight:700">0</b> de ${d.ativos} alunos já treinaram</div>`);
    this.ring = h(`<svg style="position:absolute;left:840px;top:196px;overflow:visible" width="208" height="208" viewBox="0 0 184 184">
      <circle cx="92" cy="92" r="76" fill="none" stroke="#ECEDEF" stroke-width="8"/>
      <circle id="s2arc" cx="92" cy="92" r="76" fill="none" stroke="#21D193" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 92 92)"/>
      <defs><linearGradient id="s2g" x1="0" x2="1"><stop offset="0" stop-color="#21D193"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs>
      <text x="92" y="104" text-anchor="middle" font-size="40" font-weight="700" fill="#0A0A0A" font-family="Inter Display" id="s2pct">0%</text></svg>`);
    this.world.append(this.chip, this.title, this.sub, this.ring);
    this.lista = d.alunos.filter(a => a.ini !== 'AB');
    this.rows = this.lista.map((a, i) => {
      const c = esfColor(a.esf);
      const segs = Array.from({ length: 10 }, () => '<i></i>').join('');
      const r = h(`<div class="row glass light" style="top:${540 + i * 196}px">
        <div class="avatar" style="width:84px;height:84px;font-size:29px;background:${a.ok ? '#F1F2F3' : '#1C1D1F'};color:${a.ok ? '#0A0A0A' : '#fff'}">${a.ini}</div>
        <div style="min-width:0"><div class="name">${a.nome}</div>
          <div class="st" style="${a.ok ? '' : 'color:#0A0A0A;font-weight:600'}"><span class="dot" style="${a.ok ? 'background:#21D193' : 'border:2.5px solid #0A0A0A'}"></span>${a.st}</div></div>
        <div class="esf">${a.esf == null
          ? `<div class="n" style="color:#0A0A0A;font-size:40px">—</div><div class="lbl" style="color:#0A0A0A">EM RISCO</div>`
          : `<div class="n" style="color:#0A0A0A">${a.esf}<span style="font-size:20px;color:#8A8E95;font-weight:500">/10</span></div><div class="lbl">ESFORÇO</div><div class="esfbar">${segs}</div>`}</div>
      </div>`);
      this.world.appendChild(r);
      return r;
    });
    // anel pulsante e brilho laranja do Guilherme
    const g = this.rows[3];
    this.gRing = h(`<div style="position:absolute;left:40px;top:33px;width:84px;height:84px;border-radius:50%;border:2px solid #21D193"></div>`);
    this.gRing2 = this.gRing.cloneNode();
    g.append(this.gRing, this.gRing2);
    // botão de ação no card do aluno em risco
    this.sendBtn = h(`<div style="position:absolute;right:28px;top:34px;height:82px;padding:0 30px;border-radius:18px;background:#21D193;color:#0A0A0A;display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700;opacity:0">Enviar treino <span style=\"font-size:32px\">→</span>
      <div class="rip" style="position:absolute;left:50%;top:50%;width:90px;height:90px;margin:-45px 0 0 -45px;border-radius:50%;border:3px solid #fff;opacity:0"></div></div>`);
    g.appendChild(this.sendBtn);
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
      const t0 = 3.25 + i * .2;
      popIn(r, t, t0, { dy: 70, blur: 8, dur: .8, ease: E.outExpo });
      const a = this.lista[i];
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
    const gp = P(t, 4.4, 4.9, E.outCubic);
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
      const ph = ((t - 4.5 + k * .25) % BEAT) / BEAT;
      op(rg, t > 4.5 && t < 5.6 ? (1 - ph) * gp : 0);
      tf(rg, `scale(${1 + ph * .6})`);
    });
    // câmera: deriva 3D, depois zoom no card do Guilherme
    const zk = E.inOutCubic(inv(4.9, 5.7, t));
    const rx = K(t, [[2.5, 6], [4.2, 2, E.outCubic], [4.9, 1, E.inOutSine], [5.7, 0]]);
    const ry = K(t, [[2.5, -3], [4.2, 1, E.outCubic], [4.9, -1, E.inOutSine], [5.7, 0]]);
    const sc = lerp(.62, 1, zin) * K(t, [[3, 1], [4.9, 1.03, E.inOutSine], [5.7, 1.12, E.inOutCubic], [7.0, 1.16, E.outCubic]]);
    const fxp = lerp(540, 540, zk), fyp = lerp(820, 1203, zk);
    const dx = 0, dy = lerp(0, 820 - 1203, zk);
    css(this.world, 'transformOrigin', `${fxp}px ${fyp}px`);
    tf(this.world, `perspective(1800px) translate3d(${dx}px, ${dy}px, 0) scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(0deg)`);
    // profundidade de campo: desfoca os outros cards no zoom
    this.rows.forEach((r, i) => { if (i !== 3 && t > 4.9) { fl(r, `blur(${zk * 7}px)`); op(r, 1 - zk * .45); } });
    [this.chip, this.title, this.sub, this.ring].forEach(e => { if (t > 4.9) { fl(e, `blur(${zk * 8}px)`); op(e, 1 - zk * .6); } });
    op(this.cam, Math.min(E.outCubic(inv(2.5, 2.9, t)), 1));
    fl(this.cam, t < 3.25 ? `blur(${(1 - zin) * 18}px)` : 'none');
    // botão "Enviar treino" aparece no card em risco e é tocado em 6,1 s
    const bIn = E.outExpo(inv(5.45, 5.95, t));
    op(this.sendBtn, bIn); tf(this.sendBtn, `translateX(${(1 - bIn) * 40}px) scale(${1 - .06 * Math.exp(-Math.abs(t - 6.1) * 16)})`);
    g.querySelector('.esf').style.opacity = String(1 - bIn);
    const rp = inv(6.1, 6.5, t); const rip = this.sendBtn.querySelector('.rip');
    op(rip, rp > 0 && rp < 1 ? 1 - rp : 0); tf(rip, `scale(${.5 + rp * 2.2})`);
    // saída: a lista recua enquanto o card do treino sai voando (6,3–7,0)
    const out = E.inOutCubic(inv(6.3, 7.0, t));
    tf(this.el, `scale(${1 - out * .08})`); op(this.el, 1 - out);
    fl(this.el, t > 6.3 ? `blur(${out * 10}px)` : 'none');
  },
});
