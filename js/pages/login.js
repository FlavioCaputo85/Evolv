(async () => {
  initTheme();
  await initNav();
  initReveal();

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('#formError').textContent = '';
    try {
      await Auth.login($('#email').value, $('#password').value);
      const next = qs('next');
      location.href = next ? next : 'dashboard.html';
    } catch (err) {
      $('#formError').textContent = err.message;
    }
  });
})();
