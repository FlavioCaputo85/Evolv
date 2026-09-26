const mem = {};
const LocalAdapter = {
  read(t) {
    if (mem[t]) return mem[t];
    try { mem[t] = JSON.parse(localStorage.getItem('evolv:' + t)) || []; }
    catch { mem[t] = []; }
    return mem[t];
  },
  write(t, rows) {
    mem[t] = rows;
    try { localStorage.setItem('evolv:' + t, JSON.stringify(rows)); } catch {}
  }
};

const Repo = (t, a = LocalAdapter) => ({
  async all() { return [...a.read(t)]; },
  async create(d) { const x = { id: d.id || uid(), createdAt: Date.now(), ...d }; a.write(t, [...a.read(t), x]); return x; },
  async update(id, p) { a.write(t, a.read(t).map(x => x.id === id ? { ...x, ...p } : x)); },
  async remove(id) { a.write(t, a.read(t).filter(x => x.id !== id)); }
});

const repos = { subjects: Repo('subjects'), tasks: Repo('tasks'), logs: Repo('logs') };

async function ensureSubjects() {
  const existing = await repos.subjects.all();
  const have = new Set(existing.map(s => s.id));
  for (const def of SUBJECTS) if (!have.has(def.id)) await repos.subjects.create({ ...def });
}
