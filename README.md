# Portfólio · Paulo Sérgio

## Live

https://portfolio-elden-storm.paulojunior9395.workers.dev/

---

Portfólio pessoal de desenvolvedor Full Stack com dois temas de fantasia no mesmo projeto. Ao entrar no site, uma tela de escolha deixa o visitante decidir qual mundo explorar:

- **Elden Ring** (`/elden-ring`): fantasia sombria em ouro, com barras de HP/FP/Stamina, contador de runas, relíquias e locais de graça. O fundo alterna entre duas cenas 3D: o **Anel**, que se estilhaça e se recompõe com o scroll (`?cena=anel`, padrão), e a **Árvore** dourada (`?cena=arvore`).
- **Stormlight Archive** (`/stormlight`): fantasia épica em azul, com uma grantempestade em 3D que cresce e passa conforme o scroll, Luz das Tempestades acumulada, Fluxos, fabriais e os cinco Ideais.

Cada portfólio tem um link "Trocar portfólio" no canto superior direito que volta para a tela de escolha.

## Rotas

| Rota | Página |
|---|---|
| `/` | Tela de escolha |
| `/elden-ring` | Portfólio Elden Ring |
| `/stormlight` | Portfólio Stormlight Archive |

Qualquer outra rota volta para a tela de escolha. Cada rota carrega só o próprio código e CSS (as cenas 3D só são baixadas ao entrar num portfólio), e a navegação entre elas recarrega a página para que os estilos dos temas nunca se misturem. Adicione `?nointro` à URL de um portfólio para pular a tela de abertura.

## Tecnologias

- React 18 + Vite
- Three.js com React Three Fiber, Drei e Postprocessing (bloom e vinheta)
- Framer Motion (animações de entrada e parallax)
- Oxlint

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
npm run lint     # oxlint
```

## Editando o conteúdo

O conteúdo está dividido em três arquivos:

- `src/shared/content.js`: o que é igual nos dois temas, ou seja, contato, experiência e os fatos de cada projeto (tipo, descrição, tags, links). Edite aqui uma vez e a mudança aparece nos dois portfólios.
- `src/elden/data.js`: textos do tema Elden Ring, com tagline, sobre, atributos (0–99), equipamento e o nome, ícone e escalonamento de cada projeto. O nível é a soma dos atributos.
- `src/stormlight/data.js`: textos do tema Stormlight, com tagline, lema, sobre, Fluxos (0–10), Armadura Fractal e o nome e a gema de cada projeto. A gema precisa ser um dos nomes definidos em `src/stormlight/gems.js`.

Nos projetos, `link` e `repo` vazios escondem os botões. Em `profile`, o botão de currículo só aparece se `cv` estiver preenchido.

## Estrutura

```
src/
├── main.jsx                # escolhe a página pela rota e carrega só ela
├── chooser/                # tela de escolha
│   ├── Chooser.jsx
│   └── chooser.css
├── shared/
│   ├── content.js          # conteúdo comum aos dois temas
│   ├── scroll.js           # progresso do scroll compartilhado com a cena 3D
│   └── three-utils.js
├── elden/
│   ├── App.jsx             # layout, navegação lateral e troca de cena
│   ├── data.js
│   ├── index.css
│   └── components/         # Sections, Hud, RingScene (Anel), Scene (Árvore)
└── stormlight/
    ├── App.jsx             # layout e navegação lateral
    ├── data.js
    ├── gems.js             # as dez gemas e suas cores
    ├── index.css
    └── components/         # Sections, Hud, StormScene
public/
├── favicon.svg             # ícone da tela de escolha
├── favicon-elden.svg
└── favicon-stormlight.svg
```

## Deploy no Cloudflare Pages

Build command `npm run build`, output directory `dist`. O Pages serve o `index.html` para qualquer rota que não seja um arquivo, então `/elden-ring` e `/stormlight` funcionam sem configuração extra.
