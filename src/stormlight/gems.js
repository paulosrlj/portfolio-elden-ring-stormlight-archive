// As dez Essências, na ordem das gemas
export const GEMS = [
  { name: 'Safira', color: '#2f6fff' },
  { name: 'Quartzo-fumê', color: '#b4b4c8' },
  { name: 'Rubi', color: '#ff2a3a' },
  { name: 'Diamante', color: '#e8f6ff' },
  { name: 'Esmeralda', color: '#2aff8a' },
  { name: 'Granada', color: '#d0104a' },
  { name: 'Zircônia', color: '#3ad6ff' },
  { name: 'Ametista', color: '#a64dff' },
  { name: 'Topázio', color: '#ffa62a' },
  { name: 'Heliodoro', color: '#ffe14a' },
]

export const gemColor = (name) => GEMS.find((g) => g.name === name)?.color ?? '#9fe0ff'
