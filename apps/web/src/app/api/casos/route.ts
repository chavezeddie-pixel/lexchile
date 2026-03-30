import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { casoSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const areaLegal = searchParams.get('areaLegal')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { usuarioId: userId }
    if (estado) where.estado = estado
    if (areaLegal) where.areaLegal = areaLegal

    const [casos, total] = await Promise.all([
      prisma.caso.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          tribunal: { select: { id: true, nombre: true, tipo: true } },
          _count: { select: { consultas: true, documentos: true, eventos: true } },
        },
      }),
      prisma.caso.count({ where }),
    ])

    return NextResponse.json({ casos, total, page, limit })
  } catch (error) {
    console.error('Error al obtener casos:', error)
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
    const parsed = casoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const userId = (session.user as any).id
    const caso = await prisma.caso.create({
      data: {
        ...parsed.data,
        tribunalId: parsed.data.tribunalId || null,
        region: parsed.data.region || null,
        rol_causa: parsed.data.rol_causa || null,
        usuarioId: userId,
      },
    })

    await prisma.auditoria.create({
      data: {
        usuarioId: userId,
        accion: 'CREAR_CASO',
        recurso: 'caso',
        detalles: JSON.stringify({ casoId: caso.id }),
      },
    })

    return NextResponse.json(caso, { status: 201 })
  } catch (error) {
    console.error('Error al crear caso:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
