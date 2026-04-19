import { redirect, notFound } from 'next/navigation';
import { getAuthUser } from '../../../../../lib/auth';
import { createAdminClient } from '../../../../../lib/supabase';
import { updatePropertyAction } from '../../../actions';
import PropertyForm from '../../../../../components/admin/PropertyForm';

export const metadata = { title: 'Edit Property — Raj Property Admin' };

export default async function EditPropertyPage({ params }) {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  const supabase = createAdminClient();
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!property) notFound();

  // Bind the property ID to the update action
  const updateAction = updatePropertyAction.bind(null, params.id);

  return <PropertyForm action={updateAction} defaultValues={property} isEdit />;
}
