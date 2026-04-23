import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  darkMode: boolean        // is dark mode ON or OFF?
  toggleTheme: () => void  // a function to switch between them
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)


interface ThemeProviderProps {
  children: React.ReactNode // React.ReactNode means "any valid JSX/HTML"
}

export function ThemeProvider({ children }: ThemeProviderProps) {

  // The () => {} part runs ONCE on first load to check localStorage
  // so we remember the user's preference even after refresh
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  // useEffect runs this code whenever "darkMode" changes
  useEffect(() => {
    const root = document.documentElement // this is the <html> element

    if (darkMode) {
      root.classList.add('dark')        // adds class="dark" to <html>
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')     // removes class="dark" from <html>
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode]) // dependency array — watch this value

  // This function flips darkMode between true and false
  // "prev" is the current value before the toggle
  const toggleTheme = () => {
    setDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  // Safety check — if someone uses useTheme() outside of ThemeProvider
  // TypeScript will catch it and show a helpful error
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}