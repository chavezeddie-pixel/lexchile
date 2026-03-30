import { differenceInMonths, differenceInDays, differenceInYears } from 'date-fns'

// UF value (referential, March 2026)
const UF_VALUE = 38500

export type CausalDespido =
  | 'art159_1'
  | 'art159_2'
  | 'art159_4'
  | 'art159_5'
  | 'art160'
  | 'art161_1'
  | 'art161_2'

export interface FiniquitoInput {
  sueldoBase: number
  fechaInicio: Date
  fechaTermino: Date
  causal: CausalDespido
  diasVacacionesPendientes: number
  incluyeGratificacion: boolean
}

export interface FiniquitoResult {
  anosServicio: number
  mesesServicio: number
  remuneracionPendiente: number
  vacacionesProporcionales: number
  indemnizacionAnosServicio: number
  indemnizacionAvisoPrevio: number
  gratificacionProporcional: number
  total: number
  detalles: Array<{ concepto: string; monto: number; explicacion: string }>
}

export interface VacacionesInput {
  fechaInicio: Date
  fechaTermino: Date
  diasPorAno: number
  diasTomados: number
}

export interface VacacionesResult {
  diasAcumulados: number
  diasPendientes: number
  valorEnPesos: number
}

export interface IndemnizacionInput {
  sueldoBase: number
  fechaInicio: Date
  fechaTermino: Date
  causal: 'art161_1' | 'art161_2'
}

export interface IndemnizacionResult {
  anosServicio: number
  montoPorAno: number
  indemnizacionAnosServicio: number
  indemnizacionAvisoPrevio: number
  total: number
  detalles: Array<{ concepto: string; monto: number; explicacion: string }>
}

export function calcularFiniquito(input: FiniquitoInput): FiniquitoResult {
  const {
    sueldoBase,
    fechaInicio,
    fechaTermino,
    causal,
    diasVacacionesPendientes,
    incluyeGratificacion,
  } = input

  const anosServicio = differenceInYears(fechaTermino, fechaInicio)
  const mesesServicio = differenceInMonths(fechaTermino, fechaInicio)
  const topeRemuneracion = 90 * UF_VALUE
  const sueldoParaCalculo = Math.min(sueldoBase, topeRemuneracion)

  const detalles: Array<{ concepto: string; monto: number; explicacion: string }> = []

  // Dias trabajados del ultimo mes (remuneracion pendiente)
  const mesTermino = new Date(fechaTermino.getFullYear(), fechaTermino.getMonth(), 1)
  const diasDelMes = differenceInDays(fechaTermino, mesTermino)
  const remuneracionPendiente = diasDelMes > 0 ? Math.round((sueldoBase / 30) * diasDelMes) : 0

  if (remuneracionPendiente > 0) {
    detalles.push({
      concepto: 'Remuneracion pendiente',
      monto: remuneracionPendiente,
      explicacion: `${diasDelMes} dias del ultimo mes trabajado`,
    })
  }

  // Vacaciones proporcionales
  const vacacionesProporcionales = Math.round((sueldoBase / 30) * diasVacacionesPendientes)
  if (vacacionesProporcionales > 0) {
    detalles.push({
      concepto: 'Vacaciones proporcionales',
      monto: vacacionesProporcionales,
      explicacion: `${diasVacacionesPendientes} dias pendientes a ${Math.round(sueldoBase / 30)}/dia`,
    })
  }

  // Gratificacion proporcional
  let gratificacionProporcional = 0
  if (incluyeGratificacion) {
    const mesesEnAno = fechaTermino.getMonth() + 1
    gratificacionProporcional = Math.round((sueldoBase * 0.25 * mesesEnAno) / 12)
    detalles.push({
      concepto: 'Gratificacion proporcional',
      monto: gratificacionProporcional,
      explicacion: `25% del sueldo proporcional a ${mesesEnAno} meses trabajados en el ano`,
    })
  }

  // Indemnizacion por anos de servicio (solo Art. 161)
  let indemnizacionAnosServicio = 0
  if (causal === 'art161_1' || causal === 'art161_2') {
    const anosTope = Math.min(anosServicio, 11)
    indemnizacionAnosServicio = anosTope * sueldoParaCalculo
    if (indemnizacionAnosServicio > 0) {
      detalles.push({
        concepto: 'Indemnizacion por anos de servicio',
        monto: indemnizacionAnosServicio,
        explicacion: `${anosTope} anos x ${sueldoBase > topeRemuneracion ? 'tope 90 UF' : 'sueldo base'} (Art. 163 CT)`,
      })
    }
  }

  // Indemnizacion sustitutiva del aviso previo (Art. 161 sin aviso de 30 dias)
  let indemnizacionAvisoPrevio = 0
  if (causal === 'art161_1' || causal === 'art161_2') {
    indemnizacionAvisoPrevio = sueldoParaCalculo
    detalles.push({
      concepto: 'Indemnizacion sustitutiva aviso previo',
      monto: indemnizacionAvisoPrevio,
      explicacion: '1 mes de remuneracion (Art. 162 inc. 4 CT)',
    })
  }

  const total =
    remuneracionPendiente +
    vacacionesProporcionales +
    gratificacionProporcional +
    indemnizacionAnosServicio +
    indemnizacionAvisoPrevio

  return {
    anosServicio,
    mesesServicio,
    remuneracionPendiente,
    vacacionesProporcionales,
    indemnizacionAnosServicio,
    indemnizacionAvisoPrevio,
    gratificacionProporcional,
    total,
    detalles,
  }
}

