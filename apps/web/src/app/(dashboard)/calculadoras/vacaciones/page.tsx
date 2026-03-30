'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sun, Scale, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCLP } from '@/lib/utils'
import { calcularVacaciones, type VacacionesResult } from '@/lib/calculadoras'

export default function VacacionesPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaTermino, setFechaTermino] = useState('')
  const [diasPorAno, setDiasPorAno] = useState('15')
  const [diasTomados, setDiasTomados] = useState('0')
  const [sueldoBase, setSueldoBase] = useState('')
  const [resultado, setResultado] = useState<VacacionesResult | null>(null)

  function handleCalcular(e: React.FormEvent) {
    e.preventDefault()
    if (!fechaInicio || !fechaTermino || !sueldoBase) return

    const result = calcularVacaciones(
      {
        fechaInicio: new Date(fechaInicio),
        fechaTermino: new Date(fechaTermino),
        diasPorAno: Number(diasPorAno) || 15,
        diasTomados: Number(diasTomados) || 0,
      },
      Number(sueldoBase)
    )
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
          <div className="inline-flex rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 p-2.5">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculadora de Vacaciones</h1>
            <p className="text-gray-600 text-sm">
              Calcula tus dias de vacaciones acumulados y su valor en pesos
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
                  Fecha de calculo
                </label>
                <Input
                  type="date"
                  value={fechaTermino}
                  onChange={(e) => setFechaTermino(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dias habiles de vacaciones por ano
                </label>
                <Input
                  type="number"
                  value={diasPorAno}
                  onChange={(e) => setDiasPorAno(e.target.value)}
                  min={15}
                />
                <p className="text-xs text-gray-400 mt-1">Minimo legal: 15 dias habiles</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dias de vacaciones ya tomados
                </label>
                <Input
                  type="number"
                  value={diasTomados}
                  onChange={(e) => setDiasTomados(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
            >
              <Sun className="h-4 w-4 mr-2" />
              Calcular Vacaciones
            </Button>
          </form>
        </CardContent>
      </Card>

      {resultado && (
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                  <div className="text-sm text-green-700 mb-1">Dias acumulados</div>
                  <div className="text-2xl font-bold text-green-800">
                    {resultado.diasAcumulados}
                  </div>
                  <div className="text-xs text-green-600 mt-1">dias habiles</div>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <div className="text-sm text-emerald-700 mb-1">Dias pendientes</div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {resultado.diasPendientes}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">dias por tomar</div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                  <div className="text-sm text-amber-700 mb-1">Valor en pesos</div>
                  <div className="text-2xl font-bold text-amber-800">
                    {formatCLP(resultado.valorEnPesos)}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">compensacion estimada</div>
                </div>
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
                    <li>Art. 67: Feriado anual de 15 dias habiles</li>
                    <li>Art. 68: Feriado progresivo (cada 3 anos sobre 10)</li>
                    <li>Art. 70: Feriado proporcional al termino del contrato</li>
                    <li>Art. 73: Compensacion en dinero de vacaciones pendientes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/consulta?tema=vacaciones">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Consultar con IA sobre mis vacaciones
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-400 pb-4">
            Este calculo es estimativo. Consulte un abogado para asesoramiento profesional.
          </div>
        </div>
      )}
    </div>
  )
}
