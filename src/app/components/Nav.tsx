import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Nav = ({ page }: { page: number }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", pageNum: 0 },
    { href: "/page1", label: "Page 1", pageNum: 1 },
    { href: "/page2", label: "Page 2", pageNum: 2 },
    { href: "/page3", label: "Page 3", pageNum: 3 }
  ]

  const getNavItemClass = (pageNum:Number) => {
    const baseClass = "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
    
    if (page === pageNum) {
      return `${baseClass} bg-purple-600 text-white shadow-md`
    }
    return `${baseClass} text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm`
  }

  const getMobileNavItemClass = (pageNum:Number) => {
    const baseClass = "block w-full text-left px-4 py-3 text-base font-medium transition-all duration-200"
    
    if (page === pageNum) {
      return `${baseClass} bg-purple-600 text-white`
    }
    return `${baseClass} text-gray-700 hover:text-purple-600 hover:bg-purple-50`
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center text-gray-800 hover:text-purple-600 transition-colors duration-200 font-semibold"
            >
              {/* Logo - using Next.js Image component properly */}
              <div className="w-10 h-10 mr-3 flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png" 
                  alt="NBBCI Logo" 
                  width={32} 
                  height={32}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">NBBCI</span>
                <span className="text-xs text-gray-500 hidden sm:block leading-tight">Church Bulletins</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.pageNum}
                href={item.href}
                className={getNavItemClass(item.pageNum)}
                aria-current={page === item.pageNum ? 'page' : undefined}
              >
                                {page === item.pageNum ? (
                  item.pageNum === 0 ? "Home" : "Current Page"
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-64 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.pageNum}
              href={item.href}
              className={getMobileNavItemClass(item.pageNum)}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={page === item.pageNum ? 'page' : undefined}
            >
                            {page === item.pageNum ? (
                item.pageNum === 0 ? "Home" : "Current Page"  
              ) : (
                item.label
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Nav