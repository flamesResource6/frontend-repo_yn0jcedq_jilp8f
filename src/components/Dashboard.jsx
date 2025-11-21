import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])

  const token = localStorage.getItem('token')

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/my/validations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setHistory(data.items || [])
    } catch {}
  }

  useEffect(() => { fetchHistory() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults([])
    try {
      const list = emails.split(/\n|,|\s/).map(s => s.trim()).filter(Boolean)
      const res = await fetch(`${API_BASE}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ emails: list })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setResults(data.results)
      setEmails('')
      fetchHistory()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Validate emails</h2>
          <form onSubmit={submit} className="space-y-4">
            <textarea value={emails} onChange={e=>setEmails(e.target.value)} rows={8} placeholder="Paste emails separated by comma, space, or newline" className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2 px-4 rounded">{loading? 'Checking…':'Check'}</button>
          </form>
          {results.length>0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Latest results</h3>
              <ul className="divide-y divide-slate-700">
                {results.map((r,i)=> (
                  <li key={i} className="py-2 flex items-start justify-between">
                    <div>
                      <p className="font-mono">{r.email}</p>
                      <p className="text-sm text-slate-300">{r.reason || ''}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${r.status==='valid' ? 'bg-green-500/20 text-green-300' : r.status==='invalid' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">History</h2>
          <ul className="divide-y divide-slate-700 max-h-[480px] overflow-auto">
            {history.map((h)=> (
              <li key={h._id} className="py-2 flex items-start justify-between">
                <div>
                  <p className="font-mono">{h.email}</p>
                  <p className="text-sm text-slate-300">{new Date(h.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${h.status==='valid' ? 'bg-green-500/20 text-green-300' : h.status==='invalid' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{h.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
