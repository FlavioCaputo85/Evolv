const kpi = (l, v, c) => `<div class="card kpi"><span>${l}</span><b ${c ? `style="color:${c}"` : ''}>${v}</b></div>`;

async function loadData() {
  [S.subjects, S.tasks, S.logs] = await Promise.all([repos.subjects.all(), repos.tasks.all(), repos.logs.all()]);
}

function renderDashboard() {
  const subs = S.subjects, T = Stats.tasks(), done = T.filter(t => t.done).length, late = T.filter(Stats.late).length;
  const wk = Stats.days(7).reduce((a, d) => a + subs.reduce((b, s) => b + Stats.mins(s.id, d), 0), 0) / 60;
  const leg = `<div class="leg">${subs.map(s => `<span><i class="dot" style="--c:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`;

  $('#main').innerHTML = `
    <div class="page-head"><div><h1>Visão geral</h1><p>Evolução real, calculada a partir das suas tarefas e horas.</p></div></div>
    <div class="grid kpis">${kpi('Horas totais', hrs(Stats.total()))}${kpi('Últimos 7 dias', hrs(wk))}${kpi('Tarefas concluídas', done + '/' + T.length)}${kpi('Atrasadas', late, late ? 'var(--bad)' : '')}</div>
    <div class="grid two mt">
      <div class="card"><h3>Evolução acumulada · 14 dias</h3>${lineChart(subs)}${leg}</div>
      <div class="card"><h3>Horas por dia · 7 dias</h3>${barChart(subs)}${leg}</div>
    </div>
    <div class="card mt">
      <h3>Disciplinas</h3>
      <div class="subj-grid-app mt">${subs.map(s => `
        <a class="subj-card-app" href="subject.html?s=${s.id}" style="--c:${s.color}">
          <div class="badge" style="background:${s.color}">${s.code}</div>
          <h3>${esc(s.name)}</h3>
          <div class="bar"><div class="fill" style="width:${Stats.pct(s.id)}%"></div></div>
          <div class="meta"><span>${Stats.pct(s.id)}% concluído</span><span>${hrs(Stats.total(s.id))}</span></div>
        </a>`).join('')}</div>
    </div>`;
  $('#main').classList.add('anim');
}

(async () => {
  initTheme();
  await ensureSubjects();
  await seedSampleData();
  await loadData();
  renderDashboard();
  initNav();
  initReveal();
})();
