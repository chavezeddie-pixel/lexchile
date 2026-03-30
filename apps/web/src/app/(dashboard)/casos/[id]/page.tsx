'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, MessageSquare, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFechaChile, formatCLP } from '@/lib/utils'
import { AREAS_LEGALES } from '@/lib/chile'

export default function CasoDetallePage() {
  const { id } = useParams()
  const router = useRouter()
  const [caso, setCaso] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCaso()
  }, [id])

  async function fetchCaso() {
    try {
      const res = await fetch(`/api/casos/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCaso(data)
    } catch {
      setCaso(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este caso?')) return
    try {
      await fetch(`/api/casos/${id}`, { method: 'DELETE' })
      router.push('/casos')
    } catch {
      alert('Error al eliminar el caso')
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando caso...</div>
  if (!caso) return <div className="text-center py-12 text-gray-500">Caso no encontrado</div>

  const areaLabel = AREAS_LEGALES.find((a) => a.value === caso.areaLegal)?.label

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver a Casos
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{caso.titulo}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{areaLabel}</Badge>
            <Badge variant="secondary">{caso.estado.replace('_', ' ')}</Badge>
            {caso.region && <Badge variant="outline">Región {caso.region}</Badge>}
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{caso.descripcion}</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">Fecha Inicio</p>
                <p className="font-medium">{formatFechaChile(caso.fechaInicio)}</p>
              </div>
              {caso.tribunal && (
                <div>
                  <p className="text-xs text-gray-500">Tribunal</p>
                  <p className="font-medium">{caso.tribunal.nombre}</p>
                </div>
              )}
              {caso.costoCLP && (
                <div>
                  <p className="text-xs text-gray-500">Costo</p>
                  <p className="font-medium">{formatCLP(caso.costoCLP)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consultas del caso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Consultas ({caso.consultas?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caso.consultas?.length > 0 ? (
              <div className="space-y-3">
                {caso.consultas.map((c: any) => (
                  <div key={c.id} className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{c.pregunta}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatFechaChile(c.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay consultas asociadas a este caso.</p>
            )}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos ({caso.documentos?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caso.documentos?.length > 0 ? (
              <div className="space-y-2">
                {caso.documentos.map((d: any) => (
                  <div key={d.id} className="flex justify-between items-center border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{d.titulo}</p>
                      <p className="text-xs text-gray-500">{d.tipo} - {formatFechaChile(d.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay documentos asociados a este caso.</p>
            )}
          </CardContent>
        </Card>

        {/* Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda ({caso.eventos?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caso.eventos?.length > 0 ? (
              <div className="space-y-2">
                {caso.eventos.map((e: any) => (
                  <div key={e.id} className="flex justify-between items-center border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{e.titulo}</p>
                      <p className="text-xs text-gray-500">{e.tipo} - {formatFechaChile(e.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay eventos asociados a este caso.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
