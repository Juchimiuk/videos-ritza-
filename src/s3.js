// ===== Cena 3 — Strava: corrida no Ibirapuera (8–15 s) =====
const ROUTE = 'M 1450 1650 C 1560 1400, 1580 1100, 1500 850 C 1430 640, 1200 470, 950 450 C 700 430, 450 560, 380 800 C 320 1000, 420 1150, 560 1180 C 700 1210, 760 1050, 880 980 C 1000 910, 1150 980, 1180 1150 C 1210 1330, 1080 1500, 900 1600 C 720 1700, 520 1760, 430 1640 C 360 1540, 400 1420, 520 1400 C 700 1380, 900 1520, 1100 1630 C 1250 1715, 1380 1720, 1440 1660';
const RBOX = { cx: 980, cy: 1110, w: 1240, h: 1330 };
scene({
  from: 7.55, to: 15.2,
  build() {
    const el = this.el = h(`<div class="scene" id="s3"></div>`);
    // ---------- mapa (SVG) ----------
    const r = rng(42);
    let streets = '', blocks = '', trees = '';
    for (let i = -6; i < 26; i++) { // malha urbana inclinada
      const x = i * 118;
      streets += `<line x1="${x}" y1="-300" x2="${x + 520}" y2="2500" stroke="#1A1B1D" stroke-width="${i % 4 ? 6 : 14}"/>`;
    }
    for (let j = -4; j < 24; j++) {
      const y = j * 104;
      streets += `<line x1="-300" y1="${y}" x2="2100" y2="${y - 380}" stroke="#1A1B1D" stroke-width="${j % 5 ? 6 : 14}"/>`;
    }
    for (let k = 0; k < 420; k++) { // quarteirões / prédios com "altura" falsa
      const x = r() * 1900 - 50, y = r() * 2300 - 50, w = 30 + r() * 60, hh = 26 + r() * 50, ht = 4 + r() * 12;
      blocks += `<rect x="${x + ht}" y="${y + ht}" width="${w}" height="${hh}" rx="4" fill="#050505"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="4" fill="#111213"/>`;
    }
    for (let k = 0; k < 360; k++) {
      const a = r() * Math.PI * 2, rr = Math.sqrt(r());
      const x = 960 + Math.cos(a) * rr * 640, y = 1150 + Math.sin(a) * rr * 760;
      trees += `<circle cx="${x}" cy="${y}" r="${7 + r() * 12}" fill="${r() > .5 ? '#122019' : '#0F1B15'}"/>`;
    }
    const kms = [];
    this.plane = h(`<div id="mapPlane"><svg width="1800" height="2200" viewBox="0 0 1800 2200" style="overflow:visible">
      <defs>
        <linearGradient id="rg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#21D193"/><stop offset="1" stop-color="#21D193"/></linearGradient>
        <radialGradient id="mapfade" cx="50%" cy="50%" r="60%"><stop offset=".6" stop-color="#07111F" stop-opacity="0"/><stop offset="1" stop-color="#07111F" stop-opacity="1"/></radialGradient>
      </defs>
      <g id="mapBase">
        <rect x="-600" y="-600" width="3000" height="3400" fill="#0A0A0B"/>
        <g opacity=".95">${streets}</g>
        ${blocks}
        <path d="M 260 520 C 520 330, 1000 260, 1480 420 C 1700 560, 1720 1000, 1620 1420 C 1540 1800, 1200 2010, 880 2000 C 560 1990, 300 1860, 230 1500 C 160 1150, 140 760, 260 520 Z" fill="#0C1511" stroke="rgba(33,209,147,.35)" stroke-width="3"/>
        ${trees}
        <path d="M 600 1230 C 640 1120, 820 1100, 960 1180 C 1060 1240, 1050 1360, 930 1400 C 820 1440, 760 1380, 690 1420 C 600 1470, 540 1330, 600 1230 Z" fill="#161718" stroke="rgba(255,255,255,.25)" stroke-width="3"/>
        <text x="760" y="1300" fill="#FFFFFF" opacity=".45" font-size="26" font-weight="600" font-family="Inter" letter-spacing="3">LAGO</text>
        <text x="520" y="700" fill="#21D193" opacity=".7" font-size="40" font-weight="700" font-family="Inter Display" letter-spacing="6" transform="rotate(-8 520 700)">PARQUE IBIRAPUERA</text>
        <text x="1660" y="900" fill="#8FA6C2" font-size="30" font-weight="700" font-family="Inter" transform="rotate(78 1660 900)">Av. Pedro Álvares Cabral</text>
        <text x="200" y="1700" fill="#8FA6C2" font-size="30" font-weight="700" font-family="Inter" transform="rotate(-80 200 1700)">Av. República do Líbano</text>
        <text x="980" y="2080" fill="#8FA6C2" font-size="30" font-weight="700" font-family="Inter" transform="rotate(-4 980 2080)">Av. IV Centenário</text>
      </g>
      <path id="routeGlow" d="${ROUTE}" fill="none" stroke="#21D193" stroke-opacity=".16" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <path id="routeMain" d="${ROUTE}" fill="none" stroke="url(#rg)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="kmMarks"></g>
    </svg></div>`);
    this.wrap = h(`<div id="mapWrap"></div>`); this.wrap.appendChild(this.plane);
    this.mapLayer = h(`<div class="layer"></div>`); this.mapLayer.appendChild(this.wrap);
    el.appendChild(this.mapLayer);
    // névoa no horizonte
    this.fog = h(`<div class="layer" style="background:linear-gradient(180deg,#070707 0%,#070707 13%,rgba(7,7,7,0) 34%,rgba(7,7,7,0) 62%,rgba(7,7,7,.88) 80%)"></div>`);
    el.appendChild(this.fog);
    // corredor (fixo no foco da câmera)
    this.runner = h(`<div style="position:absolute;left:540px;top:860px;width:0;height:0">
      <div class="rp" style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;border:2px solid #21D193"></div>
      <div class="rp" style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;border:2px solid #21D193"></div>
      <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:#21D193;border:6px solid #fff;box-shadow:0 0 30px 4px rgba(33,209,147,.45)"></div>
      <div style="position:absolute;left:34px;top:-86px;padding:8px 18px;border-radius:10px;background:#fff;color:#0A0A0A;font-size:22px;font-weight:700;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.4)">Mariana</div>
    </div>`);
    el.appendChild(this.runner);
    // HUD superior
    this.chip = h(`<div class="chip" style="position:absolute;left:32px;top:264px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#fff">
      <svg width="30" height="30" viewBox="0 0 30 30"><circle id="s3spin" cx="15" cy="15" r="11" fill="none" stroke="#21D193" stroke-width="3" stroke-dasharray="48 100" stroke-linecap="round"/><path id="s3ok" d="M8 15.5 l5 5 l9 -11" fill="none" stroke="#21D193" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
      <span id="s3chipT">SINCRONIZANDO COM STRAVA</span></div>`);
    this.top = h(`<div class="glass" style="left:32px;top:340px;width:1016px;height:150px;display:flex;align-items:center;padding:0 40px;gap:26px">
      <div class="avatar" style="width:74px;height:74px;font-size:26px;background:#21D193;color:#0A0A0A">MC</div>
      <div><div style="font-size:32px;font-weight:700">Mariana Costa Silva</div><div style="font-size:22px;font-weight:500;color:rgba(255,255,255,.55);margin-top:4px">Corrida · ${DATA.corrida.local}</div></div>
      <div style="margin-left:auto;text-align:right"><div style="font-size:16px;font-weight:600;letter-spacing:.18em;color:rgba(255,255,255,.5)">TEMPO</div><div id="s3time" style="font-size:50px;font-weight:700;letter-spacing:-.02em;line-height:1.05">0:00</div></div></div>`);
    // HUD inferior: estatísticas ao vivo
    const stat = (x, k, id, u, col, extra = '') => h(`<div class="glass stat" style="left:${x}px;">
      <div class="k">${k}</div><div class="v" style="color:${col}"><span id="${id}">0</span><span class="u">${u}</span></div>${extra}</div>`);
    this.sDist = stat(32, 'DISTÂNCIA', 's3d', 'km', '#21D193', `<div style="margin-top:22px;height:4px;border-radius:2px;background:rgba(255,255,255,.12)"><div id="s3bar" style="height:100%;width:0;border-radius:6px;background:#21D193"></div></div>`);
    this.sPace = stat(376, 'RITMO', 's3p', '/km', '#FFFFFF', `<div style="margin-top:16px;font-size:20px;font-weight:700;color:rgba(255,255,255,.6)">média <b id="s3pm" style="color:#fff">—</b></div>`);
    this.sHr = stat(720, 'FREQ. CARDÍACA', 's3h', 'bpm', '#FFFFFF', `<svg width="264" height="44" style="margin-top:10px;overflow:visible"><path id="s3ecg" d="M0 22 L40 22 L52 22 L60 6 L70 40 L78 16 L86 22 L130 22 L142 22 L150 6 L160 40 L168 16 L176 22 L220 22 L232 22 L240 6 L250 40" fill="none" stroke="#21D193" stroke-width="3" stroke-linejoin="round" pathLength="1" stroke-dasharray=".35 .65"/></svg>`);
    el.append(this.chip, this.top, this.sDist, this.sPace, this.sHr);
    // card da atividade (match cut da rota) + ícone do Ritza
    this.card = h(`<div class="glass" style="left:150px;top:600px;width:780px;height:560px;padding:0;overflow:hidden;transform-origin:50% 50%">
      <div style="position:absolute;left:0;right:0;top:0;height:330px;background:radial-gradient(ellipse at 50% 60%,rgba(33,209,147,.08),rgba(0,0,0,0) 70%)"></div>
      <svg style="position:absolute;left:240px;top:24px" width="300" height="322" viewBox="360 445 1240 1330"><path d="${ROUTE}" fill="none" stroke="#21D193" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div style="position:absolute;left:36px;top:352px;right:36px">
        <div style="display:flex;align-items:center;gap:14px"><div style="font-size:38px;font-weight:700;letter-spacing:-.02em">Corrida matinal</div><div class="pill" style="margin-left:auto;background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);font-size:18px;letter-spacing:.08em">VIA STRAVA</div></div>
        <div style="font-size:23px;font-weight:600;color:rgba(255,255,255,.62);margin-top:6px">Mariana Costa Silva · qua, 28 out · 06:12</div>
        <div style="display:flex;justify-content:space-between;margin-top:22px;font-size:34px;font-weight:700;letter-spacing:-.02em">
          <span style="color:#21D193">8,5 km</span><span>46:45</span><span>5:30/km</span><span>152 bpm</span></div>
      </div></div>`);
    this.icon = h(`<div style="position:absolute;left:440px;top:330px;width:200px;height:200px;border-radius:52px;background:linear-gradient(150deg,#1A1B1D,#070707);border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 60px -20px rgba(0,0,0,.8),0 0 60px -20px rgba(33,209,147,.35),inset 0 1px 0 rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center">
      <img src="../assets/logo_hd.png" style="width:128px;height:auto">
      <div id="s3check" style="position:absolute;right:-22px;top:-22px;width:76px;height:76px;border-radius:50%;background:#21D193;border:6px solid #070707;display:flex;align-items:center;justify-content:center">
        <svg width="40" height="40" viewBox="0 0 40 40"><path id="s3chk" d="M9 21 l8 8 l15 -17" fill="none" stroke="#070707" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div></div>`);
    this.iconLbl = h(`<div style="position:absolute;left:0;right:0;top:572px;text-align:center;font-size:42px;font-weight:700;letter-spacing:-.025em">Treino importado</div>`);
    this.iconSub = h(`<div style="position:absolute;left:0;right:0;top:636px;text-align:center;font-size:26px;font-weight:500;color:rgba(255,255,255,.55)">8,5 km · 46:45 · 5:30/km · esforço 7</div>`);
    el.append(this.card, this.icon, this.iconLbl, this.iconSub);
    $('#scenes').appendChild(el);
    // geometria da rota
    const path = this.plane.querySelector('#routeMain');
    this.path = path; this.L = path.getTotalLength();
    ['routeGlow', 'routeMain'].forEach(id => { const p = this.plane.querySelector('#' + id); p.setAttribute('stroke-dasharray', `${this.L} ${this.L}`); });
    const g = this.plane.querySelector('#kmMarks');
    this.kms = [];
    for (let k = 1; k <= 8; k++) {
      const pt = path.getPointAtLength(this.L * k / 8.5);
      const m = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      m.innerHTML = `<circle cx="${pt.x}" cy="${pt.y}" r="26" fill="#070707" stroke="rgba(255,255,255,.8)" stroke-width="3"/><text x="${pt.x}" y="${pt.y + 9}" text-anchor="middle" fill="#fff" font-size="24" font-weight="700" font-family="Inter Display">${k}</text>`;
      m.style.transformOrigin = `${pt.x}px ${pt.y}px`;
      g.appendChild(m); this.kms.push(m);
    }
    // rumo suavizado (para a câmera girar com o corredor)
    const N = 400; this.head = [];
    let prev = 0;
    for (let i = 0; i <= N; i++) {
      const a = path.getPointAtLength(this.L * Math.max(0, i / N - .01)), b = path.getPointAtLength(this.L * Math.min(1, i / N + .01));
      let ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      while (ang - prev > 180) ang -= 360; while (ang - prev < -180) ang += 360;
      this.head.push(ang); prev = ang;
    }
    const sm = this.head.map((_, i) => { let s = 0, c = 0; for (let j = -40; j <= 40; j++) { const k = Math.min(N, Math.max(0, i + j)); s += this.head[k]; c++; } return s / c; });
    this.head = sm;
  },
  update(t, ctx) {
    const d = DATA.corrida;
    const p = P(t, 8.35, 13.0, E.inOutSine); // progresso da corrida
    const pt = this.path.getPointAtLength(this.L * p);
    const hd = this.head[Math.round(p * 400)];
    // transição "rota -> card" (13,0–13,7)
    const m = E.inOutCubic(inv(12.95, 13.7, t));
    const tilt = K(t, [[7.6, 24], [9.0, 56, E.outCubic], [12.95, 52]]) * (1 - m);
    const rz = (-(hd + 90) * .3 + 18) * (1 - m);
    const sc = lerp(K(t, [[7.6, .72], [9.0, .98, E.outCubic], [12.95, 1.06]]), 300 / RBOX.w * 1.0, m);
    const cx = lerp(pt.x, RBOX.cx, m), cy = lerp(pt.y, RBOX.cy, m);
    css(this.wrap, 'top', `${lerp(860, 785, m)}px`);
    tf(this.plane, `rotateX(${tilt}deg) rotateZ(${rz}deg) scale(${sc}) translate(${-cx}px, ${-cy}px)`);
    ['routeGlow', 'routeMain'].forEach(id => css(this.plane.querySelector('#' + id), 'strokeDashoffset', String(this.L * (1 - Math.max(p, .0001)))));
    css(this.plane.querySelector('#routeMain'), 'strokeWidth', String(lerp(18, 44, m)));
    op(this.plane.querySelector('#mapBase'), 1 - m);
    this.kms.forEach((k, i) => {
      const kp = clamp((p * 8.5 - (i + 1)) * 6 + 1);
      css(k, 'opacity', String(kp * (1 - m)));
    });
    op(this.fog, 1 - m);
    // corredor
    op(this.runner, P(t, 8.2, 8.5) * (1 - P(t, 12.9, 13.15)));
    this.runner.querySelectorAll('.rp').forEach((rp, i) => { const ph = ((t + i * .5) % 1); op(rp, 1 - ph); tf(rp, `scale(${.4 + ph * 1.2})`); });
    // HUD
    popIn(this.chip, t, 8.3, { dy: -40 });
    popIn(this.top, t, 8.4, { dy: -60, rx: 30 });
    [this.sDist, this.sPace, this.sHr].forEach((s, i) => popIn(s, t, 8.5 + i * .25, { dy: 120, rx: -40 }));
    const out = E.inCubic(inv(12.9, 13.35, t));
    if (t > 12.9) {
      [this.sDist, this.sPace, this.sHr].forEach((s, i) => { op(s, 1 - out); tf(s, `translateY(${out * (200 + i * 60)}px) scale(${1 - out * .2})`); });
      [this.chip, this.top].forEach(s => { op(s, 1 - out); tf(s, `translateY(${-out * 140}px)`); });
    }
    const done = t > 13.0;
    const spin = this.chip.querySelector('#s3spin');
    css(spin, 'opacity', done ? '0' : '1'); spin.setAttribute('transform', `rotate(${t * 520} 15 15)`);
    css(this.chip.querySelector('#s3ok'), 'strokeDashoffset', String(1 - P(t, 12.4, 12.8, E.outCubic)));
    txt(this.chip.querySelector('#s3chipT'), t > 12.4 ? 'SINCRONIZADO COM STRAVA' : 'SINCRONIZANDO COM STRAVA');
    const dist = d.km * p;
    txt($('#s3d'), fmt2(dist)); css($('#s3bar'), 'width', `${p * 100}%`);
    txt($('#s3time'), mmss(d.seg * p));
    const settle = 1 - P(t, 12.3, 13.0);
    txt($('#s3p'), mmss(330 + (Math.sin(t * 3.1) * 7 + Math.sin(t * 7.3) * 4) * settle));
    txt($('#s3pm'), p > .05 ? mmss(330 + 9 * (1 - p) * Math.sin(t * 1.3)) + '/km' : '—');
    txt($('#s3h'), String(Math.round(118 + 34 * E.outCubic(p) + 3 * Math.sin(t * 5.3) * settle)));
    css($('#s3ecg'), 'strokeDashoffset', String(-t * 1.3));
    // card da atividade surge onde a rota encolheu
    const cIn = E.outCubic(inv(13.3, 13.75, t));
    const fly = inv(13.75, 14.42, t), fe = E.inOutCubic(fly);
    const bx = (1 - fe) ** 2 * 540 + 2 * (1 - fe) * fe * 980 + fe * fe * 540;
    const by = (1 - fe) ** 2 * 880 + 2 * (1 - fe) * fe * 620 + fe * fe * 430;
    const csc = lerp(1, .07, E.inCubic(fly)) * lerp(1.06, 1, cIn);
    op(this.card, cIn * (1 - P(t, 14.3, 14.42)));
    tf(this.card, `translate(${bx - 540}px, ${by - 880}px) scale(${csc}) rotate(${-3 * fe}deg) rotateY(${Math.sin(fe * Math.PI) * 6}deg)`);
    fl(this.card, fly > 0 && fly < 1 ? `blur(${Math.sin(fly * Math.PI) * 3}px)` : 'none');
    op(this.plane, 1 - P(t, 13.55, 13.75));
    // rastro de partículas no voo
    if (fly > 0 && fly < 1) {
      const rr = rng(5);
      for (let i = 0; i < 14; i++) {
        const lag = i * .012, f2 = E.inOutCubic(clamp(fly - lag));
        const x = (1 - f2) ** 2 * 540 + 2 * (1 - f2) * f2 * 980 + f2 * f2 * 540 + (rr() - .5) * 6;
        const y = (1 - f2) ** 2 * 880 + 2 * (1 - f2) * f2 * 620 + f2 * f2 * 430 + (rr() - .5) * 6;
        ctx.globalAlpha = (1 - i / 14) * .5; ctx.fillStyle = '#21D193';
        ctx.beginPath(); ctx.arc(x, y, 4 * (1 - i / 14) + 1.5, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // ícone do Ritza recebe o treino
    const iIn = popIn(this.icon, t, 13.45, { dy: -60, s0: .4, blur: 10 });
    const hit = t - 14.42;
    const bump = hit > 0 ? Math.exp(-hit * 7) * Math.sin(Math.min(hit * 14, Math.PI)) * .04 : 0;
    const zt = E.inExpo(inv(14.68, 15.15, t));
    css(this.icon, 'transformOrigin', '100px 100px');
    if (iIn >= 1) tf(this.icon, `scale(${(1 + bump) * Math.pow(30, zt)})`);
    css($('#s3check'), 'transform', `scale(${E.spring(inv(14.45, 14.95, t))})`);
    css($('#s3chk'), 'strokeDashoffset', String(1 - P(t, 14.55, 14.85, E.outCubic)));
    popIn(this.iconLbl, t, 14.5, { dy: 50 }); popIn(this.iconSub, t, 14.62, { dy: 40 });
    if (t > 14.68) { op(this.iconLbl, 1 - zt * 3); op(this.iconSub, 1 - zt * 3); }
    burst(ctx, t, 14.42, 540, 430, { n: 90, seed: 11, speed: 1100 });
    // whip-pan de entrada (da direita) + saída por zoom-through no ícone
    const wp = E.outQuart(inv(7.6, 8.15, t));
    if (t < 8.15) { tf(this.el, `translateX(${1400 * (1 - wp)}px)`); mblur(this.el, (1 - wp) * 80); }
    else if (t > 14.7) { tf(this.el, 'none'); op(this.el, 1 - E.inCubic(inv(14.85, 15.15, t))); fl(this.el, 'none'); }
    else { tf(this.el, 'none'); fl(this.el, 'none'); op(this.el, 1); }
  },
});
