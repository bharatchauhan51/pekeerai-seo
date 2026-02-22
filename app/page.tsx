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
  Loader2
} from 'lucide-react';

// Scroll Reveal Animation Component
const RevealOnScroll = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// FAQ Item Component (Accordion)
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg group"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
          {question}
        </span>
        <ChevronDown 
          className={`transform transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} 
          size={20} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

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
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1500);
      // Auto-close modal after showing success
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setEmail('');
      }, 4500);
    }
  };

  const openModal = () => setIsModalOpen(true);

  // Smooth scroll handler
  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // 64 is the height of the sticky navbar (h-16 = 4rem = 64px)
      const y = section.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Custom Animation Styles with prefers-reduced-motion support */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }

        /* Fix 4: Respect prefers-reduced-motion (a11y) */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-float,
          .animate-blob {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .animation-delay-2000,
          .animation-delay-4000,
          .delay-100, .delay-200, .delay-300, .delay-400 {
            animation-delay: 0ms !important;
          }
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -m-1" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="PekkerAI — scroll to top"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles size={18} className="text-white" aria-hidden="true" />
            </div>
            PekkerAI
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1">How it Works</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1">Pricing</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={openModal}
              className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Get Early Access
            </button>
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 pb-4 pt-2 space-y-1 animate-fade-in-up" style={{ animationDuration: '200ms' }}>
            <a href="#features" onClick={(e) => { scrollToSection(e, 'features'); setMobileMenuOpen(false); }} className="block py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" onClick={(e) => { scrollToSection(e, 'how-it-works'); setMobileMenuOpen(false); }} className="block py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#pricing" onClick={(e) => { scrollToSection(e, 'pricing'); setMobileMenuOpen(false); }} className="block py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" onClick={(e) => { scrollToSection(e, 'faq'); setMobileMenuOpen(false); }} className="block py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">FAQ</a>
            <button 
              onClick={() => { openModal(); setMobileMenuOpen(false); }}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Get Early Access
            </button>
          </div>
        )}
      </nav>

      <main>
      {/* Hero Section */}
      <header className="pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Now in Private Beta
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] animate-fade-in-up delay-100">
            Rank Higher in Minutes, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Not Hours.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            The ultra-lean AI content pipeline for founders and SEO freelancers. Go from a target keyword to a publish-ready, highly researched article for just ₹50.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <button 
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Start Pro Plan - ₹499/mo <ArrowRight size={20} className="animate-bounce motion-reduce:animate-none" />
            </button>
            <p className="text-sm text-slate-500 sm:hidden">No credit card required for waitlist</p>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium animate-fade-in-up delay-400">
            <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> No bloated dashboards</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Cancel anytime</span>
          </div>
        </div>

        {/* Video Player App Demo */}
        <div className="max-w-5xl mx-auto mt-16 relative z-10 animate-fade-in-up delay-400">
          <div className="rounded-2xl border border-slate-300/50 bg-slate-900/5 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
            
            {/* macOS-style Browser Header */}
            <div className="bg-slate-800/95 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2 w-20">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
              </div>
              <div className="bg-slate-900/50 text-slate-400 text-xs font-medium px-6 py-1.5 rounded-md border border-slate-700/50 flex items-center gap-2">
                <Globe size={12} className="text-slate-500" />
                app.PekkerAI.com
              </div>
              <div className="w-20"></div> {/* Spacer to keep URL centered */}
            </div>
            
            {/* Video Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden group">
              
              {/* Skeleton loading state (shimmer effect while video loads) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-0">
                 <div className="w-full h-full animate-pulse bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_100%]" style={{ animation: 'shimmer 2s ease-in-out infinite' }}></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                   <Layout size={48} className="mb-4 opacity-50" aria-hidden="true" />
                   <p className="font-medium">Loading App Demo...</p>
                 </div>
              </div>

              <style>{`
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>

              <video 
                className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500"
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata"
                aria-label="PekkerAI application demo walkthrough"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Optional: Subtle gradient overlay to make it look embedded in the page */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 z-20 pointer-events-none rounded-b-xl"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Problem Section (Why ChatGPT isn't enough) */}
      <section id="features" className="py-20 bg-white/60 backdrop-blur-sm relative z-10 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">ChatGPT alone isn't an SEO strategy.</h2>
            <p className="text-slate-600 text-lg">
              Generic AI output lacks search intent, structure, and LSI keywords. Heavy enterprise SEO tools cost ₹10,000+/mo. PekkerAI sits perfectly in the middle.
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            <RevealOnScroll delay={100} className="group bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Intent-Driven Outlines</h3>
              <p className="text-slate-600">We don't just write words. The AI analyzes your keyword to determine search intent and builds a structural outline before writing a single paragraph.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={200} className="group bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Auto-Generated SEO Data</h3>
              <p className="text-slate-600">Stop wasting time in WordPress. We automatically generate optimized Title Tags, Meta Descriptions, and URL slugs for every article.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={300} className="group bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Unbeatable ROI</h3>
              <p className="text-slate-600">At roughly ₹50 per article, you replace expensive freelance writers without sacrificing quality. Validate your niche faster than ever.</p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900/95 backdrop-blur-md text-white relative z-10 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A linear workflow for maximum speed.</h2>
            <p className="text-slate-400 text-lg">No bloated dashboards. Just three steps to publish.</p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <RevealOnScroll delay={200} className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-700 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
            </RevealOnScroll>

            <RevealOnScroll delay={100} className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300">1</div>
              <h3 className="text-xl font-bold mb-2">Enter Keyword</h3>
              <p className="text-slate-400 text-sm">Input your target keyword, select your brand's tone of voice, and add secondary LSI keywords.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={300} className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300">2</div>
              <h3 className="text-xl font-bold mb-2">Review Outline</h3>
              <p className="text-slate-400 text-sm">The AI generates an optimized brief. Tweak the headings, choose a title, and give the green light.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={500} className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-indigo-600 border-4 border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]">3</div>
              <h3 className="text-xl font-bold mb-2">Export & Publish</h3>
              <p className="text-slate-400 text-sm">Get a 1,500+ word draft, complete with markdown formatting and a full SEO score checklist.</p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50/60 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, lean pricing.</h2>
            <p className="text-slate-600 text-lg">Choose the perfect plan for your content needs. Cancel anytime.</p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            {/* Starter Plan */}
            <RevealOnScroll delay={100} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-slate-500 text-sm mb-6">Perfect for niche bloggers and solo founders.</p>
                <div className="flex justify-center items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900">₹499</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <div className="p-8 bg-white">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    10 SEO Articles / month
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    AI Outline Generation
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    Auto-Generated Meta Data
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    Standard Support
                  </li>
                </ul>
                <button 
                  onClick={openModal}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.97] text-slate-900 rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
            </RevealOnScroll>

            {/* Pro Plan */}
            <RevealOnScroll delay={300} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-indigo-500 overflow-hidden relative transform md:-translate-y-4 hover:-translate-y-6 hover:shadow-2xl transition-all duration-300 ring-4 ring-indigo-500/10">
              <div className="absolute top-0 left-0 right-0 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1">
                Most Popular
              </div>
              <div className="p-8 text-center border-b border-indigo-50 bg-indigo-50/50 mt-4">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Pro</h3>
                <p className="text-indigo-600/70 text-sm mb-6">For small teams scaling their content.</p>
                <div className="flex justify-center items-baseline gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-slate-900">₹1,499</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <div className="p-8 bg-white">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0" />
                    40 SEO Articles / month
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0" />
                    Multiple Tone of Voices
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0" />
                    Auto-Generated Meta Data
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0" />
                    HTML & Markdown Export
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-indigo-600 shrink-0" />
                    Priority Support
                  </li>
                </ul>
                <button 
                  onClick={openModal}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Start Pro Plan <ChevronRight size={20} />
                </button>
              </div>
            </RevealOnScroll>

            {/* Agency Plan */}
            <RevealOnScroll delay={500} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Agency</h3>
                <p className="text-slate-500 text-sm mb-6">For freelancers and agencies with clients.</p>
                <div className="flex justify-center items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900">₹3,999</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <div className="p-8 bg-white">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    150 SEO Articles / month
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    Competitor URL Analysis
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    Advanced AI Guardrails
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                    24/7 Priority Support
                  </li>
                </ul>
                <button 
                  onClick={openModal}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.97] text-white rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white relative z-10 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">Everything you need to know about the product and billing.</p>
          </RevealOnScroll>

          <RevealOnScroll delay={200} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm">
            <FaqItem 
              question="Why shouldn't I just use ChatGPT for free?" 
              answer="Raw ChatGPT output lacks structure, search intent alignment, and secondary keywords (LSI). PekkerAI acts as a specialized pipeline: it researches intent, generates a targeted brief, and ensures standard SEO elements (Meta tags, outlines, word counts) are optimized automatically." 
            />
            <FaqItem 
              question="Can I cancel my subscription anytime?" 
              answer="Absolutely. There are no long-term contracts or hidden cancellation fees. You can cancel your subscription at any time directly from your billing dashboard, and you will retain access until the end of your billing cycle." 
            />
            <FaqItem 
              question="Do you offer a free trial?" 
              answer="Because API costs are associated with every article generated, we do not offer a free trial. However, our ₹499 Starter plan is priced specifically so you can test the platform with minimal risk." 
            />
            <FaqItem 
              question="What happens if I hit my monthly article limit?" 
              answer="Once you hit your limit, you can easily upgrade to the next tier (e.g., Starter to Pro) to unlock more articles immediately. Your limits will reset automatically at the start of your next billing cycle." 
            />
            <FaqItem 
              question="Can I export directly to WordPress?" 
              answer="Currently, we offer one-click HTML and Markdown exports, which paste perfectly into WordPress, Webflow, and Ghost. Direct CMS integrations are on our roadmap and coming very soon!" 
            />
          </RevealOnScroll>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
          <Sparkles size={18} className="text-indigo-500" />
          PekkerAI
        </div>
        <p className="mb-4">The ultra-lean content pipeline for modern founders.</p>
        <p className="text-sm">© {new Date().getFullYear()} PekkerAI. All rights reserved.</p>
      </footer>

      {/* THE "PAINTED DOOR" WAITLIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 scale-100 opacity-100">
            <div className="p-6 md:p-8 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h3>
                  <p className="text-slate-600">Keep an eye on your inbox. We'll email you your 20% discount link as soon as a spot opens up.</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">High Demand Alert! 🚀</h3>
                  <p className="text-slate-600 mb-6">
                    Due to high API limits, we are currently onboarding users via a private beta. Enter your email to get front-of-the-line access and a <strong>lifetime 20% discount</strong> when spots open up!
                  </p>

                  <form onSubmit={handleWaitlistSubmit}>
                    <div className="mb-4">
                      <label htmlFor="waitlist-email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input 
                        id="waitlist-email"
                        type="email" 
                        required
                        placeholder="founder@startup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 outline-none transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                      ) : (
                        'Join Private Beta Waitlist'
                      )}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-4">We respect your inbox. No spam, ever.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// import React, { useState } from 'react';
// import { 
//   FileText, 
//   LayoutDashboard, 
//   CreditCard, 
//   Settings, 
//   ArrowRight, 
//   Loader2, 
//   Download, 
//   Copy,
//   Sparkles,
//   ChevronRight,
//   History,
//   Sliders,
//   CheckCircle2,
//   Globe,
//   RefreshCw,
//   Zap,
//   Target,
//   Type,
//   Clock
// } from 'lucide-react';

// export default function App() {
//   // Navigation & State
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [step, setStep] = useState(1); // 1: Input, 2: Brief, 3: Editor
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isRegenerating, setIsRegenerating] = useState(false);
  
//   // Core Data State
//   const [keyword, setKeyword] = useState('');
//   const [competitorUrl, setCompetitorUrl] = useState('');
//   const [brief, setBrief] = useState(null);
//   const [article, setArticle] = useState('');
  
//   // Advanced Settings State
//   const [tone, setTone] = useState('Professional');
//   const [audience, setAudience] = useState('');
//   const [secondaryKeywords, setSecondaryKeywords] = useState('');
  
//   // Step 2 & 3 Specific State
//   const [selectedTitle, setSelectedTitle] = useState(0);
//   const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  
//   // Usage & History State
//   const [usage, setUsage] = useState(3);
//   const maxUsage = 10;
//   const [history] = useState([
//     { id: 1, keyword: "Reduce SaaS churn rate", date: "2 days ago", wordCount: "1,420", status: "Published" },
//     { id: 2, keyword: "B2B content marketing strategies", date: "5 days ago", wordCount: "1,850", status: "Draft" }
//   ]);

//   // Mock Generators
//   const handleGenerateBrief = () => {
//     if (!keyword) return;
//     setIsGenerating(true);
    
//     setTimeout(() => {
//       setBrief({
//         intent: "Informational / Commercial Investigation. User is looking for authoritative guides tailored to their specific audience.",
//         wordCount: "1,200 - 1,500 words",
//         titles: [
//           `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: The Ultimate Guide`,
//           `How to Master ${keyword} in 2024 (Step-by-Step)`,
//           `The Future of ${keyword}: What You Need to Know`
//         ],
//         outline: "1. Introduction to the Topic\n2. Why it Matters for Your Business\n3. Key Features to Look For\n4. Top Strategies for Implementation\n5. Conclusion & Next Steps"
//       });
//       setIsGenerating(false);
//       setStep(2);
//     }, 1500);
//   };

//   const handleRegenerateOutline = () => {
//     setIsRegenerating(true);
//     setTimeout(() => {
//       setBrief(prev => ({
//         ...prev,
//         outline: "1. A New Introduction Hook\n2. The Core Problems with Current Approaches\n3. 5 Proven Strategies to Succeed\n4. Case Studies & Real World Examples\n5. Final Thoughts"
//       }));
//       setIsRegenerating(false);
//     }, 1000);
//   };

//   const handleGenerateArticle = () => {
//     setIsGenerating(true);
    
//     setTimeout(() => {
//       setArticle(`# ${brief.titles[selectedTitle]}\n\nIn today's fast-paced digital landscape, understanding this topic is crucial for businesses aiming to maintain a competitive edge. This guide breaks down everything you need to know, specifically tailored for ${audience || 'professionals'}.\n\n## Why it Matters\nImplementing the right strategies can lead to significant improvements in operational efficiency and customer satisfaction. The ROI on adopting modern solutions is well documented, especially when keeping a ${tone.toLowerCase()} approach in mind.\n\n## Key Strategies\nWhen evaluating options, consider the following:\n- Scalability and performance\n- Ease of integration with existing stacks\n- Cost-effectiveness\n\n## Conclusion\nBy focusing on these core elements, teams can streamline their workflows and achieve better results in less time. Make sure to keep optimizing your approach.`);
//       setIsGenerating(false);
//       setStep(3);
//       setUsage(prev => prev + 1);
//     }, 2500);
//   };

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   const resetFlow = () => {
//     setStep(1);
//     setKeyword('');
//     setCompetitorUrl('');
//     setAudience('');
//     setSecondaryKeywords('');
//     setBrief(null);
//     setArticle('');
//     setSelectedTitle(0);
//   };

//   // --- UI Components ---

//   const Sidebar = () => (
//     <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen">
//       <div className="p-6 flex items-center gap-2 text-white font-bold text-xl tracking-tight">
//         <div className="bg-indigo-500 p-1.5 rounded-lg">
//           <Sparkles size={20} className="text-white" />
//         </div>
//         PekkerAI
//       </div>
      
//       <nav className="flex-1 px-4 space-y-2 mt-4">
//         <button 
//           onClick={() => { setActiveTab('dashboard'); if(step === 3) resetFlow(); }}
//           className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
//         >
//           <LayoutDashboard size={18} />
//           New Article
//         </button>
//         <button 
//           onClick={() => setActiveTab('history')}
//           className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
//         >
//           <History size={18} />
//           History
//         </button>
//         <button 
//           onClick={() => setActiveTab('billing')}
//           className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
//         >
//           <CreditCard size={18} />
//           Billing & Usage
//         </button>
//       </nav>

//       <div className="p-4 mb-4 mx-4 bg-slate-800 rounded-xl border border-slate-700">
//         <div className="flex justify-between items-center mb-2 text-sm">
//           <span className="font-medium text-white">Monthly Usage</span>
//           <span>{usage} / {maxUsage}</span>
//         </div>
//         <div className="w-full bg-slate-900 rounded-full h-2">
//           <div 
//             className={`h-2 rounded-full ${usage >= maxUsage ? 'bg-red-500' : 'bg-indigo-500'}`} 
//             style={{ width: `${(usage / maxUsage) * 100}%` }}
//           ></div>
//         </div>
//         <p className="text-xs text-slate-400 mt-3 text-center">
//           Pro Plan (₹499/mo)
//         </p>
//       </div>
//     </div>
//   );

//   const Stepper = () => (
//     <div className="flex items-center justify-center mb-10 w-full max-w-3xl mx-auto">
//       <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>1</div>
//         <span className="font-medium">Setup</span>
//       </div>
//       <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
      
//       <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>2</div>
//         <span className="font-medium">SEO Brief</span>
//       </div>
//       <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
      
//       <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>3</div>
//         <span className="font-medium">Editor & Export</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
//       <Sidebar />
      
//       <main className="flex-1 overflow-y-auto">
//         <div className={`mx-auto p-10 ${step === 3 ? 'max-w-7xl' : 'max-w-5xl'}`}>
          
//           {/* HISTORY TAB */}
//           {activeTab === 'history' && (
//             <div className="max-w-4xl mx-auto">
//               <h2 className="text-2xl font-bold mb-6 text-slate-900">Document History</h2>
//               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
//                       <th className="p-4">Target Keyword</th>
//                       <th className="p-4">Date</th>
//                       <th className="p-4">Words</th>
//                       <th className="p-4">Status</th>
//                       <th className="p-4">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {history.map((item) => (
//                       <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
//                         <td className="p-4 font-medium text-slate-800">{item.keyword}</td>
//                         <td className="p-4 text-slate-500">{item.date}</td>
//                         <td className="p-4 text-slate-500">{item.wordCount}</td>
//                         <td className="p-4">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Open</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* DASHBOARD TAB (Content Generation Flow) */}
//           {activeTab === 'dashboard' && (
//             <>
//               {step !== 3 && (
//                 <header className="mb-10 text-center">
//                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">New SEO Article</h1>
//                   <p className="text-slate-500">From keyword to publish-ready draft in minutes.</p>
//                 </header>
//               )}

