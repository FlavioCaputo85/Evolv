/* ---------- 1. DATABASE ---------- */
const mem = {};
const LocalAdapter = {
  read(t) {
    if (mem[t]) return mem[t];
    try {
      mem[t] = JSON.parse(localStorage.getItem("foco:" + t)) || [];
    } catch {
      mem[t] = [];
    }
    return mem[t];
  },
  write(t, rows) {
    mem[t] = rows;
    try {
      localStorage.setItem("foco:" + t, JSON.stringify(rows));
    } catch {}
  },
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const Repo = (t, a = LocalAdapter) => ({
  async all() {
    return [...a.read(t)];
  },
  async create(d) {
    const x = { id: uid(), createdAt: Date.now(), ...d };
    a.write(t, [...a.read(t), x]);
    return x;
  },
  async update(id, p) {
    a.write(
      t,
      a.read(t).map((x) => (x.id === id ? { ...x, ...p } : x)),
    );
  },
  async remove(id) {
    a.write(
      t,
      a.read(t).filter((x) => x.id !== id),
    );
  },
  async removeWhere(f) {
    a.write(
      t,
      a.read(t).filter((x) => !f(x)),
    );
  },
});
const repos = { subjects: Repo("subjects"), tasks: Repo("tasks"), logs: Repo("logs") };
