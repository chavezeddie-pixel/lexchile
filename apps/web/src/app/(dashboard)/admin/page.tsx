'use client'

import { useState, useEffect } from 'react'
import { Users, Briefcase, MessageSquare, FileText, BookOpen, Scale, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando estadísticas...</div>
  if (!stats) return <div className="text-center py-12 text-gray-500">Sin acceso a estadísticas de administración.</div>

  const cards = [
    { title: 'Usuarios', value: stats.totalUsuarios, icon: Users, color: 'text-blue-600' },
    { title: 'Casos', value: stats.totalCasos, icon: Briefcase, color: 'text-green-600' },
    { title: 'Consultas IA', value: stats.totalConsultas, icon: MessageSquare, color: 'text-purple-600' },
    { title: 'Documentos', value: stats.totalDocumentos, icon: FileText, color: 'text-orange-600' },
    { title: 'Leyes Cargadas', value: stats.totalLeyes, icon: BookOpen, color: 'text-red-600' },
    { title: 'Jurisprudencia', value: stats.totalJurisprudencia, icon: Scale, color: 'text-teal-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-1">Estadísticas generales de la plataforma LexChile.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-5 flex items-center gap-4">
              <card.icon className={`h-10 w-10 ${card.color}`} />
              <div>
                <p className="text-2xl font-bold">{card.value.toLocaleString('es-CL')}</p>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Casos por Área */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Casos por Área Legal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.casosPorArea?.length > 0 ? (
              <div className="space-y-3">
                {stats.casosPorArea.map((item: any) => (
                  <div key={item.areaLegal} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.areaLegal.replace('_', ' ')}</span>
                    <span className="font-semibold">{item._count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin datos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Casos por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.casosPorEstado?.length > 0 ? (
              <div className="space-y-3">
                {stats.casosPorEstado.map((item: any) => (
                  <div key={item.estado} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.estado.replace('_', ' ')}</span>
                    <span className="font-semibold">{item._count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
