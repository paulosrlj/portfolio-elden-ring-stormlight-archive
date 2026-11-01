# Portfólio · Paulo Sérgio (Elden Ring)

Portfólio pessoal de desenvolvedor Full Stack com estética de fantasia sombria inspirada em Elden Ring. O fundo é uma cena 3D que reage ao scroll e ao mouse, e a interface imita a de um jogo: barras de HP/FP/Stamina, contador de runas e avisos como "Local de Graça Descoberto".

## Seções

| Seção | Conteúdo |
|---|---|
| Início | Nome, cargo e chamada principal |
| Capítulo I · A Origem | Sobre mim e ficha (classe, origem, idiomas, nível) |
| Capítulo II · Atributos | Habilidades como atributos (0–99) e ferramentas como equipamento |
| Capítulo III · Relíquias Forjadas | Projetos como itens do inventário, com escalonamento |
| Capítulo IV · Experiência profissional | Experiência e formação em linha do tempo |
| Capítulo Final · Local de Graça | Contato |

## Cenas de fundo

O botão no canto inferior esquerdo alterna entre duas cenas, e a escolha fica salva na URL:

- **Anel** (`?cena=anel`, padrão): um emblema dourado que se acende, estilhaça e se recompõe conforme o scroll, com camadas de montanhas em parallax.
- **Árvore** (`?cena=arvore`): uma árvore dourada com brasas caindo, círculo rúnico e ruínas; a câmera orbita guiada pelo scroll.

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

Todo o texto fica em `src/data.js`: perfil, sobre, atributos, equipamento, projetos e experiência. O nível é calculado automaticamente pela soma dos atributos. Nos projetos, `link` e `repo` vazios escondem os botões; em `profile`, o botão de currículo só aparece se `cv` estiver preenchido.

## Estrutura

```
src/
├── App.jsx                 # layout, navegação lateral e troca de cena
├── data.js                 # todo o conteúdo do portfólio
├── scroll.js               # progresso do scroll compartilhado com a cena 3D
├── index.css
└── components/
    ├── Sections.jsx        # seções da página
    ├── Hud.jsx             # barras, runas, tela inicial e avisos
    ├── RingScene.jsx       # cena "Anel"
    ├── Scene.jsx           # cena "Árvore"
    └── three-utils.js
```
