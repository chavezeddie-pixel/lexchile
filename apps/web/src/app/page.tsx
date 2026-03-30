import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Scale,
  MessageSquare,
  BookOpen,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Clock,
  LayoutGrid,
  Briefcase,
  Heart,
  ShoppingCart,
  Home,
  Receipt,
  Building2,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'LexChile - Consulta Legal con Inteligencia Artificial | Derecho Chileno',
  description:
    'Consulta leyes chilenas con inteligencia artificial. Derecho laboral, civil, penal, familia, tributario y mas. Sin registro.',
}

const features = [
  {
    icon: MessageSquare,
    title: 'Consulta Legal con IA',
    description: 'Orientacion basada en la legislacion chilena vigente, con citas a articulos especificos.',
    color: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Base de Leyes',
    description: 'Codigo del Trabajo, Codigo Civil, Codigo Penal y toda la normativa chilena.',
    color: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Calculator,
    title: 'Calculadoras Legales',
    description: 'Calcula tu finiquito, indemnizacion por anos y vacaciones proporcionales.',
    color: 'from-green-500 to-emerald-500',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'Sin Registro',
    description: 'Consulta directamente sin crear cuenta. Tu privacidad es lo primero.',
    color: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100 text-orange-600',
  },
]

const areas = [
  { name: 'Laboral', desc: 'Despidos, contratos, finiquitos', icon: Briefcase, color: 'bg-orange-50 border-orange-200 text-orange-700', iconColor: 'text-orange-500' },
  { name: 'Civil', desc: 'Contratos, obligaciones, bienes', icon: Scale, color: 'bg-blue-50 border-blue-200 text-blue-700', iconColor: 'text-blue-500' },
  { name: 'Familia', desc: 'Divorcio, pension, tuicion', icon: Heart, color: 'bg-pink-50 border-pink-200 text-pink-700', iconColor: 'text-pink-500' },
  { name: 'Penal', desc: 'Delitos, denuncias, defensa', icon: Shield, color: 'bg-red-50 border-red-200 text-red-700', iconColor: 'text-red-500' },
  { name: 'Consumidor', desc: 'SERNAC, garantias, reclamos', icon: ShoppingCart, color: 'bg-green-50 border-green-200 text-green-700', iconColor: 'text-green-500' },
  { name: 'Tributario', desc: 'SII, IVA, renta', icon: Receipt, color: 'bg-violet-50 border-violet-200 text-violet-700', iconColor: 'text-violet-500' },
  { name: 'Arriendo', desc: 'Contratos, desahucio, arriendos', icon: Home, color: 'bg-teal-50 border-teal-200 text-teal-700', iconColor: 'text-teal-500' },
  { name: 'Comercial', desc: 'Empresas, sociedades, quiebras', icon: Building2, color: 'bg-cyan-50 border-cyan-200 text-cyan-700', iconColor: 'text-cyan-500' },
  { name: 'Administrativo', desc: 'Municipalidades, permisos', icon: FileText, color: 'bg-slate-50 border-slate-200 text-slate-700', iconColor: 'text-slate-500' },
]

