'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { TestData, TestResults } from '@/types/testeo'
import { TesteoService } from '@/services/testeoService'
import { useForm } from 'react-hook-form'

interface FormInputs extends TestResults {
  comments?: string;
}
interface PageProps {
  params: Promise<{
    idTesteo: string
  }>
}


export default function TesteoDetails({ params }: PageProps) {
  const router = useRouter()
  const [testeo, setTesteo] = useState<TestData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const { idTesteo } = use(params)
  const { register, handleSubmit } = useForm<FormInputs>()

  useEffect(() => {
    const loadTesteo = async () => {
      try {
        const data = TesteoService.getTestById(idTesteo)
        setTesteo(data)
      } catch (error) {
        console.error('Error loading testeo:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTesteo()
  }, [idTesteo])

  const onSubmit = async (data: FormInputs) => {
    if (!testeo) return
    try {
      const updatedTesteo = await TesteoService.updateTestResults(testeo.id, {
        aiCount: data.aiCount,
        aiTotalCells: data.aiTotalCells,
        aiPositiveCells: data.aiPositiveCells,
        aiNegativeCells: data.aiNegativeCells,
      })
      if (updatedTesteo) {
        setTesteo(updatedTesteo)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating testeo:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await TesteoService.deleteTest(idTesteo)
      router.push('/testeos')
    } catch (error) {
      console.error('Error deleting testeo:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!testeo) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-error">Testeo no encontrado</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Testeo #{testeo.patientInfo.reportNumber}
        </h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>

          <button
            className="btn btn-error"
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Imagen Original</h2>
              <img
                src={testeo.originalImage}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Información del Paciente</h2>
              <p>Nombre: {testeo.patientInfo.patientName}</p>
              <p>Fecha: {new Date(testeo.patientInfo.testDate).toLocaleDateString()}</p>
              <p>N° Informe: {testeo.patientInfo.reportNumber}</p>
              <p>Tipo: {testeo.testType.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Imagen Procesada</h2>
              <img
                src={testeo.processedImage}
                alt="Processed"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Corregir Resultados</h2>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Conteo</span>
                  </label>
                  <input
                    type="number"
                    {...register('aiCount', { required: true })}
                    defaultValue={testeo.aiResults.aiCount}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Células Totales</span>
                  </label>
                  <input
                    type="number"
                    {...register('aiTotalCells', { required: true })}
                    defaultValue={testeo.aiResults.aiTotalCells}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Células Positivas</span>
                  </label>
                  <input
                    type="number"
                    {...register('aiPositiveCells', { required: true })}
                    defaultValue={testeo.aiResults.aiPositiveCells}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Células Negativas</span>
                  </label>
                  <input
                    type="number"
                    {...register('aiNegativeCells', { required: true })}
                    defaultValue={testeo.aiResults.aiNegativeCells}
                    className="input input-bordered"
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-4">
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Resultados del Análisis</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Resultados IA</h3>
                    <p>Conteo: {testeo.aiResults.aiCount}</p>
                    <p>Células Totales: {testeo.aiResults.aiTotalCells}</p>
                    <p>Células Positivas: {testeo.aiResults.aiPositiveCells}</p>
                    <p>Células Negativas: {testeo.aiResults.aiNegativeCells}</p>
                  </div>
                  {testeo.correctedResults && (
                    <div>
                      <h3 className="font-semibold">Resultados Corregidos</h3>
                      <p>Conteo: {testeo.correctedResults.correctedCount}</p>
                      <p>Células Totales: {testeo.correctedResults.correctedTotalCells}</p>
                      <p>Células Positivas: {testeo.correctedResults.correctedPositiveCells}</p>
                      <p>Células Negativas: {testeo.correctedResults.correctedNegativeCells}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {
        showDeleteModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
              <p className="py-4">
                ¿Está seguro que desea eliminar este testeo? Esta acción no se puede deshacer.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}