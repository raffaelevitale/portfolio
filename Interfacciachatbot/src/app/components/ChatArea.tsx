import { useState, useRef, useEffect } from 'react';
import { Copy, Paperclip, Send, Check, ThumbsUp, ThumbsDown, RotateCcw, Smile, X, MessageSquareWarning, AlertTriangle, Ban, HelpCircle, Bug, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import type { Module } from './data';
import { quickRepliesMap, botResponsesMap } from './data';
import { useTheme } from './ThemeContext';

type FeedbackData = {
  category: string;
  comment: string;
};

type Message = {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  time: string;
  liked?: boolean | null;
  copied?: boolean;
  feedback?: FeedbackData;
};

const feedbackCategories = [
  { id: 'inaccurate', label: 'Risposta imprecisa', description: 'Informazioni errate o fuorvianti', icon: AlertTriangle },
  { id: 'unhelpful', label: 'Non utile', description: 'Non risponde alla domanda', icon: HelpCircle },
  { id: 'harmful', label: 'Contenuto inappropriato', description: 'Linguaggio offensivo o dannoso', icon: Ban },
  { id: 'incomplete', label: 'Risposta incompleta', description: 'Mancano dettagli importanti', icon: MessageSquareWarning },
  { id: 'bug', label: 'Errore tecnico', description: 'Problemi di formattazione o visualizzazione', icon: Bug },
];

function FeedbackModal({ onSubmit, onClose, isDark }: { onSubmit: (data: FeedbackData) => void; onClose: () => void; isDark: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const t = (d: string, l: string) => isDark ? d : l;

  const overlayBg = 'bg-black/60 backdrop-blur-sm';
  const panelBg = t('bg-[#1A1A1A] border-white/[0.08]', 'bg-white border-black/[0.08]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#999]', 'text-[#666]');
  const textMuted = t('text-[#555]', 'text-[#aaa]');
  const cardBg = t('bg-[#242424] border-white/[0.06] hover:border-white/[0.12]', 'bg-[#F8F8F8] border-black/[0.06] hover:border-black/[0.12]');
  const cardSelectedBg = t('bg-[#F73C1C]/10 border-[#F73C1C]/40', 'bg-[#FFF0EE] border-[#F73C1C]/40');
  const inputBg = t('bg-[#242424] border-white/[0.06]', 'bg-[#F5F5F5] border-black/[0.06]');
  const inputText = t('text-[#ccc] placeholder:text-[#555]', 'text-[#333] placeholder:text-[#bbb]');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayBg}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl border ${panelBg} shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className={`text-[15px] font-bold ${textMain}`}>Segnala un problema</h3>
            <p className={`text-[12px] ${textSub} mt-0.5`}>Il tuo feedback ci aiuta a migliorare</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${textMuted} hover:text-[#F73C1C] transition-colors`}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-2">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted} mb-2.5`}>Seleziona una categoria</p>
          <div className="flex flex-col gap-1.5">
            {feedbackCategories.map(cat => {
              const isSelected = selected === cat.id;
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(isSelected ? null : cat.id)}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected ? cardSelectedBg : cardBg
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                    isSelected ? 'bg-[#F73C1C]/15' : t('bg-white/[0.04]', 'bg-black/[0.04]')
                  }`}>
                    <CatIcon size={16} className={isSelected ? 'text-[#F73C1C]' : t('text-[#777]', 'text-[#999]')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13px] font-medium block ${isSelected ? 'text-[#F73C1C]' : textMain}`}>{cat.label}</span>
                    <span className={`text-[11px] block ${textSub}`}>{cat.description}</span>
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <div className="w-5 h-5 rounded-full bg-[#F73C1C] flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pt-2 pb-1">
                <p className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted} mb-2`}>Dettagli (opzionale)</p>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Descrivi il problema in dettaglio..."
                  rows={3}
                  className={`w-full ${inputBg} ${inputText} border rounded-xl px-3.5 py-2.5 text-[13px] resize-none outline-none focus:border-[#F73C1C]/30 transition-colors`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-2 px-5 py-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium ${textSub} ${t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]')} transition-colors`}
          >
            Annulla
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!selected}
            onClick={() => {
              if (selected) onSubmit({ category: selected, comment });
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              selected
                ? 'bg-[#F73C1C] text-white hover:bg-[#e0341a] shadow-md shadow-[#F73C1C]/20'
                : t('bg-[#333] text-[#666]', 'bg-[#eee] text-[#bbb]') + ' cursor-not-allowed'
            }`}
          >
            Invia feedback
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function formatTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

interface ChatAreaProps {
  module: Module;
}

export function ChatArea({ module }: ChatAreaProps) {
  const { t } = useTheme();
  const quickReplies = quickRepliesMap[module.id] || quickRepliesMap.default;
  const responses = botResponsesMap[module.id] || botResponsesMap.default;

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', content: `Ciao! Sono l'assistente per **${module.name}**. Come posso aiutarti oggi?`, time: formatTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDark = t('dark', 'light') === 'dark';

  useEffect(() => {
    setMessages([{ id: '1', sender: 'bot', content: `Ciao! Sono l'assistente per **${module.name}**. Come posso aiutarti oggi?`, time: formatTime() }]);
  }, [module.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: msg, time: formatTime() }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);
    const response = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', content: response, time: formatTime() }]);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content.replace(/\*\*/g, ''));
    setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
    setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
    toast.success('Messaggio copiato negli appunti');
  };

  const rateMessage = (id: string, liked: boolean) => {
    if (!liked) {
      setFeedbackMessageId(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: false } : m));
      return;
    }
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: m.liked === liked ? null : liked, feedback: undefined } : m));
    if (liked) toast.success('Grazie per il feedback positivo!');
  };

  const submitFeedback = (data: FeedbackData) => {
    if (feedbackMessageId) {
      setMessages(prev => prev.map(m => m.id === feedbackMessageId ? { ...m, liked: false, feedback: data } : m));
      const categoryLabel = feedbackCategories.find(c => c.id === data.category)?.label || data.category;
      toast.success(`Feedback inviato: ${categoryLabel}`);
    }
    setFeedbackMessageId(null);
  };

  const renderContent = (content: string) => {
    const boldCls = t('text-white', 'text-[#111]');
    const lines = content.split('\n');
    if (lines.some(l => l.trim().startsWith('•'))) {
      return (
        <div className="space-y-1.5">
          {lines.map((line, i) => {
            if (line.trim().startsWith('•')) {
              const bulletContent = line.trim().slice(1).trim();
              const parts = bulletContent.split(/(\*\*.*?\*\*)/g);
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-[#F73C1C] mt-[2px]">•</span>
                  <span>{parts.map((p, j) => p.startsWith('**') ? <strong key={j} className={`font-semibold ${boldCls}`}>{p.slice(2, -2)}</strong> : p)}</span>
                </div>
              );
            }
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return <p key={i}>{parts.map((p, j) => p.startsWith('**') ? <strong key={j} className={`font-semibold ${boldCls}`}>{p.slice(2, -2)}</strong> : p)}</p>;
          })}
        </div>
      );
    }
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return <p>{parts.map((p, i) => p.startsWith('**') ? <strong key={i} className={`font-semibold ${boldCls}`}>{p.slice(2, -2)}</strong> : p)}</p>;
  };

  const botBubbleBg = t('bg-[#1E1E1E] border-white/[0.04]', 'bg-white border-black/[0.06]');
  const botBubbleText = t('text-[#ccc]', 'text-[#444]');
  const userBubbleBg = t('bg-[#333]', 'bg-[#F73C1C]');
  const userBubbleText = t('text-[#F5F5F5]', 'text-white');
  const botAvatarBg = t('bg-[#1E1E1E] border-white/[0.06]', 'bg-[#FFF0EE] border-[#F73C1C]/10');
  const inputBg = t('bg-[#1E1E1E] border-white/[0.04]', 'bg-white border-black/[0.08]');
  const inputText = t('text-[#F5F5F5] placeholder:text-[#444]', 'text-[#222] placeholder:text-[#bbb]');
  const iconBtnCls = t('text-[#666] hover:text-[#F5F5F5]', 'text-[#bbb] hover:text-[#444]');
  const dateCls = t('text-[#444]', 'text-[#bbb]');
  const timeCls = t('text-[#555]', 'text-[#bbb]');
  const divider = t('bg-white/[0.06]', 'bg-black/[0.06]');
  const qrBorder = t('border-white/[0.08]', 'border-black/[0.1]');
  const qrText = t('text-[#888]', 'text-[#777]');
  const actionBtnBg = t('bg-[#1E1E1E] border-white/[0.06]', 'bg-white border-black/[0.08]');
  const actionBtnText = t('text-[#666] hover:text-white', 'text-[#bbb] hover:text-[#444]');

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 relative">
      <AnimatePresence>
        {feedbackMessageId && (
          <FeedbackModal
            isDark={isDark}
            onSubmit={submitFeedback}
            onClose={() => {
              setMessages(prev => prev.map(m => m.id === feedbackMessageId && !m.feedback ? { ...m, liked: null } : m));
              setFeedbackMessageId(null);
            }}
          />
        )}
      </AnimatePresence>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 md:gap-5">
          <div className="flex items-center justify-center gap-4 my-2">
            <div className={`h-[1px] w-12 ${divider}`} />
            <span className={`text-[11px] font-medium ${dateCls} tracking-widest`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              {new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </span>
            <div className={`h-[1px] w-12 ${divider}`} />
          </div>

          {messages.map(msg => msg.sender === 'bot' ? (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex gap-2 md:gap-3 max-w-[95%] md:max-w-[85%]"
            >
              <div className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-[8px] ${botAvatarBg} border shrink-0 mt-1`}>
                <span className="text-[#F73C1C] text-[12px] md:text-[13px] font-bold leading-none">V</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className={`group relative ${botBubbleBg} ${botBubbleText} text-[13px] md:text-[14px] leading-relaxed p-3 md:p-4 rounded-[12px] rounded-bl-[4px] border shadow-sm`}>
                  {renderContent(msg.content)}
                  <div className="absolute -bottom-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyMessage(msg.id, msg.content)} className={`p-1 rounded ${actionBtnBg} border ${actionBtnText} transition-colors`}>
                      {msg.copied ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                    </button>
                    <button onClick={() => rateMessage(msg.id, true)} className={`p-1 rounded ${actionBtnBg} border transition-colors ${msg.liked === true ? 'text-[#10B981]' : actionBtnText}`}>
                      <ThumbsUp size={12} />
                    </button>
                    <button onClick={() => rateMessage(msg.id, false)} className={`p-1 rounded ${actionBtnBg} border transition-colors ${msg.liked === false ? 'text-[#F73C1C]' : actionBtnText}`}>
                      <ThumbsDown size={12} />
                    </button>
                    <button onClick={() => sendMessage('Rigenera la risposta')} className={`p-1 rounded ${actionBtnBg} border ${actionBtnText} transition-colors`}>
                      <RotateCcw size={12} />
                    </button>
                    <AnimatePresence>
                      {msg.liked === true && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[9px] font-medium ml-1.5 text-[#10B981]"
                        >
                          Feedback positivo
                        </motion.span>
                      )}
                      {msg.liked === false && msg.feedback && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[9px] font-medium ml-1.5 text-[#F73C1C]"
                        >
                          {feedbackCategories.find(c => c.id === msg.feedback?.category)?.label || 'Feedback inviato'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <span className={`text-[10px] md:text-[11px] ${timeCls} mt-9`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{msg.time}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex gap-2 md:gap-3 self-end max-w-[95%] md:max-w-[85%] flex-row-reverse"
            >
              <div className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full ${t('bg-[#333]', 'bg-[#F73C1C]')} shrink-0 mt-1`}>
                <span className="text-white text-[10px] md:text-[11px] font-bold leading-none tracking-wider">LC</span>
              </div>
              <div className="flex flex-col gap-1 items-end min-w-0">
                <div className={`${userBubbleBg} ${userBubbleText} text-[13px] md:text-[14px] leading-relaxed p-3 md:p-4 rounded-[12px] rounded-br-[4px] shadow-sm`}>
                  <p>{msg.content}</p>
                </div>
                <span className={`text-[10px] md:text-[11px] ${timeCls}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{msg.time}</span>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-3 max-w-[85%]"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${botAvatarBg} border shrink-0`}>
                  <span className="text-[#F73C1C] text-[13px] font-bold leading-none">V</span>
                </div>
                <div className={`${botBubbleBg} ${botBubbleText} text-[14px] p-4 rounded-[12px] rounded-bl-[4px] border`}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${t('bg-[#666]', 'bg-[#bbb]')} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-1.5 h-1.5 rounded-full ${t('bg-[#666]', 'bg-[#bbb]')} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-1.5 h-1.5 rounded-full ${t('bg-[#666]', 'bg-[#bbb]')} animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-3 md:px-6 pb-3 md:pb-5 shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-2 md:gap-3">
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {quickReplies.map((reply, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(reply)}
                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full border ${qrBorder} text-[11px] md:text-[12px] ${qrText} hover:border-[#F73C1C] hover:text-[#F73C1C] transition-colors`}
              >
                {reply}
              </motion.button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className={`flex items-end ${inputBg} rounded-[12px] md:rounded-[14px] border p-1.5 md:p-2 pl-3 md:pl-4 focus-within:border-[#F73C1C]/30 transition-colors shadow-sm`}>
              <textarea
                ref={textareaRef}
                placeholder={`Scrivi un messaggio...`}
                className={`flex-1 max-h-[120px] bg-transparent text-[13px] md:text-[14px] ${inputText} resize-none outline-none py-2`}
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center gap-1 md:gap-1.5 shrink-0 pb-1">
                <button className={`p-1.5 md:p-2 ${iconBtnCls} transition-colors rounded-lg`}><Paperclip size={16} /></button>
                <button className={`hidden sm:block p-1.5 md:p-2 ${iconBtnCls} transition-colors rounded-lg`}><Smile size={16} /></button>
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  whileTap={input.trim() ? { scale: 0.9 } : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-white transition-all duration-200 shadow-md ${input.trim() ? 'bg-[#F59E0B] hover:bg-[#e8900a] shadow-[#F59E0B]/20' : t('bg-[#333]', 'bg-[#ddd]') + ' shadow-none cursor-not-allowed'}`}
                >
                  <Send size={15} className="ml-[1px]" />
                </motion.button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className={`text-[10px] md:text-[11px] ${dateCls}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{input.length} / 2000</span>
              <span className={`hidden sm:inline text-[10px] md:text-[11px] ${dateCls}`}>Maiusc+Invio per nuova riga</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
