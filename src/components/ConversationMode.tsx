import {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  Send,
  ArrowLeft,
  Bot,
  User,
  RotateCcw,
  Mic,
  MicOff,
} from 'lucide-react';

import type {
  Language,
  ApplicantProfile,
} from '@/lib/types';

import {
  t,
  type TranslationKey,
} from '@/i18n/translations';

import {
  extractFromMessage,
} from '@/lib/aiExtractor';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

interface ConversationModeProps {
  lang: Language;
  initialProfile: ApplicantProfile;
  onComplete: (
    profile: ApplicantProfile
  ) => void;
  onBack: () => void;
}

/* =========================================================
   BROWSER SPEECH RECOGNITION TYPES
   ========================================================= */

interface SpeechRecognitionEvent
  extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent
  extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onresult:
    | ((
        event: SpeechRecognitionEvent
      ) => void)
    | null;

  onerror:
    | ((
        event: SpeechRecognitionErrorEvent
      ) => void)
    | null;

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

  const tr = (
    key: TranslationKey
  ) => t(lang, key);

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'bot',
      text: tr('chatGreeting'),
    },
  ]);

  const [
    input,
    setInput,
  ] = useState('');

  const [
    profile,
    setProfile,
  ] = useState<ApplicantProfile>(
    initialProfile
  );

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [
    pendingField,
    setPendingField,
  ] = useState<string | null>(null);

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    voiceError,
    setVoiceError,
  ] = useState<string | null>(null);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const msgId =
    useRef(1);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(
      null
    );

  /* =========================================================
     AUTO-SCROLL CHAT
     ========================================================= */

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top:
        scrollRef.current
          .scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  /* =========================================================
     SPEECH LANGUAGE
     ========================================================= */

  const getSpeechLanguage =
    (): string => {

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

  /* =========================================================
     START / STOP MICROPHONE
     ========================================================= */

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

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang =
      getSpeechLanguage();

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
          event.results[i][0]
            .transcript;
      }

      /*
       * Voice ONLY fills the input.
       *
       * It does NOT automatically send.
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

      if (
        event.error ===
        'not-allowed'
      ) {
        setVoiceError(
          'Microphone permission was denied. Please allow microphone access or type your answer.'
        );
      } else if (
        event.error ===
        'no-speech'
      ) {
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

    recognitionRef.current =
      recognition;

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

  /* =========================================================
     CLEAN UP MICROPHONE
     ========================================================= */

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  /* =========================================================
     QUESTIONS
     ========================================================= */

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
        return tr(
          'askEducationStatus'
        );

      case 'project_type':
        return tr(
          'askProjectType'
        );

      case 'location':
        return tr(
          'askLocation'
        );

      default:
        return tr(
          'profileReady'
        );
    }
  };

  /* =========================================================
     SEND MESSAGE
     ========================================================= */

  const handleSend = () => {

    if (
      !input.trim() ||
      isProcessing
    ) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMsg: ChatMessage = {
      id: msgId.current++,
      sender: 'user',
      text: input.trim(),
    };

    setMessages(
      (prev) => [
        ...prev,
        userMsg,
      ]
    );

    setInput('');
    setIsProcessing(true);
    setVoiceError(null);

    setTimeout(() => {

      const result =
        extractFromMessage(
          userMsg.text,
          profile,
          pendingField ??
            undefined
        );

      const updatedProfile: ApplicantProfile =
        {
          ...profile,
          ...result.profile,
        } as ApplicantProfile;

      setProfile(
        updatedProfile
      );

      if (
        result.missingFields
          .length === 0
      ) {

        setPendingField(null);

        const botReply:
          ChatMessage = {
            id: msgId.current++,
            sender: 'bot',
            text: tr(
              'profileReady'
            ),
          };

        setMessages(
          (prev) => [
            ...prev,
            botReply,
          ]
        );

        setTimeout(
          () =>
            onComplete(
              updatedProfile
            ),
          1200
        );

      } else {

        const nextField =
          result
            .missingFields[0];

        setPendingField(
          nextField
        );

        const question =
          askQuestion(
            nextField
          );

        const botReply:
          ChatMessage = {
            id: msgId.current++,
            sender: 'bot',
            text: question,
          };

        setMessages(
          (prev) => [
            ...prev,
            botReply,
          ]
        );
      }

      setIsProcessing(false);

    }, 600);
  };

  /* =========================================================
     RESET
     ========================================================= */

  const handleReset = () => {

    recognitionRef.current?.abort();

    setIsListening(false);
    setVoiceError(null);

    setMessages([
      {
        id: 0,
        sender: 'bot',
        text: tr(
          'chatGreeting'
        ),
      },
    ]);

    setProfile({
      ...initialProfile,
    });

    setInput('');
    setPendingField(null);
  };

  return (
    <div
      className="
        card
        animate-slide-up
        flex
        flex-col
      "
      style={{
        height: '70vh',
        maxHeight: '600px',
      }}
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between

          gap-3

          p-4

          border-b
          border-slate-200/60
        "
      >

        {/* BACK — RED */}

        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-red-600
            hover:bg-red-700

            px-4
            py-2.5

            text-white

            text-sm
            font-semibold

            shadow-sm

            transition-all
            duration-200

            focus:outline-none
            focus:ring-2
            focus:ring-red-500
            focus:ring-offset-2
          "
        >
          <ArrowLeft
            className="w-4 h-4"
          />

          {tr('backToHome')}
        </button>

        {/* RESET — NEUTRAL */}

        <button
          type="button"
          onClick={handleReset}
          className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-slate-100
            hover:bg-slate-200

            px-4
            py-2.5

            text-slate-700

            text-sm
            font-semibold

            transition-all
            duration-200

            focus:outline-none
            focus:ring-2
            focus:ring-slate-400
            focus:ring-offset-2
          "
        >
          <RotateCcw
            className="w-4 h-4"
          />

          {tr('chatReset')}
        </button>

      </div>

      {/* =====================================================
          MESSAGES
          ===================================================== */}

      <div
        ref={scrollRef}
        className="
          flex-1
          overflow-y-auto

          p-4
          space-y-3
        "
      >

        {messages.map(
          (msg) => (

            <div
              key={msg.id}
              className={`
                flex
                items-start
                gap-2.5
                animate-fade-in

                ${
                  msg.sender ===
                  'user'
                    ? 'flex-row-reverse'
                    : ''
                }
              `}
            >

              {/* Avatar */}

              <div
                className={`
                  flex
                  items-center
                  justify-center

                  w-8
                  h-8

                  rounded-full

                  flex-shrink-0

                  ${
                    msg.sender ===
                    'bot'
                      ? 'bg-primary-100'
                      : 'bg-slate-100'
                  }
                `}
              >

                {msg.sender ===
                'bot' ? (
                  <Bot
                    className="
                      w-4
                      h-4
                      text-primary-600
                    "
                  />
                ) : (
                  <User
                    className="
                      w-4
                      h-4
                      text-slate-500
                    "
                  />
                )}

              </div>

              {/* Message */}

              <div
                className={`
                  max-w-[80%]

                  px-4
                  py-3

                  rounded-2xl

                  text-sm
                  leading-relaxed

                  ${
                    msg.sender ===
                    'bot'
                      ? `
                        bg-slate-100
                        text-slate-800
                        rounded-tl-sm
                      `
                      : `
                        bg-primary-600
                        text-white
                        rounded-tr-sm
                      `
                  }
                `}
              >
                {msg.text}
              </div>

            </div>
          )
        )}

        {/* Processing */}

        {isProcessing && (
          <div
            className="
              flex
              items-center
              gap-2

              text-sm
              text-slate-400

              animate-fade-in
            "
          >

            <div
              className="
                flex
                items-center
                justify-center

                w-8
                h-8

                rounded-full

                bg-primary-100
              "
            >
              <Bot
                className="
                  w-4
                  h-4
                  text-primary-600
                "
              />
            </div>

            <span
              className="
                px-4
                py-2

                rounded-2xl
                rounded-tl-sm

                bg-slate-100
              "
            >
              {tr('chatThinking')}
            </span>

          </div>
        )}

      </div>

      {/* =====================================================
          INPUT
          ===================================================== */}

      <div
        className="
          p-4

          border-t
          border-slate-200/60
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* Text input */}

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(
                e.target.value
              );

              setVoiceError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder={tr(
              'chatPlaceholder'
            )}
            className="
              input-field
              flex-1
            "
            disabled={isProcessing}
          />

          {/* MICROPHONE */}

          <button
            type="button"
            onClick={
              startListening
            }
            disabled={
              isProcessing
            }
            className={`
              flex
              items-center
              justify-center

              w-12
              h-12

              rounded-xl

              transition-all
              duration-200

              ${
                isListening
                  ? `
                    bg-red-500
                    text-white
                    animate-pulse
                  `
                  : `
                    bg-slate-100
                    text-slate-600

                    hover:bg-blue-100
                    hover:text-blue-700
                  `
              }
            `}
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
              <MicOff
                className="w-5 h-5"
              />
            ) : (
              <Mic
                className="w-5 h-5"
              />
            )}

          </button>

          {/* SEND — GREEN */}

          <button
            type="button"
            onClick={
              handleSend
            }
            disabled={
              !input.trim() ||
              isProcessing
            }
            className="
              inline-flex
              items-center
              justify-center

              w-12
              h-12

              rounded-xl

              bg-green-600
              hover:bg-green-700

              text-white

              shadow-sm

              transition-all
              duration-200

              disabled:cursor-not-allowed
              disabled:opacity-50

              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              focus:ring-offset-2
            "
            aria-label={
              tr('chatSend')
            }
          >
            <Send
              className="w-5 h-5"
            />
          </button>

        </div>

        {/* Listening */}

        {isListening && (
          <p
            className="
              mt-2

              text-xs
              text-red-500

              text-center
              font-medium

              animate-pulse
            "
          >
            Listening...
            Speak now
          </p>
        )}

        {/* Voice error */}

        {voiceError && (
          <p
            className="
              mt-2

              text-xs
              text-slate-600

              text-center
            "
          >
            {voiceError}
          </p>
        )}

        {/* Helper */}

        {!isListening &&
          !voiceError && (
            <p
              className="
                mt-2

                text-xs
                text-slate-500

                text-center
              "
            >
              Speak or type your
              answer
            </p>
          )}

      </div>

    </div>
  );
}