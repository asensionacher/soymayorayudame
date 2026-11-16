'use client'

import { useState } from 'react'

type Preferencia = 'whatsapp' | 'email' | 'telefono'

type Props = {
  onEnviado?: () => void
}

type Errores = Partial<Record<'nombre' | 'apellidos' | 'telefono' | 'email' | 'necesita' | 'preferenciaContacto', string>>

const PREFERENCIAS: Array<{ valor: Preferencia; etiqueta: string; ayuda: string }> = [
  {
    valor: 'whatsapp',
    etiqueta: 'Por WhatsApp',
    ayuda: 'Le escribimos un WhatsApp al número que nos ha dado.',
  },
  {
    valor: 'email',
    etiqueta: 'Por correo electrónico',
    ayuda: 'Le escribimos un correo a la dirección que nos ha dado.',
  },
  {
    valor: 'telefono',
    etiqueta: 'Por teléfono',
    ayuda:
      'Le llamamos al número que nos ha dado. Según qué persona lo atienda, puede que le llame o que le escriba por WhatsApp.',
  },
]

export function FormularioSolicitud({ onEnviado }: Props) {
  const [errores, setErrores] = useState<Errores>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [preferencia, setPreferencia] = useState<Preferencia>('whatsapp')

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErrores({})
    setErrorGeneral(null)
    setEnviando(true)

    const datos = new FormData(evento.currentTarget)

    try {
      const respuesta = await fetch('/api/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datos.get('nombre'),
          apellidos: datos.get('apellidos'),
          telefono: datos.get('telefono'),
          email: datos.get('email'),
          necesita: datos.get('necesita'),
          preferenciaContacto: preferencia,
        }),
      })

      const cuerpo = await respuesta.json()

      if (!respuesta.ok) {
        if (cuerpo.errores) {
          setErrores(cuerpo.errores)
          // Lleva el foco al primer campo con error para que no tenga
          // que buscarlo con la vista.
          const primero = Object.keys(cuerpo.errores)[0]
          const elemento = document.querySelector<HTMLElement>(`[name="${primero}"]`)
          elemento?.focus()
        }
        setErrorGeneral(cuerpo.error ?? 'No hemos podido enviar el formulario.')
        return
      }

      setEnviado(true)
      onEnviado?.()
    } catch {
      setErrorGeneral(
        'No hemos podido enviar el formulario. Compruebe su conexión y vuelva a intentarlo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div
        className="tarjeta border-[var(--success)] bg-[var(--success)]/10 p-8 text-center"
        role="status"
      >
        <p className="text-2xl font-bold text-[var(--text)]">Gracias, hemos recibido su petición</p>
        <p className="mt-4 text-lg text-[var(--text-muted)]">
          Un voluntario del grupo lo verá y se pondrá en contacto con usted por la vía que ha
          elegido. En cuanto le escribamos, ya le ayudaremos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-8">
      {errorGeneral && (
        <p
          className="aviso aviso--error text-lg"
          role="alert"
        >
          {errorGeneral}
        </p>
      )}

      <fieldset className="space-y-8">
        <legend className="text-xl font-bold">Sus datos</legend>

        <Campo
          id="nombre"
          nombre="nombre"
          etiqueta="Nombre"
          ayuda="Sólo su nombre, por favor."
          error={errores.nombre}
          autoComplete="given-name"
        />

        <Campo
          id="apellidos"
          nombre="apellidos"
          etiqueta="Apellidos"
          error={errores.apellidos}
          autoComplete="family-name"
        />

        <Campo
          id="telefono"
          nombre="telefono"
          etiqueta="Teléfono"
          ayuda="Un número al que podamos llamarle o escribirle."
          error={errores.telefono}
          tipo="tel"
          autoComplete="tel"
          placeholder="600 00 00 00"
        />

        <Campo
          id="email"
          nombre="email"
          etiqueta="Correo electrónico"
          ayuda="Una dirección donde podamos escribirle."
          error={errores.email}
          tipo="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-xl font-bold">Qué necesita</legend>

        <div>
          <label htmlFor="necesita" className="block text-lg font-bold">
            Cuéntelo con sus palabras
          </label>
          <p id="necesita-ayuda" className="mt-1 text-base text-[var(--text-muted)]">
            Por ejemplo: renovar el DNI por internet, pedir cita en el centro de salud, entender un
            aviso del banco. No hace falta que use palabras técnicas, cuéntenlo con sus palabras.
          </p>
          <textarea
            id="necesita"
            name="necesita"
            rows={6}
            required
            aria-describedby="necesita-ayuda"
            aria-invalid={errores.necesita ? 'true' : undefined}
            className={`mt-2 w-full rounded-lg border-2 bg-[var(--surface)] p-4 text-lg text-[var(--text)] ${
              errores.necesita ? 'border-[var(--danger)]' : 'border-[var(--border-strong)]'
            }`}
          />
          {errores.necesita && (
            <p className="mt-2 text-base font-semibold text-[var(--danger)]" role="alert">
              {errores.necesita}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xl font-bold">Cómo prefiere que le contactemos</legend>

        <div className="space-y-3">
          {PREFERENCIAS.map((opcion) => (
            <label
              key={opcion.valor}
              className="flex cursor-pointer gap-4 rounded-lg border-2 border-[var(--border-strong)] bg-[var(--surface)] p-4 has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-subtle)]"
            >
              <input
                type="radio"
                name="preferenciaContacto"
                value={opcion.valor}
                checked={preferencia === opcion.valor}
                onChange={() => setPreferencia(opcion.valor)}
                className="mt-1 h-6 w-6 shrink-0 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-lg font-bold">{opcion.etiqueta}</span>
                <span className="mt-1 block text-base text-[var(--text-muted)]">
                  {opcion.ayuda}
                </span>
              </span>
            </label>
          ))}
        </div>

        {errores.preferenciaContacto && (
          <p className="text-base font-semibold text-[var(--danger)]" role="alert">
            {errores.preferenciaContacto}
          </p>
        )}
      </fieldset>

      <div className="border-t-2 border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={enviando}
          className="boton boton--primario boton--grande"
        >
          {enviando ? 'Enviando…' : 'Enviar mi petición'}
        </button>

        <p className="mt-4 text-base text-[var(--text-muted)]">
          Al enviar el formulario acepta que usemos sus datos para contactarle y ayudarle. No los
          guardamos en esta web: sólo se envían al grupo de voluntarios.
        </p>
      </div>
    </form>
  )
}

type CampoProps = {
  id: string
  nombre: string
  etiqueta: string
  error?: string
  ayuda?: string
  tipo?: string
  autoComplete?: string
  placeholder?: string
}

/** Un campo del formulario con su etiqueta, su ayuda y su error. */
function Campo({
  id,
  nombre,
  etiqueta,
  error,
  ayuda,
  tipo = 'text',
  autoComplete,
  placeholder,
}: CampoProps) {
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`

  const describedBy = [ayuda ? idAyuda : null, error ? idError : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <label htmlFor={id} className="block text-lg font-bold">
        {etiqueta}
      </label>

      {ayuda && (
        <p id={idAyuda} className="mt-1 text-base text-[var(--text-muted)]">
          {ayuda}
        </p>
      )}

      <input
        id={id}
        name={nombre}
        type={tipo}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : undefined}
        className={`mt-2 w-full rounded-lg border-2 bg-[var(--surface)] p-4 text-lg text-[var(--text)] ${
          error ? 'border-[var(--danger)]' : 'border-[var(--border-strong)]'
        }`}
      />

      {error && (
        <p id={idError} className="mt-2 text-base font-semibold text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
