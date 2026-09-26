function lineChart(subs, n = 14) {
  const days = Stats.days(n), W = 640, H = 220, L = 34, R = 10, T = 10, B = 24;
  const ser = subs.map(s => {
    let c = S.logs.filter(l => l.subjectId === s.id && l.date < days[0]).reduce((a, l) => a + l.minutes, 0) / 60;
    return { s, v: days.map(d => c += Stats.mins(s.id, d) / 60) };
  });
  const max = Math.max(1, ...ser.flatMap(x => x.v)), X = i => L + i * (W - L - R) / (n - 1), Y = v => H - B - v / max * (H - T - B);
  const grid = [0, .5, 1].map(f => `<line class="gl" x1="${L}" x2="${W - R}" y1="${Y(max * f)}" y2="${Y(max * f)}"/><text class="tx" x="${L - 6}" y="${Y(max * f) + 4}" text-anchor="end">${(max * f).toFixed(max < 4 ? 1 : 0)}h</text>`).join('');
  const xl = days.map((d, i) => i % 3 === (n - 1) % 3 ? `<text class="tx" x="${X(i)}" y="${H - 4}" text-anchor="middle">${fmt(d)}</text>` : '').join('');
  const paths = ser.map(({ s, v }) => `<path class="ln" pathLength="1" stroke="${s.color}" d="M${v.map((y, i) => X(i) + ' ' + Y(y)).join('L')}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${grid}${xl}${paths}</svg>`;
}
function barChart(subs, n = 7) {
  const days = Stats.days(n), W = 640, H = 200, L = 34, B = 24, T = 8;
  const tot = days.map(d => subs.reduce((a, s) => a + Stats.mins(s.id, d), 0)), max = Math.max(60, ...tot), bw = (W - L) / n, Y = m => m / max * (H - B - T), step = Math.ceil(n / 7);
  const grid = [0, .5, 1].map(f => { const y = H - B - Y(max * f); return `<line class="gl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text class="tx" x="${L - 6}" y="${y + 4}" text-anchor="end">${(max * f / 60).toFixed(1)}h</text>`; }).join('');
  const bars = days.map((d, i) => {
    let acc = 0;
    return subs.map(s => {
      const m = Stats.mins(s.id, d); if (!m) return '';
      const h = Y(m), y = H - B - acc - h; acc += h;
      return `<rect class="bx" x="${L + i * bw + bw * .2}" y="${y}" width="${bw * .6}" height="${h}" rx="4" fill="${s.color}" style="animation-delay:${i * 40}ms"><title>${esc(s.name)}: ${hh(m)}</title></rect>`;
    }).join('') + (i % step === (n - 1) % step ? `<text class="tx" x="${L + i * bw + bw / 2}" y="${H - 4}" text-anchor="middle">${fmt(d)}</text>` : '');
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${grid}${bars}</svg>`;
}
