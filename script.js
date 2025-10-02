const API_URL = 'https://jsonplaceholder.typicode.com/users';
const usersEl = document.getElementById('users');
const statusEl = document.getElementById('status');
const reloadBtn = document.getElementById('reload');

async function fetchUsers() {
  usersEl.innerHTML = '';
  statusEl.textContent = 'Loading...';
  reloadBtn.disabled = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();
    if (!Array.isArray(users)) throw new Error('Unexpected response');
    renderUsers(users);
    statusEl.textContent = `Loaded ${users.length} users.`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error: ${err.message}`;
    usersEl.innerHTML = `<p class="error">Could not load users — check your network or the console.</p>`;
  } finally {
    reloadBtn.disabled = false;
  }
}

function renderUsers(users) {
  usersEl.innerHTML = users.map(u => {
    const addr = `${u.address.street}, ${u.address.suite}, ${u.address.city} - ${u.address.zipcode}`;
    return `<article class="user-card">
      <h2>${escapeHtml(u.name)}</h2>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(u.email)}">${escapeHtml(u.email)}</a></p>
      <p><strong>Address:</strong> ${escapeHtml(addr)}</p>
    </article>`;
  }).join('');
}

// small helper to avoid HTML injection (good practice)
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

reloadBtn.addEventListener('click', fetchUsers);
document.addEventListener('DOMContentLoaded', fetchUsers);
