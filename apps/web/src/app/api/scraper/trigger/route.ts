import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).rol !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo administradores pueden ejecutar el scraper' }, { status: 403 })
    }

    // Registrar intento de actualización
    await prisma.auditoria.create({
      data: {
        usuarioId: (session.user as any).id,
        accion: 'TRIGGER_SCRAPER',
        recurso: 'scraper',
        detalles: JSON.stringify({ timestamp: new Date().toISOString() }),
      },
    })

    // En producción, esto dispararía el servicio de scraping
    // Por ahora retorna un mensaje informativo
    return NextResponse.json({
      message: 'Actualización de fuentes legales iniciada',
      fuentes: [
        'Biblioteca del Congreso Nacional (BCN)',
        'Poder Judicial de Chile (PJUD)',
        'Diario Oficial de la República de Chile',
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error en trigger scraper:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
