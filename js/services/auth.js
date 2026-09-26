async function sha256(text) {
  if (window.crypto && window.crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) { h = (h * 31 + text.charCodeAt(i)) >>> 0; }
  return 'fallback' + h.toString(16);
}
function setSession(userId) { try { localStorage.setItem('evolv:session', userId); } catch {} }
function clearSession() { try { localStorage.removeItem('evolv:session'); } catch {} }
function sessionUserId() { try { return localStorage.getItem('evolv:session'); } catch { return null; } }

const Auth = {
  async signup({ name, email, password, course, courseLabel, photo }) {
    const users = await repos.users.all();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('Já existe uma conta com este e-mail.');
    const passwordHash = await sha256(password);
    const user = await repos.users.create({ name: name.trim(), email: email.trim(), passwordHash, course: course || null, courseLabel: courseLabel || null, photo: photo || null });
    setSession(user.id);
    return user;
  },
  async login(email, password) {
    const users = await repos.users.all();
    const passwordHash = await sha256(password);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === passwordHash);
    if (!user) throw new Error('E-mail ou senha incorretos.');
    setSession(user.id);
    return user;
  },
  logout() { clearSession(); },
  async currentUser() {
    const id = sessionUserId();
    if (!id) return null;
    const users = await repos.users.all();
    return users.find(u => u.id === id) || null;
  },
  async updateProfile(id, patch) { await repos.users.update(id, patch); }
};

async function requireAuth() {
  const u = await Auth.currentUser();
  if (!u) {
    const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
    location.href = 'login.html?next=' + next;
    return null;
  }
  S.user = u;
  return u;
}
