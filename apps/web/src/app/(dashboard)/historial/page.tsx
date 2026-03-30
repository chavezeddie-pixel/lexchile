'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trash2, MessageSquare, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getSessions,
  deleteSession,
  clearAllSessions,
  type ChatSession,
} from '@/lib/chat-history'

export default function HistorialPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setSessions(getSessions())
    setMounted(true)
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Estas seguro de eliminar esta consulta?')) {
      deleteSession(id)
      setSessions(getSessions())
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Estas seguro de eliminar todo el historial? Esta accion no se puede deshacer.')) {
      clearAllSessions()
      setSessions([])
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Consultas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revisa tus consultas anteriores
          </p>
        </div>
        {sessions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Borrar todo
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-indigo-100 p-4 mb-4">
              <Clock className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tus consultas apareceran aqui
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Las consultas se guardan automaticamente en tu navegador
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 group"
              onClick={() => router.push(`/consulta?session=${session.id}`)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0 rounded-lg bg-indigo-100 p-2.5 group-hover:bg-indigo-200 transition-colors">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {session.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messages.length} {session.messages.length === 1 ? 'mensaje' : 'mensajes'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(session.id, e)}
                  className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Eliminar consulta"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
