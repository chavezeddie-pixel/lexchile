import {
  Briefcase,
  Scale,
  Shield,
  Heart,
  ShoppingCart,
  Receipt,
  Home,
  Building2,
  FileText,
  type LucideIcon,
} from 'lucide-react'

export interface AreaConfig {
  label: string
  bg: string
  text: string
  border: string
  iconBg: string
  gradient: string
  icon: LucideIcon
}

export const AREA_CONFIG: Record<string, AreaConfig> = {
  LABORAL: {
    label: 'Laboral',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    gradient: 'from-orange-500 to-orange-600',
    icon: Briefcase,
  },
  CIVIL: {
    label: 'Civil',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    gradient: 'from-blue-500 to-blue-600',
    icon: Scale,
  },
  PENAL: {
    label: 'Penal',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    gradient: 'from-red-500 to-red-600',
    icon: Shield,
  },
  FAMILIA: {
    label: 'Familia',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    iconBg: 'bg-pink-100',
    gradient: 'from-pink-500 to-pink-600',
    icon: Heart,
  },
  CONSUMIDOR: {
    label: 'Consumidor',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    gradient: 'from-green-500 to-green-600',
    icon: ShoppingCart,
  },
  TRIBUTARIO: {
    label: 'Tributario',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    gradient: 'from-violet-500 to-violet-600',
    icon: Receipt,
  },
  ARRENDAMIENTO: {
    label: 'Arrendamiento',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    iconBg: 'bg-teal-100',
    gradient: 'from-teal-500 to-teal-600',
    icon: Home,
  },
  COMERCIAL: {
    label: 'Comercial',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    gradient: 'from-cyan-500 to-cyan-600',
    icon: Building2,
  },
  ADMINISTRATIVO: {
    label: 'Administrativo',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    gradient: 'from-slate-500 to-slate-600',
    icon: FileText,
  },
} as const
