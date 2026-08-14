'use client';

import { useState } from 'react';
import { Plus, Trash2, Pencil, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrencies, type CurrencyOption } from '@/lib/hooks';
import { api, ApiError } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/components/admin/ConfirmProvider';

const field = 'w-full px-4 py-3 bg-gray-50 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#46AEE8] text-gray-900';

const emptyForm = { code: '', symbol: '', label: '', rate: '' };

export default function AdminCurrenciesPage() {
    const { currencies, isLoading, mutate } = useCurrencies();
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const confirm = useConfirm();

    const startEdit = (c: CurrencyOption) => {
        setEditingId(c.id);
        setForm({ code: c.code, symbol: c.symbol, label: c.label, rate: String(c.rate) });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            code: form.code,
            symbol: form.symbol,
            label: form.label,
            rate: Number(form.rate),
        };
        try {
            if (editingId) {
                await api.patch(`/admin/currencies/${editingId}`, payload, true);
                toast.success('Currency updated');
            } else {
                await api.post('/admin/currencies', payload, true);
                toast.success('Currency added');
            }
            cancelEdit();
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const setDefault = async (id: number) => {
        try {
            await api.post(`/admin/currencies/${id}/default`, {}, true);
            toast.success('Default currency updated — this is now what checkout bills in');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    const remove = async (id: number) => {
        if (!(await confirm('Delete this currency?'))) return;
        try {
            await api.del(`/admin/currencies/${id}`, true);
            toast.success('Deleted');
            mutate();
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">Currencies</h1>
                <p className="text-sm text-secondary mt-1">
                    Prices are stored in USD. The <b>default</b> currency is what checkout actually bills in — the
                    rest are just browsing-display options shoppers can pick from.
                </p>
            </div>

            <form onSubmit={submit} className="bg-white border border-primary/5 rounded-2xl p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <input className={field} placeholder="Code (e.g. AED)" required maxLength={8} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                <input className={field} placeholder="Symbol (e.g. د.إ)" required maxLength={8} value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
                <input className={field} placeholder="Label (e.g. UAE Dirham)" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                <input className={field} type="number" step="0.0001" placeholder="1 USD = ? " required value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
                <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#46AEE8] text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-60">
                        {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="px-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </form>

            {isLoading ? <TableSkeleton rows={5} cols={6} /> : currencies.length === 0 ? <p className="text-secondary">No currencies yet.</p> : (
                <div className="overflow-x-auto rounded-2xl border border-primary/5 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-primary/5 text-left">
                            <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                                <th className="p-4">Code</th><th className="p-4">Symbol</th><th className="p-4">Label</th><th className="p-4">1 USD =</th><th className="p-4">Default</th><th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {currencies.map((c) => (
                                <tr key={c.id} className="text-primary">
                                    <td className="p-4 font-bold">{c.code}</td>
                                    <td className="p-4">{c.symbol}</td>
                                    <td className="p-4">{c.label}</td>
                                    <td className="p-4">{c.rate}</td>
                                    <td className="p-4">
                                        {c.isDefault ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-new/10 text-new">
                                                <Star className="w-3 h-3 fill-current" /> Default
                                            </span>
                                        ) : (
                                            <button onClick={() => setDefault(c.id)} className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 hover:bg-gray-200">
                                                Set default
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-primary/5 text-primary"><Pencil className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => remove(c.id)}
                                                disabled={c.isDefault}
                                                title={c.isDefault ? 'Set another currency as default before deleting this one' : 'Delete'}
                                                className="p-2 rounded-lg hover:bg-hot/10 text-hot disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
