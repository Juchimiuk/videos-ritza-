# Ritza: vídeo Reels (1080×1920, 60 fps, H.264)

Animação de ~34 s do Ritza, o app e web para assessorias de corrida. É montada como uma timeline HTML/CSS determinística, renderizada quadro a quadro com Playwright (Chromium) e codificada com ffmpeg.

- `src/`: a animação. `core.js` tem easing, molas e keyframes; `data.js` tem os dados consistentes entre as cenas; `s1.js` a `s7.js` são as cenas.
- `assets/logo_original.png`: o logo enviado, sem alteração. `logo_hd.png` é a mesma arte ampliada 8× com bordas nítidas, mesma forma e mesma cor.
- `render.js`: renderiza um intervalo de frames em MP4. `build.sh` renderiza cada cena em `out/cenas/NN_*.mp4` (em paralelo) e junta tudo em `out/ritza_reels_1080x1920_60fps.mp4`.
- `still.js`: gera quadros de revisão (`GUIDES=1` mostra as áreas proibidas do Reels).
- `BATIDAS.md`: folha de batidas (120 BPM) para encaixar a música.

```bash
./build.sh            # JOBS=3 por padrão
node still.js /tmp 14.5 22.0
open "src/index.html?t=12.3"   # pré-visualiza um instante
```
