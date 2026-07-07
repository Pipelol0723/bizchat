'use client'

import { useChatPanel } from '@/components/ChatProvider'
import { businessConfig } from '@/lib/business-config'

/** Segundo punto de entrada al chat: "¿Tienes preguntas?". */
export function QuestionsCta() {
  const { open } = useChatPanel()

  return (
    <section className="bg-coffee px-6 py-[88px] text-center">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-[18px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl">
          ☕
        </div>
        <h2 className="font-serif text-[clamp(30px,4vw,42px)] font-normal">¿Tienes preguntas?</h2>
        <p className="text-[17px] leading-relaxed text-cream/60">
          {businessConfig.botName} conoce el menú, los horarios y cómo reservar. Responde al
          instante, a cualquier hora.
        </p>
        <button
          onClick={open}
          className="mt-2 rounded-full bg-accent px-8 py-[15px] text-base font-bold text-coffee-dark transition-colors hover:bg-accent-light"
        >
          Chatea con {businessConfig.botName}
        </button>
      </div>
    </section>
  )
}
