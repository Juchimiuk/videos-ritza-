#!/usr/bin/env bash
# Renderiza cada cena em um MP4 separado (em paralelo) e junta tudo no final.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out/cenas
# nome  frame_inicial  frame_final(excl.)  — 60 fps, cortes em múltiplos de 0,5 s (120 BPM)
SCENES=(
  "01_gancho 0 180"
  "02_aluno_em_risco 180 390"
  "03_treino_enviado 390 780"
  "04_strava 780 960"
  "05_evolucao 960 1140"
  "06_painel 1140 1320"
  "07_cta 1320 1560"
)
JOBS=${JOBS:-3}
printf '%s\n' "${SCENES[@]}" | xargs -P "$JOBS" -L 1 bash -c 'node render.js "$1" "$2" "out/cenas/$0.mp4" > "out/cenas/$0.log" 2>&1 && echo "ok $0"'
: > out/cenas/lista.txt
for s in "${SCENES[@]}"; do set -- $s; echo "file '$1.mp4'" >> out/cenas/lista.txt; done
ffmpeg -y -loglevel error -f concat -safe 0 -i out/cenas/lista.txt -c copy -movflags +faststart out/ritza_reels_1080x1920_60fps.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames,pix_fmt -show_entries format=duration -of compact out/ritza_reels_1080x1920_60fps.mp4
