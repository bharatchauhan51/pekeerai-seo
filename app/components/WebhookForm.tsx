'use client';

import { useState } from 'react';
import {
    X, Loader2, Globe, Lock, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import { WebhookConfig, WebhookCreateData } from '../lib/api';

interface WebhookFormProps {
    webhook?: WebhookConfig | null;
    onSubmit: (data: WebhookCreateData) => Promise<{ success: boolean; error?: string }>;
    onClose: () => void;
    isSaving: boolean;
}

export default function WebhookForm({ webhook, onSubmit, onClose, isSaving }: WebhookFormProps) {
    const isEditing = !!webhook;

    const [name, setName] = useState(webhook?.name || '');
    const [url, setUrl] = useState(webhook?.url || '');
    const [basicUsername, setBasicUsername] = useState('');
    const [basicPassword, setBasicPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const validate = (): boolean => {
        if (!name.trim()) { setError('Webhook name is required.'); return false; }
        if (!url.trim()) { setError('Webhook URL is required.'); return false; }

        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:' && !parsed.hostname.includes('localhost') && parsed.hostname !== '127.0.0.1') {
                setError('Webhook URL must use HTTPS. HTTP is only allowed for localhost.');
                return false;
            }
        } catch {
            setError('Please enter a valid URL.');
            return false;
        }

        if (!isEditing && (!basicUsername.trim() || !basicPassword.trim())) {
            setError('Username and password are required.');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const data: WebhookCreateData = {
            name: name.trim(),
            url: url.trim(),
        };

        if (basicUsername.trim()) data.basicUsername = basicUsername.trim();
        if (basicPassword.trim()) data.basicPassword = basicPassword.trim();

        const result = await onSubmit(data);
        if (!result.success && result.error) {
            setError(result.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {isEditing ? 'Edit Webhook' : 'Add Webhook'}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            {isEditing ? 'Update your webhook configuration' : 'Configure a new webhook endpoint'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                            Webhook Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all placeholder:text-neutral-600"
                            placeholder="e.g. My WordPress Site"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                            Webhook URL
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all placeholder:text-neutral-600"
                                placeholder="https://your-site.com/api/content"
                            />
                        </div>
                    </div>

                    {/* Basic Auth */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Lock size={14} className="text-lime-400" />
                            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                Authentication — Basic Auth
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Username</label>
                                <input
                                    type="text"
                                    value={basicUsername}
                                    onChange={(e) => setBasicUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all placeholder:text-neutral-600"
                                    placeholder={isEditing ? '(keep current)' : 'Username'}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={basicPassword}
                                        onChange={(e) => setBasicPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all placeholder:text-neutral-600"
                                        placeholder={isEditing ? '(keep current)' : 'Password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {isEditing && webhook?.authConfigured && (
                            <p className="text-[11px] text-neutral-600 mt-2">
                                Credentials are already configured. Leave blank to keep existing.
                            </p>
                        )}
                        <p className="text-[11px] text-neutral-600 mt-2">
                            Sent as <code className="px-1 py-0.5 bg-white/5 rounded">Authorization: Basic &lt;base64(username:password)&gt;</code> on every delivery.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
                            <AlertTriangle size={14} className="text-red-400 shrink-0" />
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold text-sm rounded-full transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold text-sm rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <><Loader2 size={16} className="animate-spin" /> Saving...</>
                        ) : isEditing ? (
                            'Update Webhook'
                        ) : (
                            'Create Webhook'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