//               {step !== 3 && <Stepper />}

//               {/* STEP 1: INPUT */}
//               {step === 1 && (
//                 <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//                   <div className="space-y-6">
//                     {/* Primary Inputs */}
//                     <div>
//                       <label className="block text-sm font-semibold mb-2" htmlFor="keyword">
//                         Target Keyword <span className="text-red-500">*</span>
//                       </label>
//                       <input 
//                         id="keyword"
//                         type="text" 
//                         placeholder="e.g., Best SaaS billing software"
//                         className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
//                         value={keyword}
//                         onChange={(e) => setKeyword(e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold mb-2" htmlFor="competitor">
//                         Competitor URL <span className="text-slate-400 font-normal">(Optional)</span>
//                       </label>
//                       <input 
//                         id="competitor"
//                         type="url" 
//                         placeholder="https://competitor.com/their-article"
//                         className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
//                         value={competitorUrl}
//                         onChange={(e) => setCompetitorUrl(e.target.value)}
//                       />
//                     </div>

//                     {/* Advanced Guardrails */}
//                     <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
//                       <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
//                         <Sliders size={18} /> AI Content Guardrails
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-xs font-semibold mb-1 text-slate-600">Tone of Voice</label>
//                           <select 
//                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                             value={tone}
//                             onChange={(e) => setTone(e.target.value)}
//                           >
//                             <option>Professional</option>
//                             <option>Conversational</option>
//                             <option>Authoritative & Data-Driven</option>
//                             <option>Witty & Engaging</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-xs font-semibold mb-1 text-slate-600">Target Audience</label>
//                           <input 
//                             type="text" 
//                             placeholder="e.g., C-Suite, Beginners"
//                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                             value={audience}
//                             onChange={(e) => setAudience(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-xs font-semibold mb-1 text-slate-600">Secondary Keywords (LSI)</label>
//                         <textarea 
//                           rows="2"
//                           placeholder="Comma-separated keywords (e.g., saas pricing, churn reduction)"
//                           className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
//                           value={secondaryKeywords}
//                           onChange={(e) => setSecondaryKeywords(e.target.value)}
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="pt-2 border-t border-slate-100">
//                       <button 
//                         onClick={handleGenerateBrief}
//                         disabled={!keyword || isGenerating || usage >= maxUsage}
//                         className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
//                       >
//                         {isGenerating ? (
//                           <><Loader2 size={20} className="animate-spin" /> Analyzing Intent & Building Brief...</>
//                         ) : (
//                           <>Generate SEO Brief <ArrowRight size={20} /></>
//                         )}
//                       </button>
//                       {usage >= maxUsage && (
//                         <p className="text-red-500 text-sm mt-3 text-center">You have reached your monthly article limit.</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2: SEO BRIEF */}
//               {step === 2 && brief && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                   {/* Stats Row */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start gap-3">
//                       <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Target size={20} /></div>
//                       <div>
//                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Intent</h3>
//                         <p className="text-slate-800 text-sm font-medium leading-snug">{brief.intent}</p>
//                       </div>
//                     </div>
//                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start gap-3">
//                       <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-1"><Type size={20} /></div>
//                       <div>
//                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Length</h3>
//                         <p className="text-2xl font-bold text-slate-800">{brief.wordCount}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Title Selection */}
//                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                     <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-slate-800">
//                       Select a Title
//                     </h3>
//                     <div className="space-y-2">
//                       {brief.titles.map((title, idx) => (
//                         <div 
//                           key={idx}
//                           onClick={() => setSelectedTitle(idx)}
//                           className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedTitle === idx ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
//                         >
//                           {title}
//                           {selectedTitle === idx && <CheckCircle2 size={18} className="text-indigo-600" />}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Editable Outline */}
//                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-md font-bold text-slate-800">Article Outline</h3>
//                       <button 
//                         onClick={handleRegenerateOutline}
//                         disabled={isRegenerating}
//                         className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
//                       >
//                         <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} /> Regenerate
//                       </button>
//                     </div>
//                     <textarea 
//                       className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm text-slate-700"
//                       value={brief.outline}
//                       onChange={(e) => setBrief({...brief, outline: e.target.value})}
//                     />
//                     <p className="text-xs text-slate-500 mt-2">Edit this outline freely. The AI will strictly follow this structure.</p>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-4 pt-2">
//                     <button 
//                       onClick={() => setStep(1)}
//                       className="px-6 py-3 font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
//                     >
//                       Back
//                     </button>
//                     <button 
//                       onClick={handleGenerateArticle}
//                       disabled={isGenerating}
//                       className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
//                     >
//                       {isGenerating ? (
//                         <><Loader2 size={20} className="animate-spin" /> Writing Article...</>
//                       ) : (
//                         <><Sparkles size={20} /> Generate Publish-Ready Article</>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 3: EDITOR & SEO PROOF SIDEBAR */}
//               {step === 3 && (
//                 <div className="flex gap-6 h-[85vh]">
                  
