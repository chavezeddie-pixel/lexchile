import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const area = searchParams.get('area')
    const estado = searchParams.get('estado') || 'VIGENTE'
    const tipo = searchParams.get('tipo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (estado) where.estado = estado
    if (area) where.areaLegal = area
    if (tipo) where.tipo = tipo

    if (q) {
      const keywords = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
      if (keywords.length > 0) {
        where.OR = keywords.map((kw) => ({
          OR: [
            { textoCompleto: { contains: kw } },
            { nombre: { contains: kw } },
            { resumen: { contains: kw } },
          ],
        }))
      }
    }

    const [leyes, total] = await Promise.all([
      prisma.ley.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          numero: true,
          tipo: true,
          resumen: true,
          areaLegal: true,
          fechaPublicacion: true,
          estado: true,
          fuenteUrl: true,
        },
        orderBy: { fechaPublicacion: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.ley.count({ where }),
    ])

    return NextResponse.json({ leyes, total, page, limit })
  } catch (error) {
    console.error('Error al buscar leyes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
