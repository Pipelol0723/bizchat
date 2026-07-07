'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { ChatMessages } from '@/components/ChatMessages'
import { ChatInput } from '@/components/ChatInput'
import { useChatPanel } from '@/components/ChatProvider'
import { businessConfig } from '@/lib/business-config'

// Componente principal del widget: botón flotante (FAB) + panel de chat.
// El modelo de IA lo decide el dueño en el backend (variable DEFAULT_PROVIDER);
// no se expone en el frontend. Toda la lógica del chat vive aquí (useChat).
export function ChatWidget() {
  const { isOpen, open, close, pending, consumePending } = useChatPanel()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const hasOpenedRef = useRef(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } =
    useChat({
      api: '/api/chat',
      onError: () => {
        // Si el request falla (sin key, red, etc.), muestra una burbuja amable
        // en vez de dejar el mensaje del usuario sin respuesta.
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content:
              'Uy, tuve un problema para responder ahora mismo 😅 Intenta de nuevo en un momento.',
          },
        ])
      },
    })

  // Badge "1" a los 4s si el usuario aún no ha abierto el chat.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasOpenedRef.current) setShowBadge(true)
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  // Marca como abierto y oculta el badge cuando se abre el panel.
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true
      setShowBadge(false)
    }
  }, [isOpen])

  // Envía la pregunta pendiente que dejó un chip de la landing.
  useEffect(() => {
    if (pending && !isLoading) {
      append({ role: 'user', content: pending })
      consumePending()
    }
  }, [pending, isLoading, append, consumePending])

  const onSuggested = (question: string) => {
    if (isLoading) return
    append({ role: 'user', content: question })
  }

  const onReset = () => {
    setMessages([])
    setMenuOpen(false)
  }

  return (
    <>
      {!isOpen && <Fab onOpen={open} showBadge={showBadge} />}

      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[88vh] flex-col overflow-hidden rounded-t-[18px] bg-panel text-coffee shadow-panel sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(600px,calc(100vh-48px))] sm:w-[380px] sm:rounded-2xl"
          style={{ animation: 'fadeUp .25s ease both' }}
          role="dialog"
          aria-label={`Chat con ${businessConfig.botName}`}
        >
          <header className="relative flex items-center gap-2.5 border-b border-coffee/10 bg-panel px-3.5 py-3">
            <span className="h-2.5 w-2.5 flex-none rounded-full bg-online" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[15px] font-bold">
              {businessConfig.botName} · {businessConfig.name}
            </span>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Opciones"
              className="rounded-md px-1.5 py-1 text-[17px] text-coffee/50 transition-colors hover:bg-coffee/5"
            >
              ⋯
            </button>
            <button
              onClick={close}
              aria-label="Cerrar chat"
              className="rounded-md px-1.5 py-1 text-[15px] text-coffee/50 transition-colors hover:bg-coffee/5"
            >
              ✕
            </button>

            {menuOpen && (
              <div className="absolute right-2.5 top-[46px] z-10 min-w-[180px] rounded-[10px] border border-coffee/10 bg-white p-1.5 shadow-popover">
                <button
                  onClick={onReset}
                  className="block w-full rounded-[7px] px-2.5 py-2 text-left text-sm text-danger-soft transition-colors hover:bg-danger-soft/10"
                >
                  Reiniciar conversación
                </button>
              </div>
            )}
          </header>

          <ChatMessages messages={messages} isLoading={isLoading} onSuggested={onSuggested} />

          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />

          <div className="bg-panel pb-2 text-center text-[11px] text-coffee/40">
            Asistente con IA · impulsado por BizChat
          </div>
        </div>
      )}
    </>
  )
}

function Fab({ onOpen, showBadge }: { onOpen: () => void; showBadge: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onOpen}
        className="flex items-center gap-2.5 rounded-full bg-accent py-2.5 pl-2.5 pr-[22px] text-coffee-dark shadow-fab transition-colors hover:bg-accent-light"
      >
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-coffee-dark text-base text-cream">
          ☕
        </span>
        <span className="text-[15px] font-bold">Habla con {businessConfig.botName}</span>
      </button>
      {showBadge && (
        <span
          className="absolute -right-0.5 -top-1 flex h-[19px] w-[19px] items-center justify-center rounded-full border-2 border-coffee-dark bg-danger text-[11px] font-bold text-white"
          style={{ animation: 'popIn .3s ease both' }}
        >
          1
        </span>
      )}
    </div>
  )
}
