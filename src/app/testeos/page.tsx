'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TestData, TestType } from '@/types/testeo'
import { TesteoService } from '@/services/testeoService'
import { TesteoFilters, PaginationParams } from '@/types/filters'
import { FaFilter as FilterIcon } from 'react-icons/fa6'

const ITEMS_PER_PAGE = 2

export default function TesteosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [testeos, setTesteos] = useState<TestData[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [filters, setFilters] = useState<TesteoFilters>({
    patientName: '',
    reportNumber: '',
    testType: '',
    startDate:'',
    endDate: ''
  })
  const [tempFilters, setTempFilters] = useState<TesteoFilters>({
    patientName: '',
    reportNumber: '',
    testType: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  const testTypes: TestType[] = ['k167', 'her2', 'estrogeno', 'progesterona']

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadTesteos()
  }, [user, router, currentPage, filters])

  const loadTesteos = async () => {
    try {
      setLoading(true)
      const pagination: PaginationParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }

      const response = await TesteoService.getAllTests(filters, pagination)
      setTesteos(response.data)
      setTotalItems(response.total)
    } catch (error) {
      console.error('Error loading testeos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field: keyof TesteoFilters, value: string) => {
    setTempFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    setFilters(tempFilters)
    setCurrentPage(1)
    setIsFilterExpanded(false)
  }

  const handleClearFilters = () => {
    const emptyFilters = {
      patientName: '',
      reportNumber: '',
      testType: '',
      startDate: '',
      endDate: ''
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Testeos</h1>
          <Link href="/testeos/nuevo_testeo" className="btn btn-primary">
            Nuevo Testeo
          </Link>
        </div>
  
        <div className="w-full mb-6">
          <div 
            className="flex items-center gap-2 p-4 cursor-pointer border rounded-lg bg-base-100"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            <FilterIcon size={20} />
            <span className="font-medium">Filtrar</span>
            <svg
              className={`ml-auto h-5 w-5 transform transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
  
          {isFilterExpanded && (
            <div className="mt-4 p-4 bg-base-100 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre del Paciente</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={tempFilters.patientName}
                    onChange={(e) => handleFilterChange('patientName', e.target.value)}
                    placeholder="Buscar por nombre..."
                  />
                </div>
  
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Número de Informe</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={tempFilters.reportNumber}
                    onChange={(e) => handleFilterChange('reportNumber', e.target.value)}
                    placeholder="Buscar por N° informe..."
                  />
                </div>
  
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tipo de Testeo</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={tempFilters.testType}
                    onChange={(e) => handleFilterChange('testType', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {testTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rango de Fechas</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="input input-bordered w-1/2"
                      value={tempFilters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      className="input input-bordered w-1/2"
                      value={tempFilters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
  
              <div className="flex justify-between mt-6">
                <button 
                  className="btn btn-ghost"
                  onClick={handleClearFilters}
                >
                  Limpiar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  Buscar
                </button>
              </div>
            </div>
          )}
        </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Tipo</th>
              <th>N° Informe</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {testeos.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No hay testeos disponibles
                </td>
              </tr>
            ) : (
              testeos.map((testeo) => (
                <tr key={testeo.id}>
                  <td>{new Date(testeo.patientInfo.testDate).toLocaleDateString()}</td>
                  <td>{testeo.patientInfo.patientName}</td>
                  <td className="capitalize">{testeo.testType}</td>
                  <td>{testeo.patientInfo.reportNumber}</td>
                  <td>
                    <Link href={`/testeos/${testeo.id}`} className="btn btn-sm btn-primary">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}