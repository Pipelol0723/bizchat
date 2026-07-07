// Configuración de BizChat como producto/servicio freelance.
// Esto NO es del negocio demo: son los datos del desarrollador (Andrés) y
// los límites del demo público para proteger el costo de la API key propia.

export const siteConfig = {
  /** Nombre del producto/servicio. */
  productName: 'BizChat',

  /** Desarrollador — se muestra en el lead capture y en el fallback de costo. */
  freelancer: {
    name: 'Andrés Felipe Céspedes',
    whatsapp: '+57 315 376 9636',
    /** Número en formato para enlaces wa.me (sin espacios ni signos). */
    whatsappLink: 'https://wa.me/573153769636',
    email: 'pipelol0723@gmail.com',
  },

  /**
   * Límites del demo público. Como la API key es del desarrollador, estos topes
   * evitan que un visitante (o un bot) queme tokens. Al alcanzarse, el chat
   * redirige al contacto del desarrollador => el límite se vuelve captación de leads.
   */
  demoLimits: {
    /** Máximo de caracteres aceptados por mensaje del usuario. */
    maxInputChars: 500,
    /** Máximo de tokens en la respuesta del modelo. */
    maxOutputTokens: 400,
    /** Mensajes permitidos por sesión/IP antes de redirigir al contacto. */
    maxMessagesPerSession: 12,
    /** Ventana de conteo del rate-limit, en milisegundos (1 hora). */
    windowMs: 60 * 60 * 1000,
  },
} as const

/** Mensaje de cierre que redirige al desarrollador cuando se supera el límite del demo. */
export function demoLimitMessage(): string {
  const { freelancer } = siteConfig
  return (
    '¡Gracias por probar el chatbot! ☕ Este es un demo, así que tiene un límite de mensajes.\n\n' +
    `Si quieres un asistente como este para tu negocio, hablemos:\n` +
    `• WhatsApp: ${freelancer.whatsapp}\n` +
    `• Correo: ${freelancer.email}\n\n` +
    `— ${freelancer.name}`
  )
}
