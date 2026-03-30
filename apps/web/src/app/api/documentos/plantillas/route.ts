import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area')
    const tipo = searchParams.get('tipo')

    const where: any = { activo: true }
    if (area) where.areaLegal = area
    if (tipo) where.tipo = tipo

    const plantillas = await prisma.plantillaDocumento.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        tipo: true,
        areaLegal: true,
        variables: true,
      },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json({ plantillas })
  } catch (error) {
    console.error('Error al obtener plantillas:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
