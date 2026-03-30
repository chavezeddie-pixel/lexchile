const STORAGE_KEY = 'lexchile_sessions'
const MAX_SESSIONS = 50

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  fuentes?: Array<{ ley: string; articulo: string; detalle: string; url: string }>
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

function readStorage(): ChatSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ChatSession[]
  } catch {
    return []
  }
}

function writeStorage(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function getSessions(): ChatSession[] {
  return readStorage()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_SESSIONS)
}

export function getSession(id: string): ChatSession | null {
  const sessions = readStorage()
  return sessions.find((s) => s.id === id) ?? null
}

export function saveSession(session: ChatSession): void {
  const sessions = readStorage()
  const idx = sessions.findIndex((s) => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.unshift(session)
  }
  const trimmed = sessions
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_SESSIONS)
  writeStorage(trimmed)
}

export function deleteSession(id: string): void {
  const sessions = readStorage().filter((s) => s.id !== id)
  writeStorage(sessions)
}

export function clearAllSessions(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function createSession(firstMessage: string): ChatSession {
  const title = firstMessage.length > 60 ? firstMessage.slice(0, 60) + '...' : firstMessage
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}
