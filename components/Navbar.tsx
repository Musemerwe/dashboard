"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className='w-full fixed top-0 z-50 bg-white dark:bg-black shadow-sm'>
      <div className='flex items-center justify-between px-[12%] py-4'>
        <Link href='/' className='text-xl font-bold text-black dark:text-white'>
          MyPortfolio
        </Link>

        {/* Desktop Nav */}
        <div className='hidden md:flex space-x-6'>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className='md:hidden'>
          <button onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden px-[12%] pb-4 space-y-4 bg-white dark:bg-black'>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={toggleMenu} className='block text-gray-700 dark:text-gray-300 hover:text-blue-500'>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar


{/*"use client"
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  )
}

export default DarkModeToggle
*/}
