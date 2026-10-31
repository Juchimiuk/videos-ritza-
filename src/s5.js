// ===== Cena 5 — Web: laptop 3D com painel do dia (21–26 s) e início da cena 6 =====
function workoutHTML() {
  const blk = (w, c, lbl) => `<div style="flex:${w};height:46px;border-radius:9px;background:${c};position:relative"><span style="position:absolute;left:0;right:0;top:-30px;text-align:center;font-size:17px;font-weight:800;color:#5B6B80">${lbl}</span></div>`;
  const reps = Array.from({ length: 6 }, (_, i) => blk(1.2, 'linear-gradient(180deg,#FF8A47,#FF6B1A)', i === 0 ? 'Z4' : '') + (i < 5 ? `<div style="flex:.7;height:16px;align-self:flex-end;border-radius:5px;background:#BFD3E8"></div>` : '')).join('');
  return `<div style="width:600px;padding:30px 32px;border-radius:30px;background:linear-gradient(160deg,#FFFFFF,#F1F6FB);color:#0A1628;box-shadow:0 30px 70px -20px rgba(7,17,31,.55),0 0 0 2px rgba(33,209,147,.6);font-family:'Inter Display',Inter,sans-serif">
    <div style="display:flex;align-items:center;gap:12px"><div class="pill" style="background:rgba(33,209,147,.16);color:#0B8F62;font-size:19px;letter-spacing:.08em">NOVO TREINO</div><div style="margin-left:auto;font-size:20px;font-weight:700;color:#5B6B80">${DATA.treino.dia}</div></div>
    <div style="font-size:52px;font-weight:900;letter-spacing:-.035em;margin-top:16px;line-height:1">Intervalado<br>6 × 800 m</div>
    <div style="display:flex;align-items:flex-end;gap:5px;margin-top:52px">${blk(2.4, '#3B82F6', 'Z2')}${reps}${blk(1.8, '#21D193', 'Z1')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;margin-top:22px;font-size:20px;font-weight:700;color:#334155">
      <div><span style="color:#3B82F6">●</span> Aquecimento 15 min</div><div><span style="color:#FF6B1A">●</span> 6 × 800 m a 3:52</div>
      <div><span style="color:#BFD3E8">●</span> Rec. 2 min trotando</div><div><span style="color:#21D193">●</span> Desaquec. 10 min</div></div>
    <div style="display:flex;align-items:center;margin-top:22px;padding-top:18px;border-top:2px solid #E3EAF2;font-size:22px;font-weight:800">
      <div class="avatar" style="width:40px;height:40px;font-size:15px;background:linear-gradient(135deg,#FF6B1A,#FF3D8B);margin-right:12px">GR</div>${DATA.treino.aluno}<span style="margin-left:auto;color:#0B8F62">≈ 10 km</span></div>
  </div>`;
}

