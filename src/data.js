// ===== Dados fictícios, porém realistas e consistentes entre cenas =====
// Hoje: quarta-feira, 28 de outubro de 2026. Assessoria: Equipe Passo Firme. Professor: Rafael Andrade.
const DATA = {
  hoje: 'QUA, 28 OUT',
  assessoria: 'Equipe Passo Firme',
  professor: 'Rafael Andrade',
  ativos: 24,
  treinaramHoje: 17,          // 17 de 24 -> 7 ainda não treinaram
  constancia14: 82,           // % média de treinos cumpridos nos últimos 14 dias
  constanciaDias: [74, 79, 81, 76, 85, 88, 70, 83, 86, 80, 84, 89, 87, 85], // média = 82
  convites: 3,
  emRisco: 2,                 // alunos com 5+ dias sem treinar (depois que o Henrique voltou)
  alunos: [
    { nome: 'Mariana Costa Silva', ini: 'MC', cor: ['#1C1D1F', '#2C2D30'], ok: true, st: 'Treinou · 8,5 km · 5:30/km', esf: 7 },
    { nome: 'Lucas Oliveira Santos', ini: 'LO', cor: ['#1C1D1F', '#2C2D30'], ok: true, st: 'Treinou · Fartlek 8 km · 5:05/km', esf: 8 },
    { nome: 'Juliana Mendes Pereira', ini: 'JM', cor: ['#1C1D1F', '#2C2D30'], ok: true, st: 'Treinou · 10 km · 5:50/km', esf: 6 },
    { nome: 'Henrique Juchimiuk', ini: 'HJ', cor: ['#1C1D1F', '#2C2D30'], ok: false, st: 'Há 5 dias sem treinar', esf: null },
    { nome: 'Ana Beatriz Ferreira', ini: 'AB', cor: ['#1C1D1F', '#2C2D30'], ok: true, st: 'Treinou · Regenerativo 5 km · 6:40/km', esf: 3 },
    { nome: 'Pedro Henrique Lima', ini: 'PH', cor: ['#1C1D1F', '#2C2D30'], ok: true, st: 'Treinou · Tiros 10 × 400 m', esf: 9 },
  ],
  // corrida sincronizada do Strava (Mariana) — 8,5 km em 46:45 = 5:30/km
  corrida: { km: 8.5, seg: 46 * 60 + 45, fcMedia: 152, fcMax: 171, local: 'Parque Ibirapuera · São Paulo', hora: '06:12' },
  // evolução da Mariana (12 semanas, 03/ago a 26/out)
  kmSemana: [18, 21, 19, 24, 26, 22, 28, 30, 27, 32, 34, 36],
  ritmoSemana: [372, 368, 365, 361, 358, 355, 350, 347, 344, 340, 336, 332], // s/km: 6:12 -> 5:32
  zonas: [
    { z: 'Z1', nome: 'Recuperação', fc: '< 128', pct: 12, cor: '#D5D7DA' },
    { z: 'Z2', nome: 'Aeróbico', fc: '128–142', pct: 38, cor: '#A9EBD3' },
    { z: 'Z3', nome: 'Tempo', fc: '143–155', pct: 26, cor: '#5FDDB1' },
    { z: 'Z4', nome: 'Limiar', fc: '156–167', pct: 16, cor: '#21D193' },
    { z: 'Z5', nome: 'VO₂máx', fc: '≥ 168', pct: 8, cor: '#0A0A0A' },
  ],
  recorde5k: { tempo: '27:00', ritmo: '5:24/km', data: '25 out' },
  // projeção (Riegel, expoente 1,06) a partir de 5 km em 27:00 -> 15 km = 1:26:30 (5:46/km)
  prova: { nome: 'São Silvestre', data: '31 dez', km: 15, antes: 5350, depois: 5190 },
  treino: { nome: '4km em regenerativo', dia: 'Sábado', aluno: 'Henrique Juchimiuk', ini: 'HJ' },
};
