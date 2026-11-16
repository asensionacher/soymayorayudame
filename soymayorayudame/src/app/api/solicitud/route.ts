import { NextResponse } from 'next/server'
import { esquemaSolicitud } from '@/lib/validacion'
import { enviarATelegram } from '@/lib/telegram'

/**
 * Recibe el formulario y avisa al grupo de Telegram de los voluntarios.
 *
 * El POST va con un JSON normal (no FormData) porque el formulario
 * es un componente de React que ya recoge los valores en el cliente.
 */
export async function POST(request: Request) {
  let cuerpo: unknown

  try {
    cuerpo = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No hemos podido leer el formulario. Inténtelo de nuevo.' },
      { status: 400 },
    )
  }

  const resultado = esquemaSolicitud.safeParse(cuerpo)

  if (!resultado.success) {
    const errores: Record<string, string> = {}

    for (const problema of resultado.error.issues) {
      const campo = String(problema.path[0] ?? '')
      if (!errores[campo]) errores[campo] = problema.message
    }

    return NextResponse.json(
      { ok: false, error: 'Revise los campos marcados.', errores },
      { status: 400 },
    )
  }

  const envio = await enviarATelegram(resultado.data)

  if (!envio.ok) {
    return NextResponse.json({ ok: false, error: envio.error }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
