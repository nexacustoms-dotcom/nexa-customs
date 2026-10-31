// Admin sign-in using Supabase Auth (a real server-side login).
// The access token proves who you are to the database; the public "anon" key alone can no
// longer change prices/pages or read orders once the security SQL has been applied.

const KEY = 'nxt_admin_session';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function write(s) {
  try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch {}
}

export function hasSession() {
  const s = read();
  return !!(s && s.refresh_token);
}
export function sessionEmail() { return read()?.email || ''; }

export async function signIn(url, anonKey, email, password) {
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email).trim(), password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    return { error: data.error_description || data.msg || data.message || 'Incorrect email or password' };
  }
  write({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    email: data.user?.email || String(email).trim(),
  });
  return { ok: true };
}

export function signOut() { write(null); }

// Returns a valid access token (refreshing it if it is about to expire), or null.
let refreshing = null;
export async function getAccessToken(url, anonKey) {
  const s = read();
  if (!s) return null;
  const now = Math.floor(Date.now() / 1000);
  if (s.access_token && s.expires_at && s.expires_at - now > 60) return s.access_token;
  if (!s.refresh_token) return null;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: { apikey: anonKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: s.refresh_token }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.access_token) { write(null); return null; }   // session ended
        write({
          access_token: data.access_token,
          refresh_token: data.refresh_token || s.refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
          email: s.email,
        });
        return data.access_token;
      } catch { return s.access_token || null; }
      finally { refreshing = null; }
    })();
  }
  return refreshing;
}

// Headers for any Supabase request: uses the admin token when signed in, otherwise the public key.
export async function authHeaders(url, anonKey, extra = {}) {
  const token = await getAccessToken(url, anonKey);
  return { apikey: anonKey, Authorization: `Bearer ${token || anonKey}`, ...extra };
}
