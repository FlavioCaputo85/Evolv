# Evolv — Estudos

Evolv é um painel pessoal para acompanhar rotina de estudo em cinco disciplinas fixas: **Algoritmo, Banco de Dados, TI, ArqComp e Intro a SO**. O objetivo é simples: registrar tarefas com prazo e sessões de estudo, e deixar que o próprio sistema mostre a evolução real, sem números inventados.

Este projeto também nasceu como um exercício de uso intensivo de IA: da definição da identidade visual ao código de cada camada, a construção foi conduzida em parceria com um modelo de linguagem (Claude, da Anthropic), com o objetivo declarado de explorar até onde a IA consegue ir na criação de um produto web completo — do design de interface à arquitetura de dados — mantendo qualidade de código e organização profissional.

## Como o site funciona

O Evolv é um site estático de múltiplas páginas (sem back-end e sem build). Cada página HTML carrega os mesmos scripts de base e, em seguida, um script específico daquela página:

- **`index.html`** — página inicial, estilo produto: apresenta o Evolv, mostra números reais (horas estudadas, tarefas concluídas) e leva à disciplina ou ao painel.
- **`dashboard.html`** — visão geral: KPIs, gráfico de evolução acumulada, gráfico de horas por dia e a lista das 5 disciplinas com progresso.
- **`subject.html?s=<id>`** — página de uma disciplina: KPIs próprios, gráfico de horas, lista de tarefas (com filtros) e lista de registros de estudo.
- **`add-task.html?s=<id>`** — página própria para adicionar uma tarefa a uma disciplina.
- **`add-log.html?s=<id>`** — página própria para registrar uma sessão de estudo.

Os dados ficam salvos no `localStorage` do navegador. Ao concluir uma tarefa ou registrar uma sessão, os gráficos e KPIs de todas as páginas passam a refletir esse novo dado automaticamente — nada é calculado a partir de valores fixos.

## Identidade visual

O visual segue uma linguagem inspirada em páginas de produto da Apple: tipografia grande e legível (system-ui / -apple-system, com Inter como alternativa), paleta neutra em preto, branco e cinza, um único azul de destaque para ações, e seções alternando fundo claro e escuro. Cada disciplina tem uma cor própria, usada de forma consistente no menu, nos cards e nos gráficos. O modo claro e escuro é automático (segue o sistema) e pode ser alternado manualmente. As animações de rolagem usam `IntersectionObserver` para revelar seções suavemente conforme a página é percorrida, e os números do topo da página inicial sobem de forma animada até o valor real.

## Estrutura de arquivos

```
index.html          página inicial (produto)
dashboard.html        painel com gráficos
subject.html            página de uma disciplina
add-task.html             adicionar tarefa
add-log.html               adicionar registro de estudo

data/
  seed.json          formato de dados que uma futura API deve seguir

css/
  theme.css          cores e modo claro/escuro
  base.css            tipografia, reset, botões e inputs
  nav.css              barra de navegação fixa
  marketing.css          seções da página inicial
  components.css           cards, gráficos, listas, formulários
  animations.css             revelação ao rolar a página

js/
  core/
    utils.js         datas, formatação, helpers de DOM
    state.js           as 5 disciplinas fixas e o estado da página
  data/
    database.js       camada de persistência (adapter + repository)
  services/
    services.js       regras de negócio de tarefas e registros
    stats.js            cálculos que alimentam os gráficos, mais o seed de exemplo
  ui/
    charts.js         gráficos SVG (linha e barras), sem bibliotecas externas
    reveal.js           navegação, tema e animações de rolagem, comuns a todas as páginas
  pages/
    marketing.js       lógica exclusiva de index.html
    dashboard.js         lógica exclusiva de dashboard.html
    subject.js             lógica exclusiva de subject.html
    add-task.js               lógica exclusiva de add-task.html
    add-log.js                  lógica exclusiva de add-log.html
```

A camada `data/database.js` é a única parte do código que sabe *onde* os dados moram. Hoje é o `localStorage`; para evoluir para um banco de dados real, basta criar um adaptador que faça `fetch('/api/subjects')`, `fetch('/api/tasks')` e `fetch('/api/logs')` devolvendo exatamente o formato descrito em `data/seed.json`, mantendo os mesmos métodos (`all`, `create`, `update`, `remove`) usados pelas camadas acima — nenhuma página ou serviço precisa mudar.

## Rodando o projeto

Não há dependências nem build. Basta abrir `index.html` no navegador, ou publicar a pasta inteira em qualquer hospedagem estática, como a Vercel:

```
npx vercel
```

## Próximos passos possíveis

- Substituir `LocalAdapter` por uma API real (Vercel Functions + Postgres/Supabase), seguindo o contrato de `data/seed.json`.
- Autenticação, para múltiplos usuários com dados próprios.
- Notificações de prazos e sequência de dias estudados.
