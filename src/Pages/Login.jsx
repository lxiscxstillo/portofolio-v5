import { useState, useEffect } from 'react'
import { supabase } from "../supabase";
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // If already logged in as admin → redirect, don't show login form
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', session.user.id).single()
        if (profile?.role === 'admin') {
          navigate('/dashboard', { replace: true })
          return
        }
      }
      setChecking(false)
    }
    checkSession()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()

    if (profile?.role !== 'admin') {
      setError('Access denied. This account does not have admin privileges.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    // replace: true so Login is NOT in history — Back button won't return to login
    navigate('/dashboard', { replace: true })
  }

  if (checking) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-700" />
          <div className="relative bg-[#141414] border border-white/20 rounded-2xl p-8 space-y-7">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-medium">Admin Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to manage your portfolio</p>
            </div>

            {/* Inline error */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/20">
                <AlertCircle className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider font-medium">Email</label>
                <div className="flex items-center bg-white/[0.07] border border-white/20 rounded-xl overflow-hidden focus-within:border-white/60 transition-colors duration-200">
                  <Mail className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    required
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-600 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider font-medium">Password</label>
                <div className="flex items-center bg-white/[0.07] border border-white/20 rounded-xl overflow-hidden focus-within:border-white/60 transition-colors duration-200">
                  <Lock className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    required
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-600 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="mr-4 shrink-0 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="relative group/btn w-full mt-1 cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d1d5db] to-[#ffffff] rounded-xl opacity-70 blur group-hover/btn:opacity-100 transition duration-300" />
                <div className="relative h-11 bg-[#0A0A0A] rounded-xl border border-white/15 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-white/10" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-sm font-medium text-white">Sign In</span>
                      <LogIn className="relative w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
