import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark') // Force dark theme
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const root = window.document.documentElement
    console.log('ThemeProvider: Forcing dark theme')
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark')
    
    // Always force dark theme
    root.classList.add('dark')
    setActualTheme('dark')
    
    // Store dark theme preference
    localStorage.setItem('theme', 'dark')
    
    // Verify the class was added
    console.log('ThemeProvider: Dark class added:', root.classList.contains('dark'))
    console.log('ThemeProvider: Current classes:', root.className)
  }, [])

  // Listen for system theme changes - but always override to dark
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = window.document.documentElement
      console.log('ThemeProvider: System theme changed, forcing dark')
      root.classList.remove('light', 'dark')
      root.classList.add('dark')
      setActualTheme('dark')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}