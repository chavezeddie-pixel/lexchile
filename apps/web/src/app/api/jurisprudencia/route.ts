import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const area = searchParams.get('area')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (area) where.areaLegal = area

    if (q) {
      const keywords = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
      if (keywords.length > 0) {
        where.OR = keywords.map((kw) => ({
          OR: [
            { texto: { contains: kw } },
            { materia: { contains: kw } },
            { resumen: { contains: kw } },
          ],
        }))
      }
    }

    const [jurisprudencia, total] = await Promise.all([
      prisma.jurisprudencia.findMany({
        where,
        select: {
          id: true,
          rol: true,
          fecha: true,
          materia: true,
          areaLegal: true,
          resumen: true,
          resultado: true,
          fuenteUrl: true,
          tribunal: { select: { nombre: true, tipo: true } },
        },
        orderBy: { fecha: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.jurisprudencia.count({ where }),
    ])

    return NextResponse.json({ jurisprudencia, total, page, limit })
  } catch (error) {
    console.error('Error al buscar jurisprudencia:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
