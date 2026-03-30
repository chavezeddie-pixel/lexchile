import { PrismaClient } from '@prisma/client'
import { existsSync, copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// En Railway/produccion, copiar la DB bundleada a un lugar escribible
function ensureDatabase() {
  const runtimeDb = '/tmp/lexchile/dev.db'
  if (!existsSync(runtimeDb)) {
    // Buscar la DB en el proyecto
    const possiblePaths = [
      join(process.cwd(), '../../packages/database/prisma/dev.db'),
      join(process.cwd(), '../packages/database/prisma/dev.db'),
      join(process.cwd(), 'packages/database/prisma/dev.db'),
    ]
    for (const src of possiblePaths) {
      if (existsSync(src)) {
        mkdirSync('/tmp/lexchile', { recursive: true })
        copyFileSync(src, runtimeDb)
        console.log(`DB copied from ${src} to ${runtimeDb}`)
        break
      }
    }
  }
}

try {
  ensureDatabase()
} catch (e) {
  console.warn('Could not ensure database:', e)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
