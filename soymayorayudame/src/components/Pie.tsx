import Link from 'next/link'

export function Pie() {
  return (
    <footer className="mt-16 border-t-2 border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="contenedor flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold">Soy Mayor Ayúdame</p>
          <p className="text-base text-[var(--text-muted)]">
            Un grupo de voluntarios que ayuda a hacer trámites por internet. No cobramos nada.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="text-base underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#pedir-ayuda" className="text-base underline">
                Pedir ayuda
              </Link>
            </li>
            <li>
              <Link href="/ayuda" className="text-base underline">
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="text-base underline">
                Privacidad
              </Link>
            </li>
          </ul>
        </nav>

        <p className="text-base text-[var(--text-muted)]">
          Es un trabajo voluntario. No somos un servicio oficial ni representamos a ningún
          organismo público.
        </p>
      </div>
    </footer>
  )
}
