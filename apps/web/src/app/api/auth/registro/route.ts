import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registroSchema } from '@/lib/validations'
import { validarRut } from '@/lib/chile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, apellido, email, rut, telefono, password } = body

    if (!validarRut(rut)) {
      return NextResponse.json({ error: 'RUT inválido' }, { status: 400 })
    }

    const existingUser = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { rut }] },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'El email ya está registrado' : 'El RUT ya está registrado' },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        rut,
        telefono: telefono || null,
        passwordHash,
        rol: 'CLIENTE',
      },
    })

    await prisma.auditoria.create({
      data: {
        usuarioId: user.id,
        accion: 'REGISTRO',
        recurso: 'usuario',
        detalles: JSON.stringify({ email: user.email }),
      },
    })

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
