'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Scale,
  MessageSquare,
  BookOpen,
  LayoutGrid,
  Calculator,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Consulta', href: '/consulta', icon: MessageSquare },
  { label: 'Leyes', href: '/leyes', icon: BookOpen },
  { label: 'Temas', href: '/temas', icon: LayoutGrid },
  { label: 'Calculadoras', href: '/calculadoras', icon: Calculator },
  { label: 'Historial', href: '/historial', icon: Clock },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between border-b bg-white px-8">
      <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
        <Scale className="h-6 w-6" />
        <span>LexChile</span>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                isActive
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="w-[120px]" />
    </header>
  )
}
