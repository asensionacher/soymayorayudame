import { FormularioSolicitud } from '@/components/FormularioSolicitud'

export default function PaginaInicio() {
  return (
    <>
      <section className="border-b-2 border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="contenedor py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl">
            Somos un grupo de voluntarios que ayudamos a hacer trámites por internet
          </h1>
          <p className="mt-5 max-w-3xl text-xl text-[var(--text-muted)]">
            Si tiene que hacer un trámite en internet y no sabe cómo empezar, o si le ha salido
            un aviso del banco, de la Seguridad Social o del centro de salud y no lo entiende,
            escríbanos. Le ayudamos.
          </p>
        </div>
      </section>

      <div className="contenedor py-12">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Explicación de quiénes somos */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl">Quiénes somos</h2>
              <p className="mt-4 text-lg">
                Somos un grupo de <strong>personas voluntarias</strong>. Nadie nos paga por esto y
                no vendemos nada. Nos dedicamos a ayudar a otras personas a hacer sus trámites por
                internet.
              </p>
              <p className="mt-4 text-lg">
                Lo hacemos porque creemos que no tener que depender de alguien para hacer un trámite
                da mucha tranquilidad, y porque muchas personas lo pasa mal con las webs de la
                administración: están escritas con jerga y cada vez cambian.
              </p>
            </section>

            <section>
              <h2 className="text-2xl">Qué hacemos exactamente</h2>
              <p className="mt-4 text-lg">
                Le ayudamos a <strong>ejecutar las acciones de los trámites por internet</strong>. Por
                ejemplo:
              </p>
              <ul className="mt-4 space-y-3 text-lg">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Renovar el DNI o pedir cita en el centro de salud.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Entender un aviso del banco o de la Seguridad Social.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Rellenar formularios y presentar solicitudes.</span>
                </li>
              </ul>
              <p className="mt-4 text-lg">
                Que le ayudemos con un trámite <strong>no significa que lo hagamos por usted ni que
                estamos de su lado</strong> en todo lo que esa web le pida. Le acompañamos y le
                explicamos cada paso, pero usted decide, firma y acepta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl">Esto es un trabajo voluntario</h2>
              <p className="mt-4 text-lg">
                Conviene que lo tenga claro desde el principio:
              </p>
              <ul className="mt-4 space-y-3 text-lg">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>
                    <strong>No cobramos nada</strong> y no le pediremos nunca dinero ni datos
                    bancarios.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>
                    <strong>No somos un servicio oficial.</strong> No representamos a la Seguridad
                    Social, a la banca, a la Administración ni a ningún organismo público.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>
                    <strong>Es un trabajo que hacemos en nuestro tiempo libre.</strong> Por eso
                    podemos tardar unos días
                    en contestarle, y por eso hay trámites que no podemos aceptar.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>
                    <strong>No respondemos las dudas</strong> sobre la salud, el dinero de la
                    pensión o los límites de su situación legal: eso lo tienen que resolver los
                    organismos oficiales.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl">Qué necesita para que le ayudemos</h2>
              <ul className="mt-4 space-y-3 text-lg">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Su DNI o su tarjeta sanitaria, para poder identificarle.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Un teléfono o un correo electrónico donde podamos escribirle.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-bold">
                    ·
                  </span>
                  <span>Si puede, tener el ordenador o el móvil a mano cuando hablemos.</span>
                </li>
              </ul>
              <p className="mt-4 text-lg">
                <strong>Nunca</strong> le pediremos su número completo de tarjeta, su PIN ni las
                claves de su banco. Si alguna vez se lo piden, no lo dé y díganoslo.
              </p>
            </section>
          </div>

          {/* Formulario */}
          <div className="lg:sticky lg:top-6 lg:self-start" id="pedir-ayuda">
            <div className="tarjeta">
              <h2 className="text-2xl">Cuéntenos qué necesita</h2>
              <p className="mt-2 mb-6 text-lg text-[var(--text-muted)]">
                Rellene este formulario y le escribiremos. No se guarda ningún dato en esta
                web: sólo se envía al grupo de voluntarios.
              </p>

              <FormularioSolicitud />
            </div>

            <p className="mt-6 text-base text-[var(--text-muted)]">
              Si prefiere no usar el formulario, escríbanos a{' '}
              <a href="mailto:contacto@soymayorayudame.es" className="font-semibold underline">
                contacto@soymayorayudame.es
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
