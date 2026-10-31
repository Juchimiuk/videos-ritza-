// ===== Boot: aguarda fontes, constrói cenas e expõe seek() =====
window.READY = false;
(async () => {
  await document.fonts.load('900 100px "Inter Display"');
  await document.fonts.load('700 100px "Inter Display"');
  await document.fonts.load('800 100px Inter');
  await document.fonts.ready;
  buildBg(); buildGrain();
  fx.ctx = $('#fx').getContext('2d');
  for (const s of SCENES) s.build();
  const q = new URLSearchParams(location.search);
  if (q.has('guides')) $('#guides').style.display = 'block';
  // imagens prontas
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  seek(q.has('t') ? +q.get('t') : 0);
  window.READY = true;
})();
