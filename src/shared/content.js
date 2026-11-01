// Conteúdo comum aos dois portfólios. Edite aqui uma vez e ele aparece nos dois temas.
// Os textos temáticos (tagline, sobre, habilidades, nomes de projetos) ficam em src/<tema>/data.js.

export const profile = {
  name: 'Paulo Sérgio',
  title: 'Desenvolvedor Full Stack',
  location: 'Cajazeiras · PB',
  languages: 'Português · Inglês C1',
  email: 'paulosrlj9095@gmail.com',
  github: 'https://github.com/paulosrlj',
  linkedin: 'https://www.linkedin.com/in/paulo-s-r-junior/',
  cv: '', // link para o PDF do currículo (o botão só aparece se preenchido)
}

// Fatos de cada projeto. link/repo vazios escondem os botões.
export const projects = {
  consular: {
    type: 'Automação · Youvisa',
    description:
      'Automação de agendamento de entrevistas consulares que eliminou o trabalho manual do time de vistos, operando sem supervisão humana. Construída com Node.js, TypeScript, RabbitMQ e Puppeteer no Google Cloud.',
    tags: ['Node.js', 'TypeScript', 'RabbitMQ', 'Puppeteer', 'GCP'],
    link: '',
    repo: '',
  },
  ds160: {
    type: 'Automação · Youvisa',
    description:
      'Preenchimento automático do formulário DS-160: uma etapa de 30–60 minutos caiu para menos de 5, aumentando a produtividade em ~83%–92% conforme o tipo de ficha.',
    tags: ['TypeScript', 'Puppeteer', 'Automação'],
    link: '',
    repo: '',
  },
  ecommerce: {
    type: 'Projeto pessoal · Full Stack',
    description:
      'Projeto de e-commerce overengineered. Este projeto busca utilizar o máximo possível de tecnologias, padrões de projeto e boas práticas com propósito de aprendizado.',
    tags: ['C#', 'ASP.NET Core', 'React', 'Stripe', 'AWS'],
    link: '',
    repo: '',
  },
  strayPets: {
    type: 'Projeto pessoal · Mobile',
    description:
      'Aplicativo Android para localização, rastreio e adoção de animais de rua, com Google Maps para geolocalização, imagens no AWS S3 e autenticação com Spring Security + JWT.',
    tags: ['Spring Boot', 'React Native', 'MySQL', 'AWS S3'],
    link: '',
    repo: '',
  },
}

// Experiência e formação
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
