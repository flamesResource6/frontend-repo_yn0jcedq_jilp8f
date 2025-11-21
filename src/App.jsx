import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'

function Nav() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }
  return (
    <div className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Email Validator</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
              {user.role==='admin' && <Link to="/admin" className="text-slate-300 hover:text-white">Admin</Link>}
              <button onClick={logout} className="bg-slate-700 px-3 py-1.5 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-slate-300 hover:text-white">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function HomeHero() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Verify email deliverability with confidence</h1>
          <p className="text-slate-300 mt-4">Paste a list, validate instantly, and track results over time. Built-in admin dashboard for oversight.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Get started</Link>
            <Link to="/login" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded">Sign in</Link>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-300">Try it out after you sign in: paste emails and get statuses like valid, invalid, or unknown. We also flag disposables and suggest corrections.</p>
        </div>
      </div>
    </div>
  )
}

function RequireAuth({ children, role }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth role="admin"><Admin /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
