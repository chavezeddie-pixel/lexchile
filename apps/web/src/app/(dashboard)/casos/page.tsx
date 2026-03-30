'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Briefcase, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFechaChile, formatCLP } from '@/lib/utils'
import { AREAS_LEGALES } from '@/lib/chile'

const ESTADO_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  ABIERTO: { label: 'Abierto', variant: 'default' },
  EN_PROCESO: { label: 'En Proceso', variant: 'warning' },
  EN_AUDIENCIA: { label: 'En Audiencia', variant: 'warning' },
  SENTENCIA: { label: 'Sentencia', variant: 'success' },
  APELACION: { label: 'Apelación', variant: 'destructive' },
  CERRADO: { label: 'Cerrado', variant: 'secondary' },
  ARCHIVADO: { label: 'Archivado', variant: 'secondary' },
}

export default function CasosPage() {
  const [casos, setCasos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroArea, setFiltroArea] = useState('')

  useEffect(() => {
    fetchCasos()
  }, [filtroArea])

  async function fetchCasos() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroArea) params.set('areaLegal', filtroArea)
      const res = await fetch(`/api/casos?${params}`)
      const data = await res.json()
      setCasos(data.casos || [])
    } catch {
      setCasos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Casos</h1>
          <p className="text-gray-600 mt-1">Gestiona tus casos legales en tribunales chilenos.</p>
        </div>
        <Link href="/casos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Caso
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas las áreas</option>
          {AREAS_LEGALES.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de casos */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando casos...</div>
      ) : casos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No tienes casos registrados</p>
            <p className="text-gray-400 text-sm mb-6">Crea tu primer caso legal para comenzar.</p>
            <Link href="/casos/nuevo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Caso
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {casos.map((caso: any) => {
            const estadoInfo = ESTADO_LABELS[caso.estado] || { label: caso.estado, variant: 'default' as const }
            return (
              <Link key={caso.id} href={`/casos/${caso.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{caso.titulo}</h3>
                          <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{caso.descripcion}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          <span>Área: {AREAS_LEGALES.find((a) => a.value === caso.areaLegal)?.label}</span>
                          {caso.tribunal && <span>Tribunal: {caso.tribunal.nombre}</span>}
                          {caso.region && <span>Región: {caso.region}</span>}
                          <span>Inicio: {formatFechaChile(caso.fechaInicio)}</span>
                          {caso.costoCLP && <span>Costo: {formatCLP(caso.costoCLP)}</span>}
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span>{caso._count?.consultas || 0} consultas</span>
                        <span>{caso._count?.documentos || 0} docs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
