'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    label?: string;
    icon?: React.ReactNode;
}

export default function CustomDropdown({ value, options, onChange, label, icon }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative group" ref={dropdownRef}>
            {label && (
                <label className="flex items-center gap-2 text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2.5 transition-colors group-hover:text-neutral-400">
                    {icon} {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:border-white/25 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-lime-400/30 ${
                    isOpen ? 'border-lime-400/40 ring-2 ring-lime-400/20 bg-black/60' : ''
                }`}
            >
                <span className="truncate">{selectedOption?.label || value}</span>
                <ChevronDown size={16} className={`text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-[#111]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar space-y-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-left transition-all duration-200 group/item ${
                                    value === option.value
                                        ? 'bg-lime-400/15 text-lime-400 font-bold'
                                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`truncate ${value === option.value ? 'ml-1' : ''} transition-all duration-200`}>
                                    {option.label}
                                </span>
                                {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />}
                                {value !== option.value && <ChevronDown size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 -rotate-90 text-neutral-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
