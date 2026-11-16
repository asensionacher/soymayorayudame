'use client'

import { useCallback, useSyncExternalStore } from 'react'

type Tema = 'claro' | 'oscuro'

const CLAVE_TEMA = 'sma:tema'
const CLAVE_TAMANO = 'sma:tamano'

const TAMANOS = [
  { id: 'normal', etiqueta: 'Normal', valor: '1.1875rem' },
  { id: 'grande', etiqueta: 'Grande', valor: '1.375rem' },
  { id: 'muy-grande', etiqueta: 'Muy grande', valor: '1.625rem' },
] as const
type IdTamano = (typeof TAMANOS)[number]['id']

/**
 * Los ajustes de tema y de letra viven en el localStorage, fuera de React.
 *
 * Se leen con useSyncExternalStore porque es la forma correcta de
 * tomar estado de una fuente externa: React se encarga de mantener
 * el servidor y el cliente en paz y no hace falta un useEffect con
 * setState dentro (que provoca renderizados en cascada).
 *
 * Los valores se guardan también en el atributo `data-` del <html>,
 * que es lo que lee el script que se ejecuta antes de pintar la
 * página (ver src/app/layout.tsx).
 */

const listeners = new Set<() => void>()

function emitir() {
  listeners.forEach((escuchar) => escuchar())
}

function suscribir(escuchar: () => void) {
  listeners.add(escuchar)
  return () => listeners.delete(escuchar)
}

function leer(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

/** Valor por defecto antes de que el navegador diga qué quiere. */
function valorServidor(): string {
  return 'claro'
}

/** Tema inicial: lo guardado, o lo que prefiera el sistema. */
function temaInicial(): Tema {
  const guardado = leer(CLAVE_TEMA)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'oscuro'
  }
  return 'claro'
}

/** Tamaño inicial: lo guardado, o "normal". */
function tamanoInicial(): IdTamano {
  const guardado = leer(CLAVE_TAMANO)
  if (guardado && TAMANOS.some((t) => t.id === guardado)) return guardado as IdTamano
  return 'normal'
}

function aplicarTema(tema: Tema) {
  const html = document.documentElement
  html.classList.toggle('dark', tema === 'oscuro')
  html.style.colorScheme = tema
  html.dataset.tema = tema
}

function aplicarTamano(id: IdTamano) {
  const encontrado = TAMANOS.find((t) => t.id === id)
  if (!encontrado) return
  document.documentElement.style.setProperty('--tamano-letra', encontrado.valor)
  document.documentElement.dataset.tamano = id
}

export function ControlesAccesibilidad() {
  const tema = useSyncExternalStore(
    suscribir,
    temaInicial,
    valorServidor,
  ) as Tema

  const tamano = useSyncExternalStore(
    suscribir,
    tamanoInicial,
    () => 'normal',
  ) as IdTamano

  const cambiarTema = useCallback(() => {
    const nuevo: Tema = tema === 'claro' ? 'oscuro' : 'claro'
    localStorage.setItem(CLAVE_TEMA, nuevo)
    aplicarTema(nuevo)
    emitir()
  }, [tema])

  const cambiarTamano = useCallback((id: IdTamano) => {
    localStorage.setItem(CLAVE_TAMANO, id)
    aplicarTamano(id)
    emitir()
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span id="etiqueta-tamano" className="text-sm font-semibold">
          Letra:
        </span>
        <div role="group" aria-labelledby="etiqueta-tamano" className="flex flex-wrap gap-1">
          {TAMANOS.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              onClick={() => cambiarTamano(opcion.id)}
              aria-pressed={tamano === opcion.id}
              className={`min-h-11 cursor-pointer rounded-md border-2 px-3 text-sm font-semibold ${
                tamano === opcion.id
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]'
                  : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]'
              }`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={cambiarTema}
        className="boton boton--secundario min-h-11 px-4 py-2 text-base"
      >
        {tema === 'claro' ? <IconoLuna /> : <IconoSol />}
        <span>{tema === 'claro' ? 'Ver en oscuro' : 'Ver en claro'}</span>
      </button>
    </div>
  )
}

/** Botón para imprimir o guardar el tutorial en PDF. */
export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="boton boton--secundario min-h-11 px-4 py-2 text-base"
    >
      <IconoImpresora />
      <span>Imprimir o guardar en PDF</span>
    </button>
  )
}

/** Luna: se pincha para pasar a modo oscuro. */
function IconoLuna() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/** Sol: se pincha para pasar a modo claro. */
function IconoSol() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

/** Impresora. */
function IconoImpresora() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}
