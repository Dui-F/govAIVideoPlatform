'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasSupabase = supabaseUrl && supabaseKey && 
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseKey !== 'your-anon-key'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!hasSupabase) {
      router.push('/dashboard')
      return
    }

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl!, supabaseKey!)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gov-gradient mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">政府AI视频制作平台</h1>
          <p className="text-gray-500 mt-2">请登录您的账户</p>
        </div>

        <div className="card">
          {!hasSupabase && (
            <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-4">
              演示模式：未配置Supabase，点击下方按钮进入演示
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="label">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="请输入邮箱"
                required={hasSupabase}
              />
            </div>

            <div>
              <label className="label">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="请输入密码"
                required={hasSupabase}
              />
            </div>

            {hasSupabase ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gov py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full btn-gov py-3"
              >
                进入演示模式
              </button>
            )}
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          专为央视、国家电网等政府平台服务
        </p>
      </div>
    </div>
  )
}
