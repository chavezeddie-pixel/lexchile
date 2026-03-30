import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const ley = await prisma.ley.findUnique({
      where: { id: params.id },
      include: {
        modificaciones: { orderBy: { fechaModificacion: 'desc' } },
      },
    })

    if (!ley) {
      return NextResponse.json({ error: 'Ley no encontrada' }, { status: 404 })
    }

    return NextResponse.json(ley)
  } catch (error) {
    console.error('Error al obtener ley:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
