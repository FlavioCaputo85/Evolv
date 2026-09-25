# 📚 Evolv

**A personal study tracker, built for people who actually want to see their progress.**

Evolv blends the flexibility of Notion with the simplicity of ChatGPT into a focused, single-purpose tool: track what you're studying, log your hours, and watch a real, data-driven dashboard show you how far you've come — subject by subject.

No mock numbers. No vanity metrics. Every chart on the dashboard is calculated live from the tasks you complete and the study sessions you log.

---

## ✨ Features

- **📊 Real-data dashboard** — cumulative progress and daily-hours charts, generated straight from your tasks and study logs.
- **🎨 Subject identity** — every subject gets its own color, kept consistent across the sidebar, cards, and charts, so you always know what you're looking at.
- **✅ Tasks with deadlines** — create, complete, and filter tasks by *All / Pending / Done / Overdue*.
- **📝 Study logs** — record date, duration, and what you studied; each entry feeds the analytics automatically.
- **🌗 Dark & light mode** — respects your system preference, with a manual toggle.
- **💫 Smooth, purposeful animations** — nothing flashy, just a fluid, intuitive feel.
- **📱 Fully responsive** — works from a wide desktop dashboard down to a phone screen.
- **⚡ Zero build step** — plain HTML/CSS/JS. Open `index.html` and it just works.

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Modular CSS (custom properties for theming) |
| Logic | Vanilla JavaScript (no framework) |
| Charts | Hand-rolled SVG — no charting library, no dependencies |
| Data | LocalStorage today, swappable for a real database tomorrow |
| Deploy target | [Vercel](https://vercel.com) (static, no build step required) |

---

## 🏗️ Architecture

Evolv is organized in clear layers so it can grow without turning into a mess:

```
index.html
css/
  theme.css         → color tokens, light/dark mode
  base.css           → resets, typography, inputs
  layout.css          → sidebar, main content, structure
  components.css      → cards, buttons, charts, modals
  animations.css       → transitions and motion
js/
  core/
    utils.js          → date helpers, formatting
    state.js           → app state, color palette
  data/
    database.js        → Adapter + Repository pattern (persistence layer)
  services/
    services.js        → business logic & validation
    stats.js            → pure calculations that power the charts
    seed.js              → first-run sample data
  ui/
    charts.js          → SVG chart rendering
    views.js             → screen/view rendering
    events.js             → user interactions & event handling
  app.js               → app bootstrap
```

**The key idea:** the `data/` layer is the only place that knows *how* data is stored. Everything else (`services`, `stats`, `ui`) talks to it through a small, stable interface — `all()`, `create()`, `update()`, `remove()`. That means swapping the storage engine never touches business logic or UI code.

---

## 🚀 Getting Started

No install, no build, no dependencies.

```bash
git clone https://github.com/your-username/evolv.git
cd evolv
open index.html   # or just double-click it
```

That's it. Evolv seeds a few sample subjects on first run so the dashboard isn't empty — feel free to delete them and start fresh.

---

## ☁️ Deploying to Vercel

Evolv is a static site, so deployment is a one-liner:

```bash
npx vercel
```

Or connect the repo directly in the [Vercel dashboard](https://vercel.com/new) — no build command needed.

---

## 🔭 Roadmap / Built to Grow

Evolv's architecture was designed with the following evolution in mind:

- [ ] **Real database** — swap `LocalAdapter` in `data/database.js` for an adapter that calls `/api/*` routes (Vercel Functions + Postgres/Supabase), keeping the same repository interface.
- [ ] **Authentication** — add `userId` scoping in `services/services.js` for multi-user support.
- [ ] **Sync across devices** — once persisted server-side, data follows you anywhere.
- [ ] **Study streaks & reminders**
- [ ] **Export / import data**
- [ ] **AI-assisted study suggestions** (leaning into the ChatGPT-inspired part of the vision)

---

## 🤝 Contributing

This is a personal project, but issues, ideas, and pull requests are always welcome. If you spot a bug or have a feature in mind, feel free to open an issue.

---

## 📄 License

MIT — do whatever you'd like with it.

---

<p align="center">Built with focus, for focus. — <b>Evolv</b></p>
