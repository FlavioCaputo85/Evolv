/* ---------- 3. STATS ---------- */
const Stats = {
  days: (n) => Array.from({ length: n }, (_, i) => iso(addDays(new Date(), i - n + 1))),
  mins: (sid, d) =>
    S.logs.filter((l) => l.subjectId === sid && l.date === d).reduce((a, l) => a + l.minutes, 0),
  total: (sid) => S.logs.filter((l) => !sid || l.subjectId === sid).reduce((a, l) => a + l.minutes, 0) / 60,
  tasks: (sid) => S.tasks.filter((t) => !sid || t.subjectId === sid),
  pct(sid) {
    const t = this.tasks(sid);
    return t.length ? Math.round((t.filter((x) => x.done).length / t.length) * 100) : 0;
  },
  late: (t) => !t.done && t.due && t.due < today(),
};
