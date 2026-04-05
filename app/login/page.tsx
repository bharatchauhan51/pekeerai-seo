'use client';

import { Suspense, useState, FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [banner, setBanner] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const { login, isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, authLoading, router]);

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

    // Read verification query params from email redirect
    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setBanner('Email verified! You can now log in.');
        }
    }, [searchParams]);

    const handleResend = async () => {
        if (!email || cooldown > 0) {
            if (!email) setError('Please enter your email address to resend verification.');
            return;
        }
        setIsResending(true);
        setResendMessage('');
        const { error: resendError, status } = await authApi.resendVerification(email);
        setIsResending(false);
        if (status === 429) {
            setResendMessage('Too many attempts. Please try again later.');
        } else if (resendError) {
            setResendMessage(resendError);
        } else {
            setResendMessage('Verification email sent. Check your inbox.');
            setCooldown(120);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setNeedsVerification(false);
        setResendMessage('');
        setBanner(null);

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else if (result.code === 'EMAIL_NOT_VERIFIED') {
            setNeedsVerification(true);
            setError('Please verify your email address before logging in.');
        } else {
            setError(result.error || 'Invalid credentials. Please try again.');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        );
    }

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

            {/* Login Form */}
            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Welcome <span className="text-lime-400">Back</span></h1>
                        <p className="text-neutral-400">Log in to your PekkerAI dashboard to continue creating SEO-optimized content.</p>
                    </div>

                    {/* Verification success banner */}
                    {banner && (
                        <div className="flex items-center gap-3 rounded-xl px-5 py-4 mb-4 text-sm font-medium bg-lime-400/10 text-lime-400 border border-lime-400/20">
                            <CheckCircle size={18} />
                            {banner}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                        {/* Resend verification */}
                        {needsVerification && (
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={isResending || cooldown > 0}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 text-white font-semibold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    {isResending ? (
                                        <><Loader2 size={14} className="animate-spin" /> Sending...</>
                                    ) : cooldown > 0 ? (
                                        <>Resend in {formatCooldown(cooldown)}</>
                                    ) : (
                                        <>Resend Verification Email</>
                                    )}
                                </button>
                                {resendMessage && (
                                    <p className="text-lime-400 text-xs text-center">{resendMessage}</p>
                                )}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
                        >
                            {isLoading ? (
                                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                            ) : (
                                <>Log In <ArrowRight size={18} /></>
                            )}
                        </button>


                    </form>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-lime-400 hover:text-lime-300 font-semibold transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
