'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function ImageGallery({ images = [], featuredImage }) {
  // Merge featured + gallery, dedupe, filter empties
  const all = [...new Set([featuredImage, ...images].filter(Boolean))];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (all.length === 0) return null;

  function prev() { setActive((a) => (a - 1 + all.length) % all.length); }
  function next() { setActive((a) => (a + 1) % all.length); }

  return (
    <>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-video group">
        <img
          src={all[active]}
          alt={`Property photo ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
        />

        {/* Nav arrows */}
        {all.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom */}
        <button onClick={() => setLightbox(true)}
          className="absolute bottom-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Counter */}
        {all.length > 1 && (
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {active + 1} / {all.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {all.map((url, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'
              }`}>
              <img src={url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>

          {all.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={all[active]}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {all.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {active + 1} / {all.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
