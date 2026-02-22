"use client";

import React, { useState, useEffect, useRef, ReactNode, FormEvent, MouseEvent } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Layout,
  Globe,
  ChevronRight,
  ChevronDown,
  X,
  Menu,
  Loader2,
  FileText,
  BarChart3,
  Search,
  Code2,
  Mail,
} from 'lucide-react';

// ─── Scroll Reveal ───
const RevealOnScroll = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// ─── FAQ Item ───
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex justify-between items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded-lg group" aria-expanded={isOpen}>
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-lime-400' : 'text-white group-hover:text-lime-400'}`}>{question}</span>
        <ChevronDown className={`transform transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-lime-400' : 'text-neutral-500 group-hover:text-lime-400'}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-neutral-400 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

// ─── Animated App Demo Mockup ───
const AppDemoMockup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-cycle steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typing effect on step change
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(t);
  }, [activeStep]);

  const steps = [
    { label: 'Setup', num: '1' },
    { label: 'SEO Brief', num: '2' },
    { label: 'Editor & Export', num: '3' },
  ];

  return (
    <section className="px-6 pb-24 relative z-10">
      <RevealOnScroll className="max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-[0_0_80px_rgba(163,230,53,0.05)]">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-full bg-white/5 text-neutral-500 text-xs flex items-center gap-1.5">
                <Globe size={12} /> app.PekkerAI.com
              </div>
            </div>
          </div>

          {/* App Layout */}
          <div className="flex min-h-[420px] sm:min-h-[480px]">
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col w-48 bg-[#0a0f14] border-r border-white/5 p-4">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} className="text-black" />
                </div>
                <span className="text-sm font-bold">PekkerAI</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-lime-400/10 border border-lime-400/20 rounded-lg text-lime-400 text-xs font-medium">
                  <FileText size={14} /> New Article
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-neutral-500 text-xs hover:text-neutral-300 transition-colors rounded-lg">
                  <Clock size={14} /> History
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-neutral-500 text-xs hover:text-neutral-300 transition-colors rounded-lg">
                  <BarChart3 size={14} /> Billing & Usage
                </div>
              </div>
              <div className="mt-auto">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-[10px] text-neutral-500 mb-1">Monthly Usage</div>
                  <div className="text-xs font-bold text-white mb-2">{activeStep === 2 ? '4' : '3'} / 10</div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-400 rounded-full transition-all duration-1000" style={{ width: activeStep === 2 ? '40%' : '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-5 sm:p-8 overflow-hidden bg-[#0f1117]">
              {/* Step Progress */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((s, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-1.5 transition-all duration-500 ${i === activeStep ? 'text-lime-400' : i < activeStep ? 'text-lime-400/40' : 'text-neutral-600'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${i === activeStep ? 'border-lime-400 bg-lime-400/10 text-lime-400' : i < activeStep ? 'border-lime-400/30 bg-lime-400/5 text-lime-400/50' : 'border-white/10 text-neutral-600'}`}>
                        {i < activeStep ? <CheckCircle2 size={12} /> : s.num}
                      </div>
                      <span className="text-[11px] font-medium hidden sm:inline">{s.label}</span>
                    </div>
                    {i < 2 && <div className={`w-8 sm:w-16 h-px transition-all duration-500 ${i < activeStep ? 'bg-lime-400/30' : 'bg-white/5'}`}></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Step Content — animated */}
              <div className="relative min-h-[380px]">
                {/* Step 1: Setup */}
                <div className={`transition-all duration-700 absolute inset-x-0 top-0 ${activeStep === 0 ? 'opacity-100 translate-y-0 visible z-10' : 'opacity-0 translate-y-4 invisible z-0 pointer-events-none'}`}>
                  <h3 className="text-lg font-bold text-center mb-1">New SEO Article</h3>
                  <p className="text-xs text-neutral-500 text-center mb-5">From keyword to publish-ready draft in minutes.</p>
                  <div className="space-y-3 max-w-md mx-auto">
                    <div>
                      <label className="text-[11px] text-neutral-400 font-medium mb-1 block">Target Keyword <span className="text-lime-400">*</span></label>
                      <div className={`px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm ${isTyping ? 'border-lime-400/40' : ''} transition-colors`}>
                        <span className={`transition-opacity duration-500 ${isTyping ? 'opacity-60' : 'opacity-100'}`}>SaaS Billing Software</span>
                        {isTyping && <span className="inline-block w-px h-3.5 bg-lime-400 ml-0.5 animate-pulse"></span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 font-medium mb-1 block">Competitor URL <span className="text-neutral-600">(Optional)</span></label>
                      <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-400">https://stripe.com/billing/guide</div>
                    </div>
                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium mb-2">
                        <Code2 size={12} className="text-lime-400" /> AI Content Guardrails
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] text-neutral-500 mb-1">Tone of Voice</div>
                          <div className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-[11px] text-neutral-300">Professional</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-500 mb-1">Target Audience</div>
                          <div className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-[11px] text-neutral-300">SaaS Founders</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-lime-400 text-black font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                      Generate SEO Brief <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Step 2: SEO Brief */}
                <div className={`transition-all duration-700 absolute inset-x-0 top-0 ${activeStep === 1 ? 'opacity-100 translate-y-0 visible z-10' : 'opacity-0 translate-y-4 invisible z-0 pointer-events-none'}`}>
                  <div className="grid grid-cols-2 gap-3 mb-4 max-w-md mx-auto">
                    <div className="p-3 bg-lime-400/5 border border-lime-400/10 rounded-lg">
                      <div className="text-[10px] text-lime-400/70 uppercase tracking-wider mb-1">Target Intent</div>
                      <div className="text-xs text-neutral-300">Informational / Commercial Investigation</div>
                    </div>
                    <div className="p-3 bg-lime-400/5 border border-lime-400/10 rounded-lg">
                      <div className="text-[10px] text-lime-400/70 uppercase tracking-wider mb-1">Target Length</div>
                      <div className="text-lg font-bold text-white">1,200 - 1,500 <span className="text-xs font-normal text-neutral-500">words</span></div>
                    </div>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto">
                    <div>
                      <div className="text-xs font-semibold mb-2">Select a Title</div>
                      <div className="space-y-1.5">
                        <div className="px-3 py-2 bg-lime-400/5 border border-lime-400/30 rounded-lg text-xs text-white flex items-center justify-between">
                          SaaS Billing Software: The Ultimate Guide <CheckCircle2 size={14} className="text-lime-400" />
                        </div>
                        <div className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-neutral-500">How to Master SaaS Billing Software in 2024</div>
                        <div className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-neutral-500">The Future of SaaS Billing Software: What You Need to Know</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold">Article Outline</span>
                        <span className="text-[10px] text-lime-400 cursor-pointer">↻ Regenerate</span>
                      </div>
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-[11px] text-neutral-400 space-y-1 font-mono">
                        <div>1. Introduction to the Topic</div>
                        <div>2. Why it Matters for Your Business</div>
                        <div>3. Key Features to Look For</div>
                        <div>4. Top Strategies for Implementation</div>
                        <div>5. Conclusion & Next Steps</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Editor & Export */}
                <div className={`transition-all duration-700 absolute inset-x-0 top-0 ${activeStep === 2 ? 'opacity-100 translate-y-0 visible z-10' : 'opacity-0 translate-y-4 invisible z-0 pointer-events-none'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    {/* Draft Preview */}
                    <div className="sm:col-span-2">
                      <div className="text-xs font-semibold mb-2">Draft Editor</div>
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-[11px] space-y-2 h-[250px] overflow-hidden">
                        <div className="text-sm font-bold text-white">SaaS Billing Software: The Ultimate Guide</div>
                        <div className="text-neutral-500 text-[10px]">
                          <p className="mb-2">In today&apos;s rapidly evolving SaaS landscape, billing software has become the backbone of sustainable growth. Whether you&apos;re a startup founder or scaling an enterprise...</p>
                          <div className="text-xs font-semibold text-neutral-300 mt-3 mb-1">## Why It Matters for Your Business</div>
                          <p className="mb-2">Efficient billing isn&apos;t just about collecting payments — it&apos;s about reducing churn, enabling flexible pricing models, and ensuring compliance with...</p>
                          <div className="text-xs font-semibold text-neutral-300 mt-3 mb-1">## Key Features to Look For</div>
                          <p>When evaluating SaaS billing platforms, focus on these critical capabilities: automated invoicing, dunning management...</p>
                        </div>
                      </div>
                    </div>
                    {/* Side Panel */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold mb-2">SEO Score</div>
                        <div className="p-3 bg-lime-400/5 border border-lime-400/10 rounded-lg text-center">
                          <div className="text-2xl font-black text-lime-400">92<span className="text-sm text-neutral-500">/100</span></div>
                          <div className="mt-2 space-y-1">
                            {['H1 Keyword ✓', 'Word Count ✓', 'Readability ✓', 'LSI Density ✓'].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-[10px] text-lime-400/80">
                                <CheckCircle2 size={10} /> {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-lg text-center">
                        <div className="text-[10px] text-lime-400 font-medium mb-1">Great Job! 🎉</div>
                        <div className="text-xs text-neutral-300">Saved <span className="font-bold text-lime-400">4.5 hrs</span></div>
                        <div className="text-[10px] text-neutral-500">& $45 in content costs</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500 mb-1">Meta Title</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] text-neutral-400 truncate">SaaS Billing Software: The Ultimate Guide (2025)</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-lime-400 text-black text-[10px] font-bold rounded-lg">Copy HTML</button>
                        <button className="flex-1 py-1.5 border border-white/10 text-[10px] text-neutral-400 rounded-lg">Markdown</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                  <button key={i} onClick={() => setActiveStep(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === i ? 'bg-lime-400 w-6' : 'bg-white/20 hover:bg-white/40'}`} aria-label={`Go to step ${i + 1}`}></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

