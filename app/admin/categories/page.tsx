'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Plus, Tag as TagIcon, X, Search, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories, type Category } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { CardListSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/components/admin/ConfirmProvider';
import ImageUpload from '@/components/admin/ImageUpload';

const SKY = '#46AEE8';
const inputStyle = 'w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800 dark:text-white transition-all';

interface CategoryFormState {
    id?: number;
    name: string;
    image: string;
    description: string;
    gradient: string;
}

const emptyCategory: CategoryFormState = {
    name: '',
    image: '',
    description: '',
    gradient: '',
};

export default function AdminCategoriesPage() {
    const { categories, isLoading, mutate } = useCategories();
    const [search, setSearch] = useState('');
    const [modalState, setModalState] = useState<CategoryFormState | null>(null);
    const [saving, setSaving] = useState(false);
    const confirm = useConfirm();

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    const openAdd = () => setModalState({ ...emptyCategory });
    const openEdit = (c: Category) => setModalState({
        id: c.id,
        name: c.name,
        image: c.image || '',
        description: c.description || '',
        gradient: c.gradient || '',
    });
    const closeModal = () => setModalState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalState) return;
        setSaving(true);

        const payload = {
            name: modalState.name.trim(),
            image: modalState.image.trim() || undefined,
            description: modalState.description.trim() || undefined,
            gradient: modalState.gradient.trim() || undefined,
        };

        try {
            if (modalState.id) {
                await api.patch(`/admin/categories/${modalState.id}`, payload, true);
                toast.success('Category updated successfully');
            } else {
                await api.post('/admin/categories', payload, true);
                toast.success('Category created successfully');
            }
            closeModal();
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number, count: number) => {
        if (count > 0) {
            toast.error(`Cannot delete: this category has ${count} products.`);
            return;
        }
        if (!(await confirm('Are you sure you want to delete this category?'))) return;
        try {
            await api.del(`/admin/categories/${id}`, true);
            toast.success('Category deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Categories</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage store categories and their hero images.</p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: SKY }}
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Search & Stats bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories…"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-slate-800 dark:text-white"
                    />
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#46AEE8]" />
                    Total Categories: <span className="font-bold text-slate-800 dark:text-white">{categories.length}</span>
                </div>
            </div>

            {/* Category Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 md:p-6">
                {isLoading ? (
                    <CardListSkeleton rows={6} />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <TagIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No categories found.</p>
                        {search && <p className="text-xs text-slate-400 mt-1">Try a different search term.</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map((c) => (
                            <div
                                key={c.id}
                                className="group relative flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 hover:border-[#46AEE8]/50 hover:shadow-md transition-all duration-200"
                            >
                                {/* Category Image / Thumbnail */}
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                    {c.image ? (
                                        <Image
                                            src={c.image}
                                            alt={c.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                                            <TagIcon className="w-6 h-6 text-[#46AEE8]" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 dark:text-white truncate text-base">{c.name}</h3>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#46AEE8]/10 text-[#46AEE8] shrink-0">
                                            /{c.slug}
                                        </span>
                                    </div>
                                    {c.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                                    )}
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{c.count}</span> {c.count === 1 ? 'product' : 'products'}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => openEdit(c)}
                                        title="Edit Category"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => remove(c.id, c.count)}
                                        title="Delete Category"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal: Create or Edit Category */}
            {modalState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {modalState.id ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Category Name *
                                </label>
                                <input
                                    required
                                    value={modalState.name}
                                    onChange={(e) => setModalState({ ...modalState, name: e.target.value })}
                                    placeholder="e.g. Luxury Watches"
                                    className={inputStyle}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Category Image
                                </label>
                                <ImageUpload
                                    value={modalState.image}
                                    onChange={(url) => setModalState({ ...modalState, image: url })}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Upload a banner/thumbnail for this category or paste an image URL.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={modalState.description}
                                    onChange={(e) => setModalState({ ...modalState, description: e.target.value })}
                                    placeholder="Short description for banners and SEO…"
                                    className={inputStyle}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Decorative Gradient (Optional)
                                </label>
                                <input
                                    value={modalState.gradient}
                                    onChange={(e) => setModalState({ ...modalState, gradient: e.target.value })}
                                    placeholder="e.g. from-blue-500 to-purple-600"
                                    className={inputStyle}
                                />
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {[
                                        'from-rose-400 to-pink-500',
                                        'from-blue-500 to-purple-600',
                                        'from-pink-500 to-rose-600',
                                        'from-purple-600 to-indigo-600',
                                        'from-orange-500 to-amber-600',
                                        'from-amber-500 to-red-500',
                                        'from-green-500 to-emerald-600',
                                    ].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setModalState({ ...modalState, gradient: g })}
                                            className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                        >
                                            {g.split(' ')[0].replace('from-', '')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg disabled:opacity-60 transition-all"
                                    style={{ backgroundColor: SKY }}
                                >
                                    {saving ? 'Saving…' : modalState.id ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
