# Foco — sistema pessoal de estudos

Abra `index.html` (duplo clique) ou publique a pasta no Vercel (site estático, sem build).

## Estrutura
```
index.html
css/   theme · base · layout · components · animations
js/
  core/      utils.js (datas, helpers) · state.js (estado, paleta)
  data/      database.js  → Adapter + Repository (localStorage hoje)
  services/  services.js (regras de negócio) · stats.js (cálculos dos gráficos) · seed.js
  ui/        charts.js (SVG) · views.js (telas) · events.js (ações)
  app.js     inicialização
```
## Evolução
- **Banco/Auth:** troque o `LocalAdapter` em `data/database.js` por um adaptador que faça `fetch('/api/<tabela>')` (Vercel Functions + Postgres/Supabase) mantendo os mesmos métodos.
- **Multiusuário:** inclua `userId` nos registros dentro de `services/services.js`.
