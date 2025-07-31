import React, { useState } from 'react';
import { PreprocessingConfig } from './PreprocessingConfig';
import { ProcessingPipeline } from './ProcessingPipeline';
import { QualityMetrics } from './QualityMetrics';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Pause, RotateCcw, Eye, Save } from 'lucide-react';

interface PreprocessingOptions {
  removeNulls: boolean;
  normalize: boolean;
  encode: boolean;
  dimensionReduction: boolean;
}

interface AdvancedParams {
  normalizationMethod: string;
  encodingMethod: string;
  reductionMethod: string;
  varianceThreshold: number[];
}

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  estimatedTime: string;
  actualTime?: string;
}

export function DataPreprocessing() {
  const [options, setOptions] = useState<PreprocessingOptions>({
    removeNulls: true,
    normalize: true,
    encode: true,
    dimensionReduction: false
  });

  const [params, setParams] = useState<AdvancedParams>({
    normalizationMethod: 'standard',
    encodingMethod: 'onehot',
    reductionMethod: 'pca',
    varianceThreshold: [85]
  });

  const [processingState, setProcessingState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [steps, setSteps] = useState<PipelineStep[]>([
    {
      id: 'load',
      name: 'Carga de Datos',
      description: 'Cargando dataset desde el almacenamiento',
      status: 'pending',
      progress: 0,
      estimatedTime: '~30s'
    },
    {
      id: 'nulls',
      name: 'Eliminación de Nulos',
      description: 'Removiendo filas con valores faltantes',
      status: 'pending',
      progress: 0,
      estimatedTime: '~45s'
    },
    {
      id: 'normalize',
      name: 'Normalización',
      description: 'Escalando características numéricas',
      status: 'pending',
      progress: 0,
      estimatedTime: '~60s'
    },
    {
      id: 'encode',
      name: 'Codificación',
      description: 'Convirtiendo variables categóricas',
      status: 'pending',
      progress: 0,
      estimatedTime: '~90s'
    }
  ]);

  const startProcessing = () => {
    setProcessingState('running');
    setShowResults(false);
    
    // Simular procesamiento paso a paso
    simulateProcessing();
  };

  const simulateProcessing = async () => {
    const activeSteps = steps.filter(step => {
      if (step.id === 'nulls') return options.removeNulls;
      if (step.id === 'normalize') return options.normalize;
      if (step.id === 'encode') return options.encode;
      return true; // load siempre activo
    });

    for (let i = 0; i < activeSteps.length; i++) {
      const step = activeSteps[i];
      
      // Actualizar estado del paso actual
      setSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'processing' as const }
          : s
      ));

      // Simular progreso del paso
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setSteps(prev => prev.map(s => 
          s.id === step.id 
            ? { ...s, progress }
            : s
        ));

        // Actualizar progreso general
        const stepProgress = (i * 100 + progress) / activeSteps.length;
        setOverallProgress(Math.round(stepProgress));
      }

      // Marcar paso como completado
      setSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'completed' as const, actualTime: `${30 + i * 15}s` }
          : s
      ));
    }

    setProcessingState('completed');
    setShowResults(true);
  };

  const pauseProcessing = () => {
    setProcessingState('paused');
  };

  const resetProcessing = () => {
    setProcessingState('idle');
    setOverallProgress(0);
    setShowResults(false);
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending' as const,
      progress: 0,
      actualTime: undefined
    })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Preprocesamiento de Datos</h1>
        <p className="text-gray-400">
          Configure y monitoree el procesamiento automático de datos para el entrenamiento del modelo
        </p>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Configuración */}
        <div className="space-y-6">
          <PreprocessingConfig
            options={options}
            params={params}
            onOptionsChange={setOptions}
            onParamsChange={setParams}
            disabled={processingState === 'running'}
          />
          
          <QualityMetrics
            metrics={[]}
            distributionData={[]}
            showComparison={showResults}
          />
        </div>

        {/* Panel Derecho - Visualización */}
        <div className="space-y-6">
          <ProcessingPipeline
            steps={steps}
            overallProgress={overallProgress}
            isRunning={processingState === 'running'}
          />
        </div>
      </div>

      {/* Footer - Controles de Acción */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {processingState === 'idle' || processingState === 'completed' ? (
                <Button
                  onClick={startProcessing}
                  className="bg-[#e94560] hover:bg-[#e94560]/90 text-white"
                  disabled={!options.removeNulls && !options.normalize && !options.encode && !options.dimensionReduction}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Preprocesamiento
                </Button>
              ) : processingState === 'running' ? (
                <Button
                  onClick={pauseProcessing}
                  variant="outline"
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={startProcessing}
                  className="bg-[#e94560] hover:bg-[#e94560]/90 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </Button>
              )}

              <Button
                onClick={resetProcessing}
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-[#0f3460] hover:text-white"
                disabled={processingState === 'running'}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>

              {showResults && (
                <Button
                  variant="outline"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Resultados
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              className="text-green-400 border-green-400 hover:bg-green-400/10"
              disabled={processingState === 'running'}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>

          {/* Estado del Sistema */}
          <div className="mt-4 p-3 bg-[#0f3460] rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Estado del Procesamiento:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  processingState === 'running' 
                    ? 'bg-yellow-400 animate-pulse' 
                    : processingState === 'completed'
                    ? 'bg-green-400'
                    : processingState === 'error'
                    ? 'bg-red-400'
                    : 'bg-gray-400'
                }`}></div>
                <span className="text-white capitalize">
                  {processingState === 'idle' ? 'Listo para iniciar' :
                   processingState === 'running' ? 'Procesando...' :
                   processingState === 'completed' ? 'Completado' :
                   processingState === 'paused' ? 'Pausado' : 'Error'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}