'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Bulletins {
  page1?: string
  page2?: string
  page3?: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bulletins, setBulletins] = useState<Bulletins>({})
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
      const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        credentials: 'include'
      })
      if (res.ok) {
        setIsAuthenticated(true)
        fetchBulletins()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }
    checkAuth()
  }, [])

  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (res.ok) {
        setIsAuthenticated(true)
        fetchBulletins()
        setMessage('Login successful!')
      } else {
        setMessage('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Login failed')
    }
  }

  const fetchBulletins = async () => {
    try {
      const res = await fetch('/api/bulletins')
      const data = await res.json()
      setBulletins(data)
    } catch (error) {
      console.error('Error fetching bulletins:', error)
    }
  }

  const handleImageUpload = async (page: string, file: File) => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('page', page)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setBulletins(prev => ({ ...prev, [page]: data.imagePath }))
        setMessage(`Image uploaded successfully for ${page}`)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Upload error')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="bg-indigo-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-600">Sign in to manage bulletin content</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg"
              >
                Sign In
              </button>
            </form>
            
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Manage Bulletin Images</h2>
          <p className="text-lg text-gray-600">Upload and manage images for each bulletin page</p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg font-medium ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {['page1', 'page2', 'page3'].map((page, index) => {
            const colors = [
              { bg: 'from-blue-500 to-blue-600', accent: 'blue' },
              { bg: 'from-green-500 to-green-600', accent: 'green' },
              { bg: 'from-purple-500 to-purple-600', accent: 'purple' }
            ]
            const color = colors[index]
            
            return (
              <div key={page} className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </h3>
                  <div className={`bg-gradient-to-r ${color.bg} text-white px-3 py-1 rounded-full text-sm font-medium shadow-md`}>
                    Bulletin {index + 1}
                  </div>
                </div>
                
                {bulletins[page as keyof Bulletins] ? (
                  <div className="mb-6">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={bulletins[page as keyof Bulletins]!}
                        alt={`${page} bulletin`}
                        width={400}
                        height={300}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm font-medium">No image uploaded</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload New Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(page, e.target.files[0])
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm font-medium text-gray-600">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    href={`/${page}`}
                    className={`inline-flex items-center px-4 py-2 text-${color.accent}-600 hover:text-${color.accent}-700 hover:bg-${color.accent}-50 rounded-lg transition-colors duration-200`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Page
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}