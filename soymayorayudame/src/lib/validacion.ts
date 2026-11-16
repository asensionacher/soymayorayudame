import { z } from 'zod'

/**
 * Validación de los datos del formulario.
 *
 * Zod se usa en el servidor (route handler). En el navegador se
 * comprueba lo mismo con los atributos `required` y `type` del
 * <form>, para que la persona vea el error antes de enviar.
 */
export const esquemaSolicitud = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'Escriba su nombre.')
    .max(80, 'El nombre es demasiado largo.'),

  apellidos: z
    .string()
    .trim()
    .min(1, 'Escriba sus apellidos.')
    .max(120, 'Los apellidos son demasiado largos.'),

  telefono: z
    .string()
    .trim()
    .min(1, 'Escriba un teléfono de contacto.')
    .max(30, 'El teléfono es demasiado largo.')
    .refine(
      (valor) => valor.replace(/[\s-]/g, '').length >= 7,
      'El teléfono no parece un número correcto.',
    ),

  email: z
    .string()
    .trim()
    .min(1, 'Escriba su correo electrónico.')
    .max(160, 'El correo electrónico es demasiado largo.')
    .refine(
      (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor),
      'El correo electrónico no parece correcto.',
    ),

  necesita: z
    .string()
    .trim()
    .min(10, 'Cuéntenos un poco más qué necesita, por favor.')
    .max(2000, 'El texto es demasiado largo.'),

  preferenciaContacto: z.enum(['whatsapp', 'email', 'telefono'], {
    error: 'Elija cómo prefiere que le contacten.',
  }),
})

export type DatosSolicitud = z.infer<typeof esquemaSolicitud>
