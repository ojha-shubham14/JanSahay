import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User, RotateCcw } from 'lucide-react';
import type { Language, ApplicantProfile } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { extractFromMessage } from '@/lib/aiExtractor';
import { cityCoordinates } from '@/data/partners';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

interface ConversationModeProps {
  lang: Language;
  initialProfile: ApplicantProfile;
  onComplete: (profile: ApplicantProfile) => void;
  onBack: () => void;
}

export function ConversationMode({ lang, initialProfile, onComplete, onBack }: ConversationModeProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, sender: 'bot', text: tr('chatGreeting') },
  ]);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState<ApplicantProfile>(initialProfile);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const askQuestion = (missing: string): string => {
    switch (missing) {
      case 'income': return tr('askIncome');
      case 'purpose': return tr('askPurpose');
      case 'cost': return tr('askCost');
      case 'education_status': return tr('askEducationStatus');
      case 'project_type': return tr('askProjectType');
      case 'location': return tr('askLocation');
      default: return tr('profileReady');
    }
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = { id: msgId.current++, sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

        setTimeout(() => {
      const result = extractFromMessage(userMsg.text, profile, pendingField ?? undefined);
      const updatedProfile: ApplicantProfile = { ...profile, ...result.profile } as ApplicantProfile;
      setProfile(updatedProfile);

      if (result.missingFields.length === 0) {
        setPendingField(null);
        const botReply: ChatMessage = {
          id: msgId.current++,
          sender: 'bot',
          text: tr('profileReady'),
        };
        setMessages((prev) => [...prev, botReply]);
        setTimeout(() => onComplete(updatedProfile), 1200);
      } else {
        const nextField = result.missingFields[0];
        setPendingField(nextField);
        const question = askQuestion(nextField);
        const botReply: ChatMessage = { id: msgId.current++, sender: 'bot', text: question };
        setMessages((prev) => [...prev, botReply]);
      }
      setIsProcessing(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages([{ id: 0, sender: 'bot', text: tr('chatGreeting') }]);
    setProfile({ ...initialProfile });
    setInput('');
    setPendingField(null);
  };

  return (
    <div className="card animate-slide-up flex flex-col" style={{ height: '70vh', maxHeight: '600px' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          {tr('backToHome')}
        </button>
        <button onClick={handleReset} className="btn-ghost">
          <RotateCcw className="w-4 h-4" />
          {tr('chatReset')}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 animate-fade-in ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
              msg.sender === 'bot' ? 'bg-primary-100' : 'bg-slate-100'
            }`}>
              {msg.sender === 'bot'
                ? <Bot className="w-4 h-4 text-primary-600" />
                : <User className="w-4 h-4 text-slate-500" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'bot'
                ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                : 'bg-primary-600 text-white rounded-tr-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-slate-400 animate-fade-in">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
              <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <span className="px-4 py-2 rounded-2xl bg-slate-100 rounded-tl-sm">{tr('chatThinking')}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={tr('chatPlaceholder')}
            className="input-field flex-1"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="btn-primary px-4 py-3.5"
            aria-label={tr('chatSend')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
