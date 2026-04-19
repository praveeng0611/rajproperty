import { redirect } from 'next/navigation';
import { getAuthUser, createToken, setAuthCookie } from '../../../lib/auth';

export const metadata = { title: 'Admin Login — Raj Property' };

async function loginAction(formData) {
  'use server';
  const username = formData.get('username')?.trim();
  const password = formData.get('password');

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'rajproperty123';

  if (username === validUser && password === validPass) {
    const token = await createToken();
    setAuthCookie(token);
    redirect('/admin/dashboard');
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
