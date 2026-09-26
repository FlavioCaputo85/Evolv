const Stats = {
  days: n => Array.from({ length: n }, (_, i) => iso(addDays(new Date(), i - n + 1))),
  mins: (sid, d) => S.logs.filter(l => l.subjectId === sid && l.date === d).reduce((a, l) => a + l.minutes, 0),
  total: sid => S.logs.filter(l => !sid || l.subjectId === sid).reduce((a, l) => a + l.minutes, 0) / 60,
  tasks: sid => S.tasks.filter(t => !sid || t.subjectId === sid),
  pct(sid) { const t = this.tasks(sid); return t.length ? Math.round(t.filter(x => x.done).length / t.length * 100) : 0; },
  late: t => !t.done && t.due && t.due < today()
};

async function seedSampleData() {
  if (LocalAdapter.read('seeded').length) return;
  LocalAdapter.write('seeded', [1]);
  const SAMPLE_TASKS = {
    algoritmo: ['Lista de recursividade', 'Revisar complexidade (Big O)', 'Implementar busca binária'],
    bd: ['Modelo ER do projeto', 'Exercícios de JOIN', 'Normalização até 3FN'],
    ti: ['Resumo de redes de computadores', 'Ler sobre segurança da informação'],
    arqcomp: ['Estudar pipeline de instruções', 'Exercícios de memória cache'],
    so: ['Resumo de escalonamento de processos', 'Exercícios de gerência de memória']
  };
  const notes = ['Exercícios e revisão', 'Leitura e resumo', 'Prática guiada', 'Fixação de conteúdo'];
  for (const [i, def] of SUBJECTS.entries()) {
    const titles = SAMPLE_TASKS[def.id] || ['Revisar conteúdo', 'Fazer exercícios'];
    for (const [k, title] of titles.entries())
      await Services.tasks.create({ subjectId: def.id, title, due: iso(addDays(new Date(), k * 2 - 1)), done: k === 0 });
    for (let k = 0; k < 12; k++) {
      if ((k + i) % 3 === 0) continue;
      await Services.logs.create({ subjectId: def.id, date: iso(addDays(new Date(), -k)), minutes: 30 + ((k * 37 + i * 23) % 75), content: notes[(k + i) % 4] });
    }
  }
}
