#!/usr/bin/env node
/**
 * Revisa los ficheros de texto del proyecto buscando texto corrupto.
 *
 * Al escribir textos largos en castellano a mano se cuelan errores
 * con dos formas típicas:
 *   - Palabras pegadas: "leLeave", "de laANCEL", "losdingos"
 *   - Palabras en otro idioma: "Renew", "providers", "Steering"
 *
 * Este script revisa el código (tsx, ts, mjs) y los ficheros de
 * contenido (md) para que los errores no lleguen a la web.
 */

import fs from 'node:fs'
import path from 'node:path'

const RAIZ = process.cwd()

/**
 * Sólo se revisan los ficheros con texto que ve el usuario final.
 * La documentación (README, AGENTS) y el código de infraestructura
 * están en inglés o en_castellano técnico, así que no tienen sentido
 * con estas reglas.
 */
const RUTAS_REVISADAS = [
  'src/app/page.tsx',
  'src/app/ayuda/page.tsx',
  'src/app/privacidad/page.tsx',
  'src/app/not-found.tsx',
  'src/components/FormularioSolicitud.tsx',
  'src/components/Cabecera.tsx',
  'src/components/Pie.tsx',
  'src/app/layout.tsx',
]

const EXTENSIONES = ['.tsx', '.ts', '.mjs', '.md']

/** Siglas y nombres propios que van en mayúsculas y son correctos */
const EXCEPCIONES = new Set([
  'DNI', 'NIE', 'INSS', 'SS', 'NIF', 'CIF', 'SMS', 'PDF', 'DGT', 'GVA',
  'EUR', 'IVA', 'IRPF', 'SEPE', 'TGSS', 'MINSAL', 'SNS', 'ONCE', 'AEPD',
  'RGPD', 'LOPDGDD', 'CL', 'CP', 'IBAN', 'PIN', 'CLA', 'API', 'URL', 'CSS',
  'HTML', 'JSON', 'HTTP', 'NEXT', 'NODE', 'TYPESCRIPT', 'TALWIND', 'WCAG',
  'TELEGRAM', 'CHAT', 'ID', 'USUARIO', 'NAVEGADOR', 'INTERNET', 'CORREO',
  'WHATSAPP', 'EMAIL', 'TELEFONO', 'TELÉFONO', 'VOLUNTARIO', 'VOLUNTARIA',
])

/** Palabras inglesas que no deberían aparecer sueltas en un texto español */
const ANGLOFONOS = new Set([
  'renew', 'leave', 'mail', 'send', 'start', 'click', 'login', 'logout',
  'home', 'user', 'password', 'email', 'next', 'back', 'close', 'open',
  'read', 'save', 'delete', 'update', 'download', 'upload', 'settings',
  'profile', 'providers', 'pensions', 'recognised', 'directing', 'form',
  'online', 'here', 'more', 'less', 'new', 'old', 'page', 'steering',
  'voluntary', 'renewing', 'default', 'loading', 'submit', 'button',
  'label', 'input', 'value', 'type', 'name', 'text', 'list', 'data',
])

const problemas = []

/**
 * Quita los signos de markdown, de código y las comillas de una
 * palabra, para poder compararla con la de al lado.
 */
