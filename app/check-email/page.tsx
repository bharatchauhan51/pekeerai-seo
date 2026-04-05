'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { authApi } from '../lib/api';

export default function CheckEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        }>
            <CheckEmailContent />
        </Suspense>
    );
}

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const formatCooldown = useCallback((s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }, []);

    const handleResend = async () => {
        if (!email || cooldown > 0) return;
        setIsResending(true);
        setResendMessage(null);
        const { error, status } = await authApi.resendVerification(email);
        setIsResending(false);
        if (status === 429) {
            setResendMessage({ type: 'error', text: 'Too many attempts. Please try again later.' });
        } else if (error) {
            setResendMessage({ type: 'error', text: error });
        } else {
            setResendMessage({ type: 'success', text: 'Verification email sent. Check your inbox.' });
            setCooldown(120);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white flex flex-col selection:bg-lime-400/20 selection:text-lime-300 relative overflow-hidden">
            {/* Background ambience */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-lime-500/8 blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="p-6">
                <Link href="/" className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg">
                    <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
                        <Sparkles size={20} className="text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">PekkerAI</span>
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto">
                            <Mail size={32} className="text-lime-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Check Your <span className="text-lime-400">Email</span></h1>
                            <p className="text-neutral-400 leading-relaxed">
                                We&apos;ve sent a verification email to{' '}
                                {email ? <strong className="text-white">{email}</strong> : 'your email address'}.
                                Click the link to activate your account.
                            </p>
                        </div>

                        <div className="pt-2 space-y-3">
                            <button
                                onClick={handleResend}
                                disabled={isResending || !email || cooldown > 0}
                                className="w-full py-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 text-white font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                            >
                                {isResending ? (
                                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                                ) : cooldown > 0 ? (
                                    <>Resend in {formatCooldown(cooldown)}</>
                                ) : (
                                    <>Resend Verification Email</>
                                )}
                            </button>

                            {resendMessage && (
                                <div className={`flex items-center justify-center gap-2 text-sm ${resendMessage.type === 'success' ? 'text-lime-400' : 'text-red-400'}`}>
                                    {resendMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                    <span>{resendMessage.text}</span>
                                </div>
                            )}

                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-lime-400 transition-colors mt-2"
                            >
                                <ArrowLeft size={14} /> Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
