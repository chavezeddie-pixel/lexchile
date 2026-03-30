'use client'

import { useState, useEffect } from 'react'
import { Search, BookOpen, ExternalLink, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFechaChile } from '@/lib/utils'
import { AREAS_LEGALES } from '@/lib/chile'

const TIPO_LABELS: Record<string, string> = {
  LEY: 'Ley', DFL: 'DFL', DL: 'D.L.', DS: 'D.S.',
  AUTO_ACORDADO: 'Auto Acordado', CODIGO: 'Codigo',
  REGLAMENTO: 'Reglamento', CIRCULAR: 'Circular', DICTAMEN: 'Dictamen',
}

const AREA_COLORS: Record<string, string> = {
  LABORAL: 'bg-orange-100 text-orange-700 border-orange-300',
  CIVIL: 'bg-blue-100 text-blue-700 border-blue-300',
  PENAL: 'bg-red-100 text-red-700 border-red-300',
  FAMILIA: 'bg-pink-100 text-pink-700 border-pink-300',
  CONSUMIDOR: 'bg-green-100 text-green-700 border-green-300',
  TRIBUTARIO: 'bg-violet-100 text-violet-700 border-violet-300',
  ARRENDAMIENTO: 'bg-teal-100 text-teal-700 border-teal-300',
  COMERCIAL: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  ADMINISTRATIVO: 'bg-slate-100 text-slate-700 border-slate-300',
}

const AREA_BORDER: Record<string, string> = {
  LABORAL: 'border-l-orange-400', CIVIL: 'border-l-blue-400',
  PENAL: 'border-l-red-400', FAMILIA: 'border-l-pink-400',
  CONSUMIDOR: 'border-l-green-400', TRIBUTARIO: 'border-l-violet-400',
  ARRENDAMIENTO: 'border-l-teal-400', COMERCIAL: 'border-l-cyan-400',
  ADMINISTRATIVO: 'border-l-slate-400',
}

export default function LeyesPage() {
  const [leyes, setLeyes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filtroArea, setFiltroArea] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    fetchLeyes(1)
  }, [filtroArea])

  async function fetchLeyes(p = page) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '10' })
      if (filtroArea) params.set('area', filtroArea)
      if (query.trim()) params.set('q', query.trim())
      const res = await fetch(`/api/leyes?${params}`)
      const data = await res.json()
      setLeyes(data.leyes || [])
      setTotal(data.total || 0)
    } catch {
      setLeyes([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchLeyes(1)
  }

  function goToPage(p: number) {
    setPage(p)
    fetchLeyes(p)
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Leyes Chilenas
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Busca y consulta la legislacion vigente de la Republica de Chile.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar leyes, codigos, normativa..."
              className="pl-11 h-12 rounded-xl text-base border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
            Buscar
          </Button>
        </div>
      </form>

      {/* Area filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltroArea('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !filtroArea
              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          Todas
        </button>
        {AREAS_LEGALES.map((area) => (
          <button
            key={area.value}
            onClick={() => setFiltroArea(filtroArea === area.value ? '' : area.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filtroArea === area.value
                ? AREA_COLORS[area.value] || 'bg-gray-100 text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Scale className="h-8 w-8 animate-pulse mx-auto mb-3 text-indigo-300" />
          <p>Buscando en legislacion chilena...</p>
        </div>
      ) : leyes.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center py-16">
            <BookOpen className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg mb-1">No se encontraron leyes</p>
            <p className="text-gray-400 text-sm">Intenta con otros terminos de busqueda.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {leyes.map((ley: any) => (
              <Card
                key={ley.id}
                className={`border-0 shadow-sm hover:shadow-md transition-all border-l-4 ${
                  AREA_BORDER[ley.areaLegal] || 'border-l-gray-300'
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{ley.nombre}</h3>
                        <Badge variant="outline" className="text-[10px] rounded-full">{TIPO_LABELS[ley.tipo] || ley.tipo}</Badge>
                        <Badge variant={ley.estado === 'VIGENTE' ? 'success' : 'secondary'} className="text-[10px] rounded-full">
                          {ley.estado}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">N {ley.numero}</p>
                      {ley.resumen && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ley.resumen}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {ley.areaLegal && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${AREA_COLORS[ley.areaLegal] || ''}`}>
                            {AREAS_LEGALES.find((a) => a.value === ley.areaLegal)?.label}
                          </span>
                        )}
                        <span>Publicada: {formatFechaChile(ley.fechaPublicacion)}</span>
                      </div>
                    </div>
                    {ley.fuenteUrl && (
                      <a
                        href={ley.fuenteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-600 transition-colors shrink-0"
                        title="Ver en leychile.cl"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-xl"
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-500 px-3">
                {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-xl"
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
