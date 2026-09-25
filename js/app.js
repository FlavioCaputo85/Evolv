/* ---------- init ---------- */
(async () => {
  try {
    const t = localStorage.getItem("foco:theme");
    if (t) document.documentElement.dataset.theme = t;
  } catch {}
  await seed();
  await sync(true);
})();

/* Mostra erros de carregamento na tela em vez de uma página vazia */
window.addEventListener("error", (e) => {
  const m = document.getElementById("main");
  if (m && !m.innerHTML.trim()) {
    m.textContent = "Erro ao carregar: " + e.message;
  }
});