// ─── Main App ───
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWaitlistSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      setTimeout(() => { setIsSubmitting(false); setSubmitted(true); }, 1500);
      setTimeout(() => { setIsModalOpen(false); setSubmitted(false); setEmail(''); }, 4500);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const trackPlanClick = (plan: string, price: string) => {
    const params = new URLSearchParams(window.location.search);
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        price,
        timestamp: new Date().toISOString(),
        email: email || null,
        tracking: {
          utm_source: params.get('utm_source') || null,
          utm_medium: params.get('utm_medium') || null,
          utm_campaign: params.get('utm_campaign') || null,
          utm_term: params.get('utm_term') || null,
          utm_content: params.get('utm_content') || null,
          referrer: document.referrer || null,
          page_url: window.location.href,
          screen: `${screenWidth}x${screenHeight}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          device_type: deviceType,
        },
      }),
    }).catch(() => { });
    openModal();
  };

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-lime-400/20 selection:text-lime-300 relative overflow-x-hidden">

      {/* ─── Global Styles ─── */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes droplet-fall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(calc(100vh - 100px)) rotate(45deg); opacity: 0; }
        }
        @keyframes droplet-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(163,230,53,0.3); }
          50% { box-shadow: 0 0 12px rgba(163,230,53,0.6); }
        }
        .hero-droplet {
          position: absolute;
          top: 0;
          border-radius: 2px;
          background: linear-gradient(180deg, rgba(163,230,53,0.8) 0%, rgba(163,230,53,0.2) 100%);
          animation: droplet-fall linear infinite, droplet-glow 2s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .animate-float, .hero-droplet { animation: none !important; opacity: 0 !important; transform: none !important; }
        }
      `}</style>

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg" aria-label="PekkerAI — scroll to top">
            <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">PekkerAI</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded">
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <button onClick={openModal} className="hidden sm:flex px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-semibold text-sm rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
              Get Early Access
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="py-3 text-neutral-300 hover:text-lime-400 transition-colors font-medium">
                  {link.label}
                </a>
              ))}
              <button onClick={() => { openModal(); setMobileMenuOpen(false); }} className="mt-2 w-full py-3 bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-full transition-all active:scale-95">
                Get Early Access
              </button>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* ─── Hero Section ─── */}
        <header className="relative pt-40 pb-32 px-6 overflow-hidden">
          {/* Glowing orb background */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-lime-500/10 blur-[150px] rounded-full pointer-events-none" style={{ animation: 'glow-pulse 6s ease-in-out infinite' }}></div>

          {/* Falling green square droplets */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[
              { s: 4, l: 3, d: 6.2, dl: 0.0, o: 0.25 },
              { s: 6, l: 8, d: 8.5, dl: 1.2, o: 0.35 },
              { s: 3, l: 15, d: 5.0, dl: 3.5, o: 0.20 },
              { s: 5, l: 22, d: 7.8, dl: 0.8, o: 0.45 },
              { s: 7, l: 28, d: 9.0, dl: 5.1, o: 0.30 },
              { s: 4, l: 35, d: 6.5, dl: 2.3, o: 0.40 },
              { s: 3, l: 42, d: 4.8, dl: 7.0, o: 0.18 },
              { s: 8, l: 48, d: 10.0, dl: 4.4, o: 0.50 },
              { s: 5, l: 55, d: 5.5, dl: 1.8, o: 0.28 },
              { s: 6, l: 62, d: 7.2, dl: 6.3, o: 0.38 },
              { s: 4, l: 68, d: 8.0, dl: 0.5, o: 0.22 },
              { s: 3, l: 74, d: 4.5, dl: 3.0, o: 0.33 },
              { s: 7, l: 80, d: 9.5, dl: 8.2, o: 0.42 },
              { s: 5, l: 87, d: 6.8, dl: 2.7, o: 0.26 },
              { s: 4, l: 93, d: 5.2, dl: 5.5, o: 0.35 },
              { s: 6, l: 5, d: 7.5, dl: 9.0, o: 0.30 },
              { s: 3, l: 18, d: 4.2, dl: 1.5, o: 0.20 },
              { s: 8, l: 32, d: 11.0, dl: 6.8, o: 0.48 },
              { s: 5, l: 45, d: 6.0, dl: 3.8, o: 0.32 },
              { s: 4, l: 58, d: 8.8, dl: 0.3, o: 0.24 },
              { s: 7, l: 72, d: 5.8, dl: 7.5, o: 0.40 },
              { s: 3, l: 85, d: 4.0, dl: 4.2, o: 0.18 },
              { s: 6, l: 12, d: 9.2, dl: 2.0, o: 0.36 },
              { s: 4, l: 25, d: 7.0, dl: 8.8, o: 0.28 },
              { s: 5, l: 38, d: 5.3, dl: 5.8, o: 0.44 },
              { s: 3, l: 52, d: 6.7, dl: 1.0, o: 0.22 },
              { s: 7, l: 65, d: 10.5, dl: 3.3, o: 0.38 },
              { s: 4, l: 78, d: 4.6, dl: 9.5, o: 0.26 },
              { s: 6, l: 91, d: 8.2, dl: 6.0, o: 0.34 },
              { s: 5, l: 50, d: 7.4, dl: 4.7, o: 0.30 },
            ].map((p, i) => (
              <div
                key={i}
                className="hero-droplet"
                style={{
                  width: `${p.s}px`,
                  height: `${p.s}px`,
                  left: `${p.l}%`,
                  opacity: p.o,
                  animationDuration: `${p.d}s, 2s`,
                  animationDelay: `${p.dl}s, ${p.dl}s`,
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
              Now in Private Beta
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
              Rank Higher in Minutes,{' '}
              <br className="hidden sm:block" />
              <span className="text-lime-400">Not Hours.</span>
            </h1>

            {/* Sub */}
            <p className="text-lg sm:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              The ultra-lean AI content pipeline for founders and SEO freelancers. Go from a target keyword to a publish-ready, highly researched article for just $1.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <button onClick={openModal} className="w-full sm:w-auto px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(163,230,53,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
                Start Pro Plan - $9/mo <ArrowRight size={20} />
              </button>
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-neutral-500 animate-fade-in-up delay-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-lime-400" /> No bloated dashboards</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-lime-400" /> Cancel anytime</span>
            </div>
          </div>

          {/* Horizon Curve with Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[300px]">
            <div className="w-full h-full rounded-[50%] border-t-2 border-lime-400/30 bg-gradient-to-b from-lime-400/5 to-transparent relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/60 to-transparent blur-sm"></div>
            </div>
          </div>
        </header>

        {/* ─── App Demo (Animated Mockup) ─── */}
        <AppDemoMockup />

        {/* ─── Features (Bento Grid) ─── */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Powerful{' '}
                <span className="text-lime-400">Features.</span>
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Everything you need to go from keyword to published article — without the bloated dashboards or $200/mo price tags.
              </p>
            </RevealOnScroll>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1 — Large */}
              <RevealOnScroll delay={0} className="md:col-span-2 lg:col-span-2">
                <div className="group h-full rounded-2xl border border-white/10 bg-[#111] hover:border-lime-400/30 transition-all duration-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/5 rounded-full blur-[80px] group-hover:bg-lime-400/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                      <Search size={24} className="text-lime-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI-Powered SEO Research</h3>
                    <p className="text-neutral-400 leading-relaxed mb-6">Automatically analyzes top-ranking pages for your keyword, extracts LSI terms, headers, and content structure—then builds your article on that intelligence.</p>
                    <div className="flex items-center gap-2 text-lime-400 text-sm font-medium">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 2 */}
              <RevealOnScroll delay={100}>
                <div className="group h-full rounded-2xl border border-white/10 bg-[#111] hover:border-lime-400/30 transition-all duration-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-[60px] group-hover:bg-lime-400/10 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                      <FileText size={24} className="text-lime-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Publish-Ready Drafts</h3>
                    <p className="text-neutral-400 leading-relaxed mb-6">Get structured, long-form SEO articles with proper H2/H3 hierarchy, meta titles, and descriptions. Export as HTML or Markdown.</p>
                    <div className="flex items-center gap-2 text-lime-400 text-sm font-medium">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 3 */}
              <RevealOnScroll delay={150}>
                <div className="group h-full rounded-2xl border border-white/10 bg-[#111] hover:border-lime-400/30 transition-all duration-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-[60px] group-hover:bg-lime-400/10 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                      <BarChart3 size={24} className="text-lime-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Competitor URL Analysis</h3>
                    <p className="text-neutral-400 leading-relaxed mb-6">Drop a competitor URL and PekkerAI reverse-engineers their content strategy—headings, word count, keyword density, and gaps you can exploit.</p>
                    <div className="flex items-center gap-2 text-lime-400 text-sm font-medium">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 4 */}
              <RevealOnScroll delay={200}>
                <div className="group h-full rounded-2xl border border-white/10 bg-[#111] hover:border-lime-400/30 transition-all duration-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-[60px] group-hover:bg-lime-400/10 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                      <Zap size={24} className="text-lime-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Unbeatable ROI</h3>
                    <p className="text-neutral-400 leading-relaxed mb-6">At roughly $1 per article, you replace expensive freelance writers without sacrificing quality. Validate your niche faster than ever.</p>
                    <div className="flex items-center gap-2 text-lime-400 text-sm font-medium">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 5 */}
              <RevealOnScroll delay={250}>
                <div className="group h-full rounded-2xl border border-white/10 bg-[#111] hover:border-lime-400/30 transition-all duration-500 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-[60px] group-hover:bg-lime-400/10 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                      <Code2 size={24} className="text-lime-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Content Guardrails</h3>
                    <p className="text-neutral-400 leading-relaxed mb-6">Set tone of voice, target audience, and content boundaries. PekkerAI respects your brand voice while optimizing for search engines.</p>
                    <div className="flex items-center gap-2 text-lime-400 text-sm font-medium">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── Testimonials / Social Proof ─── */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-400/[0.02] to-transparent pointer-events-none"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Loved by{' '}
                <span className="text-lime-400">Founders.</span>
              </h2>
              <p className="text-neutral-400 text-lg">Early beta users are already seeing results.</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "I replaced my $800/mo freelance writer with PekkerAI. The articles rank just as well, sometimes better.", name: "Priya S.", role: "SaaS Founder", initials: "PS" },
                { quote: "Finally, an SEO tool that doesn't try to do everything. It does one thing — generate ranking content — and does it extremely well.", name: "Jake M.", role: "SEO Freelancer", initials: "JM" },
                { quote: "We publish 30+ articles a month now. Before PekkerAI, we could barely manage 8. The ROI is insane.", name: "Nadia K.", role: "Content Agency Lead", initials: "NK" },
              ].map((t, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-lime-400/20 transition-all duration-300 h-full flex flex-col">
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, si) => (
                        <svg key={si} className="w-4 h-4 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-neutral-300 leading-relaxed text-sm mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-lime-400/10 flex items-center justify-center text-lime-400 text-sm font-bold">{t.initials}</div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-neutral-500">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section id="how-it-works" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-400/[0.02] to-transparent pointer-events-none"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How it <span className="text-lime-400">Works</span>
              </h2>
              <p className="text-neutral-400 text-lg">From keyword to published article in 3 simple steps.</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Enter Your Keyword', desc: 'Type your target keyword, optionally add a competitor URL, and set your tone/audience preferences.', icon: Target },
                { step: '02', title: 'AI Builds Your Brief', desc: 'PekkerAI scrapes top results, extracts LSI keywords, builds an SEO outline with proper heading hierarchy.', icon: Sparkles },
                { step: '03', title: 'Edit, Export, Publish', desc: 'Review your article in a rich editor, tweak as needed, then export as Markdown or HTML. Done.', icon: Globe },
              ].map((item, i) => (
                <RevealOnScroll key={i} delay={i * 150}>
                  <div className="relative group">
                    <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-lime-400/30 transition-all duration-500 h-full">
                      <div className="text-5xl font-black text-lime-400/10 mb-4 group-hover:text-lime-400/20 transition-colors">{item.step}</div>
                      <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center mb-5">
                        <item.icon size={24} className="text-lime-400" />
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-neutral-400 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Flexible Pricing,{' '}
                <span className="text-lime-400">choose per your needs.</span>
              </h2>
              <p className="text-neutral-400 text-lg">Choose the perfect plan for your content needs. Cancel anytime.</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter */}
              <RevealOnScroll delay={0}>
                <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <p className="text-neutral-500 text-sm mb-6">Perfect for niche bloggers and solo founders.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">$9</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                  <div className="border-t border-white/10 pt-6 mb-8 flex-1">
                    {['10 SEO Articles / month', 'AI Outline Generation', 'Auto-Generated Meta Data', 'Standard Support'].map((f, i) => (
                      <div key={i} className="flex items-start gap-3 mb-4">
                        <CheckCircle2 size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => trackPlanClick('Starter', '$9/mo')} className="w-full py-3 border border-white/20 hover:border-lime-400/50 hover:bg-lime-400/5 text-white font-semibold rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
                    Choose Plan <ChevronRight size={18} className="inline" />
                  </button>
                </div>
              </RevealOnScroll>

              {/* Pro — Highlighted */}
              <RevealOnScroll delay={100}>
                <div className="rounded-2xl border-2 border-lime-400/50 bg-[#111] p-8 relative flex flex-col h-full shadow-[0_0_60px_rgba(163,230,53,0.08)]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime-400 text-black text-xs font-bold uppercase rounded-full tracking-wider">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-lime-400">Pro</h3>
                  <p className="text-neutral-500 text-sm mb-6">For small teams scaling their content.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-extrabold">$29</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                  <div className="border-t border-white/10 pt-6 mb-8 flex-1">
                    {['40 SEO Articles / month', 'Multiple Tone of Voices', 'Auto-Generated Meta Data', 'HTML & Markdown Export', 'Priority Support'].map((f, i) => (
                      <div key={i} className="flex items-start gap-3 mb-4">
                        <CheckCircle2 size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => trackPlanClick('Pro', '$29/mo')} className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
                    Choose Plan <ChevronRight size={18} />
                  </button>
                </div>
              </RevealOnScroll>

              {/* Agency */}
              <RevealOnScroll delay={200}>
                <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">Agency</h3>
                  <p className="text-neutral-500 text-sm mb-6">For freelancers and agencies with clients.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">$49</span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                  <div className="border-t border-white/10 pt-6 mb-8 flex-1">
                    {['150 SEO Articles / month', 'Competitor URL Analysis', 'Advanced AI Guardrails', '24/7 Priority Support'].map((f, i) => (
                      <div key={i} className="flex items-start gap-3 mb-4">
                        <CheckCircle2 size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => trackPlanClick('Agency', '$49/mo')} className="w-full py-3 border border-white/20 hover:border-lime-400/50 hover:bg-lime-400/5 text-white font-semibold rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
                    Choose Plan <ChevronRight size={18} className="inline" />
                  </button>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <RevealOnScroll className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Questions?{' '}
                <span className="text-lime-400">Answers.</span>
              </h2>
              <p className="text-neutral-400 text-lg">Everything you need to know about the product and billing.</p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="rounded-2xl border border-white/10 bg-[#111] px-8 py-2">
                <FaqItem question="Why shouldn't I just use ChatGPT for free?" answer="ChatGPT is a general-purpose AI — it doesn't do keyword research, analyze competitor content, structure for SEO, or generate proper meta data. PekkerAI is a specialized content pipeline built around SEO best practices." />
                <FaqItem question="Can I cancel my subscription anytime?" answer="Absolutely. Cancel with one click from your dashboard. No hidden fees, no contracts. Your current plan will remain active until the end of your billing cycle." />
                <FaqItem question="Do you offer a free trial?" answer="Because API costs are associated with every article generated, we do not offer a free trial. However, our $9 Starter plan is priced specifically so you can test the platform with minimal risk." />
                <FaqItem question="What happens if I hit my monthly article limit?" answer="You can purchase additional article credits at any time from your dashboard, or upgrade your plan to get more monthly allowance. Unused articles do not roll over." />
                <FaqItem question="Can I export directly to WordPress?" answer="Currently, we support HTML and Markdown export. WordPress integration via REST API is on our roadmap for Q2 2025. You can easily copy-paste the HTML into WordPress's editor right now." />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Newsletter / CTA Banner ─── */}
        <section className="py-24 px-6">
          <RevealOnScroll className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Green glow bg */}
              <div className="absolute inset-0 bg-lime-400 opacity-100"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400 via-lime-500 to-green-600"></div>

              <div className="relative z-10 px-8 sm:px-16 py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-4">Join Our Newsletter</h2>
                <p className="text-black/70 text-lg mb-8 max-w-lg mx-auto">Stay up-to-date on SEO trends, product updates, and exclusive tips. No spam, ever.</p>
                <form onSubmit={(e) => { e.preventDefault(); openModal(); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="Your email address" className="flex-1 px-5 py-3.5 rounded-full bg-black/20 border border-black/30 text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-black/40 font-medium" />
                  <button type="submit" className="px-8 py-3.5 bg-black hover:bg-neutral-900 text-lime-400 font-bold rounded-full transition-all active:scale-95">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-black" />
                </div>
                <span className="text-lg font-bold">PekkerAI</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">The ultra-lean AI content pipeline for founders and SEO freelancers.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'How it Works', 'Roadmap'].map(l => (
                  <li key={l}><a href="#" className="text-neutral-500 hover:text-lime-400 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                  <li key={l}><a href="#" className="text-neutral-500 hover:text-lime-400 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                  <li key={l}><a href="#" className="text-neutral-500 hover:text-lime-400 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm">© 2025 PekkerAI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" className="text-neutral-600 hover:text-lime-400 text-sm transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(163,230,53,0.05)] animate-fade-in-up">
            <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg p-1" aria-label="Close dialog">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-lime-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">You&apos;re on the list! 🎉</h3>
                <p className="text-neutral-400">We&apos;ll notify you when your spot opens up. Check your inbox for a confirmation.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-lime-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Join the Private Beta</h3>
                  <p className="text-neutral-400 text-sm">Be one of the first 500 users to try PekkerAI. Early members get lifetime pricing.</p>
                </div>
                <form onSubmit={handleWaitlistSubmit}>
                  <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                  <input id="waitlist-email" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50 mb-4 transition-all" />
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] flex items-center justify-center gap-2">
                    {isSubmitting ? (<><Loader2 size={18} className="animate-spin" /> Submitting...</>) : ('Join Private Beta Waitlist')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}