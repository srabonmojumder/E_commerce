'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useSettings, useCurrencies } from '@/lib/hooks';
import { useCurrencyStore } from '@/store/useCurrencyStore';

/** Compact currency picker for the top utility bar — browsing display only. */
export default function CurrencySelector() {
    const { settings } = useSettings();
    const { currencies } = useCurrencies();
    const selectedCode = useCurrencyStore((s) => s.selectedCode);
    const setCurrency = useCurrencyStore((s) => s.setCurrency);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const activeCode = selectedCode || settings?.currencyCode || 'USD';
    const active = currencies.find((c) => c.code === activeCode);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    if (currencies.length < 2) return null;

    return (
        <div ref={ref} className="relative hidden sm:block">
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
            >
                <span>{active?.symbol ?? '$'} {active?.code ?? 'USD'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-44 py-1.5 bg-ink-900 border border-white/10 rounded-xl shadow-2xl z-[60]"
                    >
                        {currencies.map((opt) => (
                            <button
                                key={opt.code}
                                onClick={() => {
                                    setCurrency(opt.code === settings?.currencyCode ? null : opt.code);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-stone-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span>{opt.symbol} {opt.code} <span className="text-stone-500">— {opt.label}</span></span>
                                {opt.code === activeCode && <Check className="w-3.5 h-3.5 text-accent-400" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
