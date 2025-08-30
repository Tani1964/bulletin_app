'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page3() {
  const [bulletinImage, setBulletinImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBulletin()
  }, [])

  const fetchBulletin = async () => {
    try {
      const res = await fetch('/api/bulletins')
      const data = await res.json()
      setBulletinImage(data.page3)
    } catch (error) {
      console.error('Error fetching bulletin:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col">
      <nav className="bg-white shadow-lg border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Page 3</h1>
            </div>
            <div className="flex items-center space-x-1">
              <Link href="/page1" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                Page 1
              </Link>
              <Link href="/page2" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                Page 2
              </Link>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Current Page
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-200"></div>
          </div>
        ) : bulletinImage ? (
          <div className="flex-1 relative">
            <Image
              src={bulletinImage}
              alt="Page 3 Bulletin"
              fill
              className="object-contain"
              priority
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-4">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
                <span className="bg-green-500 px-2 py-1 rounded-full text-xs">Active</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-3xl font-semibold text-gray-700 mb-4">No Bulletin Available</h3>
              <p className="text-xl text-gray-500">No bulletin image has been uploaded for Page 3 yet.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}