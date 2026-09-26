let chosenColor = PALETTE[0];
function renderSwatches() {
  $('#swatches').innerHTML = PALETTE.map(c => `<button type="button" class="swatch ${c === chosenColor ? 'on' : ''}" style="background:${c}" data-c="${c}"></button>`).join('');
}
(async () => {
  initTheme();
  const user = await requireAuth();
  if (!user) return;
  await initNav();
  initReveal();

  const all = await repos.subjects.all();
  const s = all.find(x => x.id === qs('s') && x.userId === user.id);
  if (!s) { location.href = 'dashboard.html'; return; }

  chosenColor = s.color;
  $('#name').value = s.name;
  $('#blurb').value = s.blurb || '';
  renderSwatches();
  $('#swatches').addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    chosenColor = b.dataset.c;
    renderSwatches();
  });

  $('#subjectForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#name').value.trim();
    if (!name) return $('#name').focus();
    await Services.subjects.update(s.id, { name, color: chosenColor, code: subjectCode(name), blurb: $('#blurb').value.trim() });
    location.href = 'subject.html?s=' + s.id;
  });

  $('#deleteBtn').addEventListener('click', async () => {
    if (!confirm('Excluir "' + s.name + '"? As tarefas e registros dessa disciplina também serão apagados.')) return;
    await Services.subjects.remove(s.id);
    location.href = 'dashboard.html';
  });
})();
