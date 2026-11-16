# Soy Mayor Ayúdame

Web de un grupo de **voluntarios** que ayudan a personas mayores y con dificultades a hacer
sus trámites por internet.

La web tiene dos cosas:

1. Una explicación de quiénes somos y en qué podemos ayudar (con todas las luces largas: es
   un trabajo voluntario, no cobramos, no somos un servicio oficial).
2. Un formulario que, al rellenarlo, manda la petición al grupo de Telegram de los
   voluntarios.

## Stack

Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript. Sin base de datos: los datos sólo
viajan al grupo de Telegram.

## Comandos

```bash
npm run dev                  # Servidor de desarrollo en http://localhost:3000
npm run build                # Compilación de producción (incluye tipos)
npm run start                # Servidor de producción
npm run lint                 # ESLint
npm run typecheck            # TypeScript sin emitir
npm run verificar:texto      # Revisa los textos visibles en busca de erratas
npm run verificar:contraste  # Comprueba el contraste de los colores (WCAG AAA)
npm run verificar            # Todas las comprobaciones de golpe
```

## Configuración

Copia el fichero de ejemplo y rellénalo:

```bash
cp .env.example .env
```

| Variable | Qué es |
|----------|--------|
| `TELEGRAM_API_KEY` | Token del bot que manda los mensajes. Lo da [@BotFather](https://t.me/BotFather). |
| `TELEGRAM_CHAT_ID` | Id del grupo de Telegram de destino (empieza por `-100`). |

Para encontrar el `CHAT_ID`: añade el bot al grupo, abre el grupo en el navegador y entra en
`https://api.telegram.org/bot<TELEGRAM_API_KEY>/getUpdates`. Busca el `"chat":{"id":...}` del
grupo.

El fichero `.env` **nunca** se sube al repositorio (está en `.gitignore`). El `.env.example` sí.

## Estructura

```
src/
  app/
    page.tsx                  # Explicación + formulario
    ayuda/page.tsx            # Cómo funciona, paso a paso
    privacidad/page.tsx       # Qué datos se piden y dónde van
    not-found.tsx
    api/solicitud/route.ts    # Recibe el formulario y avisa a Telegram
    icon.tsx                  # Favicon generado
    layout.tsx                # Metadatos, tema inicial y skip-link
    sitemap.ts, robots.ts
  components/
    Cabecera.tsx              # Cabecera con los mandos de accesibilidad
    Pie.tsx
    ControlesAccesibilidad.tsx  # Tema, tamaño de letra e imprimir
    FormularioSolicitud.tsx   # El formulario
  lib/
    telegram.ts               # Envío del mensaje a Telegram
    validacion.ts             # Esquema Zod de los datos del formulario
scripts/
  verificar-texto.mjs         # Detecta texto corrupto en lo que ve el usuario
  verificar-contraste.mjs      # Calcula el contraste de los colores (WCAG)
```

## Cómo funciona el envío

1. El formulario hace `POST /api/solicitud` con un JSON.
2. La route valida los datos con Zod (`src/lib/validacion.ts`). Si algo falla, devuelve un
   `400` con un mensaje por campo, y el formulario lo enseña junto al campo con error.
3. Si todo está bien, `src/lib/telegram.ts` llama a la API de Telegram y manda el mensaje al
   grupo.
4. Si el envío falla, se devuelve un `502` y el formulario muestra un mensaje de error con la
   opción de reintentar. **Los datos de la persona no se guardan en ningún sitio**, así que si
   falla se pierde y hay que volver a rellenar el formulario.

El mensaje que llega al grupo tiene este formato:

```
Nueva solicitud de ayuda

Nombre: María
Apellidos: García López
Teléfono: 600 12 34 56
Correo electrónico: maria.garcia@correo.com

Qué necesita:
Necesito renovar el DNI por internet y no entiendo la página de la sede electrónica.

Prefiere que le contacten por: WhatsApp
```

## Accesibilidad

Es la restricción principal del proyecto. Cualquier cambio que la reduzca es una regresión.

| Decisión | Por qué |
|----------|---------|
| Letra base de 19 px, escala en `em` | Por debajo de 16 px el navegador del móvil hace zoom y rompe la maquetación. El botón de letra escala **todo** de golpe. |
| Contraste **AAA (7:1) o mejor** en los dos temas | Verificado con `npm run verificar:contraste`. |
| Modo claro y oscuro, con botón | Se recuerda la preferencia y se aplica antes del primer pintado, para que no haya destello blanco. |
| Tres tamaños de letra | Uno solo (normal, grande, muy grande) que además se guarda. |
| Botones y campos de 52 px o más | Objetivo de toque de WCAG 2.2 (44x44 px). |
| Foco visible de 3 px en todo | Es la única forma de orientarse con teclado. |
| Enlace a "saltar al contenido" | Quien navega con teclado no tiene que pasar por el menú. |
| Sin emojis ni colores RX | Los colores vivos dificultan la lectura con baja visión o daltonismo. |
| `prefers-reduced-motion` respetado | No se fuerzan animaciones. |
| Estilo de impresión | Imprime en negro sobre blanco, sin mandos, y los enlaces muestran su dirección. |
| Errores junto al campo, no genéricos | Se dice qué está mal y dónde. |

### Contraste

| | Texto normal | Título | Botón primario | Borde | Aviso |
|---|---|---|---|---|---|
| **Claro** | 18.88:1 | 18.88:1 | 10.04:1 | 7.30:1 | 7.72:1 |
| **Oscuro** | 19.80:1 | 18.42:1 | 9.89:1 | 7.30:1 | 11.49:1 |

Si se cambia un color en `globals.css`, hay que actualizar también la lista del script
`scripts/verificar-contraste.mjs`.

## Los textos

**Ejecuta `npm run verificar:texto` después de tocar cualquier texto visible.** Al escribir
castellano largo a mano se cuelan erratas con dos formas típicas:

- Palabras pegadas: `leLeave`, `de laANCEL`, `DNIRenew`.
- Palabras en inglés: `Renew`, `providers`, `Steering`.

El script detecta las dos cosas en los ficheros que ve el usuario final. La documentación
(RREADME, AGENTS) queda fuera porque está en inglés o en castellano técnico.

## Pendiente

- [ ] **Dominio real.** `soymayorayudame.es` está puesto como marcador en `metadataBase`,
      `sitemap.ts` y `robots.ts`. Hay que cambiarlo cuando se sepa el definitivo.
- [ ] **Email de contacto.** `contacto@soymayorayudame.es` aparece en la portada, en la
      página de privacidad y en el pie. También es un marcador.
- [ ] **Antiabuso.** El formulario es público y el endpoint no tiene límite de peticiones. Si
      empieza a llegar spam, hay que añadir algo (un campo honeypot, un captcha o un límite por
      IP).

## Estilo del código

Igual que el resto de proyectos del repositorio:

- Sin punto y coma.
- Comillas simples.
- Dos espacios de indentación.
- Comas finales en objetos y arrays de varias líneas.
- Componentes de React como funciones sueltas, nunca `React.FC`.
- Los componentes son de servidor por defecto. `'use client'` sólo cuando hacen falta hooks.
- `localStorage` es estado externo: se lee con `useSyncExternalStore`, nunca con
  `useState` + `useEffect`.
