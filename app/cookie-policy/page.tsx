import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronLeft, Cookie, Settings, Eye, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cookie Policy | PekkerAI - SEO Article Generator',
    description: "Read the PekkerAI Cookie Policy. We explain what cookies we use, why we use them, and how you can manage your preferences on our AI SEO platform.",
    keywords: ['cookie policy', 'cookies', 'pekkerai cookies', 'tracking policy', 'data preferences'],
    openGraph: {
        title: 'Cookie Policy | PekkerAI',
        description: "Read the PekkerAI Cookie Policy. We explain what cookies are and how we use them.",
        url: 'https://pekkerai.com/cookie-policy',
        type: 'website',
    },
    alternates: {
        canonical: 'https://pekkerai.com/cookie-policy',
    },
};

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans selection:bg-lime-400/20 selection:text-lime-300">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg">
                        <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">PekkerAI</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                </div>
            </nav>

            {/* Content Container */}
            <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
                <article className="prose prose-invert prose-lime w-full max-w-none">
                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-4 text-sm text-lime-400 font-medium tracking-tight mb-4 mt-4">
                            <span className="bg-lime-400/10 px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-bold">Legal</span>
                            <span className="text-neutral-500">•</span>
                            <span className="text-neutral-400">Last Updated: February 2026</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            Cookie Policy
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Clear, simple information about how we use cookies and tracking technologies.
                        </p>
                    </header>

                    <div className="bg-lime-400/5 border border-lime-400/20 p-6 sm:p-8 rounded-2xl my-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-lime-400"></div>
                        <p className="m-0 text-white font-medium text-lg leading-relaxed flex items-start gap-3">
                            <Cookie className="text-lime-400 shrink-0 mt-1" size={24} />
                            <span>
                                <strong>The TL;DR:</strong> We use strictly necessary cookies to keep you logged in and functional cookies to remember your preferences. We use minimal analytics to understand how our tool is used. We respect your privacy and don't use aggressive third-party advertising trackers.
                            </span>
                        </p>
                    </div>

                    <div className="space-y-12 text-neutral-300 text-lg leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <ShieldCheck className="text-lime-400" size={24} /> 1. What are Cookies?
                            </h2>
                            <p className="mb-4">
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or work more efficiently, as well as to provide reporting information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <Settings className="text-lime-400" size={24} /> 2. Types of Cookies We Use
                            </h2>
                            <p className="mb-4">
                                We use different types of cookies on PekkerAI for specific purposes:
                            </p>

                            <div className="space-y-6 mt-6">
                                <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
                                    <h3 className="text-white font-bold text-lg mb-2 mt-0">Essential / Strictly Necessary Cookies</h3>
                                    <p className="text-base text-neutral-400 mb-0">
                                        These cookies are essential to provide you with services available through our website and to enable you to use some of its features. For example, they allow you to log in to secure areas of the platform (like your dashboard) and protect against cross-site request forgery attacks.
                                    </p>
                                </div>

                                <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
                                    <h3 className="text-white font-bold text-lg mb-2 mt-0">Functionality / Preference Cookies</h3>
                                    <p className="text-base text-neutral-400 mb-0">
                                        We use these to remember choices you make when you use the website, such as remembering your tone or audience preferences when generating SEO articles, or remembering your theme (light/dark) settings.
                                    </p>
                                </div>

                                <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
                                    <h3 className="text-white font-bold text-lg mb-2 mt-0">Analytics / Performance Cookies</h3>
                                    <p className="text-base text-neutral-400 mb-0">
                                        These cookies gather information on how visitors use our website and app. We use this data to understand traffic sources, which features are most popular, and identify issues. All information these cookies collect is aggregated and therefore anonymous.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <Eye className="text-lime-400" size={24} /> 3. How to Manage Your Cookies
                            </h2>
                            <p className="mb-4">
                                You have the right to decide whether to accept or reject non-essential cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject essential cookies, you may still use our website, though your access to some functionality and areas of our website (such as the main dashboard) may be restricted.
                            </p>
                            <p className="mb-4 text-sm text-neutral-400">
                                * To learn more about how to manage cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:text-lime-300 transition-colors">allaboutcookies.org</a>.
                            </p>
                        </section>

                        <section className="bg-[#111] border border-white/10 p-8 rounded-2xl mt-12 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 mt-0">Contact Us</h3>
                            <p className="mb-0">
                                If you have any questions about our use of cookies or other technologies, please email us at: <a href="mailto:hello@pekkerai.com" className="text-lime-400 hover:text-lime-300 transition-colors">hello@pekkerai.com</a>
                            </p>
                        </section>
                    </div>

                </article>
            </main>
        </div>
    );
}
