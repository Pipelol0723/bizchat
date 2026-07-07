'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/site-config'

// Sección de captación (marca BizChat, no Café Noire). Explica que el chat de
// arriba es un demo y convierte al visitante interesado en un lead: arma un
// mensaje de WhatsApp/correo prellenado hacia el desarrollador. Sin backend.
export function LeadCapture() {
  const { freelancer, productName } = siteConfig
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')

  const summary = `Hola ${freelancer.name.split(' ')[0]}, vi el demo de ${productName} y quiero un chatbot para mi negocio.${
    name ? `\nSoy ${name}.` : ''
  }${business ? `\nMi negocio: ${business}.` : ''}`

  const whatsappHref = `${freelancer.whatsappLink}?text=${encodeURIComponent(summary)}`
  const emailHref = `mailto:${freelancer.email}?subject=${encodeURIComponent(
    `Quiero un chatbot ${productName} para mi negocio`,
  )}&body=${encodeURIComponent(summary)}`

  return (
    <section className="border-t border-cream/10 bg-hero px-6 py-24 text-center">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-5">
        <p className="text-[13px] font-semibold tracking-[0.3em] text-accent">
          ¿TE GUSTÓ ESTE CHATBOT?
        </p>
        <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-normal text-cream">
          Puedo montar uno igual para tu negocio
        </h2>
        <p className="max-w-[460px] text-[16px] leading-relaxed text-cream/60">
          {productName} se adapta a restaurantes, cafeterías, tiendas y más. Cuéntame de tu negocio
          y hablamos.
        </p>

        <div className="mt-2 flex w-full max-w-[420px] flex-col gap-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-[15px] text-cream outline-none placeholder:text-cream/35 focus:border-accent"
          />
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Tu negocio (ej. cafetería, tienda…)"
            className="rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-[15px] text-cream outline-none placeholder:text-cream/35 focus:border-accent"
          />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-8 py-[15px] text-base font-bold text-coffee-dark transition-colors hover:bg-accent-light"
          >
            Escríbeme por WhatsApp
          </a>
          <a
            href={emailHref}
            className="text-[14px] text-cream/55 transition-colors hover:text-accent"
          >
            o por correo: {freelancer.email}
          </a>
        </div>
      </div>
    </section>
  )
}
