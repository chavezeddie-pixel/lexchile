import { z } from 'zod'
import { validarRut } from './chile'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  rut: z.string().refine(validarRut, 'RUT inválido'),
  telefono: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const casoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  areaLegal: z.enum(['LABORAL', 'CIVIL', 'FAMILIA', 'PENAL', 'COMERCIAL', 'TRIBUTARIO', 'ADMINISTRATIVO', 'CONSUMIDOR', 'ARRENDAMIENTO']),
  tribunalId: z.string().optional(),
  region: z.string().optional(),
  rol_causa: z.string().optional(),
})

export const consultaSchema = z.object({
  pregunta: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres').max(5000, 'La pregunta no puede exceder 5000 caracteres'),
  casoId: z.string().optional(),
})

export const documentoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  tipo: z.enum(['DEMANDA', 'CONTESTACION', 'RECURSO', 'CONTRATO', 'PODER', 'ESCRITURA', 'CARTA', 'INFORME', 'OTRO']),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  casoId: z.string().optional(),
  plantillaId: z.string().optional(),
})

export const eventoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  tipo: z.enum(['AUDIENCIA', 'PLAZO_LEGAL', 'REUNION', 'VENCIMIENTO', 'OTRO']),
  casoId: z.string().optional(),
  tribunalId: z.string().optional(),
  recordatorio: z.boolean().default(true),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegistroInput = z.infer<typeof registroSchema>
export type CasoInput = z.infer<typeof casoSchema>
export type ConsultaInput = z.infer<typeof consultaSchema>
export type DocumentoInput = z.infer<typeof documentoSchema>
export type EventoInput = z.infer<typeof eventoSchema>
