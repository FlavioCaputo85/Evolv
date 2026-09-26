(async () => {
  initTheme();
  await ensureSubjects();
  await seedSampleData();
  [S.subjects, S.tasks, S.logs] = await Promise.all([repos.subjects.all(), repos.tasks.all(), repos.logs.all()]);

  const stat = document.querySelectorAll('.stat b');
  if (stat[0]) { stat[0].dataset.count = Stats.total().toFixed(1); stat[0].dataset.dec = '1'; }
  if (stat[1]) { stat[1].dataset.count = String(S.tasks.filter(t => t.done).length); }
  if (stat[2]) { stat[2].dataset.count = String(SUBJECTS.length); }

  initNav();
  initReveal();
})();
