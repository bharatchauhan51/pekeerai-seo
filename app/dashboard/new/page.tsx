'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles, Search, FileText, Calendar, ChevronRight, ChevronLeft, Check, ArrowRight,
    Globe, Mic2, BarChart3, ExternalLink, GripVertical, Clock, Tag, Zap,
    Bold, Italic, List, Link2, Image, AlignLeft, Heading2, Quote, Code,
    ChevronDown, X, CalendarDays, LogOut, Loader2, Download, Menu,
    SendHorizontal, Bot, MessageSquare, CornerDownLeft, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    articleApi,
    SerpResult, OutlineItem, ArticleMeta, FaqItem, SeoScoreMetrics, CalendarEvent
} from '../../lib/api';

// ─── Shared Types for inter-step data ───
interface AnalysisData {
    serpResults: SerpResult[];
    outline: OutlineItem[];
    meta: ArticleMeta;
    recommendations: { targetWordCount: string; targetHeadings: string };
}

interface GenerationData {
    articleId: string;
    html: string;
    faqs: FaqItem[];
    seoScore: { overall: number; metrics: SeoScoreMetrics };
    stats: { wordCount: number; readTime: string };
}

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

// ─── Step 1: Keyword Input ───
function Step1({ onNext, onAnalysisComplete }: { onNext: () => void; onAnalysisComplete: (data: AnalysisData, keyword: string, tone: string, pov: string) => void }) {
    const [keyword, setKeyword] = useState('');
    const [tone, setTone] = useState('Professional & Direct');
    const [pov, setPov] = useState('Second Person (You/Your)');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!keyword.trim()) {
            setError('Please enter a target keyword.');
            return;
        }
        setError('');
        setIsAnalyzing(true);

        const { data, error: apiError } = await articleApi.analyze({
            keyword: keyword.trim(),
            tone,
            pointOfView: pov,
        });

        setIsAnalyzing(false);

        if (apiError || !data) {
            setError(apiError || 'Analysis failed. Please try again.');
            return;
        }

        onAnalysisComplete(data, keyword.trim(), tone, pov);
        onNext();
    };

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
                        placeholder="e.g. best ai seo tools 2025"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
                    />
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Mic2 size={14} /> Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Professional &amp; Direct</option><option>Casual &amp; Conversational</option><option>Technical &amp; In-Depth</option><option>Persuasive &amp; Sales-Oriented</option>
                    </select>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3"><Globe size={14} /> Point of View</label>
                    <select value={pov} onChange={(e) => setPov(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                        <option>Second Person (You/Your)</option><option>First Person (I/We)</option><option>Third Person (They/The)</option>
                    </select>
                </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold rounded-full transition-all active:scale-95 text-base mx-auto">
                {isAnalyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing SERP...</> : <>Analyze SERP & Generate Outline <ArrowRight size={18} /></>}
            </button>
        </div>
    );
}

