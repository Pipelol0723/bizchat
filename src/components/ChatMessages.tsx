'use client'

import { useEffect, useRef } from 'react'
import type { Message } from 'ai'
import { businessConfig } from '@/lib/business-config'
import type { SuggestedQuestion } from '@/types'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onSuggested: (question: string) => void
}

/** Lista de mensajes con estado vacío, indicador de escritura y auto-scroll. */
export function ChatMessages({ messages, isLoading, onSuggested }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isLoading])

  const isEmpty = messages.length === 0
  // Mostramos el indicador de "escribiendo" solo si aún no llega texto del bot.
  const waitingFirstToken =
    isLoading && messages[messages.length - 1]?.role !== 'assistant'

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-panel px-3.5 py-4"
    >
      {isEmpty ? (
        <EmptyState onSuggested={onSuggested} suggestions={businessConfig.suggestedQuestions} />
      ) : (
        messages.map((m) => <Bubble key={m.id} role={m.role} content={m.content} />)
      )}

      {waitingFirstToken && <TypingBubble />}
    </div>
  )
}

function EmptyState({
  onSuggested,
  suggestions,
}: {
  onSuggested: (q: string) => void
  suggestions: SuggestedQuestion[]
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 py-3 text-center">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-[22px]">
        ☕
      </div>
      <p className="text-[15px] leading-relaxed text-coffee/75">
        {businessConfig.welcomeMessage}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggested(s.question)}
            className="rounded-full border border-coffee/20 bg-white px-3.5 py-2 text-[13px] font-medium text-coffee transition-colors hover:border-accent hover:text-accent-dark"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          'max-w-[82%] whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-[1.55] ' +
          (isUser
            ? 'rounded-[14px_14px_3px_14px] bg-accent font-medium text-coffee-dark'
            : 'rounded-[14px_14px_14px_3px] border border-coffee/10 bg-white text-coffee')
        }
      >
        {content}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-[14px_14px_14px_3px] border border-coffee/10 bg-white px-3.5 py-3">
        <span className="inline-flex gap-1">
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </span>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-[5px] w-[5px] rounded-full bg-accent-dark"
      style={{ animation: `blink 1.2s ${delay} infinite` }}
    />
  )
}
