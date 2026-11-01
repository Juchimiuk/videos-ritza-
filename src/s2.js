// ===== Cena 2 — Aluno em risco (2,2–5,8 s): um objeto só, texto em volta dele =====
const esfColor = n => n == null ? '#0A0A0A' : '#21D193';
scene({
  from: 2.15, to: 5.85,
  build() {
    const el = this.el = h(`<div class="scene" id="s2" style="color:#0A0A0A"></div>`);
    this.world = h(`<div class="layer" style="transform-origin:540px 840px"></div>`);
    el.appendChild(this.world);
    const W = (y, html, size = 104) => h(`<div style="position:absolute;left:0;right:0;top:${y}px;text-align:center;font-size:${size}px;font-weight:500;letter-spacing:-.045em;line-height:1;overflow:hidden;padding-bottom:.12em"><div style="display:inline-block">${html}</div></div>`);
    this.top1 = W(214, 'O Henrique sumiu');
    this.top2 = W(330, 'há <span style="color:#21D193">5 dias.</span>');
    this.bot = W(1300, 'E você vê <span style="color:#21D193">na hora.</span>', 76);
    // linhas-fantasma (contexto) acima e abaixo
    const ghost = (y, ini, nome, st) => h(`<div class="row glass light" style="top:${y}px;height:120px;opacity:.4;filter:blur(2.5px)">
      <div class="avatar" style="width:72px;height:72px;font-size:24px;background:#F1F2F3;color:#0A0A0A">${ini}</div>
      <div><div class="name" style="font-size:32px">${nome}</div><div class="st" style="font-size:24px"><span class="dot" style="background:#21D193"></span>${st}</div></div></div>`);
    this.ghosts = [ghost(500, 'MC', 'Mariana Costa Silva', 'Treinou · 8,5 km'), ghost(636, 'LO', 'Lucas Oliveira Santos', 'Treinou · Fartlek 8 km'),
      ghost(1006, 'JM', 'Juliana Mendes Pereira', 'Treinou · 10 km'), ghost(1142, 'PH', 'Pedro Henrique Lima', 'Treinou · Tiros 10 × 400 m')];
    // card do aluno em risco
    this.card = h(`<div class="row glass light" style="top:772px;height:196px;padding:0 36px;gap:30px;transform-origin:50% 50%">
      <div class="avatar hjav" style="width:112px;height:112px;font-size:38px;background:#1C1D1F;color:#fff;position:relative">HJ
        <div class="rg" style="position:absolute;inset:-8px;border-radius:50%;border:2px solid #21D193;opacity:0"></div>
        <div class="rg" style="position:absolute;inset:-8px;border-radius:50%;border:2px solid #21D193;opacity:0"></div></div>
      <div style="min-width:0"><div class="name" style="font-size:46px;font-weight:600">Henrique Juchimiuk</div>
        <div class="st" style="font-size:31px;margin-top:8px;color:#0A0A0A"><span class="dot" style="border:2.5px solid currentColor;width:14px;height:14px"></span>Há 5 dias sem treinar</div></div>
      <div class="risk" style="margin-left:auto;padding:12px 22px;border-radius:999px;border:2px solid #21D193;color:#21D193;font-size:24px;font-weight:600;letter-spacing:.14em;white-space:nowrap">EM RISCO</div>
      <div class="send" style="position:absolute;right:30px;top:50%;margin-top:-50px;height:100px;padding:0 36px;border-radius:22px;background:#21D193;color:#0A0A0A;display:flex;align-items:center;gap:14px;font-size:34px;font-weight:600;opacity:0">Enviar treino →
        <div class="rip" style="position:absolute;left:50%;top:50%;width:100px;height:100px;margin:-50px 0 0 -50px;border-radius:50%;border:3px solid #fff;opacity:0"></div></div></div>`);
    this.sendBtn = this.card.querySelector('.send');
    this.world.append(this.top1, this.top2, ...this.ghosts, this.card, this.bot);
    $('#scenes').appendChild(el);
  },
  update(t) {
    // câmera lenta: leve push-in contínuo
    tf(this.world, `scale(${K(t, [[2.2, 1.0], [5.8, 1.06, E.inOutSine]])})`);
    this.ghosts.forEach((g, i) => { const p = E.outExpo(inv(2.25 + i * .06, 2.95 + i * .06, t)); tf(g, `translateY(${(1 - p) * (i < 2 ? -40 : 40)}px)`); op(g, .4 * p); });
    const cp = E.outExpo(inv(2.3, 3.0, t));
    // risco: o card inverte para preto (3,0–3,3)
    const r = E.inOutCubic(inv(3.0, 3.3, t));
    const c = Math.round(lerp(255, 10, r));
    css(this.card, 'background', `rgb(${c},${c},${c})`);
    css(this.card, 'boxShadow', `0 40px 80px -36px rgba(0,0,0,${.25 + .4 * r})`);
    const dark = r > .5;
    this.card.querySelector('.name').style.color = dark ? '#fff' : '#0A0A0A';
    this.card.querySelector('.st').style.color = dark ? 'rgba(255,255,255,.72)' : '#0A0A0A';
    const av = this.card.querySelector('.hjav');
    av.style.background = dark ? '#21D193' : '#1C1D1F'; av.style.color = dark ? '#0A0A0A' : '#fff';
    tf(this.card, `translateY(${(1 - cp) * 50}px) scale(${lerp(.97, 1, cp) + E.outExpo(inv(3.0, 3.6, t)) * .03})`);
    op(this.card, cp);
    this.card.querySelectorAll('.rg').forEach((rg, k) => {
      const ph = ((t - 3.3 + k * .25) % BEAT) / BEAT;
      op(rg, t > 3.3 && t < 4.6 ? 1 - ph : 0); tf(rg, `scale(${1 + ph * .5})`);
    });
    // texto em volta do objeto: sobe de dentro da própria linha
    [[this.top1, 3.1], [this.top2, 3.3], [this.bot, 3.75]].forEach(([w, t0]) => {
      const p = E.outExpo(inv(t0, t0 + .6, t)); tf(w.firstElementChild, `translateY(${(1 - p) * 110}%)`);
    });
    // "EM RISCO" dá lugar ao botão "Enviar treino"; toque em 5,2 s
    const b = E.outExpo(inv(4.5, 4.95, t));
    op(this.card.querySelector('.risk'), 1 - b);
    op(this.sendBtn, b); tf(this.sendBtn, `translateX(${(1 - b) * 40}px) scale(${1 - .06 * Math.exp(-Math.abs(t - 5.2) * 16)})`);
    const rp = inv(5.2, 5.6, t), rip = this.sendBtn.querySelector('.rip');
    op(rip, rp > 0 && rp < 1 ? 1 - rp : 0); tf(rip, `scale(${.5 + rp * 2.2})`);
    // saída: a cena desfoca e recua enquanto o card do treino decola
    const out = E.inOutCubic(inv(5.45, 5.85, t));
    tf(this.el, `scale(${1 - out * .06})`); op(this.el, 1 - out); fl(this.el, out > 0 ? `blur(${out * 12}px)` : 'none');
  },
});
