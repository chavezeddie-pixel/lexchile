import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const caso = await prisma.caso.findUnique({
      where: { id: params.id },
      include: {
        tribunal: true,
        consultas: { orderBy: { createdAt: 'desc' }, take: 10 },
        documentos: { orderBy: { createdAt: 'desc' } },
        eventos: { orderBy: { fecha: 'asc' } },
      },
    })

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })
    }

    if (caso.usuarioId !== (session.user as any).id && (session.user as any).rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json(caso)
  } catch (error) {
    console.error('Error al obtener caso:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const existing = await prisma.caso.findUnique({ where: { id: params.id } })
    if (!existing || existing.usuarioId !== userId) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const caso = await prisma.caso.update({
      where: { id: params.id },
      data: body,
    })

    await prisma.auditoria.create({
      data: {
        usuarioId: userId,
        accion: 'ACTUALIZAR_CASO',
        recurso: 'caso',
        detalles: JSON.stringify({ casoId: caso.id }),
      },
    })

    return NextResponse.json(caso)
  } catch (error) {
    console.error('Error al actualizar caso:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const existing = await prisma.caso.findUnique({ where: { id: params.id } })
    if (!existing || existing.usuarioId !== userId) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })
    }

    await prisma.caso.delete({ where: { id: params.id } })

    await prisma.auditoria.create({
      data: {
        usuarioId: userId,
        accion: 'ELIMINAR_CASO',
        recurso: 'caso',
        detalles: JSON.stringify({ casoId: params.id }),
      },
    })

    return NextResponse.json({ message: 'Caso eliminado' })
  } catch (error) {
    console.error('Error al eliminar caso:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
