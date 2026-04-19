import { redirect } from 'next/navigation';
import { getAuthUser } from '../../../../lib/auth';
import { createPropertyAction } from '../../actions';
import PropertyForm from '../../../../components/admin/PropertyForm';

export const metadata = { title: 'Add Property — Raj Property Admin' };

export default async function NewPropertyPage() {
  const user = await getAuthUser();
  if (!user) redirect('/admin/login');

  return <PropertyForm action={createPropertyAction} />;
}
