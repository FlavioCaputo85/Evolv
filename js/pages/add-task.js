function renderContext(s) {
  $('#subjectCtx').innerHTML = `<div class="badge" style="background:${s.color}">${s.code}</div><b>${esc(s.name)}</b>`;
}
(async () => {
  initTheme();
  await ensureSubjects();
  const subs = await repos.subjects.all();
  let s = subs.find(x => x.id === qs('s')) || subs[0] || SUBJECTS[0];

  $('#subjectSelect').innerHTML = SUBJECTS.map(x => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');
  renderContext(s);
  $('#subjectSelect').addEventListener('change', e => { s = subjectById(e.target.value); renderContext(s); });

  $('#taskForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = $('#title').value.trim();
    if (!title) return $('#title').focus();
    await Services.tasks.create({ subjectId: s.id, title, due: $('#due').value || null });
    location.href = 'subject.html?s=' + s.id;
  });

  initNav();
  initReveal();
})();
