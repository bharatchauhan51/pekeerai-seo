'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Loader2, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { authApi } from '../lib/api';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || '';
    const [state, setState] = useState<'loading' | 'success' | 'expired' | 'invalid'>('loading');
    const [isResending, setIsResending] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const calledRef = useRef(false);

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

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        if (!token) {
            setState('invalid');
            return;
        }

        authApi.verifyEmail(token).then(({ error }) => {
            if (!error) {
                setState('success');
                setTimeout(() => router.push('/login?verified=true'), 2000);
            } else if (error.toLowerCase().includes('expired')) {
                setState('expired');
            } else {
                setState('invalid');
            }
        });
    }, [token, router]);

    const handleResend = async () => {
        if (!resendEmail || cooldown > 0) return;
        setIsResending(true);
        setResendMessage(null);
        const { error, status } = await authApi.resendVerification(resendEmail);
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

                        {/* Loading */}
                        {state === 'loading' && (
                            <>
                                <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto">
                                    <Loader2 size={32} className="text-lime-400 animate-spin" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Verifying Your <span className="text-lime-400">Email</span></h1>
                                    <p className="text-neutral-400">Please wait...</p>
                                </div>
                            </>
                        )}

                        {/* Success */}
                        {state === 'success' && (
                            <>
                                <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={32} className="text-lime-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Email <span className="text-lime-400">Verified!</span></h1>
                                    <p className="text-neutral-400">Your account is now active. Redirecting to login...</p>
                                </div>
                                <Link
                                    href="/login?verified=true"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm"
                                >
                                    Go to Login <ArrowRight size={16} />
                                </Link>
                            </>
                        )}

                        {/* Expired */}
                        {state === 'expired' && (
                            <>
                                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto">
                                    <AlertTriangle size={32} className="text-yellow-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Link <span className="text-yellow-400">Expired</span></h1>
                                    <p className="text-neutral-400">Your verification link has expired. Enter your email to receive a new one.</p>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all text-sm"
                                        placeholder="you@company.com"
                                    />
                                    <button
                                        onClick={handleResend}
                                        disabled={isResending || !resendEmail || cooldown > 0}
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
                                </div>
                            </>
                        )}

                        {/* Invalid */}
                        {state === 'invalid' && (
                            <>
                                <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto">
                                    <XCircle size={32} className="text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Invalid <span className="text-red-400">Link</span></h1>
                                    <p className="text-neutral-400">This verification link is invalid or has already been used.</p>
                                </div>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-all active:scale-95 text-sm"
                                >
                                    Back to Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
