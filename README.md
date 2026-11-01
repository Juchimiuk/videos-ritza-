# Ritza: vídeo Reels (1080×1920, 60 fps, H.264)

Animação de 26 s (paleta restrita: verde #21D193, branco e preto) do Ritza, o app e web para assessorias de corrida. É montada como uma timeline HTML/CSS determinística, renderizada quadro a quadro com Playwright (Chromium) e codificada com ffmpeg.

- `vendor/motion-12.23.12.js`: biblioteca [Motion](https://motion.dev) (MIT). Todas as molas (`Motion.spring`, física real) e curvas de easing (`Motion.cubicBezier`, `easeInOut`) vêm dela, amostradas de forma determinística por quadro.
- `src/`: a animação. `core.js` tem easing, molas e keyframes; `data.js` tem os dados consistentes entre as cenas; `s1.js` a `s7.js` são as cenas.
- `assets/logo_original.png`: o logo enviado, sem alteração. `logo_hd.png` é a mesma arte ampliada 8× com bordas nítidas, mesma forma e mesma cor.
- `render.js`: renderiza um intervalo de frames em MP4. `build.sh` renderiza cada cena em `out/cenas/NN_*.mp4` (em paralelo) e junta tudo em `out/ritza_reels_1080x1920_60fps.mp4`.
- O vídeo não usa pílulas de legenda: os textos fazem parte de cada cena, em volta do objeto principal.
- `still.js`: gera quadros de revisão (`GUIDES=1` mostra as margens reservadas: 150 px no topo e 260 px na base).
- `BATIDAS.md`: folha de batidas (120 BPM) para encaixar a música.

```bash
./build.sh            # JOBS=3 por padrão
node still.js /tmp 14.5 22.0
open "src/index.html?t=12.3"   # pré-visualiza um instante
```