export function calcularVacaciones(input: VacacionesInput, sueldoBase: number): VacacionesResult {
  const { fechaInicio, fechaTermino, diasPorAno, diasTomados } = input

  const mesesTrabajados = differenceInMonths(fechaTermino, fechaInicio)
  const diasAcumulados = Math.round((diasPorAno / 12) * mesesTrabajados * 100) / 100
  const diasPendientes = Math.max(0, Math.round((diasAcumulados - diasTomados) * 100) / 100)
  const valorDiario = sueldoBase / 30
  const valorEnPesos = Math.round(diasPendientes * valorDiario)

  return {
    diasAcumulados,
    diasPendientes,
    valorEnPesos,
  }
}

export function calcularIndemnizacion(input: IndemnizacionInput): IndemnizacionResult {
  const { sueldoBase, fechaInicio, fechaTermino, causal } = input

  const anosServicio = differenceInYears(fechaTermino, fechaInicio)
  const topeRemuneracion = 90 * UF_VALUE
  const sueldoParaCalculo = Math.min(sueldoBase, topeRemuneracion)

  const detalles: Array<{ concepto: string; monto: number; explicacion: string }> = []

  const anosTope = Math.min(anosServicio, 11)
  const montoPorAno = sueldoParaCalculo

  const indemnizacionAnosServicio = anosTope * sueldoParaCalculo
  detalles.push({
    concepto: 'Indemnizacion por anos de servicio',
    monto: indemnizacionAnosServicio,
    explicacion: `${anosTope} anos x ${sueldoBase > topeRemuneracion ? 'tope 90 UF ($' + topeRemuneracion.toLocaleString('es-CL') + ')' : 'sueldo base'} (Art. 163 CT)`,
  })

  const indemnizacionAvisoPrevio = sueldoParaCalculo
  detalles.push({
    concepto: 'Indemnizacion sustitutiva aviso previo',
    monto: indemnizacionAvisoPrevio,
    explicacion: `1 mes de remuneracion${causal === 'art161_2' ? ' por desahucio' : ' por necesidades de la empresa'} (Art. 162 inc. 4 CT)`,
  })

  const total = indemnizacionAnosServicio + indemnizacionAvisoPrevio

  return {
    anosServicio,
    montoPorAno,
    indemnizacionAnosServicio,
    indemnizacionAvisoPrevio,
    total,
    detalles,
  }
}

export const CAUSALES_DESPIDO: { value: CausalDespido; label: string }[] = [
  { value: 'art159_1', label: 'Mutuo acuerdo - Art. 159 N\u00b01' },
  { value: 'art159_2', label: 'Renuncia del trabajador - Art. 159 N\u00b02' },
  { value: 'art159_4', label: 'Vencimiento del plazo - Art. 159 N\u00b04' },
  { value: 'art159_5', label: 'Conclusion del trabajo - Art. 159 N\u00b05' },
  { value: 'art160', label: 'Despido por causa justificada - Art. 160' },
  { value: 'art161_1', label: 'Necesidades de la empresa - Art. 161 inc. 1' },
  { value: 'art161_2', label: 'Desahucio del empleador - Art. 161 inc. 2' },
]
