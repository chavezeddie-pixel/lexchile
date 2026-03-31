'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Send, Loader2, Scale, ChevronRight, Briefcase, ShoppingCart, Home, Heart, Shield, Sparkles, Plus, Bot, User, Download, Share2 } from 'lucide-react'

interface Fuente {
  ley: string
  articulo: string
  detalle: string
  url: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  fuentes?: Fuente[]
  sugerencias?: string[]
}

const QUICK_TOPICS = [
  { label: 'Laboral', icon: Briefcase, bg: 'bg-orange-500', query: 'Tengo una consulta sobre derecho laboral' },
  { label: 'Consumidor', icon: ShoppingCart, bg: 'bg-emerald-500', query: 'Tengo un problema como consumidor' },
  { label: 'Arriendo', icon: Home, bg: 'bg-teal-500', query: 'Tengo una consulta sobre arrendamiento' },
  { label: 'Familia', icon: Heart, bg: 'bg-pink-500', query: 'Necesito orientacion en derecho de familia' },
  { label: 'Penal', icon: Shield, bg: 'bg-red-500', query: 'Tengo una consulta de derecho penal' },
]

const SUGGESTIONS = [
  { text: 'Me despidieron y no se si fue legal', emoji: '💼' },
  { text: 'Compre algo malo y no me lo cambian', emoji: '🛒' },
  { text: 'Problemas con mi arrendador', emoji: '🏠' },
  { text: 'Tuve un accidente de transito', emoji: '🚗' },
]

