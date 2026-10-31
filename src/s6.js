// ===== Cena 3 do roteiro — Treino enviado ao aluno em risco e prova de que ele voltou (6,3–13 s) =====
scene({
  from: 6.25, to: 13.05,
  build() {
    const el = this.el = h(`<div class="scene" id="s6"></div>`);
    // celular
    this.phoneWrap = h(`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;perspective:2200px;perspective-origin:540px 800px"></div>`);
    this.phone = h(`<div class="phone" style="left:250px;top:190px;transform-origin:50% 50%">
      <div class="pscreen">
        <img src="../assets/app_aluno.png" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 0">
        <div style="position:absolute;left:50%;top:12px;width:118px;height:34px;margin-left:-59px;border-radius:20px;background:#000"></div>
        <div id="doneRing" style="position:absolute;left:8px;top:274px;width:532px;height:294px;border-radius:46px;border:5px solid #21D193;box-shadow:0 0 0 9999px rgba(255,255,255,0);opacity:0"></div>
        <div id="doneBadge" style="position:absolute;right:20px;top:244px;padding:12px 22px;border-radius:999px;background:#21D193;color:#0A0A0A;font-size:26px;font-weight:800;opacity:0;box-shadow:0 12px 30px -10px rgba(0,0,0,.4)">✓ Ele voltou</div>
        <div id="pSlot" style="position:absolute;left:14px;top:58px;width:410px;height:120px"></div>
        <div id="notif" style="position:absolute;left:14px;right:14px;top:58px;padding:18px 20px;border-radius:30px;background:rgba(22,22,24,.9);backdrop-filter:blur(20px);color:#fff;display:flex;gap:16px;align-items:center;box-shadow:0 20px 50px -10px rgba(0,0,0,.5);border:1.5px solid rgba(255,255,255,.14)">
          <div style="width:72px;height:72px;border-radius:18px;background:#070707;display:flex;align-items:center;justify-content:center;flex:none;border:1px solid rgba(255,255,255,.14)"><img src="../assets/logo_hd.png" style="width:48px"></div>
          <div style="min-width:0"><div style="display:flex;font-size:15px;font-weight:600;letter-spacing:.12em;color:rgba(255,255,255,.55)"><span>RITZA</span><span style="margin-left:auto">agora</span></div>
          <div style="font-size:20px;font-weight:800;margin-top:2px;white-space:nowrap">Novo treino do Prof. Rafael</div>
          <div style="font-size:18px;font-weight:600;color:rgba(255,255,255,.8);margin-top:2px;white-space:nowrap">4km em regenerativo · Rodagem · sábado</div></div></div>
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
    // o card nasce no botão "Enviar treino" do aluno em risco (cena 2, em 6,3 s)
    const s2 = SCENES[1];
    const prev = s2.el.style.display; s2.el.style.display = '';
    s2.update(6.3);
    const r = s2.sendBtn.getBoundingClientRect();
    const s0 = .3;
    this.r0 = { x: r.left + r.width / 2 - 300 * s0, y: r.top + r.height / 2 - 290 * s0, s: s0 };
    s2.el.style.display = prev;
  },
  update(t, ctx) {
    if (!this.r0) { this.measure(); if (t < 7.05) SCENES[1].update(t); }
    const r0 = this.r0;
    // trajetória: decola (27,0–27,3), atravessa o espaço até o centro (27,3–28,4), pousa no celular (28,6–29,15)
    const lift = E.outCubic(inv(6.35, 6.65, t));
    const go = E.inOutCubic(inv(6.4, 7.6, t));
    const land = E.inOutCubic(inv(7.8, 8.4, t));
    // alvo: slot do celular (phone left 305+16+19, top 330+16+190)
    const slot = { x: 280, y: 264, s: 520 / 600 }; // banner de notificação no topo da tela
    const mid = { x: 540 - 300 * 1.45, y: 860 - 295 * 1.45, s: 1.45 };
    let x = lerp(r0.x, mid.x, go), y = lerp(r0.y, mid.y, go) - Math.sin(go * Math.PI) * 120, s = lerp(r0.s * lerp(1, 1.12, lift), mid.s, go);
    x = lerp(x, slot.x, land); y = lerp(y, slot.y, land) - Math.sin(land * Math.PI) * 60; s = lerp(s, slot.s, land);
    const rot = Math.sin(go * Math.PI) * -2;
    const rY = Math.sin(go * Math.PI) * 8 - Math.sin(land * Math.PI) * 6;
    const flyOn = t >= 6.35 && t < 8.4;
    op(this.fly, flyOn ? 1 - E.inCubic(inv(.55, 1, land)) : 0);
    tf(this.fly, `translate(${x}px, ${y}px) scale(${s}) perspective(1600px) rotate(${rot}deg) rotateY(${rY}deg)`);
    css(this.fly.firstElementChild, 'boxShadow', `0 ${30 + 60 * Math.sin(go * Math.PI)}px ${70 + 80 * Math.sin(go * Math.PI)}px -20px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.06)`);
    // motion blur proporcional à velocidade
    const vel = Math.sin(go * Math.PI);
    if (flyOn && vel > .05 && go < 1) mblur(this.fly, vel * 14); else fl(this.fly, 'none');
    // linhas de velocidade + partículas (câmera acompanhando)
    if (t > 6.45 && t < 8.3) {
      const k = Math.sin(inv(6.45, 8.3, t) * Math.PI);
      const r = rng(21);
      for (let i = 0; i < 22; i++) {
        const yy = 260 + r() * 1250, len = 120 + r() * 380, sp = 2600 + r() * 2600, ph = r() * 3000;
        const xx = 1300 - ((t * sp + ph) % 2800);
        const col = i % 3 ? 'rgba(255,255,255,.9)' : '#21D193';
        ctx.globalAlpha = k * (.12 + r() * .25);
        const g = ctx.createLinearGradient(xx, 0, xx + len, 0); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(xx, yy, len * 1.6, 1.5 + r() * 1.5);
      }
      ctx.globalAlpha = 1;
    }
    // rastro do card
    if (flyOn && go > 0 && land < 1) {
      for (let i = 0; i < 0; i++) {
        const cx = x + 300 * s - i * 26 * vel - 120 * vel, cy = y + 300 * s + Math.sin(i * .9 + t * 8) * 18;
        ctx.globalAlpha = (1 - i / 18) * .6 * vel; ctx.fillStyle = i % 2 ? '#21D193' : '#FFC93C';
        ctx.beginPath(); ctx.arc(cx - 300 * s, cy, 10 * (1 - i / 18) + 2, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // celular entra pela direita com mola
    const pin = E.spring(inv(7.3, 8.2, t));
    const shake = 0;
    const pry = lerp(-24, -6, pin) + Math.sin(t * .7) * 1.5;
    const psc = K(t, [[7.3, 1], [8.45, 1, E.inOutSine], [10.0, 1.06, E.inOutSine], [11.0, 1.12, E.inOutCubic], [13, 1.15, E.inOutSine]]);
    tf(this.phone, `translateX(${(1 - pin) * 900}px) translateY(0px) rotateY(${pry}deg) rotateX(3deg) rotateZ(${(1 - pin) * 3}deg) scale(${psc})`);
    op(this.phone, inv(7.3, 7.5, t));
    op(this.slotCard, 0);
    tf(this.slotCard, `scale(${(400 / 600) * (1 + Math.exp(-(t - 8.4) * 8) * .04 * (t > 8.4))})`);
    // notificação cai com mola
    const n = E.outExpo(inv(8.2, 8.85, t));
    const notif = this.phone.querySelector('#notif');
    tf(notif, `translateY(${-E.inCubic(inv(9.9, 10.2, t)) * 160}px) scale(${lerp(1.04, 1, n)})`); op(notif, inv(8.2, 8.5, t) * (1 - inv(9.9, 10.2, t)));
    
    // explosão sutil de chegada
    
    // prova: "TREINO FEITO" em destaque (o aluno voltou)
    css(this.phone, 'transformOrigin', '50% 34%');
    const dr = E.outExpo(inv(10.1, 10.8, t));
    const ring = this.phone.querySelector('#doneRing');
    op(ring, dr); tf(ring, `scale(${lerp(1.06, 1, dr)})`);
    const bd = this.phone.querySelector('#doneBadge');
    const bdp = E.spring(inv(10.4, 11.1, t));
    op(bd, inv(10.4, 10.55, t)); tf(bd, `translateY(${(1 - bdp) * 20}px) scale(${lerp(.9, 1, bdp)})`);
    // saída: whip-pan para a esquerda (12,55–13,05)
    const wp = E.inQuart(inv(12.55, 13.05, t));
    if (t > 12.55) { tf(this.el, `translateX(${-1400 * wp}px)`); mblur(this.el, Math.sin(Math.PI * Math.min(1, wp * 1.1)) * 70 + wp * 20); }
    else { tf(this.el, 'none'); fl(this.el, 'none'); }
    op(this.el, 1);
  },
});
