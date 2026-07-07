# BizChat — Chatbot con IA para negocios

Widget de chatbot configurable con IA multi-proveedor (OpenAI, Claude, Gemini) que cualquier
negocio puede embeber en su sitio web. El dueño define su negocio en un solo archivo y el bot
responde a los clientes con contexto real: menú, horarios, servicios, ubicación y reservas.

### 🔗 [Ver demo en vivo →](https://bizchat-delta.vercel.app)

**Demo:** _Café Noire_ — una cafetería ficticia (negocio de demostración) con menú, horarios y reservas.
Abre el sitio, toca cualquier pregunta del hero y el asistente responde en streaming.

> Proyecto de portafolio freelance de **Andrés Felipe Céspedes**.

---

## ✨ Características

- 💬 **Widget flotante** embebible (botón → panel de chat).
- ⚡ **Respuestas en streaming** (el texto aparece progresivamente).
- 🧠 **Multi-proveedor**: OpenAI, Anthropic (Claude) y Google (Gemini) con la misma API.
- 🏪 **Configurable por negocio** desde un único archivo (`business-config.ts`).
- 🛡️ **Guardrails**: el bot solo habla del negocio, no inventa datos ni revela su prompt.
- 💸 **Control de costos**: límite de longitud, tope de tokens y rate-limit por IP. Al superar el
  límite, el chat redirige al contacto del desarrollador → el tope se vuelve captación de leads.
- 📱 **Responsive**: panel lateral en desktop, bottom-sheet en móvil.

---

## 🧱 Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript (estricto) |
| Estilos | Tailwind CSS |
| IA | Vercel AI SDK (`ai`) + `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google` |
| Deploy | Vercel |

---

## 🚀 Cómo correr en local

```bash
npm install
cp .env.example .env.local   # y agrega al menos una API key
npm run dev                  # http://localhost:3000
```

Basta con configurar **una** API key. El proveedor por defecto es Claude (`DEFAULT_PROVIDER=anthropic`).

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_KEY` | Key de OpenAI (opcional) |
| `ANTHROPIC_API_KEY` | Key de Anthropic / Claude (opcional) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Key de Google / Gemini (opcional) |
| `DEFAULT_PROVIDER` | `openai` \| `anthropic` \| `google` |

---

## 🗂️ Estructura

```
src/
├── app/
│   ├── page.tsx              # Landing del demo (Café Noire) + widget
│   ├── layout.tsx            # Fuentes (Marcellus + Karla) y metadata
│   └── api/chat/route.ts     # POST /api/chat — multi-proveedor + guardrails + topes
├── components/
│   ├── ChatWidget.tsx        # Botón flotante + panel (useChat)
│   ├── ChatMessages.tsx      # Lista de mensajes, estado vacío, typing
│   ├── ChatInput.tsx         # Input + enviar
│   ├── ProviderSelector.tsx  # Menú ⋯ (motor de IA + reiniciar)
│   ├── ChatProvider.tsx      # Contexto: abrir chat / enviar pregunta desde la landing
│   └── demo/                 # Secciones de la landing (hero, menú, CTA, lead capture, footer)
├── lib/
│   ├── business-config.ts    # Config del negocio demo + system prompt
│   ├── site-config.ts        # Datos del desarrollador + límites del demo
│   ├── providers.ts          # Modelos por proveedor (servidor)
│   ├── provider-meta.ts      # Etiquetas de proveedor (cliente)
│   └── rate-limit.ts         # Rate-limit en memoria por IP
└── types/index.ts            # Tipos compartidos
```

---

## 🔧 Adaptar a otro negocio

Edita **`src/lib/business-config.ts`**: nombre, bot, servicios, menú, horario, ubicación, WiFi,
contacto, tono y preguntas sugeridas. El system prompt y toda la UI se actualizan solos.

---

## ☁️ Deploy

```bash
npx vercel
```

Agrega las API keys en **Vercel → Settings → Environment Variables** (no en el repo).

---

_Construido por Andrés Felipe Céspedes · [WhatsApp](https://wa.me/573153769636) · pipelol0723@gmail.com_
