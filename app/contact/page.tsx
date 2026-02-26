import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronLeft, Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us | PekkerAI - Reach Out to the Team',
    description: "Have a question about PekkerAI, enterprise pricing, or need support? Get in touch with our team directly. We usually respond within 24 hours.",
    keywords: ['contact pekkerai', 'customer support', 'seo tool help', 'pekkerai support', 'contact sales'],
    openGraph: {
        title: 'Contact Us | PekkerAI',
        description: "Have a question? Get in touch with our team directly.",
        url: 'https://pekkerai.com/contact',
        type: 'website',
    },
    alternates: {
        canonical: 'https://pekkerai.com/contact',
    },
};

export default function ContactPage() {
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-stretch">

                    {/* Left Column: Info */}
                    <div>
                        <div className="flex items-center gap-4 text-sm text-lime-400 font-medium tracking-tight mb-6">
                            <span className="bg-lime-400/10 px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-bold">Get In Touch</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            Let's Talk SEO.
                        </h1>
                        <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                            Whether you need help with your current plan, have a feature request, or want to discuss a custom agency setup, we're here to help.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-lime-400/10 flex items-center justify-center shrink-0">
                                    <MessageSquare className="text-lime-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Direct Support</h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">
                                        As a lean startup, you talk directly to the founders. We skip the automated bots and give you real answers.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-lime-400/10 flex items-center justify-center shrink-0">
                                    <Mail className="text-lime-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Prefer Email?</h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed mb-2">
                                        You can always reach us directly via email. We aim to respond within 24 hours.
                                    </p>
                                    <a href="mailto:hello@pekkerai.com" className="text-lime-400 hover:text-lime-300 transition-colors font-medium text-sm">
                                        hello@pekkerai.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="bg-[#111] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 flex-1 flex flex-col">
                            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                            <div className="flex-1">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
