import Link from 'next/link'
import { ControlesAccesibilidad } from './ControlesAccesibilidad'

export function Cabecera() {
  return (
    <header className="border-b-2 border-[var(--border)] bg-[var(--surface)]">
      <div className="contenedor flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline"
            aria-label="Soy Mayor Ayúdame, ir a la página de inicio"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-2xl font-bold text-[var(--accent-text)]"
            >
              S
            </span>
            <span className="text-xl font-bold leading-tight text-[var(--text)] sm:text-2xl">
              Soy Mayor Ayúdame
            </span>
          </Link>

          <nav aria-label="Navegación principal">
            <ul className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/#pedir-ayuda"
                  className="inline-flex min-h-11 items-center rounded-md px-4 py-2 text-lg font-semibold text-[var(--text)] underline hover:bg-[var(--bg-subtle)]"
                >
                  Pedir ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda"
                  className="inline-flex min-h-11 items-center rounded-md px-4 py-2 text-lg font-semibold text-[var(--text)] underline hover:bg-[var(--bg-subtle)]"
                >
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t-2 border-[var(--border)] pt-3">
          <ControlesAccesibilidad />
        </div>
      </div>
    </header>
  )
}
