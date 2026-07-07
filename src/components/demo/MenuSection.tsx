import { businessConfig } from '@/lib/business-config'
import { MenuPhoto } from '@/components/demo/MenuPhoto'

// Sección de menú del demo (Server Component). Cada item usa su foto de
// /public/menu; si aún no existe, MenuPhoto cae a un degradado.
export function MenuSection() {
  return (
    <section className="bg-cream px-6 pb-24 pt-[88px] text-coffee-dark">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-[52px] text-center">
          <p className="text-xs font-bold tracking-[0.4em] text-accent-dark">NUESTRO MENÚ</p>
          <h2 className="mt-3.5 font-serif text-[clamp(32px,4vw,46px)] font-normal">
            Tostado esta mañana
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
          {businessConfig.menu.map((item) => (
            <article key={item.name} className="flex flex-col gap-3.5">
              <MenuPhoto src={item.image} alt={item.name} />
              <div className="flex items-baseline justify-between gap-3 border-b border-coffee-dark/15 pb-3">
                <div>
                  <h3 className="font-serif text-[21px]">{item.name}</h3>
                  <p className="mt-0.5 text-sm text-coffee-dark/55">{item.description}</p>
                </div>
                <span className="whitespace-nowrap font-bold text-accent-dark">{item.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
