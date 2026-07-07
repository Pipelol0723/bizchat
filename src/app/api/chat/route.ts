import { streamText, type CoreMessage } from 'ai'
import { businessConfig, buildSystemPrompt } from '@/lib/business-config'
import { providers, defaultProvider, hasKey } from '@/lib/providers'
import { siteConfig, demoLimitMessage } from '@/lib/site-config'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

// Se usa el runtime de Node (no edge): el acceso dinámico a process.env[envKey]
// y la lectura de API keys por los providers no es fiable en el runtime edge.
export const runtime = 'nodejs'

interface ChatRequestBody {
  messages: CoreMessage[]
  businessId?: string // reservado para multi-tenant; se ignora en el MVP
}

/**
 * Emite un texto fijo usando el protocolo data-stream del Vercel AI SDK, para
 * que `useChat` lo pinte como una burbuja normal del bot (sin lanzar error).
 */
function cannedStream(text: string): Response {
  const body = `0:${JSON.stringify(text)}\n`
  return new Response(new TextEncoder().encode(body), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'x-vercel-ai-data-stream': 'v1',
    },
  })
}

export async function POST(req: Request) {
  let body: ChatRequestBody
  try {
    body = (await req.json()) as ChatRequestBody
  } catch {
    return new Response('Body inválido: se esperaba JSON.', { status: 400 })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Faltan mensajes en la petición.', { status: 400 })
  }

  // El modelo lo decide el dueño en el backend (DEFAULT_PROVIDER); el cliente no
  // lo elige. Si ese proveedor no tiene su API key configurada, error claro.
  const provider = defaultProvider
  if (!hasKey(provider)) {
    return new Response(
      `No hay API key configurada para "${provider}". Agrega ${providers[provider].envKey} en .env.local.`,
      { status: 400 },
    )
  }

  // Tope de longitud de entrada: protege contra prompts enormes.
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const lastText = typeof lastUser?.content === 'string' ? lastUser.content : ''
  if (lastText.length > siteConfig.demoLimits.maxInputChars) {
    return cannedStream(
      `Ese mensaje es muy largo para el demo (máximo ${siteConfig.demoLimits.maxInputChars} caracteres). ` +
        'Hazme una pregunta más corta sobre el café ☕',
    )
  }

  // Rate-limit por IP: al superarlo, se redirige al contacto del desarrollador.
  const { allowed } = checkRateLimit(clientKey(req))
  if (!allowed) {
    return cannedStream(demoLimitMessage())
  }

  const result = streamText({
    model: providers[provider].model(),
    system: buildSystemPrompt(businessConfig),
    messages,
    maxTokens: siteConfig.demoLimits.maxOutputTokens,
    temperature: 0.5,
  })

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      // Registra el error completo en los logs de Vercel y devuelve un mensaje
      // acotado para poder depurar (p. ej. errores de autenticación del proveedor).
      console.error('[api/chat] error de streaming:', error)
      const msg = error instanceof Error ? error.message : String(error)
      return msg.slice(0, 300)
    },
  })
}