//                   {/* Left: Editor */}
//                   <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
//                     <div className="bg-slate-50 border-b border-slate-200 p-3 px-5 flex justify-between items-center">
//                       <div className="flex items-center gap-4">
//                         <button onClick={resetFlow} className="text-slate-400 hover:text-slate-600 transition-colors">
//                           <ArrowRight size={20} className="rotate-180" />
//                         </button>
//                         <span className="font-semibold text-slate-800 flex items-center gap-2">
//                           <FileText size={18} className="text-indigo-600" /> Draft Editor
//                         </span>
//                       </div>
                      
//                       <div className="flex gap-3 items-center">
//                         <div className="flex bg-slate-200 p-1 rounded-lg">
//                           <button 
//                             onClick={() => setIsMarkdownMode(false)}
//                             className={`px-3 py-1 text-xs font-medium rounded ${!isMarkdownMode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
//                           >
//                             Rich Text
//                           </button>
//                           <button 
//                             onClick={() => setIsMarkdownMode(true)}
//                             className={`px-3 py-1 text-xs font-medium rounded ${isMarkdownMode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
//                           >
//                             Markdown
//                           </button>
//                         </div>
//                         <div className="w-px h-6 bg-slate-300 mx-1"></div>
//                         <button 
//                           onClick={() => handleCopy(article)}
//                           className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
//                         >
//                           <Copy size={16} /> Copy
//                         </button>
//                         <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
//                           <Download size={16} /> HTML
//                         </button>
//                       </div>
//                     </div>
                    
