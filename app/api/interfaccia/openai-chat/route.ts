import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type OpenAIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

type ChatRequestBody = {
    messages?: OpenAIMessage[];
    model?: string;
    temperature?: number;
};

const DEFAULT_MODEL = 'gpt-4o-mini';
const MAX_MESSAGES = 20;

function sanitizeMessages(messages: OpenAIMessage[]): OpenAIMessage[] {
    return messages
        .filter(message => (
            (message.role === 'system' || message.role === 'user' || message.role === 'assistant')
            && typeof message.content === 'string'
            && message.content.trim().length > 0
        ))
        .slice(-MAX_MESSAGES)
        .map(message => ({
            role: message.role,
            content: message.content.trim(),
        }));
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'OPENAI_API_KEY non configurata sul server.' },
            { status: 500 },
        );
    }

    let body: ChatRequestBody;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Body JSON non valido.' }, { status: 400 });
    }

    const inputMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages = sanitizeMessages(inputMessages);

    if (messages.length === 0) {
        return NextResponse.json(
            { error: 'Fornisci almeno un messaggio valido.' },
            { status: 400 },
        );
    }

    const model = typeof body.model === 'string' && body.model.trim().length > 0
        ? body.model.trim()
        : DEFAULT_MODEL;

    const temperature = typeof body.temperature === 'number'
        ? Math.max(0, Math.min(1.2, body.temperature))
        : 0.4;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
        }),
    });

    const rawPayload = await openAIResponse.text();
    let payload: unknown = null;

    try {
        payload = rawPayload ? JSON.parse(rawPayload) : null;
    } catch {
        payload = null;
    }

    const providerErrorMessage =
        payload
            && typeof payload === 'object'
            && 'error' in payload
            && payload.error
            && typeof payload.error === 'object'
            && 'message' in payload.error
            && typeof payload.error.message === 'string'
            ? payload.error.message
            : null;

    const replyText =
        payload
            && typeof payload === 'object'
            && 'choices' in payload
            && Array.isArray(payload.choices)
            && payload.choices[0]
            && typeof payload.choices[0] === 'object'
            && 'message' in payload.choices[0]
            && payload.choices[0].message
            && typeof payload.choices[0].message === 'object'
            && 'content' in payload.choices[0].message
            && typeof payload.choices[0].message.content === 'string'
            ? payload.choices[0].message.content
            : '';

    const usage =
        payload
            && typeof payload === 'object'
            && 'usage' in payload
            ? payload.usage
            : null;

    const providerModel =
        payload
            && typeof payload === 'object'
            && 'model' in payload
            && typeof payload.model === 'string'
            ? payload.model
            : model;

    if (!openAIResponse.ok) {
        const providerMessage = providerErrorMessage;
        const message = typeof providerMessage === 'string' && providerMessage.trim().length > 0
            ? providerMessage
            : 'Errore dal provider OpenAI.';

        return NextResponse.json(
            { error: message },
            { status: openAIResponse.status },
        );
    }

    return NextResponse.json({
        reply: replyText,
        usage,
        model: providerModel,
    });
}
