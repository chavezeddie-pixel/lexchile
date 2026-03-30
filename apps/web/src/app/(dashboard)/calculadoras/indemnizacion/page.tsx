'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Scale, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCLP } from '@/lib/utils'
import { calcularIndemnizacion, type IndemnizacionResult } from '@/lib/calculadoras'

const CAUSALES_161 = [
  { value: 'art161_1' as const, label: 'Necesidades de la empresa - Art. 161 inc. 1' },
  { value: 'art161_2' as const, label: 'Desahucio del empleador - Art. 161 inc. 2' },
]

export default function IndemnizacionPage() {
  const [sueldoBase, setSueldoBase] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaTermino, setFechaTermino] = useState('')
  const [causal, setCausal] = useState<'art161_1' | 'art161_2'>('art161_1')
  const [resultado, setResultado] = useState<IndemnizacionResult | null>(null)

  function handleCalcular(e: React.FormEvent) {
    e.preventDefault()
    if (!sueldoBase || !fechaInicio || !fechaTermino) return

    const result = calcularIndemnizacion({
      sueldoBase: Number(sueldoBase),
      fechaInicio: new Date(fechaInicio),
      fechaTermino: new Date(fechaTermino),
      causal,
    })
    setResultado(result)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/calculadoras"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a calculadoras
        </Link>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-gradient-to-br from-red-400 to-rose-500 p-2.5">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculadora de Indemnizacion</h1>
            <p className="text-gray-600 text-sm">
              Estima tu indemnizacion por anos de servicio segun el Art. 161 del Codigo del Trabajo
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleCalcular} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sueldo base mensual (bruto)
              </label>
              <Input
                type="number"
                placeholder="Ej: 800000"
                value={sueldoBase}
                onChange={(e) => setSueldoBase(e.target.value)}
                required
                min={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fecha inicio contrato
                </label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fecha de despido
                </label>
                <Input
                  type="date"
                  value={fechaTermino}
                  onChange={(e) => setFechaTermino(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Causal de despido
              </label>
              <select
                value={causal}
                onChange={(e) => setCausal(e.target.value as 'art161_1' | 'art161_2')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CAUSALES_161.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                La indemnizacion por anos de servicio aplica solo para despidos bajo el Art. 161
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Calcular Indemnizacion
            </Button>
          </form>
        </CardContent>
      </Card>

      {resultado && (
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desglose de la Indemnizacion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                Tiempo trabajado: {resultado.anosServicio} anos
              </div>

              {resultado.detalles.map((detalle, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      {detalle.concepto}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {detalle.explicacion}
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-gray-900 ml-4 whitespace-nowrap">
                    {formatCLP(detalle.monto)}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total estimado</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatCLP(resultado.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Fuentes legales</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>Art. 161: Necesidades de la empresa y desahucio</li>
                    <li>Art. 162 inc. 4: Indemnizacion sustitutiva del aviso previo</li>
                    <li>Art. 163: Indemnizacion por anos de servicio (tope 11 anos)</li>
                    <li>Art. 172: Tope de 90 UF mensuales para calculo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/consulta?tema=indemnizacion">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Consultar con IA sobre mi indemnizacion
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-400 pb-4">
            Este calculo es estimativo. Valor UF referencial: $38.500. Consulte un abogado para
            asesoramiento profesional.
          </div>
        </div>
      )}
    </div>
  )
}
