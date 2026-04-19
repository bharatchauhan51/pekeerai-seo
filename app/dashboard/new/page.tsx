'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles, Search, FileText, Calendar, ChevronRight, ChevronLeft, Check, ArrowRight,
    Globe, Mic2, BarChart3, ExternalLink, GripVertical, Clock, Tag, Zap,
    Bold, Italic, List, Link2, Image, AlignLeft, Heading1, Heading2, Quote, Code, Undo2, Redo2,
    ChevronDown, ChevronUp, X, CalendarDays, LogOut, Loader2, Download, Menu,
    SendHorizontal, Bot, MessageSquare, CornerDownLeft, Save, Trash2, Plus, Hash, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    articleApi, billingApi, webhookApi,
    SerpResult, OutlineItem, ArticleMeta, FaqItem, SeoScoreMetrics, CalendarEvent, ArticleDetail,
    SubscriptionResponse, PlanItem, AdvancedOutline, AdvancedOutlineResponse,
    StreamEvent, WebhookConfig
} from '../../lib/api';
import CustomDropdown from '../../components/CustomDropdown';

// ─── Shared Types for inter-step data ───
interface AnalysisData {
    articleId?: string;
    serpResults: SerpResult[];
    outline: OutlineItem[];
    meta: ArticleMeta;
    recommendations: { targetWordCount: string; targetHeadings: string };
    lsiKeywords?: string[];
    targetWordCount?: number;
}

interface GenerationData {
    articleId: string;
    html: string;
    faqs: FaqItem[];
    seoScore: { overall: number; metrics: SeoScoreMetrics };
    stats: { wordCount: number; readTime: string };
}

