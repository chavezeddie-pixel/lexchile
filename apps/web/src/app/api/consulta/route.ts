import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
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

// Rate limiting por IP - 5 consultas diarias gratis
const DAILY_LIMIT = 5
const rateLimitMap = new Map<string, { count: number; date: string }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().split('T')[0]
  const entry = rateLimitMap.get(ip)

  if (!entry || entry.date !== today) {
    rateLimitMap.set(ip, { count: 1, date: today })
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: DAILY_LIMIT - entry.count }
}

// Determinar si usar Haiku (preguntas) o Sonnet (orientacion)
function shouldUseSonnet(historial: Array<{ role: string; content: string }>): boolean {
  // Sonnet si: hay 4+ mensajes (ya recopilo info) o el usuario pide resumen
  if (historial.length >= 4) return true
  const lastUser = [...historial].reverse().find(m => m.role === 'user')
  if (lastUser && /resumen|opciones|que puedo hacer|que me corresponde|cuanto/i.test(lastUser.content)) return true
  return false
}

const RESPUESTA_EXTRANJERA =
  'Este sistema esta disenado exclusivamente para el sistema juridico chileno. No puedo proporcionar informacion sobre legislacion de otros paises.'

export async function POST(request: Request) {
  try {
    // Rate limit por IP
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || 'unknown'

    const { allowed, remaining } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json({
        error: 'Has alcanzado el limite de 5 consultas diarias gratuitas. Vuelve manana para seguir consultando.',
        limitReached: true,
      }, { status: 429 })
    }

    const body = await request.json()
    const pregunta = body.pregunta?.trim()

    if (!pregunta) {
      return NextResponse.json({ error: 'Escribe algo para consultar.' }, { status: 400 })
    }

    if (detectarConsultaExtranjera(pregunta)) {
      return NextResponse.json({ respuesta: RESPUESTA_EXTRANJERA, fuentesCitadas: [] })
    }

    const { contextoLeyes, contextoJurisprudencia } = await buscarContextoLegal(pregunta)

    if (!hasApiKey()) {
      const respuestaLocal = contextoLeyes
        ? `Basandome en la legislacion chilena disponible:\n\n${contextoLeyes.substring(0, 3000)}\n\n---\nNota: Para respuestas con IA, se requiere configurar la API de Claude.`
        : 'No encontre informacion relevante. Intenta reformular tu pregunta.'
      return NextResponse.json({ respuesta: respuestaLocal })
    }

    const historial = body.historial || []

    // Modelo dual: Haiku para preguntas, Sonnet para orientacion
    const useSonnet = shouldUseSonnet(historial)

    const { respuesta, tokens } = await consultarIA(
      pregunta,
      contextoLeyes,
      contextoJurisprudencia,
      historial,
      useSonnet ? 'sonnet' : 'haiku'
    )

    // Separar respuesta, fuentes y sugerencias
    let respuestaLimpia = respuesta
    const fuentes: Array<{ ley: string; articulo: string; detalle: string; url: string }> = []
    let sugerencias: string[] = []

    // Extraer sugerencias
    const sugIndex = respuestaLimpia.indexOf('---SUGERENCIAS---')
    if (sugIndex !== -1) {
      const sugTexto = respuestaLimpia.substring(sugIndex + '---SUGERENCIAS---'.length).trim()
      respuestaLimpia = respuestaLimpia.substring(0, sugIndex).trim()
      sugerencias = sugTexto.split('\n')
        .map((l) => l.replace(/^\[|\]$/g, '').trim())
        .filter((l) => l.length > 0 && !l.startsWith('Ley:'))
        .slice(0, 4)
    }

    // Extraer fuentes
    const fuentesIndex = respuestaLimpia.indexOf('---FUENTES---')
    if (fuentesIndex !== -1) {
      const fuentesTexto = respuestaLimpia.substring(fuentesIndex + '---FUENTES---'.length).trim()
      respuestaLimpia = respuestaLimpia.substring(0, fuentesIndex).trim()
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

    // Si las sugerencias estaban despues de las fuentes, re-extraer
    if (sugerencias.length === 0) {
      const sugInFuentes = respuestaLimpia.indexOf('---SUGERENCIAS---')
      if (sugInFuentes !== -1) {
        const sugTexto = respuestaLimpia.substring(sugInFuentes + '---SUGERENCIAS---'.length).trim()
        respuestaLimpia = respuestaLimpia.substring(0, sugInFuentes).trim()
        sugerencias = sugTexto.split('\n')
          .map((l) => l.replace(/^\[|\]$/g, '').trim())
          .filter((l) => l.length > 0)
          .slice(0, 4)
      }
    }

    return NextResponse.json({ respuesta: respuestaLimpia, tokens, fuentes, sugerencias, remaining, modelo: useSonnet ? 'sonnet' : 'haiku' })
  } catch (error) {
    console.error('Error en consulta:', error)
    return NextResponse.json({ error: 'Error al procesar la consulta. Intenta nuevamente.' }, { status: 500 })
  }
}