const tools = [
  { name: 'Finiquito', desc: 'Calcula cuanto te corresponde', href: '/calculadoras/finiquito', color: 'from-orange-400 to-amber-500' },
  { name: 'Indemnizacion', desc: 'Estima tu indemnizacion por anos', href: '/calculadoras/indemnizacion', color: 'from-red-400 to-pink-500' },
  { name: 'Vacaciones', desc: 'Calcula tus dias pendientes', href: '/calculadoras/vacaciones', color: 'from-green-400 to-emerald-500' },
]

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LexChile</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
              <Link href="#funcionalidades" className="hover:text-indigo-600 transition-colors">Funcionalidades</Link>
              <Link href="#areas" className="hover:text-indigo-600 transition-colors">Areas Legales</Link>
              <Link href="#herramientas" className="hover:text-indigo-600 transition-colors">Herramientas</Link>
            </div>
            <Link href="/consulta">
              <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
                Consultar Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/30" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Orientacion Legal con{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Inteligencia Artificial
                </span>
                <br />
                para Chile
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Consulta sobre legislacion chilena al instante. Sin registro, sin costo. Tus datos no se guardan.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/consulta">
                  <Button size="lg" className="text-base px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all">
                    Hacer una Consulta Legal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/leyes">
                  <Button variant="outline" size="lg" className="text-base px-8 rounded-xl border-2">
                    Buscar Leyes
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                {['Sin registro', 'Exclusivo Chile', 'Fuentes oficiales', '100% privado'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="funcionalidades" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Todo lo que necesitas
              </h2>
              <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
                Herramientas legales accesibles para todos.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-3`}>
                      <f.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{f.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Areas */}
        <section id="areas" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Areas del Derecho Chileno</h2>
              <p className="mt-3 text-lg text-gray-500">Cada area te lleva directo a consultar.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((a) => (
                <Link key={a.name} href={`/consulta?tema=Tengo una consulta sobre ${a.name.toLowerCase()}`}>
                  <div className={`rounded-2xl border p-5 ${a.color} hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer`}>
                    <div className="flex items-center gap-3 mb-2">
                      <a.icon className={`h-6 w-6 ${a.iconColor}`} />
                      <h3 className="font-bold text-lg">{a.name}</h3>
                    </div>
                    <p className="text-sm opacity-80">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="herramientas" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Calculadoras Legales</h2>
              <p className="mt-3 text-lg text-gray-500">Estima tus derechos laborales al instante.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {tools.map((t) => (
                <Link key={t.name} href={t.href}>
                  <div className={`rounded-2xl bg-gradient-to-br ${t.color} p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}>
                    <Calculator className="h-8 w-8 mb-3 opacity-80" />
                    <h3 className="font-bold text-xl mb-1">{t.name}</h3>
                    <p className="text-sm opacity-90">{t.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Consulta ahora sobre leyes chilenas
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Sin registro. Sin costo. Respuesta inmediata.
            </p>
            <div className="mt-8">
              <Link href="/consulta">
                <Button size="lg" variant="secondary" className="text-base px-8 rounded-xl shadow-lg">
                  Iniciar Consulta Legal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {[
                { q: 'Necesito registrarme?', a: 'No. LexChile es de acceso libre. No pedimos registro ni datos personales.' },
                { q: 'Que es LexChile?', a: 'Una herramienta de orientacion legal con IA especializada en el sistema juridico chileno.' },
                { q: 'Las respuestas reemplazan a un abogado?', a: 'No. LexChile entrega orientacion informativa. Para casos especificos, consulta siempre a un abogado.' },
                { q: 'De donde obtiene la informacion?', a: 'De fuentes oficiales: Biblioteca del Congreso Nacional, Poder Judicial, Direccion del Trabajo, SII y Diario Oficial.' },
                { q: 'Cuanto cuesta?', a: 'Es gratuito. No tiene costo para el usuario.' },
              ].map((faq) => (
                <details key={faq.q} className="group border border-gray-200 rounded-2xl overflow-hidden">
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    {faq.q}
                    <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Scale className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LexChile</span>
              </div>
              <p className="text-sm max-w-xs">Orientacion legal con IA para el sistema juridico chileno. Sin registro.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm">Plataforma</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/consulta" className="hover:text-white transition-colors">Consulta Legal</Link></li>
                  <li><Link href="/leyes" className="hover:text-white transition-colors">Leyes Chilenas</Link></li>
                  <li><Link href="/temas" className="hover:text-white transition-colors">Temas Frecuentes</Link></li>
                  <li><Link href="/calculadoras" className="hover:text-white transition-colors">Calculadoras</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm">Areas</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/consulta?tema=laboral" className="hover:text-white transition-colors">Laboral</Link></li>
                  <li><Link href="/consulta?tema=consumidor" className="hover:text-white transition-colors">Consumidor</Link></li>
                  <li><Link href="/consulta?tema=familia" className="hover:text-white transition-colors">Familia</Link></li>
                  <li><Link href="/consulta?tema=arriendo" className="hover:text-white transition-colors">Arriendo</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
            <p>Herramienta informativa. No constituye asesoria legal profesional.</p>
            <p className="mt-1">Disenado para el sistema juridico de la Republica de Chile.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
