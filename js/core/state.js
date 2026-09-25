/* ---------- estado ---------- */
const S = {
  subjects: [],
  tasks: [],
  logs: [],
  view: "dash",
  sid: null,
  tab: "tasks",
  filter: "all",
  modal: null,
};
const PAL = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#8b5cf6",
  "#84cc16",
  "#f97316",
  "#14b8a6",
];
const sub = () => S.subjects.find((s) => s.id === S.sid);
