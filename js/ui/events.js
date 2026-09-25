/* ---------- eventos ---------- */
const val = (id) => ($("#" + id) || {}).value || "";
const H = {
  menu: () => $("#side").classList.toggle("open"),
  dash: () => {
    S.view = "dash";
    $("#side").classList.remove("open");
    render(true);
  },
  subj: (el) => {
    S.view = "subject";
    S.sid = el.dataset.id;
    S.tab = "tasks";
    S.filter = "all";
    $("#side").classList.remove("open");
    render(true);
  },
  tab: (el) => {
    S.tab = el.dataset.v;
    render(true);
  },
  filter: (el) => {
    S.filter = el.dataset.v;
    render(false);
  },
  new: () => {
    S.modal = { name: "", color: PAL[S.subjects.length % PAL.length] };
    renderModal(true);
  },
  edit: (el) => {
    const s = S.subjects.find((x) => x.id === el.dataset.id);
    S.modal = { id: s.id, name: s.name, color: s.color };
    renderModal(true);
  },
  close: () => {
    S.modal = null;
    renderModal();
  },
  swatch: (el) => {
    S.modal.name = val("mn");
    S.modal.color = el.dataset.c;
    renderModal();
  },
  async save() {
    const name = val("mn").trim();
    if (!name) return $("#mn").focus();
    const m = S.modal;
    S.modal = null;
    if (m.id) await Services.subjects.update(m.id, { name, color: m.color });
    else {
      const n = await Services.subjects.create({ name, color: m.color });
      S.view = "subject";
      S.sid = n.id;
      S.tab = "tasks";
      S.filter = "all";
    }
    await sync(true);
  },
  async del() {
    if (!S.modal.confirm) {
      S.modal.name = val("mn");
      S.modal.confirm = true;
      return renderModal();
    }
    const id = S.modal.id;
    S.modal = null;
    await Services.subjects.remove(id);
    if (S.sid === id) S.view = "dash";
    await sync(true);
  },
  async addTask() {
    const title = val("tt").trim();
    if (!title) return $("#tt").focus();
    await Services.tasks.create({ subjectId: S.sid, title, due: val("td") || null });
    await sync(false);
    $("#tt").focus();
  },
  async toggle(el) {
    const t = S.tasks.find((x) => x.id === el.dataset.id);
    await Services.tasks.toggle(t.id, !t.done);
    await sync(false);
  },
  async rmTask(el) {
    await Services.tasks.remove(el.dataset.id);
    await sync(false);
  },
  async addLog() {
    const minutes = parseInt(val("lm"), 10);
    if (!(minutes > 0)) return $("#lm").focus();
    await Services.logs.create({
      subjectId: S.sid,
      date: val("ld") || today(),
      minutes,
      content: val("lc").trim(),
    });
    await sync(false);
    $("#lm").focus();
  },
  async rmLog(el) {
    await Services.logs.remove(el.dataset.id);
    await sync(false);
  },
  theme() {
    const r = document.documentElement,
      dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    r.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem("foco:theme", r.dataset.theme);
    } catch {}
  },
};
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (el && H[el.dataset.act]) H[el.dataset.act](el);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && S.modal) return H.close();
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    if (e.target.id === "mn") return H.save();
    const b = e.target.closest("[data-form]")?.querySelector(".btn");
    if (b) b.click();
  }
});
