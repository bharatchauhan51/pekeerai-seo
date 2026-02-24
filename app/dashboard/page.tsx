'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FileText, BarChart3, Calendar, TrendingUp, ChevronRight, Eye, Globe,
    Plus, Sparkles, Zap, PenLine, ArrowUpRight, Target, Loader2, LogOut,
    Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Dummy Metric Data ───
const STATS = [
    { label: 'Total Articles', value: '24', change: '+3 this week', icon: FileText, color: 'lime' },
    { label: 'Organic Traffic', value: '12.4K', change: '+18% vs last month', icon: TrendingUp, color: 'blue' },
    { label: 'Avg. SEO Score', value: '87', change: '+4 points', icon: Target, color: 'purple' },
    { label: 'Keywords Ranking', value: '142', change: '38 in top 10', icon: Globe, color: 'amber' },
];

const RECENT_ARTICLES = [
    { title: 'Does Google Penalize AI-Generated Content?', slug: '/blog/does-google-penalize-ai-generated-content', status: 'published', score: 92, date: 'Feb 22, 2025', views: '1,847' },
    { title: 'AI Content Pipeline for SEO: Complete Guide', slug: '#', status: 'published', score: 88, date: 'Feb 20, 2025', views: '956' },
    { title: '10 SEO Mistakes Founders Make in 2025', slug: '#', status: 'published', score: 91, date: 'Feb 17, 2025', views: '2,103' },
    { title: 'How to Outrank Competitors with AI Content', slug: '#', status: 'scheduled', score: 85, date: 'Feb 24, 2025', views: '—' },
    { title: 'E-E-A-T Guide for AI-Assisted Content', slug: '#', status: 'scheduled', score: 89, date: 'Feb 26, 2025', views: '—' },
    { title: 'Link Building Strategies for SaaS Startups', slug: '#', status: 'draft', score: 72, date: 'Feb 28, 2025', views: '—' },
];

const TOP_KEYWORDS = [
    { keyword: 'does google penalize ai content', position: 4, change: '+3', volume: '8.1K' },
    { keyword: 'ai content pipeline', position: 7, change: '+5', volume: '3.4K' },
    { keyword: 'ai seo writer tool', position: 12, change: '+8', volume: '2.9K' },
    { keyword: 'pekkerai review', position: 2, change: '0', volume: '590' },
    { keyword: 'automated blog writing ai', position: 9, change: '+2', volume: '1.8K' },
];

const TRAFFIC_BARS = [
    { day: 'Mon', value: 82 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 91 },
    { day: 'Thu', value: 74 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 45 },
    { day: 'Sun', value: 38 },
];

