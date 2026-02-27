'use client';

import React from 'react';
import PixelCharacter from './PixelCharacter';

interface MessagePart {
  type: string;
  text?: string;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  parts?: MessagePart[];
  content?: string;
}

export default function ChatMessage({ role, parts, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  // Extract text from parts (v6) or fallback to content
  const text = parts
    ? parts
        .filter((p) => p.type === 'text' && p.text)
        .map((p) => p.text)
        .join('')
    : content || '';

  return (
    <div
      className={`flex gap-2 chat-bubble-in ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="flex-shrink-0 mt-1">
          <PixelCharacter outfit="phd" scale={1.5} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm'
        }`}
      >
        <div className="whitespace-pre-wrap break-words chat-message-content">
          {text}
        </div>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      )}
    </div>
  );
}
