import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Maximize2, ArrowLeft, Phone, CheckCircle, Video } from 'lucide-react';
import { createPublicClient } from '../../../lib/supabase';
import ImageGallery from '../../../components/ImageGallery';

const TYPE_STYLES = {
  plot:         { label: 'Plot',         grad: 'from-green-400  to-emerald-500' },
  house:        { label: 'House',        grad: 'from-blue-400   to-indigo-500'  },
  flat:         { label: 'Flat',         grad: 'from-purple-400 to-violet-500'  },
  commercial:   { label: 'Commercial',   grad: 'from-orange-400 to-amber-500'   },
  agricultural: { label: 'Agricultural', grad: 'from-yellow-400 to-lime-500'    },
};

function formatPrice(price, unit) {
  if (unit === 'crore') return `₹${price} Crore`;
  if (unit === 'total') return `₹${Number(price).toLocaleString('en-IN')}`;
  return `₹${price} Lakh`;
}

function formatArea(area, unit) {
  const labels = { sqft: 'sq.ft', sqyard: 'sq.yd', bigha: 'Bigha', acre: 'Acre', sqmeter: 'sq.m' };
  return `${area} ${labels[unit] || unit}`;
}

function getVideoEmbed(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return url;
}

export async function generateMetadata({ params }) {
  const supabase = createPublicClient();
  const { data } = await supabase.from('properties').select('title,location').eq('id', params.id).single();
  if (!data) return { title: 'Property Not Found' };
  return { title: `${data.title} — Raj Property Rajsamand` };
}

export default async function PropertyPage({ params }) {
  const supabase = createPublicClient();
  const { data: p } = await supabase.from('properties').select('*').eq('id', params.id).single();
  if (!p) notFound();

  const style = TYPE_STYLES[p.type] || TYPE_STYLES.plot;
  const phone = p.contact_phone || process.env.NEXT_PUBLIC_CONTACT_PHONE || '+919876543210';
  const wa    = (p.contact_whatsapp || phone).replace(/\D/g, '');
  const waMsg = encodeURIComponent(`Hi, I'm interested in: ${p.title} (${p.location}). Please share details.`);
  const hasMedia = p.featured_image || (p.images && p.images.length > 0);
  const videoEmbed = getVideoEmbed(p.video_url);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-slate-800">Raj Property</span>
          </Link>
          <a href={`tel:${phone}`} className="flex items-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-full">
            <Phone className="w-4 h-4" /> Call
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {hasMedia ? (
              <ImageGallery featuredImage={p.featured_image} images={p.images || []} />
            ) : (
              <div className={`bg-gradient-to-br ${style.grad} rounded-2xl h-64 relative flex items-end p-6`}>
                {p.featured && (
                  <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">★ Featured</span>
                )}
                <span className="absolute top-4 right-4 bg-white/90 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">{style.label}</span>
                <div>
                  <p className="text-white font-black text-4xl drop-shadow">{formatPrice(p.price, p.price_unit)}</p>
                  <p className="text-white/80 text-sm">{formatArea(p.area, p.area_unit)}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">{style.label}</span>
                {p.featured && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">★ Featured</span>}
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-3">{p.title}</h1>
              <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand" />{p.location}, Rajsamand</span>
                <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-brand" />{formatArea(p.area, p.area_unit)}</span>
              </div>
              <p className="text-3xl font-black text-brand mt-4">{formatPrice(p.price, p.price_unit)}</p>
            </div>

            {p.description && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-3">About this Property</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{p.description}</p>
              </div>
            )}

            {p.features?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-4">Features & Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoEmbed && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" /> Video Tour
                </h2>
                <div className="rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <iframe
                    src={videoEmbed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-sm">
              <h2 className="font-bold text-slate-800 mb-1">Interested in this property?</h2>
              <p className="text-slate-500 text-sm mb-6">Contact us directly — no brokerage, no middleman.</p>

              <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <a href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-xl transition-colors">
                <Phone className="w-5 h-5" /> Call Now
              </a>

              <p className="text-slate-400 text-xs text-center mt-4">📍 {p.location}, Rajsamand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
