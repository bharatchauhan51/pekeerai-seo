'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles, Search, FileText, Calendar, ChevronRight, ChevronLeft, Check, ArrowRight,
    Globe, Users, Mic2, BarChart3, ExternalLink, GripVertical, Clock, Tag, Zap,
    Bold, Italic, List, Link2, Image, AlignLeft, Heading2, Quote, Code,
    ChevronDown, X, CalendarDays, LogOut, Plus, Loader2, Download, Menu,
    SendHorizontal, Bot, MessageSquare, CornerDownLeft, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
</ul>

<h2>Best Practices for AI-Powered SEO Content</h2>

<h3>1. Always Add Human Expertise</h3>
<p>The most successful AI content strategies treat AI as a <strong>first-draft engine</strong>, not a publish button. Add your unique insights, case studies, proprietary data, and professional experience to every piece. This is what Google's E-E-A-T guidelines reward — genuine expertise that no AI can replicate.</p>

<h3>2. Optimize for Search Intent, Not Just Keywords</h3>
<p>Keyword stuffing is dead. Modern SEO demands that your content <strong>matches the user's intent</strong> precisely. If someone searches "best AI writing tools," they want a comparison — not a blog post about what AI writing is. Your pipeline should automatically detect intent type (informational, commercial, navigational, transactional) and structure content accordingly.</p>

<h3>3. Build Topic Clusters, Not Isolated Articles</h3>
<p>Individual articles rarely dominate SERPs on their own. The winning strategy is to build <strong>topic clusters</strong> — a pillar page supported by 8–15 related articles, all internally linked. An AI pipeline accelerates this by generating the entire cluster in days rather than months.</p>

<h2>Common Mistakes to Avoid</h2>

<h3>Publishing Without Review</h3>
<p>AI-generated content can contain <strong>hallucinated statistics</strong>, outdated information, or tonally inconsistent sections. Always review before publishing. The best pipelines include built-in fact-checking prompts and readability scores to flag potential issues.</p>

<h3>Ignoring Content Velocity Limits</h3>
<p>Publishing 50 articles overnight on a domain that previously published once a month is a red flag. Sustainable content velocity means <strong>gradually increasing output</strong> — start with 4–6 articles per week, then scale to 2–3 per day over several months.</p>

<ul>
  <li><strong>Month 1:</strong> 8–10 articles (establish baseline)</li>
  <li><strong>Month 2–3:</strong> 15–20 articles per month</li>
  <li><strong>Month 4+:</strong> 30–60 articles per month (with quality maintained)</li>
</ul>

<h2>Measuring Success: Key Metrics to Track</h2>

<p>Once your AI content pipeline is running, track these metrics to measure ROI and optimize performance:</p>

<ul>
  <li><strong>Organic traffic growth:</strong> Month-over-month increase in search-driven visits</li>
  <li><strong>Keyword rankings:</strong> Number of keywords in positions 1–10 vs. 11–50</li>
  <li><strong>Cost per article:</strong> Total pipeline cost divided by articles published</li>
  <li><strong>Time to publish:</strong> Average minutes from keyword input to live article</li>
  <li><strong>Content quality score:</strong> Average SEO tool score across all published pieces</li>
  <li><strong>Conversion rate:</strong> Percentage of organic visitors who take a desired action</li>
</ul>

<h2>Getting Started with Your First AI Content Pipeline</h2>

<p>Ready to build your own pipeline? Here's the fastest path to getting started:</p>

<ul>
  <li><strong>Choose your niche:</strong> Focus on a specific topic cluster where you have domain expertise</li>
  <li><strong>Audit existing content:</strong> Identify gaps and opportunities in your current library</li>
  <li><strong>Set up your pipeline:</strong> Connect your keyword research, AI drafting, and CMS tools</li>
  <li><strong>Create a content calendar:</strong> Plan 30 days of content with strategic keyword targeting</li>
  <li><strong>Publish and iterate:</strong> Review performance data weekly and refine your approach</li>
</ul>

<p>The founders and SEO professionals who adopt AI content pipelines today will have a <strong>compounding advantage</strong> over competitors who continue with manual workflows. The question isn't whether AI will transform content marketing — it's whether you'll be early enough to benefit.</p>`;

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

