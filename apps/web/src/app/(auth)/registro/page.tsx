'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { validarRut, formatRut } from '@/lib/chile'

export default function RegistroPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rut, setRut] = useState('')

  function handleRutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setRut(formatRut(value))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      rut: (formData.get('rut') as string).replace(/\./g, '').replace(/-/g, ''),
      telefono: formData.get('telefono') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    if (!validarRut(data.rut)) {
      setError('El RUT ingresado no es válido')
      setLoading(false)
      return
    }

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (data.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Error al registrar')
        setLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate en LexChile para acceder a consultoría legal</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                <Input id="nombre" name="nombre" placeholder="Juan" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="text-sm font-medium">Apellido</label>
                <Input id="apellido" name="apellido" placeholder="Pérez" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="rut" className="text-sm font-medium">RUT</label>
              <Input
                id="rut"
                name="rut"
                placeholder="12.345.678-9"
                value={rut}
                onChange={handleRutChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" placeholder="tu@email.cl" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="telefono" className="text-sm font-medium">Teléfono (opcional)</label>
              <Input id="telefono" name="telefono" type="tel" placeholder="+56 9 1234 5678" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
              <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required autoComplete="new-password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contraseña</label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repite tu contraseña" required autoComplete="new-password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
