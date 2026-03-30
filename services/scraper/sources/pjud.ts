/**
 * Scraper para el Poder Judicial de Chile (PJUD)
 * Fuente: https://www.pjud.cl
 *
 * Este módulo obtiene jurisprudencia y sentencias desde el PJUD.
 */

import { createHash } from 'crypto'

export interface SentenciaScrapedData {
  rol: string
  tribunal: string
  tipoTribunal: string
  fecha: Date
  materia: string
  areaLegal: string
  resumen: string
  texto: string
  resultado?: string
  fuenteUrl: string
  hashContenido: string
}

/**
 * Obtiene las últimas sentencias publicadas por el PJUD.
 * En producción, consulta la base de jurisprudencia del PJUD.
 */
export async function obtenerUltimasSentencias(): Promise<SentenciaScrapedData[]> {
  // TODO: Implementar consulta a https://juris.pjud.cl/
  // El PJUD tiene un buscador de jurisprudencia en:
  // https://juris.pjud.cl/busqueda

  console.log('[PJUD] Consultando últimas sentencias publicadas...')

  const sentencias: SentenciaScrapedData[] = []

  return sentencias
}

/**
 * Busca sentencias por materia en el PJUD.
 */
export async function buscarSentencias(materia: string, tribunal?: string): Promise<SentenciaScrapedData[]> {
  // TODO: Implementar búsqueda en PJUD
  console.log(`[PJUD] Buscando sentencias sobre "${materia}"...`)
  return []
}
