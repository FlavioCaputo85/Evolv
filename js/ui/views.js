/* ---------- 4. UI ---------- */
const kpi = (l, v, c) =>
  `<div class="card kpi"><span>${l}</span><b ${c ? `style="color:${c}"` : ""}>${v}</b></div>`;
const pageTop = (h, p, r = "") =>
  `<div class="pageTop"><button class="burger" data-act="menu">☰</button><div style="flex:1"><h1>${h}</h1>${p ? `<p>${p}</p>` : ""}</div>${r}</div>`;

const Side = () => `<div class="brand"><span class="logo">◐</span> Foco</div>
<button class="nav ${S.view === "dash" ? "on" : ""}" data-act="dash">▦ <span class="grow">Dashboard</span></button>
<div class="sec"><span>MATÉRIAS</span><button class="ico" data-act="new" title="Nova matéria">＋</button></div>
${
  S.subjects
    .map((s) => {
      const p = Stats.tasks(s.id).filter((t) => !t.done).length;
      return `<div class="nav-r"><button class="nav ${S.view === "subject" && S.sid === s.id ? "on" : ""}" style="--c:${s.color}" data-act="subj" data-id="${s.id}"><i class="dot"></i><span class="grow">${esc(s.name)}</span>${p ? `<small>${p}</small>` : ""}</button><button class="ico ed" data-act="edit" data-id="${s.id}" title="Editar">✎</button></div>`;
    })
    .join("") || '<p class="mut">Nenhuma matéria ainda.</p>'
}
<div style="flex:1"></div><button class="nav" data-act="theme">◑ <span>Alternar tema</span></button>`;

function Dash() {
  const subs = S.subjects,
    T = Stats.tasks(),
    done = T.filter((t) => t.done).length,
    late = T.filter(Stats.late).length;
  const wk = Stats.days(7).reduce((a, d) => a + subs.reduce((b, s) => b + Stats.mins(s.id, d), 0), 0) / 60;
  if (!subs.length)
    return `<div class="wrap">${pageTop("Bem-vindo 👋", "Crie sua primeira matéria para começar.")}<div class="card empty">Nada por aqui ainda.<br><br><button class="btn" data-act="new">Nova matéria</button></div></div>`;
  const leg = `<div class="leg">${subs.map((s) => `<span><i class="dot" style="--c:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>`;
  return `<div class="wrap">${pageTop("Seu painel", "Evolução real, calculada a partir das suas tarefas e horas.")}
  <div class="grid kpis">${kpi("Horas totais", hrs(Stats.total()))}${kpi("Últimos 7 dias", hrs(wk))}${kpi("Tarefas concluídas", done + "/" + T.length)}${kpi("Atrasadas", late, late ? "var(--bad)" : "")}</div>
  <div class="grid two mt"><div class="card"><h3>Evolução acumulada · 14 dias</h3>${lineChart(subs)}${leg}</div>
  <div class="card"><h3>Horas por dia · 7 dias</h3>${barChart(subs)}${leg}</div></div>
  <div class="card mt"><h3>Progresso por matéria</h3>${subs.map((s) => `<button class="pr" style="--c:${s.color}" data-act="subj" data-id="${s.id}"><i class="dot"></i><span class="grow">${esc(s.name)}</span><div class="bar"><div class="fill" style="width:${Stats.pct(s.id)}%"></div></div><em>${Stats.pct(s.id)}% · ${hrs(Stats.total(s.id))}</em></button>`).join("")}</div></div>`;
}

