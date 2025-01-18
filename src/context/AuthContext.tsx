'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type User = {
  id: string
  username: string
  email: string
}
type StoredUser = {
  id: string
  username: string
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const cookieUser = Cookies.get('user')
    
    if (cookieUser) {
      const parsedUser = JSON.parse(cookieUser)
      setUser(parsedUser)
    } else if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      Cookies.set('user', storedUser, { expires: 7 }) // 7 days expiry
    }
  }, [])

  const getUsers = () => {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }

  const login = async (username: string, password: string) => {
    const users = getUsers()
    const user = users.find((u:StoredUser) => 
      u.username === username && u.password === password
    )

    if (user) {
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      Cookies.set('user', JSON.stringify(userData), { expires: 7 })
      router.push('/')
      return true
    }
    return false
  }

  const register = async (username: string, email: string, password: string) => {
    const users = getUsers()
    
    if (users.some((u: StoredUser) => u.username === username)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    await login(username, password)
    return true
  }

  const logout = () => {
    localStorage.removeItem('user')
    Cookies.remove('user')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}