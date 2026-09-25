/* ---------- dados de exemplo (apenas na 1ª visita) ---------- */
async function seed() {
  if (LocalAdapter.read("seeded").length || (await repos.subjects.all()).length) return;
  LocalAdapter.write("seeded", [1]);
  const defs = [
    ["Matemática", PAL[0], ["Lista de derivadas", "Revisar limites", "Simulado de álgebra"]],
    ["História", PAL[2], ["Resumo da Revolução Francesa", "Ler capítulo 4"]],
    ["Programação", PAL[3], ["Projeto API REST", "Algoritmos de ordenação", "Praticar SQL"]],
  ];
  const notes = ["Exercícios e revisão", "Leitura e resumo", "Prática guiada"];
  for (const [i, [name, color, tasks]] of defs.entries()) {
    const s = await Services.subjects.create({ name, color });
    for (const [k, title] of tasks.entries())
      await Services.tasks.create({
        subjectId: s.id,
        title,
        due: iso(addDays(new Date(), k * 2 - 1)),
        done: k === 0,
      });
    for (let k = 0; k < 13; k++) {
      if ((k + i) % 3 === 0) continue;
      await Services.logs.create({
        subjectId: s.id,
        date: iso(addDays(new Date(), -k)),
        minutes: 30 + ((k * 37 + i * 23) % 75),
        content: notes[(k + i) % 3],
      });
    }
  }
}
