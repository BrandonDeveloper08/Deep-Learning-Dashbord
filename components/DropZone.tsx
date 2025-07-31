import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'validating' | 'success' | 'error';
  errorMessage?: string;
}

export function DropZone({ onFileSelect, uploadProgress, uploadStatus, errorMessage }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.name.endsWith('.pcap') || file.name.endsWith('.csv'))) {
      if (file.size <= 500 * 1024 * 1024) { // 500MB limit
        onFileSelect(file);
      } else {
        alert('El archivo excede el límite de 500MB');
      }
    } else {
      alert('Solo se permiten archivos PCAP y CSV');
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 500 * 1024 * 1024) { // 500MB limit
        onFileSelect(file);
      } else {
        alert('El archivo excede el límite de 500MB');
      }
    }
  }, [onFileSelect]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'validating':
        return <Upload className="h-8 w-8 text-blue-400 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-400" />;
      default:
        return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Cargando archivo...';
      case 'validating':
        return 'Validando formato...';
      case 'success':
        return 'Archivo cargado exitosamente';
      case 'error':
        return errorMessage || 'Error al cargar el archivo';
      default:
        return 'Arrastra archivos aquí o haz clic para seleccionar';
    }
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <div
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-[#e94560] bg-[#e94560]/10'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-400/10'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-400/10'
            : 'border-gray-400 hover:border-[#e94560] hover:bg-[#0f3460]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {getStatusIcon()}
        
        <p className="mt-4 text-center text-gray-300 max-w-xs">
          {getStatusText()}
        </p>
        
        {uploadStatus === 'idle' && (
          <>
            <p className="text-sm text-gray-400 mt-2">
              Formatos soportados: PCAP, CSV
            </p>
            <p className="text-xs text-gray-500">
              Límite máximo: 500MB
            </p>
          </>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'validating') && (
          <div className="w-64 mt-4">
            <Progress value={uploadProgress} className="h-2 bg-[#0f3460]" />
            <p className="text-xs text-gray-400 mt-1 text-center">
              {uploadProgress}% completado
            </p>
          </div>
        )}

        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pcap,.csv"
          onChange={handleFileInput}
        />
      </div>
    </Card>
  );
}