'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Bulletins {
  page1?: string
  page2?: string
  page3?: string
}

export default function Home() {
  const [bulletins, setBulletins] = useState<Bulletins>({})

  useEffect(() => {
    fetchBulletins()
  }, [])

  const fetchBulletins = async () => {
    try {
      const res = await fetch('/api/bulletins')
      const data = await res.json()
      setBulletins(data)
    } catch (error) {
      console.error('Error fetching bulletins:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bulletin Board</h1>
            </div>
            <div className="flex items-center space-x-1">
              <Link href="/page1" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                Page 1
              </Link>
              <Link href="/page2" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                Page 2
              </Link>
              <Link href="/page3" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                Page 3
              </Link>
              <Link href="/admin" className="btn-primary ml-4">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Bulletin Board</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Navigate to different pages to view the latest bulletin images and announcements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((page) => (
            <Link
              key={page}
              href={`/page${page}`}
              className="group"
            >
              <div className="card p-6 h-full transform group-hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Page {page}</h3>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Bulletin {page}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">View the latest bulletin content for page {page}</p>
                
                {bulletins[`page${page}` as keyof Bulletins] ? (
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={bulletins[`page${page}` as keyof Bulletins]!}
                      alt={`Page ${page} bulletin preview`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No image uploaded</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="font-medium">View Full Bulletin</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
