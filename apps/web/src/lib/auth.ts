import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
    newUser: '/registro',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.activo) {
          throw new Error('Credenciales inválidas')
        }

        const isValid = await compare(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error('Credenciales inválidas')
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.nombre} ${user.apellido}`,
          rol: user.rol,
          rut: user.rut,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = (user as any).rol
        token.rut = (user as any).rut
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).rol = token.rol
        ;(session.user as any).rut = token.rut
      }
      return session
    },
  },
}
