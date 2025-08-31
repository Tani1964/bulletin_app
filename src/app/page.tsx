'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Nav from './components/Nav'

interface Bulletins {
  page1?: string
  page2?: string
  page3?: string
}

interface BulletinPage {
  id: number
  href: string
  title: string
  description: string
  badge: string
}

export default function Home() {
  const [bulletins, setBulletins] = useState<Bulletins>({})
  const [isLoading, setIsLoading] = useState(true)

  // Define bulletin pages data
  const bulletinPages: BulletinPage[] = [
    {
      id: 1,
      href: '/page1',
      title: 'Page 1',
      description: 'View the latest weekly announcements and service updates',
      badge: 'Weekly Bulletin'
    },
    {
      id: 2,
      href: '/page2',
      title: 'Page 2',
      description: 'Read prayer requests, testimonies and spiritual messages',
      badge: 'Spiritual Life'
    },
    {
      id: 3,
      href: '/page3',
      title: 'Page 3',
      description: 'Check upcoming events, programs and community activities',
      badge: 'Events & Programs'
    }
  ]

  useEffect(() => {
    fetchBulletins()
  }, [])

  const fetchBulletins = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/bulletins')
      const data = await res.json()
      console.log(data)
      setBulletins(data)
    } catch (error) {
      console.error('Error fetching bulletins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBulletinImage = (pageId: number) => {
    const image = bulletins[`page${pageId}` as keyof Bulletins]
    return image || null
  }

  const hasBulletins = Object.keys(bulletins).length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Nav page={0} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Welcome to Church
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Navigate to different pages to view the latest bulletin images and announcements for our church community.
          </p>
        </div>
        
        {/* Bulletin Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bulletinPages.map((bulletinPage) => {
            const bulletinImage = getBulletinImage(bulletinPage.id)
            
            return (
              <Link
                key={bulletinPage.id}
                href={bulletinPage.href}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 sm:p-8 h-full transform group-hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {bulletinPage.title}
                    </h3>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ml-2">
                      {bulletinPage.badge}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                    {bulletinPage.description}
                  </p>

                  {/* Bulletin Image */}
                  <div className="mb-6">
                    {isLoading ? (
                      <div className="w-full h-40 sm:h-48 lg:h-52 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-gray-500 text-sm">Loading...</p>
                        </div>
                      </div>
                    ) : bulletinImage ? (
                      <div className="relative overflow-hidden rounded-lg shadow-md">
                        <Image
                          src={bulletinImage}
                          alt={`${bulletinPage.title} bulletin preview`}
                          width={400}
                          height={300}
                          className="w-full h-40 sm:h-48 lg:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                          priority={bulletinPage.id === 1}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to view
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-purple-300 transition-colors duration-200">
                        <div className="text-center">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 group-hover:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm font-medium">No bulletin uploaded</p>
                          <p className="text-gray-400 text-xs mt-1">Click to visit page</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-purple-600 group-hover:text-purple-700 font-medium text-sm sm:text-base">
                      <span>View Full Bulletin</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {getBulletinImage(bulletinPage.id) && (
                      <div className="flex items-center text-green-600 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Available</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Church Bulletin System
            </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Access our weekly bulletins with service schedules, announcements, prayer requests, and community updates. 
              Each page contains different sections of our church bulletin for easy navigation.
            </p>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  )
}