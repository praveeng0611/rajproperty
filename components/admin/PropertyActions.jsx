'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ToggleLeft, ToggleRight, Star, StarOff } from 'lucide-react';
import { deletePropertyAction, toggleStatusAction, toggleFeaturedAction } from '../../app/admin/actions';

export default function PropertyActions({ id, status, featured }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    startTransition(async () => {
      await deletePropertyAction(id);
      router.refresh();
    });
  }

  function handleToggleStatus() {
    startTransition(async () => {
      await toggleStatusAction(id, status);
      router.refresh();
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      await toggleFeaturedAction(id, featured);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleToggleFeatured}
        disabled={pending}
        title={featured ? 'Remove from featured' : 'Mark as featured'}
        className={`p-1.5 rounded-lg transition-colors ${
          featured
            ? 'text-yellow-500 hover:bg-yellow-50'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
      >
        {featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
      </button>

      <button
        onClick={handleToggleStatus}
        disabled={pending}
        title={status === 'available' ? 'Mark as sold' : 'Mark as available'}
        className={`p-1.5 rounded-lg transition-colors ${
          status === 'available'
            ? 'text-green-600 hover:bg-green-50'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
      >
        {status === 'available'
          ? <ToggleRight className="w-4 h-4" />
          : <ToggleLeft className="w-4 h-4" />}
      </button>

      <a
        href={`/admin/property/${id}/edit`}
        className="p-1.5 rounded-lg text-brand hover:bg-blue-50 transition-colors text-xs font-medium"
      >
        Edit
      </a>

      <button
        onClick={handleDelete}
        disabled={pending}
        title="Delete property"
        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