// ─── Step Progress Bar ───
function StepIndicator({ currentStep, onStepClick, lockedSteps = [] }: { currentStep: number; onStepClick: (s: number) => void; lockedSteps?: number[] }) {
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
                const isLocked = lockedSteps.includes(step.num);
                return (
                    <div key={step.num} className="flex items-center flex-1 last:flex-initial">
                        <button
                            onClick={() => !isLocked && onStepClick(step.num)}
                            disabled={isLocked}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isLocked ? 'bg-transparent border border-white/5 text-neutral-600 cursor-not-allowed opacity-40' :
                                isActive ? 'bg-lime-400/15 border border-lime-400/30 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.08)]' :
                                    isCompleted ? 'bg-white/5 border border-white/10 text-lime-400' :
                                        'bg-transparent border border-white/5 text-neutral-500 hover:border-white/15 hover:text-neutral-400'
                                }`}
                            aria-current={isActive ? 'step' : undefined}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isLocked ? 'bg-white/5 text-neutral-600' :
                                isActive ? 'bg-lime-400 text-black' : isCompleted ? 'bg-lime-400/20 text-lime-400' : 'bg-white/5 text-neutral-500'
                                }`}>
                                {isCompleted && !isLocked ? <Check size={16} /> : step.num}
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className={`text-xs font-bold uppercase tracking-widest ${isLocked ? 'text-neutral-600' : isActive ? 'text-lime-400' : 'text-neutral-500'}`}>Step {step.num}</div>
                                <div className="text-sm font-semibold whitespace-nowrap">{step.label}</div>
                            </div>
                        </button>
                        {i < steps.length - 1 && (
                            <div className={`hidden md:block flex-1 h-px mx-3 transition-colors ${isCompleted && !isLocked ? 'bg-lime-400/40' : 'bg-white/5'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Step 1: Keyword Input ───
function Step1({ onNext, onAnalysisComplete, onLimitReached }: {
    onNext: () => void;
    onAnalysisComplete: (data: AnalysisData, keyword: string, tone: string, pov: string, targetWordCount?: number, audience?: string) => void;
    onLimitReached: () => void;
}) {
    const [keyword, setKeyword] = useState('');
    const [tone, setTone] = useState('Professional & Direct');
    const [pov, setPov] = useState('Second Person (You/Your)');
    const [audience, setAudience] = useState('');
    const [targetWordCount, setTargetWordCount] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!keyword.trim()) {
            setError('Please enter a target keyword.');
            return;
        }
        setError('');
        setIsAnalyzing(true);

        // Check subscription limit before analyzing
        const { data: sub } = await billingApi.subscription();
        if (sub && sub.articlesLimit !== -1 && sub.articlesUsed >= sub.articlesLimit) {
            setIsAnalyzing(false);
            onLimitReached();
            return;
        }

        const { data, error: apiError } = await articleApi.analyze({
            keyword: keyword.trim(),
            tone,
            pointOfView: pov,
            targetWordCount: targetWordCount ? parseInt(targetWordCount) : undefined,
            audience: audience.trim() || undefined,
        });

        setIsAnalyzing(false);

        if (apiError || !data) {
            setError(apiError || 'Analysis failed. Please try again.');
            return;
        }

        if (data) {
            data.targetWordCount = targetWordCount ? parseInt(targetWordCount) : undefined;
        }
        onAnalysisComplete(data, keyword.trim(), tone, pov, targetWordCount ? parseInt(targetWordCount) : undefined, audience.trim() || undefined);
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
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 mb-10">
                <CustomDropdown
                    label="Tone"
                    icon={<Mic2 size={13} className="text-lime-400/70" />}
                    value={tone}
                    onChange={setTone}
                    options={[
                        { label: 'Professional & Direct', value: 'Professional & Direct' },
                        { label: 'Casual & Conversational', value: 'Casual & Conversational' },
                        { label: 'Technical & In-Depth', value: 'Technical & In-Depth' },
                        { label: 'Persuasive & Sales-Oriented', value: 'Persuasive & Sales-Oriented' }
                    ]}
                />
                <CustomDropdown
                    label="Point of View"
                    icon={<Globe size={13} className="text-lime-400/70" />}
                    value={pov}
                    onChange={setPov}
                    options={[
                        { label: 'Second Person (You/Your)', value: 'Second Person (You/Your)' },
                        { label: 'First Person (I/We)', value: 'First Person (I/We)' },
                        { label: 'Third Person (They/The)', value: 'Third Person (They/The)' }
                    ]}
                />
                <CustomDropdown
                    label="Target Audience"
                    icon={<Tag size={13} className="text-lime-400/70" />}
                    value={audience}
                    onChange={setAudience}
                    options={[
                        { label: 'Small Business Owners', value: 'Small Business Owners' },
                        { label: 'Marketing Professionals', value: 'Marketing Professionals' },
                        { label: 'Developers & Engineers', value: 'Developers & Engineers' },
                        { label: 'Content Creators', value: 'Content Creators' },
                        { label: 'Enterprise Decision Makers', value: 'Enterprise Decision Makers' },
                        { label: 'Beginners / General Public', value: 'Beginners / General Public' },
                        { label: 'E-commerce Store Owners', value: 'E-commerce Store Owners' },
                        { label: 'Startup Founders', value: 'Startup Founders' }
                    ]}
                />
                <div className="group">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2.5 transition-colors group-hover:text-neutral-400">
                        <FileText size={13} className="text-lime-400/70" /> Approx. Word Count
                    </label>
                    <div className="relative group/input">
                        <input
                            type="number"
                            value={targetWordCount}
                            onChange={(e) => setTargetWordCount(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl text-white pl-4 pr-16 py-3.5 text-sm font-semibold placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/30 transition-all hover:bg-black/60 hover:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Optional (e.g. 1500)"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-focus-within/input:opacity-100 transition-opacity flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">Words</span>
                        </div>
                    </div>
                </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold rounded-full transition-all active:scale-95 text-base mx-auto">
                {isAnalyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing SERP...</> : <>Analyze SERP & Generate Outline <ArrowRight size={18} /></>}
            </button>
        </div>
    );
}

// ─── Step 2: Outline Editor ───
function Step2({ onNext, onBack, analysis, keyword, tone, pov, audience, targetWordCount, onGenerationComplete, onStreamingUpdate }: {
    onNext: () => void; onBack: () => void;
    analysis: AnalysisData | null;
    keyword: string; tone: string; pov: string; audience?: string;
    targetWordCount?: number;
    onGenerationComplete: (data: GenerationData) => void;
    onStreamingUpdate?: (html: string, isStreaming: boolean) => void;
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [streamProgress, setStreamProgress] = useState<{ wordCount: number } | null>(null);
    const abortReaderRef = { current: null as ReadableStreamDefaultReader<Uint8Array> | null };

    // Outline state
    const [activeMode, setActiveMode] = useState<'quick' | 'advanced'>('quick');
    const [quickDraftItems, setQuickDraftItems] = useState<OutlineItem[]>(analysis?.outline || []);
    const [advancedOutline, setAdvancedOutline] = useState<AdvancedOutline | null>(null);
    const [isGeneratingAdvanced, setIsGeneratingAdvanced] = useState(false);
    const [advancedError, setAdvancedError] = useState('');

    // Editing states
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    // Advanced mode editing
    const [editingAdvanced, setEditingAdvanced] = useState<{ sIdx: number; subIdx?: number } | null>(null);
    const [editAdvancedText, setEditAdvancedText] = useState('');
    const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null);
    const [editFaqQ, setEditFaqQ] = useState('');
    const [editFaqA, setEditFaqA] = useState('');
    const [editIntroHook, setEditIntroHook] = useState(false);
    const [editConclusionCta, setEditConclusionCta] = useState(false);

    // LSI keywords
    const lsiKeywords = analysis?.lsiKeywords || [];

    // Sync quick draft from analysis
    useEffect(() => {
        if (analysis?.outline) setQuickDraftItems(analysis.outline);
    }, [analysis?.outline]);

    // Count headings in current outline
    const currentHeadingCount = activeMode === 'quick'
        ? quickDraftItems.length
        : advancedOutline
            ? advancedOutline.sections.reduce((acc, s) => acc + 1 + s.subsections.length, 0)
            : 0;

    // Parse recommendation ranges
    const targetHeadingsStr = analysis?.recommendations?.targetHeadings || '';
    const [minHeadings, maxHeadings] = targetHeadingsStr.split('-').map(Number);
    const headingInRange = currentHeadingCount >= (minHeadings || 0) && currentHeadingCount <= (maxHeadings || Infinity);
    const headingColor = headingInRange ? 'text-lime-400' : currentHeadingCount < (minHeadings || 0) ? 'text-yellow-400' : 'text-yellow-400';

    // LSI keyword coverage
    const allHeadingTexts = activeMode === 'quick'
        ? quickDraftItems.map(i => i.text.toLowerCase())
        : advancedOutline
            ? advancedOutline.sections.flatMap(s => [s.title.toLowerCase(), ...s.subsections.map(sub => sub.title.toLowerCase())])
            : [];
    const coveredLsi = lsiKeywords.filter(kw => allHeadingTexts.some(t => t.includes(kw.toLowerCase())));
    const lsiPercentage = lsiKeywords.length > 0 ? Math.round((coveredLsi.length / lsiKeywords.length) * 100) : 0;
    const lsiColor = lsiPercentage >= 70 ? 'text-lime-400' : lsiPercentage >= 50 ? 'text-yellow-400' : 'text-red-400';
    const lsiBgColor = lsiPercentage >= 70 ? 'bg-lime-400' : lsiPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400';

    // Fetch advanced outline
    const handleFetchAdvanced = async () => {
        if (advancedOutline) { setActiveMode('advanced'); return; }
        if (!analysis?.articleId) return;
        setIsGeneratingAdvanced(true);
        setAdvancedError('');

        const { data, error: apiErr } = await articleApi.outline({
            articleId: analysis.articleId,
            keyword,
            lsiKeywords,
            serpResults: analysis.serpResults,
        });

        setIsGeneratingAdvanced(false);

        if (apiErr || !data) {
            setAdvancedError(apiErr || 'Could not generate advanced outline. Try again or use Quick Draft.');
            return;
        }

        setAdvancedOutline(data.outline);
        setActiveMode('advanced');
    };

    // Generate article via SSE streaming (with fallback to non-streaming)
    const handleGenerate = async () => {
        if (!analysis) return;
        setError('');
        setIsGenerating(true);
        setStreamProgress(null);

        // Build the flat outline to send
        let outlineToSend: OutlineItem[] = [];
        if (activeMode === 'quick') {
            outlineToSend = quickDraftItems;
        } else if (advancedOutline) {
            outlineToSend = advancedOutline.sections.flatMap(s => [
                { type: 'h2' as const, text: s.title },
                ...s.subsections.map(sub => ({ type: 'h3' as const, text: sub.title })),
            ]);
        }

        const payload = {
            keyword,
            outline: outlineToSend,
            meta: analysis.meta,
            tone,
            pointOfView: pov,
            audience: audience || undefined,
            targetWordCount: targetWordCount || (analysis.targetWordCount ? analysis.targetWordCount : undefined),
            ...(analysis.articleId ? { articleId: analysis.articleId } : {}),
        };

        try {
            // Attempt SSE streaming
            const response = await articleApi.generateStream(payload);

            if (!response.ok || !response.body) {
                // Fallback to non-streaming
                console.warn('Streaming not available, falling back to non-streaming endpoint');
                const { data, error: apiError } = await articleApi.generate(payload);
                setIsGenerating(false);
                setStreamProgress(null);
                if (apiError || !data) { setError(apiError || 'Generation failed. Please try again.'); return; }
                onGenerationComplete(data);
                onNext();
                return;
            }

            const reader = response.body.getReader();
            abortReaderRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';
            let htmlAccumulator = '';
            let receivedArticleId = '';
            let streamTimedOut = false;

            // 60s timeout
            const timeoutId = setTimeout(() => {
                streamTimedOut = true;
                reader.cancel();
            }, 120000);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data: ')) continue;

                    try {
                        const data = JSON.parse(trimmed.slice(6)) as StreamEvent;

                        switch (data.type) {
                            case 'meta':
                                receivedArticleId = String(data.articleId);
                                break;
                            case 'chunk':
                                htmlAccumulator += data.content;
                                // Live word count
                                const wc = htmlAccumulator.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).filter(w => w.length > 0).length;
                                setStreamProgress({ wordCount: wc });
                                // Notify parent for real-time rendering
                                if (onStreamingUpdate) onStreamingUpdate(htmlAccumulator, true);
                                break;
                            case 'error':
                                setError(data.message);
                                break;
                            case 'done':
                                clearTimeout(timeoutId);
                                setIsGenerating(false);
                                setStreamProgress(null);
                                onGenerationComplete({
                                    articleId: String(data.articleId),
                                    html: htmlAccumulator,
                                    faqs: data.faqs,
                                    seoScore: data.seoScore,
                                    stats: data.stats,
                                });
                                if (onStreamingUpdate) onStreamingUpdate(htmlAccumulator, false);
                                onNext();
                                return;
                        }
                    } catch {
                        // Skip malformed lines
                    }
                }
            }

            clearTimeout(timeoutId);

            // If stream ended without a `done` event
            if (streamTimedOut) {
                setError('Generation may not have completed. Refresh to check.');
            } else if (htmlAccumulator && !error) {
                // Stream finished naturally (no done event but content received)
                onGenerationComplete({
                    articleId: receivedArticleId || analysis.articleId || '',
                    html: htmlAccumulator,
                    faqs: [],
                    seoScore: { overall: 0, metrics: {} as SeoScoreMetrics },
                    stats: { wordCount: htmlAccumulator.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length, readTime: '0 min' },
                });
                if (onStreamingUpdate) onStreamingUpdate(htmlAccumulator, false);
                onNext();
            }

            setIsGenerating(false);
            setStreamProgress(null);
        } catch (networkErr) {
            // Network error — try fallback
            console.warn('SSE stream failed, falling back:', networkErr);
            try {
                const { data, error: apiError } = await articleApi.generate(payload);
                setIsGenerating(false);
                setStreamProgress(null);
                if (apiError || !data) { setError(apiError || 'Generation failed. Please try again.'); return; }
                onGenerationComplete(data);
                onNext();
            } catch {
                setIsGenerating(false);
                setStreamProgress(null);
                setError('Generation failed. Please check your connection and try again.');
            }
        }
    };

    const handleStopGeneration = () => {
        if (abortReaderRef.current) {
            abortReaderRef.current.cancel();
            abortReaderRef.current = null;
        }
        setIsGenerating(false);
        setStreamProgress(null);
    };

    // ─── Quick Draft helpers ───
    const startEdit = (idx: number) => { setEditingIdx(idx); setEditText(quickDraftItems[idx].text); };
    const saveEdit = () => {
        if (editingIdx === null) return;
        setQuickDraftItems(prev => prev.map((item, i) => i === editingIdx ? { ...item, text: editText } : item));
        setEditingIdx(null);
    };
    const toggleType = (idx: number) => {
        setQuickDraftItems(prev => prev.map((item, i) => i === idx ? { ...item, type: item.type === 'h2' ? 'h3' : 'h2' } : item));
    };
    const deleteItem = (idx: number) => { setQuickDraftItems(prev => prev.filter((_, i) => i !== idx)); };
    const addHeading = (type: 'h2' | 'h3') => { setQuickDraftItems(prev => [...prev, { type, text: 'New heading' }]); };

    // Drag and drop
    const handleDragStart = (idx: number) => setDragIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
    const handleDrop = (idx: number) => {
        if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
        const items = [...quickDraftItems];
        const [moved] = items.splice(dragIdx, 1);
        items.splice(idx, 0, moved);
        setQuickDraftItems(items);
        setDragIdx(null);
        setDragOverIdx(null);
    };

    // ─── Advanced mode helpers ───
    const startAdvancedEdit = (sIdx: number, subIdx?: number) => {
        setEditingAdvanced({ sIdx, subIdx });
        if (!advancedOutline) return;
        if (subIdx !== undefined) {
            setEditAdvancedText(advancedOutline.sections[sIdx].subsections[subIdx].title);
        } else {
            setEditAdvancedText(advancedOutline.sections[sIdx].title);
        }
    };
    const saveAdvancedEdit = () => {
        if (!editingAdvanced || !advancedOutline) return;
        const { sIdx, subIdx } = editingAdvanced;
        setAdvancedOutline(prev => {
            if (!prev) return prev;
            const sections = prev.sections.map((s, si) => {
                if (si !== sIdx) return s;
                if (subIdx !== undefined) {
                    return { ...s, subsections: s.subsections.map((sub, sbi) => sbi === subIdx ? { ...sub, title: editAdvancedText } : sub) };
                }
                return { ...s, title: editAdvancedText };
            });
            return { ...prev, sections };
        });
        setEditingAdvanced(null);
    };
    const deleteAdvancedSection = (sIdx: number) => {
        setAdvancedOutline(prev => prev ? { ...prev, sections: prev.sections.filter((_, i) => i !== sIdx) } : prev);
    };
    const deleteAdvancedSub = (sIdx: number, subIdx: number) => {
        setAdvancedOutline(prev => {
            if (!prev) return prev;
            return { ...prev, sections: prev.sections.map((s, si) => si === sIdx ? { ...s, subsections: s.subsections.filter((_, i) => i !== subIdx) } : s) };
        });
    };
    const addAdvancedSection = () => {
        setAdvancedOutline(prev => prev ? { ...prev, sections: [...prev.sections, { type: 'H2' as const, title: 'New Section', subsections: [] }] } : prev);
    };
    const addAdvancedSub = (sIdx: number) => {
        setAdvancedOutline(prev => {
            if (!prev) return prev;
            return { ...prev, sections: prev.sections.map((s, si) => si === sIdx ? { ...s, subsections: [...s.subsections, { type: 'H3' as const, title: 'New Subsection' }] } : s) };
        });
    };

    // FAQ helpers
    const startFaqEdit = (idx: number) => {
        if (!advancedOutline) return;
        setEditingFaqIdx(idx);
        setEditFaqQ(advancedOutline.faq[idx].q);
        setEditFaqA(advancedOutline.faq[idx].a);
    };
    const saveFaqEdit = () => {
        if (editingFaqIdx === null || !advancedOutline) return;
        setAdvancedOutline(prev => {
            if (!prev) return prev;
            return { ...prev, faq: prev.faq.map((f, i) => i === editingFaqIdx ? { q: editFaqQ, a: editFaqA } : f) };
        });
        setEditingFaqIdx(null);
    };
    const deleteFaq = (idx: number) => {
        setAdvancedOutline(prev => prev ? { ...prev, faq: prev.faq.filter((_, i) => i !== idx) } : prev);
    };
    const addFaq = () => {
        setAdvancedOutline(prev => prev ? { ...prev, faq: [...prev.faq, { q: 'New question?', a: 'Answer here...' }] } : prev);
    };

    // Collapsed sections state for advanced
    const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
    const toggleCollapse = (idx: number) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    };

    if (!analysis) return null;

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">Edit Your <span className="text-lime-400">Outline</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto text-sm sm:text-base">Review and customize the article structure. Choose Quick Draft or Advanced mode.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                <button onClick={onBack} disabled={isGenerating} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={16} /> Back</button>
                <div className="flex items-center gap-3">
                    {isGenerating && streamProgress && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                            <span className="font-semibold text-lime-400">{streamProgress.wordCount}</span> words generated
                        </div>
                    )}
                    {isGenerating ? (
                        <button onClick={handleStopGeneration} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-400 font-bold rounded-full transition-all active:scale-95 text-sm">
                            <X size={16} /> Stop Generation
                        </button>
                    ) : (
                        <button onClick={handleGenerate} disabled={isGenerating} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-black font-bold rounded-full transition-all active:scale-95 text-sm">
                            Generate Article <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
            {advancedError && <p className="text-red-400 text-sm mb-4 text-center">{advancedError}</p>}

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                {/* ─── Main Panel: Outline Editor ─── */}
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                    {/* Mode Toggle */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <button
                                onClick={() => setActiveMode('quick')}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeMode === 'quick' ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.04)]' : 'border border-white/5 text-neutral-500 hover:text-neutral-300 hover:border-white/10'}`}
                            >
                                <FileText size={15} /> Quick Draft
                            </button>
                            <button
                                onClick={handleFetchAdvanced}
                                disabled={isGeneratingAdvanced}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeMode === 'advanced' ? 'bg-gradient-to-r from-lime-400/15 to-emerald-400/10 border border-lime-400/30 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.08)]' : 'border border-white/5 text-neutral-500 hover:text-lime-400 hover:border-lime-400/20'}`}
                            >
                                {isGeneratingAdvanced ? <><Loader2 size={15} className="animate-spin" /> Generating...</> : <><Sparkles size={15} /> Advanced ✨</>}
                            </button>
                        </div>

                        {/* ─── Quick Draft Mode ─── */}
                        {activeMode === 'quick' && (
                            <div className="space-y-2">
                                {quickDraftItems.map((item, i) => (
                                    <div
                                        key={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDrop={() => handleDrop(i)}
                                        onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                                        className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 group ${dragOverIdx === i ? 'border-lime-400/40 bg-lime-400/5' : 'border-white/5 hover:border-white/15'} ${item.type === 'h3' ? 'ml-4 sm:ml-8' : ''}`}
                                    >
                                        <GripVertical size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0 cursor-grab active:cursor-grabbing" />
                                        <button
                                            onClick={() => toggleType(i)}
                                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0 transition-colors cursor-pointer ${item.type === 'h2' ? 'bg-blue-400/15 text-blue-400 hover:bg-blue-400/25' : 'bg-white/5 text-neutral-500 hover:bg-white/10'}`}
                                            title="Click to toggle H2/H3"
                                        >
                                            {item.type}
                                        </button>
                                        {editingIdx === i ? (
                                            <input
                                                type="text"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                onBlur={saveEdit}
                                                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingIdx(null); }}
                                                autoFocus
                                                className="flex-1 min-w-0 bg-black/40 border border-lime-400/30 rounded-lg text-xs sm:text-sm text-white px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                                            />
                                        ) : (
                                            <span
                                                onClick={() => startEdit(i)}
                                                className="text-xs sm:text-sm text-neutral-300 font-medium flex-1 min-w-0 cursor-text hover:text-white transition-colors truncate"
                                            >
                                                {item.text}
                                            </span>
                                        )}
                                        <button onClick={() => deleteItem(i)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete heading">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 pt-3">
                                    <button onClick={() => addHeading('h2')} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-lime-400 border border-white/5 hover:border-lime-400/20 rounded-xl transition-all">
                                        <Plus size={13} /> Add H2
                                    </button>
                                    <button onClick={() => addHeading('h3')} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-lime-400 border border-white/5 hover:border-lime-400/20 rounded-xl transition-all">
                                        <Plus size={13} /> Add H3
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ─── Advanced Mode ─── */}
                        {activeMode === 'advanced' && advancedOutline && (
                            <div className="space-y-3">
                                {/* Intro Hook */}
                                <div className="bg-gradient-to-r from-lime-400/5 to-transparent border border-lime-400/10 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-lime-400 uppercase tracking-widest mb-2">Intro Hook</div>
                                    {editIntroHook ? (
                                        <textarea
                                            value={advancedOutline.introHook}
                                            onChange={(e) => setAdvancedOutline(prev => prev ? { ...prev, introHook: e.target.value } : prev)}
                                            onBlur={() => setEditIntroHook(false)}
                                            autoFocus
                                            rows={2}
                                            className="w-full bg-black/40 border border-lime-400/30 rounded-lg text-sm text-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40 resize-none"
                                        />
                                    ) : (
                                        <p onClick={() => setEditIntroHook(true)} className="text-sm text-neutral-400 cursor-text hover:text-neutral-200 transition-colors italic leading-relaxed m-0">&ldquo;{advancedOutline.introHook}&rdquo;</p>
                                    )}
                                </div>

                                {/* Sections */}
                                {advancedOutline.sections.map((section, sIdx) => (
                                    <div key={sIdx} className="border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/[0.02] group">
                                            <button onClick={() => toggleCollapse(sIdx)} className="text-neutral-500 hover:text-white transition-colors shrink-0">
                                                {collapsedSections.has(sIdx) ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-blue-400/15 text-blue-400 shrink-0">H2</span>
                                            {editingAdvanced?.sIdx === sIdx && editingAdvanced.subIdx === undefined ? (
                                                <input
                                                    type="text" value={editAdvancedText} onChange={(e) => setEditAdvancedText(e.target.value)}
                                                    onBlur={saveAdvancedEdit} onKeyDown={(e) => { if (e.key === 'Enter') saveAdvancedEdit(); if (e.key === 'Escape') setEditingAdvanced(null); }}
                                                    autoFocus className="flex-1 min-w-0 bg-black/40 border border-lime-400/30 rounded-lg text-xs sm:text-sm text-white px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                                                />
                                            ) : (
                                                <span onClick={() => startAdvancedEdit(sIdx)} className="text-xs sm:text-sm text-white font-semibold flex-1 min-w-0 cursor-text hover:text-lime-400 transition-colors truncate">{section.title}</span>
                                            )}
                                            <button onClick={() => addAdvancedSub(sIdx)} className="opacity-0 group-hover:opacity-100 p-1. rounded-lg text-neutral-600 hover:text-lime-400 hover:bg-lime-400/10 transition-all shrink-0" title="Add H3"><Plus size={13} /></button>
                                            <button onClick={() => deleteAdvancedSection(sIdx)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0" title="Delete"><Trash2 size={13} /></button>
                                        </div>
                                        {!collapsedSections.has(sIdx) && section.subsections.length > 0 && (
                                            <div className="pl-6 sm:pl-10 pr-3 sm:pr-4 py-2 space-y-1 border-t border-white/5">
                                                {section.subsections.map((sub, subIdx) => (
                                                    <div key={subIdx} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/[0.02] transition-colors group/sub">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-neutral-500 shrink-0">H3</span>
                                                        {editingAdvanced?.sIdx === sIdx && editingAdvanced.subIdx === subIdx ? (
                                                            <input
                                                                type="text" value={editAdvancedText} onChange={(e) => setEditAdvancedText(e.target.value)}
                                                                onBlur={saveAdvancedEdit} onKeyDown={(e) => { if (e.key === 'Enter') saveAdvancedEdit(); if (e.key === 'Escape') setEditingAdvanced(null); }}
                                                                autoFocus className="flex-1 min-w-0 bg-black/40 border border-lime-400/30 rounded-lg text-xs sm:text-sm text-white px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                                                            />
                                                        ) : (
                                                            <span onClick={() => startAdvancedEdit(sIdx, subIdx)} className="text-xs sm:text-sm text-neutral-300 font-medium flex-1 min-w-0 cursor-text hover:text-white transition-colors truncate">{sub.title}</span>
                                                        )}
                                                        <button onClick={() => deleteAdvancedSub(sIdx, subIdx)} className="opacity-0 group-hover/sub:opacity-100 p-1 rounded text-neutral-600 hover:text-red-400 transition-all shrink-0"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addAdvancedSection} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-lime-400 border border-white/5 hover:border-lime-400/20 rounded-xl transition-all mt-2">
                                    <Plus size={13} /> Add H2 Section
                                </button>

                                {/* FAQ Section */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <HelpCircle size={16} className="text-lime-400" />
                                        <span className="text-sm font-bold text-white">FAQ Section</span>
                                        <span className="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full ml-auto">{advancedOutline.faq.length} questions</span>
                                    </div>
                                    <div className="space-y-2">
                                        {advancedOutline.faq.map((faq, fIdx) => (
                                            <div key={fIdx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors group/faq">
                                                {editingFaqIdx === fIdx ? (
                                                    <div className="space-y-2">
                                                        <input type="text" value={editFaqQ} onChange={(e) => setEditFaqQ(e.target.value)} placeholder="Question" className="w-full bg-black/40 border border-lime-400/30 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40" />
                                                        <textarea value={editFaqA} onChange={(e) => setEditFaqA(e.target.value)} placeholder="Answer" rows={2} className="w-full bg-black/40 border border-white/10 rounded-lg text-sm text-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400/40 resize-none" />
                                                        <div className="flex gap-2">
                                                            <button onClick={saveFaqEdit} className="text-xs font-bold text-lime-400 hover:text-lime-300 px-3 py-1 bg-lime-400/10 rounded-lg transition-colors">Save</button>
                                                            <button onClick={() => setEditingFaqIdx(null)} className="text-xs font-bold text-neutral-500 hover:text-white px-3 py-1 rounded-lg transition-colors">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1 cursor-text" onClick={() => startFaqEdit(fIdx)}>
                                                            <div className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors">Q: {faq.q}</div>
                                                            <div className="text-[11px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">A: {faq.a}</div>
                                                        </div>
                                                        <button onClick={() => deleteFaq(fIdx)} className="opacity-0 group-hover/faq:opacity-100 p-1 rounded text-neutral-600 hover:text-red-400 transition-all shrink-0"><Trash2 size={12} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={addFaq} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-lime-400 border border-white/5 hover:border-lime-400/20 rounded-xl transition-all">
                                            <Plus size={13} /> Add FAQ
                                        </button>
                                    </div>
                                </div>

                                {/* Conclusion CTA */}
                                <div className="bg-gradient-to-r from-emerald-400/5 to-transparent border border-emerald-400/10 rounded-xl p-4 mt-4">
                                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Conclusion CTA</div>
                                    {editConclusionCta ? (
                                        <textarea
                                            value={advancedOutline.conclusionCta}
                                            onChange={(e) => setAdvancedOutline(prev => prev ? { ...prev, conclusionCta: e.target.value } : prev)}
                                            onBlur={() => setEditConclusionCta(false)}
                                            autoFocus rows={2}
                                            className="w-full bg-black/40 border border-emerald-400/30 rounded-lg text-sm text-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                                        />
                                    ) : (
                                        <p onClick={() => setEditConclusionCta(true)} className="text-sm text-neutral-400 cursor-text hover:text-neutral-200 transition-colors italic leading-relaxed m-0">&ldquo;{advancedOutline.conclusionCta}&rdquo;</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Loading state for advanced */}
                        {activeMode === 'advanced' && !advancedOutline && isGeneratingAdvanced && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <Loader2 size={28} className="animate-spin text-lime-400" />
                                <p className="text-sm text-neutral-400 font-medium">Generating LSI-optimized outline...</p>
                                <p className="text-xs text-neutral-600">This may take 5–10 seconds</p>
                            </div>
                        )}

                        {/* Empty state */}
                        {activeMode === 'advanced' && !advancedOutline && !isGeneratingAdvanced && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <Sparkles size={28} className="text-neutral-600" />
                                <p className="text-sm text-neutral-500">Click &ldquo;Advanced ✨&rdquo; above to generate an LSI-powered outline</p>
                            </div>
                        )}
                    </div>

                    {/* SEO Meta Preview */}
                    {analysis.meta && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Auto-Generated SEO Meta</div>
                            <div className="text-blue-400 text-base font-medium mb-1 truncate">{analysis.meta.title}</div>
                            {analysis.meta.slug && <div className="text-lime-500 text-xs mb-1">https://www.pekkerai.com › blog › {analysis.meta.slug}</div>}
                            <div className="text-neutral-400 text-xs leading-relaxed">{analysis.meta.description}</div>
                        </div>
                    )}
                </div>

                {/* ─── Sidebar ─── */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Recommendations Card */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4"><Zap size={14} className="text-lime-400" /> Recommendations</h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                                <span className="text-neutral-400">Target Word Count</span>
                                <span className="font-bold text-neutral-300">{analysis.recommendations?.targetWordCount || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                                <span className="text-neutral-400">Target Headings</span>
                                <span className="font-bold text-neutral-300">{analysis.recommendations?.targetHeadings || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-neutral-400">Current Headings</span>
                                <span className={`font-bold ${headingColor}`}>{currentHeadingCount}</span>
                            </div>
                            <div className={`mt-2 p-2.5 rounded-lg text-[11px] font-medium ${headingInRange ? 'bg-lime-400/5 border border-lime-400/10 text-lime-400' : 'bg-yellow-400/5 border border-yellow-400/10 text-yellow-400'}`}>
                                {headingInRange ? '✓ Heading count is within the recommended range' : `⚠ Aim for ${targetHeadingsStr} headings`}
                            </div>
                        </div>
                    </div>

                    {/* LSI Keywords Sidebar */}
                    {lsiKeywords.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Hash size={14} className="text-lime-400" />
                                <h3 className="text-sm font-bold text-white">LSI Keywords</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${lsiPercentage >= 70 ? 'bg-lime-400/10 text-lime-400' : lsiPercentage >= 50 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'}`}>
                                    {coveredLsi.length}/{lsiKeywords.length}
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${lsiBgColor}`} style={{ width: `${lsiPercentage}%` }} />
                            </div>
                            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                {lsiKeywords.map((kw, i) => {
                                    const isCovered = allHeadingTexts.some(t => t.includes(kw.toLowerCase()));
                                    return (
                                        <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${isCovered ? 'bg-lime-400/5 text-lime-400' : 'text-neutral-500 hover:text-neutral-300'}`}>
                                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isCovered ? 'border-lime-400/40 bg-lime-400/20' : 'border-white/10'}`}>
                                                {isCovered && <Check size={9} className="text-lime-400" />}
                                            </div>
                                            <span className="truncate font-medium">{kw}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SERP Competitors Sidebar */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4"><BarChart3 size={14} className="text-lime-400" /> SERP Competitors</h3>
                        <div className="space-y-2">
                            {analysis.serpResults.slice(0, 5).map((r) => {
                                let domain = '';
                                try { domain = new URL(r.url).hostname.replace('www.', ''); } catch { domain = r.url; }
                                return (
                                    <a key={r.position} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all group/serp">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-neutral-400 shrink-0">{r.position}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-neutral-300 truncate group-hover/serp:text-lime-400 transition-colors">{r.title}</div>
                                            <div className="text-[10px] text-neutral-600 truncate">{domain}</div>
                                        </div>
                                        <ExternalLink size={11} className="text-neutral-600 group-hover/serp:text-neutral-400 shrink-0" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Step 3: Review & Refine ───
function Step3({ onNext, onBack, generation, onHtmlUpdate, keyword, meta }: {
    onNext: () => void; onBack: () => void;
    generation: GenerationData | null;
    onHtmlUpdate: (html: string) => void;
    keyword: string;
    meta: ArticleMeta | null;
}) {
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentHtml, setCurrentHtml] = useState(generation?.html || '');
    const [seoScore, setSeoScore] = useState(generation?.seoScore || { overall: 0, metrics: {} as SeoScoreMetrics });

    // Dynamic Stats
    const wordCount = currentHtml ? currentHtml.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    const chatEndRef = { current: null as HTMLDivElement | null };
    const editorRef = { current: null as HTMLDivElement | null };
    const isInitialized = { current: false };

    const [linkPrompt, setLinkPrompt] = useState<{ isOpen: boolean; range: Range | null }>({ isOpen: false, range: null });
    const [imagePrompt, setImagePrompt] = useState<{ isOpen: boolean; range: Range | null }>({ isOpen: false, range: null });
    const [popupUrl, setPopupUrl] = useState('');

    useEffect(() => {
        if (generation) {
            setCurrentHtml(generation.html);
            setSeoScore(generation.seoScore);
            // Only manually set innerHTML on first load to avoid destroying browser native undo/redo history stack
            if (editorRef.current && generation.html && !isInitialized.current) {
                editorRef.current.innerHTML = generation.html;
                isInitialized.current = true;
            }
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
            title: meta?.title || keyword,
            html: currentHtml,
            meta: { title: meta?.title || keyword, description: meta?.description || '' },
            faqs: generation.faqs.map(f => ({ question: f.question, answer: f.answer })),
            status: 'draft',
        });
        if (!error) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };

    const handleDownloadHTML = () => {
        const title = meta?.title || 'article';
        const description = meta?.description || '';
        const slug = meta?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.7; color: #1a1a1a; }
    h1, h2, h3 { line-height: 1.3; }
    img { max-width: 100%; height: auto; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 1rem; color: #555; }
    a { color: #2563eb; }
  </style>
</head>
<body>
${currentHtml}
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.html`;
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
                    <button onClick={handleDownloadHTML} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all active:scale-95 text-sm">
                        <Download size={16} /> Download HTML
                    </button>
                    <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm">Schedule Article <CalendarDays size={16} /></button>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Article Editor */}
                <div className="lg:col-span-2 relative min-h-[600px]">
                    <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-white/[0.02] flex-wrap shrink-0">
                            {[
                                { icon: Bold, title: 'Bold', action: () => document.execCommand('bold') },
                                { icon: Italic, title: 'Italic', action: () => document.execCommand('italic') },
                                { icon: Heading1, title: 'Heading 1', action: () => document.execCommand('formatBlock', false, 'H1') },
                                { icon: Heading2, title: 'Heading 2', action: () => document.execCommand('formatBlock', false, 'H2') },
                                { icon: List, title: 'Bullet List', action: () => document.execCommand('insertUnorderedList') },
                                {
                                    icon: Code, title: 'Code', action: () => {
                                        const sel = window.getSelection();
                                        if (sel) {
                                            const text = sel.toString() || 'code';
                                            document.execCommand('insertHTML', false, `<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em;">${text}</code>`);
                                        }
                                    }
                                },
                                { icon: AlignLeft, title: 'Align Left', action: () => document.execCommand('justifyLeft') },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    title={btn.title}
                                    onClick={(e) => e.preventDefault()}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        btn.action();
                                        if (editorRef.current) {
                                            const newHtml = editorRef.current.innerHTML;
                                            setCurrentHtml(newHtml);
                                            onHtmlUpdate(newHtml);
                                        }
                                    }}
                                    className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <btn.icon size={16} />
                                </button>
                            ))}
                            <div className="w-px h-5 bg-white/10 mx-1" />
                            {[
                                { icon: Undo2, title: 'Undo (Ctrl+Z)', action: () => document.execCommand('undo') },
                                { icon: Redo2, title: 'Redo (Ctrl+Y)', action: () => document.execCommand('redo') },
                            ].map((btn, i) => (
                                <button
                                    key={`ur-${i}`}
                                    type="button"
                                    title={btn.title}
                                    onClick={(e) => e.preventDefault()}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        btn.action();
                                        if (editorRef.current) {
                                            const newHtml = editorRef.current.innerHTML;
                                            setCurrentHtml(newHtml);
                                            onHtmlUpdate(newHtml);
                                        }
                                    }}
                                    className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <btn.icon size={16} />
                                </button>
                            ))}
                            <div className="w-px h-5 bg-white/10 mx-1" />
                            <button onClick={handleDownloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 hover:text-lime-400 hover:bg-lime-400/10 transition-colors text-xs font-semibold" title="Download as HTML">
                                <Download size={14} /> HTML
                            </button>
                            <div className="flex-1" />
                            <div className="flex items-center gap-2 text-xs text-neutral-500"><Clock size={12} /> {readTime} · {wordCount} words</div>
                        </div>

                        {(linkPrompt.isOpen || imagePrompt.isOpen) && (
                            <div className="absolute inset-x-0 top-14 mx-4 p-4 rounded-xl bg-black border border-white/20 shadow-2xl z-10 flex items-center gap-3">
                                <span className="text-white text-sm font-semibold">{linkPrompt.isOpen ? 'Insert Link' : 'Insert Image'}</span>
                                <input
                                    autoFocus
                                    type="url"
                                    placeholder="https://"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                                    value={popupUrl}
                                    onChange={(e) => setPopupUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const promptState = linkPrompt.isOpen ? linkPrompt : imagePrompt;
                                            const command = linkPrompt.isOpen ? 'createLink' : 'insertImage';

                                            if (popupUrl) {
                                                if (editorRef.current) {
                                                    editorRef.current.focus();
                                                }
                                                const sel = window.getSelection();
                                                if (sel && promptState.range) {
                                                    sel.removeAllRanges();
                                                    sel.addRange(promptState.range);

                                                    if (command === 'createLink') {
                                                        const textContent = promptState.range.toString();
                                                        if (!textContent) {
                                                            document.execCommand('insertHTML', false, `<a target="_blank" href="${popupUrl}">${popupUrl}</a>`);
                                                        } else {
                                                            const fragment = promptState.range.cloneContents();
                                                            const div = document.createElement('div');
                                                            div.appendChild(fragment);
                                                            const htmlContent = div.innerHTML || textContent;
                                                            document.execCommand('insertHTML', false, `<a target="_blank" href="${popupUrl}">${htmlContent}</a>`);
                                                        }
                                                    } else {
                                                        document.execCommand(command, false, popupUrl);
                                                    }
                                                }
                                            }

                                            if (editorRef.current) {
                                                const newHtml = editorRef.current.innerHTML;
                                                setCurrentHtml(newHtml);
                                                onHtmlUpdate(newHtml);
                                            }

                                            setLinkPrompt({ isOpen: false, range: null });
                                            setImagePrompt({ isOpen: false, range: null });
                                        } else if (e.key === 'Escape') {
                                            setLinkPrompt({ isOpen: false, range: null });
                                            setImagePrompt({ isOpen: false, range: null });
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        setLinkPrompt({ isOpen: false, range: null });
                                        setImagePrompt({ isOpen: false, range: null });
                                    }}
                                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <div
                            ref={(el) => { editorRef.current = el; }}
                            className="flex-1 overflow-y-auto p-6 sm:p-8 article-preview focus:outline-none"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                                const newHtml = e.currentTarget.innerHTML;
                                setCurrentHtml(newHtml);
                                onHtmlUpdate(newHtml);
                            }}
                        />
                        <style>{`
                        .article-preview h1 { font-size: 1.8em; font-weight: 800; color: #ffffff; margin-top: 1.5em; margin-bottom: 0.8em; }
                        .article-preview h1:first-child { margin-top: 0; }
                        .article-preview h2 { font-size: 1.4em; font-weight: 700; color: #a3e635; margin-top: 1.8em; margin-bottom: 0.6em; padding-bottom: 0.4em; border-bottom: 1px solid rgba(255,255,255,0.08); }
                        .article-preview h2:first-child { margin-top: 0; }
                        .article-preview h3 { font-size: 1.15em; font-weight: 600; color: #e5e5e5; margin-top: 1.4em; margin-bottom: 0.4em; }
                        .article-preview p { color: #a3a3a3; line-height: 1.75; margin: 0.8em 0; font-size: 0.875rem; }
                        .article-preview a { color: #a3e635; text-decoration: underline; text-underline-offset: 4px; font-weight: 500; transition: color 0.2s; }
                        .article-preview a:hover { color: #84cc16; }
                        .article-preview strong { color: #ffffff; font-weight: 600; }
                        .article-preview ul { list-style: none; padding: 0; margin: 0.8em 0; }
                        .article-preview ul li { position: relative; padding-left: 1.4em; color: #a3a3a3; font-size: 0.875rem; line-height: 1.75; margin: 0.35em 0; }
                        .article-preview ul li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 6px; height: 6px; border-radius: 50%; background: #a3e635; }
                    `}</style>
                    </div>
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
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
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
            </div >
        </div >
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
    const [scheduleTime, setScheduleTime] = useState('09:00');
    const [scheduleTimezone, setScheduleTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
    const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
    const [webhooksLoading, setWebhooksLoading] = useState(true);
    const [scheduleError, setScheduleError] = useState('');
    const [scheduledWebhookName, setScheduledWebhookName] = useState('');
    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const router = useRouter();

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const startDay = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // Monday-based

    // Common timezones for dropdown
    const timezones = [
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
        'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
        'Australia/Sydney', 'Pacific/Auckland'
    ];

    useEffect(() => {
        articleApi.calendar(currentMonth).then(({ data }) => {
            if (data) setCalendarEvents(data.events);
        });
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0]);
    }, [currentMonth]);

    // Fetch webhooks
    useEffect(() => {
        const fetchWebhooks = async () => {
            setWebhooksLoading(true);
            const { data } = await webhookApi.list();
            if (data) {
                setWebhooks(data.webhooks);
                // Auto-select first active webhook
                const activeWh = data.webhooks.find(w => w.isActive);
                if (activeWh) setSelectedWebhookId(activeWh.id);
            }
            setWebhooksLoading(false);
        };
        fetchWebhooks();
    }, []);

    const handleSchedule = async () => {
        if (!generation) return;
        if (!selectedWebhookId) {
            setScheduleError('Please select a webhook to deliver the article to.');
            return;
        }
        if (!scheduleDate) {
            setScheduleError('Please select a publish date.');
            return;
        }

        setScheduleError('');
        setIsScheduling(true);

        // Build ISO datetime string
        const scheduledAt = `${scheduleDate}T${scheduleTime}:00`;

        const { data, error } = await articleApi.schedule(generation.articleId, {
            title: scheduleTitle || 'Untitled Article',
            scheduledAt,
            webhookId: selectedWebhookId,
            timezone: scheduleTimezone,
        });

        setIsScheduling(false);

        if (!error && data) {
            setScheduledWebhookName(data.webhookName || webhooks.find(w => w.id === selectedWebhookId)?.name || '');
            setScheduledDateTime(`${scheduleDate} at ${scheduleTime}`);
            setIsScheduled(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/dashboard');
            }, 2500);
        } else if (error) {
            setScheduleError(error);
        }
    };

    const handlePublishNow = async () => {
        if (!generation || !selectedWebhookId) {
            setScheduleError('Please select a webhook to deliver the article to.');
            return;
        }

        setScheduleError('');
        setIsScheduling(true);

        const { data, error } = await articleApi.deliverNow(generation.articleId, selectedWebhookId);

        setIsScheduling(false);

        if (!error && data) {
            setScheduledWebhookName(data.webhookName || webhooks.find(w => w.id === selectedWebhookId)?.name || '');
            setScheduledDateTime('Now');
            setIsScheduled(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/dashboard');
            }, 2500);
        } else if (error) {
            setScheduleError(error);
        }
    };

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const selectedWebhook = webhooks.find(w => w.id === selectedWebhookId);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Schedule & <span className="text-lime-400">Publish</span></h2>
                <p className="text-neutral-400 max-w-lg mx-auto">Pick a date and time, then deliver your article to your configured webhook automatically.</p>
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 font-semibold rounded-full transition-all text-sm"><ChevronLeft size={16} /> Back</button>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-full transition-all active:scale-95 text-sm">
                    Schedule This Article <Check size={16} />
                </button>
            </div>

            {/* Content Calendar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">{monthName}</h3>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400" /> Published</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Scheduled</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Failed</span>
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
                        const isToday = day === now.getDate();
                        return (
                            <button key={day} onClick={() => { setSelectedDay(day); if (!event) setShowModal(true); }}
                                className={`relative p-2 h-20 sm:h-24 rounded-xl text-left text-xs border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${isSelected ? 'border-lime-400/50 bg-lime-400/5' : event ? 'border-white/10 bg-white/[0.02] hover:border-white/20' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}>
                                <span className={`font-bold ${isToday ? 'text-lime-400' : isSelected ? 'text-lime-400' : 'text-neutral-400'}`}>{day}</span>
                                {isToday && <span className="ml-1 text-[8px] font-bold text-lime-400/60 uppercase">today</span>}
                                {event && (
                                    <div className="mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full mb-1 ${event.status === 'published' ? 'bg-lime-400' : event.status === 'scheduled' ? 'bg-blue-400' : event.status === 'failed' ? 'bg-red-400' : 'bg-neutral-500'}`} />
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
                            <div className={`w-2 h-10 rounded-full shrink-0 ${event.status === 'scheduled' ? 'bg-blue-400' : event.status === 'failed' ? 'bg-red-400' : 'bg-neutral-500'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{event.title}</div>
                                <div className="text-xs text-neutral-500">Day {event.day} · {event.status === 'scheduled' ? 'Auto-publish via webhook' : event.status === 'failed' ? 'Delivery failed' : 'Needs review'}</div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${event.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' : event.status === 'failed' ? 'bg-red-400/10 text-red-400' : 'bg-white/5 text-neutral-500'}`}>{event.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={() => !isScheduled && setShowModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {isScheduled ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-lime-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Article Scheduled!</h3>
                                <p className="text-sm text-neutral-400 mb-1">&ldquo;{scheduleTitle || 'Untitled Article'}&rdquo;</p>
                                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-3">
                                    <Calendar size={13} className="text-lime-400" />
                                    <span>{scheduledDateTime}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-1.5">
                                    <Globe size={13} className="text-lime-400" />
                                    <span>Delivers to: <strong className="text-white">{scheduledWebhookName}</strong></span>
                                </div>
                                <p className="text-xs text-neutral-600 mt-4">Redirecting to your dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Schedule Article</h3>
                                    <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Article Title</label>
                                        <input type="text" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all placeholder:text-neutral-600" placeholder="Enter article title" />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Publish Date</label>
                                            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Time</label>
                                            <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all" />
                                        </div>
                                    </div>

                                    {/* Timezone */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Timezone</label>
                                        <select
                                            value={scheduleTimezone}
                                            onChange={(e) => setScheduleTimezone(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/30 transition-all appearance-none cursor-pointer"
                                        >
                                            {timezones.map(tz => (
                                                <option key={tz} value={tz} className="bg-[#111] text-white">{tz.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Webhook Selector */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Deliver Via Webhook</label>
                                        {webhooksLoading ? (
                                            <div className="flex items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <Loader2 size={14} className="animate-spin text-neutral-500" />
                                                <span className="text-xs text-neutral-500">Loading webhooks...</span>
                                            </div>
                                        ) : webhooks.length === 0 ? (
                                            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                                                <p className="text-sm text-amber-400 font-semibold mb-1">No webhooks configured</p>
                                                <p className="text-xs text-neutral-500 mb-3">You need to set up a webhook endpoint before scheduling articles.</p>
                                                <Link
                                                    href="/dashboard/account/webhooks"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
                                                >
                                                    Set up a webhook <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {webhooks.filter(w => w.isActive).map(wh => {
                                                    const isSelected = selectedWebhookId === wh.id;
                                                    const statusDot = wh.lastTestStatus === 'success'
                                                        ? 'bg-lime-400 shadow-[0_0_4px_rgba(163,230,53,0.4)]'
                                                        : wh.lastTestStatus === 'failed'
                                                            ? 'bg-red-400'
                                                            : 'bg-neutral-600';
                                                    return (
                                                        <button
                                                            key={wh.id}
                                                            onClick={() => setSelectedWebhookId(wh.id)}
                                                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${isSelected
                                                                ? 'border-lime-400/40 bg-lime-400/[0.05] ring-1 ring-lime-400/20'
                                                                : 'border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                                                            }`}
                                                        >
                                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-semibold text-white truncate">{wh.name}</div>
                                                                <div className="text-[11px] text-neutral-500 font-mono truncate">{wh.url}</div>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-5 h-5 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                                                                    <Check size={12} className="text-lime-400" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                                <Link
                                                    href="/dashboard/account/webhooks"
                                                    className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-lime-400 transition-colors pt-1"
                                                >
                                                    Manage webhooks <ChevronRight size={12} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error */}
                                    {scheduleError && (
                                        <p className="text-red-400 text-xs text-center">{scheduleError}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        onClick={handlePublishNow}
                                        disabled={isScheduling || !selectedWebhookId}
                                        className="flex-1 py-3 border border-lime-400/30 text-lime-400 hover:bg-lime-400/10 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isScheduling ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                        Publish Now
                                    </button>
                                    <button
                                        onClick={handleSchedule}
                                        disabled={isScheduling || !selectedWebhookId}
                                        className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isScheduling ? <><Loader2 size={16} className="animate-spin" /> Scheduling...</> : <>Confirm & Schedule <Check size={16} /></>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───
function NewArticlePageInner() {
    const { user, isLoggedIn, isLoading, logout, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [articleLoading, setArticleLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Shared state between steps
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [generationData, setGenerationData] = useState<GenerationData | null>(null);
    const [keyword, setKeyword] = useState('');
    const [tone, setTone] = useState('');
    const [pov, setPov] = useState('');
    const [audience, setAudience] = useState<string | undefined>(undefined);
    const [targetWordCount, setTargetWordCount] = useState<number | undefined>(undefined);

    // Subscription & Modal states
    const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isChangingPlan, setIsChangingPlan] = useState(false);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    // Fetch billing data
    useEffect(() => {
        if (!isLoggedIn) return;
        const fetchData = async () => {
            const [subRes, plansRes] = await Promise.all([
                billingApi.subscription(),
                billingApi.plans()
            ]);
            if (subRes.data) setSubscription(subRes.data);
            if (plansRes.data) setPlans(plansRes.data.plans);
        };
        fetchData();
    }, [isLoggedIn]);

    const handleChangePlan = async (planId: string) => {
        setIsChangingPlan(true);
        const { data, error } = await billingApi.changePlan(planId);
        setIsChangingPlan(false);
        if (!error && data) {
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
                return;
            }
            const subRes = await billingApi.subscription();
            if (subRes.data) setSubscription(subRes.data);
            setShowUpgradeModal(false);
            await refreshUser();
        }
    };

    // Load existing article if articleId is in URL
    useEffect(() => {
        const articleId = searchParams.get('articleId');
        if (!articleId || !isLoggedIn) return;

        const loadArticle = async () => {
            setArticleLoading(true);
            const { data, error } = await articleApi.getById(articleId);
            setArticleLoading(false);

            if (data && !error) {
                // Handle both { article: {...} } and direct { id, html, ... } response formats
                const article = (data as any).article || data;
                setKeyword(article.keyword || article.title || '');
                setAnalysisData({
                    articleId: String(article.id),
                    serpResults: [],
                    outline: [],
                    meta: article.meta || { title: article.title, description: '' },
                    recommendations: { targetWordCount: '', targetHeadings: '' },
                });
                setGenerationData({
                    articleId: String(article.id),
                    html: article.htmlContent || article.html || '',
                    faqs: article.faqs || [],
                    seoScore: article.seoScore || article.seo_score || { overall: 0, metrics: {} as SeoScoreMetrics },
                    stats: article.stats || { wordCount: 0, readTime: '0 min' },
                });
                setIsEditMode(true);
                setCurrentStep(3);
            }
        };

        loadArticle();
    }, [searchParams, isLoggedIn]);

    if (isLoading || !isLoggedIn || articleLoading) {
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
                        <Link href="/dashboard/account/webhooks" className="px-3.5 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors">Integrations</Link>
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
                            <Link href="/dashboard/account/webhooks" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] text-sm transition-colors">Integrations</Link>
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
                <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} lockedSteps={isEditMode ? [1, 2] : []} />
                {currentStep === 1 && (
                    <Step1
                        onNext={() => setCurrentStep(2)}
                        onLimitReached={() => setShowUpgradeModal(true)}
                        onAnalysisComplete={(data, kw, t, p, twc, aud) => {
                            setAnalysisData(data);
                            setKeyword(kw);
                            setTone(t);
                            setPov(p);
                            setTargetWordCount(twc);
                            setAudience(aud);
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
                        audience={audience}
                        targetWordCount={targetWordCount}
                        onGenerationComplete={(data) => setGenerationData(data)}
                    />
                )}
                {currentStep === 3 && (
                    <Step3
                        onNext={() => setCurrentStep(4)}
                        onBack={isEditMode ? () => router.push('/dashboard') : () => setCurrentStep(2)}
                        generation={generationData}
                        onHtmlUpdate={(html) => setGenerationData(prev => prev ? { ...prev, html } : prev)}
                        keyword={keyword}
                        meta={analysisData?.meta || null}
                    />
                )}
                {currentStep === 4 && (
                    <Step4
                        onBack={() => setCurrentStep(3)}
                        generation={generationData}
                    />
                )}
            </main>

            {/* ─── Upgrade Plan Modal ─── */}
            {showUpgradeModal && subscription && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setShowUpgradeModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">Upgrade Your Plan</h3>
                                <p className="text-sm text-neutral-400">You&apos;ve reached your monthly article limit. Upgrade to continue creating.</p>
                            </div>
                            <button onClick={() => setShowUpgradeModal(false)} className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {plans.map((plan) => {
                                const isCurrent = plan.name === subscription.plan;
                                const isUpgrade = plan.price > subscription.price;
                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 ${isCurrent
                                            ? 'border-lime-400/40 ring-1 ring-lime-400/20 shadow-[0_0_30px_rgba(163,230,53,0.06)]'
                                            : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                                Current Plan
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <div className="text-lg font-bold text-white">{plan.name}</div>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-3xl font-bold text-white">${plan.price}</span>
                                                <span className="text-neutral-500 text-sm">/{plan.interval}</span>
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-2">
                                                {plan.articlesPerMonth === -1 ? 'Unlimited articles' : `${plan.articlesPerMonth} articles / month`}
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                                                    <Check size={14} className="text-lime-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        {isCurrent ? (
                                            <div className="w-full py-3 text-center text-sm font-semibold text-lime-400 bg-lime-400/10 rounded-full">
                                                Active
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleChangePlan(plan.id)}
                                                disabled={isChangingPlan}
                                                className={`w-full py-3 text-center text-sm font-bold rounded-full transition-all active:scale-95 ${isUpgrade
                                                    ? 'bg-lime-400 hover:bg-lime-300 text-black'
                                                    : 'border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                                    }`}
                                            >
                                                {isChangingPlan ? <Loader2 size={18} className="animate-spin mx-auto" /> : isUpgrade ? 'Upgrade Now' : 'Downgrade'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function NewArticlePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        }>
            <NewArticlePageInner />
        </Suspense>
    );
}
