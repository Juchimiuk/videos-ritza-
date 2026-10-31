// Gera quadros PNG para revisão: node still.js out_dir t1 t2 ...
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [dir, ...ts] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGEERROR', e); });
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'src/index.html') + (process.env.GUIDES ? '?guides=1' : ''));
  await page.waitForFunction(() => window.READY === true);
  for (const t of ts) { await page.evaluate(t => seek(t), +t); await page.screenshot({ path: `${dir}/t${(+t).toFixed(2)}.jpg`, type: 'jpeg', quality: 80 }); }
  await browser.close();
})();
