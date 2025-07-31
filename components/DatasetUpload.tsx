import React, { useState } from 'react';
import { DropZone } from './DropZone';
import { ConfigurationForm } from './ConfigurationForm';
import { UploadHistory } from './UploadHistory';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

export function DatasetUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dataType: '',
    tags: [] as string[]
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      name: file.name.replace(/\.(pcap|csv)$/, '')
    }));
    
    // Simular proceso de carga
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(uploadInterval);
          setUploadStatus('validating');
          
          // Simular validación
          setTimeout(() => {
            setUploadStatus('success');
            setUploadProgress(100);
          }, 1500);
          
          return 90;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = () => {
    if (!selectedFile || !formData.name || !formData.dataType) {
      setUploadStatus('error');
      setErrorMessage('Por favor complete todos los campos obligatorios');
      return;
    }

    // Aquí se procesaría el dataset
    console.log('Procesando dataset:', {
      file: selectedFile,
      config: formData
    });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
    setFormData({
      name: '',
      description: '',
      dataType: '',
      tags: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Cargar Dataset</h1>
        <p className="text-gray-400">
          Sube archivos PCAP o CSV para entrenamiento y análisis del modelo de Deep Learning
        </p>
      </div>

      {/* Área Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Carga y Configuración */}
        <div className="space-y-6">
          {/* Zona de Carga */}
          <DropZone
            onFileSelect={handleFileSelect}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
          />

          {/* Formulario de Configuración */}
          <ConfigurationForm
            formData={formData}
            onFormChange={setFormData}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'validating'}
          />

          {/* Botones de Acción */}
          <Card className="bg-[#16213e] border-[#0f3460]">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'validating'}
                  className="flex-1 bg-[#e94560] hover:bg-[#e94560]/90 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Procesar Dataset
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="text-gray-300 border-gray-600 hover:bg-[#0f3460] hover:text-white"
                >
                  Limpiar
                </Button>
              </div>
              
              {uploadStatus === 'success' && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center">
                  <FileCheck className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-400 text-sm">
                    Dataset cargado exitosamente. Listo para procesamiento.
                  </span>
                </div>
              )}
              
              {uploadStatus === 'error' && errorMessage && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">{errorMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel Derecho - Historial */}
        <div>
          <UploadHistory />
        </div>
      </div>
    </div>
  );
}