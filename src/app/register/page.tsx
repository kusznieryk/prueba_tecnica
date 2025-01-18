"use client"
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'  

interface FormInputs {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError 
  } = useForm<FormInputs>()

  const onSubmit = async (data: FormInputs) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Las contraseñas no coinciden'
        })
        return
      }

      const success = await registerUser(data.username, data.email, data.password)
      if (success) {
        router.push('/')
      } else {
        setError('username', {
          type: 'manual',
          message: 'El usuario ya existe'
        })
      }
    } catch (error) {
      setError('username', {
        type: 'manual',
        message: 'Error al registrar usuario'+error
      })
    }
  }

  return (
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">¡Regístrate ahora!</h1>
            <p className="py-6">Únete a nuestra plataforma de detección temprana de cáncer con IA.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <input
                  {...register("username", { required: "Nombre de usuario requerido" })}
                  className="input input-bordered"
                  placeholder="Nombre de usuario"
                />
                {errors.username && 
                  <span className="text-error text-sm mt-1">{errors.username.message}</span>
                }
              </div>

              <div className="form-control">
                <input
                  {...register("email", { 
                    required: "Correo electrónico requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de correo inválida"
                    }
                  })}
                  className="input input-bordered"
                  placeholder="Correo electrónico"
                />
                {errors.email && 
                  <span className="text-error text-sm mt-1">{errors.email.message}</span>
                }
              </div>

              <div className="form-control">
                <input
                  type="password"
                  {...register("password", { required: "Contraseña requerida" })}
                  className="input input-bordered"
                  placeholder="Contraseña"
                />
                {errors.password && 
                  <span className="text-error text-sm mt-1">{errors.password.message}</span>
                }
              </div>

              <div className="form-control">
                <input
                  type="password"
                  {...register("confirmPassword", { required: "Confirma tu contraseña" })}
                  className="input input-bordered"
                  placeholder="Confirmar contraseña"
                />
                {errors.confirmPassword && 
                  <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
                }
              </div>

              <div className="form-control mt-6">
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}