'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, User, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, authLoading, router]);

    const passwordChecks = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    ];

    const allChecksMet = passwordChecks.every(c => c.met);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        if (!allChecksMet) {
            setError('Please meet all password requirements.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        const result = await register(name.trim(), email, password);
        setIsLoading(false);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
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

            {/* Signup Form */}
            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Create Your <span className="text-lime-400">Account</span></h1>
                        <p className="text-neutral-400">Start generating SEO-optimized articles in minutes. No credit card required.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="signup-name" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="signup-email" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="signup-email"
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
                            <label htmlFor="signup-password" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
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

                            {/* Password strength indicators */}
                            {password.length > 0 && (
                                <div className="mt-3 space-y-1.5">
                                    {passwordChecks.map((check, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${check.met ? 'bg-lime-400/20 text-lime-400' : 'bg-white/5 text-neutral-600'}`}>
                                                {check.met && <Check size={10} strokeWidth={3} />}
                                            </div>
                                            <span className={check.met ? 'text-lime-400' : 'text-neutral-500'}>{check.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="signup-confirm-password" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    id="signup-confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3.5 bg-black/40 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 transition-all ${confirmPassword && confirmPassword !== password
                                        ? 'border-red-400/50 focus:border-red-400/50'
                                        : confirmPassword && confirmPassword === password
                                            ? 'border-lime-400/30 focus:border-lime-400/30'
                                            : 'border-white/10 focus:border-lime-400/30'
                                        }`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
                            )}
                        </div>

                        {/* Error */}
                        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
                        >
                            {isLoading ? (
                                <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-neutral-500 text-center pt-1 leading-relaxed">
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-neutral-400 hover:text-lime-400 underline underline-offset-2 transition-colors">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-neutral-400 hover:text-lime-400 underline underline-offset-2 transition-colors">Privacy Policy</Link>.
                        </p>
                    </form>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-lime-400 hover:text-lime-300 font-semibold transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
