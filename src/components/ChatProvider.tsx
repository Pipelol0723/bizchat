'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Contexto ligero para que la landing (chips del hero, botón CTA) pueda abrir el
// widget y, opcionalmente, enviar una pregunta ya escrita. El ChatWidget consume
// la pregunta pendiente y la limpia.

interface ChatContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  /** Abre el panel y deja una pregunta lista para enviarse. */
  ask: (question: string) => void
  /** Pregunta pendiente que el widget debe enviar (o null). */
  pending: string | null
  /** El widget la llama tras enviar la pregunta pendiente. */
  consumePending: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState<string | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const ask = useCallback((question: string) => {
    setPending(question)
    setIsOpen(true)
  }, [])
  const consumePending = useCallback(() => setPending(null), [])

  const value = useMemo(
    () => ({ isOpen, open, close, ask, pending, consumePending }),
    [isOpen, open, close, ask, pending, consumePending],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatPanel(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatPanel debe usarse dentro de <ChatProvider>')
  return ctx
}
