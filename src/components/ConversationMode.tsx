import { useState, useRef, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  RotateCcw,
  Mic,
  MicOff,
  MessageCircle,
  Info,
} from 'lucide-react';

import type { Language, ApplicantProfile } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { extractFromMessage } from '@/lib/aiExtractor';

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

/* Browser Speech Recognition types */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function ConversationMode({
  lang,
  initialProfile,
  onComplete,
  onBack,
}: ConversationModeProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'bot',
      text: tr('chatGreeting'),
    },
  ]);

  const [input, setInput] = useState('');
  const [profile, setProfile] =
    useState<ApplicantProfile>(initialProfile);

  const [isProcessing, setIsProcessing] = useState(false);

  const [pendingField, setPendingField] =
    useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);

  const [voiceError, setVoiceError] =
    useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const msgId = useRef(1);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  /* -------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isProcessing]);

  /* -------------------------------------------------------
     SPEECH LANGUAGE
  ------------------------------------------------------- */

  const getSpeechLanguage = (): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';

      case 'kn':
        return 'kn-IN';

      case 'ta':
        return 'ta-IN';

      case 'en':
      default:
        return 'en-IN';
    }
  };

  /* -------------------------------------------------------
     START / STOP VOICE INPUT
  ------------------------------------------------------- */

  const startListening = () => {
    setVoiceError(null);

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        'Voice input is not supported in this browser. Please type your answer instead.'
      );
      return;
    }

    /*
      If already listening, pressing the microphone again
      stops recognition.
    */
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getSpeechLanguage();

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = '';

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      /*
        IMPORTANT:
        Voice only fills the input box.
        The user can review/edit it before pressing Send.
      */
      setInput(transcript);
    };

    recognition.onerror = (
      event: SpeechRecognitionErrorEvent
    ) => {
      console.error(
        'Speech recognition error:',
        event.error
      );

      setIsListening(false);

      if (event.error === 'not-allowed') {
        setVoiceError(
          'Microphone permission was denied. Please allow microphone access or type your answer.'
        );
      } else if (event.error === 'no-speech') {
        setVoiceError(
          'I could not hear anything. Please try again.'
        );
      } else {
        setVoiceError(
          'Voice input could not be started. Please try again or type your answer.'
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error(
        'Could not start speech recognition:',
        error
      );

      setIsListening(false);

      setVoiceError(
        'Unable to start the microphone. Please try again.'
      );
    }
  };

  /* -------------------------------------------------------
     CLEANUP MICROPHONE
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  /* -------------------------------------------------------
     NEXT QUESTION
  ------------------------------------------------------- */

  const askQuestion = (
    missing: string
  ): string => {
    switch (missing) {
      case 'income':
        return tr('askIncome');

      case 'purpose':
        return tr('askPurpose');

      case 'cost':
        return tr('askCost');

      case 'education_status':
        return tr('askEducationStatus');

      case 'project_type':
        return tr('askProjectType');

      case 'location':
        return tr('askLocation');

      default:
        return tr('profileReady');
    }
  };

  /* -------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------- */

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMsg: ChatMessage = {
      id: msgId.current++,
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput('');
    setIsProcessing(true);
    setVoiceError(null);

    setTimeout(() => {
      const result = extractFromMessage(
        userMsg.text,
        profile,
        pendingField ?? undefined
      );

      const updatedProfile: ApplicantProfile = {
        ...profile,
        ...result.profile,
      } as ApplicantProfile;

      setProfile(updatedProfile);

      /*
        All required information collected
      */
      if (result.missingFields.length === 0) {
        setPendingField(null);

        const botReply: ChatMessage = {
          id: msgId.current++,
          sender: 'bot',
          text: tr('profileReady'),
        };

        setMessages((prev) => [
          ...prev,
          botReply,
        ]);

        setTimeout(() => {
          onComplete(updatedProfile);
        }, 1200);
      } else {
        /*
          Ask only the next missing field
        */
        const nextField =
          result.missingFields[0];

        setPendingField(nextField);

        const question =
          askQuestion(nextField);

        const botReply: ChatMessage = {
          id: msgId.current++,
          sender: 'bot',
          text: question,
        };

        setMessages((prev) => [
          ...prev,
          botReply,
        ]);
      }

      setIsProcessing(false);
    }, 600);
  };

  /* -------------------------------------------------------
     RESET CONVERSATION
  ------------------------------------------------------- */

  const handleReset = () => {
    recognitionRef.current?.abort();

    setIsListening(false);
    setVoiceError(null);

    setMessages([
      {
        id: 0,
        sender: 'bot',
        text: tr('chatGreeting'),
      },
    ]);

    setProfile({
      ...initialProfile,
    });

    setInput('');
    setPendingField(null);
    setIsProcessing(false);
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <div
      className="portal-section p-0 animate-slide-up flex flex-col overflow-hidden"
      style={{
        height: '72vh',
        minHeight: '520px',
        maxHeight: '680px',
      }}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
            <MessageCircle className="w-5 h-5 text-primary-700 dark:text-primary-400" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              JanSahay Assistant
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Speak or type in simple language
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn-ghost flex-shrink-0"
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4" />

          <span className="hidden sm:inline">
            {tr('chatReset')}
          </span>
        </button>
      </div>

      {/* ==================================================
          INFORMATION BAR
      ================================================== */}

      <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Answer a few simple questions. You can
            type your answer or use the microphone.
          </p>
        </div>
      </div>

      {/* ==================================================
          CHAT MESSAGES
      ================================================== */}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4 bg-white dark:bg-slate-900"
      >
        {messages.map((msg) => {
          const isUser =
            msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 animate-fade-in ${
                isUser
                  ? 'flex-row-reverse'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 ${
                  isUser
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'bg-primary-50 dark:bg-primary-900/30'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                )}
              </div>

              {/* Message */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed border ${
                  isUser
                    ? 'bg-primary-700 text-white border-primary-700 rounded-md rounded-tr-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 rounded-md rounded-tl-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Thinking indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2.5 animate-fade-in">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
              <Bot className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            </div>

            <div className="px-4 py-3 rounded-md rounded-tl-sm border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />

                <span
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
                  style={{
                    animationDelay: '150ms',
                  }}
                />

                <span
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
                  style={{
                    animationDelay: '300ms',
                  }}
                />

                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                  {tr('chatThinking')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================
          VOICE STATUS
      ================================================== */}

      {isListening && (
        <div className="px-4 sm:px-5 py-2 bg-red-50 border-t border-red-100 dark:bg-red-950/30 dark:border-red-900">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>

            <p className="text-xs font-medium text-red-700 dark:text-red-300">
              Listening... Speak now
            </p>
          </div>
        </div>
      )}

      {voiceError && (
        <div className="px-4 sm:px-5 py-2 bg-warning-50 border-t border-warning-100 dark:bg-warning-900/20 dark:border-warning-800">
          <p className="text-xs text-warning-800 dark:text-warning-300 text-center">
            {voiceError}
          </p>
        </div>
      )}

      {/* ==================================================
          INPUT AREA
      ================================================== */}

      <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setVoiceError(null);
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !isProcessing
              ) {
                handleSend();
              }
            }}
            placeholder={tr('chatPlaceholder')}
            className="input-field flex-1 min-w-0"
            disabled={isProcessing}
            autoComplete="off"
          />

          {/* Microphone */}
          <button
            type="button"
            onClick={startListening}
            disabled={isProcessing}
            className={`flex items-center justify-center w-12 h-12 rounded-md border flex-shrink-0 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800'
            }`}
            aria-label={
              isListening
                ? 'Stop listening'
                : 'Use voice input'
            }
            title={
              isListening
                ? 'Stop listening'
                : 'Speak your answer'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Send */}
          <button
            type="button"
            onClick={handleSend}
            disabled={
              !input.trim() ||
              isProcessing
            }
            className="btn-primary w-12 h-12 p-0 flex-shrink-0"
            aria-label={tr('chatSend')}
            title={tr('chatSend')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Helper */}
        {!isListening &&
          !voiceError && (
            <div className="flex items-center justify-between gap-3 mt-2 px-1">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Speak or type your answer
              </p>

              <p className="hidden sm:block text-xs text-slate-400 dark:text-slate-500">
                Press Enter to send
              </p>
            </div>
          )}

        {/* Back */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-700 transition-colors dark:text-slate-400 dark:hover:text-primary-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {tr('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
}