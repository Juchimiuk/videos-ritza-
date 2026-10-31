// ===== Cena 4 — Evolução (15–21 s), cena clara =====
scene({
  from: 14.7, to: 21.15,
  build() {
    const D = DATA;
    const el = this.el = h(`<div class="scene" id="s4" style="color:#0A0A0A;-webkit-mask-image:linear-gradient(180deg,transparent 0,transparent 222px,#000 272px,#000 1470px,transparent 1530px)"></div>`);
    this.deco = h(`<div class="layer"></div>`);
    const rr = rng(77);
    for (let i = 0; i < 0; i++) {
      const s = 20 + rr() * 60, c = ['#21D193', '#3B82F6', '#FFC93C', '#FF3D8B'][i % 4];
      this.deco.appendChild(h(`<div style="position:absolute;left:${rr() * 1000}px;top:${rr() * 2600}px;width:${s}px;height:${s}px;border-radius:50%;border:${3 + rr() * 4}px solid ${c};opacity:.45"></div>`));
    }
    this.world = h(`<div class="layer" style="transform-origin:540px 820px"></div>`);
    el.append(this.deco, this.world);
    this.head = h(`<div class="chip" style="position:absolute;left:32px;top:268px;background:#0A0A0A;color:#fff;font-size:22px;letter-spacing:.14em;padding:9px 22px 9px 9px">
      <div class="avatar" style="width:42px;height:42px;font-size:16px;background:#21D193;color:#0A0A0A">MC</div>EVOLUÇÃO · MARIANA COSTA SILVA</div>`);
    // A — km por semana
    const maxKm = 40, bw = 56, gap = (920 - 12 * bw) / 11;
    let bars = '';
    D.kmSemana.forEach((v, i) => {
      const last = i === 11;
      bars += `<div class="kbar" style="position:absolute;left:${i * (bw + gap)}px;bottom:34px;width:${bw}px;height:${v / maxKm * 250}px;border-radius:8px 8px 3px 3px;transform-origin:50% 100%;
        background:${last ? '#21D193' : '#E4E5E7'}">
        ${last ? `<div style="position:absolute;top:-46px;left:50%;transform:translateX(-50%);font-size:26px;font-weight:700;color:#0A0A0A">${v}</div>` : ''}</div>`;
    });
    this.A = h(`<div class="glass light card4" style="top:360px;height:560px">
      <div class="k">KM POR SEMANA</div>
      <div style="display:flex;align-items:baseline;gap:16px;margin-top:12px"><div class="big"><span id="s4km">0</span><span style="font-size:40px;color:#8A8E95;font-weight:500"> km</span></div>
      <div class="pill" style="background:#0A0A0A;color:#21D193">+100% em 12 semanas</div></div>
      <div style="position:absolute;left:48px;right:48px;bottom:34px;height:300px">
        <div id="s4avg" style="position:absolute;left:0;right:0;bottom:${34 + 26.4 / maxKm * 250}px;border-top:2px dashed rgba(10,10,10,.28)"><span style="position:absolute;left:0;top:-32px;font-size:18px;font-weight:600;color:#6B6F76">média 26,4 km</span></div>
        ${bars}
        <div style="position:absolute;left:0;bottom:0;font-size:18px;font-weight:500;color:#8A8E95">03/08</div>
        <div style="position:absolute;right:0;bottom:0;font-size:18px;font-weight:500;color:#8A8E95">26/10</div>
      </div></div>`);
    // B — ritmo médio (linha)
    const px = i => 10 + i * (900 / 11);
    const ys = D.ritmoSemana.map(v => 24 + (372 - v) / 40 * 200); // 6:12 em cima, 5:32 embaixo
    let dpath = `M ${px(0)} ${ys[0]}`;
    for (let i = 1; i < 12; i++) { const xm = (px(i - 1) + px(i)) / 2; dpath += ` C ${xm} ${ys[i - 1]}, ${xm} ${ys[i]}, ${px(i)} ${ys[i]}`; }
    this.B = h(`<div class="glass light card4" style="top:948px;height:462px">
      <div class="k">RITMO MÉDIO</div>
      <div style="display:flex;align-items:baseline;gap:16px;margin-top:12px"><div class="big"><span id="s4pace">6:12</span><span style="font-size:40px;color:#8A8E95;font-weight:500"> /km</span></div>
      <div class="pill" style="background:#0A0A0A;color:#21D193">−40 s/km</div></div>
      <svg style="position:absolute;left:48px;top:206px;overflow:visible" width="920" height="232">
        <defs><linearGradient id="s4area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21D193" stop-opacity=".16"/><stop offset="1" stop-color="#21D193" stop-opacity="0"/></linearGradient>
        <linearGradient id="s4line" x1="0" x2="1"><stop offset="0" stop-color="#0A0A0A"/><stop offset="1" stop-color="#0A0A0A"/></linearGradient>
        <clipPath id="s4clip"><rect id="s4cr" x="0" y="-40" width="0" height="320"/></clipPath></defs>
        <g clip-path="url(#s4clip)"><path d="${dpath} L ${px(11)} 240 L ${px(0)} 240 Z" fill="url(#s4area)"/>
        <path id="s4lp" d="${dpath}" fill="none" stroke="url(#s4line)" stroke-width="5" stroke-linecap="round"/></g>
        <circle id="s4dot" r="11" fill="#21D193" stroke="#fff" stroke-width="4"/>
        <text x="0" y="16" font-size="18" font-weight="600" fill="#8A8E95" font-family="Inter">6:12</text>
        <text x="920" y="218" text-anchor="end" font-size="18" font-weight="700" fill="#0A0A0A" font-family="Inter" dy="14">5:32</text>
      </svg></div>`);
    // C — zonas
    let segs = '', leg = '';
    D.zonas.forEach((z, i) => {
      segs += `<div class="zseg" style="height:100%;width:${z.pct}%;background:${z.cor};transform-origin:0 50%"></div>`;
      leg += `<div style="flex:1"><div style="display:flex;align-items:center;gap:8px;font-size:28px;font-weight:700"><i style="width:12px;height:12px;border-radius:3px;background:${z.cor};display:block"></i>${z.z} <span style="font-weight:500;color:#6B6F76">${z.pct}%</span></div><div style="font-size:18px;font-weight:600;color:#0A0A0A;margin-top:4px">${z.nome}</div><div style="font-size:16px;font-weight:500;color:#8A8E95">${z.fc} bpm</div></div>`;
    });
    this.C = h(`<div class="glass light card4" style="top:1556px;height:320px">
      <div class="k">ZONAS DE ESFORÇO · 12 SEMANAS</div>
      <div style="display:flex;gap:3px;height:40px;margin-top:24px;border-radius:8px;overflow:hidden">${segs}</div>
      <div style="display:flex;gap:10px;margin-top:22px">${leg}</div></div>`);
    // D — recorde
    let star = '';
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r1 = i % 2 ? 92 : 110; star += `${110 + Math.cos(a) * r1},${110 + Math.sin(a) * r1} `; }
    this.D = h(`<div class="glass light card4" style="top:1916px;height:320px;display:flex;align-items:center;gap:34px">
      <div style="position:relative;width:220px;height:220px;flex:none">
        <svg id="s4star" width="220" height="220" style="position:absolute;inset:0"><defs><linearGradient id="s4sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#21D193"/><stop offset="1" stop-color="#21D193"/></linearGradient></defs><circle cx="110" cy="110" r="104" fill="none" stroke="#21D193" stroke-width="2" stroke-dasharray="3 9"/></svg>
        <div id="s4medal" style="position:absolute;left:30px;top:30px;width:160px;height:160px;border-radius:50%;background:#0A0A0A;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;box-shadow:inset 0 0 0 2px #21D193">
          <div style="font-size:52px;font-weight:700;line-height:1;letter-spacing:-.03em">5K</div><div style="font-size:15px;font-weight:600;letter-spacing:.24em;color:#21D193;margin-top:4px">RECORDE</div></div>
        <div id="s4shine" style="position:absolute;left:30px;top:30px;width:160px;height:160px;border-radius:50%;overflow:hidden"><div style="position:absolute;top:-40px;width:50px;height:260px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.25),rgba(255,255,255,0));transform:rotate(25deg)"></div></div>
      </div>
      <div><div id="s4new" class="pill" style="background:#21D193;color:#0A0A0A;font-size:18px;letter-spacing:.16em">NOVO RECORDE PESSOAL</div>
        <div style="font-size:62px;font-weight:700;letter-spacing:-.04em;margin-top:14px;line-height:1">5 km em 27:00</div>
        <div style="font-size:22px;font-weight:500;color:#6B6F76;margin-top:12px">${D.recorde5k.ritmo} · ${D.recorde5k.data} · −38 s no recorde</div></div></div>`);
    // E — projeção
    this.E = h(`<div class="glass light card4" style="top:2276px;height:350px">
      <div style="display:flex;align-items:center"><div class="k">PROJEÇÃO DE PROVA</div><div id="s4upd" class="pill" style="margin-left:auto;background:#F1F2F3;color:#6B6F76;font-size:18px">atualizando…</div></div>
      <div style="font-size:32px;font-weight:700;margin-top:14px;letter-spacing:-.015em">Corrida de São Silvestre · ${D.prova.data} · 15 km</div>
      <div style="display:flex;align-items:baseline;gap:20px;margin-top:14px"><div class="big" id="s4proj" style="font-size:96px">1:29:10</div>
        <div id="s4delta" class="pill" style="background:#21D193;color:#0A0A0A;font-size:28px">−2:40</div></div>
      <div style="font-size:22px;font-weight:500;color:#6B6F76;margin-top:12px">ritmo-alvo <b id="s4tp" style="color:#0A0A0A">5:57/km</b> · baseado no novo 5 km</div></div>`);
    this.world.append(this.head, this.A, this.B, this.C, this.D, this.E);
    $('#scenes').appendChild(el);
    this.lp = this.B.querySelector('#s4lp'); this.lpL = this.lp.getTotalLength();
  },
  update(t) {
    const D = DATA;
    // câmera: entrada por zoom (vinda do ícone), pan vertical com paralaxe, saída por zoom-through
    const camY = K(t, [[15, 0], [17.1, 0], [17.85, 1265, E.inOutCubic], [21, 1295, E.linear]]) + Math.sin(t * .9) * 4;
    const zin = E.outCubic(inv(14.75, 15.5, t));
    const zout = E.inExpo(inv(20.55, 21.12, t));
    const sc = lerp(.55, 1, zin) * K(t, [[15.5, 1], [17.0, 1.02, E.inOutSine], [17.85, 1, E.inOutCubic], [20.5, 1.035, E.inOutSine]]);
    const ry = Math.sin(t * .6) * 1.2;
    // foco do zoom-through: o tempo projetado (card E)
    const fX = 260, fY = 2276 + 240;
    const zs = Math.pow(26, zout);
    css(this.world, 'transformOrigin', `${lerp(540, fX, E.outCubic(inv(20.4, 20.8, t)))}px ${lerp(820 + camY, fY, E.outCubic(inv(20.4, 20.8, t)))}px`);
    tf(this.world, `perspective(2000px) translateY(${-camY}px) scale(${sc * zs}) rotateY(${ry}deg) rotateX(${K(t, [[14.8, 6], [15.6, 1, E.outCubic], [21, 0]])}deg)`);
    tf(this.deco, 'none');
    op(this.el, Math.min(E.outCubic(inv(14.75, 15.0, t)), 1 - E.inCubic(inv(20.8, 21.12, t))));
    fl(this.el, t < 15.4 ? `blur(${(1 - zin) * 16}px)` : t > 20.6 ? `blur(${zout * 14}px)` : 'none');
    // cabeçalho e cards
    popIn(this.head, t, 15.05, { dy: 40 });
    popIn(this.A, t, 15.15, { dy: 140, rx: -30 });
    popIn(this.B, t, 15.5, { dy: 160, rx: -30 });
    popIn(this.C, t, 17.25, { dy: 200, rx: -30 });
    popIn(this.D, t, 17.5, { dy: 200, rx: -30 });
    popIn(this.E, t, 17.75, { dy: 220, rx: -30 });
    if (t > 17.0 && t < 17.9) { const f = 1 - P(t, 17.1, 17.85, E.inOutCubic); [this.head, this.A, this.B].forEach(e => fl(e, `blur(${Math.sin((1 - f) * Math.PI) * 3}px)`)); }
    // barras: crescem nas batidas com mola
    this.A.querySelectorAll('.kbar').forEach((b, i) => {
      const p = E.spring(inv(15.45 + i * .07, 15.45 + i * .07 + .7, t));
      tf(b, `scaleY(${p})`); op(b, inv(15.45 + i * .07, 15.55 + i * .07, t));
    });
    txt($('#s4km'), String(Math.round(36 * P(t, 15.45, 16.6, E.outCubic))));
    op($('#s4avg'), P(t, 16.3, 16.7));
    // linha de ritmo
    const lp = P(t, 15.85, 17.0, E.inOutCubic);
    $('#s4cr').setAttribute('width', String(920 * lp + 10));
    const pt = this.lp.getPointAtLength(this.lpL * lp);
    const dot = $('#s4dot'); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    dot.setAttribute('r', '11');
    const wk = Math.min(11, lp * 11);
    const pv = D.ritmoSemana[Math.floor(wk)] + (D.ritmoSemana[Math.ceil(wk)] - D.ritmoSemana[Math.floor(wk)]) * (wk % 1);
    txt($('#s4pace'), mmss(pv));
    // zonas
    this.C.querySelectorAll('.zseg').forEach((s, i) => tf(s, `scaleX(${E.outExpo(inv(17.7 + i * .12, 18.3 + i * .12, t))})`));
    // recorde: selo gira, estrela pulsa nas batidas
    const sp = E.spring(inv(17.9, 18.6, t));
    tf($('#s4star'), `rotate(${t * 12}deg) scale(${lerp(.9, 1, sp)})`); op($('#s4star'), sp);
    tf($('#s4medal'), `scale(${lerp(.9, 1, sp)})`); op($('#s4medal'), sp);
    tf($('#s4shine').firstElementChild, `translateX(${-60 + ((t - 18.3) % 1.5) / 1.5 * 280}px) rotate(25deg)`);
    popIn($('#s4new'), t, 18.5, { dy: 30, blur: 6, dur: .6, ease: E.outExpo });
    // projeção atualizando
    const pp = P(t, 18.7, 19.8, E.inOutCubic);
    const proj = lerp(D.prova.antes, D.prova.depois, pp);
    txt($('#s4proj'), hmmss(proj));
    txt($('#s4tp'), mmss(proj / 15) + '/km');
    const upd = $('#s4upd');
    txt(upd, t > 19.8 ? 'atualizada ✓' : 'atualizando…');
    css(upd, 'background', t > 19.8 ? '#0A0A0A' : '#F1F2F3');
    css(upd, 'color', t > 19.8 ? '#21D193' : '#6B6F76');
    op($('#s4delta'), inv(19.8, 19.9, t));
    tf($('#s4delta'), `translateX(${(1 - E.outExpo(inv(19.8, 20.4, t))) * -20}px)`);
    css($('#s4proj'), 'color', '#0A0A0A');
  },
});
