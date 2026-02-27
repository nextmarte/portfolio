'use client';

import React, { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import PixelCharacter from './PixelCharacter';
import ChatMessage from './ChatMessage';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show invite bubble after 3 seconds
  useEffect(() => {
    if (inviteDismissed || isOpen) return;
    const timer = setTimeout(() => setShowInvite(true), 3000);
    return () => clearTimeout(timer);
  }, [inviteDismissed, isOpen]);

  const { messages, sendMessage, status, setMessages } =
    useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setShowInvite(false);
    setInviteDismissed(true);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput('');
      sendMessage({ text });
    },
    [input, isLoading, sendMessage]
  );

  return (
    <>
      {/* Invite Speech Bubble */}
      {showInvite && !isOpen && (
        <div className="fixed bottom-[5.5rem] right-5 z-50 chat-invite-bubble">
          <div
            className="relative bg-white rounded-2xl px-4 py-3 shadow-lg
              border border-gray-200 max-w-[220px] cursor-pointer
              hover:shadow-xl transition-shadow"
            onClick={toggleChat}
          >
            <p className="text-sm text-gray-700 leading-snug">
              Oi! 👋 Quer saber mais sobre mim? <span className="text-indigo-600 font-medium">Vamos conversar!</span>
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 rotate-45
              bg-white border-r border-b
              border-gray-200" />
          </div>
          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInvite(false);
              setInviteDismissed(true);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full
              bg-gray-200 flex items-center justify-center
              text-gray-500 hover:bg-gray-300
              transition-colors text-xs leading-none"
            aria-label="Fechar convite"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat com Marcus AI'}
        className={`fixed bottom-5 right-5 z-50 flex items-center justify-center
          w-14 h-14 rounded-full shadow-lg transition-all duration-300
          bg-indigo-600 hover:bg-indigo-700 hover:scale-110 active:scale-95
          ${isOpen ? '' : 'chat-float-btn'}
          `}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="flex items-center justify-center">
            <PixelCharacter outfit="phd" scale={2} />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-5 z-50 w-[360px] max-w-[calc(100vw-2.5rem)]
            h-[520px] max-h-[calc(100vh-7rem)]
            flex flex-col rounded-2xl shadow-2xl overflow-hidden
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            chat-slide-up"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white">
            <div className="flex-shrink-0">
              <PixelCharacter outfit="phd" scale={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight">Marcus AI</h3>
              <p className="text-xs text-indigo-200 truncate">
                Pergunte sobre mim! / Ask me anything!
              </p>
            </div>
            <button
              onClick={clearChat}
              title="Limpar conversa"
              className="p-1.5 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 px-4">
                <div className="mb-3">
                  <PixelCharacter outfit="phd" scale={3} />
                </div>
                <p className="text-sm font-medium mb-1 text-white">Olá! Eu sou o Marcus AI 👋</p>
                <p className="text-xs leading-relaxed">
                  Pergunte sobre minha experiência, projetos, publicações ou qualquer coisa
                  do meu portfólio!
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {[
                    'Quais são seus projetos?',
                    'What is your research about?',
                    'Skills técnicos?',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        sendMessage({ text: suggestion });
                      }}
                      className="text-xs px-2.5 py-1 rounded-full
                        bg-gray-100 dark:bg-gray-800
                        text-gray-600 dark:text-gray-300
                        hover:bg-indigo-100 dark:hover:bg-indigo-900
                        hover:text-indigo-700 dark:hover:text-indigo-300
                        transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role as 'user' | 'assistant'}
                parts={m.parts as { type: string; text?: string }[]}
              />
            ))}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1].role === 'user' && (
                <div className="flex gap-2 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <PixelCharacter outfit="phd" scale={1.5} />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="typing-dots flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            id="chat-form"
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo... / Ask something..."
              className="flex-1 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
                rounded-xl px-3.5 py-2 border border-gray-200 dark:border-gray-600
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                rounded-xl bg-indigo-600 text-white
                hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
