import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronLeft, Shield, Lock, FileText, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | PekkerAI - SEO Article Generator',
    description: "Read the PekkerAI privacy policy. Learn how we collect, use, process and protect your data when you use our AI SEO content generation tools.",
    keywords: ['privacy policy', 'data protection', 'pekkerai privacy', 'seo tool privacy', 'ai content generator privacy'],
    openGraph: {
        title: 'Privacy Policy | PekkerAI',
        description: "How we protect your data at PekkerAI.",
        url: 'https://pekkerai.com/privacy',
        type: 'website',
    },
    alternates: {
        canonical: 'https://pekkerai.com/privacy',
    },
};

export default function PrivacyPage() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-neutral-400">
                            We believe in transparency. Here's exactly how we handle your data when you use PekkerAI.
                        </p>
                    </header>

                    <div className="bg-lime-400/5 border border-lime-400/20 p-6 sm:p-8 rounded-2xl my-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-lime-400"></div>
                        <p className="m-0 text-white font-medium text-lg leading-relaxed flex items-start gap-3">
                            <Shield className="text-lime-400 shrink-0 mt-1" size={24} />
                            <span>
                                <strong>The TL;DR:</strong> We only collect the data necessary to provide our service. We don't sell your personal data to third parties. The articles you generate are yours, and the keywords you research remain private to your account.
                            </span>
                        </p>
                    </div>

                    <div className="space-y-12 text-neutral-300 text-lg leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <FileText className="text-lime-400" size={24} /> 1. Information We Collect
                            </h2>
                            <p className="mb-4">
                                At PekkerAI, we collect information to provide better services to all our users. Information we collect includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-6">
                                <li><strong className="text-white">Account Information:</strong> When you sign up, we collect your email address and name.</li>
                                <li><strong className="text-white">Billing Information:</strong> Payments are processed securely via our payment providers (like Stripe). We do not store your direct credit card numbers on our servers.</li>
                                <li><strong className="text-white">Usage Data:</strong> We track which features you use (like keyword searches, article generation metrics) to improve the product and monitor limits according to your plan.</li>
                                <li><strong className="text-white">Content Data:</strong> The keywords you search, the tone instructions you provide, and the articles you generate.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <Globe className="text-lime-400" size={24} /> 2. How We Use Your Information
                            </h2>
                            <p className="mb-4">
                                We use the information we collect from all our services to:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-6">
                                <li>Provide, maintain, and improve our services (e.g., refining our AI prompts based on aggregate usage patterns).</li>
                                <li>Process your transactions and manage your subscription.</li>
                                <li>Communicate with you regarding updates, support, or security alerts.</li>
                                <li>Ensure the security and stability of our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <Lock className="text-lime-400" size={24} /> 3. Data Protection and Third Parties
                            </h2>
                            <p className="mb-4">
                                Security is a priority. We implement appropriate technical measures to safeguard your personal information.
                            </p>
                            <p className="mb-4">
                                We do not sell your personal data. We only share information with third-party services that help us operate our business:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-6">
                                <li><strong className="text-white">AI Providers:</strong> We use APIs from large language model providers (like OpenAI or Anthropic) to generate content. The inputs (keywords, competitors, tone) are sent to these APIs to return the article content. We only use providers that ensure strict data privacy and do not use our API inputs to train public models.</li>
                                <li><strong className="text-white">Infrastructure & Analytics:</strong> Vercel for hosting, and tools to monitor app performance and analytics.</li>
                                <li><strong className="text-white">Payment Processors:</strong> Stripe for secure billing.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                4. Cookie Policy
                            </h2>
                            <p className="mb-4">
                                We use cookies and similar tracking technologies to track activity on our service. Cookies help us remember your session, understand analytics, and keep you logged in. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                5. Your Rights & Data Retention
                            </h2>
                            <p className="mb-4">
                                You have the right to access, update, or delete the information we have on you. If you wish to delete your account and all associated data, you can do so from your account settings or by contacting us. We retain your information as long as your account is active or needed to provide you services, comply with legal obligations, resolve disputes, and enforce our agreements.
                            </p>
                        </section>

                        <section className="bg-[#111] border border-white/10 p-8 rounded-2xl mt-12 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 mt-0">Contact Us</h3>
                            <p className="mb-0">
                                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:hello@pekkerai.com" className="text-lime-400 hover:text-lime-300 transition-colors">hello@pekkerai.com</a>
                            </p>
                        </section>
                    </div>

                </article>
            </main>
        </div>
    );
}
