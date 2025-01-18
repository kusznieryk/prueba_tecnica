"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { 
  FaBars, 
  FaRightFromBracket, 
  FaUser 
} from "react-icons/fa6"

export default function Navigation() {
  const { user, logout } = useAuth()

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sm:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FaBars className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {user ? (
              <li><Link href="/testeos">Testeos</Link></li>
            ) : (
              <>
                <li><Link href="/login">Iniciar Sesión</Link></li>
                <li><Link href="/register">Registrarse</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 relative">
            <Image
              src="https://imgur.com/aIvyzXg.png"
              alt="logo"
              fill
              className="rounded-full object-contain"
            />
          </div>
          <span className="text-xl font-bold hidden sm:inline-block">Prueba Tecnica</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {user ? (
            <li>
              <Link
                href="/testeos"
                className="btn btn-ghost btn-sm hover:bg-primary hover:text-primary-content"
              >
                Testeos
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  href="/login" 
                  className="btn btn-ghost btn-sm hover:bg-primary hover:text-primary-content"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="btn btn-primary btn-sm"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary/10">
                <span className="text-lg font-bold text-center w-full h-full flex items-center justify-center">
                  <FaUser className="h-5 w-5 opacity-70" />
                </span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button 
                  onClick={logout}
                  className="text-error"
                >
                  <FaRightFromBracket className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}