'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Access Denied. Invalid credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="border border-red-900/50 bg-neutral-900/80 p-10 rounded-2xl w-full max-w-sm space-y-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.05)]">
        
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter mb-1">
            <span className="text-red-500 animate-pulse">●</span> BURNBRAIN
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Overseer Authentication Required
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-black border border-slate-700 text-white px-4 py-3 rounded-lg text-sm focus:border-red-500 focus:outline-none transition-colors"
          />

          {error && (
            <p className="text-red-500 text-xs font-mono">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            {loading ? 'Verifying...' : 'Access System ↗'}
          </button>
        </div>

        <p className="text-slate-700 text-xs">
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}