'use client'

import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Scale,
  Shield,
  Heart,
  ShoppingCart,
  Receipt,
  Home,
  Building2,
  FileText,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { AREA_CONFIG } from '@/lib/area-colors'

const AREA_ICONS: Record<string, React.ElementType> = {
  LABORAL: Briefcase,
  CIVIL: Scale,
  PENAL: Shield,
  FAMILIA: Heart,
  CONSUMIDOR: ShoppingCart,
  TRIBUTARIO: Receipt,
  ARRENDAMIENTO: Home,
  COMERCIAL: Building2,
  ADMINISTRATIVO: FileText,
}

const AREA_TOPICS: Record<string, string[]> = {
  LABORAL: [
    'Despido injustificado',
    'Finiquito',
    'Contrato de trabajo',
    'Vacaciones',
    'Licencia medica',
    'Acoso laboral',
  ],
  CIVIL: [
    'Contratos',
    'Cobranza de deudas',
    'Herencia y sucesion',
    'Responsabilidad civil',
  ],
  PENAL: [
    'Como hacer una denuncia',
    'Querella criminal',
    'Defensa penal',
    'Violencia intrafamiliar',
  ],
  FAMILIA: [
    'Divorcio',
    'Pension alimenticia',
    'Cuidado personal',
    'Adopcion',
    'Regimen de visitas',
  ],
  CONSUMIDOR: [
    'Reclamo SERNAC',
    'Garantia legal',
    'Devolucion de producto',
    'Publicidad enganosa',
    'Cobranza abusiva',
  ],
  TRIBUTARIO: [
    'Declaracion de renta',
    'Boletas de honorarios',
    'IVA',
    'Fiscalizacion SII',
  ],
  ARRENDAMIENTO: [
    'Contrato de arriendo',
    'Desahucio',
    'Subida de arriendo',
    'Reparaciones',
    'Devolucion de garantia',
  ],
  COMERCIAL: [
    'Crear empresa',
    'Tipos de sociedades',
    'Patente municipal',
    'Quiebra personal',
  ],
  ADMINISTRATIVO: [
    'Reclamo municipal',
    'Permiso de circulacion',
    'Procedimiento administrativo',
  ],
}

export default function TemasPage() {
  const router = useRouter()

  const handleTopicClick = (topic: string) => {
    router.push(`/consulta?tema=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Que necesitas consultar?
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un tema para iniciar tu consulta legal
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(AREA_TOPICS).map(([areaKey, topics]) => {
          const config = AREA_CONFIG[areaKey]
          const Icon = AREA_ICONS[areaKey]
          if (!config || !Icon) return null

          return (
            <Card
              key={areaKey}
              className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${config.gradient} px-4 py-5 flex items-center gap-3`}>
                <div className="rounded-lg bg-white/20 p-2">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold text-white text-lg">
                  {config.label}
                </h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${config.bg} ${config.text} hover:opacity-80`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