// ─── Step 2: SERP & Outline ───
function Step2({ onNext, onBack, analysis, keyword, tone, pov, onGenerationComplete }: {
    onNext: () => void; onBack: () => void;
    analysis: AnalysisData | null;
    keyword: string; tone: string; pov: string;
    onGenerationComplete: (data: GenerationData) => void;
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!analysis) return;
        setError('');
        setIsGenerating(true);

        const { data, error: apiError } = await articleApi.generate({
            keyword,
            outline: analysis.outline,
            meta: analysis.meta,
            tone,
            pointOfView: pov,
        });

        setIsGenerating(false);

        if (apiError || !data) {
            setError(apiError || 'Generation failed. Please try again.');
            return;
        }

        onGenerationComplete(data);
        onNext();
    };

    if (!analysis) return null;

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">SERP Research & <span className="text-lime-400">Outline</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">We analyzed the top-ranking pages and generated a smart outline. Drag to reorder or edit headings.</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm"><ChevronLeft size={16} /> Back</button>
                <button onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold rounded-full transition-all active:scale-95 text-sm">
                    {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Generate Full Article <Sparkles size={16} /></>}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-5"><BarChart3 size={18} className="text-lime-400" /> Live SERP Analysis</h3>
                    <div className="space-y-3">
                        {analysis.serpResults.map((r) => (
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
                    {analysis.recommendations && (
                        <div className="mt-4 p-3 bg-lime-400/5 border border-lime-400/10 rounded-xl text-xs text-neutral-400">
                            <span className="text-lime-400 font-bold">Recommendation:</span> Target {analysis.recommendations.targetWordCount} words with {analysis.recommendations.targetHeadings} headings.
                        </div>
                    )}
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-5"><FileText size={18} className="text-lime-400" /> Smart Outline</h3>
                    <div className="space-y-2">
                        {analysis.outline.map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/5 hover:border-lime-400/20 hover:bg-lime-400/[0.02] transition-all group cursor-grab ${item.type === 'h3' ? 'ml-6' : ''}`}>
                                <GripVertical size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0" />
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${item.type === 'h2' ? 'bg-lime-400/10 text-lime-400' : 'bg-white/5 text-neutral-500'}`}>{item.type}</span>
                                <span className="text-sm text-neutral-300 font-medium flex-1 truncate">{item.text}</span>
                            </div>
                        ))}
                    </div>
                    {analysis.meta && (
                        <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/5">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Auto-Generated SEO Meta</div>
                            <div className="text-blue-400 text-base font-medium mb-1 truncate">{analysis.meta.title}</div>
                            {analysis.meta.slug && <div className="text-lime-500 text-xs mb-1">https://www.pekkerai.com › blog › {analysis.meta.slug}</div>}
                            <div className="text-neutral-400 text-xs leading-relaxed">{analysis.meta.description}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Step 3: Review & Refine ───
function Step3({ onNext, onBack, generation, onHtmlUpdate }: {
    onNext: () => void; onBack: () => void;
    generation: GenerationData | null;
    onHtmlUpdate: (html: string) => void;
}) {
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentHtml, setCurrentHtml] = useState(generation?.html || '');
    const [seoScore, setSeoScore] = useState(generation?.seoScore || { overall: 0, metrics: {} as SeoScoreMetrics });
    const chatEndRef = { current: null as HTMLDivElement | null };

    useEffect(() => {
        if (generation) {
            setCurrentHtml(generation.html);
            setSeoScore(generation.seoScore);
        }
    }, [generation]);

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const QUICK_ACTIONS = [
        'Make the intro more engaging',
        'Add more statistics',
        'Improve SEO optimization',
        'Make it shorter and punchier',
        'Add a comparison table',
    ];

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isAiTyping || !generation) return;
        const userMsg = message.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsAiTyping(true);
        scrollToBottom();

        const { data, error } = await articleApi.refine(generation.articleId, {
            instruction: userMsg,
            currentHtml,
        });

        if (data && !error) {
            setChatMessages(prev => [...prev, { role: 'ai', text: data.message }]);
            setCurrentHtml(data.updatedHtml);
            onHtmlUpdate(data.updatedHtml);
            if (data.updatedSeoScore) {
                setSeoScore(data.updatedSeoScore);
            }
        } else {
            setChatMessages(prev => [...prev, { role: 'ai', text: error || 'Sorry, something went wrong. Please try again.' }]);
        }

        setIsAiTyping(false);
        scrollToBottom();
    };

    const handleSave = async () => {
        if (!generation) return;
        const { error } = await articleApi.save(generation.articleId, {
            title: '', // will use existing
            html: currentHtml,
            meta: { title: '', description: '' },
            faqs: generation.faqs.map(f => ({ question: f.question, answer: f.answer })),
            status: 'draft',
        });
        if (!error) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };

    const handleDownloadHTML = () => {
        const blob = new Blob([currentHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'article.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!generation) return null;

    const seoMetrics = Object.entries(seoScore.metrics || {}).map(([label, data]) => ({
        label,
        value: data.value,
        good: data.pass,
    }));

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
                        onClick={handleSave}
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
                {/* Article Editor */}
                <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-white/[0.02] flex-wrap">
                        {[Bold, Italic, Heading2, List, Quote, Code, Link2, Image, AlignLeft].map((Icon, i) => (
                            <button key={i} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"><Icon size={16} /></button>
                        ))}
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <button onClick={handleDownloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10 transition-colors text-xs font-semibold" title="Download as HTML">
                            <Download size={14} /> HTML
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2 text-xs text-neutral-500"><Clock size={12} /> {generation.stats.readTime} · {generation.stats.wordCount} words</div>
                    </div>
                    <div
                        className="p-6 sm:p-8 overflow-y-auto article-preview"
                        dangerouslySetInnerHTML={{ __html: currentHtml }}
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

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* AI Chat Panel */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-lime-400/[0.06] to-transparent">
                            <div className="w-8 h-8 rounded-lg bg-lime-400/15 flex items-center justify-center"><Bot size={16} className="text-lime-400" /></div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white leading-tight">AI Writing Agent</h3>
                                <p className="text-[11px] text-neutral-500 leading-tight">Ask me to refine your article</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                                <span className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[140px]" style={{ maxHeight: '320px' }}>
                            {chatMessages.length === 0 && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare size={20} className="text-neutral-600" />
                                    </div>
                                    <p className="text-xs text-neutral-500 mb-4">Ask the AI to refine your article</p>
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {QUICK_ACTIONS.slice(0, 3).map((action, i) => (
                                            <button key={i} onClick={() => handleSendMessage(action)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-neutral-400 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5 transition-all">
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'ai' ? 'bg-lime-400/15 text-lime-400' : 'bg-blue-400/15 text-blue-400'}`}>
                                        {msg.role === 'ai' ? <Bot size={12} /> : <Sparkles size={12} />}
                                    </div>
                                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'ai' ? 'bg-white/[0.06] border border-white/10 text-neutral-300 rounded-tl-md' : 'bg-blue-500/15 border border-blue-400/20 text-blue-200 rounded-tr-md'}`}>
                                        {msg.text.split('\n').map((line, li) => (
                                            <span key={li}>
                                                {line.startsWith('•') ? (
                                                    <span className="flex gap-1.5 items-start mt-1"><span className="text-lime-400 mt-px">•</span><span>{line.substring(2)}</span></span>
                                                ) : (<span>{line}</span>)}
                                                {li < msg.text.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isAiTyping && (
                                <div className="flex gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-lime-400/15 flex items-center justify-center shrink-0 mt-0.5"><Bot size={12} className="text-lime-400" /></div>
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
                        {chatMessages.length > 0 && !isAiTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {QUICK_ACTIONS.filter(a => !chatMessages.some(m => m.text === a)).slice(0, 2).map((action, i) => (
                                    <button key={i} onClick={() => handleSendMessage(action)} className="px-2.5 py-1 bg-white/5 border border-white/8 rounded-full text-[10px] text-neutral-500 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5 transition-all">
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="border-t border-white/10 p-3">
                            <div className="flex items-center gap-2">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(chatInput); }}
                                    placeholder="Ask AI to refine..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-xl text-white text-xs px-3.5 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/40 focus:border-lime-400/30 transition-all"
                                    disabled={isAiTyping}
                                />
                                <button onClick={() => handleSendMessage(chatInput)} disabled={!chatInput.trim() || isAiTyping}
                                    className="w-9 h-9 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-white/5 disabled:text-neutral-600 text-black flex items-center justify-center transition-all active:scale-90 shrink-0">
                                    <SendHorizontal size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 ml-1">
                                <CornerDownLeft size={9} className="text-neutral-600" />
                                <span className="text-[9px] text-neutral-600">Enter to send</span>
                            </div>
                        </div>
                    </div>

                    {/* SEO Score */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-10 h-10 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#a3e635" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${seoScore.overall * 3.14} ${100 * 3.14}`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-lime-400">{seoScore.overall}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-tight">SEO Score</h3>
                                <p className="text-[11px] text-neutral-500 leading-tight">{seoMetrics.length} metrics analyzed</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-xs">
                            {seoMetrics.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                    <span className="text-neutral-400">{item.label}</span>
                                    <span className={`font-bold ${item.good ? 'text-lime-400' : 'text-yellow-400'}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQs */}
                    {generation.faqs.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3"><Tag size={14} className="text-lime-400" /> Auto-Generated FAQs <span className="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full ml-auto">{generation.faqs.length} questions</span></h3>
                            <div className="space-y-2">
                                {generation.faqs.map((faq, i) => (
                                    <details key={i} className="group">
                                        <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-lime-400 transition-colors list-none py-1.5">
                                            <ChevronDown size={13} className="shrink-0 text-neutral-500 group-open:rotate-180 transition-transform" /> {faq.question}
                                        </summary>
                                        <p className="text-[11px] text-neutral-500 mt-1 mb-2 ml-5 leading-relaxed">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Step 4: Schedule & Publish ───
function Step4({ onBack, generation }: { onBack: () => void; generation: GenerationData | null }) {
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleCms, setScheduleCms] = useState('WordPress (connected)');
    const router = useRouter();

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const startDay = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // Monday-based

    useEffect(() => {
        articleApi.calendar(currentMonth).then(({ data }) => {
            if (data) setCalendarEvents(data.events);
        });
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0]);
    }, [currentMonth]);

    const handleSchedule = async () => {
        if (!generation) return;
        setIsScheduling(true);

        const { error } = await articleApi.schedule(generation.articleId, {
            title: scheduleTitle,
            publishDate: scheduleDate,
            cmsDestination: scheduleCms,
            status: 'scheduled',
        });

        setIsScheduling(false);

        if (!error) {
            setIsScheduled(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/dashboard');
            }, 1500);
        }
    };

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

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
                    <h3 className="text-lg font-bold text-white">{monthName}</h3>
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
                        const event = calendarEvents.find(e => e.day === day);
                        const isSelected = selectedDay === day;
                        return (
                            <button key={day} onClick={() => { setSelectedDay(day); if (!event) setShowModal(true); }}
                                className={`relative p-2 h-20 sm:h-24 rounded-xl text-left text-xs border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isSelected ? 'border-lime-400/50 bg-lime-400/5' : event ? 'border-white/10 bg-white/[0.02] hover:border-white/20' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}>
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

            {/* Upcoming Schedule */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-base font-bold text-white mb-4">Upcoming Schedule</h3>
                <div className="space-y-3">
                    {calendarEvents.filter(e => e.status !== 'published').length === 0 ? (
                        <p className="text-neutral-500 text-sm text-center py-4">No upcoming events.</p>
                    ) : calendarEvents.filter(e => e.status !== 'published').map((event, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`w-2 h-10 rounded-full shrink-0 ${event.status === 'scheduled' ? 'bg-blue-400' : 'bg-neutral-500'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{event.title}</div>
                                <div className="text-xs text-neutral-500">Day {event.day} · {event.status === 'scheduled' ? 'Auto-publish' : 'Needs review'}</div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${event.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'}`}>{event.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Modal */}
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
                                        <input type="text" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Publish Date</label>
                                        <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">CMS Destination</label>
                                        <select value={scheduleCms} onChange={(e) => setScheduleCms(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50">
                                            <option>WordPress (connected)</option><option>Webflow</option><option>Ghost</option><option>Custom API</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleSchedule} disabled={isScheduling} className="mt-6 w-full py-3.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold rounded-full transition-all active:scale-95 flex items-center justify-center gap-2">
                                    {isScheduling ? <><Loader2 size={18} className="animate-spin" /> Scheduling...</> : <>Confirm & Schedule <Check size={18} /></>}
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

    // Shared state between steps
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [generationData, setGenerationData] = useState<GenerationData | null>(null);
    const [keyword, setKeyword] = useState('');
    const [tone, setTone] = useState('');
    const [pov, setPov] = useState('');

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
                    <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center"><Sparkles size={17} className="text-black" /></div>
                        <span className="text-lg font-bold tracking-tight">PekkerAI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-1 text-sm">
                        <Link href="/dashboard" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Dashboard</Link>
                        <Link href="/dashboard/account" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Account</Link>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <div className="w-px h-6 bg-white/10 hidden sm:block mr-1" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-black flex items-center justify-center text-xs font-bold ring-2 ring-lime-400/20">{user?.avatar}</div>
                            <div className="hidden lg:block">
                                <div className="text-sm font-semibold text-white leading-tight">{user?.name}</div>
                                <div className="text-[11px] text-neutral-500 leading-tight">{user?.plan} Plan</div>
                            </div>
                            <button onClick={() => { logout(); router.push('/login'); }} className="ml-1 text-neutral-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="Log out" title="Sign out"><LogOut size={16} /></button>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
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
                {currentStep === 1 && (
                    <Step1
                        onNext={() => setCurrentStep(2)}
                        onAnalysisComplete={(data, kw, t, p) => {
                            setAnalysisData(data);
                            setKeyword(kw);
                            setTone(t);
                            setPov(p);
                        }}
                    />
                )}
                {currentStep === 2 && (
                    <Step2
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                        analysis={analysisData}
                        keyword={keyword}
                        tone={tone}
                        pov={pov}
                        onGenerationComplete={(data) => setGenerationData(data)}
                    />
                )}
                {currentStep === 3 && (
                    <Step3
                        onNext={() => setCurrentStep(4)}
                        onBack={() => setCurrentStep(2)}
                        generation={generationData}
                        onHtmlUpdate={(html) => setGenerationData(prev => prev ? { ...prev, html } : prev)}
                    />
                )}
                {currentStep === 4 && (
                    <Step4
                        onBack={() => setCurrentStep(3)}
                        generation={generationData}
                    />
                )}
            </main>
        </div>
    );
}
