import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        const webhookUrl = 'https://discord.com/api/webhooks/1475119191114776609/__KvsOaaFc8kGtxgjFsk7kxDw3YEcb-ucwWT94v-TMZQW_QwgqjXV8j0d89ZH00JKQI5';

        if (!webhookUrl) {
            console.error('DISCORD_WEBHOOK_URL is not set in environment variables');
            // We return 500 but log the real error on the server
            return NextResponse.json(
                { error: 'Server configuration error. Discord webhook not set up.' },
                { status: 500 }
            );
        }

        const discordPayload = {
            embeds: [
                {
                    title: '🚀 New Contact Form Submission',
                    color: 10667827, // A nice lime green color (A3E635 in decimal)
                    fields: [
                        {
                            name: '👤 Name',
                            value: name,
                            inline: true
                        },
                        {
                            name: '✉️ Email',
                            value: email,
                            inline: true
                        },
                        {
                            name: '💬 Message',
                            value: message
                        }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send to Discord:', errorText);
            throw new Error(`Discord API responded with ${response.status}`);
        }

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
