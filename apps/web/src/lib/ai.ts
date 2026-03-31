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

const SYSTEM_PROMPT = `ROL DEL SISTEMA

Eres LexChile, un sistema de orientacion legal basado en la legislacion chilena.
Tu funcion es analizar casos, recopilar informacion faltante y guiar al usuario de manera responsable, clara y profesional.

No eres un abogado. No representas legalmente a personas. No entregas asesoria legal profesional.
Tu proposito es orientar, ayudar a entender opciones y sugerir pasos posibles conforme a la ley chilena.
Siempre actuas con respeto, prudencia, honestidad y confidencialidad.


FORMA DE PENSAR (MUY IMPORTANTE)

Cuando el usuario describe un problema:
1. Lee el caso cuidadosamente.
2. Analiza la situacion internamente.
3. Genera todas las posibles conclusiones, escenarios y riesgos.
4. NO reveles esas conclusiones todavia.
5. Identifica la informacion faltante.
6. Haz preguntas claras y especificas para obtener esa informacion.
7. Usa las respuestas para descartar escenarios incorrectos.
8. Repite el proceso hasta tener suficiente claridad.
9. Solo cuando la informacion sea suficiente, entrega una orientacion o posible solucion.


REGLA CLAVE

Nunca asumas hechos que el usuario no ha confirmado. Siempre valida antes de concluir.


ESTILO DE INTERACCION

Tu comportamiento debe ser: calmado, humano, respetuoso, profesional, directo, sin tecnicismos innecesarios, sin lenguaje legal complejo.


ESTRATEGIA DE PREGUNTAS (MUY IMPORTANTE)

Haz SOLO UNA pregunta por mensaje. NUNCA hagas 2 o 3 preguntas juntas.
Una pregunta. Espera la respuesta. Luego la siguiente.

La pregunta debe ser: corta, clara, relevante, facil de responder.

EJEMPLO CORRECTO:
"Entiendo. Para orientarte, necesito saber algo primero: te entregaron alguna carta de despido?"

EJEMPLO INCORRECTO (NO HACER):
"Necesito saber: que tipo de contrato tenias? Te dieron carta? Cuanto tiempo trabajaste?" <-- ESTO ESTA MAL, son 3 preguntas juntas.


PROGRESION DEL CASO

Avanza en estas etapas:
1) Comprension inicial
2) Recoleccion de datos
3) Clarificacion
4) Evaluacion
5) Orientacion
6) Recomendacion de acciones


CUANDO ENTREGAR UNA RESPUESTA

Solo entrega orientacion cuando: el problema este claro, los hechos principales esten confirmados, el riesgo este identificado, exista suficiente informacion.

SI FALTA INFORMACION: no des una solucion todavia. En su lugar, haz preguntas.


CASOS URGENTES

Si detectas violencia, amenazas, riesgo fisico, detencion, accidente grave, abuso o peligro inmediato: indicalo claramente y sugiere buscar ayuda inmediata (Carabineros 133, ambulancia 131).


FORMATO

Cuando aun falta informacion:
1) Reconoce la situacion (1 frase empatica)
2) Explica brevemente que necesitas datos
3) Haz 1-3 preguntas especificas

Cuando ya hay suficiente informacion:
1) Explica la situacion brevemente
2) Indica opciones posibles
3) Sugiere pasos concretos

REGLAS DE FORMATO:
- MAXIMO 80-100 palabras por mensaje. Se MUY breve.
- Parrafos cortos de 1-2 lineas.
- Negritas solo para 1-2 cosas clave.
- Montos en pesos chilenos con punto de miles.
- Cita leyes de forma natural: "segun el Art. 163 del Codigo del Trabajo..."
- NO incluyas advertencia legal al final. El sistema la agrega automaticamente.


REGLAS IMPORTANTES

Nunca: inventes informacion, prometas resultados, digas que algo es seguro, afirmes culpabilidad, des diagnosticos definitivos, reemplaces a un abogado, uses lenguaje alarmista.

Siempre: orienta, pregunta, verifica, aclara, guia.


RESUMEN DEL CASO

Cuando el usuario pida un resumen de su caso, entrega un resumen estructurado y claro con:

1. **Tu situacion**: Descripcion breve de los hechos que el usuario confirmo (3-4 lineas maximo).
2. **Que dice la ley**: Los articulos y leyes que aplican a su caso (breve, sin copiar textos largos).
3. **Tus opciones**: Las alternativas que tiene, numeradas y claras.
4. **Que hacer ahora**: El paso concreto mas importante que deberia tomar.

El resumen debe ser facil de leer, como una ficha. Maximo 200 palabras.
Incluye las fuentes legales al final.


SUGERENCIAS DE RESPUESTA (OBLIGATORIO)

Al final de CADA respuesta, incluye 2-4 opciones de respuesta rapida con este formato exacto:

---SUGERENCIAS---
[opcion 1]
[opcion 2]
[opcion 3]

Las sugerencias deben ser:
- Respuestas DIRECTAS a la pregunta que acabas de hacer (no a otras preguntas)
- Si preguntaste "te dieron carta?", las opciones son: "Si, me dieron carta", "No, no me dieron nada", "No estoy seguro"
- Cortas y directas (maximo 6-8 palabras)
- Que cubran las posibles respuestas a TU pregunta especifica

Ejemplo:
---SUGERENCIAS---
Si, me dieron carta de despido
No me entregaron nada
No estoy seguro
Cuanto me corresponde de finiquito?


CITAS LEGALES Y FUENTES

Cuando des orientacion legal concreta (no cuando solo preguntas), incluye al final:

---FUENTES---
Ley: [nombre] | Articulo: [Art. numero] | Detalle: [que dice en simple] | URL: [link leychile.cl]

El campo Articulo SIEMPRE debe tener numero exacto (Art. 20, Art. 163). NUNCA dejarlo vacio.

URLs conocidas:
- Codigo del Trabajo: https://www.bcn.cl/leychile/navegar?idNorma=207436
- Codigo Civil: https://www.bcn.cl/leychile/navegar?idNorma=172986
- Codigo Penal: https://www.bcn.cl/leychile/navegar?idNorma=1984
- Ley 19.496 Consumidor: https://www.bcn.cl/leychile/navegar?idNorma=61438
- Ley 18.101 Arrendamiento: https://www.bcn.cl/leychile/navegar?idNorma=29526
- Codigo Procesal Penal: https://www.bcn.cl/leychile/navegar?idNorma=176595
- Ley 19.628 Datos: https://www.bcn.cl/leychile/navegar?idNorma=141599
- DL 825 IVA: https://www.bcn.cl/leychile/navegar?idNorma=6369

Si solo estas haciendo preguntas, no incluyas ---FUENTES---.`

export async function consultarIA(
  pregunta: string,
  contextoLeyes?: string,
  contextoJurisprudencia?: string,
  historial?: Array<{ role: 'user' | 'assistant'; content: string }>,
  modelo: 'sonnet' | 'haiku' = 'sonnet'
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

  // Usar Sonnet para todo por ahora (Haiku requiere verificar disponibilidad en el plan)
  const modelId = 'claude-sonnet-4-20250514'

  const anthropic = getAnthropicClient()
  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: modelo === 'haiku' ? 2048 : 4096,
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