//                     <textarea 
//                       className={`flex-1 w-full p-8 outline-none resize-none text-slate-800 leading-relaxed ${isMarkdownMode ? 'font-mono text-sm bg-slate-50' : 'font-serif text-lg'}`}
//                       value={article}
//                       onChange={(e) => setArticle(e.target.value)}
//                     />
//                   </div>

//                   {/* Right: SEO Proof Sidebar */}
//                   <div className="flex-[1] flex flex-col gap-4 overflow-y-auto pb-4">
                    
//                     {/* ROI Badge */}
//                     <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
//                       <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-1">
//                         <Zap size={18} className="fill-amber-500 text-amber-500" /> Great Job!
//                       </h3>
//                       <p className="text-sm text-amber-700 leading-tight">
//                         You just saved an estimated <strong>4.5 hours</strong> and <strong>₹4,500</strong> on content creation costs.
//                       </p>
//                     </div>

//                     {/* SEO Score & Checklist */}
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
//                       <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
//                         <h3 className="font-bold text-slate-800 flex items-center gap-2">
//                           <Globe size={18} className="text-indigo-600" /> SEO Score
//                         </h3>
//                         <div className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm">
//                           92 / 100
//                         </div>
//                       </div>
                      
//                       <div className="space-y-3 text-sm">
//                         <div className="flex items-start gap-2 text-slate-700">
//                           <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> 
//                           <span>Primary keyword <strong>{keyword}</strong> in H1 Title</span>
//                         </div>
//                         <div className="flex items-start gap-2 text-slate-700">
//                           <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> 
//                           <span>Word count is optimal (1,250 words)</span>
//                         </div>
//                         <div className="flex items-start gap-2 text-slate-700">
//                           <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> 
//                           <span>Readability matches target audience ({audience || 'Professionals'})</span>
//                         </div>
//                         {secondaryKeywords && (
//                           <div className="flex items-start gap-2 text-slate-700">
//                             <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> 
//                             <span>Included 3/3 secondary keywords</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Meta Data Gen */}
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
//                       <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider text-slate-500">Auto-Generated Meta Data</h3>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <label className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
//                             Title Tag (55 chars)
//                             <button onClick={() => handleCopy(brief.titles[selectedTitle])} className="text-indigo-600 hover:underline">Copy</button>
//                           </label>
//                           <div className="bg-slate-50 p-2 text-sm rounded border border-slate-200 text-slate-800 truncate">
//                             {brief.titles[selectedTitle]}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
//                             Meta Description (152 chars)
//                             <button onClick={() => handleCopy(`A complete guide on ${keyword}. Learn why it matters, key strategies, and how to stay ahead in 2024.`)} className="text-indigo-600 hover:underline">Copy</button>
//                           </label>
//                           <div className="bg-slate-50 p-2 text-sm rounded border border-slate-200 text-slate-800">
//                             A complete guide on {keyword}. Learn why it matters, key strategies, and how to stay ahead in 2024.
//                           </div>
//                         </div>
//                         <div>
//                           <label className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
//                             URL Slug
//                             <button onClick={() => handleCopy(keyword.toLowerCase().replace(/\s+/g, '-'))} className="text-indigo-600 hover:underline">Copy</button>
//                           </label>
//                           <div className="bg-slate-50 p-2 text-sm rounded border border-slate-200 text-slate-800 font-mono text-xs">
//                             /{keyword.toLowerCase().replace(/\s+/g, '-')}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Integrations (Sellability/Roadmap) */}
//                     <button disabled className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 p-3 rounded-xl font-medium cursor-not-allowed">
//                       Export to WordPress
//                       <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-2">Coming Soon</span>
//                     </button>

//                   </div>

//                 </div>
//               )}
//             </>
//           )}

//           {/* Placeholder for Billing & Settings */}
//           {activeTab !== 'dashboard' && activeTab !== 'history' && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center text-slate-500">
//                 <Settings size={48} className="mx-auto mb-4 opacity-20" />
//                 <h2 className="text-xl font-medium mb-2">{activeTab === 'billing' ? 'Billing & Subscription' : 'Account Settings'}</h2>
//                 <p>This section is intentionally excluded from the core MVP user journey preview.</p>
//               </div>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }