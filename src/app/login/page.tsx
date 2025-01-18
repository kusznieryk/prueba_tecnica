"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

interface LoginInputs {
  username: string
  password: string
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setError 
  } = useForm<LoginInputs>()

  const onSubmit = async (data: LoginInputs) => {
    try {
      const success = await login(data.username, data.password)
      if (success) {
        router.push('/')
      } else {
        setError('username', {
          type: 'manual',
          message: 'Usuario o contraseña incorrectos'
        })
      }
    } catch (error) {
      setError('username', {
        type: 'manual',
        message: 'Error al iniciar sesión'+error
      })
    }
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Usuario:</span>
                </label>
                <input 
                  {...register('username', { required: 'El usuario es requerido' })}
                  className="input input-bordered w-full"
                />
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.username.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Contraseña:</span>
                </label>
                <div className="relative">
                  <input 
                    {...register('password', { required: 'La contraseña es requerida' })}
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full"
                  />
                  <button 
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <button className="btn w-full mt-6 bg-[#C5558E] text-base-100 border-none hover:bg-[#A8447A]">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}