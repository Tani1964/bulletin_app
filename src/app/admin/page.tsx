'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'

interface Bulletins {
  page1?: string
  page2?: string
  page3?: string
}

interface BulletinPageConfig {
  key: string
  title: string
  label: string
  description: string
  color: {
    bg: string
    accent: string
    hover: string
  }
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bulletins, setBulletins] = useState<Bulletins>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Define bulletin pages configuration
  const bulletinPages: BulletinPageConfig[] = [
    {
      key: 'page1',
      title: 'Page 1',
      label: 'Weekly Bulletin',
      description: 'Service schedule and weekly announcements',
      color: {
        bg: 'from-blue-500 to-blue-600',
        accent: 'blue-600',
        hover: 'blue-50'
      }
    },
    {
      key: 'page2',
      title: 'Page 2', 
      label: 'Events & Programs',
      description: 'Upcoming events and community programs',
      color: {
        bg: 'from-green-500 to-green-600',
        accent: 'green-600',
        hover: 'green-50'
      }
    },
    {
      key: 'page3',
      title: 'Page 3',
      label: 'Spiritual Life',
      description: 'Prayer requests and spiritual messages',
      color: {
        bg: 'from-purple-500 to-purple-600',
        accent: 'purple-600',
        hover: 'purple-50'
      }
    }
  ]

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
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (res.ok) {
        setMessage('Login successful! Loading dashboard...')
        // Small delay to show success message before transition
        setTimeout(() => {
          setIsAuthenticated(true)
          fetchBulletins()
        }, 500)
      } else {
        setMessage('Invalid credentials')
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Login failed - please try again')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setIsLoggingIn(false)
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

    setUploading(page)
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
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Upload error')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setUploading(null)
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
      setMessage('')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Login Screen
  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Admin Dashboard...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    )
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-indigo-600 text-white p-3 sm:p-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-600 text-sm sm:text-base">Sign in to manage bulletin content</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm sm:text-base"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            {message && (
              <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center font-medium text-sm sm:text-base ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {message}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
                <span className="text-xs sm:text-sm text-gray-500 hidden sm:block leading-tight">NBBCI Management</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link 
                href="/" 
                className="flex items-center px-3 lg:px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden lg:inline">View Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                aria-expanded={showMobileMenu}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            showMobileMenu 
              ? 'max-h-32 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
              <Link 
                href="/" 
                className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 text-sm font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Site
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setShowMobileMenu(false)
                }}
                className="flex items-center w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Manage Bulletin Images
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            Upload and manage images for each bulletin page. Changes will be reflected immediately on the public site.
          </p>
        </div>
        
        {/* Status Message */}
        {message && (
          <div className={`mb-6 sm:mb-8 p-4 rounded-xl font-medium text-sm sm:text-base shadow-sm ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {message.includes('successful') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {message}
            </div>
          </div>
        )}

        {/* Bulletin Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {bulletinPages.map((bulletinPage) => {
            const currentImage = bulletins[bulletinPage.key as keyof Bulletins]
            const isUploading = uploading === bulletinPage.key
            
            return (
              <div key={bulletinPage.key} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 border border-gray-100">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {bulletinPage.title}
                  </h3>
                  <div className={`bg-gradient-to-r ${bulletinPage.color.bg} text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md`}>
                    {bulletinPage.label}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {bulletinPage.description}
                </p>
                
                {/* Current Image Display */}
                <div className="mb-6">
                  {currentImage ? (
                    <div className="relative overflow-hidden rounded-xl shadow-md">
                      <Image
                        src={currentImage}
                        alt={`${bulletinPage.title} bulletin`}
                        width={400}
                        height={300}
                        className="w-full h-40 sm:h-48 lg:h-52 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          Active
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <p className="text-white text-xs sm:text-sm font-medium">
                          Current bulletin image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center p-4">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm font-medium">No image uploaded</p>
                        <p className="text-gray-400 text-xs mt-1">Upload an image below</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload New Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(bulletinPage.key, e.target.files[0])
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 sm:file:py-3 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm font-medium text-gray-600">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <Link
                    href={`/${bulletinPage.key}`}
                    className={`inline-flex items-center justify-center sm:justify-start px-4 py-2 text-${bulletinPage.color.accent} hover:bg-${bulletinPage.color.hover} rounded-lg transition-colors duration-200 text-sm font-medium`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Page
                  </Link>
                  
                  {currentImage && (
                    <div className="flex items-center text-green-600 text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Image Active</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistics Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Bulletin Status Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {Object.keys(bulletins).length}
                </div>
                <div className="text-sm sm:text-base text-gray-600">Active Bulletins</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {bulletinPages.length}
                </div>
                <div className="text-sm sm:text-base text-gray-600">Total Pages</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {Math.round((Object.keys(bulletins).length / bulletinPages.length) * 100)}%
                </div>
                <div className="text-sm sm:text-base text-gray-600">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}