function limpiar(texto) {
  return texto
    .replace(/^[*"'`([<]+/, '')
    .replace(/[*"'`)\]>.,;:!?]+$/, '')
}

/**
 * Detecta si la línea es código (identificadores, claves de objeto,
 * atributos JSX) en vez de texto para el usuario.
 *
 * El criterio: si la línea tiene una estrutura de clave: valor, o
 * está dentro de una etiqueta, es código. El texto que ve el usuario
 * va suelto en el JSX o dentro de comillas simples y simples.
 */
function esCodigo(linea) {
  const sinEspacios = linea.trim()

  // clave: valor  ->  openGraph: {,   type: 'website',
  if (/^[A-Za-z_$][\w$]*\s*:/.test(sinEspacios)) return true

  // imports, exports, funciones, constantes, tipos
  if (/^(import|export|const|let|var|function|async|type|interface|return|if|for)\b/.test(sinEspacios)) {
    return true
  }

  // Propiedades de un type:  onEnviado?: () => void
  if (/^[A-Za-z_$][\w$]*\??\s*[:?]/.test(sinEspacios)) return true

  // Atributo JSX:  id="email",   nombre="email",   autoComplete="email"
  if (/^[A-Za-z_$][\w$-]*\s*=\s*["'{]/.test(sinEspacios)) return true

  // JSX con etiquetas y atributos en la misma línea. Si además tiene
  // texto dentro de la etiqueta, ese texto sí se revisa.
  if (/^<\/?[A-Z]/.test(sinEspacios) && /=/.test(sinEspacios)) {
    return !/>[^<>{}]+</.test(sinEspacios)
  }

  // Etiqueta JSX en minúscula con atributos: <script ... />
  if (/^<\/?[a-z]/.test(sinEspacios) && /=/.test(sinEspacios)) {
    return !/>[^<>{}]+</.test(sinEspacios)
  }

  // Propiedad suelta al pasar a otro parámetro:  autoComplete,
  if (/^[a-z][\w$]*,\s*$/.test(sinEspacios)) return true

  // cierre de etiqueta o parte de una etiqueta con atributos
  if (/^\/?>?$/.test(sinEspacios)) return true

  // líneas con snake_case o camelCase de más de una palabra pegada
  // y que no parezcan frases (no tienen espacios entre palabras)
  if (/^[a-z]+[A-Z][\w]*\s*[:(]/.test(sinEspacios)) return true

  return false
}

/**
 * Extrae el texto que ve el usuario de una línea: el contenido de las
 * etiquetas JSX y el de las cadenas entre comillas.
 *
 *   <span>Renovar el DNI</span>   ->  "Renovar el DNI"
 *   tipo = 'text'                ->  "text"
 */
function extraerTexto(linea) {
  const trozos = []

  // Contenido de etiquetas JSX: <span>texto</span>
  const contenidoJsx = linea.match(/>([^<>{}]+)</g)
  if (contenidoJsx) {
    for (const trozo of contenidoJsx) {
      trozos.push(trozo.replace(/^>|</g, ''))
    }
  }

  // Cadenas entre comillas
  const comillas = linea.match(/'([^']*)'|"([^"]*)"/g)
  if (comillas) {
    for (const trozo of comillas) {
      trozos.push(trozo.replace(/^['"]|['"]$/g, ''))
    }
  }

  // Si no hay nada de lo anterior, la línea entera es texto. Se quitan
  // los nombres de las etiquetas HTML/JSX, que no son texto del usuario.
  // Las etiquetas partidas en varias líneas (por ejemplo "<label" y luego
  // los atributos) también se quitan.
  if (trozos.length === 0) {
    return linea.replace(/<\/?[a-zA-Z][^>]*>?/g, ' ')
  }

  return trozos.join(' ')
}

function comprobarLinea(linea, archivo, numero) {
  // Los identificadores en camelCase son correctos en código.
  if (esCodigo(linea)) return

  const texto = extraerTexto(linea)
  const palabras = texto.split(/\s+/)

  for (const palabra of palabras) {
    const limpia = limpiar(palabra)
    if (!limpia) continue

    // 1. Mayúsculas y minúsculas mezcladas dentro de la misma palabra:
    //    "leLeave", "DNIRenew", "losdingos".
    //    En castellano no existen, salvo siglas (DNI, NIF) que van
    //    todas en mayúsculas.
    const tieneMinusculas = /[a-záéíóúñ]/.test(limpia)
    const tieneMayusculas = /[A-ZÁÉÍÓÚÑ]/.test(limpia)

    if (tieneMinusculas && tieneMayusculas && !EXCEPCIONES.has(limpia)) {
      // "DNI" pegado a otra palabra: "DNIRenew", "laANCEL".
      const pegada = /^[A-ZÁÉÍÓÚÑ]{2,}[a-záéíóúñ]/.test(limpia)
      // "leLeave": empieza en minúscula y pasa a mayúscula.
      const camel = /^[a-záéíóúñ]+[A-ZÁÉÍÓÚÑ]/.test(limpia)

      if (pegada || camel) {
        problemas.push({
          archivo,
          numero,
          tipo: `palabras pegadas sin espacio: "${limpia}"`,
          linea: linea.trim(),
        })
        continue
      }
    }

    // 2. Palabra inglesa suelta.
    const minuscula = limpia.toLowerCase()
    if (ANGLOFONOS.has(minuscula) && !EXCEPCIONES.has(limpia)) {
      if (/https?:|www\.|@|\.(com|es|gov)|localhost/.test(linea)) continue
      problemas.push({
        archivo,
        numero,
        tipo: `posible palabra en inglés: "${minuscula}"`,
        linea: linea.trim(),
      })
      continue
    }

    // 3. Mayúsculas pegadas a una palabra en minúscula, tipo "laANCEL".
    if (/^[a-záéíóúñ]{2,}[A-ZÁÉÍÓÚÑ]{3,}$/.test(limpia)) {
      problemas.push({
        archivo,
        numero,
        tipo: `palabras pegadas sin espacio: "${limpia}"`,
        linea: linea.trim(),
      })
    }
  }
}

function comprobarArchivo(ruta) {
  const contenido = fs.readFileSync(ruta, 'utf-8')
  const lineas = contenido.split('\n')

  lineas.forEach((linea, indice) => {
    // No se revisan las URLs ni los identificadores de clase de Tailwind
    if (/https?:\/\//.test(linea)) return
    comprobarLinea(linea, ruta, indice + 1)
  })
}

function recorrer(directorio) {
  for (const entrada of fs.readdirSync(directorio, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'dist', 'build'].includes(entrada.name)) continue

    const completa = path.join(directorio, entrada.name)

    if (entrada.isDirectory()) {
      recorrer(completa)
    } else if (EXTENSIONES.includes(path.extname(entrada.name))) {
      const relativa = path.relative(RAIZ, completa)
      if (!RUTAS_REVISADAS.includes(relativa)) continue
      comprobarArchivo(completa)
    }
  }
}

recorrer(RAIZ)

if (problemas.length > 0) {
  console.error('\nSe han encontrado textos que hay que revisar:\n')
  for (const p of problemas) {
    const relativo = path.relative(RAIZ, p.archivo)
    console.error(`  ${relativo}:${p.numero}  ${p.tipo}`)
    console.error(`      ${p.linea}\n`)
  }
  console.error(`${problemas.length} problema(s) encontrado(s).\n`)
  process.exit(1)
}

console.log('Todos los textos están correctos.')
