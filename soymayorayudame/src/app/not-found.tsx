import Link from 'next/link'

export default function PaginaNoEncontrada() {
  return (
    <div className="contenedor max-w-2xl py-16">
      <h1 className="text-3xl md:text-4xl">No hemos encontrado esta página</h1>
      <p className="mt-4 text-xl text-[var(--text-muted)]">
        Puede que el enlace esté mal escrito. Vuelva al inicio y pídanos ayuda desde ahí.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link href="/#pedir-ayuda" className="boton boton--primario">
          Pedir ayuda
        </Link>
        <Link href="/" className="boton boton--secundario">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
