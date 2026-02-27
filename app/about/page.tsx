import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronLeft, Target, Rocket, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About PekkerAI | Built by Developers for Organic Traffic',
    description: "Learn about the story behind PekkerAI. Founded by a developer who faced the exact same problem: building great apps but struggling to bring organic traffic.",
    keywords: ['about pekkerai', 'founder story', 'seo tool for developers', 'bring traffic to app', 'organic growth tool', 'startup seo'],
    openGraph: {
        title: 'About PekkerAI | Built by Developers for Organic Traffic',
        description: "Founded by a developer who faced the exact same problem: building great apps but struggling to bring organic traffic.",
        url: 'https://pekkerai.com/about',
        type: 'website',
    },
    alternates: {
        canonical: 'https://pekkerai.com/about',
    },
};

export default function AboutPage() {
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

            {/* Article Container */}
            <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
                <article className="prose prose-invert prose-lime w-full max-w-none">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-lime-400 font-medium tracking-tight mb-6 mt-4">
                            <span className="bg-lime-400/10 px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-bold">Our Story</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            The Story Behind <span className="text-lime-400">PekkerAI</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                            Built for founders and developers who know how to code, but struggle to bring organic traffic to their apps.
                        </p>
                    </header>

                    <div className="bg-[#111] border border-white/10 p-8 sm:p-10 rounded-2xl my-10 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/5 rounded-full blur-[80px]"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mt-0 mb-4 flex items-center gap-3">
                                The Developer's Dilemma
                            </h2>
                            <p className="text-lg leading-relaxed mb-6">
                                If you're a developer, you know the feeling. You spend weeks or months building a beautiful, intuitive, and genuinely useful application. You write perfect code, ensure high performance, test every edge case, and deploy. You launch it, post about it on a few forums like Indie Hackers or Product Hunt, and then... crickets.
                            </p>
                            <div className="bg-lime-400/5 border-l-4 border-lime-400 p-6 rounded-r-2xl my-8">
                                <p className="text-lg italic font-medium text-white mb-0">
                                    "That's exactly how PekkerAI started. It was founded by a developer who faced the exact same problem: an endless struggle to bring traffic to their own apps. Building the product was easy; getting people to find it on Google felt impossible."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 text-neutral-300 text-lg leading-relaxed">
                        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why SEO Feels Broken for Indie Hackers</h2>
                        <p>
                            For most solo founders and small teams, traditional SEO is fundamentally broken. Trying to bridge the gap between building an app and acquiring steady traffic is frustrating. You either have to:
                        </p>

                        <div className="grid gap-4 my-8">
                            <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex gap-4 items-start">
                                <div className="text-neutral-500 font-mono text-sm mt-1">01</div>
                                <div>
                                    <strong className="text-white block mb-1">Write it yourself</strong>
                                    <span className="text-base text-neutral-400">Which takes hours of keyword research, outlining, competitive analysis, and drafting—time you should be spending on product development and bug fixes.</span>
                                </div>
                            </div>
                            <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex gap-4 items-start">
                                <div className="text-neutral-500 font-mono text-sm mt-1">02</div>
                                <div>
                                    <strong className="text-white block mb-1">Hire a freelancer</strong>
                                    <span className="text-base text-neutral-400">Which costs $100 to $500 per article, making it completely unaffordable for a bootstrapped project to build a meaningful content moat.</span>
                                </div>
                            </div>
                            <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex gap-4 items-start">
                                <div className="text-neutral-500 font-mono text-sm mt-1">03</div>
                                <div>
                                    <strong className="text-white block mb-1">Use generic AI tools</strong>
                                    <span className="text-base text-neutral-400">Which produce robotic, unformatted walls of text that don't respect SEO hierarchy, don't include proper metadata, and ultimately don't rank on SERPs.</span>
                                </div>
                            </div>
                        </div>

                        <p>
                            There was no middle ground. And that realization is what birthed PekkerAI. We realized developers didn't need just another chat bot—they needed a deterministic growth engine.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Building the Ultra-Lean Startup SEO Pipeline</h2>
                        <p>
                            We wanted a tool that solved the <em>actual</em> workflow problem. Not just another text generator, but a complete, optimized pipeline dedicated to scaling traffic organically.
                        </p>
                        <p>
                            We needed a system that could take a single keyword, analyze the top-ranking pages, extract the correct LSI keywords and header structures, and produce a publish-ready draft for roughly a dollar. PekkerAI is the exact tool we wished we had when we were struggling to get our first 1,000 organic visitors.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 my-10">
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center hover:border-lime-400/30 transition-colors">
                                <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="text-lime-400" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 mt-0">Laser Focused</h3>
                                <p className="text-sm text-neutral-400 m-0">No bloated dashboards. Just a straight path from keyword to published article.</p>
                            </div>
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center hover:border-lime-400/30 transition-colors">
                                <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="text-lime-400" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 mt-0">Developer Velocity</h3>
                                <p className="text-sm text-neutral-400 m-0">Designed to give you hours back every week so you can return to your codebase.</p>
                            </div>
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center hover:border-lime-400/30 transition-colors">
                                <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-lime-400" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 mt-0">Founder First</h3>
                                <p className="text-sm text-neutral-400 m-0">Priced per article, not per word. Built for predictable, sustainable startup economics.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Our Mission</h2>
                        <p>
                            Our mission is simple: to democratize organic search visibility for builders. We believe that if you can write brilliant code and build a product that solves a real problem, you shouldn't fail just because you can't afford an expensive SEO agency.
                        </p>
                        <p>
                            PekkerAI is here to level the playing field, making organic traffic accessible and actionable for everyday developers.
                        </p>
                    </div>

                    <hr className="border-white/10 my-16" />

                    {/* Dedicated CTA */}
                    <section className="bg-lime-400 text-black p-8 sm:p-12 rounded-3xl text-center shadow-[0_0_50px_rgba(163,230,53,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={120} /></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">Stop Stretching Yourself Thin</h3>
                            <p className="text-black/80 font-medium mb-8 max-w-xl mx-auto">
                                Go back to what you do best—building your app. Let PekkerAI handle scaling your traffic.
                            </p>
                            <Link href="/#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-lime-400 font-bold rounded-full hover:bg-neutral-900 transition-all active:scale-95 text-lg">
                                See Pricing & Start Free <ArrowRight size={20} />
                            </Link>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
}
