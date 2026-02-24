'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Sparkles, Search, FileText, Calendar, ChevronRight, ChevronLeft, Check, ArrowRight,
    Globe, Users, Mic2, BarChart3, ExternalLink, GripVertical, Clock, Tag, Zap,
    Bold, Italic, List, Link2, Image, AlignLeft, Heading2, Quote, Code,
    ChevronDown, X, CalendarDays, Menu, Loader2, Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Dummy Data ───
const DUMMY_SERP = [
    { position: 1, title: 'How to Build an AI Content Pipeline in 2025', url: 'contentmarketer.io', wordCount: 2847, headings: 12, score: 92 },
    { position: 2, title: '10 Best AI SEO Tools for Content Teams', url: 'searchjournal.com', wordCount: 3102, headings: 15, score: 89 },
    { position: 3, title: 'AI Content Strategy: Complete Guide', url: 'semrush.com', wordCount: 4210, headings: 18, score: 87 },
    { position: 4, title: 'Using AI to Scale Blog Output (Without Penalties)', url: 'neilpatel.com', wordCount: 2156, headings: 9, score: 84 },
    { position: 5, title: 'The Future of SEO Content Creation', url: 'backlinko.com', wordCount: 1890, headings: 8, score: 81 },
];

const DUMMY_OUTLINE = [
    { type: 'h2', text: 'What Is an AI Content Pipeline?', editable: true },
    { type: 'h3', text: 'Definition and Core Components', editable: true },
    { type: 'h3', text: 'Why Traditional Content Workflows Are Broken', editable: true },
    { type: 'h2', text: 'How AI Content Pipelines Work (Step-by-Step)', editable: true },
    { type: 'h3', text: 'Step 1: Keyword Research & Intent Mapping', editable: true },
    { type: 'h3', text: 'Step 2: SERP Analysis & Competitive Gaps', editable: true },
    { type: 'h3', text: 'Step 3: AI-Assisted Drafting with Human Oversight', editable: true },
    { type: 'h2', text: 'The ROI of AI Content Pipelines for Founders', editable: true },
    { type: 'h3', text: 'Cost Comparison: Freelancers vs AI Pipelines', editable: true },
    { type: 'h3', text: 'Time Savings and Output Quality Benchmarks', editable: true },
    { type: 'h2', text: 'Common Mistakes to Avoid', editable: true },
    { type: 'h2', text: 'Tools & Platforms for AI Content Pipelines', editable: true },
];

const DUMMY_ARTICLE_HTML = `<h2>What Is an AI Content Pipeline?</h2>
<p>An AI content pipeline is an end-to-end workflow that automates the research, outlining, drafting, and optimization of <strong>SEO content</strong> using artificial intelligence. Unlike traditional content creation — where a writer spends hours researching, writing, editing, and formatting — an AI pipeline compresses these steps into minutes.</p>

<h3>Definition and Core Components</h3>
<p>The core components of a modern AI content pipeline include:</p>
<ul>
  <li>Keyword research and intent mapping</li>
  <li>Live SERP analysis to understand what's already ranking</li>
  <li>AI-generated outlines with editable H2/H3 structures</li>
  <li>Full long-form article generation with built-in SEO scoring</li>
  <li>Automatic FAQ generation for featured snippet targeting</li>
  <li>Meta title and description optimization</li>
</ul>

<h3>Why Traditional Content Workflows Are Broken</h3>
<p>The average SEO blog post takes <strong>4–6 hours</strong> to produce when done manually. For a solo founder or small content team, that means publishing 2–3 articles per week at best — and that's before factoring in editing, formatting, and CMS upload time.</p>
<p>At $150–$300 per article from freelance writers, the math becomes prohibitive fast. A 10-article-per-month content strategy costs <strong>$1,500 to $3,000</strong> — pricing out most early-stage startups and independent SEO professionals.</p>

<h2>How AI Content Pipelines Work (Step-by-Step)</h2>

<h3>Step 1: Keyword Research &amp; Intent Mapping</h3>
<p>The pipeline begins with a single input: your target keyword. The AI then analyzes search volume, keyword difficulty, and — most importantly — the <strong>search intent</strong> behind the query. Is the user looking for a definition, a comparison, a tutorial, or a product recommendation?</p>

<h3>Step 2: SERP Analysis &amp; Competitive Gaps</h3>
<p>Next, the system pulls and analyzes the top 10 ranking pages for your keyword. It examines their word counts, heading structures, content gaps, and the questions they fail to answer. This competitive intelligence shapes your article's structure to <strong>outperform existing content</strong>.</p>

<h3>Step 3: AI-Assisted Drafting with Human Oversight</h3>
<p>Using the researched outline, the AI generates a full long-form article. But here's the critical distinction: the best pipelines don't just generate and publish. They present the draft in a <strong>rich text editor</strong> where you can review, refine, add personal expertise, and ensure factual accuracy before publishing.</p>

<h2>The ROI of AI Content Pipelines for Founders</h2>

<h3>Cost Comparison: Freelancers vs AI Pipelines</h3>
<p>A freelance SEO writer charges $150–$300 per article. An AI pipeline like PekkerAI produces comparable-quality drafts for approximately <strong>$1 per article</strong>. For a 20-article monthly content calendar, that's the difference between $3,000–$6,000 and $20.</p>

<h3>Time Savings and Output Quality Benchmarks</h3>
<ul>
  <li><strong>Manual content creation:</strong> 4–6 hours per article</li>
  <li><strong>AI pipeline:</strong> 15–30 minutes per article (including human review)</li>
  <li><strong>Quality scores:</strong> AI-assisted content with human editing consistently scores 85+ on SEO tools like Surfer and Clearscope</li>
</ul>`;

