import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'SEO Blog & AI Content Resources | PekkerAI',
    description: 'Learn SEO strategies, how to rank higher on Google, and how to effectively use AI to generate publish-ready content pipelines.',
};

const POSTS = [
    {
        slug: 'pekkerai-vs-koala-writer',
        title: 'PekkerAI vs Koala Writer: Which AI SEO Tool Is Worth Your Money in 2025?',
        description: "Comparing PekkerAI and Koala Writer on pricing, features, and results. One charges $1/article. One dominates the affiliate blogging niche.",
        date: 'February 2025',
        category: 'Comparison',
    },
    {
        slug: 'does-google-penalize-ai-generated-content',
        title: 'Does Google Penalize AI-Generated Content? Here\'s the Real Answer (2025)',
        description: "Google doesn't penalize AI content — but it does penalize bad content. Learn exactly what triggers penalties and what Google rewards.",
        date: 'February 2025',
        category: 'SEO Strategy',
    }
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-lime-400/20 selection:text-lime-300">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg">
                        <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PekkerAI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</Link>
                    </div>
                    <Link href="/#pricing" className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-semibold text-sm rounded-full transition-all active:scale-95">
                        Log In
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
