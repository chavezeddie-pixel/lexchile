import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { eventoSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const desde = searchParams.get('desde')
    const hasta = searchParams.get('hasta')

    const where: any = { usuarioId: userId }
    if (desde || hasta) {
      where.fecha = {}
      if (desde) where.fecha.gte = new Date(desde)
      if (hasta) where.fecha.lte = new Date(hasta)
    }

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { fecha: 'asc' },
      include: {
        caso: { select: { id: true, titulo: true } },
        tribunal: { select: { id: true, nombre: true } },
      },
    })

    return NextResponse.json({ eventos })
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = eventoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const userId = (session.user as any).id
    const evento = await prisma.evento.create({
      data: {
        ...parsed.data,
        fecha: new Date(parsed.data.fecha),
        casoId: parsed.data.casoId || null,
        tribunalId: parsed.data.tribunalId || null,
        usuarioId: userId,
      },
    })

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    console.error('Error al crear evento:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