export default function DashboardPage() {
    const { user, isLoggedIn, isLoading, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

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
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={17} className="text-black" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">PekkerAI</span>
                    </Link>

                    {/* Center nav links */}
                    <div className="hidden md:flex items-center gap-1 text-sm">
                        <Link href="/dashboard" className="px-3.5 py-2 rounded-lg text-white bg-white/[0.06] font-semibold transition-colors">Dashboard</Link>
                        <Link href="/dashboard/account" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Account</Link>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="w-px h-6 bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-2.5 pl-1">
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
                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
                        <div className="px-4 py-3 flex flex-col gap-1">
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-white bg-white/[0.06] font-semibold text-sm">Dashboard</Link>
                            <Link href="/dashboard/account" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Account</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Welcome */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Welcome back, <span className="text-lime-400">{user?.name}</span>
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">Here's how your content is performing this week.</p>
                    </div>
                    <Link href="/dashboard/new" className="flex items-center justify-center gap-2 px-5 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm rounded-full transition-all active:scale-95 shrink-0">
                        <Plus size={16} /> Create New Article
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STATS.map((stat) => {
                        const Icon = stat.icon;
                        const colorMap: Record<string, string> = {
                            lime: 'bg-lime-400/10 text-lime-400',
                            blue: 'bg-blue-400/10 text-blue-400',
                            purple: 'bg-purple-400/10 text-purple-400',
                            amber: 'bg-amber-400/10 text-amber-400',
                        };
                        return (
                            <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/15 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-xs text-lime-400 font-medium bg-lime-400/5 px-2 py-1 rounded-full">{stat.change}</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-[10px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Recent Articles - Large */}
                    <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-base font-bold flex items-center gap-2"><FileText size={18} className="text-lime-400" /> Recent Articles</h2>
                            <Link href="/dashboard/new" className="text-xs text-lime-400 font-semibold hover:text-lime-300 transition-colors flex items-center gap-1">
                                Create New <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="divide-y divide-white/5">
                            {RECENT_ARTICLES.map((article, i) => (
                                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className={`w-1.5 h-10 rounded-full shrink-0 ${article.status === 'published' ? 'bg-lime-400' :
                                        article.status === 'scheduled' ? 'bg-blue-400' : 'bg-neutral-600'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <Link href={article.slug} className="text-sm font-semibold text-white truncate block group-hover:text-lime-400 transition-colors">
                                            {article.title}
                                        </Link>
                                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={11} /> {article.date}</span>
                                            <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                                            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${article.status === 'published' ? 'bg-lime-400/10 text-lime-400' :
                                                article.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'
                                                }`}>{article.status}</span>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold px-2.5 py-1 rounded-lg shrink-0 ${article.score >= 90 ? 'bg-lime-400/10 text-lime-400' :
                                        article.score >= 80 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'
                                        }`}>
                                        {article.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                            <h2 className="text-base font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-lime-400" /> Quick Actions</h2>
                            <div className="space-y-2">
                                <Link href="/dashboard/new" className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-lime-400/30 hover:bg-lime-400/[0.03] transition-all group">
                                    <div className="w-9 h-9 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400 group-hover:bg-lime-400/20 transition-colors"><PenLine size={16} /></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-white">Write New Article</div>
                                        <div className="text-xs text-neutral-500">Start with a keyword</div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-neutral-600 group-hover:text-lime-400 transition-colors" />
                                </Link>
                                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 transition-all group text-left">
                                    <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400"><BarChart3 size={16} /></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-white">View Analytics</div>
                                        <div className="text-xs text-neutral-500">In-depth traffic reports</div>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 transition-all group text-left">
                                    <div className="w-9 h-9 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400"><Calendar size={16} /></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-white">Content Calendar</div>
                                        <div className="text-xs text-neutral-500">Plan upcoming posts</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Weekly Traffic */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                            <h2 className="text-sm font-bold mb-5 flex items-center gap-2"><TrendingUp size={16} className="text-lime-400" /> This Week's Traffic</h2>
                            <div className="flex items-end justify-between gap-2 h-28">
                                {TRAFFIC_BARS.map((bar) => (
                                    <div key={bar.day} className="flex flex-col items-center gap-2 flex-1">
                                        <div className="w-full bg-white/5 rounded-full overflow-hidden" style={{ height: '80px' }}>
                                            <div
                                                className="w-full bg-gradient-to-t from-lime-500 to-lime-400 rounded-full transition-all duration-500 hover:opacity-80"
                                                style={{ height: `${bar.value}%`, marginTop: `${100 - bar.value}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-neutral-500 font-medium">{bar.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Keywords Table */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <h2 className="text-base font-bold flex items-center gap-2"><Target size={18} className="text-lime-400" /> Top Ranking Keywords</h2>
                        <span className="text-xs text-neutral-500">Updated 2 hours ago</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-neutral-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="text-left p-4 font-bold">Keyword</th>
                                    <th className="text-center p-4 font-bold">Position</th>
                                    <th className="text-center p-4 font-bold">Change</th>
                                    <th className="text-right p-4 font-bold">Monthly Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {TOP_KEYWORDS.map((kw, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-medium text-white">{kw.keyword}</td>
                                        <td className="p-4 text-center">
                                            <span className={`font-bold px-2 py-0.5 rounded-lg ${kw.position <= 3 ? 'bg-lime-400/10 text-lime-400' :
                                                kw.position <= 10 ? 'bg-yellow-400/10 text-yellow-400' : 'text-neutral-400'
                                                }`}>{kw.position}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-sm font-bold ${kw.change.startsWith('+') ? 'text-lime-400' : 'text-neutral-500'
                                                }`}>{kw.change === '0' ? '—' : kw.change}</span>
                                        </td>
                                        <td className="p-4 text-right text-neutral-400">{kw.volume}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Account info footer */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600 py-4 border-t border-white/5">
                    <span className="text-center sm:text-left">Logged in as <strong className="text-neutral-400">{user?.email}</strong> · {user?.plan} Plan</span>
                    <span>PekkerAI Dashboard v1.0</span>
                </div>
            </main>
        </div>
    );
}
