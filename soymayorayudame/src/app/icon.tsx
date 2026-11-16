import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

/**
 * Icono de la web: una "S" sobre fondo azul oscuro.
 * Se genera en el servidor para no tener que mantener un fichero PNG.
 */
export default function Icono() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b3d91',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        S
      </div>
    ),
    size,
  )
}