const DUMMY_FAQS = [
    { q: 'What is an AI content pipeline?', a: 'An AI content pipeline is an automated workflow that handles keyword research, SERP analysis, content drafting, and SEO optimization — compressing hours of manual work into minutes.' },
    { q: 'Does AI-generated content rank on Google?', a: 'Yes. Over 16% of Google search results contain AI-generated content. Google evaluates content quality, not creation method. AI content with human editing ranks competitively.' },
    { q: 'How much does an AI content pipeline cost?', a: 'Tools like PekkerAI produce full SEO articles for approximately $1 each, compared to $150–$300 per article from freelance writers.' },
    { q: 'Is AI content safe from Google penalties?', a: 'Yes, when properly edited and published at a sustainable pace. Google penalizes low-quality spam, not AI-assisted content with human oversight.' },
];

const DUMMY_CALENDAR = [
    { day: 3, title: 'AI Content Pipeline Guide', status: 'published' },
    { day: 7, title: '10 SEO Mistakes Founders Make', status: 'published' },
    { day: 10, title: 'Keyword Research for SaaS', status: 'published' },
    { day: 14, title: 'How to Outrank Competitors', status: 'scheduled' },
    { day: 17, title: 'E-E-A-T Guide for AI Content', status: 'scheduled' },
    { day: 21, title: 'Content ROI Calculator', status: 'draft' },
    { day: 24, title: 'Link Building Strategies', status: 'draft' },
    { day: 28, title: 'Technical SEO Checklist', status: 'draft' },
];

