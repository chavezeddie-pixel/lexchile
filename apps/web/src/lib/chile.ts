/**
 * Validaciones y utilidades específicas para Chile
 */

export function validarRut(rut: string): boolean {
  const cleaned = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
  if (cleaned.length < 2) return false

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  if (!/^\d+$/.test(body)) return false

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const expectedDv = remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder)

  return dv === expectedDv
}

export function formatRut(rut: string): string {
  const cleaned = rut.replace(/\./g, '').replace(/-/g, '')
  if (cleaned.length < 2) return rut

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

export const REGIONES_CHILE = [
  { codigo: 'XV', nombre: 'Arica y Parinacota' },
  { codigo: 'I', nombre: 'Tarapacá' },
  { codigo: 'II', nombre: 'Antofagasta' },
  { codigo: 'III', nombre: 'Atacama' },
  { codigo: 'IV', nombre: 'Coquimbo' },
  { codigo: 'V', nombre: 'Valparaíso' },
  { codigo: 'XIII', nombre: 'Metropolitana de Santiago' },
  { codigo: 'VI', nombre: "O'Higgins" },
  { codigo: 'VII', nombre: 'Maule' },
  { codigo: 'XVI', nombre: 'Ñuble' },
  { codigo: 'VIII', nombre: 'Biobío' },
  { codigo: 'IX', nombre: 'La Araucanía' },
  { codigo: 'XIV', nombre: 'Los Ríos' },
  { codigo: 'X', nombre: 'Los Lagos' },
  { codigo: 'XI', nombre: 'Aysén' },
  { codigo: 'XII', nombre: 'Magallanes y la Antártica Chilena' },
] as const

export const AREAS_LEGALES = [
  { value: 'LABORAL', label: 'Derecho Laboral' },
  { value: 'CIVIL', label: 'Derecho Civil' },
  { value: 'FAMILIA', label: 'Derecho de Familia' },
  { value: 'PENAL', label: 'Derecho Penal' },
  { value: 'COMERCIAL', label: 'Derecho Comercial' },
  { value: 'TRIBUTARIO', label: 'Derecho Tributario' },
  { value: 'ADMINISTRATIVO', label: 'Derecho Administrativo' },
  { value: 'CONSUMIDOR', label: 'Derecho del Consumidor' },
  { value: 'ARRENDAMIENTO', label: 'Derecho de Arrendamiento' },
] as const

export const PAISES_BLOQUEADOS_KEYWORDS = [
  'méxico', 'mexico', 'argentina', 'colombia', 'perú', 'peru', 'bolivia',
  'ecuador', 'venezuela', 'brasil', 'brazil', 'uruguay', 'paraguay',
  'españa', 'espana', 'estados unidos', 'eeuu', 'usa', 'canadá', 'canada',
  'alemania', 'francia', 'italia', 'reino unido', 'japón', 'china',
  'australia', 'costa rica', 'panamá', 'guatemala', 'honduras',
  'el salvador', 'nicaragua', 'cuba', 'república dominicana',
  'puerto rico', 'india',
]

export function detectarConsultaExtranjera(texto: string): boolean {
  const lower = texto.toLowerCase()
  const patronesBloqueados = [
    /\b(?:ley|leyes|c[oó]digo|normativa|legislaci[oó]n|derecho)\b.*\b(?:en|de|del)\b\s+(?:m[eé]xico|argentina|colombia|per[uú]|bolivia|ecuador|venezuela|brasil|uruguay|paraguay|espa[nñ]a|estados\s+unidos|eeuu)/i,
    /\b(?:tribunal|juzgado|corte)\b.*\b(?:de|en)\b\s+(?:m[eé]xico|argentina|colombia|per[uú]|bolivia)/i,
  ]

  for (const patron of patronesBloqueados) {
    if (patron.test(texto)) return true
  }

  for (const pais of PAISES_BLOQUEADOS_KEYWORDS) {
    if (lower.includes(`ley de ${pais}`) || lower.includes(`leyes de ${pais}`) ||
        lower.includes(`ley en ${pais}`) || lower.includes(`legislación de ${pais}`) ||
        lower.includes(`derecho en ${pais}`) || lower.includes(`código de ${pais}`)) {
      return true
    }
  }

  return false
}
