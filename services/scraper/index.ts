/**
 * Servicio de scraping legal para LexChile.
 * Ejecuta la actualización diaria de fuentes legales chilenas.
 */

import { ejecutarActualizacionCompleta } from './scheduler'

async function main() {
  console.log('LexChile - Servicio de Actualización Legal')
  console.log('==========================================')
  console.log('Fuentes:')
  console.log('  - Biblioteca del Congreso Nacional (BCN)')
  console.log('  - Poder Judicial de Chile (PJUD)')
  console.log('  - Diario Oficial de la República de Chile')
  console.log('')

  // Ejecutar actualización inmediata
  const resultados = await ejecutarActualizacionCompleta()

  // Resumen final
  const totalNuevos = resultados.reduce((acc, r) => acc + r.nuevosRegistros, 0)
  const totalErrores = resultados.reduce((acc, r) => acc + r.errores.length, 0)

  console.log(`Total: ${totalNuevos} registros nuevos, ${totalErrores} errores`)

  if (totalErrores > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error fatal en scraper:', error)
  process.exit(1)
})
