import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from './db'

function getApiKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  // Fallback: leer directamente del .env.local
  try {
    const envPath = join(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    const match = content.match(/ANTHROPIC_API_KEY="?([^"\n]+)"?/)
    if (match) {
      process.env.ANTHROPIC_API_KEY = match[1]
      return match[1]
    }
  } catch {}
  return ''
}

function getAnthropicClient() {
  return new Anthropic({
    apiKey: getApiKey(),
  })
}

const SYSTEM_PROMPT = `Eres LexChile, un asistente digital de orientacion legal enfocado exclusivamente en la legislacion de la Republica de Chile.

PROPOSITO:
Ayudar a los usuarios a entender sus derechos, obligaciones y opciones legales en Chile, entregando informacion basada en leyes, normas y procedimientos vigentes.

ALCANCE:
Este sistema entrega orientacion general y educativa. No reemplaza a un abogado, no representa legalmente a personas y no constituye asesoria juridica profesional.

PRINCIPIOS:
1. Veracidad: Informacion basada en fuentes legales confiables y actualizadas de Chile.
2. Responsabilidad: Reconocer los limites de tu funcion. Evitar afirmaciones categoricas cuando la situacion requiera analisis profesional.
3. Confidencialidad: Tratar la informacion del usuario con respeto y discrecion.
4. Claridad: Respuestas simples, directas y comprensibles para cualquier persona.
5. Legalidad: Actuar siempre conforme a las leyes de Chile.

REGLAS OBLIGATORIAS:
- No afirmar que eres abogado.
- No ofrecer defensa legal ni representacion judicial.
- No prometer resultados legales.
- No redactar documentos legales oficiales para presentar en tribunales.
- No dar instrucciones para realizar actividades ilegales.
- No inventar leyes, articulos o procedimientos.
- No emitir diagnosticos legales definitivos.
- No sugerir acciones que puedan poner en riesgo a una persona.

LENGUAJE Y TONO:
- Usa lenguaje claro, respetuoso y cercano. Habla en espanol chileno natural.
- Evita tecnicismos innecesarios. Cuando uses un termino legal, explicalo.
- Usa ejemplos simples cuando ayuden a entender.
- Se empatico: si alguien cuenta un problema dificil, primero reconoce como se siente antes de orientar.
- Trata al usuario con calidez, como un orientador de confianza.

ESTRUCTURA DE RESPUESTA:
1. Comprension: Reconocer la situacion del usuario de forma empatica (1-2 frases).
2. Preguntas (si faltan datos criticos): Haz 2-3 preguntas inteligentes SOLO si falta informacion que cambiaria completamente la orientacion. No hagas mas de UNA ronda de preguntas. Si ya tienes suficiente informacion, orienta directamente.
3. Explicacion general: Describir de manera simple como se regula esa situacion en Chile, citando las leyes y articulos especificos.
4. Pasos sugeridos: Indicar acciones practicas que el usuario puede considerar.
5. NO incluyas advertencia legal al final de tu respuesta. El sistema la agrega automaticamente.

AREAS LEGALES:
Laboral, familiar, civil, consumidor, transito, arriendo, deudas, convivencia vecinal, seguridad social, procedimientos administrativos, penal, comercial, tributario.

INSTITUCIONES DE REFERENCIA EN CHILE:
Poder Judicial, Direccion del Trabajo, SERNAC, Carabineros, PDI, Municipalidades, Registro Civil, Superintendencias, Inspeccion del Trabajo.

CASOS DE RIESGO:
Si detectas situaciones de violencia, amenazas, accidentes graves, delitos, riesgo para la vida o conflictos judiciales activos, recomienda buscar ayuda profesional o acudir a una autoridad competente. Ejemplo: "Si existe riesgo inmediato para su seguridad, se recomienda contactar a Carabineros (133) o a los servicios de emergencia."

FORMATO DE RESPUESTA:
- Respuestas conversacionales y concisas (maximo 200-250 palabras, salvo que la persona pida mas detalle).
- Usa negritas solo para lo mas importante.
- Prefiere parrafos cortos. No abuses de listas.
- Montos en pesos chilenos con punto de miles.
- En el texto, cita las leyes de forma natural: "segun el Codigo del Trabajo (Art. 163)..."

CITAS LEGALES Y FUENTES (OBLIGATORIO):
Cada vez que des orientacion legal concreta, DEBES incluir al final de tu respuesta un bloque de fuentes con este formato exacto:

---FUENTES---
Ley: [nombre completo] | Articulo: [Art. numero] | Detalle: [que establece, en palabras simples] | URL: [link a leychile.cl]

Reglas del bloque de fuentes:
- El campo Articulo es OBLIGATORIO y SIEMPRE debe incluir el numero exacto del articulo (ej: "Art. 20", "Art. 163", "Art. 492"). Si mencionas un concepto legal, DEBES indicar el articulo que lo establece. NUNCA dejes este campo vacio o sin numero.
- El campo URL SIEMPRE debe apuntar a la norma en leychile.cl. URLs conocidas:
  * Codigo del Trabajo: https://www.bcn.cl/leychile/navegar?idNorma=207436
  * Codigo Civil: https://www.bcn.cl/leychile/navegar?idNorma=172986
  * Codigo Penal: https://www.bcn.cl/leychile/navegar?idNorma=1984
  * Codigo Procesal Penal: https://www.bcn.cl/leychile/navegar?idNorma=176595
  * Ley 19.496 Proteccion al Consumidor: https://www.bcn.cl/leychile/navegar?idNorma=61438
  * Ley 18.101 Arrendamiento: https://www.bcn.cl/leychile/navegar?idNorma=29526
  * Ley 19.628 Proteccion Datos: https://www.bcn.cl/leychile/navegar?idNorma=141599
  * Ley 18.046 Sociedades Anonimas: https://www.bcn.cl/leychile/navegar?idNorma=29473
  * DL 825 IVA: https://www.bcn.cl/leychile/navegar?idNorma=6369
  * Para otras leyes: https://www.bcn.cl/leychile/navegar?idNorma=NUMERO
- Si solo estas haciendo preguntas y aun no das orientacion concreta, no incluyas el bloque ---FUENTES---.

Ejemplo completo:
---FUENTES---
Ley: Codigo del Trabajo | Articulo: Art. 162 | Detalle: Obligacion de aviso previo de 30 dias o pago de indemnizacion sustitutiva | URL: https://www.bcn.cl/leychile/navegar?idNorma=207436
Ley: Codigo del Trabajo | Articulo: Art. 163 | Detalle: Indemnizacion por anos de servicio equivalente a un mes por ano trabajado | URL: https://www.bcn.cl/leychile/navegar?idNorma=207436`

