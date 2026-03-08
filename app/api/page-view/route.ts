import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1475119191114776609/__KvsOaaFc8kGtxgjFsk7kxDw3YEcb-ucwWT94v-TMZQW_QwgqjXV8j0d89ZH00JKQI5';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { page, tracking } = body;

        // Extract request headers for additional context
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
        const userAgent = req.headers.get('user-agent') || 'Unknown';

        // Build Discord embed fields
        const fields: { name: string; value: string; inline: boolean }[] = [
            { name: '📄 Page', value: page || 'Unknown', inline: false },
        ];

        // Tracking parameters
        if (tracking) {
            if (tracking.utm_source || tracking.utm_medium || tracking.utm_campaign) {
                const utmParts: string[] = [];
                if (tracking.utm_source) utmParts.push(`Source: **${tracking.utm_source}**`);
                if (tracking.utm_medium) utmParts.push(`Medium: **${tracking.utm_medium}**`);
                if (tracking.utm_campaign) utmParts.push(`Campaign: **${tracking.utm_campaign}**`);
                if (tracking.utm_term) utmParts.push(`Term: **${tracking.utm_term}**`);
                if (tracking.utm_content) utmParts.push(`Content: **${tracking.utm_content}**`);
                fields.push({ name: '🎯 UTM Parameters', value: utmParts.join('\n'), inline: false });
            }

            if (tracking.referrer) {
                fields.push({ name: '🔗 Referrer', value: tracking.referrer, inline: true });
            }

            if (tracking.screen) {
                fields.push({ name: '🖥️ Screen', value: tracking.screen, inline: true });
            }

            if (tracking.language) {
                fields.push({ name: '🌐 Language', value: tracking.language, inline: true });
            }

            if (tracking.timezone) {
                fields.push({ name: '🕐 Timezone', value: tracking.timezone, inline: true });
            }

            if (tracking.device_type) {
                fields.push({ name: '📱 Device', value: tracking.device_type, inline: true });
            }
        }

        // Add IP & User-Agent
        fields.push({ name: '🌍 IP Address', value: `\`${ip}\``, inline: true });
        fields.push({ name: '🔍 User Agent', value: userAgent.length > 200 ? userAgent.substring(0, 200) + '…' : userAgent, inline: false });

        // Send rich Discord embed
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'PekkerAI Alerts',
                avatar_url: 'https://em-content.zobj.net/source/apple/391/bell_1f514.png',
                embeds: [{
                    title: '👁️ Page View',
                    description: `Someone visited **${page || 'a page'}**`,
                    color: 0x38bdf8, // sky-400 — visually distinct from payment alerts (lime)
                    fields,
                    footer: {
                        text: 'PekkerAI Page View Tracker',
                    },
                    timestamp: new Date().toISOString(),
                }],
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Page view notify error:', error);
        return NextResponse.json({ error: 'Failed to process page view notification' }, { status: 500 });
    }
}
