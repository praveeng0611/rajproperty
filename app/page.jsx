import { Suspense } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Search } from 'lucide-react';
import { createPublicClient } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';

export const revalidate = 60;

async function getProperties(type) {
  const supabase = createPublicClient();
  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (type && type !== 'all') query = query.eq('type', type);
  const { data } = await query;
  return data || [];
}

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98765 43210';

export default async function HomePage({ searchParams }) {
  const type = searchParams?.type;
  const properties = await getProperties(type);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <div>
              <p className="font-black text-slate-800 leading-none text-base">Raj Property</p>
              <p className="text-xs text-slate-400 leading-none">Rajsamand</p>
            </div>
          </Link>
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-brand-dark transition-colors"
          >
            <Phone className="w-4 h-4" /> {PHONE}
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3.5 h-3.5" /> Rajsamand District, Rajasthan
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Find Your Property<br />in <span className="text-yellow-300">Rajsamand</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Plots, houses, flats, commercial spaces and agricultural land — all in one place.
          </p>
          <div className="flex items-center bg-white rounded-xl shadow-lg px-4 py-3 max-w-md mx-auto gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by location or property type..."
              className="flex-1 outline-none text-slate-700 text-sm placeholder-slate-400 bg-transparent"
              disabled
            />
          </div>
          <p className="text-blue-200 text-xs mt-3">Search coming soon · Browse listings below</p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-6 items-center justify-center text-center">
          {[
            { v: '100+', l: 'Properties Listed' },
            { v: '8+', l: 'Locations Covered' },
            { v: 'Verified', l: 'Direct Owner Listings' },
            { v: 'Free', l: 'No Brokerage' },
          ].map(({ v, l }) => (
            <div key={l} className="px-4">
              <p className="font-black text-brand text-xl">{v}</p>
              <p className="text-slate-500 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Listings ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800">Available Properties</h2>
        </div>

        <Suspense>
          <FilterBar count={properties.length} />
        </Suspense>

        {properties.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-semibold">No properties found</p>
            <p className="text-sm mt-1">Try a different filter or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-800 text-slate-400 text-sm py-8 px-4 mt-10 text-center">
        <p className="text-white font-bold mb-1">Raj Property — Rajsamand</p>
        <p>Your trusted local property partner · <a href={`tel:${PHONE}`} className="text-yellow-400 hover:underline">{PHONE}</a></p>
        <p className="mt-4 text-xs text-slate-600">Built by <a href="https://gnosisolabs.com" className="hover:text-slate-400">Gnosiso Labs</a></p>
      </footer>
    </div>
  );
}
