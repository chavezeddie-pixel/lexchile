'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Send, Loader2, Scale, AlertTriangle, ChevronRight, Briefcase, ShoppingCart, Home, Heart, Shield, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

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
}

const QUICK_TOPICS = [
  { label: 'Laboral', icon: Briefcase, color: 'bg-orange-100 text-orange-700 border-orange-200', query: 'Tengo una consulta sobre derecho laboral' },
  { label: 'Consumidor', icon: ShoppingCart, color: 'bg-green-100 text-green-700 border-green-200', query: 'Tengo un problema como consumidor' },
  { label: 'Arriendo', icon: Home, color: 'bg-teal-100 text-teal-700 border-teal-200', query: 'Tengo una consulta sobre arrendamiento' },
  { label: 'Familia', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-200', query: 'Necesito orientacion en derecho de familia' },
  { label: 'Penal', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200', query: 'Tengo una consulta de derecho penal' },
]

const SUGGESTIONS = [
  { text: 'Me despidieron del trabajo y no se si fue legal', color: 'border-l-orange-400' },
  { text: 'Compre un producto malo y no me lo quieren cambiar', color: 'border-l-green-400' },
  { text: 'Mi arrendador quiere subirme el arriendo', color: 'border-l-teal-400' },
  { text: 'Necesito saber mis derechos en un accidente', color: 'border-l-red-400' },
]

export default function ConsultaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load session or topic from URL params
  useEffect(() => {
    const sid = searchParams.get('session')
    const tema = searchParams.get('tema')

    if (sid) {
      try {
        const stored = localStorage.getItem('lexchile_sessions')
        if (stored) {
          const sessions = JSON.parse(stored)
          const found = sessions.find((s: any) => s.id === sid)
          if (found) {
            setMessages(found.messages)
            setSessionId(found.id)
          }
        }
      } catch {}
    } else if (tema) {
      setInput(decodeURIComponent(tema))
    }
  }, [searchParams])

  // Save session to localStorage after each assistant response
  useEffect(() => {
    if (messages.length < 2) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'assistant') return

    try {
      const stored = localStorage.getItem('lexchile_sessions')
      let sessions = stored ? JSON.parse(stored) : []
      const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'Consulta'
      const title = firstUserMsg.substring(0, 60)

      const currentId = sessionId || crypto.randomUUID()
      if (!sessionId) setSessionId(currentId)

      const session = {
        id: currentId,
        title,
        messages,
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
        body: JSON.stringify({
          pregunta,
          historial: newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Error al procesar.' }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.respuesta, fuentes: data.fuentes || [] }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error de conexion. Intenta nuevamente.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function startNewChat() {
    setMessages([])
    setSessionId(null)
    setInput('')
    router.push('/consulta')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Consulta Legal
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Orientacion sobre legislacion chilena. Sin registro, 100% privado.
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={startNewChat} className="text-xs">
            Nueva consulta
          </Button>
        )}
      </div>

      {/* Chat */}
      <Card className="min-h-[520px] flex flex-col border-0 shadow-lg">
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Hola, soy LexChile
              </h2>
              <p className="text-gray-500 max-w-sm mb-6 text-sm">
                Cuentame tu situacion y te oriento sobre la ley chilena. No guardo tus datos.
              </p>

              {/* Quick topic pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => setInput(topic.query)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 ${topic.color}`}
                  >
                    <topic.icon className="h-3.5 w-3.5" />
                    {topic.label}
                  </button>
                ))}
              </div>

              {/* Suggestion cards */}
              <div className="grid sm:grid-cols-2 gap-2 max-w-lg w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => setInput(s.text)}
                    className={`text-left text-sm p-3 rounded-xl border border-l-4 ${s.color} bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all hover:shadow-sm`}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[80%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'bg-white border border-gray-100 text-gray-900 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  {message.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-[11px] font-bold uppercase text-gray-500 leading-snug">
                        ESTE SISTEMA UTILIZA INTELIGENCIA ARTIFICIAL Y PUEDE COMETER ERRORES. LA INFORMACION ENTREGADA ES ORIENTATIVA, NO CONSTITUYE ASESORIA LEGAL PROFESIONAL Y DEBE SER VERIFICADA. PARA UNA EVALUACION ESPECIFICA DE SU CASO, SE RECOMIENDA CONSULTAR CON UN ABOGADO.
                      </p>
                    </div>
                  )}
                </div>

                {/* Fuentes compactas */}
                {message.fuentes && message.fuentes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {message.fuentes.map((fuente, j) => (
                      <details key={j} className="group">
                        <summary className="inline-flex items-center gap-1 cursor-pointer text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full px-2.5 py-1 border border-indigo-200 select-none transition-colors">
                          <Scale className="h-3 w-3 shrink-0" />
                          <span className="font-medium">{fuente.articulo || fuente.ley}</span>
                          <ChevronRight className="h-2.5 w-2.5 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="mt-1 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-[11px] leading-relaxed text-indigo-900 max-w-xs shadow-sm">
                          <div className="font-semibold">{fuente.ley}</div>
                          {fuente.articulo && <div className="text-indigo-600">{fuente.articulo}</div>}
                          {fuente.detalle && <div className="mt-0.5 text-indigo-800">{fuente.detalle}</div>}
                          <a
                            href={fuente.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 inline-block text-indigo-500 hover:text-indigo-700 underline underline-offset-2 text-[10px]"
                          >
                            Ver ley completa en leychile.cl
                          </a>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-sm text-gray-500">Pensando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input area */}
        <div className="border-t border-gray-100 p-3 sm:p-4 bg-white/50 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cuentame tu situacion..."
              className="resize-none min-h-[44px] max-h-[120px] rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              rows={1}
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md h-11 w-11 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
            <AlertTriangle className="h-2.5 w-2.5" />
            <span>Orientacion informativa. No reemplaza a un abogado.</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
