'use client'

import Link from 'next/link'
import { Calculator, TrendingUp, Sun } from 'lucide-react'

const calculadoras = [
  {
    titulo: 'Finiquito',
    descripcion: 'Calcula cuanto te corresponde al terminar tu contrato',
    href: '/calculadoras/finiquito',
    icon: Calculator,
    gradient: 'from-orange-400 to-amber-500',
    hoverGradient: 'hover:from-orange-500 hover:to-amber-600',
    shadow: 'shadow-orange-200',
  },
  {
    titulo: 'Indemnizacion',
    descripcion: 'Estima tu indemnizacion por anos de servicio',
    href: '/calculadoras/indemnizacion',
    icon: TrendingUp,
    gradient: 'from-red-400 to-rose-500',
    hoverGradient: 'hover:from-red-500 hover:to-rose-600',
    shadow: 'shadow-red-200',
  },
  {
    titulo: 'Vacaciones',
    descripcion: 'Calcula tus vacaciones proporcionales',
    href: '/calculadoras/vacaciones',
    icon: Sun,
    gradient: 'from-emerald-400 to-green-500',
    hoverGradient: 'hover:from-emerald-500 hover:to-green-600',
    shadow: 'shadow-green-200',
  },
]

export default function CalculadorasPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calculadoras Legales</h1>
        <p className="text-gray-600 mt-1">
          Herramientas para estimar tus derechos laborales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calculadoras.map((calc) => {
          const Icon = calc.icon
          return (
            <Link key={calc.href} href={calc.href}>
              <div
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${calc.gradient} ${calc.hoverGradient} p-6 text-white shadow-lg ${calc.shadow} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-full`}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-32 w-32 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{calc.titulo}</h2>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {calc.descripcion}
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    Calcular
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
