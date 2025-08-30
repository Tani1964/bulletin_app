'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page2() {
  const [bulletinImage, setBulletinImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBulletin()
  }, [])

  const fetchBulletin = async () => {
    try {
      const res = await fetch('/api/bulletins')
      const data = await res.json()
      setBulletinImage(data.page2)
    } catch (error) {
      console.error('Error fetching bulletin:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Page 2</h1>
            </div>
            <div className="flex items-center space-x-1">
              <Link href="/page1" className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                Page 1
              </Link>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Current Page
              </div>
              <Link href="/page3" className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                Page 3
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Bulletin - Page 2</h2>
          <p className="text-lg text-gray-600">Latest announcements and information</p>
        </div>
        
        {loading ? (
          <div className="card p-8">
            <div className="animate-pulse">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : bulletinImage ? (
          <div className="card p-6">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={bulletinImage}
                alt="Page 2 Bulletin"
                width={1000}
                height={700}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bulletin Available</h3>
                <p className="text-gray-500">No bulletin image has been uploaded for Page 2 yet.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
