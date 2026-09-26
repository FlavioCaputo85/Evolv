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
  await initNav();
  initReveal();

  initCourseAutocomplete($('#course'), $('#courseSuggestions'), $('#courseCode'), c => { selectedCourse = c; });

  $('#photo').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    const dataUrl = await readPhoto(file);
    $('#photoPreview').innerHTML = `<img src="${dataUrl}" alt="">`;
    $('#photoPreview').dataset.value = dataUrl;
  });

  $('#signupForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('#formError').textContent = '';
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const password = $('#password').value;
    const confirm = $('#confirm').value;
    if (!name || !email || !password) { $('#formError').textContent = 'Preencha nome, e-mail e senha.'; return; }
    if (password.length < 6) { $('#formError').textContent = 'A senha precisa ter pelo menos 6 caracteres.'; return; }
    if (password !== confirm) { $('#formError').textContent = 'As senhas não coincidem.'; return; }

    try {
      const user = await Auth.signup({
        name, email, password,
        course: selectedCourse ? selectedCourse.code : null,
        courseLabel: selectedCourse ? selectedCourse.name : ($('#course').value.trim() || null),
        photo: $('#photoPreview').dataset.value || null
      });
      if (selectedCourse && $('#autoCreate').checked) await createCourseSubjects(user.id, selectedCourse);
      location.href = 'dashboard.html';
    } catch (err) {
      $('#formError').textContent = err.message;
    }
  });
})();
