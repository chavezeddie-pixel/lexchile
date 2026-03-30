'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFechaHoraChile } from '@/lib/utils'

const TIPOS_EVENTO = [
  { value: 'AUDIENCIA', label: 'Audiencia' },
  { value: 'PLAZO_LEGAL', label: 'Plazo Legal' },
  { value: 'REUNION', label: 'Reunión' },
  { value: 'VENCIMIENTO', label: 'Vencimiento' },
  { value: 'OTRO', label: 'Otro' },
]

export default function AgendaPage() {
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEventos()
  }, [])

  async function fetchEventos() {
    try {
      const res = await fetch('/api/agenda')
      const data = await res.json()
      setEventos(data.eventos || [])
    } catch {
      setEventos([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      fecha: formData.get('fecha') as string,
      tipo: formData.get('tipo') as string,
      recordatorio: true,
    }

    try {
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchEventos()
      }
    } catch {
      alert('Error al crear evento')
    } finally {
      setSaving(false)
    }
  }

  const now = new Date()
  const eventosProximos = eventos.filter((e) => new Date(e.fecha) >= now)
  const eventosPasados = eventos.filter((e) => new Date(e.fecha) < now)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Legal</h1>
          <p className="text-gray-600 mt-1">Gestiona audiencias, plazos legales y reuniones.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nuevo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título *</label>
                  <Input name="titulo" placeholder="Ej: Audiencia preparatoria" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo *</label>
                  <select name="tipo" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {TIPOS_EVENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha y Hora *</label>
                <Input name="fecha" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea name="descripcion" placeholder="Detalles del evento..." rows={3} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear Evento'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando agenda...</div>
      ) : eventos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No tienes eventos programados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {eventosProximos.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Próximos Eventos</h2>
              <div className="space-y-3">
                {eventosProximos.map((evento: any) => (
                  <Card key={evento.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{evento.titulo}</h3>
                            <Badge variant="outline">{TIPOS_EVENTO.find((t) => t.value === evento.tipo)?.label}</Badge>
                          </div>
                          {evento.descripcion && <p className="text-sm text-gray-600 mt-1">{evento.descripcion}</p>}
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatFechaHoraChile(evento.fecha)}
                            </span>
                            {evento.caso && <span>Caso: {evento.caso.titulo}</span>}
                            {evento.tribunal && <span>Tribunal: {evento.tribunal.nombre}</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {eventosPasados.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-500 mb-3">Eventos Pasados</h2>
              <div className="space-y-2 opacity-60">
                {eventosPasados.slice(0, 5).map((evento: any) => (
                  <Card key={evento.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">{evento.titulo}</span>
                        <span className="text-xs text-gray-500 ml-2">{formatFechaHoraChile(evento.fecha)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
