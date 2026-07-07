// Tipos compartidos de BizChat

/** Proveedores de IA soportados por el API route. */
export type Provider = 'openai' | 'anthropic' | 'google'

/** Configuración completa de un negocio para inyectar en el system prompt. */
export interface BusinessConfig {
  name: string
  botName: string
  description: string
  services: string[]
  menu: MenuItem[]
  hours: Record<string, string>
  location: string
  wifi: string
  /** Contacto del negocio (para reservas/atención humana dentro del bot). */
  contact: string
  tone: string
  welcomeMessage: string
  suggestedQuestions: SuggestedQuestion[]
}

/** Item del menú del negocio demo. */
export interface MenuItem {
  name: string
  description: string
  /** Precio ya formateado en COP, p. ej. "$11.000". */
  price: string
  /** Ruta de la foto en /public (p. ej. "/menu/v60.jpg"). Si falta el archivo,
   *  la UI cae automáticamente a un degradado. */
  image: string
}

/** Pregunta sugerida: la etiqueta corta del chip y el texto que se envía. */
export interface SuggestedQuestion {
  label: string
  question: string
}
