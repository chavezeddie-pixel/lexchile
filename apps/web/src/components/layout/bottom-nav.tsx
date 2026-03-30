'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
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
  { label: 'Calc', href: '/calculadoras', icon: Calculator },
  { label: 'Historial', href: '/historial', icon: Clock },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-4 lg:hidden">
      <div className="flex items-center justify-around px-2 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors',
                isActive ? 'text-indigo-600' : 'text-gray-400'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
