#!/usr/bin/env node
/**
 * Comprueba el contraste de los colores que se usan en la web.
 *
 * Usa las mismas fórmulas que la WCAG 2.1. Para no depender del
 * navegador, se calculan los valores a mano sobre los tokens del
 * CSS. Si se cambia un color en globals.css, hay que actualizar
 * aquí la lista de comprobaciones.
 *
 * Objetivo: AAA (7:1) para todo el texto, en los dos temas.
 */

const TOKENS = {
  claro: {
    bg: '#ffffff',
    bgSubtle: '#f4f4f5',
    bgInset: '#ebebed',
    surface: '#ffffff',
    text: '#111111',
    textMuted: '#444444',
    border: '#545454',
    borderStrong: '#111111',
    accent: '#0b3d91',
    accentText: '#ffffff',
    accentSubtle: '#e8eefb',
    warningText: '#6b4700',
    warningBg: '#fff6e0',
  },
  oscuro: {
    bg: '#0a0a0a',
    bgSubtle: '#171717',
    bgInset: '#222222',
    surface: '#141414',
    text: '#ffffff',
    textMuted: '#d4d4d4',
    border: '#a3a3a3',
    borderStrong: '#ffffff',
    accent: '#9dc0ff',
    accentText: '#06152e',
    accentSubtle: '#14243f',
    warningText: '#ffd88a',
    warningBg: '#2c2210',
  },
}

/** [nombre, color del texto, color del fondo] */
const COMPROBACIONES = [
  ['texto normal', 'text', 'bg'],
  ['texto secundario', 'textMuted', 'bg'],
  ['titulo', 'text', 'surface'],
  ['titulo sobre fondo suave', 'text', 'bgSubtle'],
  ['enlace', 'accent', 'bg'],
  ['enlace sobre fondo suave', 'accent', 'accentSubtle'],
  ['boton primario', 'accentText', 'accent'],
  ['boton secundario', 'text', 'surface'],
  ['borde de tarjeta', 'border', 'surface'],
  ['aviso', 'warningText', 'warningBg'],
]

function hexaRgb(hex) {
  const limpio = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(limpio.slice(i, i + 2), 16))
}

function luminancia(hex) {
  const [r, g, b] = hexaRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contraste(hex1, hex2) {
  const l1 = luminancia(hex1)
  const l2 = luminancia(hex2)
  const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (claro + 0.05) / (oscuro + 0.05)
}

const OBJETIVO = 7 // AAA para texto normal
let fallos = 0

for (const [tema, tokens] of Object.entries(TOKENS)) {
  console.log(`\n=== ${tema.toUpperCase()} ===`)

  for (const [nombre, colorTexto, colorFondo] of COMPROBACIONES) {
    const ratio = contraste(tokens[colorTexto], tokens[colorFondo])
    const nivel = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FALLO'
    const ok = ratio >= OBJETIVO

    if (!ok) fallos++

    console.log(
      `  ${nombre.padEnd(28)} ${ratio.toFixed(2).padStart(6)}:1  ${nivel.padEnd(6)} ${ok ? 'ok' : 'FALLO'}`,
    )
  }
}

if (fallos > 0) {
  console.error(`\n${fallos} combinación(es) por debajo del objetivo AAA (${OBJETIVO}:1).\n`)
  process.exit(1)
}

console.log('\nTodas las combinaciones cumplen AAA (7:1) o mejor.\n')
