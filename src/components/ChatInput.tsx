'use client'

import type { ChangeEvent, FormEvent } from 'react'

interface ChatInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  disabled: boolean
}

/** Fila de entrada: input pill + botón enviar. Enter envía (submit del form). */
export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 border-t border-coffee/10 bg-panel px-3 pb-3 pt-2.5"
    >
      <input
        value={value}
        onChange={onChange}
        placeholder="Escríbele a Noire…"
        aria-label="Mensaje para el asistente"
        className="min-w-0 flex-1 rounded-full border border-coffee/20 bg-white px-4 py-2.5 text-sm text-coffee outline-none transition-colors focus:border-accent"
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="Enviar mensaje"
        className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent text-base text-coffee-dark transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        ➤
      </button>
    </form>
  )
}
