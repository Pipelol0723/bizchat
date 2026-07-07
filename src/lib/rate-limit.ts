import { siteConfig } from '@/lib/site-config'

// Rate-limit en memoria por IP para proteger la API key del demo público.
// Nota: es "best-effort" — el estado vive por instancia del servidor y se
// reinicia en cada despliegue. Suficiente como tope de costo del demo; para
// producción con varios clientes se migraría a un store compartido (p. ej. Upstash).

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Obtiene un identificador de cliente a partir de las cabeceras del request. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'anonymous'
}

/**
 * Registra un mensaje para la IP y devuelve si aún está dentro del límite.
 * `allowed: false` significa que debe redirigirse al contacto del desarrollador.
 */
export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
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
