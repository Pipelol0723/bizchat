'use client'

import Image from 'next/image'
import { useState } from 'react'

// Foto de un item del menú. Si el archivo no existe todavía en /public/menu,
// la imagen falla al cargar y caemos a un degradado (el demo nunca se ve roto).
const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #2b1d15 0%, #4a3527 55%, #a06a2c 100%)'

export function MenuPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="h-[210px] w-full rounded" style={{ background: FALLBACK_GRADIENT }} aria-hidden />
    )
  }

  return (
    <div className="relative h-[210px] w-full overflow-hidden rounded">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 340px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
