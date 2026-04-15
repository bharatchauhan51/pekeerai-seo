import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'SEO Blog & AI Content Resources | PekkerAI',
    description: 'Learn SEO strategies, how to rank higher on Google, and how to effectively use AI to generate publish-ready content pipelines.',
};

const POSTS = [
    {
        slug: 'seo-freelancer-scaling-playbook',
        title: 'SEO Freelancer Scaling Playbook: How to Manage 10 Clients Without Hiring',
        description: "Learn how to scale your SEO freelancer business to 10+ clients without hiring. Systemise keyword research, use AI for first drafts, and price per article — not per hour.",
        date: 'April 2026',
        category: 'Guide',
    },
    {
        slug: 'surfer-seo-vs-frase',
        title: 'Surfer SEO vs Frase: Which Is Better for Solo Founders?',
        description: "Surfer SEO or Frase? We compare pricing, content research, and AI writing to help solo founders and bootstrapped SaaS startups choose the best SEO tool.",
        date: 'April 2026',
        category: 'Comparison',
    },
    {
        slug: 'saas-founder-content-strategy',
        title: 'Solo SaaS Founder Content Strategy: How to Rank Without a Marketing Team',
        description: "You don't need a marketing team to dominate Google. The lean content playbook with a 12-week calendar, AI workflows, and a $12/month budget.",
        date: 'April 2026',
        category: 'SEO Strategy',
    },
    {
        slug: 'seo-content-brief-guide',
        title: 'How to Write an SEO Content Brief That Actually Produces Ranking Articles',
        description: "The difference between a 'page 1' success and a buried draft is almost always found in the quality of the brief. 8 essential elements for 2026.",
        date: 'March 2026',
        category: 'SEO Strategy',
    },
    {
        slug: 'surfer-seo-alternatives',
        title: 'Surfer SEO Alternatives That Are 10x Cheaper in 2026',
        description: "Surfer SEO costs $89/mo. These 5 alternatives start at $9 — and some produce better SEO content. Full comparison with pricing, pros/cons, and recommendations.",
        date: 'March 2026',
        category: 'Comparison',
    },
    {
        slug: 'pekkerai-vs-koala-writer',
        title: 'PekkerAI vs Koala Writer: Which AI SEO Tool Is Worth Your Money in 2026?',
        description: "Comparing PekkerAI and Koala Writer on pricing, features, and results. One charges $1/article. One dominates the affiliate blogging niche.",
        date: 'February 2026',
        category: 'Comparison',
    },
    {
        slug: 'does-google-penalize-ai-generated-content',
        title: 'Does Google Penalize AI-Generated Content? Here\'s the Real Answer (2026)',
        description: "Google doesn't penalize AI content — but it does penalize bad content. Learn exactly what triggers penalties and what Google rewards.",
        date: 'February 2026',
        category: 'SEO Strategy',
    }
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-lime-400/20 selection:text-lime-300">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
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

            {/* Hero */}
            <header className="py-24 px-6 text-center max-w-3xl mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-500/10 blur-[100px] rounded-full mt-10"></div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                    The <span className="text-lime-400">SEO Playbook.</span>
                </h1>
                <p className="text-neutral-400 text-lg sm:text-xl leading-relaxed">
                    Tactics, case studies, and guides on building organic traffic machines with AI. Learn how to rank higher in minutes, not hours.
                </p>
            </header>

            {/* Post Grid */}
            <main className="max-w-5xl mx-auto px-6 pb-32">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {POSTS.map(post => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-lime-400/50 hover:bg-lime-400/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 flex flex-col h-full">
                            <div className="text-xs font-bold text-lime-400 tracking-wider uppercase mb-3">{post.category}</div>
                            <h2 className="text-xl font-bold mb-3 tracking-tight group-hover:text-lime-400 transition-colors leading-snug">{post.title}</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">{post.description}</p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                                <span className="text-xs text-neutral-500 font-medium">{post.date}</span>
                                <span className="flex items-center gap-1 text-lime-400 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Read Article <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
