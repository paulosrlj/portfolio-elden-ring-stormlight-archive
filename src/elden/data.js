// Textos do tema Elden Ring. Contato, experiência e descrições dos projetos ficam em src/shared/content.js.
import * as shared from '../shared/content'

export const profile = {
  ...shared.profile,
  tagline: 'Mais de 3 anos forjando APIs, automações e aplicações web.',
}

export const about = [
  'Sou desenvolvedor Full Stack com mais de 3 anos de jornada no desenvolvimento e evolução de aplicações web e APIs REST, empunhando JavaScript/TypeScript, Node.js, C# com ASP.NET Core e Ruby on Rails.',
  'Minha especialidade é transformar trabalho manual em automação: integrações entre sistemas, filas de mensagens e robôs que operam sem supervisão humana, hospedados na nuvem. Trago na bagagem bancos de dados relacionais, front-end em React, code review e boas práticas de engenharia como SOLID e design patterns.'
]

// Atributos estilo tela de nível (0–99)
export const attributes = [
  { name: 'Node.js / TypeScript', short: 'VIG', value: 86 },
  { name: 'C# / ASP.NET Core', short: 'MEN', value: 75 },
  { name: 'React / Next.js', short: 'FOR', value: 68 },
  { name: 'Ruby on Rails', short: 'RES', value: 57 },
  { name: 'SQL (Postgres, MySQL, Oracle)', short: 'DES', value: 50 },
  { name: 'Automação & Mensageria', short: 'INT', value: 75 },
  { name: 'Cloud (GCP, AWS) & Docker', short: 'FÉ', value: 75 },
  { name: 'Testes (Jest, xUnit, RSpec)', short: 'ARC', value: 22 },
]
export const level = calcNivel(attributes);

export const equipment = [
  { slot: 'Mão direita', item: 'TypeScript & Node.js' },
  { slot: 'Mão esquerda', item: 'C# & ASP.NET Core' },
  { slot: 'Elmo', item: 'Git · GitHub · CI/CD' },
  { slot: 'Armadura', item: 'Docker · GCP · AWS' },
  { slot: 'Talismã', item: 'RabbitMQ · Redis · Sidekiq' },
  { slot: 'Talismã', item: 'Claude Code · Cursor · Copilot' },
  { slot: 'Selo', item: 'SOLID · Design Patterns · SCRUM' },
]

// Projetos como "itens" do inventário
export const projects = [
  {
    ...shared.projects.consular,
    name: 'Autômato da Graça Consular',
    glyph: 'seal',
    scaling: { Node: 'S', RabbitMQ: 'A', GCP: 'B' },
  },
  {
    ...shared.projects.ds160,
    name: 'Pergaminho DS-160',
    glyph: 'tome',
    scaling: { "Electron": 'S', TypeScript: 'A' },
  },
  {
    ...shared.projects.ecommerce,
    name: 'E-commerce ultra aprimorado',
    glyph: 'shield',
    scaling: { 'ASP.NET': 'S', React: 'B', AWS: 'C' },
  },
  {
    ...shared.projects.strayPets,
    name: 'Amuleto Stray Pets',
    glyph: 'sword',
    scaling: { 'Spring Boot': 'A', 'React Native': 'A', MySQL: 'B' },
  },
]

// Experiência e formação como "Locais de Graça" descobertos
export const journey = shared.journey

function calcNivel(attributes) {
  return attributes.reduce((anterior, atual) => anterior + atual.value, 0);
}