// ─── Step 1 ───
function Step1({ onNext }: { onNext: () => void }) {
    const [keyword, setKeyword] = useState('');
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Start with a <span className="text-lime-400">Keyword</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">Enter your target keyword and customize how the AI should approach your content.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
                <label htmlFor="keyword-input" className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Target Keyword</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input id="keyword-input" type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white text-lg font-medium placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all"
                        placeholder="e.g. best ai seo tools 2025" />
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Mic2 size={14} /> Tone</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Professional & Direct</option><option>Casual & Conversational</option><option>Technical & In-Depth</option><option>Persuasive & Sales-Oriented</option>
                    </select>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Globe size={14} /> Point of View</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Second Person (You/Your)</option><option>First Person (I/We)</option><option>Third Person (They/The)</option>
                    </select>
                </div>
            </div>
            <button onClick={onNext} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-base mx-auto">
                Analyze SERP & Generate Outline <ArrowRight size={18} />
            </button>
        </div>
    );
}

// ─── Step 2 ───
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">SERP Research & <span className="text-lime-400">Outline</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">We analyzed the top-ranking pages and generated a smart outline. Drag to reorder or edit headings.</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm"><ChevronLeft size={16} /> Back</button>
                <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm">Generate Full Article <Sparkles size={16} /></button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
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
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.score >= 90 ? 'bg-lime-400/15 text-lime-400' : r.score >= 85 ? 'bg-yellow-400/15 text-yellow-400' : 'bg-neutral-400/15 text-neutral-400'}`}>{r.score}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-lime-400/5 border border-lime-400/10 rounded-xl text-xs text-neutral-400">
                        <span className="text-lime-400 font-bold">Recommendation:</span> Target 2,800–3,200 words with 12–15 headings.
                    </div>
                </div>
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
                    <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Auto-Generated SEO Meta</div>
                        <div className="text-blue-400 text-base font-medium mb-1 truncate">AI Content Pipeline for SEO: The Complete Guide (2025)</div>
                        <div className="text-lime-500 text-xs mb-1">https://www.pekkerai.com › blog › ai-content-pipeline-seo</div>
                        <div className="text-neutral-400 text-xs leading-relaxed">Learn how to build an AI content pipeline that automates keyword research, SERP analysis, and article creation.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── AI Agent Responses (simulated) ───
const AI_RESPONSES: Record<string, string> = {
    'Make the intro more engaging': 'I\'ve rewritten the introduction with a compelling hook about the $3,000/month content budget problem that most founders face. The new opening uses a provocative question format and includes a concrete statistic to grab attention immediately. The tone is now more conversational while maintaining authority.',
    'Add more statistics': 'I\'ve enhanced the article with 5 additional data points:\n• 67% of marketers now use AI for content creation (HubSpot 2025)\n• AI-assisted articles see 34% higher organic traffic on average\n• Content production costs drop by 78% with AI pipelines\n• Time-to-publish decreases from 6 hours to 25 minutes\n• SEO scores improve by 15-20 points with AI optimization',
    'Improve SEO optimization': 'I\'ve made the following SEO improvements:\n• Added the target keyword to the first 100 words\n• Optimized H2/H3 heading structure for featured snippets\n• Added 3 internal linking opportunities\n• Improved meta description to 155 chars with CTA\n• Added schema markup suggestions for FAQ section\n• Keyword density adjusted from 2.8% to optimal 2.2%',
    'Make it shorter and punchier': 'I\'ve tightened the article from 2,847 to 2,100 words by:\n• Removing redundant explanations in sections 2 and 4\n• Merging the two ROI subsections into one impactful section\n• Converting long paragraphs into scannable bullet points\n• Shortening the conclusion to a powerful 3-sentence CTA\nThe core message and SEO value are preserved.',
    'Add a comparison table': 'I\'ve added a structured comparison table in the ROI section comparing:\n| Factor | Manual | AI Pipeline |\n• Cost per article: $150-300 vs $1\n• Time per article: 4-6 hours vs 15-30 min\n• Monthly output: 4-8 articles vs 30-60 articles\n• SEO score average: 72 vs 88\n• Consistency: Variable vs High\nThis table is formatted for featured snippet eligibility.',
};

const QUICK_ACTIONS = [
    'Make the intro more engaging',
    'Add more statistics',
    'Improve SEO optimization',
    'Make it shorter and punchier',
    'Add a comparison table',
];

// ─── Step 3 ───
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const chatEndRef = { current: null as HTMLDivElement | null };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = (message: string) => {
        if (!message.trim() || isAiTyping) return;
        const userMsg = message.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsAiTyping(true);
        scrollToBottom();

        // Simulate AI thinking + response
        setTimeout(() => {
            const aiResponse = AI_RESPONSES[userMsg] ||
                `I've analyzed your request: "${userMsg}". Here's what I've done:\n\n• Reviewed the article structure and content flow\n• Applied your suggested changes to the relevant sections\n• Re-optimized heading hierarchy and keyword placement\n• Updated the SEO score — it improved by 3 points\n\nThe article has been updated in the editor. Review the changes and let me know if you'd like further refinements.`;
            setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            setIsAiTyping(false);
            scrollToBottom();
        }, 1500 + Math.random() * 1000);
    };

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
                <p className="text-neutral-400 max-w-lg mx-auto">Your article is ready. Use the editor to polish or ask the AI agent to help refactor.</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm"><ChevronLeft size={16} /> Back</button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }}
                        className={`flex items-center gap-2 px-5 py-2.5 border font-semibold rounded-full transition-all text-sm active:scale-95 ${isSaved
                            ? 'border-lime-400/30 text-lime-400 bg-lime-400/10'
                            : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                            }`}
                    >
                        {isSaved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save Draft</>}
                    </button>
                    <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm">Schedule Article <CalendarDays size={16} /></button>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* ─── Article Editor (Left 2 cols) ─── */}
                <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-white/[0.02] flex-wrap">
                        {[Bold, Italic, Heading2, List, Quote, Code, Link2, Image, AlignLeft].map((Icon, i) => (
                            <button key={i} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"><Icon size={16} /></button>
                        ))}
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <button onClick={handleDownloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10 transition-colors text-xs font-semibold" title="Download as HTML">
                            <Download size={14} /> HTML
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2 text-xs text-neutral-500"><Clock size={12} /> 12 min read · 4,230 words</div>
                    </div>
                    {/* Formatted Article Content */}
                    <div
                        className="p-6 sm:p-8 overflow-y-auto article-preview"
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

                {/* ─── Right Sidebar ─── */}
                <div className="space-y-6">
                    {/* ─── AI Agent Chat Panel (Primary) ─── */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-lime-400/[0.06] to-transparent">
                            <div className="w-8 h-8 rounded-lg bg-lime-400/15 flex items-center justify-center">
                                <Bot size={16} className="text-lime-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white leading-tight">AI Writing Agent</h3>
                                <p className="text-[11px] text-neutral-500 leading-tight">Ask me to refine your article</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                                <span className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider">Online</span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[140px]" style={{ maxHeight: '320px' }}>
                            {chatMessages.length === 0 && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare size={20} className="text-neutral-600" />
                                    </div>
                                    <p className="text-xs text-neutral-500 mb-4">Ask the AI to refine your article</p>
                                    {/* Quick Action Chips */}
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {QUICK_ACTIONS.slice(0, 3).map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSendMessage(action)}
                                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-neutral-400 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5 transition-all"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'ai'
                                        ? 'bg-lime-400/15 text-lime-400'
                                        : 'bg-blue-400/15 text-blue-400'
                                        }`}>
                                        {msg.role === 'ai' ? <Bot size={12} /> : <Sparkles size={12} />}
                                    </div>
                                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'ai'
                                        ? 'bg-white/[0.06] border border-white/10 text-neutral-300 rounded-tl-md'
                                        : 'bg-blue-500/15 border border-blue-400/20 text-blue-200 rounded-tr-md'
                                        }`}>
                                        {msg.text.split('\n').map((line, li) => (
                                            <span key={li}>
                                                {line.startsWith('•') ? (
                                                    <span className="flex gap-1.5 items-start mt-1">
                                                        <span className="text-lime-400 mt-px">•</span>
                                                        <span>{line.substring(2)}</span>
                                                    </span>
                                                ) : (
                                                    <span>{line}</span>
                                                )}
                                                {li < msg.text.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {isAiTyping && (
                                <div className="flex gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-lime-400/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot size={12} className="text-lime-400" />
                                    </div>
                                    <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={(el) => { chatEndRef.current = el; }} />
                        </div>

                        {/* Quick Actions (show after first message) */}
                        {chatMessages.length > 0 && !isAiTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {QUICK_ACTIONS.filter(a => !chatMessages.some(m => m.text === a)).slice(0, 2).map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(action)}
                                        className="px-2.5 py-1 bg-white/5 border border-white/8 rounded-full text-[10px] text-neutral-500 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5 transition-all"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="border-t border-white/10 p-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(chatInput); }}
                                    placeholder="Ask AI to refine..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-xl text-white text-xs px-3.5 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/40 focus:border-lime-400/30 transition-all"
                                    disabled={isAiTyping}
                                />
                                <button
                                    onClick={() => handleSendMessage(chatInput)}
                                    disabled={!chatInput.trim() || isAiTyping}
                                    className="w-9 h-9 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-white/5 disabled:text-neutral-600 text-black flex items-center justify-center transition-all active:scale-90 shrink-0"
                                >
                                    <SendHorizontal size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 ml-1">
                                <CornerDownLeft size={9} className="text-neutral-600" />
                                <span className="text-[9px] text-neutral-600">Enter to send</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── SEO Score ─── */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-10 h-10 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#a3e635" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${88 * 3.14} ${100 * 3.14}`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-lime-400">88</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-tight">SEO Score</h3>
                                <p className="text-[11px] text-neutral-500 leading-tight">5 metrics analyzed</p>
                            </div>
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

                    {/* ─── Auto-Generated FAQs ─── */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3"><Tag size={14} className="text-lime-400" /> Auto-Generated FAQs <span className="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full ml-auto">{DUMMY_FAQS.length} questions</span></h3>
                        <div className="space-y-2">
                            {DUMMY_FAQS.map((faq, i) => (
                                <details key={i} className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-lime-400 transition-colors list-none py-1.5">
                                        <ChevronDown size={13} className="shrink-0 text-neutral-500 group-open:rotate-180 transition-transform" /> {faq.q}
                                    </summary>
                                    <p className="text-[11px] text-neutral-500 mt-1 mb-2 ml-5 leading-relaxed">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Step 4 ───
function Step4({ onBack }: { onBack: () => void }) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const router = useRouter();
    const daysInMonth = 28;
    const startDay = 5;

    const handleSchedule = () => {
        setIsScheduled(true);
        setTimeout(() => {
            setShowModal(false);
            // Redirect back to dashboard after scheduling
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Schedule & <span className="text-lime-400">Publish</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">Pick a date on your content calendar. Your article will be automatically exported to your connected CMS.</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm"><ChevronLeft size={16} /> Back</button>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm">
                    Schedule This Article <Check size={16} />
                </button>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">February 2025</h3>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400" /> Published</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Scheduled</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neutral-500" /> Draft</span>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-neutral-500 uppercase tracking-wider py-2">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const event = DUMMY_CALENDAR.find(e => e.day === day);
                        const isSelected = selectedDay === day;
                        return (
                            <button key={day} onClick={() => { setSelectedDay(day); if (!event) setShowModal(true); }}
                                className={`relative p-2 h-20 sm:h-24 rounded-xl text-left text-xs border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isSelected ? 'border-lime-400/50 bg-lime-400/5' : event ? 'border-white/10 bg-white/[0.02] hover:border-white/20' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                    }`}>
                                <span className={`font-bold ${isSelected ? 'text-lime-400' : 'text-neutral-400'}`}>{day}</span>
                                {event && (
                                    <div className="mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full mb-1 ${event.status === 'published' ? 'bg-lime-400' : event.status === 'scheduled' ? 'bg-blue-400' : 'bg-neutral-500'}`} />
                                        <div className="text-[10px] text-neutral-400 truncate leading-tight hidden sm:block">{event.title}</div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
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
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${event.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'}`}>{event.status}</span>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => !isScheduled && setShowModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        {isScheduled ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-lime-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Article Scheduled!</h3>
                                <p className="text-neutral-400 text-sm">Redirecting to your dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Schedule Article</h3>
                                    <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Article Title</label>
                                        <input type="text" defaultValue="AI Content Pipeline for SEO: Complete Guide (2025)" className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Publish Date</label>
                                        <input type="date" defaultValue="2025-02-25" className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">CMS Destination</label>
                                        <select className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                                            <option>WordPress (connected)</option><option>Webflow</option><option>Ghost</option><option>Custom API</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleSchedule} className="mt-6 w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2">
                                    Confirm & Schedule <Check size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───
export default function NewArticlePage() {
    const { user, isLoggedIn, isLoading, logout } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
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
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-lime-400/20 selection:text-lime-300 relative overflow-x-hidden">
            <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

            {/* Dashboard Nav */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                            <Sparkles size={17} className="text-black" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">PekkerAI</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 text-sm">
                        <Link href="/dashboard" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Dashboard</Link>
                        <Link href="/dashboard/account" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Account</Link>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <div className="w-px h-6 bg-white/10 hidden sm:block mr-1" />
                        <div className="flex items-center gap-2.5">
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
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Dashboard</Link>
                            <Link href="/dashboard/account" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Account</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <ChevronRight size={12} />
                    <span className="text-lime-400 font-semibold">Create New Article</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
                {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} />}
                {currentStep === 2 && <Step2 onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
                {currentStep === 3 && <Step3 onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />}
                {currentStep === 4 && <Step4 onBack={() => setCurrentStep(3)} />}
            </main>
        </div>
    );
}
