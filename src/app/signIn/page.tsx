'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  const handleGitHubSignIn = async () => {
    const result = await signIn('github', {
      callbackUrl: '/dashboard',
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  const handleCredentialsSignIn = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
      redirect: false,
    })

    if (result?.error) {
      setError('Credenciales inválidas')
      setLoading(false)
    }

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O continúa con</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Google
          </button>

          <button
            onClick={handleGitHubSignIn}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGithub />
            GitHub
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/signUp" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
