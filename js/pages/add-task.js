function renderContext(s) {
  $('#subjectCtx').innerHTML = `<div class="badge" style="background:${s.color}">${s.code}</div><b>${esc(s.name)}</b>`;
}
(async () => {
  initTheme();
  const user = await requireAuth();
  if (!user) return;
  await initNav();
  initReveal();

  const all = await repos.subjects.all();
  const mySubjects = all.filter(x => x.userId === user.id);
  if (!mySubjects.length) { location.href = 'add-subject.html'; return; }
  let s = mySubjects.find(x => x.id === qs('s')) || mySubjects[0];

  $('#subjectSelect').innerHTML = mySubjects.map(x => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('');
  renderContext(s);
  $('#subjectSelect').addEventListener('change', e => { s = mySubjects.find(x => x.id === e.target.value); renderContext(s); });

  $('#taskForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = $('#title').value.trim();
    if (!title) return $('#title').focus();
    await Services.tasks.create({ subjectId: s.id, title, due: $('#due').value || null });
    location.href = 'subject.html?s=' + s.id;
  });
})();
