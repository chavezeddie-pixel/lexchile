import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { documentoSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const casoId = searchParams.get('casoId')

    const where: any = { usuarioId: userId }
    if (tipo) where.tipo = tipo
    if (casoId) where.casoId = casoId

    const documentos = await prisma.documento.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        caso: { select: { id: true, titulo: true } },
        plantilla: { select: { id: true, nombre: true } },
      },
    })

    return NextResponse.json({ documentos })
  } catch (error) {
    console.error('Error al obtener documentos:', error)
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
    const parsed = documentoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const userId = (session.user as any).id
    const documento = await prisma.documento.create({
      data: {
        ...parsed.data,
        casoId: parsed.data.casoId || null,
        plantillaId: parsed.data.plantillaId || null,
        usuarioId: userId,
      },
    })

    await prisma.auditoria.create({
      data: {
        usuarioId: userId,
        accion: 'CREAR_DOCUMENTO',
        recurso: 'documento',
        detalles: JSON.stringify({ documentoId: documento.id, tipo: documento.tipo }),
      },
    })

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error('Error al crear documento:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