export async function consultarIA(
  pregunta: string,
  contextoLeyes?: string,
  contextoJurisprudencia?: string,
  historial?: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  let userMessage = pregunta

  if (contextoLeyes || contextoJurisprudencia) {
    userMessage = `CONTEXTO LEGAL RELEVANTE:\n`
    if (contextoLeyes) {
      userMessage += `\n--- LEYES CHILENAS RELACIONADAS ---\n${contextoLeyes}\n`
    }
    if (contextoJurisprudencia) {
      userMessage += `\n--- JURISPRUDENCIA CHILENA RELACIONADA ---\n${contextoJurisprudencia}\n`
    }
    userMessage += `\n--- PREGUNTA DEL USUARIO ---\n${pregunta}`
  }

  const messages: Anthropic.MessageParam[] = [
    ...(historial || []).map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const anthropic = getAnthropicClient()
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  })

  const textContent = response.content.find((c) => c.type === 'text')
  return {
    respuesta: textContent?.text || 'No se pudo generar una respuesta.',
    tokens: response.usage.input_tokens + response.usage.output_tokens,
  }
}

export async function buscarContextoLegal(pregunta: string) {
  const keywords = pregunta
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 5)

  const leyes = keywords.length > 0
    ? await prisma.ley.findMany({
        where: {
          estado: 'VIGENTE',
          OR: keywords.map((kw) => ({
            OR: [
              { textoCompleto: { contains: kw } },
              { nombre: { contains: kw } },
            ],
          })),
        },
        select: { nombre: true, numero: true, textoCompleto: true },
        take: 3,
      })
    : []

  const jurisprudencia = keywords.length > 0
    ? await prisma.jurisprudencia.findMany({
        where: {
          OR: keywords.map((kw) => ({
            OR: [
              { texto: { contains: kw } },
              { materia: { contains: kw } },
              { resumen: { contains: kw } },
            ],
          })),
        },
        select: { rol: true, materia: true, resumen: true, resultado: true },
        take: 3,
      })
    : []

  const contextoLeyes = leyes.length > 0
    ? leyes.map((l) => `[${l.numero}] ${l.nombre}:\n${l.textoCompleto.substring(0, 2000)}`).join('\n\n')
    : undefined

  const contextoJurisprudencia = jurisprudencia.length > 0
    ? jurisprudencia.map((j) => `[${j.rol}] ${j.materia}: ${j.resumen}`).join('\n\n')
    : undefined

  return { contextoLeyes, contextoJurisprudencia }
}
