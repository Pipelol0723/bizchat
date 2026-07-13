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

/**
 * Verifica que la petición venga de un origen permitido.
 *
 * Configura `ALLOWED_ORIGINS` en Vercel (lista separada por comas) con el/los
 * dominio(s) donde se embebe el widget, p. ej.:
 *   ALLOWED_ORIGINS=https://bizchat.pipelol.dev,https://el-negocio-del-cliente.com
 *
 * Si la variable NO está definida, no se bloquea nada (mismo comportamiento de
 * antes) pero se registra un aviso: el endpoint queda abierto a cualquiera y su
 * API key es explotable para quemar tokens. Definir la variable activa el filtro.
 */
function isOriginAllowed(req: Request): boolean {
  const allowed = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  if (allowed.length === 0) {
    console.warn(
      '[api/chat] ALLOWED_ORIGINS no está configurada: el endpoint acepta ' +
        'cualquier origen. Configúrala en Vercel para evitar el abuso de costos.',
    )
    return true
  }

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  let source: string | null = origin
  if (!source && referer) {
    try {
      source = new URL(referer).origin
    } catch {
      source = null
    }
  }
  return source !== null && allowed.includes(source)
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) {
    return new Response('Origen no permitido.', { status: 403 })
  }

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

  // El system prompt lo fija el servidor: descarta cualquier mensaje 'system'
  // inyectado por el cliente para que no pueda reescribir el comportamiento del bot.
  const clientMessages = messages.filter((m) => m.role !== 'system')
  if (clientMessages.length === 0) {
    return new Response('Faltan mensajes en la petición.', { status: 400 })
  }

  // Tope de cantidad de mensajes: evita historiales enormes que inflan el costo.
  if (clientMessages.length > siteConfig.demoLimits.maxMessages) {
    return cannedStream(
      'Esta conversación ya está muy larga para el demo ☕ ' +
        'Recarga la página para empezar de nuevo.',
    )
  }

  // Tope de tamaño total del historial (no solo el último mensaje).
  const totalChars = clientMessages.reduce((sum, m) => {
    const len =
      typeof m.content === 'string' ? m.content.length : JSON.stringify(m.content).length
    return sum + len
  }, 0)
  if (totalChars > siteConfig.demoLimits.maxTotalChars) {
    return cannedStream(
      'Ese mensaje es demasiado largo para el demo. Hazme una pregunta más corta sobre el café ☕',
    )
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

  // Tope de longitud del último mensaje del usuario: protege contra prompts enormes.
  const lastUser = [...clientMessages].reverse().find((m) => m.role === 'user')
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
    messages: clientMessages,
    maxTokens: siteConfig.demoLimits.maxOutputTokens,
    temperature: 0.5,
  })

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      // El error completo queda en los logs de Vercel (para depurar), pero al
      // usuario final NO se le filtran detalles del proveedor: mensaje amable.
      console.error('[api/chat] error de streaming:', error)
      return 'Uy, tuve un problema para responder ahora mismo 😅 Intenta de nuevo en un momento.'
    },
  })
}
