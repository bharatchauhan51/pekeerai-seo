'use client';

import { useState } from 'react';
import {
    Book, ChevronDown, ChevronRight, Webhook, Shield, RotateCcw,
    AlertCircle, Code, Zap, Clock, CheckCircle2, ArrowRight
} from 'lucide-react';

interface AccordionSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function AccordionSection({ title, icon, children, defaultOpen = false }: AccordionSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <span className="text-lime-400 shrink-0">{icon}</span>
                <span className="text-sm font-semibold text-white flex-1">{title}</span>
                {open ? <ChevronDown size={16} className="text-neutral-500" /> : <ChevronRight size={16} className="text-neutral-500" />}
            </button>
            {open && (
                <div className="px-5 pb-5 pt-0 border-t border-white/5 animate-in fade-in duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative group mt-3">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 text-[10px] font-bold text-neutral-600 hover:text-lime-400 bg-black/60 px-2 py-1 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-all"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="bg-black/50 border border-white/5 rounded-xl p-4 overflow-x-auto">
                <code className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre">{code}</code>
            </pre>
        </div>
    );
}

function CodeTabs({ tabs }: { tabs: { label: string; code: string; language?: string }[] }) {
    const [active, setActive] = useState(0);
    return (
        <div className="mt-3">
            <div className="flex items-center gap-1 mb-0">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-t-lg transition-all ${active === i
                            ? 'bg-black/50 text-lime-400 border border-white/5 border-b-transparent'
                            : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <pre className="bg-black/50 border border-white/5 rounded-xl rounded-tl-none p-4 overflow-x-auto -mt-px">
                <code className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre">{tabs[active].code}</code>
            </pre>
        </div>
    );
}

export default function WebhookDocumentation() {
    return (
        <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 mb-5">
                <Book size={18} className="text-lime-400" />
                <h2 className="text-base font-bold text-white">Webhook Documentation</h2>
            </div>

            {/* How It Works */}
            <AccordionSection title="How It Works" icon={<Zap size={16} />} defaultOpen>
                <div className="grid sm:grid-cols-4 gap-4 mt-4">
                    {[
                        { step: '1', title: 'Configure', desc: 'Set up your webhook URL and authentication credentials', icon: <Webhook size={18} /> },
                        { step: '2', title: 'Create', desc: 'Generate an SEO-optimized article with PekkerAI', icon: <Code size={18} /> },
                        { step: '3', title: 'Schedule', desc: 'Pick a date & time for automatic publishing', icon: <Clock size={18} /> },
                        { step: '4', title: 'Deliver', desc: 'PekkerAI POSTs the full article to your endpoint', icon: <CheckCircle2 size={18} /> },
                    ].map((item, i) => (
                        <div key={i} className="relative">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center h-full">
                                <div className="w-10 h-10 rounded-full bg-lime-400/10 text-lime-400 flex items-center justify-center mx-auto mb-3">
                                    {item.icon}
                                </div>
                                <div className="text-[10px] font-bold text-lime-400 uppercase tracking-widest mb-1">Step {item.step}</div>
                                <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                                <div className="text-[11px] text-neutral-500 leading-relaxed">{item.desc}</div>
                            </div>
                            {i < 3 && (
                                <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-5 h-5 rounded-full bg-[#0a0a0a] border border-white/5 items-center justify-center">
                                    <ArrowRight size={10} className="text-neutral-600" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Payload Format */}
            <AccordionSection title="Payload Format" icon={<Code size={16} />}>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed mb-2">
                    When your scheduled time arrives, PekkerAI sends a POST request to your webhook URL with the following JSON payload:
                </p>
                <CodeBlock code={`{
  "event": "article.published",
  "source": "pekkerai",
  "version": "1.0",
  "timestamp": "2026-04-20T09:00:00Z",
  "article": {
    "id": "42",
    "title": "Best AI SEO Tools 2025",
    "slug": "best-ai-seo-tools-2025",
    "html": "<h1>Best AI SEO Tools...</h1><p>Full HTML...</p>",
    "text": "Plain text version of the article...",
    "meta": {
      "title": "Best AI SEO Tools 2025 | PekkerAI", 
      "description": "Discover the top AI-powered SEO tools...",
      "slug": "best-ai-seo-tools-2025"
    },
    "faqs": [
      { "question": "What are the best AI SEO tools?", "answer": "..." }
    ],
    "stats": { "wordCount": 2845, "readTime": "12 min" },
    "seoScore": 87,
    "keyword": "ai seo tools",
    "tone": "Professional & Direct",
    "audience": "Marketing Professionals"
  },
  "delivery": {
    "id": "del_abc123",
    "attemptNumber": 1
  }
}`} />
                <div className="mt-4 p-3 bg-blue-400/5 border border-blue-400/15 rounded-xl">
                    <p className="text-[11px] text-blue-400/80">
                        <strong>Tip:</strong> The <code className="px-1 py-0.5 bg-blue-400/10 rounded text-blue-300">article.html</code> field contains the complete article in HTML format.
                        The <code className="px-1 py-0.5 bg-blue-400/10 rounded text-blue-300">article.text</code> field is a plain-text version for platforms that don&apos;t support HTML.
                    </p>
                </div>
            </AccordionSection>

            {/* Authentication */}
            <AccordionSection title="Authentication" icon={<Shield size={16} />}>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed mb-3">
                    PekkerAI uses <strong className="text-white">HTTP Basic Authentication</strong> for all webhook deliveries.
                    On every request, the following header is sent:
                </p>
                <CodeBlock code={`Authorization: Basic <base64(username:password)>`} language="http" />
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                    The <code className="px-1 py-0.5 bg-white/5 rounded">username</code> and <code className="px-1 py-0.5 bg-white/5 rounded">password</code> you configure
                    are Base64-encoded and sent in the standard HTTP Basic Auth format.
                    Your endpoint should verify this header before accepting the payload.
                </p>
                <div className="mt-3 p-3 bg-lime-400/5 border border-lime-400/15 rounded-xl">
                    <p className="text-[11px] text-lime-400/80">
                        <strong>Security:</strong> Credentials are encrypted at rest using AES-256 and never returned by the API.
                        Every delivery also includes an <code className="px-1 py-0.5 bg-lime-400/10 rounded text-lime-300">X-PekkerAI-Signature</code> header for payload verification.
                    </p>
                </div>
            </AccordionSection>

            {/* Verifying Signatures */}
            <AccordionSection title="Verifying Webhook Signatures" icon={<Shield size={16} />}>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed mb-2">
                    Every webhook delivery includes an <code className="px-1 py-0.5 bg-white/5 rounded">X-PekkerAI-Signature</code> header.
                    Use it to verify the payload authenticity and prevent tampering:
                </p>
                <CodeTabs tabs={[
                    {
                        label: 'Node.js',
                        code: `const crypto = require('crypto');

function verifyWebhook(payload, signatureHeader, secret) {
  const [tPart, vPart] = signatureHeader.split(',');
  const timestamp = tPart.split('=')[1];
  const signature = vPart.split('=')[1];
  
  const expected = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestamp}.\${payload}\`)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express.js usage
app.post('/webhook', express.raw({type: '*/*'}), (req, res) => {
  const sig = req.headers['x-pekkerai-signature'];
  if (!verifyWebhook(req.body, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  const data = JSON.parse(req.body);
  console.log('Article received:', data.article.title);
  res.status(200).send('OK');
});`
                    },
                    {
                        label: 'Python',
                        code: `import hmac
import hashlib
from flask import Flask, request

app = Flask(__name__)

def verify_webhook(payload, signature_header, secret):
    parts = dict(p.split('=', 1) for p in signature_header.split(','))
    timestamp = parts.get('t', '')
    signature = parts.get('v1', '')
    
    expected = hmac.new(
        secret.encode(),
        f"{timestamp}.{payload}".encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    sig = request.headers.get('X-PekkerAI-Signature', '')
    if not verify_webhook(request.data.decode(), sig, 'your-secret'):
        return 'Invalid signature', 401
    
    data = request.json
    print(f"Article received: {data['article']['title']}")
    return 'OK', 200`
                    },
                    {
                        label: 'PHP',
                        code: `<?php
function verifyWebhook($payload, $signatureHeader, $secret) {
    $parts = [];
    foreach (explode(',', $signatureHeader) as $part) {
        [$key, $value] = explode('=', $part, 2);
        $parts[$key] = $value;
    }
    
    $timestamp = $parts['t'] ?? '';
    $signature = $parts['v1'] ?? '';
    
    $expected = hash_hmac('sha256', "$timestamp.$payload", $secret);
    
    return hash_equals($signature, $expected);
}

// Usage
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PEKKERAI_SIGNATURE'] ?? '';

if (!verifyWebhook($payload, $signature, 'your-secret')) {
    http_response_code(401);
    die('Invalid signature');
}

$data = json_decode($payload, true);
echo "Article received: " . $data['article']['title'];
http_response_code(200);
?>`
                    },
                ]} />
            </AccordionSection>

            {/* Retry Policy */}
            <AccordionSection title="Retry Policy" icon={<RotateCcw size={16} />}>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed mb-4">
                    If delivery fails, PekkerAI will automatically retry with exponential backoff:
                </p>
                <div className="space-y-2">
                    {[
                        { attempt: 1, delay: 'Immediate', elapsed: '0 min', icon: '🟢' },
                        { attempt: 2, delay: '5 minutes', elapsed: '5 min', icon: '🟡' },
                        { attempt: 3, delay: '30 minutes', elapsed: '35 min', icon: '🟡' },
                        { attempt: 4, delay: '2 hours', elapsed: '2h 35m', icon: '🟠' },
                        { attempt: 5, delay: '12 hours', elapsed: '14h 35m', icon: '🔴' },
                    ].map((item) => (
                        <div key={item.attempt} className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-xs font-bold text-white w-24">Attempt {item.attempt}</span>
                            <span className="text-xs text-neutral-400 flex-1">Delay: {item.delay}</span>
                            <span className="text-[11px] text-neutral-600 font-mono">Total: {item.elapsed}</span>
                        </div>
                    ))}
                </div>
                <p className="text-[11px] text-neutral-500 mt-3">
                    After 5 failed attempts, the article is marked as &ldquo;failed&rdquo; and you&apos;ll receive an email notification.
                    You can manually retry at any time from the dashboard.
                </p>
            </AccordionSection>

            {/* Quick Start */}
            <AccordionSection title="Quick Start Guides" icon={<Zap size={16} />}>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed mb-2">
                    Minimal webhook receiver examples to get you started:
                </p>
                <CodeTabs tabs={[
                    {
                        label: 'Express.js',
                        code: `const express = require('express');
const app = express();
app.use(express.json());

function checkBasicAuth(req) {
  const auth = req.headers['authorization'] ?? '';
  const encoded = Buffer.from(
    \`\${process.env.WEBHOOK_USERNAME}:\${process.env.WEBHOOK_PASSWORD}\`
  ).toString('base64');
  return auth === \`Basic \${encoded}\`;
}

app.post('/api/pekkerai-webhook', (req, res) => {
  if (!checkBasicAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { event, article } = req.body;

  if (event === 'test') {
    return res.json({ message: 'Webhook connected!' });
  }

  if (event === 'article.published') {
    // Save article to your CMS / database
    console.log('New article:', article.title);
    console.log('Word count:', article.stats.wordCount);
    // saveToDatabase(article);
  }

  res.status(200).json({ received: true });
});

app.listen(3000);`
                    },
                    {
                        label: 'Next.js',
                        code: `// app/api/pekkerai-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

function checkBasicAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? '';
  const encoded = Buffer.from(
    \`\${process.env.WEBHOOK_USERNAME}:\${process.env.WEBHOOK_PASSWORD}\`
  ).toString('base64');
  return auth === \`Basic \${encoded}\`;
}

export async function POST(req: NextRequest) {
  if (!checkBasicAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  if (data.event === 'test') {
    return NextResponse.json({ message: 'Connected!' });
  }

  if (data.event === 'article.published') {
    const { article } = data;
    // Save to your database
    // await db.articles.create({ data: { title: article.title, html: article.html } });
    console.log('Received article:', article.title);
  }

  return NextResponse.json({ received: true });
}`
                    },
                    {
                        label: 'Python Flask',
                        code: `import os, base64
from flask import Flask, request, jsonify

app = Flask(__name__)

def check_basic_auth():
    auth = request.headers.get('Authorization', '')
    expected = base64.b64encode(
        f"{os.environ['WEBHOOK_USERNAME']}:{os.environ['WEBHOOK_PASSWORD']}".encode()
    ).decode()
    return auth == f"Basic {expected}"

@app.route('/api/pekkerai-webhook', methods=['POST'])
def webhook():
    if not check_basic_auth():
        return jsonify(error='Unauthorized'), 401

    data = request.json

    if data['event'] == 'test':
        return jsonify(message='Connected!')

    if data['event'] == 'article.published':
        article = data['article']
        print(f"New article: {article['title']}")
        # save_to_database(article)

    return jsonify(received=True), 200`
                    },
                ]} />
            </AccordionSection>

            {/* Troubleshooting */}
            <AccordionSection title="Troubleshooting" icon={<AlertCircle size={16} />}>
                <div className="space-y-3 mt-3">
                    {[
                        {
                            q: 'Webhook test fails with "timeout"',
                            a: 'Your endpoint must respond within 30 seconds. Ensure the server is publicly accessible and not blocked by a firewall. If behind a VPN or private network, the webhook cannot reach it.',
                        },
                        {
                            q: 'Getting 401 or 403 errors',
                            a: 'Double-check your username and password. Ensure your server is validating the Authorization: Basic header correctly. Verify the credentials match what your server expects and have not expired.',
                        },
                        {
                            q: 'Receiving duplicate deliveries',
                            a: 'Each delivery includes a unique delivery.id field. Use this for idempotency — check if you\'ve already processed this delivery ID before saving.',
                        },
                        {
                            q: 'Payload is too large for my server',
                            a: 'The article HTML can be several KB. Ensure your server\'s request body limit is at least 10MB. In Express.js: app.use(express.json({ limit: \'10mb\' }))',
                        },
                        {
                            q: 'How do I test locally?',
                            a: 'Use a tunneling service like ngrok to expose your local server. Run: ngrok http 3000, then use the generated HTTPS URL as your webhook URL.',
                        },
                    ].map((item, i) => (
                        <details key={i} className="group">
                            <summary className="flex items-start gap-2 cursor-pointer text-sm font-semibold text-neutral-300 hover:text-lime-400 transition-colors list-none py-2.5 px-3 rounded-xl hover:bg-white/[0.02]">
                                <ChevronRight size={14} className="shrink-0 text-neutral-500 group-open:rotate-90 transition-transform mt-0.5" />
                                {item.q}
                            </summary>
                            <p className="text-xs text-neutral-500 leading-relaxed ml-6 mb-2 px-3">{item.a}</p>
                        </details>
                    ))}
                </div>
            </AccordionSection>
        </div>
    );
}
