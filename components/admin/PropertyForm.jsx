'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Image, Video, Star } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'plot',         label: 'Plot' },
  { value: 'house',        label: 'House' },
  { value: 'flat',         label: 'Flat' },
  { value: 'commercial',   label: 'Commercial' },
  { value: 'agricultural', label: 'Agricultural' },
];

const PRICE_UNITS = [
  { value: 'lakh',  label: 'Lakh (₹)' },
  { value: 'crore', label: 'Crore (₹)' },
  { value: 'total', label: 'Total Amount (₹)' },
];

const AREA_UNITS = [
  { value: 'sqft',    label: 'sq.ft' },
  { value: 'sqyard',  label: 'sq.yard' },
  { value: 'sqmeter', label: 'sq.meter' },
  { value: 'bigha',   label: 'Bigha' },
  { value: 'acre',    label: 'Acre' },
];

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  // Google Drive: https://drive.google.com/file/d/FILE_ID/view
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return url; // return as-is for other URLs
}

function ImagePreview({ url, onRemove, index }) {
  const [error, setError] = useState(false);
  return (
    <div className="relative group">
      <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        {url && !error ? (
          <img
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-6 h-6 text-slate-300" />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function PropertyForm({ action, defaultValues = {}, isEdit = false }) {
  const [pending, startTransition] = useTransition();
  const d = defaultValues;

  const [featuredImage, setFeaturedImage] = useState(d.featured_image || '');
  const [galleryImages, setGalleryImages] = useState(
    (d.images || []).length > 0 ? d.images : ['']
  );
  const [videoUrl, setVideoUrl] = useState(d.video_url || '');

  function addGalleryRow() {
    if (galleryImages.length >= 10) return;
    setGalleryImages([...galleryImages, '']);
  }

  function updateGalleryRow(i, val) {
    const updated = [...galleryImages];
    updated[i] = val;
    setGalleryImages(updated);
  }

  function removeGalleryRow(i) {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Inject gallery images as newline-separated string
    formData.set('images', galleryImages.filter(Boolean).join('\n'));
    startTransition(() => action(formData));
  }

  const videoEmbed = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-slate-800">{isEdit ? 'Edit Property' : 'Add Property'}</span>
          </div>
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-slate-500 hover:text-brand text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Title *</label>
                <input
                  type="text" name="title" required defaultValue={d.title || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  placeholder="e.g. Prime Residential Plot in Kankroli"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Type *</label>
                  <select name="type" required defaultValue={d.type || 'plot'}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition bg-white">
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
                  <input type="text" name="location" required defaultValue={d.location || ''}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    placeholder="e.g. Kankroli" />
                </div>
              </div>
            </div>
          </div>

          {/* Price & Area */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5">Price & Area</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Price *</label>
                <div className="flex gap-2">
                  <input type="number" name="price" required step="0.01" min="0" defaultValue={d.price || ''}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    placeholder="Amount" />
                  <select name="price_unit" defaultValue={d.price_unit || 'lakh'}
                    className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition bg-white">
                    {PRICE_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Area *</label>
                <div className="flex gap-2">
                  <input type="number" name="area" required step="0.01" min="0" defaultValue={d.area || ''}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    placeholder="Size" />
                  <select name="area_unit" defaultValue={d.area_unit || 'sqft'}
                    className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition bg-white">
                    {AREA_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── MEDIA ────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-1">Media</h2>
            <p className="text-slate-500 text-xs mb-6">Paste image/video URLs — no uploads needed. Use Google Drive, Dropbox, or any direct image link.</p>

            {/* Featured Image */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                <Star className="w-3.5 h-3.5 text-yellow-500" /> Featured Image
                <span className="text-slate-400 font-normal">(shown on listing card)</span>
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    name="featured_image"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    💡 Google Drive: share → copy link, change <code className="bg-slate-100 px-1 rounded">/view</code> to <code className="bg-slate-100 px-1 rounded">/uc?export=view&id=FILE_ID</code>
                  </p>
                </div>
                {featuredImage && (
                  <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src={featuredImage} alt="preview" className="w-full h-full object-cover" loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-3">
                <Image className="w-3.5 h-3.5 text-brand" /> Photo Gallery
                <span className="text-slate-400 font-normal">(up to 10 photos)</span>
              </label>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
                  {galleryImages.filter(Boolean).map((url, i) => (
                    <ImagePreview
                      key={i}
                      url={url}
                      index={i}
                      onRemove={() => removeGalleryRow(galleryImages.indexOf(url))}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {galleryImages.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateGalleryRow(i, e.target.value)}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                      placeholder={`Photo ${i + 1} URL`}
                    />
                    <button type="button" onClick={() => removeGalleryRow(i)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {galleryImages.length < 10 && (
                <button type="button" onClick={addGalleryRow}
                  className="mt-3 flex items-center gap-1.5 text-brand hover:text-brand-dark text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Add photo URL
                </button>
              )}
            </div>

            {/* Video */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                <Video className="w-3.5 h-3.5 text-red-500" /> Video Tour
                <span className="text-slate-400 font-normal">(YouTube or Google Drive)</span>
              </label>
              <input
                type="url"
                name="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/.../view"
              />
              {videoUrl && videoEmbed && (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <iframe
                    src={videoEmbed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea name="description" rows={4} defaultValue={d.description || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition resize-none"
                  placeholder="Brief description about the property, highlights, nearby landmarks..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Features & Highlights
                  <span className="text-slate-400 font-normal ml-1">(one per line)</span>
                </label>
                <textarea name="features" rows={5} defaultValue={(d.features || []).join('\n')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition resize-none font-mono"
                  placeholder={"Gated community\nCorner plot\nReady for construction\nNearby school & hospital"} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-1">Contact Details</h2>
            <p className="text-slate-500 text-sm mb-5">Leave blank to use the site-wide default contact number.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Phone</label>
                <input type="tel" name="contact_phone" defaultValue={d.contact_phone || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  placeholder="+919876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Number</label>
                <input type="tel" name="contact_whatsapp" defaultValue={d.contact_whatsapp || ''}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  placeholder="+919876543210" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5">Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select name="status" defaultValue={d.status || 'available'}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition bg-white">
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="featured" id="featured" defaultChecked={d.featured || false}
                  className="w-4 h-4 rounded accent-brand" />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Mark as Featured
                  <span className="block text-xs text-slate-400 font-normal">Shows ★ badge, appears first in listings</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={pending}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Save className="w-4 h-4" />
              {pending ? 'Saving...' : (isEdit ? 'Update Property' : 'Add Property')}
            </button>
            <Link href="/admin/dashboard"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:border-brand hover:text-brand text-sm font-medium transition-colors">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
