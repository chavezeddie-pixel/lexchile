import { NextResponse } from 'next/server'
import { consultarIA, buscarContextoLegal } from '@/lib/ai'
import { detectarConsultaExtranjera } from '@/lib/chile'
import { readFileSync } from 'fs'
import { join } from 'path'

function hasApiKey(): boolean {
  if (process.env.ANTHROPIC_API_KEY) return true
  try {
    const envPath = join(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    const match = content.match(/ANTHROPIC_API_KEY="?([^"\n]+)"?/)
    if (match && match[1]) {
      process.env.ANTHROPIC_API_KEY = match[1]
      return true
    }
  } catch {}
  return false
}

const RESPUESTA_EXTRANJERA =
  'Este sistema esta disenado exclusivamente para el sistema juridico chileno. No puedo proporcionar informacion sobre legislacion de otros paises.'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const pregunta = body.pregunta?.trim()

    if (!pregunta) {
      return NextResponse.json({ error: 'Escribe algo para consultar.' }, { status: 400 })
    }

    // Detectar consultas sobre leyes extranjeras
    if (detectarConsultaExtranjera(pregunta)) {
      return NextResponse.json({
        respuesta: RESPUESTA_EXTRANJERA,
        fuentesCitadas: [],
      })
    }

    // Buscar contexto legal relevante (RAG)
    const { contextoLeyes, contextoJurisprudencia } = await buscarContextoLegal(pregunta)

    // Verificar que hay API key configurada
    if (!hasApiKey()) {
      // Sin API key: devolver respuesta basada en el contexto de la base de datos
      const respuestaLocal = contextoLeyes
        ? `Basandome en la legislacion chilena disponible:\n\n${contextoLeyes.substring(0, 3000)}\n\n---\nNota: Esta respuesta muestra la informacion legal disponible en nuestra base de datos. Para una respuesta mas detallada con IA, se requiere configurar la API de Claude.`
        : 'Lo siento, no encontre informacion relevante en nuestra base de datos para esa consulta. Intenta reformular tu pregunta usando terminos legales chilenos especificos.'

      return NextResponse.json({ respuesta: respuestaLocal })
    }

    // Historial de conversacion para mantener el hilo
    const historial = body.historial || []

    // Consultar IA con contexto y historial
    const { respuesta, tokens } = await consultarIA(
      pregunta,
      contextoLeyes,
      contextoJurisprudencia,
      historial
    )

    // Separar la respuesta del bloque de fuentes
    let respuestaLimpia = respuesta
    const fuentes: Array<{ ley: string; articulo: string; detalle: string; url: string }> = []

    const fuentesIndex = respuesta.indexOf('---FUENTES---')
    if (fuentesIndex !== -1) {
      respuestaLimpia = respuesta.substring(0, fuentesIndex).trim()
      const fuentesTexto = respuesta.substring(fuentesIndex + '---FUENTES---'.length).trim()
      const lineas = fuentesTexto.split('\n').filter((l) => l.trim().startsWith('Ley:'))
      for (const linea of lineas) {
        const leyMatch = linea.match(/Ley:\s*([^|]+)/)
        const artMatch = linea.match(/Articulo:\s*([^|]+)/)
        const detMatch = linea.match(/Detalle:\s*([^|]+)/)
        const urlMatch = linea.match(/URL:\s*(\S+)/)
        if (leyMatch) {
          fuentes.push({
            ley: leyMatch[1].trim(),
            articulo: artMatch ? artMatch[1].trim() : '',
            detalle: detMatch ? detMatch[1].trim() : '',
            url: urlMatch ? urlMatch[1].trim() : 'https://www.bcn.cl/leychile',
          })
        }
      }
    }

    return NextResponse.json({ respuesta: respuestaLimpia, tokens, fuentes })
  } catch (error) {
    console.error('Error en consulta:', error)
    return NextResponse.json({ error: 'Error al procesar la consulta. Intenta nuevamente.' }, { status: 500 })
  }
}
