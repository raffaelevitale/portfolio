import { useEffect, useMemo, useState } from 'react';
import { Loader2, SendHorizontal, ShieldCheck } from 'lucide-react';
import { useTheme } from './ThemeContext';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
}

interface EmbeddedChatGPTPanelProps {
    providerConnected: boolean;
    inputPreset?: string | null;
    onPresetApplied?: () => void;
    title?: string;
    subtitle?: string;
}

const initialAssistantMessage: ChatMessage = {
    id: 'assistant-initial',
    role: 'assistant',
    content: 'ChatGPT e pronto dentro la tua interfaccia. Scrivi una richiesta per iniziare.',
};

function createMessage(role: ChatRole, content: string): ChatMessage {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
    };
}

export function EmbeddedChatGPTPanel({
    providerConnected,
    inputPreset,
    onPresetApplied,
    title,
    subtitle,
}: EmbeddedChatGPTPanelProps) {
    const { t } = useTheme();

    const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    const promptCount = useMemo(
        () => messages.filter(message => message.role === 'user').length,
        [messages],
    );

    const cardBg = t('bg-[#141414] border-white/[0.05]', 'bg-[#FAFAFA] border-black/[0.08]');
    const rowBg = t('bg-[#1E1E1E] border-white/[0.08]', 'bg-white border-black/[0.08]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#888]', 'text-[#666]');
    const textMuted = t('text-[#666]', 'text-[#999]');

    useEffect(() => {
        if (!inputPreset || inputPreset.trim().length === 0) return;
        setInputValue(inputPreset);
        onPresetApplied?.();
    }, [inputPreset, onPresetApplied]);

    async function sendMessage() {
        const trimmed = inputValue.trim();
        if (!trimmed || isSending) return;

        if (!providerConnected) {
            setErrorText('Connetti prima il provider ChatGPT per utilizzare la chat integrata.');
            return;
        }

        setErrorText(null);

        const userMessage = createMessage('user', trimmed);
        const nextMessages = [...messages, userMessage];

        setMessages(nextMessages);
        setInputValue('');
        setIsSending(true);

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL?.trim() ?? '';
            const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            const endpoint = normalizedBase
                ? `${normalizedBase}/api/interfaccia/openai-chat`
                : '/api/interfaccia/openai-chat';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: nextMessages.map(message => ({
                        role: message.role,
                        content: message.content,
                    })),
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                const message = typeof payload?.error === 'string'
                    ? payload.error
                    : 'Errore durante la chiamata al provider OpenAI.';
                throw new Error(message);
            }

            const assistantContent = typeof payload?.reply === 'string' && payload.reply.trim().length > 0
                ? payload.reply
                : 'Nessuna risposta testuale disponibile.';

            setMessages(prev => [...prev, createMessage('assistant', assistantContent)]);
        } catch (error) {
            const fallback = error instanceof Error ? error.message : 'Errore inatteso nella chat integrata.';
            setErrorText(fallback);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className={`${cardBg} border rounded-xl p-4 md:p-5 mt-4 md:mt-6`}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div>
                    <h3 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>{title ?? 'ChatGPT integrata nella tua interfaccia'}</h3>
                    <p className={`text-[11px] ${textSub}`}>{subtitle ?? 'Sessione in-app via API server-side'}</p>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] ${providerConnected ? 'border-[#10B981]/35 text-[#10B981] bg-[#10B981]/10' : t('border-[#666]/40 text-[#999] bg-[#666]/10', 'border-[#bbb] text-[#777] bg-[#eee]')}`}>
                    <ShieldCheck size={11} />
                    {providerConnected ? 'Provider connesso' : 'Provider non connesso'}
                </div>
            </div>

            <div className={`${rowBg} border rounded-xl p-3 md:p-4 h-[300px] overflow-y-auto space-y-2.5`}>
                {messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[88%] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${message.role === 'user'
                            ? 'bg-[#F73C1C] text-white'
                            : t('bg-white/[0.08] text-[#ddd]', 'bg-black/[0.06] text-[#333]')
                            }`}>
                            {message.content}
                        </div>
                    </div>
                ))}

                {isSending && (
                    <div className="flex justify-start">
                        <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] ${t('bg-white/[0.08] text-[#ddd]', 'bg-black/[0.06] text-[#333]')}`}>
                            <Loader2 size={13} className="animate-spin" />
                            Sto generando la risposta...
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3">
                <div className="flex items-center gap-2">
                    <textarea
                        value={inputValue}
                        onChange={event => setInputValue(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                void sendMessage();
                            }
                        }}
                        placeholder="Scrivi qui la tua richiesta per ChatGPT..."
                        className={`flex-1 min-h-[52px] max-h-[140px] resize-y rounded-lg border px-3 py-2 text-[12px] outline-none ${t('bg-[#1E1E1E] border-white/[0.08] text-[#eee] placeholder:text-[#666] focus:border-[#F73C1C]/40', 'bg-white border-black/[0.08] text-[#222] placeholder:text-[#999] focus:border-[#F73C1C]/40')}`}
                    />
                    <button
                        onClick={() => void sendMessage()}
                        disabled={isSending || inputValue.trim().length === 0 || !providerConnected}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#F73C1C] text-white disabled:bg-[#F73C1C]/40 disabled:cursor-not-allowed hover:bg-[#e63518] transition-colors"
                        title="Invia messaggio"
                    >
                        {isSending ? <Loader2 size={15} className="animate-spin" /> : <SendHorizontal size={15} />}
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] ${textMuted}`}>Invio: Enter | Nuova riga: Shift+Enter</span>
                    <span className={`text-[10px] ${textMuted}`}>Prompt inviati: {promptCount}</span>
                </div>

                {errorText && (
                    <p className="mt-2 text-[11px] text-[#F73C1C] bg-[#F73C1C]/10 border border-[#F73C1C]/25 rounded-md px-2.5 py-2">
                        {errorText}
                    </p>
                )}
            </div>
        </div>
    );
}