scene({
  from: 20.85, to: 28.6,
  build() {
    const D = DATA;
    const el = this.el = h(`<div class="scene" id="s5"></div>`);
    // reflexo de piso + sombra realista
    this.shadow = h(`<div style="position:absolute;left:90px;top:1000px;width:900px;height:260px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.75),rgba(0,0,0,0));filter:blur(18px)"></div>`);
    this.floorGlow = h(`<div style="position:absolute;left:-100px;top:900px;width:1280px;height:600px;border-radius:50%;background:radial-gradient(closest-side,rgba(33,209,147,.28),rgba(33,209,147,0))"></div>`);
    el.append(this.floorGlow, this.shadow);
    const world = h(`<div id="lapWorld"></div>`);
    this.lap = h(`<div id="lap"></div>`);
    world.appendChild(this.lap); el.appendChild(world);
    // base com teclado
    let keys = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) keys += `<div style="position:absolute;left:${c * 56}px;top:${r * 52}px;width:50px;height:46px;border-radius:8px;background:linear-gradient(180deg,#1B2433,#0E141E);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)"></div>`;
    this.base = h(`<div class="base" style="left:-500px;top:0;width:1000px;height:660px;transform-origin:50% 0;transform:rotateX(90deg)">
      <div class="face" style="backface-visibility:visible;border-radius:0 0 34px 34px;background:linear-gradient(180deg,#AEB8C6,#D9E0E9 30%,#C3CCD8);box-shadow:inset 0 2px 0 rgba(255,255,255,.7)">
        <div style="position:absolute;left:108px;top:46px;width:784px;height:262px">${keys}</div>
        <div style="position:absolute;left:330px;top:350px;width:340px;height:230px;border-radius:18px;background:linear-gradient(180deg,#C9D1DC,#B9C3CF);box-shadow:inset 0 0 0 2px rgba(0,0,0,.06)"></div>
        <div style="position:absolute;left:0;right:0;top:0;height:24px;background:linear-gradient(180deg,#7E8896,#AEB8C6)"></div>
      </div></div>`);
    this.lip = h(`<div class="base" style="left:-500px;top:0;width:1000px;height:20px;border-radius:0 0 18px 18px;background:linear-gradient(180deg,#9AA5B4,#5F6A79);transform:translateZ(660px)"></div>`);
    // tampa com tela
    const alunosOk = D.alunos.filter(a => a.ok);
    const listRows = alunosOk.map((a, i) => `<div class="dl" style="display:flex;align-items:center;gap:12px;height:50px;border-bottom:1px solid rgba(255,255,255,.06)">
      <div class="avatar" style="width:34px;height:34px;font-size:13px;background:linear-gradient(135deg,${a.cor[0]},${a.cor[1]})">${a.ini}</div>
      <div style="font-size:16px;font-weight:700;flex:1">${a.nome}<div style="font-size:12.5px;color:#8EA2BC;font-weight:600;margin-top:2px">${a.st.replace('Treinou · ', '')}</div></div>
      <div style="font-size:20px;font-weight:900;color:${esfColor(a.esf)};width:30px;text-align:center">${a.esf}</div></div>`).join('');
    const pend = [['Guilherme Rocha Almeida', 'GR', '#FF6B1A'], ['Camila Ribeiro Souza', 'CR', '#8B5CF6'], ['Rodrigo Nunes Barbosa', 'RN', '#3B82F6']].map(([n, i, c], k) => `
      <div style="display:flex;align-items:center;gap:10px;height:44px;${k === 0 ? 'color:#FF8A47' : ''}"><div class="avatar" style="width:30px;height:30px;font-size:12px;background:${c}">${i}</div><div style="font-size:14.5px;font-weight:700">${n}</div></div>`).join('');
    const bars14 = D.constanciaDias.map(v => `<i style="display:block;width:7px;height:${(v - 60) / 30 * 40}px;border-radius:2px;background:${v >= 82 ? '#21D193' : '#3B82F6'};transform-origin:50% 100%"></i>`).join('');
    const nav = ['Painel', 'Alunos', 'Treinos', 'Agenda', 'Convites'].map((n, i) => `<div style="height:44px;margin:4px 12px;border-radius:10px;display:flex;align-items:center;padding-left:14px;font-size:14px;font-weight:700;${i === 0 ? 'background:rgba(33,209,147,.16);color:#21D193' : 'color:#8EA2BC'}">${n}</div>`).join('');
    this.lid = h(`<div class="lid" style="left:-500px;top:-652px;width:1000px;height:646px;transform-origin:50% 100%">
      <div class="face" style="background:#0B0F16;box-shadow:inset 0 0 0 2px #3A4250">
        <div class="dash" id="dash">
          <div style="position:absolute;left:0;top:0;bottom:0;width:124px;background:#0D1A2C;border-right:1px solid rgba(255,255,255,.06)">
            <img src="../assets/logo_hd.png" style="width:46px;margin:22px 0 18px 26px;display:block">${nav}</div>
          <div style="position:absolute;left:146px;top:22px;font-size:28px;font-weight:900;letter-spacing:-.02em">Painel do dia</div>
          <div style="position:absolute;left:147px;top:58px;font-size:14px;font-weight:600;color:#8EA2BC">qua, 28 out · ${D.assessoria}</div>
          <div style="position:absolute;right:22px;top:24px;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700"><div class="avatar" style="width:36px;height:36px;font-size:13px;background:linear-gradient(135deg,#3B82F6,#21D193)">RA</div>Prof. Rafael</div>
          <div class="kpi" style="left:146px"><div class="k">ALUNOS ATIVOS</div><div class="v" id="k1">0</div><div class="s">+2 neste mês</div></div>
          <div class="kpi" style="left:342px"><div class="k">TREINARAM HOJE</div><div class="v" style="color:#21D193"><span id="k2">0</span><span style="font-size:22px;color:#8EA2BC">/24</span></div><div class="s">71% da equipe</div>
            <svg style="position:absolute;right:12px;top:12px" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="#1E3350" stroke-width="5"/><circle id="k2r" cx="17" cy="17" r="13" fill="none" stroke="#21D193" stroke-width="5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 17 17)" stroke-linecap="round"/></svg></div>
          <div class="kpi" style="left:538px"><div class="k">CONSTÂNCIA 14 DIAS</div><div class="v" style="color:#5C9DFF"><span id="k3">0</span>%</div><div id="k3b" style="display:flex;gap:3px;align-items:flex-end;height:42px;margin-top:4px">${bars14}</div></div>
          <div class="kpi" style="left:734px;border-color:rgba(255,201,60,.35)"><div class="k">CONVITES PENDENTES</div><div class="v" style="color:#FFC93C" id="k4">0</div><div class="s">2 enviados ontem</div></div>
          <div class="dpanel" style="position:absolute;left:146px;top:264px;width:470px;height:310px;border-radius:14px;background:#0E1B2E;border:1px solid rgba(255,255,255,.07);padding:14px 18px">
            <div style="font-size:15px;font-weight:800;letter-spacing:.04em;display:flex">QUEM TREINOU HOJE<span style="margin-left:auto;color:#21D193">17</span></div>
            <div style="margin-top:6px">${listRows}</div></div>
          <div class="dpanel" style="position:absolute;left:632px;top:264px;width:296px;height:310px;border-radius:14px;background:#0E1B2E;border:1px solid rgba(255,107,26,.3);padding:14px 16px">
            <div style="font-size:15px;font-weight:800;letter-spacing:.04em;display:flex">AINDA NÃO TREINARAM<span style="margin-left:auto;color:#FF8A47">7</span></div>
            <div style="margin-top:6px">${pend}</div>
            <div style="font-size:13px;color:#8EA2BC;font-weight:600;margin-top:4px">+ 4 alunos</div>
            <div id="launchBtn" style="position:absolute;left:16px;right:16px;bottom:14px;height:52px;border-radius:12px;background:linear-gradient(90deg,#21D193,#3BE0A8);color:#07111F;font-size:17px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px">+ Lançar treino</div></div>
          <div id="modalDim" style="position:absolute;inset:0;background:rgba(5,10,18,.6);opacity:0"></div>
          <div id="modal" style="position:absolute;left:500px;top:200px;width:600px;transform-origin:0 0;opacity:0">${workoutHTML()}
            <div id="sendBtn" style="margin-top:-2px;position:absolute;right:30px;bottom:-30px;padding:16px 30px;border-radius:14px;background:#21D193;color:#07111F;font-size:22px;font-weight:900;box-shadow:0 12px 30px -8px rgba(33,209,147,.8)">Lançar para o aluno →</div></div>
          <div id="cursor" style="position:absolute;left:0;top:0;width:34px;height:34px">
            <svg width="34" height="40" viewBox="0 0 34 40"><path d="M3 2 L3 31 L11 24 L16 36 L22 33 L17 22 L28 22 Z" fill="#fff" stroke="#07111F" stroke-width="2.5" stroke-linejoin="round"/></svg>
            <div id="ripple" style="position:absolute;left:-26px;top:-26px;width:56px;height:56px;border-radius:50%;border:4px solid #21D193;opacity:0"></div></div>
          <div id="sheen" style="position:absolute;inset:-40%;background:linear-gradient(115deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.10) 48%,rgba(255,255,255,.03) 55%,rgba(255,255,255,0) 60%)"></div>
          <div id="screenOff" style="position:absolute;inset:0;background:#05080D"></div>
        </div>
        <div style="position:absolute;left:50%;top:5px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#1E2836"></div>
      </div>
      <div class="face" style="transform:rotateY(180deg);background:linear-gradient(150deg,#D7DEE7,#AEB8C6 60%,#C9D1DC);display:flex;align-items:center;justify-content:center">
        <img src="../assets/logo_hd.png" style="width:140px;opacity:.9"></div>
    </div>`);
    this.lap.append(this.base, this.lip, this.lid);
    $('#scenes').appendChild(el);
    this.modalHTML = this.lid.querySelector('#modal');
  },
  // posição do cursor dentro da tela (coordenadas do painel)
  cursorAt(t) {
    const x = K(t, [[25.6, 700], [26.25, 780, E.inOutCubic], [26.9, 800, E.inOutCubic]]);
    const y = K(t, [[25.6, 420], [26.25, 548, E.inOutCubic], [26.9, 512, E.inOutCubic]]);
    return [x, y];
  },
  update(t) {
    const D = DATA;
    // abertura da tampa (mola suave) e câmera orbitando
    const open = E.softSpring(inv(21.25, 22.45, t));
    css(this.lid, 'transform', `translateZ(1px) rotateX(${lerp(-90, 12, open)}deg)`);
    const ry = K(t, [[20.85, -36], [23.2, 12, E.inOutSine], [24.3, 2, E.inOutCubic], [25.5, -3, E.inOutSine], [27.0, 0, E.inOutSine]]);
    const rx = K(t, [[20.85, -30], [23.2, -14, E.inOutSine], [24.3, -5, E.inOutCubic], [27, -4]]);
    const s = K(t, [[20.85, .55], [21.6, .78, E.outCubic], [23.2, .84, E.inOutSine], [24.2, 1.7, E.inOutCubic], [25.3, 1.72, E.inOutSine], [26.1, 1.6, E.inOutCubic], [27.0, 1.62]]);
    const ty = K(t, [[20.85, 160], [23.2, 220, E.inOutSine], [24.2, 640, E.inOutCubic], [24.6, 640, E.inOutSine], [25.4, 230, E.inOutCubic], [26.1, 190, E.inOutCubic], [27.0, 200]]);
    const tx = K(t, [[20.85, 140], [23.2, 0, E.inOutSine], [24.2, 60, E.inOutCubic], [24.8, 20, E.inOutSine], [25.4, 150, E.inOutCubic], [26.1, -230, E.inOutCubic], [26.8, -90, E.inOutSine]]);
    // saída: laptop recua para a esquerda enquanto a câmera segue o card (27,0–28,2)
    const ex = E.inOutCubic(inv(27.0, 28.1, t));
    tf(this.lap, `translate3d(${tx - ex * 1500}px, ${ty + ex * 120}px, ${-ex * 900}px) rotateX(${rx}deg) rotateY(${ry + ex * 30}deg) scale(${s * (1 - ex * .35)})`);
    // sombra acompanha órbita/zoom
    tf(this.shadow, `translate(${tx * .7 - ex * 1400}px, ${(ty - 160) * .9 + (s - .8) * 260}px) scale(${s * (1 + Math.abs(ry) / 200)}, ${s * .8})`);
    op(this.shadow, (.5 + open * .5) * (1 - ex) * (1 - P(t, 23.4, 24.2)) + P(t, 24.2, 25) * 0);
    op(this.floorGlow, (.3 + .7 * open) * (1 - ex) * (1 - P(t, 23.4, 24.2) * .6));
    tf(this.floorGlow, `scale(${1 + beatPulse(t, 21, 27) * .05})`);
    // tela liga
    op($('#screenOff'), 1 - P(t, 22.0, 22.45));
    tf($('#sheen'), `translateX(${-ry * 9 - tx * .3}px)`);
    // KPIs nas batidas 22,5 / 22,75 / 23,0 / 23,25
    $$('#dash .kpi').forEach((k, i) => popIn(k, t, 22.5 + i * .25, { dy: 30, blur: 6, dur: .6 }));
    $$('#dash .dpanel').forEach((k, i) => popIn(k, t, 23.4 + i * .2, { dy: 40, blur: 6 }));
    $$('#dash .dl').forEach((k, i) => popIn(k, t, 23.55 + i * .1, { dy: 0, dx: -40, blur: 4, dur: .5 }));
    const c = P(t, 22.6, 23.8, E.outCubic);
    txt($('#k1'), String(Math.round(D.ativos * P(t, 22.5, 23.4, E.outCubic))));
    txt($('#k2'), String(Math.round(D.treinaramHoje * P(t, 22.75, 23.6, E.outCubic))));
    css($('#k2r'), 'strokeDashoffset', String(100 - 71 * P(t, 22.75, 23.6, E.outCubic)));
    txt($('#k3'), String(Math.round(D.constancia14 * P(t, 23.0, 23.9, E.outCubic))));
    $$('#k3b i').forEach((b, i) => tf(b, `scaleY(${E.spring(inv(23.0 + i * .04, 23.6 + i * .04, t))})`));
    txt($('#k4'), String(Math.round(D.convites * P(t, 23.25, 23.8, E.outCubic))));
    // cursor clica em "Lançar treino" (26,25) e depois em "Lançar para o aluno" (26,9)
    const [cx, cy] = this.cursorAt(t);
    op($('#cursor'), P(t, 25.5, 25.7) * (1 - P(t, 27.0, 27.15)));
    tf($('#cursor'), `translate(${cx}px, ${cy}px) scale(${1 - .15 * (Math.exp(-Math.abs(t - 26.25) * 20) + Math.exp(-Math.abs(t - 26.9) * 20))})`);
    const rp = Math.max(inv(26.25, 26.6, t) * (t < 26.8 ? 1 : 0), inv(26.9, 27.2, t));
    op($('#ripple'), rp > 0 && rp < 1 ? 1 - rp : 0); tf($('#ripple'), `scale(${.4 + rp * 1.4})`);
    css($('#launchBtn'), 'transform', `scale(${1 - .06 * Math.exp(-Math.abs(t - 26.25) * 14)})`);
    // modal do treino
    const mIn = E.spring(inv(26.3, 26.9, t));
    op($('#modalDim'), P(t, 26.3, 26.6) * (1 - P(t, 27.6, 28)));
    op(this.modalHTML, P(t, 26.3, 26.45) * (t < 27.02 ? 1 : 0));
    tf(this.modalHTML, `translate(0px, ${(1 - mIn) * 60}px) scale(${.62 * lerp(.85, 1, mIn)})`);
    css($('#sendBtn'), 'transform', `scale(${1 - .08 * Math.exp(-Math.abs(t - 26.9) * 14)})`);
    // entrada (zoom-through vindo da cena 4)
    const zin = E.outCubic(inv(20.85, 21.5, t));
    op(this.el, inv(20.85, 21.1, t) * (1 - P(t, 28.2, 28.6)));
    fl(this.el, t < 21.5 ? `blur(${(1 - zin) * 16}px)` : t > 27.0 && t < 28.4 ? `blur(${E.inCubic(inv(27.1, 28.0, t)) * 10}px)` : 'none');
  },
});
