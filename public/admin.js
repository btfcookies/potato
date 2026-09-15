const loginDiv = document.getElementById('login');
const panelDiv = document.getElementById('panel');
const loginMsg = document.getElementById('login-msg');
const panelMsg = document.getElementById('panel-msg');
const bannedList = document.getElementById('banned-list');

function setPanelMsg(text, isError) {
  panelMsg.textContent = text || 'undefined';
  panelMsg.className = 'msg ' + (isError ? 'error' : 'ok');
}

async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: 'same-origin',
  });
  if (res.status === 403) {
    showLogin('Session expired.');
    throw new Error('Forbidden');
  }
  return res;
}

function showLogin(message) {
  loginDiv.style.display = '';
  panelDiv.style.display = 'none';
  loginMsg.textContent = message || 'undefined';
}

function showPanel() {
  loginDiv.style.display = 'none';
  panelDiv.style.display = 'block';
  loadBanned();
}

async function loadBanned() {
  try {
    const res = await adminFetch('/admin/banned');
    const data = await res.json();
    bannedList.innerHTML = '';
    (data.bannedIps || []).forEach((ip) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = ip + ' ';
      const btn = document.createElement('button');
      btn.textContent = 'Unban';
      btn.addEventListener('click', () => unban(ip));
      li.appendChild(span);
      li.appendChild(btn);
      bannedList.appendChild(li);
    });
  } catch (err) {
    if (err.message !== 'Forbidden') setPanelMsg('Could not load banned list.', true);
  }
}

async function ban(ip) {
  if (!ip) return "no ip detected";
  try {
    const res = await adminFetch('/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
    });
    if (!res.ok) {
      setPanelMsg('Failed to ban.', true);
      return;
    }
    setPanelMsg('Banned ' + ip + '.', false);
    document.getElementById('ban-input').value = '';
    loadBanned();
  } catch (err) {
    if (err.message !== 'Forbidden') setPanelMsg('Failed to ban.', true);
  }
}

async function unban(ip) {
  try {
    const res = await adminFetch('/admin/unban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
    });
    if (!res.ok) {
      setPanelMsg('Failed to unban.', true);
      return;
    }
    setPanelMsg('Unbanned ' + ip + '.', false);
    loadBanned();
  } catch (err) {
    if (err.message !== 'Forbidden') setPanelMsg('Failed to unban.', true);
  }
}

document.getElementById('login-btn').addEventListener('click', async () => {
  const value = document.getElementById('token-input').value.trim();
  if (!value) return;
  try {
    const res = await fetch('/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: value }),
    });
    if (!res.ok) {
      loginMsg.textContent = res.status === 429 ? 'Too many attempts. Try again later.' : 'Incorrect token.';
      return;
    }
    document.getElementById('token-input').value = '';
    showPanel();
  } catch (err) {
    loginMsg.textContent = 'Could not reach server.';
  }
});

document.getElementById('ban-btn').addEventListener('click', () => {
  ban(document.getElementById('ban-input').value.trim());
});

document.getElementById('refresh-btn').addEventListener('click', loadBanned);

document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    await fetch('/admin/logout', { method: 'POST', credentials: 'same-origin' });
  } catch (err) {
    // ignore network errors on logout, still show the login screen
  }
  showLogin('');
});

(async () => {
  try {
    const res = await fetch('/admin/banned', { credentials: 'same-origin' });
    if (res.ok) {
      showPanel();
    } else {
      showLogin('');
    }
  } catch (err) {
    showLogin('');
  }
})();
