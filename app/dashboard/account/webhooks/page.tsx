'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles, LogOut, ChevronRight, Loader2, Plus, Webhook,
    Menu, X, Plug
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
    webhookApi, WebhookConfig, WebhookCreateData, WebhookTestResult
} from '../../../lib/api';
import WebhookCard from '../../../components/WebhookCard';
import WebhookForm from '../../../components/WebhookForm';
import WebhookDocumentation from '../../../components/WebhookDocumentation';

export default function WebhooksPage() {
    const { user, isLoggedIn, isLoading, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Data
    const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form
    const [showForm, setShowForm] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    // Fetch webhooks
    const fetchWebhooks = async (showLoader = true) => {
        if (showLoader) setDataLoading(true);
        const { data } = await webhookApi.list();
        if (data) setWebhooks(
            Array.isArray(data.webhooks)
                ? (data.webhooks as (WebhookConfig | null | undefined)[]).filter((w): w is WebhookConfig => !!w && typeof w === 'object' && 'id' in w)
                : []
        );
        if (showLoader) setDataLoading(false);
    };

    useEffect(() => {
        if (!isLoggedIn) return;
        fetchWebhooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    // Create / Update webhook
    const handleSubmit = async (formData: WebhookCreateData): Promise<{ success: boolean; error?: string }> => {
        setIsSaving(true);
        let error: string | undefined;
        if (editingWebhook) {
            const result = await webhookApi.update(editingWebhook.id, formData);
            error = result.error;
        } else {
            const result = await webhookApi.create(formData);
            error = result.error;
        }
        setIsSaving(false);
        if (error) return { success: false, error };
        setShowForm(false);
        setEditingWebhook(null);
        await fetchWebhooks(false);
        return { success: true };
    };

    // Delete webhook
    const handleDelete = async (webhook: WebhookConfig) => {
        const { error } = await webhookApi.delete(webhook.id);
        if (!error) {
            setWebhooks(prev => prev.filter(w => w && w.id !== webhook.id));
        }
    };

    // Test webhook
    const handleTest = async (webhookId: number): Promise<WebhookTestResult | null> => {
        const { data } = await webhookApi.test(webhookId);
        if (data) {
            setWebhooks(prev => prev.map(w => {
                if (!w || w.id !== webhookId) return w;
                return {
                    ...w,
                    lastTestedAt: new Date().toISOString(),
                    lastTestStatus: data.success ? 'success' as const : 'failed' as const,
                };
            }));
        }
        return data ?? null;
    };

    // Edit
    const handleEdit = (webhook: WebhookConfig) => {
        setEditingWebhook(webhook);
        setShowForm(true);
    };

    if (isLoading || !isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-lime-400/20 selection:text-lime-300">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={17} className="text-black" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">PekkerAI</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 text-sm">
                        <Link href="/dashboard" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Dashboard</Link>
                        <Link href="/dashboard/account" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Account</Link>
                        <Link href="/dashboard/account/webhooks" className="px-3.5 py-2 rounded-lg text-white bg-white/[0.06] font-semibold transition-colors">Integrations</Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <div className="w-px h-6 bg-white/10 hidden sm:block mr-1" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-black flex items-center justify-center text-xs font-bold ring-2 ring-lime-400/20">
                                {user?.avatar}
                            </div>
                            <div className="hidden lg:block">
                                <div className="text-sm font-semibold text-white leading-tight">{user?.name}</div>
                                <div className="text-[11px] text-neutral-500 leading-tight">{user?.plan} Plan</div>
                            </div>
                            <button onClick={() => { logout(); router.push('/login'); }} className="ml-1 text-neutral-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="Log out" title="Sign out">
                                <LogOut size={16} />
                            </button>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
                        <div className="px-4 py-3 flex flex-col gap-1">
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Dashboard</Link>
                            <Link href="/dashboard/account" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Account</Link>
                            <Link href="/dashboard/account/webhooks" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-white bg-white/[0.06] font-semibold text-sm">Integrations</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <ChevronRight size={12} />
                    <Link href="/dashboard/account" className="hover:text-white transition-colors">Account</Link>
                    <ChevronRight size={12} />
                    <span className="text-lime-400 font-semibold">Integrations</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                            <span className="text-lime-400">Webhook</span> Integrations
                        </h1>
                        <p className="text-neutral-400 text-sm">
                            Configure webhook endpoints to automatically publish your articles.
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingWebhook(null); setShowForm(true); }}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm rounded-full transition-all active:scale-95 shrink-0"
                    >
                        <Plus size={16} /> Add Webhook
                    </button>
                </div>

                {dataLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-lime-400" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Webhook List */}
                        {webhooks.length === 0 ? (
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-lime-400/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <Plug size={28} className="text-lime-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No Webhooks Configured</h3>
                                <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
                                    Set up your first webhook to start publishing articles automatically.
                                    PekkerAI will POST your generated content to your endpoint at the scheduled time.
                                </p>
                                <button
                                    onClick={() => { setEditingWebhook(null); setShowForm(true); }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm rounded-full transition-all active:scale-95"
                                >
                                    <Plus size={16} /> Create Your First Webhook
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                {webhooks.map(webhook => (
                                    <WebhookCard
                                        key={webhook.id}
                                        webhook={webhook}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onTest={handleTest}
                                    />
                                ))}
                            </div>
                        )}

                        {/* How It Works Summary */}
                        {webhooks.length > 0 && (
                            <div className="bg-gradient-to-r from-lime-400/[0.03] to-transparent border border-lime-400/10 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 bg-lime-400/10 rounded-xl flex items-center justify-center">
                                        <Webhook size={18} className="text-lime-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Ready to Schedule</h3>
                                        <p className="text-[11px] text-neutral-500">Your webhooks are configured. Go create an article and schedule it!</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Link
                                        href="/dashboard/new"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
                                    >
                                        Create New Article <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Documentation */}
                        <WebhookDocumentation />
                    </>
                )}

                {/* Footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600 py-4 border-t border-white/5">
                    <span className="text-center sm:text-left">Logged in as <strong className="text-neutral-400">{user?.email}</strong> · {user?.plan} Plan</span>
                    <span>PekkerAI Dashboard v1.0</span>
                </div>
            </main>

            {/* Create/Edit Webhook Modal */}
            {showForm && (
                <WebhookForm
                    webhook={editingWebhook}
                    onSubmit={handleSubmit}
                    onClose={() => { setShowForm(false); setEditingWebhook(null); }}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}
