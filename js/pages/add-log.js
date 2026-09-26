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
  $('#date').value = today();

  $('#logForm').addEventListener('submit', async e => {
    e.preventDefault();
    const minutes = parseInt($('#minutes').value, 10);
    if (!(minutes > 0)) return $('#minutes').focus();
    await Services.logs.create({ subjectId: s.id, date: $('#date').value || today(), minutes, content: $('#content').value.trim() });
    location.href = 'subject.html?s=' + s.id;
  });

  initNav();
  initReveal();
})();
