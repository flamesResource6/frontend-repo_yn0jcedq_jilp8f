import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login'
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          ...(mode === 'signup' ? { name: form.name } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role, name: data.name, user_id: data.user_id }))
      if (data.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2 rounded transition">
            {loading ? 'Please wait…' : (mode === 'signup' ? 'Sign up' : 'Log in')}
          </button>
        </form>
        <p className="text-slate-300 text-sm mt-4 text-center">
          {mode === 'signup' ? (
            <>Already have an account? <Link className="text-blue-400 hover:underline" to="/login">Log in</Link></>
          ) : (
            <>No account yet? <Link className="text-blue-400 hover:underline" to="/signup">Sign up</Link></>
          )}
        </p>
      </div>
    </div>
  )
}
