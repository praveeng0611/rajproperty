'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '../../lib/supabase';
import { clearAuthCookie } from '../../lib/auth';

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutAction() {
  await clearAuthCookie();
  redirect('/admin/login');
}

// ─── Create property ──────────────────────────────────────────────────────────
export async function createPropertyAction(formData) {
  const supabase = createAdminClient();

  const features = (formData.get('features') || '')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  const images = (formData.get('images') || '')
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);

  const payload = {
    title:            formData.get('title'),
    type:             formData.get('type'),
    price:            parseFloat(formData.get('price')),
    price_unit:       formData.get('price_unit'),
    area:             parseFloat(formData.get('area')),
    area_unit:        formData.get('area_unit'),
    location:         formData.get('location'),
    description:      formData.get('description') || null,
    features,
    images,
    featured_image:   formData.get('featured_image') || null,
    video_url:        formData.get('video_url') || null,
    contact_phone:    formData.get('contact_phone') || null,
    contact_whatsapp: formData.get('contact_whatsapp') || null,
    status:           formData.get('status') || 'available',
    featured:         formData.get('featured') === 'on',
  };

  const { error } = await supabase.from('properties').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
}

// ─── Update property ──────────────────────────────────────────────────────────
export async function updatePropertyAction(id, formData) {
  const supabase = createAdminClient();

  const features = (formData.get('features') || '')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  const images = (formData.get('images') || '')
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);

  const payload = {
    title:            formData.get('title'),
    type:             formData.get('type'),
    price:            parseFloat(formData.get('price')),
    price_unit:       formData.get('price_unit'),
    area:             parseFloat(formData.get('area')),
    area_unit:        formData.get('area_unit'),
    location:         formData.get('location'),
    description:      formData.get('description') || null,
    features,
    images,
    featured_image:   formData.get('featured_image') || null,
    video_url:        formData.get('video_url') || null,
    contact_phone:    formData.get('contact_phone') || null,
    contact_whatsapp: formData.get('contact_whatsapp') || null,
    status:           formData.get('status') || 'available',
    featured:         formData.get('featured') === 'on',
  };

  const { error } = await supabase.from('properties').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/property/${id}`);
  redirect('/admin/dashboard');
}

// ─── Delete property ──────────────────────────────────────────────────────────
export async function deletePropertyAction(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
}

// ─── Toggle status ────────────────────────────────────────────────────────────
export async function toggleStatusAction(id, currentStatus) {
  const supabase = createAdminClient();
  const newStatus = currentStatus === 'available' ? 'sold' : 'available';
  const { error } = await supabase.from('properties').update({ status: newStatus }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
}

// ─── Toggle featured ─────────────────────────────────────────────────────────
export async function toggleFeaturedAction(id, currentFeatured) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('properties').update({ featured: !currentFeatured }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
}
