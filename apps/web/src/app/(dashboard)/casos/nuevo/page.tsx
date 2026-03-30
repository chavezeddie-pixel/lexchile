'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AREAS_LEGALES, REGIONES_CHILE } from '@/lib/chile'

export default function NuevoCasoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      areaLegal: formData.get('areaLegal') as string,
      region: formData.get('region') as string || undefined,
      rol_causa: formData.get('rol_causa') as string || undefined,
    }

    try {
      const res = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error || 'Error al crear caso')
        setLoading(false)
        return
      }

      const caso = await res.json()
      router.push(`/casos/${caso.id}`)
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Caso Legal</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>
            )}

            <div className="space-y-2">
              <label htmlFor="titulo" className="text-sm font-medium">Título del Caso *</label>
              <Input id="titulo" name="titulo" placeholder="Ej: Despido injustificado" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="text-sm font-medium">Descripción *</label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe los hechos del caso..."
                rows={4}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="areaLegal" className="text-sm font-medium">Área Legal *</label>
                <select
                  id="areaLegal"
                  name="areaLegal"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar área</option>
                  {AREAS_LEGALES.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="region" className="text-sm font-medium">Región</label>
                <select
                  id="region"
                  name="region"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar región</option>
                  {REGIONES_CHILE.map((region) => (
                    <option key={region.codigo} value={region.codigo}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="rol_causa" className="text-sm font-medium">Rol de la Causa (opcional)</label>
              <Input id="rol_causa" name="rol_causa" placeholder="Ej: C-1234-2026" />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Caso'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
