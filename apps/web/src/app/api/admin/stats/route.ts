import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const [
      totalUsuarios,
      totalCasos,
      totalConsultas,
      totalDocumentos,
      totalLeyes,
      totalJurisprudencia,
      casosPorArea,
      casosPorEstado,
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.caso.count(),
      prisma.consulta.count(),
      prisma.documento.count(),
      prisma.ley.count(),
      prisma.jurisprudencia.count(),
      prisma.caso.groupBy({ by: ['areaLegal'], _count: true }),
      prisma.caso.groupBy({ by: ['estado'], _count: true }),
    ])

    return NextResponse.json({
      totalUsuarios,
      totalCasos,
      totalConsultas,
      totalDocumentos,
      totalLeyes,
      totalJurisprudencia,
      casosPorArea,
      casosPorEstado,
    })
  } catch (error) {
    console.error('Error en stats:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
