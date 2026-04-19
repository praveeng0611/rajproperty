import Link from 'next/link';
import { MapPin, Maximize2, Phone } from 'lucide-react';

const TYPE_STYLES = {
  plot:         { label: 'Plot',         bg: 'bg-green-100  text-green-800',   grad: 'from-green-400  to-emerald-500' },
  house:        { label: 'House',        bg: 'bg-blue-100   text-blue-800',    grad: 'from-blue-400   to-indigo-500'  },
  flat:         { label: 'Flat',         bg: 'bg-purple-100 text-purple-800',  grad: 'from-purple-400 to-violet-500'  },
  commercial:   { label: 'Commercial',   bg: 'bg-orange-100 text-orange-800',  grad: 'from-orange-400 to-amber-500'   },
  agricultural: { label: 'Agricultural', bg: 'bg-yellow-100 text-yellow-800',  grad: 'from-yellow-400 to-lime-500'    },
};

function formatPrice(price, unit) {
  if (unit === 'crore') return `₹${price} Cr`;
  if (unit === 'total') return `₹${Number(price).toLocaleString('en-IN')}`;
  return `₹${price} L`;
}

function formatArea(area, unit) {
  const labels = { sqft: 'sq.ft', sqyard: 'sq.yd', bigha: 'Bigha', acre: 'Acre', sqmeter: 'sq.m' };
  return `${area} ${labels[unit] || unit}`;
}

export default function PropertyCard({ property: p }) {
  const style = TYPE_STYLES[p.type] || TYPE_STYLES.plot;
  const phone = p.contact_phone || process.env.NEXT_PUBLIC_CONTACT_PHONE || '+919876543210';
  const wa    = (p.contact_whatsapp || phone).replace(/\D/g, '');
  const waMsg = encodeURIComponent(`Hi, I'm interested in the property: ${p.title} (${p.location}). Please share details.`);
  const photoCount = [p.featured_image, ...(p.images || [])].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Header: real image if available, else colour gradient */}
      <div className="relative h-44 overflow-hidden">
        {p.featured_image ? (
          <>
            <img
              src={p.featured_image}
              alt={p.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${style.grad}`} />
        )}

        {p.featured && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full z-10">
            ★ Featured
          </span>
        )}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full z-10 ${
          p.featured_image ? 'bg-white/90 text-slate-700' : style.bg
        }`}>
          {style.label}
        </span>

        <div className="absolute bottom-3 left-4 z-10">
          <p className="text-white font-black text-2xl drop-shadow">{formatPrice(p.price, p.price_unit)}</p>
        </div>

        {photoCount > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
            📷 {photoCount}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-2 line-clamp-2">{p.title}</h3>

        <div className="flex items-center gap-3 text-slate-500 text-xs mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
          <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{formatArea(p.area, p.area_unit)}</span>
        </div>

        {p.description && (
          <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>
        )}

        <div className="mt-auto flex gap-2 pt-3 border-t border-slate-100">
          <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
            <Phone className="w-3.5 h-3.5" /> Call Now
          </a>
          <Link href={`/property/${p.id}`}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-brand hover:text-brand text-xs font-medium transition-colors whitespace-nowrap">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
