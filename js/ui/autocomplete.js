function initCourseAutocomplete(inputEl, listEl, hiddenEl, onSelect) {
  function renderList(items) {
    if (!items.length) { listEl.classList.remove('open'); listEl.innerHTML = ''; return; }
    listEl.innerHTML = items.map(c => `<button type="button" class="suggest-item" data-code="${c.code}"><b>${esc(c.code)}</b><span>${esc(c.name)}</span></button>`).join('');
    listEl.classList.add('open');
  }
  inputEl.addEventListener('input', () => {
    hiddenEl.value = '';
    renderList(findCourses(inputEl.value));
  });
  inputEl.addEventListener('focus', () => { if (inputEl.value.trim()) renderList(findCourses(inputEl.value)); });
  listEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-code]'); if (!btn) return;
    const course = courseByCode(btn.dataset.code);
    inputEl.value = course.name;
    hiddenEl.value = course.code;
    listEl.classList.remove('open'); listEl.innerHTML = '';
    if (onSelect) onSelect(course);
  });
  document.addEventListener('click', e => { if (!listEl.contains(e.target) && e.target !== inputEl) { listEl.classList.remove('open'); } });
}
