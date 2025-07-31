import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  estimatedTime: string;
  actualTime?: string;
}

interface ProcessingPipelineProps {
  steps: PipelineStep[];
  overallProgress: number;
  isRunning: boolean;
}

export function ProcessingPipeline({ steps, overallProgress, isRunning }: ProcessingPipelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-400 bg-green-400/10';
      case 'processing':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'error':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white">Pipeline de Procesamiento</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progreso General</span>
            <span className="text-white">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-[#0f3460]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-600"></div>
            )}
            
            <div className={`border rounded-lg p-4 ${getStatusColor(step.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(step.status)}
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{step.name}</h4>
                    <span className="text-xs text-gray-400">
                      {step.status === 'completed' && step.actualTime ? step.actualTime : step.estimatedTime}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400">{step.description}</p>
                  
                  {step.status === 'processing' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Progreso</span>
                        <span className="text-gray-300">{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-1 bg-[#0f3460]" />
                    </div>
                  )}
                  
                  {step.status === 'error' && (
                    <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
                      Error en el procesamiento. Verifique los datos de entrada.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isRunning && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-400 animate-pulse" />
              <span className="text-blue-400 text-sm">
                Procesamiento en curso... Los datos se están transformando automáticamente.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}