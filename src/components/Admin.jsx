import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const token = localStorage.getItem('token')

  const fetchAll = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const s = await sRes.json(); const u = await uRes.json()
      if (sRes.ok) setStats(s)
      if (uRes.ok) setUsers(u.items || [])
    } catch {}
  }

  useEffect(()=>{ fetchAll() }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Users', value: stats.users },
                { label: 'Checks', value: stats.checks },
                { label: 'Valid', value: stats.valid },
                { label: 'Invalid', value: stats.invalid },
              ].map((c)=> (
                <div key={c.label} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <p className="text-slate-300 text-sm">{c.label}</p>
                  <p className="text-2xl font-semibold">{c.value}</p>
                </div>
              ))}
            </div>
          ) : <p>Loading…</p>}
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2">Email</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-slate-700/60">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.name || '-'}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">{u.is_active ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
