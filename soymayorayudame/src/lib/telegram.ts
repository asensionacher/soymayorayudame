/**
 * Envío de mensajes al grupo de Telegram de los voluntarios.
 *
 * Se usa la API HTTP de Telegram directamente (sin librerías) porque
 * sólo hace falta una llamada y así no se añade una dependencia al
 * proyecto.
 *
 * Las credenciales se leen de variables de entorno:
 *   TELEGRAM_API_KEY   Token del bot que envía los mensajes.
 *   TELEGRAM_CHAT_ID   Id del grupo de destino (suele empezar por -100).
 */

const API_TELEGRAM = 'https://api.telegram.org'

export type PreferenciaContacto = 'whatsapp' | 'email' | 'telefono'

export type Solicitud = {
  nombre: string
  apellidos: string
  telefono: string
  email: string
  necesita: string
  preferenciaContacto: PreferenciaContacto
}

/** Texto legible de cada preferencia de contacto. */
const TEXTO_PREFERENCIA: Record<PreferenciaContacto, string> = {
  whatsapp: 'WhatsApp',
  email: 'Correo electrónico',
  telefono: 'Teléfono (que le llamen o le escriban, según la persona que lo atienda)',
}

/**
 * Construye el texto del mensaje que verá el grupo de voluntarios.
 *
 * Se manda como texto plano, sin formato de Telegram, para que se
 * vea igual en cualquier cliente y no dependa de que el parseo de
 * Markdown haga cosas raras con los acentos.
 */
export function construirMensaje(solicitud: Solicitud): string {
  const lineas = [
    'Nueva solicitud de ayuda',
    '',
    `Nombre: ${solicitud.nombre}`,
    `Apellidos: ${solicitud.apellidos}`,
    `Teléfono: ${solicitud.telefono}`,
    `Correo electrónico: ${solicitud.email}`,
    '',
    'Qué necesita:',
    solicitud.necesita,
    '',
    `Prefiere que le contacten por: ${TEXTO_PREFERENCIA[solicitud.preferenciaContacto]}`,
  ]

  return lineas.join('\n')
}

export type ResultadoEnvio =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Envía el mensaje al grupo de Telegram.
 *
 * No lanza excepciones: devuelve un resultado con el error para que
 * quien llama lo pueda mostrar a la persona sin站起身来.
 */
export async function enviarATelegram(solicitud: Solicitud): Promise<ResultadoEnvio> {
  const token = process.env.TELEGRAM_API_KEY?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token) {
    return { ok: false, error: 'Falta configurar el token del bot de Telegram.' }
  }
  if (!chatId) {
    return { ok: false, error: 'Falta configurar el grupo de Telegram de destino.' }
  }

  const texto = construirMensaje(solicitud)

  try {
    const respuesta = await fetch(`${API_TELEGRAM}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: texto,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '')
      console.error(
        `[telegram] La API devolvio ${respuesta.status}: ${detalle.slice(0, 300)}`,
      )
      return { ok: false, error: 'No hemos podido avisar al grupo de voluntarios.' }
    }

    return { ok: true }
  } catch (error) {
    console.error('[telegram] Error al enviar el mensaje:', error)
    return { ok: false, error: 'No hemos podido avisar al grupo de voluntarios.' }
  }
}
