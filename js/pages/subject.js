let TAB = 'tasks', FILTER = 'all';
const kpi = (l, v) => `<div class="card kpi"><span>${l}</span><b>${v}</b></div>`;

async function loadData(userId) {
  const [allSubjects, allTasks, allLogs] = await Promise.all([repos.subjects.all(), repos.tasks.all(), repos.logs.all()]);
  S.subjects = allSubjects.filter(s => s.userId === userId);
  const ids = new Set(S.subjects.map(s => s.id));
  S.tasks = allTasks.filter(t => ids.has(t.subjectId));
  S.logs = allLogs.filter(l => ids.has(l.subjectId));
}

function renderTasks(s) {
  const F = { all: 'Todas', pending: 'Pendentes', done: 'Concluídas', late: 'Atrasadas' };
  const L = Stats.tasks(s.id)
    .filter(t => ({ all: 1, pending: !t.done, done: t.done, late: Stats.late(t) }[FILTER]))
    .sort((a, b) => (a.done - b.done) || ((a.due || '9') < (b.due || '9') ? -1 : 1));
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <div class="chips" style="margin:0">${Object.entries(F).map(([k, v]) => `<button class="${FILTER === k ? 'on' : ''}" data-act="filter" data-v="${k}">${v}</button>`).join('')}</div>
      <a class="btn" style="--c:${s.color}" href="add-task.html?s=${s.id}">+ Nova tarefa</a>
    </div>
    <div class="card list-card">${L.map(t => `<div class="li ${t.done ? 'done' : ''}"><button class="chk" style="--c:${s.color}" data-act="toggle" data-id="${t.id}">${t.done ? '✓' : ''}</button><span class="t">${esc(t.title)}</span>${t.due ? `<span class="due ${Stats.late(t) ? 'late' : ''}">${Stats.late(t) ? 'Atrasada · ' : ''}${fmt(t.due)}</span>` : ''}<button class="x" data-act="rmTask" data-id="${t.id}">✕</button></div>`).join('') || '<div class="empty">Nenhuma tarefa neste filtro.</div>'}</div>`;
}
function renderLogs(s) {
  const L = S.logs.filter(l => l.subjectId === s.id).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  return `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px">
      <a class="btn" style="--c:${s.color}" href="add-log.html?s=${s.id}">+ Novo registro</a>
    </div>
    <div class="card list-card">${L.map(l => `<div class="li"><span class="due">${fmt(l.date)}</span><span class="t">${esc(l.content || 'Sessão de estudo')}</span><b style="color:${s.color}">${hh(l.minutes)}</b><button class="x" data-act="rmLog" data-id="${l.id}">✕</button></div>`).join('') || '<div class="empty">Nenhum registro ainda — eles alimentam os gráficos.</div>'}</div>`;
}

function render() {
  const s = subjectById(qs('s'));
  if (!s) { $('#main').innerHTML = `<div class="empty">Disciplina não encontrada. <a href="dashboard.html">Voltar ao painel</a></div>`; return; }
  const pend = Stats.tasks(s.id).filter(t => !t.done).length;
  $('#main').innerHTML = `
    <a class="back-link" href="dashboard.html">‹ Painel</a>
    <div class="page-head">
      <div><h1><span class="dot big" style="--c:${s.color}"></span>${esc(s.name)}</h1><p>${esc(s.blurb || '')}</p></div>
      <a class="btn ghost" href="edit-subject.html?s=${s.id}">Editar</a>
    </div>
    <div class="grid kpis">${kpi('Horas estudadas', hrs(Stats.total(s.id)))}${kpi('Progresso', Stats.pct(s.id) + '%')}${kpi('Tarefas pendentes', pend)}</div>
    <div class="card mt"><h3>Horas por dia · 14 dias</h3>${barChart([s], 14)}</div>
    <div class="tabs mt">
      <a class="${TAB === 'tasks' ? 'on' : ''}" data-act="tab" data-v="tasks" href="javascript:void(0)">Tarefas</a>
      <a class="${TAB === 'logs' ? 'on' : ''}" data-act="tab" data-v="logs" href="javascript:void(0)">Registros de estudo</a>
    </div>
    ${TAB === 'tasks' ? renderTasks(s) : renderLogs(s)}`;
  $('#main').classList.add('anim');
}
async function refresh(userId) { await loadData(userId); render(); }

document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'tab') { TAB = el.dataset.v; render(); }
  else if (act === 'filter') { FILTER = el.dataset.v; render(); }
  else if (act === 'toggle') { const t = S.tasks.find(x => x.id === el.dataset.id); await Services.tasks.toggle(t.id, !t.done); await refresh(S.user.id); }
  else if (act === 'rmTask') { await Services.tasks.remove(el.dataset.id); await refresh(S.user.id); }
  else if (act === 'rmLog') { await Services.logs.remove(el.dataset.id); await refresh(S.user.id); }
});

(async () => {
  initTheme();
  const user = await requireAuth();
  if (!user) return;
  await initNav();
  await refresh(user.id);
  initReveal();
})();
