let selectedCourse = null;
function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
(async () => {
  initTheme();
  const user = await requireAuth();
  if (!user) return;
  await initNav();
  initReveal();

  $('#name').value = user.name || '';
  $('#email').value = user.email || '';
  $('#course').value = user.courseLabel || '';
  if (user.photo) $('#photoPreview').innerHTML = `<img src="${user.photo}" alt="">`;
  else $('#photoPreview').textContent = (user.name || '?').trim()[0]?.toUpperCase() || '?';

  initCourseAutocomplete($('#course'), $('#courseSuggestions'), $('#courseCode'), c => { selectedCourse = c; });

  $('#photo').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    const dataUrl = await readPhoto(file);
    $('#photoPreview').innerHTML = `<img src="${dataUrl}" alt="">`;
    $('#photoPreview').dataset.value = dataUrl;
  });

  $('#profileForm').addEventListener('submit', async e => {
    e.preventDefault();
    const patch = { name: $('#name').value.trim() };
    if (selectedCourse) { patch.course = selectedCourse.code; patch.courseLabel = selectedCourse.name; }
    if ($('#photoPreview').dataset.value) patch.photo = $('#photoPreview').dataset.value;
    await Auth.updateProfile(user.id, patch);
    $('#saved').textContent = 'Alterações salvas.';
    setTimeout(() => $('#saved').textContent = '', 2500);
  });
})();
