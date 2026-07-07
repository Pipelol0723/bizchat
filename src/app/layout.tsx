import type { Metadata } from 'next'
import { Marcellus, Karla } from 'next/font/google'
import './globals.css'

// Marcellus (serif) para títulos; Karla para cuerpo/UI. Ver design handoff.
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
})
const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-karla',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Café Noire — Café de origen · Demo de BizChat',
  description:
    'Demo de BizChat: un chatbot con IA configurable para negocios. Café Noire es una cafetería ficticia; pregúntale a Noire sobre el menú, horarios y reservas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${marcellus.variable} ${karla.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
