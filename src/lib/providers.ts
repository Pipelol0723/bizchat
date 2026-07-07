import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'
import type { Provider } from '@/types'

// Proveedores de IA soportados (solo servidor). El dueño elige cuál usar con la
// variable de entorno DEFAULT_PROVIDER; el frontend no expone la elección.
// Cada proveedor lee su API key de la variable envKey correspondiente.

export const providers: Record<
  Provider,
  { label: string; envKey: string; model: () => LanguageModel }
> = {
  openai: {
    label: 'OpenAI · GPT-4o mini',
    envKey: 'OPENAI_API_KEY',
    model: () => openai('gpt-4o-mini'),
  },
  anthropic: {
    label: 'Claude · Haiku',
    envKey: 'ANTHROPIC_API_KEY',
    model: () => anthropic('claude-haiku-4-5-20251001'),
  },
  google: {
    label: 'Gemini · Flash',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    model: () => google('gemini-2.0-flash'),
  },
}

/** Proveedor elegido por el dueño en el backend (DEFAULT_PROVIDER). */
export const defaultProvider: Provider =
  (process.env.DEFAULT_PROVIDER as Provider) || 'anthropic'

/** true si el proveedor tiene su API key configurada en el entorno. */
export function hasKey(provider: Provider): boolean {
  return Boolean(process.env[providers[provider].envKey])
}
