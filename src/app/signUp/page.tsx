'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Algo salió mal')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError('Error al iniciar sesión automáticamente')
        setLoading(false)
      }
    } catch {
      setError('Algo salió mal')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Registro
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/signIn" className="text-blue-600 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
