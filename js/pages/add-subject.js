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
    await Services.subjects.create({ userId: user.id, name, color: chosenColor, code: subjectCode(name), blurb: $('#blurb').value.trim() });
    location.href = 'dashboard.html';
  });
})();
