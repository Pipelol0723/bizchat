import { siteConfig } from '@/lib/site-config'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate-limit por IP para proteger la API key del demo público.
//
// En producción usa Upstash Redis (store compartido entre todas las instancias
// serverless), configurado por las variables KV_REST_API_URL / KV_REST_API_TOKEN
// que Vercel inyecta al conectar la base. Si esas variables no están (p. ej. en
// desarrollo local), cae a un contador en memoria por instancia — best-effort,
// suficiente para probar en local; el demo nunca se rompe por falta de Redis.

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/**
 * Obtiene un identificador de cliente a partir de las cabeceras del request.
 *
 * En Vercel, `x-real-ip` lo fija la plataforma con la IP real del visitante y no
 * es falsificable. `x-forwarded-for` SÍ es manipulable: su primer valor lo pone
 * el propio cliente, así que tomarlo permitiría evadir el rate-limit rotándolo.
 * Por eso se prefiere `x-real-ip` y solo se usa `x-forwarded-for` como respaldo,
 * tomando el ÚLTIMO salto (el que añade el proxy de confianza), no el primero.
 */
export function clientKey(req: Request): string {
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    const hops = fwd.split(',').map((h) => h.trim()).filter(Boolean)
    if (hops.length > 0) return hops[hops.length - 1]
  }
  return 'anonymous'
}

// Instancia perezosa de Upstash: se crea una sola vez por instancia serverless.
// `null` = Redis no configurado → se usa el respaldo en memoria.
let ratelimiter: Ratelimit | null | undefined
function getRatelimiter(): Ratelimit | null {
  if (ratelimiter !== undefined) return ratelimiter

  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    ratelimiter = null
    return ratelimiter
  }

  const { maxMessagesPerSession, windowMs } = siteConfig.demoLimits
  ratelimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.fixedWindow(maxMessagesPerSession, `${windowMs} ms`),
    prefix: 'bizchat:rl',
  })
  return ratelimiter
}

/** Respaldo en memoria (solo cuando Upstash no está configurado). */
function checkRateLimitInMemory(key: string): { allowed: boolean; remaining: number } {
  const { maxMessagesPerSession, windowMs } = siteConfig.demoLimits
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxMessagesPerSession - 1 }
  }

  if (bucket.count >= maxMessagesPerSession) {
    return { allowed: false, remaining: 0 }
  }

  bucket.count += 1
  return { allowed: true, remaining: maxMessagesPerSession - bucket.count }
}

/**
 * Registra un mensaje para la IP y devuelve si aún está dentro del límite.
 * `allowed: false` significa que debe redirigirse al contacto del desarrollador.
 */
export async function checkRateLimit(
  key: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getRatelimiter()
  if (!limiter) return checkRateLimitInMemory(key)

  try {
    const { success, remaining } = await limiter.limit(key)
    return { allowed: success, remaining }
  } catch (error) {
    // Si Redis falla (red, cuota), no se bloquea al usuario: se cae al respaldo.
    console.error('[rate-limit] Upstash no disponible, usando respaldo en memoria:', error)
    return checkRateLimitInMemory(key)
  }
}
