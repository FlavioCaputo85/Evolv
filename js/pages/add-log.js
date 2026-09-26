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
  $('#date').value = today();

  $('#logForm').addEventListener('submit', async e => {
    e.preventDefault();
    const minutes = parseInt($('#minutes').value, 10);
    if (!(minutes > 0)) return $('#minutes').focus();
    await Services.logs.create({ subjectId: s.id, date: $('#date').value || today(), minutes, content: $('#content').value.trim() });
    location.href = 'subject.html?s=' + s.id;
  });
})();
