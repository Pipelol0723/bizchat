'use client'

import { useChatPanel } from '@/components/ChatProvider'
import { businessConfig } from '@/lib/business-config'

/** Hero de la landing. Cada chip abre el widget con la pregunta ya enviada. */
export function HeroSection() {
  const { ask } = useChatPanel()

  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden bg-hero px-6 pb-[72px] pt-16 text-center">
      <p className="text-[13px] font-semibold tracking-[0.42em] text-accent">
        CAFÉ NOIRE · CAFÉ DE ORIGEN
      </p>
      <h1 className="mt-[22px] max-w-[820px] font-serif text-[clamp(44px,7vw,84px)] font-normal leading-[1.06]">
        Café de origen,
        <br />
        hecho con calma
      </h1>
      <p className="mt-5 max-w-[460px] text-lg leading-relaxed text-cream/60">
        Tostamos en casa, servimos despacio y respondemos tus preguntas al instante — pregúntale a{' '}
        {businessConfig.botName}, nuestro asistente.
      </p>

      <div className="mt-[34px] flex flex-wrap justify-center gap-2.5">
        {businessConfig.suggestedQuestions.map((q) => (
          <button
            key={q.label}
            onClick={() => ask(q.question)}
            className="rounded-full border border-cream/30 bg-cream/5 px-5 py-2.5 text-[15px] font-medium text-cream transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {q.question}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-cream/40">
        ↑ toca una pregunta y {businessConfig.botName} te responde
      </p>
    </section>
  )
}
