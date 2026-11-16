import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacidad',
  description: 'Qué datos recoge esta web, dónde se envían y cómo se usan.',
}

export default function PaginaPrivacidad() {
  return (
    <div className="contenedor max-w-3xl py-10">
      <h1 className="text-3xl md:text-4xl">Privacidad</h1>

      <div className="mt-8 space-y-8 text-lg">
        <section>
          <h2 className="text-2xl">Qué datos le pedimos</h2>
          <p className="mt-3">
            En el formulario sólo le pedimos lo justo para poder/le ayudar:
          </p>
          <ul className="mt-3 space-y-2">
            <li>Su nombre y sus apellidos.</li>
            <li>Un teléfono de contacto.</li>
            <li>Un correo electrónico.</li>
            <li>Una descripción de lo que necesita.</li>
            <li>Por qué vía prefiere que le contacten.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Dónde van esos datos</h2>
          <p className="mt-3">
            Al enviar el formulario, sus datos se envían al grupo de Telegram de los voluntarios
            para que puedan ponerse en contacto con usted.
          </p>
          <p className="mt-3">
            <strong>Esta web no guarda su información en ninguna base de datos.</strong> El
            formulario sólo manda el mensaje y se queda con los datos dentro de Telegram, que es
            donde ya trabaja el grupo de voluntarios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Cookies</h2>
          <p className="mt-3">
            No usamos cookies publicitarias ni de seguimiento. En su navegador sólo se guardan dos
            cosas: si prefiere el modo claro o el oscuro, y el tamaño de letra que ha elegido.
            Puede borrarlas en cualquier momento borrando el historial del navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Sus datos en otras webs</h2>
          <p className="mt-3">
            Cuando le ayudamos con un trámite, trabajando en la web oficial correspondiente
            (Seguridad Social, centro de salud, banco...), se aplican las políticas de privacidad
            de ese organismo, no las nuestras. Nosotros no recibimos ni vemos los datos que usted
            escribe allí.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Sus derechos</h2>
          <p className="mt-3">
            Puede pedirnos que borramos su información, que se la rectifiquemos o que no le
            contactemos más. Para eso, escríbanos a{' '}
            <a href="mailto:contacto@soymayorayudame.es" className="font-semibold underline">
              contacto@soymayorayudame.es
            </a>{' '}
            diciendo qué quiere que hagamos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Voluntariado y responsabilidad</h2>
          <p className="mt-3">
            Somos un grupo de voluntarios, no un servicio oficial. Por eso no respondemos de las
            decisiones que se tomen en una web de la administración, y le orientamos siempre
            hacia el organismo que sí tiene competencia.
          </p>
        </section>
      </div>
    </div>
  )
}
