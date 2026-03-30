'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  MessageSquare,
  BookOpen,
  Scale,
  Home,
} from 'lucide-react'

const navigation = [
  { name: 'Consulta Legal', href: '/consulta', icon: MessageSquare },
  { name: 'Leyes Chilenas', href: '/leyes', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">LexChile</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col" aria-label="Navegacion principal">
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pb-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Herramienta informativa. No reemplaza asesoria legal profesional.
            </p>
          </div>
        </nav>
      </div>
    </aside>
  )
}
