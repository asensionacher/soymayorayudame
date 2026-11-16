import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo funciona',
  description:
    'Cómo trabajamos los voluntarios, qué podemos hacer por usted y qué no, y cómo pedir ayuda.',
}

export default function PaginaAyuda() {
  return (
    <div className="contenedor max-w-3xl py-10">
      <h1 className="text-3xl md:text-4xl">Cómo funciona</h1>

      <div className="mt-8 space-y-10 text-lg">
        <section>
          <h2 className="text-2xl">Paso a paso</h2>
          <ol className="mt-4 space-y-4">
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-strong)] font-bold"
              >
                1
              </span>
              <span>
                Usted rellena el formulario de esta web y nos cuenta qué necesita. No hace falta
                que use palabras técnicas: cuéntenlo como se lo contaría a un vecino.
              </span>
            </li>
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-strong)] font-bold"
              >
                2
              </span>
              <span>
                Su petición llega al grupo de voluntarios. Uno de nosotros la ve y la coge.
              </span>
            </li>
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-strong)] font-bold"
              >
                3
              </span>
              <span>
                Le escribimos o le llamamos por la vía que usted haya elegido, para concertar una
                hora y ver cómo hacerlo.
              </span>
            </li>
            <li className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-strong)] font-bold"
              >
                4
              </span>
              <span>
                Le acompañamos. Vamos paso a paso, le explicamos lo que aparece en la pantalla y
                usted decide en todo momento. Al final, usted es quien firma y acepta.
              </span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl">En qué podemos ayudarle</h2>
          <ul className="mt-4 space-y-2">
            <li>Renovar el DNI o la tarjeta sanitaria.</li>
            <li>Pedir cita en el centro de salud o en el hospital.</li>
            <li>Entender un aviso del banco, de la Seguridad Social o de la administración.</li>
            <li>Rellenar formularios y presentar solicitudes.</li>
            <li>Entender qué dice un documento o una carta que no entiende.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">En qué no podemos ayudarle</h2>
          <p className="mt-3">
            Aunque queramos, hay cosas que no nos corresponden:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>No damos una respuesta oficial.</strong> Si necesita un certificado con
              valor oficial o una resolución, eso lo tiene que emitir el organismo.
            </li>
            <li>
              <strong>No damos asesoramiento legal ni fiscal.</strong> Para eso hay abogado y
              gestores, y no podemos sustituirles.
            </li>
            <li>
              <strong>No diagnosticamos su salud.</strong> Si tiene una cita médica o un
              resultado, eso lo explica su médico, no nosotros.
            </li>
            <li>
              <strong>No gestionamos su dinero.</strong> Nunca le pediremos que nos dé su número
              de tarjeta ni sus claves, ni que nos haga una transferencia.
            </li>
            <li>
              <strong>No hay un horario de atención.</strong> Somos voluntarios: puede que
              tardemos unos días en contestarle.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Cuándo no podemos aceptar una petición</h2>
          <p className="mt-3">
            A veces el volumen de peticiones es demasiado grande o el trámite no es apto. En ese
            caso le diremos con franqueza que no podemos hacerlo y, si podemos, le orientaremos
            hacia el teléfono oficial del organismo o hacia un servicio de atención presencial.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Cómo leer esta web</h2>
          <p className="mt-3">
            Arriba, a la derecha, hay dos mandos:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Letra:</strong> puede poner la letra normal, grande o muy grande. Elija la
              que le resulte más cómoda de leer.
            </li>
            <li>
              <strong>Claro u oscuro:</strong> si le molesta la luz de la pantalla, puede poner la
              web en fondo negro con letras blancas. Su elección se guarda y se mantiene la próxima
              vez que entre.
            </li>
          </ul>
          <p className="mt-3">
            Puede usar esta web sin ratón: con el tabulador va pasando de un sitio a otro y con la
            tecla Intro o espacio activa los botones.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t-2 border-[var(--border)] pt-8 sm:flex-row">
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
