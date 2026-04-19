'use client';

import { useState } from 'react';
import {
    Globe, Lock, Play, Pencil, Trash2, Loader2, Check, X,
    Clock, History, ChevronDown, ChevronUp, AlertTriangle,
    Package, FileText
} from 'lucide-react';
import { WebhookConfig, WebhookTestResult, WebhookHistoryItem, webhookApi } from '../lib/api';

interface WebhookCardProps {
    webhook: WebhookConfig;
    onEdit: (webhook: WebhookConfig) => void;
    onDelete: (webhook: WebhookConfig) => void;
    onTest: (webhookId: number) => Promise<WebhookTestResult | null>;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

function HistoryPanel({ webhookId }: { webhookId: number }) {
    const [items, setItems] = useState<WebhookHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [expandedPayload, setExpandedPayload] = useState<number | null>(null);

    const load = async () => {
        if (loaded) return;
        setLoading(true);
        const { data } = await webhookApi.history(webhookId, { limit: 20 });
        if (data) setItems(Array.isArray(data.history) ? data.history.filter(Boolean) : []);
        setLoading(false);
        setLoaded(true);
    };

    // Trigger load on first render of this panel
    if (!loaded && !loading) {
        load();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="animate-spin text-lime-400" />
            </div>
        );
    }

    if (loaded && items.length === 0) {
        return (
            <div className="text-center py-8">
                <Package size={24} className="text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500">No delivery attempts yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => {
                const isExpanded = expandedPayload === item.id;
                const statusColor = item.status === 'success'
                    ? 'text-lime-400 bg-lime-400/10 border-lime-400/20'
                    : item.status === 'timeout'
                        ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                        : 'text-red-400 bg-red-400/10 border-red-400/20';

                return (
                    <div key={item.id} className="bg-black/30 border border-white/5 rounded-xl overflow-hidden">
                        <div className="flex items-start gap-3 px-4 py-3">
                            {/* Status dot */}
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                                item.status === 'success' ? 'bg-lime-400' :
                                item.status === 'timeout' ? 'bg-amber-400' : 'bg-red-400'
                            }`} />

                            <div className="flex-1 min-w-0">
                                {/* Article title + attempt */}
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-semibold text-white truncate max-w-[200px]" title={item.articleTitle}>
                                        {item.articleTitle}
                                    </span>
                                    {item.attemptNumber > 1 && (
                                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                                            Attempt #{item.attemptNumber}
                                        </span>
                                    )}
                                </div>

                                {/* Meta row */}
                                <div className="flex items-center gap-3 text-[11px] text-neutral-500 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} /> {formatDate(item.createdAt)}
                                    </span>
                                    {item.statusCode && (
                                        <span className="font-mono">{item.statusCode}</span>
                                    )}
                                    {item.responseTimeMs !== undefined && (
                                        <span>{item.responseTimeMs}ms</span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Error message */}
                                {item.errorMessage && (
                                    <p className="text-[11px] text-red-400/70 font-mono mt-1 truncate" title={item.errorMessage}>
                                        {item.errorMessage}
                                    </p>
                                )}
                            </div>

                            {/* Payload toggle */}
                            {item.payload && (
                                <button
                                    onClick={() => setExpandedPayload(isExpanded ? null : item.id)}
                                    className="shrink-0 flex items-center gap-1 text-[10px] text-neutral-500 hover:text-lime-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                                    title="View payload"
                                >
                                    <FileText size={12} />
                                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                            )}
                        </div>

                        {/* Expanded payload */}
                        {isExpanded && item.payload && (
                            <div className="border-t border-white/5 px-4 pb-3 pt-2">
                                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-2">Payload Sent</p>
                                <pre className="bg-black/50 rounded-lg p-3 overflow-x-auto text-[11px] text-neutral-400 font-mono leading-relaxed max-h-48">
                                    {JSON.stringify(item.payload, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function WebhookCard({ webhook, onEdit, onDelete, onTest }: WebhookCardProps) {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        const result = await onTest(webhook.id);
        setTestResult(result);
        setIsTesting(false);
    };

    const statusDot = webhook.lastTestStatus === 'success'
        ? 'bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.4)]'
        : webhook.lastTestStatus === 'failed'
            ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.4)]'
            : 'bg-neutral-600';

    const truncatedUrl = (() => {
        try {
            const u = new URL(webhook.url);
            const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + '...' : u.pathname;
            return `${u.host}${path}`;
        } catch {
            return webhook.url;
        }
    })();

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 group">
            <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className="relative mt-1.5 shrink-0">
                    <div className={`w-3 h-3 rounded-full ${statusDot}`} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white truncate">{webhook.name}</h3>
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-400/10 text-blue-400">
                            <Lock size={10} /> Basic Auth
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono truncate mb-2">
                        <Globe size={11} className="shrink-0" />
                        <span className="truncate" title={webhook.url}>{truncatedUrl}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                        {webhook.lastTestedAt && (
                            <span className="flex items-center gap-1">
                                <Clock size={11} />
                                Tested {timeAgo(webhook.lastTestedAt)}
                            </span>
                        )}
                        {webhook.lastTestStatus && (
                            <span className={`flex items-center gap-1 font-semibold ${
                                webhook.lastTestStatus === 'success' ? 'text-lime-400/70' : 'text-red-400/70'
                            }`}>
                                {webhook.lastTestStatus === 'success' ? <Check size={11} /> : <X size={11} />}
                                {webhook.lastTestStatus === 'success' ? 'Connected' : 'Failed'}
                            </span>
                        )}
                        {!webhook.lastTestStatus && (
                            <span className="text-neutral-600 italic">Never tested</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-2 rounded-lg transition-all ${showHistory ? 'text-lime-400 bg-lime-400/10' : 'text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10'}`}
                        title="Delivery history"
                    >
                        <History size={15} />
                    </button>
                    <button
                        onClick={handleTest}
                        disabled={isTesting}
                        className="p-2 rounded-lg text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10 transition-all disabled:opacity-40"
                        title="Test webhook"
                    >
                        {isTesting ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
                    </button>
                    <button
                        onClick={() => onEdit(webhook)}
                        className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-all"
                        title="Edit webhook"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete webhook"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Test Result */}
            {testResult && (
                <div className={`mt-4 p-3.5 rounded-xl border transition-all duration-300 animate-in fade-in ${
                    testResult.success
                        ? 'bg-lime-400/[0.03] border-lime-400/20'
                        : 'bg-red-400/[0.03] border-red-400/20'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {testResult.success ? (
                            <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center">
                                <Check size={14} className="text-lime-400" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center">
                                <X size={14} className="text-red-400" />
                            </div>
                        )}
                        <span className={`text-sm font-bold ${testResult.success ? 'text-lime-400' : 'text-red-400'}`}>
                            {testResult.success ? 'Test Successful' : 'Test Failed'}
                        </span>
                        {testResult.statusCode && (
                            <span className="text-xs text-neutral-500 font-mono ml-auto">
                                {testResult.statusCode} · {testResult.responseTime}ms
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{testResult.message}</p>
                    {!testResult.success && testResult.error && (
                        <div className="mt-2 space-y-1.5 text-[11px] text-neutral-500">
                            <p className="text-red-400/70 font-mono">{testResult.error}</p>
                            <div className="pt-2 border-t border-white/5 space-y-1">
                                <p>→ Verify the URL is correct and publicly accessible</p>
                                <p>→ Ensure your server is running and reachable</p>
                                <p>→ Check your username and password credentials</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setTestResult(null)}
                        className="mt-2 text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* History Panel */}
            {showHistory && (
                <div className="mt-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <History size={14} className="text-lime-400" />
                        <span className="text-xs font-bold text-white">Delivery History</span>
                        <span className="text-[10px] text-neutral-500 ml-auto">Last 20 attempts</span>
                    </div>
                    <HistoryPanel webhookId={webhook.id} />
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
                    <div className="flex items-start gap-2 mb-3">
                        <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-neutral-300">
                            Delete <strong className="text-white">{webhook.name}</strong>? Articles scheduled with this webhook will need a new one assigned.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 py-2 text-xs font-semibold text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onDelete(webhook); setShowDeleteConfirm(false); }}
                            className="flex-1 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-400 rounded-full transition-all active:scale-95"
                        >
                            Delete Webhook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
