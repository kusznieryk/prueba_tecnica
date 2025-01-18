'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TestType, PatientInfo, TestData } from '@/types/testeo';
import { TesteoService } from '@/services/testeoService';
import { useRouter } from 'next/navigation';

interface FormInputs extends PatientInfo {
  testType: TestType;
  image: FileList;
}

export default function NuevoTesteo() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormInputs>();

  const testTypes: TestType[] = ['k167', 'her2', 'estrogeno', 'progesterona'];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      setLoading(true);
      if (!previewImage) return;

      const patientInfo: PatientInfo = {
        patientName: data.patientName,
        testDate: new Date(data.testDate),
        reportNumber: data.reportNumber
      };

      const result = await TesteoService.analyzeImage(
        data.testType,
        previewImage,
        patientInfo
      );

      setTestData(result);
      setStep(2);
    } catch (error) {
      console.error('Error processing test:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {step === 1 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tipo de Testeo</span>
            </label>
            <select 
              {...register('testType', { required: 'Seleccione un tipo de testeo' })}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione tipo de testeo</option>
              {testTypes.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
            {errors.testType && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.testType.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Imagen</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image', { 
                required: 'Seleccione una imagen',
                onChange: handleImageChange
              })}
              className="file-input file-input-bordered w-full"
            />
            {previewImage && (
              <div className="mt-4">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre del Paciente</span>
            </label>
            <input
              type="text"
              {...register('patientName', { required: 'Ingrese el nombre del paciente' })}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Fecha del Testeo</span>
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              {...register('testDate', { required: 'Ingrese la fecha del testeo' })}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Número de Informe</span>
            </label>
            <input
              type="text"
              {...register('reportNumber', { required: 'Ingrese el número de informe' })}
              className="input input-bordered"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            Procesar Imagen
          </button>
        </form>
      ) : (
        testData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Imagen Original</h3>
                <img 
                  src={testData.originalImage} 
                  alt="Original" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Imagen Procesada</h3>
                <img 
                  src={testData.processedImage} 
                  alt="Processed" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Resultados del Análisis</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Resultados IA</h3>
                    <p>Conteo: {testData.aiResults.aiCount}</p>
                    <p>Células Totales: {testData.aiResults.aiTotalCells}</p>
                    <p>Células Positivas: {testData.aiResults.aiPositiveCells}</p>
                    <p>Células Negativas: {testData.aiResults.aiNegativeCells}</p>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push(`/testeos/${testData.id}`)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}