export default function ConsultaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showCopied, setShowCopied] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const sid = searchParams.get('session')
    const tema = searchParams.get('tema')
    if (sid) {
      try {
        const stored = localStorage.getItem('lexchile_sessions')
        if (stored) {
          const sessions = JSON.parse(stored)
          const found = sessions.find((s: any) => s.id === sid)
          if (found) { setMessages(found.messages); setSessionId(found.id) }
        }
      } catch {}
    } else if (tema) {
      setInput(decodeURIComponent(tema))
    }
  }, [searchParams])

  useEffect(() => {
    if (messages.length < 2) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'assistant') return
    try {
      const stored = localStorage.getItem('lexchile_sessions')
      let sessions = stored ? JSON.parse(stored) : []
      const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'Consulta'
      const currentId = sessionId || crypto.randomUUID()
      if (!sessionId) setSessionId(currentId)
      const session = {
        id: currentId, title: firstUserMsg.substring(0, 60), messages,
        createdAt: sessions.find((s: any) => s.id === currentId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      sessions = sessions.filter((s: any) => s.id !== currentId)
      sessions.unshift(session)
      if (sessions.length > 50) sessions = sessions.slice(0, 50)
      localStorage.setItem('lexchile_sessions', JSON.stringify(sessions))
    } catch {}
  }, [messages, sessionId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const pregunta = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: pregunta }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, historial: newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      if (data.remaining !== undefined) setRemaining(data.remaining)
      if (data.limitReached) { setLimitReached(true) }
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Error al procesar.' }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.respuesta, fuentes: data.fuentes || [], sugerencias: data.sugerencias || [] }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error de conexion. Intenta nuevamente.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) }
  }

  function sendSuggestion(text: string) {
    setInput(text)
    setTimeout(() => { const form = document.querySelector('form'); if (form) form.requestSubmit() }, 100)
  }

  function startNewChat() {
    setMessages([]); setSessionId(null); setInput(''); router.push('/consulta')
  }

  function buildResumen(): string {
    const fecha = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    const firstQuestion = messages.find(m => m.role === 'user')?.content || ''

    // Buscar la ultima respuesta larga del asistente (la orientacion o resumen)
    const assistantMsgs = messages.filter(m => m.role === 'assistant')
    const orientacion = assistantMsgs.length > 0
      ? assistantMsgs[assistantMsgs.length - 1].content
      : ''

    // Recopilar todas las fuentes
    const todasFuentes = messages
      .flatMap(m => m.fuentes || [])
      .filter((f, i, arr) => arr.findIndex(x => x.articulo === f.articulo && x.ley === f.ley) === i)

    let resumen = `RESUMEN DE ORIENTACION LEGAL\nLexChile - ${fecha}\n`
    resumen += `${'='.repeat(40)}\n\n`
    resumen += `CONSULTA:\n${firstQuestion}\n\n`
    resumen += `ORIENTACION:\n${orientacion}\n\n`

    if (todasFuentes.length > 0) {
      resumen += `FUENTES LEGALES:\n`
      todasFuentes.forEach(f => {
        resumen += `- ${f.ley} - ${f.articulo}\n  ${f.detalle}\n  ${f.url}\n\n`
      })
    }

    resumen += `${'='.repeat(40)}\n`
    resumen += `IMPORTANTE: Este documento fue generado por inteligencia artificial y puede contener errores. La informacion es orientativa y no constituye asesoria legal profesional. Para una evaluacion especifica de su caso, consulte con un abogado.\n\n`
    resumen += `Generado en LexChile - Orientacion Legal con IA para Chile`

    return resumen
  }

  function downloadResumen() {
    const resumen = buildResumen()
    const blob = new Blob([resumen], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumen-legal-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function shareResumen() {
    const resumen = buildResumen()

    if (navigator.share) {
      navigator.share({
        title: 'Resumen Legal - LexChile',
        text: resumen
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(resumen).then(() => {
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>

      {/* Header minimalista */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between py-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Scale className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-700">LexChile</span>
            <span className="text-xs text-gray-400">Orientacion legal IA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={downloadResumen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all" title="Descargar resumen">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button onClick={shareResumen} className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all" title="Compartir resumen">
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compartir</span>
              {showCopied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                  Copiado!
                </span>
              )}
            </button>
            <button onClick={startNewChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nueva</span>
            </button>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">

        {/* Empty state - calido y grande */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center mb-6 shadow-xl">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hola! Soy <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LexChile</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Cuentame que te paso y te oriento sobre tus derechos
            </p>

            {/* Sugerencias grandes y calidas */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => sendSuggestion(s.text)}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-200 hover:shadow-md transition-all text-left group"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 leading-snug">{s.text}</span>
                </button>
              ))}
            </div>

            {/* Topic pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => sendSuggestion(topic.query)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 ${topic.bg}`}
                >
                  <topic.icon className="h-3.5 w-3.5" />
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message, i) => (
          <div key={i} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>

            {/* Avatar */}
            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                : 'bg-gradient-to-br from-emerald-400 to-teal-500'
            }`}>
              {message.role === 'user'
                ? <User className="h-4 w-4 text-white" />
                : <Bot className="h-4 w-4 text-white" />
              }
            </div>

            {/* Contenido */}
            <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
              {/* Nombre */}
              <div className={`text-xs font-medium mb-1 ${message.role === 'user' ? 'text-indigo-500' : 'text-emerald-600'}`}>
                {message.role === 'user' ? 'Tu' : 'LexChile'}
              </div>

              {/* Burbuja */}
              <div className={`inline-block text-left rounded-2xl px-5 py-4 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-md'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-md shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</div>

                {/* Disclaimer en assistant */}
                {message.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-semibold uppercase text-gray-400 leading-snug tracking-wide">
                      ESTE SISTEMA UTILIZA INTELIGENCIA ARTIFICIAL Y PUEDE COMETER ERRORES. LA INFORMACION ES ORIENTATIVA Y DEBE SER VERIFICADA CON UN ABOGADO.
                    </p>
                  </div>
                )}
              </div>

              {/* Fuentes */}
              {message.fuentes && message.fuentes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {message.fuentes.map((fuente, j) => (
                    <details key={j} className="group">
                      <summary className="inline-flex items-center gap-1 cursor-pointer text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-1 border border-emerald-200 select-none transition-colors">
                        <Scale className="h-3 w-3 shrink-0" />
                        <span className="font-medium">{fuente.articulo || fuente.ley}</span>
                        <ChevronRight className="h-2.5 w-2.5 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-1 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] leading-relaxed text-emerald-900 max-w-xs shadow-sm">
                        <div className="font-semibold">{fuente.ley}</div>
                        {fuente.articulo && <div className="text-emerald-600">{fuente.articulo}</div>}
                        {fuente.detalle && <div className="mt-0.5 text-emerald-800">{fuente.detalle}</div>}
                        <a href={fuente.url} target="_blank" rel="noopener noreferrer"
                          className="mt-1.5 inline-block text-emerald-500 hover:text-emerald-700 underline underline-offset-2 text-[10px]">
                          Ver ley completa
                        </a>
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {/* Sugerencias de respuesta + Resumen */}
              {message.role === 'assistant' && i === messages.length - 1 && !loading && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Sugerencias normales */}
                  {message.sugerencias && message.sugerencias.length > 0 && message.sugerencias.map((sug, j) => (
                    <button
                      key={j}
                      onClick={() => sendSuggestion(sug)}
                      className="text-[13px] px-4 py-2 rounded-2xl border-2 border-indigo-100 bg-white hover:bg-indigo-50 text-indigo-700 hover:border-indigo-300 transition-all hover:shadow-md font-medium"
                    >
                      {sug}
                    </button>
                  ))}

                  {/* Boton Resumen - aparece despues de 4+ mensajes */}
                  {messages.length >= 4 && (
                    <button
                      onClick={() => sendSuggestion('Dame un resumen completo de mi caso, con los hechos que te conte, que dice la ley y que opciones tengo. Todo resumido y claro.')}
                      className="text-[13px] px-4 py-2 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:border-amber-300 transition-all hover:shadow-md font-semibold flex items-center gap-1.5"
                    >
                      📋 Resumen de mi caso
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-medium mb-1 text-emerald-600">LexChile</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-400">Analizando tu consulta...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - fijo abajo */}
      <div className="border-t border-gray-100 pt-3 pb-2 bg-gradient-to-t from-white to-transparent">
        {limitReached ? (
          <div className="text-center py-4 px-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-amber-800 font-medium text-sm">Has usado tus 5 consultas gratuitas de hoy</p>
            <p className="text-amber-600 text-xs mt-1">Vuelve manana para seguir consultando. Puedes descargar o compartir tu consulta actual.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu consulta aqui..."
                  className="w-full resize-none rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 px-5 py-3.5 text-[15px] placeholder:text-gray-300 transition-all outline-none min-h-[52px] max-h-[120px]"
                  rows={1}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:shadow-none shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-gray-300">LexChile usa IA y puede cometer errores.</p>
              {remaining !== null && (
                <p className={`text-[10px] font-medium ${remaining <= 1 ? 'text-amber-500' : 'text-gray-300'}`}>
                  {remaining} consulta{remaining !== 1 ? 's' : ''} restante{remaining !== 1 ? 's' : ''} hoy
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
