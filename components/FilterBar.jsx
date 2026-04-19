'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const TYPES = [
  { value: 'all',         label: 'All Properties' },
  { value: 'plot',        label: 'Plots' },
  { value: 'house',       label: 'Houses' },
  { value: 'flat',        label: 'Flats' },
  { value: 'commercial',  label: 'Commercial' },
  { value: 'agricultural',label: 'Agricultural' },
];

export default function FilterBar({ count }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const current     = searchParams.get('type') || 'all';

  function setFilter(value) {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') params.delete('type');
    else params.set('type', value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              current === t.value
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {count !== undefined && (
        <p className="text-sm text-slate-500">{count} {count === 1 ? 'property' : 'properties'} found</p>
      )}
    </div>
  );
}
