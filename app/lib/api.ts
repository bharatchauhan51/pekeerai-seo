const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.pekkerai.com' : 'http://localhost:5001');

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pekkerai_token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle non-JSON responses (like CSV export)
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('text/csv')) {
            const blob = await res.blob();
            return { data: blob as unknown as T, status: res.status };
        }

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                error: json?.error || json?.message || `Request failed with status ${res.status}`,
                status: res.status,
            };
        }

        return { data: json as T, status: res.status };
    } catch (err) {
        return {
            error: err instanceof Error ? err.message : 'Network error. Please try again.',
            status: 0,
        };
    }
}

// ─── Auth APIs ───
export const authApi = {
    register: (name: string, email: string, password: string) =>
        apiFetch<{ message: string; email: string }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email: string, password: string) =>
        apiFetch<{ user: ApiUser; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        apiFetch('/api/auth/logout', { method: 'POST' }),

    me: () =>
        apiFetch<{ user: ApiUser }>('/api/auth/me'),

    updateProfile: (data: { name?: string; email?: string; company?: string }) =>
        apiFetch<{ user: ApiUser }>('/api/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deleteAccount: () =>
        apiFetch('/api/auth/account', { method: 'DELETE' }),

    resendVerification: (email: string) =>
        apiFetch<{ message: string }>('/api/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    verifyEmail: (token: string) =>
        apiFetch<{ message: string }>('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        }),
};

// ─── Article APIs ───
export const articleApi = {
    analyze: (data: { keyword: string; tone: string; pointOfView: string; targetWordCount?: number; competitorUrl?: string; audience?: string }) =>
        apiFetch<AnalyzeResponse>('/api/articles/analyze', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    outline: (data: { articleId: number | string; keyword: string; lsiKeywords: string[]; serpResults: SerpResult[] }) =>
        apiFetch<AdvancedOutlineResponse>('/api/articles/outline', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    generate: (data: { keyword: string; outline: OutlineItem[]; meta: ArticleMeta; tone: string; pointOfView: string; targetWordCount?: number; articleId?: string; audience?: string }) =>
        apiFetch<GenerateResponse>('/api/articles/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    generateStream: async (data: { keyword: string; outline: OutlineItem[]; meta: ArticleMeta; tone: string; pointOfView: string; targetWordCount?: number; articleId?: string; audience?: string }): Promise<Response> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('pekkerai_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return fetch(`${API_BASE}/api/articles/generate/stream`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
    },

    refine: (articleId: string | number, data: { instruction: string; currentHtml: string }) =>
        apiFetch<RefineResponse>(`/api/articles/${articleId}/refine`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    save: (articleId: string | number, data: { title: string; html: string; meta: ArticleMeta; faqs: FaqItem[]; status: string }) =>
        apiFetch<{ articleId: string; status: string; savedAt: string }>(`/api/articles/${articleId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    schedule: (articleId: string | number, data: ScheduleArticleData) =>
        apiFetch<ScheduleResponse>(`/api/articles/${articleId}/schedule`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    cancelSchedule: (articleId: string | number) =>
        apiFetch<{ articleId: string; status: string; message: string }>(`/api/articles/${articleId}/schedule`, {
            method: 'DELETE',
        }),

    deliveries: (articleId: string | number) =>
        apiFetch<{ deliveries: DeliveryLogItem[] }>(`/api/articles/${articleId}/deliveries`),

    deliverNow: (articleId: string | number, webhookId: number) =>
        apiFetch<ScheduleResponse>(`/api/articles/${articleId}/deliver-now`, {
            method: 'POST',
            body: JSON.stringify({ webhookId }),
        }),

    list: (params?: { status?: string; sort?: string; limit?: number; page?: number }) => {
        const query = new URLSearchParams();
        if (params?.status) query.set('status', params.status);
        if (params?.sort) query.set('sort', params.sort);
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.page) query.set('page', String(params.page));
        return apiFetch<ArticleListResponse>(`/api/articles?${query.toString()}`);
    },

    calendar: (month: string) =>
        apiFetch<CalendarResponse>(`/api/articles/calendar?month=${month}`),

    getById: (articleId: string | number) =>
        apiFetch<ArticleDetail>(`/api/articles/${articleId}`),
};

// ─── Dashboard APIs ───
export const dashboardApi = {
    stats: () =>
        apiFetch<DashboardStats>('/api/dashboard/stats'),

    keywords: () =>
        apiFetch<KeywordsResponse>('/api/dashboard/keywords'),

    traffic: (period: string = 'week') =>
        apiFetch<TrafficResponse>(`/api/dashboard/traffic?period=${period}`),
};

// ─── Billing APIs ───
export const billingApi = {
    subscription: () =>
        apiFetch<SubscriptionResponse>('/api/billing/subscription'),

    plans: () =>
        apiFetch<PlansResponse>('/api/billing/plans'),

    changePlan: (newPlanId: string) =>
        apiFetch<{ checkoutUrl?: string; subscription: { plan: string; price: number; effectiveDate: string; proratedCharge: number } }>('/api/billing/change-plan', {
            method: 'POST',
            body: JSON.stringify({ newPlanId }),
        }),

    cancel: (confirmText: string) =>
        apiFetch<{ status: string; activeUntil: string; message: string }>('/api/billing/cancel', {
            method: 'POST',
            body: JSON.stringify({ confirmText }),
        }),

    invoices: () =>
        apiFetch<InvoicesResponse>('/api/billing/invoices'),

    exportCsv: () =>
        apiFetch<Blob>('/api/billing/invoices/export'),
};


// ─── Webhook APIs ───
export const webhookApi = {
    list: () =>
        apiFetch<{ webhooks: WebhookConfig[] }>('/api/webhooks'),

    create: (data: WebhookCreateData) =>
        apiFetch<{ webhook: WebhookConfig }>('/api/webhooks', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<WebhookCreateData>) =>
        apiFetch<{ webhook: WebhookConfig }>(`/api/webhooks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiFetch(`/api/webhooks/${id}`, { method: 'DELETE' }),

    test: (id: number) =>
        apiFetch<WebhookTestResult>(`/api/webhooks/${id}/test`, {
            method: 'POST',
        }),

    history: (id: number, params?: { limit?: number; page?: number }) => {
        const query = new URLSearchParams();
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.page) query.set('page', String(params.page));
        return apiFetch<WebhookHistoryResponse>(`/api/webhooks/${id}/history?${query.toString()}`);
    },
};

// ─── Type Definitions ───
export interface ApiUser {
    id: string | number;
    email: string;
    name: string;
    plan: string;
    avatar: string;
    company?: string;
    createdAt?: string;
}

export interface OutlineItem {
    type: string;
    text: string;
}

export interface ArticleMeta {
    title: string;
    description: string;
    slug?: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface SerpResult {
    position: number;
    title: string;
    url: string;
    wordCount: number;
    headings: number;
    score: number;
}

export interface SeoScoreMetrics {
    [key: string]: { value: string; pass: boolean };
}

export interface AnalyzeResponse {
    articleId?: string;
    serpResults: SerpResult[];
    outline: OutlineItem[];
    meta: ArticleMeta;
    recommendations: { targetWordCount: string; targetHeadings: string };
    lsiKeywords?: string[];
    targetWordCount?: number;
    audience?: string;
}

export interface AdvancedOutlineSection {
    type: 'H2';
    title: string;
    subsections: { type: 'H3'; title: string }[];
}

export interface AdvancedOutline {
    sections: AdvancedOutlineSection[];
    faq: { q: string; a: string }[];
    introHook: string;
    conclusionCta: string;
}

export interface AdvancedOutlineResponse {
    articleId: number | string;
    outline: AdvancedOutline;
    lsiKeywordsCovered: string[];
}

export interface GenerateResponse {
    articleId: string;
    html: string;
    faqs: FaqItem[];
    seoScore: { overall: number; metrics: SeoScoreMetrics };
    stats: { wordCount: number; readTime: string };
}

export interface RefineResponse {
    message: string;
    updatedHtml: string;
    updatedSeoScore?: { overall: number; metrics: SeoScoreMetrics };
}

export interface ArticleListItem {
    id: string;
    title: string;
    slug: string;
    status: string;
    seoScore: number;
    publishedAt: string;
    views: number;
}

export interface ArticleListResponse {
    articles: ArticleListItem[];
    total: number;
    page: number;
    limit: number;
}

export interface CalendarEvent {
    day: number;
    articleId: string;
    title: string;
    status: string;
}

export interface CalendarResponse {
    month: string;
    events: CalendarEvent[];
}

export interface ArticleDetail {
    id: string;
    title: string;
    slug: string;
    status: string;
    html: string;
    meta: ArticleMeta;
    faqs: FaqItem[];
    seoScore: { overall: number; metrics: SeoScoreMetrics };
    stats: { wordCount: number; readTime: string };
    publishedAt?: string;
    keyword?: string;
    audience?: string;
    tone?: string;
    pointOfView?: string;
}

// SSE streaming event types
export interface StreamMetaEvent {
    type: 'meta';
    articleId: number;
}

export interface StreamChunkEvent {
    type: 'chunk';
    content: string;
}

export interface StreamErrorEvent {
    type: 'error';
    message: string;
}

export interface StreamDoneEvent {
    type: 'done';
    articleId: number;
    faqs: FaqItem[];
    seoScore: { overall: number; metrics: SeoScoreMetrics };
    stats: { wordCount: number; readTime: string };
}

export type StreamEvent = StreamMetaEvent | StreamChunkEvent | StreamErrorEvent | StreamDoneEvent;

export interface DashboardStats {
    totalArticles: { value: number; change: string };
    organicTraffic: { value: string; change: string };
    avgSeoScore: { value: number; change: string };
    keywordsRanking: { value: number; change: string };
}

export interface KeywordItem {
    keyword: string;
    position: number;
    change: string;
    monthlyVolume: string;
}

export interface KeywordsResponse {
    keywords: KeywordItem[];
}

export interface TrafficBar {
    day: string;
    value: number;
}

export interface TrafficResponse {
    period: string;
    data: TrafficBar[];
}

export interface SubscriptionResponse {
    plan: string;
    price: number;
    interval: string;
    articlesUsed: number;
    articlesLimit: number;
    renewalDate: string;
    startDate: string;
    paymentMethod: string;
    memberSince: string;
}

export interface PlanItem {
    id: string;
    name: string;
    price: number;
    interval: string;
    articlesPerMonth: number;
    features: string[];
}

export interface PlansResponse {
    plans: PlanItem[];
}

export interface InvoiceItem {
    id: string;
    date: string;
    amount: number;
    status: string;
    plan: string;
    paymentMethod: string;
}

export interface InvoicesResponse {
    invoices: InvoiceItem[];
    totalPaid: number;
}

// ─── Webhook Types ───
export interface WebhookConfig {
    id: number;
    name: string;
    url: string;
    authConfigured: boolean;
    isActive: boolean;
    lastTestedAt?: string;
    lastTestStatus?: 'success' | 'failed';
    createdAt: string;
    updatedAt: string;
}

export interface WebhookCreateData {
    name: string;
    url: string;
    basicUsername?: string;
    basicPassword?: string;
}

export interface WebhookHistoryItem {
    id: number;
    articleId: string;
    articleTitle: string;
    status: 'success' | 'failed' | 'timeout';
    statusCode?: number;
    responseTimeMs?: number;
    attemptNumber: number;
    errorMessage?: string;
    payload?: Record<string, unknown>;
    createdAt: string;
}

export interface WebhookHistoryResponse {
    history: WebhookHistoryItem[];
    total: number;
    page: number;
    limit: number;
}

export interface WebhookTestResult {
    success: boolean;
    statusCode?: number;
    responseTime?: number;
    message: string;
    error?: string;
    responseBody?: string;
}

export interface DeliveryLogItem {
    id: number;
    webhookName: string;
    status: 'success' | 'failed' | 'timeout';
    statusCode?: number;
    responseTimeMs?: number;
    attemptNumber: number;
    errorMessage?: string;
    createdAt: string;
}

export interface ScheduleArticleData {
    title: string;
    scheduledAt: string;
    webhookId: number;
    timezone: string;
}

export interface ScheduleResponse {
    articleId: string;
    status: string;
    scheduledAt: string;
    webhookName: string;
}
