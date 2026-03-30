'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Scale,
  Menu,
  X,
  MessageSquare,
  BookOpen,
} from 'lucide-react'

const navigation = [
  { name: 'Consulta Legal', href: '/consulta', icon: MessageSquare },
  { name: 'Leyes Chilenas', href: '/leyes', icon: BookOpen },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 lg:hidden">
      <nav className="flex items-center justify-between bg-white border-b px-4 py-3" aria-label="Navegacion movil">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-primary">LexChile</span>
        </Link>
        <button
          type="button"
          className="p-2 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50',
                  'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
