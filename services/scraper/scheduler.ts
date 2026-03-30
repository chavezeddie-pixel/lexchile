/**
 * Scheduler para actualización automática de fuentes legales chilenas.
 * Ejecuta diariamente la revisión de:
 * - Nuevas leyes (BCN)
 * - Nuevas sentencias (PJUD)
 * - Publicaciones del Diario Oficial
 */

import { obtenerUltimasLeyes, verificarModificacion } from './sources/bcn'
import { obtenerUltimasSentencias } from './sources/pjud'
import { obtenerUltimasPublicaciones } from './sources/diario-oficial'

export interface ActualizacionResult {
  fuente: string
  nuevosRegistros: number
  actualizaciones: number
  errores: string[]
  timestamp: Date
}

/**
 * Ejecuta la actualización completa de todas las fuentes legales.
 */
export async function ejecutarActualizacionCompleta(): Promise<ActualizacionResult[]> {
  console.log('=== INICIO ACTUALIZACIÓN LEGAL DIARIA ===')
  console.log(`Fecha: ${new Date().toLocaleDateString('es-CL')}`)
  console.log(`Hora: ${new Date().toLocaleTimeString('es-CL')}`)
  console.log(`Zona horaria: America/Santiago`)

  const resultados: ActualizacionResult[] = []

  // 1. Actualizar leyes desde BCN
  try {
    console.log('\n--- Actualizando leyes desde BCN ---')
    const nuevasLeyes = await obtenerUltimasLeyes()
    resultados.push({
      fuente: 'BCN (Biblioteca del Congreso Nacional)',
      nuevosRegistros: nuevasLeyes.length,
      actualizaciones: 0,
      errores: [],
      timestamp: new Date(),
    })
  } catch (error) {
    resultados.push({
      fuente: 'BCN',
      nuevosRegistros: 0,
      actualizaciones: 0,
      errores: [`Error BCN: ${error}`],
      timestamp: new Date(),
    })
  }

  // 2. Actualizar jurisprudencia desde PJUD
  try {
    console.log('\n--- Actualizando jurisprudencia desde PJUD ---')
    const nuevasSentencias = await obtenerUltimasSentencias()
    resultados.push({
      fuente: 'PJUD (Poder Judicial)',
      nuevosRegistros: nuevasSentencias.length,
      actualizaciones: 0,
      errores: [],
      timestamp: new Date(),
    })
  } catch (error) {
    resultados.push({
      fuente: 'PJUD',
      nuevosRegistros: 0,
      actualizaciones: 0,
      errores: [`Error PJUD: ${error}`],
      timestamp: new Date(),
    })
  }

  // 3. Actualizar publicaciones del Diario Oficial
  try {
    console.log('\n--- Actualizando Diario Oficial ---')
    const publicaciones = await obtenerUltimasPublicaciones()
    resultados.push({
      fuente: 'Diario Oficial',
      nuevosRegistros: publicaciones.length,
      actualizaciones: 0,
      errores: [],
      timestamp: new Date(),
    })
  } catch (error) {
    resultados.push({
      fuente: 'Diario Oficial',
      nuevosRegistros: 0,
      actualizaciones: 0,
      errores: [`Error Diario Oficial: ${error}`],
      timestamp: new Date(),
    })
  }

  console.log('\n=== RESUMEN ACTUALIZACIÓN ===')
  for (const r of resultados) {
    console.log(`${r.fuente}: ${r.nuevosRegistros} nuevos, ${r.actualizaciones} actualizados, ${r.errores.length} errores`)
  }
  console.log('=== FIN ACTUALIZACIÓN ===\n')

  return resultados
}
