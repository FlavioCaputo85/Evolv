/* ---------- 2. SERVICES ---------- */
const Services = {
  subjects: {
    create: (d) => repos.subjects.create(d),
    update: (id, p) => repos.subjects.update(id, p),
    async remove(id) {
      await repos.subjects.remove(id);
      await repos.tasks.removeWhere((t) => t.subjectId === id);
      await repos.logs.removeWhere((l) => l.subjectId === id);
    },
  },
  tasks: {
    create: (d) => repos.tasks.create({ done: false, ...d }),
    toggle: (id, done) => repos.tasks.update(id, { done }),
    remove: (id) => repos.tasks.remove(id),
  },
  logs: { create: (d) => repos.logs.create(d), remove: (id) => repos.logs.remove(id) },
};
