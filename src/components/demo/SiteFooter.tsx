import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="bg-footer px-6 py-9 text-center text-sm text-cream/45">
      <p className="font-serif text-lg tracking-[0.14em] text-cream/80">CAFÉ NOIRE</p>
      <p className="mt-2.5">
        Negocio ficticio de demostración · Lun–Sáb 7am–9pm · Dom 8am–6pm
      </p>
      <p className="mt-3.5 text-xs text-cream/30">
        Demo de <span className="text-accent">{siteConfig.productName}</span> — chatbot con IA para
        negocios · {siteConfig.freelancer.name}
      </p>
    </footer>
  )
}
