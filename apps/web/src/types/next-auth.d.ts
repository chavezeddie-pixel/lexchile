import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      rol: 'ADMIN' | 'ABOGADO' | 'CLIENTE'
      rut: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    rol: 'ADMIN' | 'ABOGADO' | 'CLIENTE'
    rut: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    rol: 'ADMIN' | 'ABOGADO' | 'CLIENTE'
    rut: string
  }
}
