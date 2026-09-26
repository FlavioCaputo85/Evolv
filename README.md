# Evolv — Estudos

link: https://evolv-xi.vercel.app/index.html

Evolv é um painel pessoal de estudos com conta obrigatória: cada pessoa cria as suas próprias matérias (ou deixa o sistema sugerir as do seu curso), registra tarefas com prazo e sessões de estudo, e acompanha tudo isso evoluindo em gráficos reais — sem depender de planilhas soltas.

Este projeto também é um exercício deliberado de uso de IA: da identidade visual à arquitetura de dados, cada parte foi construída em parceria com um modelo de linguagem (Claude, da Anthropic), testando até onde a IA consegue ir na criação de um produto completo — autenticação, banco de dados, design — mantendo organização e qualidade de código profissional.

## Como o site funciona

Criar conta ou entrar é obrigatório para usar o painel. Ao se cadastrar, a pessoa pode informar seu curso digitando a sigla ou o nome (ex: "ADS") — o campo sugere o curso completo automaticamente. Se ela marcar a opção, o Evolv já cria as matérias mais comuns daquele curso. A partir daí, tudo fica salvo por conta: matérias, tarefas, registros de estudo e foto de perfil.

- **`index.html`** — página institucional, pública, apresentando o produto.
- **`signup.html`** / **`login.html`** — criação de conta e entrada. Sem sessão ativa, o painel redireciona para cá.
- **`dashboard.html`** — visão geral: KPIs, gráficos e a lista de matérias da pessoa logada.
- **`subject.html?s=<id>`** — uma matéria: tarefas (com filtros) e registros de estudo.
- **`add-task.html?s=<id>`** — página própria para adicionar uma tarefa.
- **`add-log.html?s=<id>`** — página própria para registrar uma sessão de estudo.
- **`add-subject.html`** — criar uma matéria manualmente, com nome, descrição e cor.
- **`edit-subject.html?s=<id>`** — editar ou excluir uma matéria (exclui também suas tarefas e registros).
- **`profile.html`** — nome, curso e foto de perfil, mais opção de sair da conta.
- **`about.html`** — a motivação do projeto e o crédito de autoria.

## Contas e dados (importante)

Como o Evolv não tem servidor próprio, contas e dados hoje ficam guardados no `localStorage` do navegador — funcionam sozinhos, sem depender de nada externo, mas só naquele navegador específico (não sincronizam entre aparelhos, e a senha não tem a segurança de um sistema real de produção). A senha é transformada em hash (SHA-256) antes de ser salva, o que já evita guardá-la em texto puro, mas isso não substitui um back-end de verdade. O arquivo `data/seed.json` documenta exatamente o formato de usuários, matérias, tarefas e registros — é o contrato que uma futura API (Vercel Functions + Postgres/Supabase, por exemplo) deve seguir para substituir o `localStorage` sem quebrar nada nas camadas acima.

## Identidade visual — Liquid Glass (Apple Dark Mode)

A interface segue a linguagem de vidro jateado do macOS/iOS mais recente:

- **Fundo:** gradiente escuro e profundo (`#000000` → `#0d0d11`), com leves brilhos radiais azul e roxo ao fundo.
- **Superfícies (cards, nav, formulários):** vidro de verdade — fundo semi-transparente, `backdrop-filter: blur(20px) saturate(160%)` e borda de 1px quase invisível (`rgba(255,255,255,0.08)`) simulando o reflexo do vidro.
- **Cores de destaque:** azul de sistema (`#0a84ff`) e roxo (`#a879ff`), usados em botões, badges e gradientes.
- **Tipografia:** pilha nativa da Apple (`-apple-system, BlinkMacSystemFont...`), títulos com peso 700–800 e tracking levemente negativo (`-0.02em`).
- **Movimento:** toda transição usa a curva `cubic-bezier(.25,1,.5,1)`, com duração de 300–400ms. Cards e botões reagem ao hover com `scale(1.02)` e a borda de vidro brilha um pouco mais — a mesma resposta física usada em botões do tvOS/iPadOS.
- **Modo claro:** existe e continua elegante, mas o modo escuro é a experiência de bandeira do produto.

## Estrutura de arquivos

```
index.html, login.html, signup.html      páginas públicas
dashboard.html, subject.html               painel e matéria (exigem login)
add-task.html, add-log.html                  formulários próprios
add-subject.html, edit-subject.html            gestão de matérias
profile.html, about.html                         perfil e sobre

data/
  seed.json          formato de dados (usuários, matérias, tarefas, registros, cursos)

css/
  theme.css          tokens de cor, vidro e modo claro/escuro
  base.css            tipografia, curva de animação, botões
  nav.css              barra de navegação em vidro
  marketing.css          seções da página inicial
  components.css           cards, formulários, autocomplete, avatar
  animations.css             revelação ao rolar a página

js/
  core/
    utils.js         datas, formatação, helpers de DOM
    state.js           paleta de cores, catálogo de cursos, estado da página
  data/
    database.js       persistência (adapter + repository), tabela de usuários
  services/
    auth.js           cadastro, login, sessão, hash de senha
    services.js         regras de negócio de matérias, tarefas e registros
    stats.js              cálculos que alimentam os gráficos
  ui/
    charts.js         gráficos SVG (linha e barras)
    autocomplete.js     sugestão de curso ao digitar
    reveal.js             navegação, tema, sessão na nav e animações de rolagem
  pages/
    marketing.js, login.js, signup.js, profile.js, about.js
    dashboard.js, subject.js, add-task.js, add-log.js, add-subject.js, edit-subject.js
```

A camada `data/database.js` é a única que sabe *onde* os dados moram. Para evoluir para um banco real, crie um adaptador que faça `fetch('/api/users')`, `/api/subjects`, `/api/tasks` e `/api/logs`, devolvendo o formato de `data/seed.json`, mantendo os métodos `all`, `create`, `update`, `remove` — nenhuma página ou serviço precisa mudar.

## Rodando o projeto

Sem dependências nem build. Abra `index.html` no navegador, ou publique a pasta inteira em qualquer hospedagem estática:

```
npx vercel
```

## Próximos passos possíveis

- Substituir `localStorage` por uma API real com banco de dados, seguindo o contrato de `data/seed.json`.
- Recuperação de senha e verificação de e-mail.
- Notificações de prazos e sequência de dias estudados.

---

Criado por **Flávio Sandri Caputo** — Creator.
