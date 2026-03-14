const API_BASE = 'http://localhost:8080';

export async function checkAuthStatus() {
  const res = await fetch(`${API_BASE}/api/auth/status`, {
    credentials: 'include',
  });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/api/auth/user`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export function getGoogleLoginUrl() {
  return `${API_BASE}/oauth2/authorization/google`;
}

export function getLogoutUrl() {
  return `${API_BASE}/logout`;
}
