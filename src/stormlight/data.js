// Textos do tema Stormlight. Contato, experiência e descrições dos projetos ficam em src/shared/content.js.
import * as shared from '../shared/content'

export const profile = {
  ...shared.profile,
  tagline: 'Mais de 3 anos construindo APIs, automações e aplicações web.',
  motto: ['Vida antes da morte.', 'Força antes da fraqueza.', 'Jornada antes do destino.'],
}

export const about = [
  'Sou desenvolvedor Full Stack com mais de 3 anos de jornada no desenvolvimento e evolução de aplicações web e APIs REST, manipulando JavaScript/TypeScript, Node.js, C# com ASP.NET Core e Ruby on Rails.',
  'Minha especialidade é transformar trabalho manual em automação: integrações entre sistemas, filas de mensagens e robôs que operam sem supervisão humana, hospedados na nuvem. Trago na bagagem bancos de dados relacionais, front-end em React, code review e boas práticas de engenharia como SOLID e design patterns.',
]

// Habilidades como os Fluxos dos Cavaleiros Radiantes (0–10 = Luz contida)
export const surges = [
  { name: 'Node.js / TypeScript', surge: 'Adesão', value: 9 },
  { name: 'C# / ASP.NET Core', surge: 'Gravitação', value: 8 },
  { name: 'Automação & Mensageria', surge: 'Transporte', value: 8 },
  { name: 'Cloud (GCP, AWS) & Docker', surge: 'Tensão', value: 8 },
  { name: 'React / Next.js', surge: 'Iluminação', value: 7 },
  { name: 'Ruby on Rails', surge: 'Progressão', value: 6 },
  { name: 'SQL (Postgres, MySQL, Oracle)', surge: 'Coesão', value: 5 },
  { name: 'Testes (Jest, xUnit, RSpec)', surge: 'Abrasão', value: 2 },
]

// Ferramentas como peças da Armadura Fractal
export const shardplate = [
  { piece: 'Espada Fractal', item: 'TypeScript & Node.js' },
  { piece: 'Segunda lâmina', item: 'C# & ASP.NET Core' },
  { piece: 'Elmo', item: 'Git · GitHub · CI/CD' },
  { piece: 'Peitoral', item: 'Docker · GCP · AWS' },
  { piece: 'Manoplas', item: 'RabbitMQ · Redis · Sidekiq' },
  { piece: 'Espreno vinculado', item: 'Claude Code · Cursor · Copilot' },
  { piece: 'Juramento', item: 'SOLID · Design Patterns · SCRUM' },
]

// Projetos como fabriais. gem = nome em src/stormlight/gems.js.
export const projects = [
  { ...shared.projects.consular, name: 'Fabrial do Agendamento Consular', gem: 'Safira' },
  { ...shared.projects.ds160, name: 'Telepena do DS-160', gem: 'Topázio' },
  { ...shared.projects.ecommerce, name: 'E-commerce ultra aprimorado', gem: 'Rubi' },
  { ...shared.projects.strayPets, name: 'Bússola Stray Pets', gem: 'Esmeralda' },
]

// Experiência e formação como grantempestades atravessadas
export const journey = shared.journey
