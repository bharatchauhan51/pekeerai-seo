'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles, LogOut, ChevronRight, Check, X, Loader2,
    CreditCard, FileText, Crown, Zap, Shield, AlertTriangle,
    Calendar, ArrowUpRight, Download, Clock, Star, Infinity, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    billingApi, authApi,
    SubscriptionResponse, PlanItem, InvoiceItem
} from '../../lib/api';

export default function AccountPage() {
    const { user, isLoggedIn, isLoading, logout, refreshUser } = useAuth();
    const router = useRouter();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // API data states
    const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [dataLoading, setDataLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [isChangingPlan, setIsChangingPlan] = useState(false);

    // Profile form state
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profileCompany, setProfileCompany] = useState('');

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    // Fetch all account data
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchData = async () => {
            setDataLoading(true);
            const [subRes, plansRes, invoicesRes] = await Promise.all([
                billingApi.subscription(),
                billingApi.plans(),
                billingApi.invoices(),
            ]);

            if (subRes.data) setSubscription(subRes.data);
            if (plansRes.data) setPlans(plansRes.data.plans);
            if (invoicesRes.data) {
                setInvoices(invoicesRes.data.invoices);
                setTotalPaid(invoicesRes.data.totalPaid);
            }
            setDataLoading(false);
        };

        fetchData();

        // Initialize profile form
        if (user) {
            setProfileName(user.name || '');
            setProfileEmail(user.email || '');
            setProfileCompany(user.company || '');
        }
    }, [isLoggedIn, user]);

    if (isLoading || !isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        );
    }

    const usagePercent = subscription ? Math.round((subscription.articlesUsed / subscription.articlesLimit) * 100) : 0;

    const handleCancelPlan = async () => {
        setIsCancelling(true);
        const { data, error } = await billingApi.cancel(cancelConfirm);
        setIsCancelling(false);
        if (!error && data) {
            setShowCancelModal(false);
            setCancelConfirm('');
            // Refresh subscription data
            const subRes = await billingApi.subscription();
            if (subRes.data) setSubscription(subRes.data);
            await refreshUser();
        }
    };

    const handleChangePlan = async (planId: string) => {
        setIsChangingPlan(true);
        const { error } = await billingApi.changePlan(planId);
        setIsChangingPlan(false);
        if (!error) {
            setShowUpgradeModal(null);
            // Refresh all data
            const [subRes, plansRes] = await Promise.all([
                billingApi.subscription(),
                billingApi.plans(),
            ]);
            if (subRes.data) setSubscription(subRes.data);
            if (plansRes.data) setPlans(plansRes.data.plans);
            await refreshUser();
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        const { error } = await authApi.updateProfile({
            name: profileName,
            email: profileEmail,
            company: profileCompany,
        });
        setIsSavingProfile(false);
        if (!error) {
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2000);
            await refreshUser();
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            await authApi.deleteAccount();
            logout();
            router.push('/');
        }
    };

    const handleExportCsv = async () => {
        const { data } = await billingApi.exportCsv();
        if (data) {
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pekkerai-invoices.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const currentPlanName = subscription?.plan || user?.plan || '';
    const selectedUpgradePlan = plans.find(p => p.name === showUpgradeModal);

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
                        <Link href="/dashboard/account" className="px-3.5 py-2 rounded-lg text-white bg-white/[0.06] font-semibold transition-colors">Account</Link>
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
                            <Link href="/dashboard/account" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-white bg-white/[0.06] font-semibold text-sm">Account</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <ChevronRight size={12} />
                    <span className="text-lime-400 font-semibold">Account & Billing</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Account & <span className="text-lime-400">Billing</span></h1>
                    <p className="text-neutral-400 text-sm">Manage your subscription, track usage, and view payment history.</p>
                </div>

                {dataLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-lime-400" size={32} />
                    </div>
                ) : (
                    <>
                        {/* ─── Current Plan + Usage ─── */}
                        {subscription && (
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Current Plan Card */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Crown size={18} className="text-lime-400" />
                                            <span className="text-xs font-bold text-lime-400 uppercase tracking-widest">Current Plan</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-4xl font-bold text-white">${subscription.price}</span>
                                            <span className="text-neutral-500 text-sm">/{subscription.interval}</span>
                                        </div>
                                        <div className="text-xl font-bold text-white mb-4">{subscription.plan} Plan</div>
                                        <div className="space-y-2 text-xs text-neutral-400">
                                            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                                                <span className="flex items-center gap-2"><Calendar size={12} /> Billing cycle</span>
                                                <span className="text-white font-medium capitalize">{subscription.interval}ly</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                                                <span className="flex items-center gap-2"><Clock size={12} /> Next renewal</span>
                                                <span className="text-white font-medium">{subscription.renewalDate}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                                                <span className="flex items-center gap-2"><CreditCard size={12} /> Payment method</span>
                                                <span className="text-white font-medium">{subscription.paymentMethod}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5">
                                                <span className="flex items-center gap-2"><Shield size={12} /> Member since</span>
                                                <span className="text-white font-medium">{subscription.memberSince}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Stats */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <FileText size={18} className="text-lime-400" />
                                            <span className="text-base font-bold text-white">Article Usage</span>
                                        </div>
                                        <span className="text-xs text-neutral-500">Resets {subscription.renewalDate}</span>
                                    </div>
                                    <div className="flex items-end gap-4 mb-6">
                                        <div>
                                            <div className="text-5xl font-bold text-white">{subscription.articlesLimit - subscription.articlesUsed}</div>
                                            <div className="text-sm text-neutral-500 mt-1">articles remaining</div>
                                        </div>
                                        <div className="text-sm text-neutral-500 mb-1">
                                            <span className="text-white font-semibold">{subscription.articlesUsed}</span> of {subscription.articlesLimit} used this cycle
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${usagePercent >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                                    usagePercent >= 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                                                        'bg-gradient-to-r from-lime-500 to-emerald-400'
                                                    }`}
                                                style={{ width: `${usagePercent}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
                                            <span>{usagePercent}% used</span>
                                            <span>{subscription.articlesLimit - subscription.articlesUsed} left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── Upgrade Plans ─── */}
                        {plans.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <Zap size={20} className="text-lime-400" />
                                    <h2 className="text-xl font-bold text-white">Upgrade Your Plan</h2>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {plans.map((plan) => {
                                        const isCurrent = plan.name === currentPlanName;
                                        const isUpgrade = plan.price > (subscription?.price || 0);
                                        return (
                                            <div
                                                key={plan.id}
                                                className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 ${isCurrent
                                                    ? 'border-lime-400/40 ring-1 ring-lime-400/20 shadow-[0_0_30px_rgba(163,230,53,0.06)]'
                                                    : 'border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                {isCurrent && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                                        Current Plan
                                                    </div>
                                                )}
                                                <div className="mb-4 pt-1">
                                                    <div className="text-lg font-bold text-white">{plan.name}</div>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                                                        <span className="text-neutral-500 text-sm">/{plan.interval}</span>
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                                        {plan.articlesPerMonth === -1 ? (
                                                            <><Infinity size={12} /> Unlimited articles</>
                                                        ) : (
                                                            <><FileText size={12} /> {plan.articlesPerMonth} articles / month</>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2.5 mb-6">
                                                    {plan.features.map((feature, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                                                            <Check size={14} className={isCurrent ? 'text-lime-400' : 'text-neutral-600'} />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>
                                                {isCurrent ? (
                                                    <div className="w-full py-2.5 text-center text-sm font-semibold text-lime-400 bg-lime-400/10 rounded-full">
                                                        Current Plan
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowUpgradeModal(plan.name)}
                                                        className={`w-full py-2.5 text-center text-sm font-bold rounded-full transition-all active:scale-95 ${isUpgrade
                                                            ? 'bg-lime-400 hover:bg-lime-300 text-black'
                                                            : 'border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                                            }`}
                                                    >
                                                        {isUpgrade ? 'Upgrade' : 'Downgrade'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ─── Payment History ─── */}
                        <div className="mb-8">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={18} className="text-lime-400" />
                                        <h2 className="text-base font-bold text-white">Payment History</h2>
                                    </div>
                                    <button onClick={handleExportCsv} className="text-xs text-lime-400 font-semibold hover:text-lime-300 transition-colors flex items-center gap-1">
                                        <Download size={12} /> Export CSV
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-xs text-neutral-500 uppercase tracking-wider border-b border-white/5">
                                                <th className="text-left p-4 font-bold">Invoice</th>
                                                <th className="text-left p-4 font-bold">Date</th>
                                                <th className="text-left p-4 font-bold">Plan</th>
                                                <th className="text-left p-4 font-bold">Payment Method</th>
                                                <th className="text-center p-4 font-bold">Status</th>
                                                <th className="text-right p-4 font-bold">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {invoices.length === 0 ? (
                                                <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No invoices yet.</td></tr>
                                            ) : invoices.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-4">
                                                        <span className="font-mono text-xs text-neutral-400 group-hover:text-lime-400 transition-colors">{payment.id}</span>
                                                    </td>
                                                    <td className="p-4 text-neutral-400">{payment.date}</td>
                                                    <td className="p-4">
                                                        <span className="text-white font-medium">{payment.plan}</span>
                                                    </td>
                                                    <td className="p-4 text-neutral-400">{payment.paymentMethod}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400">
                                                            <Check size={10} /> {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-semibold text-white">${(payment.amount / 100).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
                                    <span>Showing {invoices.length} invoices</span>
                                    <span>Total paid: <strong className="text-white">${(totalPaid / 100).toFixed(2)}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Account Details & Danger Zone ─── */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Account Info */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                                    <Star size={18} className="text-lime-400" /> Account Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileEmail}
                                            onChange={(e) => setProfileEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            value={profileCompany}
                                            onChange={(e) => setProfileCompany(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSavingProfile}
                                        className={`w-full py-2.5 font-semibold text-sm rounded-full transition-all active:scale-95 mt-2 flex items-center justify-center gap-2 ${profileSaved
                                            ? 'bg-lime-400/20 text-lime-400'
                                            : 'bg-white/[0.06] hover:bg-white/[0.1] text-white'
                                            }`}
                                    >
                                        {isSavingProfile ? (
                                            <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                        ) : profileSaved ? (
                                            <><Check size={16} /> Saved!</>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white/[0.03] border border-red-500/15 rounded-2xl p-6">
                                <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-red-400" /> Danger Zone
                                </h2>
                                <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                                    Cancelling your plan will take effect at the end of your current billing period{subscription ? ` (${subscription.renewalDate})` : ''}.
                                    You will retain access to all features until then. Your content and data will not be deleted.
                                </p>

                                <div className="space-y-3">
                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                        <div className="text-sm font-semibold text-white mb-1">Cancel Subscription</div>
                                        <p className="text-xs text-neutral-500 mb-3">
                                            Your plan will remain active until {subscription?.renewalDate || 'the end of the billing period'}. After that, you&apos;ll be moved to a free tier with limited access.
                                        </p>
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="px-5 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm font-semibold rounded-full transition-all active:scale-95"
                                        >
                                            Cancel Plan
                                        </button>
                                    </div>
                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                        <div className="text-sm font-semibold text-white mb-1">Delete Account</div>
                                        <p className="text-xs text-neutral-500 mb-3">
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="px-5 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm font-semibold rounded-full transition-all active:scale-95"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600 py-4 border-t border-white/5">
                    <span className="text-center sm:text-left">Logged in as <strong className="text-neutral-400">{user?.email}</strong> · {user?.plan} Plan</span>
                    <span>PekkerAI Dashboard v1.0</span>
                </div>
            </main>

            {/* ─── Cancel Subscription Modal ─── */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => !isCancelling && setShowCancelModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle size={24} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Cancel Subscription</h3>
                                <p className="text-xs text-neutral-500">This will downgrade your account</p>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                            Your <strong className="text-white">{currentPlanName} Plan</strong> will remain active until <strong className="text-white">{subscription?.renewalDate}</strong>.
                            After that, you&apos;ll lose access to premium features.
                        </p>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                Type <span className="text-red-400">CANCEL</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={cancelConfirm}
                                onChange={(e) => setCancelConfirm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 placeholder:text-neutral-600"
                                placeholder="CANCEL"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelConfirm(''); }}
                                className="flex-1 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold text-sm rounded-full transition-all"
                            >
                                Keep Plan
                            </button>
                            <button
                                onClick={handleCancelPlan}
                                disabled={cancelConfirm !== 'CANCEL' || isCancelling}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isCancelling ? <><Loader2 size={16} className="animate-spin" /> Cancelling...</> : 'Cancel Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Upgrade Plan Modal ─── */}
            {showUpgradeModal && selectedUpgradePlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setShowUpgradeModal(null)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {selectedUpgradePlan.price > (subscription?.price || 0) ? 'Upgrade' : 'Downgrade'} to {showUpgradeModal}
                            </h3>
                            <button onClick={() => setShowUpgradeModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-neutral-400">Current plan</span>
                                <span className="text-sm font-semibold text-white">{currentPlanName} — ${subscription?.price}/mo</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-400">New plan</span>
                                <span className="text-sm font-semibold text-lime-400">
                                    {showUpgradeModal} — ${selectedUpgradePlan.price}/mo
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                            The change will take effect immediately. You&apos;ll be charged the prorated difference for the remainder of your billing cycle.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowUpgradeModal(null)}
                                className="flex-1 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold text-sm rounded-full transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleChangePlan(selectedUpgradePlan.id)}
                                disabled={isChangingPlan}
                                className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold text-sm rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isChangingPlan ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Confirm Change <ArrowUpRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
