import { redirect } from 'next/navigation';
import { timingSafeEqual, createHash } from 'crypto';
import { getAuthUser, createToken, setAuthCookie } from '../../../lib/auth';

export const metadata = { title: 'Admin Login — Raj Property' };

// Best-effort in-memory rate limiter (per warm server instance).
// Not a substitute for a shared store, but blocks naive brute-force scripts.
const loginAttempts = globalThis.__rpLoginAttempts || (globalThis.__rpLoginAttempts = new Map());
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function safeCompare(a, b) {
  const hashA = createHash('sha256').update(String(a)).digest();
  const hashB = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(hashA, hashB);
}

async function loginAction(formData) {
  'use server';
  const username = formData.get('username')?.trim() || '';
  const password = formData.get('password') || '';

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    // Fail closed: never fall back to a guessable default credential.
    redirect('/admin/login?error=1');
  }

  const key = username || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (entry && now - entry.first < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
    redirect('/admin/login?error=1');
  }

  if (safeCompare(username, validUser) && safeCompare(password, validPass)) {
    loginAttempts.delete(key);
    const token = await createToken();
    setAuthCookie(token);
    redirect('/admin/dashboard');
  }

  if (!entry || now - entry.first > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, first: now });
  } else {
    entry.count += 1;
  }

  redirect('/admin/login?error=1');
}

export default async function LoginPage({ searchParams }) {
  const user = await getAuthUser();
  if (user) redirect('/admin/dashboard');

  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand shadow-lg mb-4">
            <span className="text-white font-black text-2xl">R</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800">Raj Property</h1>
          <p className="text-slate-500 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Sign in to continue</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              Incorrect username or password. Please try again.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                required
                autoComplete="username"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <a href="/" className="hover:text-brand transition-colors">← Back to listings</a>
        </p>
      </div>
    </div>
  );
}
