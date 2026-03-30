'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFechaChile } from '@/lib/utils'

const TIPOS_DOCUMENTO = [
  { value: 'DEMANDA', label: 'Demanda' },
  { value: 'CONTESTACION', label: 'Contestación' },
  { value: 'RECURSO', label: 'Recurso' },
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'PODER', label: 'Poder' },
  { value: 'ESCRITURA', label: 'Escritura' },
  { value: 'CARTA', label: 'Carta' },
  { value: 'INFORME', label: 'Informe' },
  { value: 'OTRO', label: 'Otro' },
]

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDocumentos()
  }, [])

  async function fetchDocumentos() {
    try {
      const res = await fetch('/api/documentos')
      const data = await res.json()
      setDocumentos(data.documentos || [])
    } catch {
      setDocumentos([])
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
      tipo: formData.get('tipo') as string,
      contenido: formData.get('contenido') as string,
    }

    try {
      const res = await fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchDocumentos()
      }
    } catch {
      alert('Error al crear documento')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos Legales</h1>
          <p className="text-gray-600 mt-1">Genera y gestiona documentos legales para Chile.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título *</label>
                  <Input name="titulo" placeholder="Título del documento" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo *</label>
                  <select name="tipo" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {TIPOS_DOCUMENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenido *</label>
                <Textarea name="contenido" placeholder="Contenido del documento legal..." rows={10} required />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Documento'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando documentos...</div>
      ) : documentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No tienes documentos</p>
            <p className="text-gray-400 text-sm mt-1">Crea tu primer documento legal.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {documentos.map((doc: any) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{doc.titulo}</h3>
                    <Badge variant="outline">{TIPOS_DOCUMENTO.find((t) => t.value === doc.tipo)?.label}</Badge>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{formatFechaChile(doc.createdAt)}</span>
                    {doc.caso && <span>Caso: {doc.caso.titulo}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
