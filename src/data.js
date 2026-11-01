// Edite este arquivo com suas informações reais.

export const profile = {
  name: 'Paulo Sérgio',
  title: 'Desenvolvedor Full Stack',
  tagline: 'Mais de 3 anos forjando APIs, automações e aplicações web.',
  location: 'Cajazeiras · PB',
  languages: 'Português · Inglês C1',
  email: 'paulosrlj9095@gmail.com',
  github: 'https://github.com/paulosrlj',
  linkedin: 'https://www.linkedin.com/in/paulo-s-r-junior/',
  cv: '', // link para o PDF do currículo (o botão só aparece se preenchido)
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

// Projetos como "itens" do inventário. link/repo vazios escondem os botões.
export const projects = [
  {
    name: 'Autômato da Graça Consular',
    type: 'Automação · Youvisa',
    glyph: 'seal',
    scaling: { Node: 'S', RabbitMQ: 'A', GCP: 'B' },
    description:
      'Automação de agendamento de entrevistas consulares que eliminou o trabalho manual do time de vistos, operando sem supervisão humana. Construída com Node.js, TypeScript, RabbitMQ e Puppeteer no Google Cloud.',
    tags: ['Node.js', 'TypeScript', 'RabbitMQ', 'Puppeteer', 'GCP'],
    link: '',
    repo: '',
  },
  {
    name: 'Pergaminho DS-160',
    type: 'Automação · Youvisa',
    glyph: 'tome',
    scaling: { "Electron": 'S', TypeScript: 'A' },
    description:
      'Preenchimento automático do formulário DS-160: uma etapa de 30–60 minutos caiu para menos de 5, aumentando a produtividade em ~83%–92% conforme o tipo de ficha.',
    tags: ['TypeScript', 'Puppeteer', 'Automação'],
    link: '',
    repo: '',
  },
  {
    name: 'E-commerce ultra aprimorado',
    type: 'Projeto pessoal · Full Stack',
    glyph: 'shield',
    scaling: { 'ASP.NET': 'S', React: 'B', AWS: 'C' },
    description:
      'Projeto de e-commerce overengineered. Este projeto busca utilizar o máximo possível de tecnologias, padrões de projeto e boas práticas com propósito de aprendizado.',
    tags: ['C#', 'ASP.NET Core', 'React', 'Stripe', 'AWS'],
    link: '',
    repo: '',
  },
  {
    name: 'Amuleto Stray Pets',
    type: 'Projeto pessoal · Mobile',
    glyph: 'sword',
    scaling: { 'Spring Boot': 'A', 'React Native': 'A', MySQL: 'B' },
    description:
      'Aplicativo Android para localização, rastreio e adoção de animais de rua, com Google Maps para geolocalização, imagens no AWS S3 e autenticação com Spring Security + JWT.',
    tags: ['Spring Boot', 'React Native', 'MySQL', 'AWS S3'],
    link: '',
    repo: '',
  },
]

// Experiência e formação como "Locais de Graça" descobertos
export const journey = [
  {
    period: 'Set 2026 — Presente',
    place: 'Arch',
    role: 'Desenvolvedor Nível 1 · Remoto',
    text: 'Desenvolvimento e evolução de APIs e microserviços utilizando IA.',
    highlights: [
      'Implementação, manutenção e evolução de funcionalidades com base nas especificações do arquiteto de software.',
    ],
  },
  {
    period: 'Set 2023 — Set 2026',
    place: 'Youvisa',
    role: 'Desenvolvedor Full Stack · Remoto',
    text: 'Automações, integrações e evolução da API principal da empresa.',
    highlights: [
      'Automação de agendamento de entrevistas consulares rodando sem supervisão humana (Node.js, TypeScript, RabbitMQ, Puppeteer, GCP).',
      'Desenvolvimento e manutenção da API principal em Ruby on Rails.',
      'Servidor de e-mail + API ASP.NET Core automatizando a criação de contas de clientes, reduzindo em pelo menos 90% a interação humana.',
      'Automação do formulário DS-160: de 30–60 minutos para menos de 5.',
      'Integração de aplicações criadas com IA (Lovable) à infraestrutura interna, além de code reviews.',
    ],
  },
  {
    period: 'Ago 2022 — Mar 2023',
    place: 'Intelitrader',
    role: 'Desenvolvedor Full Stack Jr · Remoto',
    text: 'Novas funcionalidades e manutenção de aplicações web com C#, ASP.NET Core, React e Oracle SQL.',
    highlights: [
      'Projeto para o Itaú: gerenciamento de múltiplos contratos de mercado futuro em sistema interno.',
      'Investigação e correção de bugs em aplicações existentes.',
      'Processo de release para clientes com Docker, React e Oracle SQL.',
    ],
  },
  {
    period: 'Fev 2019 — Dez 2022',
    place: 'IFPB · Cajazeiras',
    role: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    text: 'Formação acadêmica, complementada por cursos de React Native (Udemy) e JavaScript e Responsive Web Design (freeCodeCamp).',
  },
]

function calcNivel(attributes) {
  return attributes.reduce((anterior, atual) => anterior + atual.value, 0);
}