/* ---------- helpers de data ---------- */
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const today = () => iso(new Date());
const fmt = (s) => (s ? s.split("-").reverse().slice(0, 2).join("/") : "");
const hrs = (v) => Math.round(v * 10) / 10 + "h";
const hh = (m) =>
  m >= 60 ? Math.floor(m / 60) + "h" + (m % 60 ? String(m % 60).padStart(2, "0") : "") : m + "min";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const $ = (s) => document.querySelector(s);