// ─── Step Progress Bar ───
function StepIndicator({ currentStep, onStepClick }: { currentStep: number; onStepClick: (s: number) => void }) {
    const steps = [
        { num: 1, label: 'Input & Setup', icon: Search },
        { num: 2, label: 'Research & Structure', icon: FileText },
        { num: 3, label: 'Review & Refine', icon: Sparkles },
        { num: 4, label: 'Schedule & Publish', icon: Calendar },
    ];
    return (
        <div className="flex items-center justify-between gap-2 mb-8 px-2">
            {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                return (
                    <div key={step.num} className="flex items-center flex-1 last:flex-initial">
                        <button
                            onClick={() => onStepClick(step.num)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isActive ? 'bg-lime-400/15 border border-lime-400/30 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.08)]' :
                                isCompleted ? 'bg-white/5 border border-white/10 text-lime-400' :
                                    'bg-transparent border border-white/5 text-neutral-500 hover:border-white/15 hover:text-neutral-400'
                                }`}
                            aria-current={isActive ? 'step' : undefined}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isActive ? 'bg-lime-400 text-black' : isCompleted ? 'bg-lime-400/20 text-lime-400' : 'bg-white/5 text-neutral-500'
                                }`}>
                                {isCompleted ? <Check size={16} /> : step.num}
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-lime-400' : 'text-neutral-500'}`}>Step {step.num}</div>
                                <div className="text-sm font-semibold whitespace-nowrap">{step.label}</div>
                            </div>
                        </button>
                        {i < steps.length - 1 && (
                            <div className={`hidden md:block flex-1 h-px mx-3 transition-colors ${isCompleted ? 'bg-lime-400/40' : 'bg-white/5'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Step 1: Input & Setup ───
function Step1({ onNext }: { onNext: () => void }) {
    const [keyword, setKeyword] = useState('ai content pipeline for seo');
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Start with a <span className="text-lime-400">Keyword</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">Enter your target keyword and customize how the AI should approach your content.</p>
            </div>

            {/* Keyword Input */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
                <label htmlFor="keyword-input" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Target Keyword</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        id="keyword-input"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white text-lg font-medium placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                        placeholder="e.g. ai content pipeline for seo"
                    />
                </div>
            </div>

            {/* Controls Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Mic2 size={14} /> Tone</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Professional & Direct</option>
                        <option>Casual & Conversational</option>
                        <option>Technical & In-Depth</option>
                        <option>Persuasive & Sales-Oriented</option>
                    </select>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Globe size={14} /> Point of View</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Second Person (You/Your)</option>
                        <option>First Person (I/We)</option>
                        <option>Third Person (They/The)</option>
                    </select>
                </div>
            </div>

            <button onClick={onNext} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-base mx-auto">
                Analyze SERP & Generate Outline <ArrowRight size={18} />
            </button>
        </div>
    );
}

// ─── Step 2: Research & Structure ───
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">SERP Research & <span className="text-lime-400">Outline</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">We analyzed the top-ranking pages and generated a smart outline. Drag to reorder or edit headings.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* SERP Analysis Panel */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-5"><BarChart3 size={18} className="text-lime-400" /> Live SERP Analysis</h3>
                    <div className="space-y-3">
                        {DUMMY_SERP.map((r) => (
                            <div key={r.position} className="flex items-start gap-3 p-3 bg-black/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-neutral-400 shrink-0 mt-0.5">{r.position}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white truncate group-hover:text-lime-400 transition-colors">{r.title}</div>
                                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><ExternalLink size={10} />{r.url}</span>
                                        <span>{r.wordCount} words</span>
                                        <span>{r.headings} headings</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.score >= 90 ? 'bg-lime-400/15 text-lime-400' : r.score >= 85 ? 'bg-yellow-400/15 text-yellow-400' : 'bg-neutral-400/15 text-neutral-400'}`}>
                                        {r.score}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-lime-400/5 border border-lime-400/10 rounded-xl text-xs text-neutral-400">
                        <span className="text-lime-400 font-bold">Recommendation:</span> Target 2,800–3,200 words with 12–15 headings to outrank the current top results.
                    </div>
                </div>

                {/* Outline Panel */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-5"><FileText size={18} className="text-lime-400" /> Smart Outline</h3>
                    <div className="space-y-2">
                        {DUMMY_OUTLINE.map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/5 hover:border-lime-400/20 hover:bg-lime-400/[0.02] transition-all group cursor-grab ${item.type === 'h3' ? 'ml-6' : ''}`}>
                                <GripVertical size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0" />
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${item.type === 'h2' ? 'bg-lime-400/10 text-lime-400' : 'bg-white/5 text-neutral-500'}`}>{item.type}</span>
                                <span className="text-sm text-neutral-300 font-medium flex-1 truncate">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Meta Preview */}
                    <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Auto-Generated SEO Meta</div>
                        <div className="text-blue-400 text-base font-medium mb-1 truncate">AI Content Pipeline for SEO: The Complete Guide (2025)</div>
                        <div className="text-lime-500 text-xs mb-1">https://www.pekkerai.com › blog › ai-content-pipeline-seo</div>
                        <div className="text-neutral-400 text-xs leading-relaxed">Learn how to build an AI content pipeline that automates keyword research, SERP analysis, and article creation. Save 80% of your content budget.</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all">
                    <ChevronLeft size={18} /> Back
                </button>
                <button onClick={onNext} className="flex items-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95">
                    Generate Full Article <Sparkles size={18} />
                </button>
            </div>
        </div>
    );
}

// ─── Step 3: Review & Refine ───
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const handleDownloadHTML = () => {
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Content Pipeline for SEO: The Complete Guide (2025)</title>
  <meta name="description" content="Learn how to build an AI content pipeline that automates keyword research, SERP analysis, and article creation. Save 80% of your content budget.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 780px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; line-height: 1.7; }
    h1 { font-size: 2.2em; margin-bottom: 0.3em; color: #111; }
    h2 { font-size: 1.6em; margin-top: 2em; margin-bottom: 0.5em; color: #222; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; margin-top: 1.5em; margin-bottom: 0.4em; color: #333; }
    p { margin: 1em 0; }
    ul { padding-left: 1.5em; margin: 1em 0; }
    li { margin: 0.4em 0; }
    strong { color: #111; }
    .faq { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 2em; }
    .faq h2 { border: none; margin-top: 0; }
    .faq dt { font-weight: 700; margin-top: 1em; }
    .faq dd { margin-left: 0; margin-top: 0.3em; color: #555; }
  </style>
</head>
<body>
  <h1>AI Content Pipeline for SEO: The Complete Guide (2025)</h1>
  ${DUMMY_ARTICLE_HTML}
  <div class="faq">
    <h2>Frequently Asked Questions</h2>
    <dl>
      ${DUMMY_FAQS.map(f => `<dt>${f.q}</dt><dd>${f.a}</dd>`).join('\n      ')}
    </dl>
  </div>
</body>
</html>`;
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-content-pipeline-seo-article.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Review & <span className="text-lime-400">Refine</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">The article is ready. Use the editor to polish your draft, then move to scheduling.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Editor */}
                <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-white/[0.02] flex-wrap">
                        {[Bold, Italic, Heading2, List, Quote, Code, Link2, Image, AlignLeft].map((Icon, i) => (
                            <button key={i} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors">
                                <Icon size={16} />
                            </button>
                        ))}
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <button onClick={handleDownloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10 transition-colors text-xs font-semibold" title="Download as HTML">
                            <Download size={14} /> HTML
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Clock size={12} /> 8 min read · 2,847 words
                        </div>
                    </div>
                    {/* Formatted Article Content */}
                    <div
                        className="p-6 sm:p-8 max-h-[520px] overflow-y-auto article-preview"
                        dangerouslySetInnerHTML={{ __html: DUMMY_ARTICLE_HTML }}
                    />
                    <style>{`
                        .article-preview h2 { font-size: 1.4em; font-weight: 700; color: #a3e635; margin-top: 1.8em; margin-bottom: 0.6em; padding-bottom: 0.4em; border-bottom: 1px solid rgba(255,255,255,0.08); }
                        .article-preview h2:first-child { margin-top: 0; }
                        .article-preview h3 { font-size: 1.15em; font-weight: 600; color: #e5e5e5; margin-top: 1.4em; margin-bottom: 0.4em; }
                        .article-preview p { color: #a3a3a3; line-height: 1.75; margin: 0.8em 0; font-size: 0.875rem; }
                        .article-preview strong { color: #ffffff; font-weight: 600; }
                        .article-preview ul { list-style: none; padding: 0; margin: 0.8em 0; }
                        .article-preview ul li { position: relative; padding-left: 1.4em; color: #a3a3a3; font-size: 0.875rem; line-height: 1.75; margin: 0.35em 0; }
                        .article-preview ul li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 6px; height: 6px; border-radius: 50%; background: #a3e635; }
                    `}</style>
                </div>

                {/* Sidebar: SEO Score + FAQs */}
                <div className="space-y-6">
                    {/* SEO Score */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4">SEO Score</h3>
                        <div className="relative w-28 h-28 mx-auto mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#a3e635" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${88 * 3.14} ${100 * 3.14}`} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-lime-400">88</div>
                        </div>
                        <div className="space-y-2 text-xs">
                            {[
                                { label: 'Keyword Density', value: '2.8%', good: true },
                                { label: 'Readability', value: 'Grade 8', good: true },
                                { label: 'Heading Structure', value: '12/12', good: true },
                                { label: 'Internal Links', value: '2/3', good: false },
                                { label: 'Meta Description', value: '148 chars', good: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                    <span className="text-neutral-400">{item.label}</span>
                                    <span className={`font-bold ${item.good ? 'text-lime-400' : 'text-yellow-400'}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4"><Tag size={14} className="text-lime-400" /> Auto-Generated FAQs</h3>
                        <div className="space-y-3">
                            {DUMMY_FAQS.map((faq, i) => (
                                <details key={i} className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-lime-400 transition-colors list-none">
                                        <ChevronDown size={14} className="shrink-0 text-neutral-500 group-open:rotate-180 transition-transform" />
                                        {faq.q}
                                    </summary>
                                    <p className="text-[11px] text-neutral-500 mt-1.5 ml-6 leading-relaxed">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all">
                    <ChevronLeft size={18} /> Back
                </button>
                <button onClick={onNext} className="flex items-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95">
                    Schedule Article <CalendarDays size={18} />
                </button>
            </div>
        </div>
    );
}

// ─── Step 4: Schedule & Publish ───
function Step4({ onBack }: { onBack: () => void }) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const daysInMonth = 28;
    const startDay = 5; // February 2025 starts on Saturday (index 5 for Mon-start, adjust)

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Schedule & <span className="text-lime-400">Publish</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">Pick a date on your content calendar. Your article will be automatically exported to your connected CMS.</p>
            </div>

            {/* Calendar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">February 2025</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400" /> Published</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Scheduled</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neutral-500" /> Draft</span>
                    </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-neutral-500 uppercase tracking-wider py-2">{d}</div>
                    ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const event = DUMMY_CALENDAR.find(e => e.day === day);
                        const isSelected = selectedDay === day;
                        return (
                            <button
                                key={day}
                                onClick={() => { setSelectedDay(day); if (!event) setShowModal(true); }}
                                className={`relative p-2 h-20 sm:h-24 rounded-xl text-left text-xs border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isSelected ? 'border-lime-400/50 bg-lime-400/5' :
                                    event ? 'border-white/10 bg-white/[0.02] hover:border-white/20' :
                                        'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <span className={`font-bold ${isSelected ? 'text-lime-400' : 'text-neutral-400'}`}>{day}</span>
                                {event && (
                                    <div className="mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full mb-1 ${event.status === 'published' ? 'bg-lime-400' : event.status === 'scheduled' ? 'bg-blue-400' : 'bg-neutral-500'
                                            }`} />
                                        <div className="text-[10px] text-neutral-400 truncate leading-tight hidden sm:block">{event.title}</div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Scheduled Articles List */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-base font-bold text-white mb-4">Upcoming Schedule</h3>
                <div className="space-y-3">
                    {DUMMY_CALENDAR.filter(e => e.status !== 'published').map((event, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`w-2 h-10 rounded-full shrink-0 ${event.status === 'scheduled' ? 'bg-blue-400' : 'bg-neutral-500'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{event.title}</div>
                                <div className="text-xs text-neutral-500">Feb {event.day}, 2025 · {event.status === 'scheduled' ? 'Auto-publish to WordPress' : 'Needs review'}</div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${event.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'
                                }`}>{event.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all">
                    <ChevronLeft size={18} /> Back
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95"
                >
                    Schedule This Article <Check size={18} />
                </button>
            </div>

            {/* Scheduling Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setShowModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Schedule Article</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Article Title</label>
                                <input type="text" defaultValue="AI Content Pipeline for SEO: The Complete Guide (2025)" className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Publish Date</label>
                                <input type="date" defaultValue="2025-02-25" className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">CMS Destination</label>
                                <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                                    <option>WordPress (connected)</option>
                                    <option>Webflow</option>
                                    <option>Ghost</option>
                                    <option>Custom API</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => setShowModal(false)} className="mt-6 w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2">
                            Confirm & Schedule <Check size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───
export default function DemoPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            router.push('/dashboard/new');
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-lime-400/20 selection:text-lime-300 relative overflow-x-hidden">
            <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl" aria-label="Demo navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg">
                        <div className="w-9 h-9 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PekkerAI</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Blog</Link>
                        <Link href="/#pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/#pricing" className="hidden sm:flex px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-semibold text-sm rounded-full transition-all active:scale-95">
                            Get Early Access
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label="Toggle menu">
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-1">
                        <Link href="/" className="py-3 text-neutral-300 hover:text-lime-400 transition-colors font-medium">Home</Link>
                        <Link href="/blog" className="py-3 text-neutral-300 hover:text-lime-400 transition-colors font-medium">Blog</Link>
                        <Link href="/#pricing" className="py-3 text-neutral-300 hover:text-lime-400 transition-colors font-medium">Pricing</Link>
                    </div>
                )}
            </nav>

            {/* Page Header */}
            <header className="py-10 sm:py-16 px-4 sm:px-6 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-lime-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-semibold mb-6">
                        <Zap size={14} /> Interactive Product Demo
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
                        From <span className="text-lime-400">Keyword</span> to Published Article in Minutes
                    </h1>
                    <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
                        See how PekkerAI's 4-step workflow transforms a single keyword into a fully researched, SEO-optimized article ready for your CMS.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

                {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} />}
                {currentStep === 2 && <Step2 onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
                {currentStep === 3 && <Step3 onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />}
                {currentStep === 4 && <Step4 onBack={() => setCurrentStep(3)} />}
            </main>

            {/* Final CTA */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-gradient-to-t from-lime-400/5 to-transparent border-t border-white/5">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to build your <span className="text-lime-400">content engine?</span></h2>
                <p className="text-neutral-400 mb-8 max-w-md mx-auto">Start generating SEO-optimized articles for just $1 each. No credit card required.</p>
                <Link href="/#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-lg">
                    Get Started Free <ArrowRight size={20} />
                </Link>
            </section>
        </div>
    );
}
