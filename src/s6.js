// ===== Cena 6 — Treino lançado: card voa do laptop ao celular (26–31 s) =====
scene({
  from: 26.95, to: 31.15,
  build() {
    const el = this.el = h(`<div class="scene" id="s6"></div>`);
    // celular
    this.phoneWrap = h(`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;perspective:2200px;perspective-origin:540px 800px"></div>`);
    this.phone = h(`<div class="phone" style="left:305px;top:330px;transform-origin:50% 50%">
      <div class="pscreen">
        <div style="position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(160deg,#0C1B2E,#123A3A)"></div>
        <div style="position:absolute;left:36px;right:36px;top:22px;display:flex;font-size:19px;font-weight:800;color:#fff"><span>18:42</span><span style="margin-left:auto">5G ▮▮▮</span></div>
        <div style="position:absolute;left:50%;top:14px;width:120px;height:34px;margin-left:-60px;border-radius:20px;background:#000"></div>
        <div style="position:absolute;left:30px;top:84px;display:flex;align-items:center;gap:14px;color:#fff">
          <img src="../assets/logo_hd.png" style="width:48px"><div><div style="font-size:30px;font-weight:900;letter-spacing:-.02em">Olá, Guilherme</div><div style="font-size:18px;font-weight:600;color:rgba(255,255,255,.65)">Seu próximo treino</div></div></div>
        <div id="pSlot" style="position:absolute;left:19px;top:190px;width:400px;height:394px"></div>
        <div style="position:absolute;left:24px;right:24px;top:612px;display:flex;gap:12px">
          <div style="flex:1;padding:16px;border-radius:20px;background:#fff;box-shadow:0 8px 24px -12px rgba(7,17,31,.3)"><div style="font-size:15px;font-weight:800;color:#5B6B80;letter-spacing:.08em">DISTÂNCIA</div><div style="font-size:30px;font-weight:900">≈ 10 km</div></div>
          <div style="flex:1;padding:16px;border-radius:20px;background:#fff;box-shadow:0 8px 24px -12px rgba(7,17,31,.3)"><div style="font-size:15px;font-weight:800;color:#5B6B80;letter-spacing:.08em">DURAÇÃO</div><div style="font-size:30px;font-weight:900">≈ 58 min</div></div></div>
        <div id="pGo" style="position:absolute;left:24px;right:24px;top:752px;height:84px;border-radius:24px;background:linear-gradient(90deg,#21D193,#3BE0A8);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#07111F;box-shadow:0 16px 36px -12px rgba(33,209,147,.8)">Começar treino</div>
        <div id="notif" style="position:absolute;left:14px;right:14px;top:58px;padding:18px 20px;border-radius:30px;background:rgba(20,30,46,.86);backdrop-filter:blur(20px);color:#fff;display:flex;gap:16px;align-items:center;box-shadow:0 20px 50px -10px rgba(0,0,0,.5);border:1.5px solid rgba(255,255,255,.14)">
          <div style="width:72px;height:72px;border-radius:18px;background:#07111F;display:flex;align-items:center;justify-content:center;flex:none;border:1.5px solid rgba(33,209,147,.5)"><img src="../assets/logo_hd.png" style="width:48px"></div>
          <div style="min-width:0"><div style="display:flex;font-size:17px;font-weight:700;color:rgba(255,255,255,.6)"><span>RITZA</span><span style="margin-left:auto">agora</span></div>
          <div style="font-size:20px;font-weight:800;margin-top:2px;white-space:nowrap">Novo treino do Prof. Rafael</div>
          <div style="font-size:18px;font-weight:600;color:rgba(255,255,255,.8);margin-top:2px;white-space:nowrap">Intervalado 6 × 800 m · qui, 29/10</div></div></div>
      </div></div>`);
    this.phoneWrap.appendChild(this.phone);
    el.appendChild(this.phoneWrap);
    this.slotCard = h(`<div style="position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(${400 / 600})">${workoutHTML()}</div>`);
    this.phone.querySelector('#pSlot').appendChild(this.slotCard);
    // card voador (camada de primeiro plano)
    this.fly = h(`<div style="position:absolute;left:0;top:0;transform-origin:0 0">${workoutHTML()}</div>`);
    el.appendChild(this.fly);
    $('#scenes').appendChild(el);
  },
  measure() {
    // retângulo do card no laptop no instante do lançamento (27,0 s)
    const s5 = SCENES[4];
    const prevDisp = s5.el.style.display; s5.el.style.display = '';
    s5.update(27.0);
    const r = s5.modalHTML.firstElementChild.getBoundingClientRect();
    this.r0 = { x: r.left, y: r.top, s: r.width / 600 };
    const ph = this.phone.querySelector('#pSlot').getBoundingClientRect();
    s5.el.style.display = prevDisp;
  },
  update(t, ctx) {
    if (!this.r0) { this.measure(); SCENES[4].update(t); }
    const r0 = this.r0;
    // trajetória: decola (27,0–27,3), atravessa o espaço até o centro (27,3–28,4), pousa no celular (28,6–29,15)
    const lift = E.outCubic(inv(27.0, 27.3, t));
    const go = E.inOutCubic(inv(27.15, 28.35, t));
    const land = E.inOutCubic(inv(28.55, 29.15, t));
    // alvo: slot do celular (phone left 305+16+19, top 330+16+190)
    const slot = { x: 340, y: 536, s: 400 / 600 };
    const mid = { x: 540 - 300 * 1.12, y: 800 - 295 * 1.12, s: 1.12 };
    let x = lerp(r0.x, mid.x, go), y = lerp(r0.y, mid.y, go) - Math.sin(go * Math.PI) * 120, s = lerp(r0.s * lerp(1, 1.12, lift), mid.s, go);
    x = lerp(x, slot.x, land); y = lerp(y, slot.y, land) - Math.sin(land * Math.PI) * 60; s = lerp(s, slot.s, land);
    const rot = Math.sin(go * Math.PI) * -7 + Math.sin(t * 3) * 1.5 * (1 - land);
    const rY = Math.sin(go * Math.PI) * 18 - Math.sin(land * Math.PI) * 14;
    const flyOn = t >= 27.0 && t < 29.15;
    op(this.fly, flyOn ? 1 : 0);
    tf(this.fly, `translate(${x}px, ${y}px) scale(${s}) perspective(1600px) rotate(${rot}deg) rotateY(${rY}deg)`);
    css(this.fly.firstElementChild, 'boxShadow', `0 ${30 + 60 * Math.sin(go * Math.PI)}px ${70 + 80 * Math.sin(go * Math.PI)}px -20px rgba(7,17,31,.55), 0 0 0 2px rgba(33,209,147,.6), 0 0 ${60 * Math.sin(go * Math.PI)}px rgba(33,209,147,.6)`);
    // motion blur proporcional à velocidade
    const vel = Math.sin(go * Math.PI);
    if (flyOn && vel > .05 && go < 1) mblur(this.fly, vel * 14); else fl(this.fly, 'none');
    // linhas de velocidade + partículas (câmera acompanhando)
    if (t > 27.1 && t < 29.0) {
      const k = Math.sin(inv(27.1, 29.0, t) * Math.PI);
      const r = rng(21);
      for (let i = 0; i < 46; i++) {
        const yy = 260 + r() * 1250, len = 120 + r() * 380, sp = 2600 + r() * 2600, ph = r() * 3000;
        const xx = 1300 - ((t * sp + ph) % 2800);
        const col = ['#21D193', '#3B82F6', '#FFC93C', '#FF3D8B', '#9FB6D6'][i % 5];
        ctx.globalAlpha = k * (.35 + r() * .5);
        const g = ctx.createLinearGradient(xx, 0, xx + len, 0); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(xx, yy, len, 3 + r() * 5);
      }
      ctx.globalAlpha = 1;
    }
    // rastro do card
    if (flyOn && go > 0 && land < 1) {
      for (let i = 0; i < 18; i++) {
        const cx = x + 300 * s - i * 26 * vel - 120 * vel, cy = y + 300 * s + Math.sin(i * .9 + t * 8) * 18;
        ctx.globalAlpha = (1 - i / 18) * .6 * vel; ctx.fillStyle = i % 2 ? '#21D193' : '#FFC93C';
        ctx.beginPath(); ctx.arc(cx - 300 * s, cy, 10 * (1 - i / 18) + 2, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // celular entra pela direita com mola
    const pin = E.spring(inv(28.1, 29.0, t));
    const shake = (beatPulse(t, 29.5, 30.6) * Math.sin(t * 90)) * 1.6;
    const pry = lerp(-38, -8, pin) + Math.sin(t * 1.1) * 3;
    const psc = K(t, [[28.1, 1], [29.2, 1, E.inOutSine], [30.8, 1.07, E.inOutSine]]);
    tf(this.phone, `translateX(${(1 - pin) * 900}px) translateY(${Math.sin(t * 1.6) * 8}px) rotateY(${pry}deg) rotateX(${4 + Math.sin(t * .9) * 2}deg) rotateZ(${(1 - pin) * 10 + shake}deg) scale(${psc})`);
    op(this.phone, inv(28.1, 28.3, t));
    op(this.slotCard, t >= 29.15 ? 1 : 0);
    tf(this.slotCard, `scale(${(400 / 600) * (1 + Math.exp(-(t - 29.15) * 8) * .04 * (t > 29.15))})`);
    // notificação cai com mola
    const n = E.spring(inv(29.15, 29.8, t));
    const notif = this.phone.querySelector('#notif');
    tf(notif, `translateY(${(1 - n) * -200}px) scale(${lerp(.8, 1, n)})`); op(notif, inv(29.15, 29.3, t));
    tf(this.phone.querySelector('#pGo'), `scale(${1 + beatPulse(t, 29.5, 31) * .05})`);
    // explosão sutil de chegada
    burst(ctx, t, 29.15, 540, 740, { n: 40, seed: 3, speed: 700, life: .9, size: 8 });
    op(this.el, 1);
  },
});
