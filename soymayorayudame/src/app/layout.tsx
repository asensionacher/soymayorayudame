import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Cabecera } from '@/components/Cabecera'
import { Pie } from '@/components/Pie'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://soymayorayudame.es'),
  title: {
    default: 'Soy Mayor Ayúdame — Un grupo de voluntarios que le ayuda con sus trámites',
    template: '%s | Soy Mayor Ayúdame',
  },
  description:
    'Somos un grupo de voluntarios que ayudamos a personas mayores y con dificultades a hacer sus trámites por internet. Pídanos ayuda: es gratis y le acompañamos paso a paso.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Soy Mayor Ayúdame',
    title: 'Soy Mayor Ayúdame — Un grupo de voluntarios que le ayuda con sus trámites',
    description:
      'Somos un grupo de voluntarios que ayudamos a personas mayores y con dificultades a hacer sus trámites por internet. Pídanos ayuda: es gratis.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Aplica el tema guardado antes de que se pinte la página.
 * Sin esto, quien usa modo oscuro vería un destello blanco al cargar.
 */
const scriptTema = `
(function () {
  try {
    var guardado = localStorage.getItem('sma:tema');
    var oscuro = guardado ? guardado === 'oscuro'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (oscuro) document.documentElement.classList.add('dark');
    var tamano = localStorage.getItem('sma:tamano');
    if (tamano === 'grande') document.documentElement.style.setProperty('--tamano-letra', '1.375rem');
    if (tamano === 'muy-grande') document.documentElement.style.setProperty('--tamano-letra', '1.625rem');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col`}>
        <a href="#contenido" className="saltar-contenido">
          Saltar al contenido principal
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Pie />
      </body>
    </html>
  )
}