function Subj() {
  const s = sub(),
    pend = Stats.tasks(s.id).filter((t) => !t.done).length;
  return `<div class="wrap" style="--c:${s.color}">${pageTop(`<i class="dot big"></i>${esc(s.name)}`, "", `<button class="btn ghost" data-act="edit" data-id="${s.id}">Editar</button>`)}
  <div class="grid kpis">${kpi("Horas estudadas", hrs(Stats.total(s.id)))}${kpi("Progresso", Stats.pct(s.id) + "%")}${kpi("Tarefas pendentes", pend)}</div>
  <div class="card mt"><h3>Horas por dia · 14 dias</h3>${barChart([s], 14)}</div>
  <div class="tabs mt"><button class="${S.tab === "tasks" ? "on" : ""}" data-act="tab" data-v="tasks">Tarefas</button><button class="${S.tab === "logs" ? "on" : ""}" data-act="tab" data-v="logs">Registros de estudo</button></div>
  ${S.tab === "tasks" ? Tasks(s) : Logs(s)}</div>`;
}
function Tasks(s) {
  const F = { all: "Todas", pending: "Pendentes", done: "Concluídas", late: "Atrasadas" };
  const L = Stats.tasks(s.id)
    .filter((t) => ({ all: 1, pending: !t.done, done: t.done, late: Stats.late(t) })[S.filter])
    .sort((a, b) => a.done - b.done || ((a.due || "9") < (b.due || "9") ? -1 : 1));
  return `<div class="card frm" data-form><input id="tt" placeholder="Nova tarefa…" maxlength="120"><input id="td" type="date"><button class="btn" data-act="addTask">Adicionar</button></div>
  <div class="chips">${Object.entries(F)
    .map(
      ([k, v]) =>
        `<button class="${S.filter === k ? "on" : ""}" data-act="filter" data-v="${k}">${v}</button>`,
    )
    .join("")}</div>
  <div class="card">${L.map((t) => `<div class="li ${t.done ? "done" : ""}"><button class="chk" data-act="toggle" data-id="${t.id}">${t.done ? "✓" : ""}</button><span class="t">${esc(t.title)}</span>${t.due ? `<span class="due ${Stats.late(t) ? "late" : ""}">${Stats.late(t) ? "Atrasada · " : ""}${fmt(t.due)}</span>` : ""}<button class="x" data-act="rmTask" data-id="${t.id}">✕</button></div>`).join("") || '<div class="empty">Nenhuma tarefa neste filtro.</div>'}</div>`;
}
function Logs(s) {
  const L = S.logs
    .filter((l) => l.subjectId === s.id)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  return `<div class="card frm" data-form><input id="ld" type="date" value="${today()}"><input id="lm" type="number" min="1" placeholder="Minutos" style="width:110px"><input id="lc" placeholder="O que você estudou?" maxlength="160"><button class="btn" data-act="addLog">Registrar</button></div>
  <div class="card">${L.map((l) => `<div class="li"><span class="due">${fmt(l.date)}</span><span class="t">${esc(l.content || "Sessão de estudo")}</span><b style="color:var(--c)">${hh(l.minutes)}</b><button class="x" data-act="rmLog" data-id="${l.id}">✕</button></div>`).join("") || '<div class="empty">Nenhum registro ainda — eles alimentam os gráficos.</div>'}</div>`;
}

function renderModal(open) {
  const m = S.modal,
    el = $("#modal");
  if (!m) {
    el.className = "";
    el.innerHTML = "";
    return;
  }
  el.className = "show" + (open ? " open" : "");
  el.innerHTML = `<div class="scrim" data-act="close"></div><div class="dlg" style="--c:${m.color}"><h3>${m.id ? "Editar matéria" : "Nova matéria"}</h3><input id="mn" placeholder="Nome da matéria" maxlength="40" value="${esc(m.name)}"><div class="sw">${PAL.map((c) => `<button class="swc ${c === m.color ? "on" : ""}" style="background:${c}" data-act="swatch" data-c="${c}"></button>`).join("")}</div><div class="acts">${m.id ? `<button class="btn danger" data-act="del">${m.confirm ? "Confirmar exclusão" : "Excluir"}</button>` : ""}<span class="grow"></span><button class="btn ghost" data-act="close">Cancelar</button><button class="btn" data-act="save">Salvar</button></div></div>`;
  if (open) $("#mn").focus();
}
function render(anim) {
  $("#side").innerHTML = Side();
  const m = $("#main");
  if (anim !== undefined) m.className = anim ? "anim" : "";
  m.innerHTML = S.view === "subject" && sub() ? Subj() : Dash();
  if (S.view === "subject" && !sub()) S.view = "dash";
  renderModal();
}
async function sync(anim) {
  [S.subjects, S.tasks, S.logs] = await Promise.all([
    repos.subjects.all(),
    repos.tasks.all(),
    repos.logs.all(),
  ]);
  render(anim);
}
