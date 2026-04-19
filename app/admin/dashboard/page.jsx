import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, LogOut, Home } from 'lucide-react';
import { createAdminClient } from '../../../lib/supabase';
import { getAuthUser } from '../../../lib/auth';
import { logoutAction } from '../actions';
import PropertyActions from '../../../components/admin/PropertyActions';

export const metadata = { title: 'Dashboard — Raj Property Admin' };
export const dynamic = 'force-dynamic';

const TYPE_BADGE = {
  plot:         'bg-green-100  text-green-800',
  house:        'bg-blue-100   text-blue-800',
  flat:         'bg-purple-100 text-purple-800',
  commercial:   'bg-orange-100 text-orange-800',
  agricultural: 'bg-yellow-100 text-yellow-800',
};

function formatPrice(price, unit) {
  if (unit === 'crore') return `₹${price} Cr`;
  if (unit === 'total') return `₹${Number(price).toLocaleString('en-IN')}`;
  return `₹${price} L`;
}

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  const supabase = createAdminClient();
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  const all      = properties || [];
  const available = all.filter((p) => p.status === 'available').length;
  const sold      = all.filter((p) => p.status === 'sold').length;
  const featured  = all.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <div>
              <p className="font-black text-slate-800 leading-none text-sm">Raj Property</p>
              <p className="text-xs text-slate-400 leading-none">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-slate-500 hover:text-brand text-sm transition-colors"
            >
              <Home className="w-4 h-4" /> View Site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: all.length,  color: 'text-slate-800' },
            { label: 'Available', value: available,    color: 'text-green-600' },
            { label: 'Sold',      value: sold,         color: 'text-red-500'   },
            { label: 'Featured',  value: featured,     color: 'text-yellow-500'},
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-800">All Properties</h2>
          <Link
            href="/admin/property/new"
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Property
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            Error loading properties: {error.message}
          </div>
        )}

        {/* Table */}
        {all.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-400">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-semibold">No properties yet</p>
            <p className="text-sm mt-1">
              <Link href="/admin/property/new" className="text-brand hover:underline">Add your first property</Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Property</th>
                    <th className="px-4 py-3.5 font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-3.5 font-semibold text-slate-600">Price</th>
                    <th className="px-4 py-3.5 font-semibold text-slate-600">Location</th>
                    <th className="px-4 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {all.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {p.featured && <span className="text-yellow-400 text-xs">★</span>}
                          <span className="font-medium text-slate-800 line-clamp-1">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[p.type] || 'bg-slate-100 text-slate-700'}`}>
                          {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700 font-medium whitespace-nowrap">
                        {formatPrice(p.price, p.price_unit)}
                      </td>
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap">{p.location}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status === 'available' ? 'Available' : 'Sold'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <PropertyActions id={p.id} status={p.status} featured={p.featured} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
