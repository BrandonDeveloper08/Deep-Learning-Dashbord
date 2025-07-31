import React, { useState } from 'react';
import { ModelArchitectureSelector } from './ModelArchitectureSelector';
import { HyperparameterConfig } from './HyperparameterConfig';
import { DataConfiguration } from './DataConfiguration';
import { TrainingMonitor } from './TrainingMonitor';
import { ModelMetrics } from './ModelMetrics';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Pause, Square, Save, Download } from 'lucide-react';

interface HyperparameterValues {
  epochs: number[];
  batchSize: string;
  learningRate: string;
  optimizer: string;
  lossFunction: string;
}

interface DataConfigurationValues {
  selectedDataset: string;
  dataSplit: {
    train: number[];
    validation: number[];
    test: number[];
  };
  augmentation: {
    rotation: boolean;
    noise: boolean;
    scaling: boolean;
    shift: boolean;
  };
}

interface TrainingInfo {
  currentEpoch: number;
  totalEpochs: number;
  elapsedTime: string;
  estimatedTime: string;
  samplesPerSecond: number;
  gpuUsage: number;
}

export function ModelTraining() {
  const [selectedModel, setSelectedModel] = useState('cnn');
  const [trainingState, setTrainingState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle');
  const [showResults, setShowResults] = useState(false);

  const [hyperparameters, setHyperparameters] = useState<HyperparameterValues>({
    epochs: [100],
    batchSize: '32',
    learningRate: '0.001',
    optimizer: 'adam',
    lossFunction: 'binary_crossentropy'
  });

  const [dataConfig, setDataConfig] = useState<DataConfigurationValues>({
    selectedDataset: 'dataset_1',
    dataSplit: {
      train: [70],
      validation: [15],
      test: [15]
    },
    augmentation: {
      rotation: false,
      noise: true,
      scaling: false,
      shift: false
    }
  });

  const [trainingInfo, setTrainingInfo] = useState<TrainingInfo>({
    currentEpoch: 0,
    totalEpochs: hyperparameters.epochs[0],
    elapsedTime: '00:00:00',
    estimatedTime: '02:45:00',
    samplesPerSecond: 0,
    gpuUsage: 0
  });

  const startTraining = () => {
    setTrainingState('running');
    setShowResults(false);
    
    // Simular entrenamiento
    simulateTraining();
  };

  const simulateTraining = async () => {
    const totalEpochs = hyperparameters.epochs[0];
    setTrainingInfo(prev => ({ ...prev, totalEpochs }));

    for (let epoch = 1; epoch <= totalEpochs; epoch++) {
      // Simular época de entrenamiento
      setTrainingInfo(prev => ({
        ...prev,
        currentEpoch: epoch,
        elapsedTime: `${Math.floor(epoch * 1.8 / 60).toString().padStart(2, '0')}:${((epoch * 1.8) % 60).toFixed(0).padStart(2, '0')}:00`,
        samplesPerSecond: 2847 + Math.random() * 500,
        gpuUsage: 75 + Math.random() * 20
      }));

      // Esperar simulación de época (más rápido para demo)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (trainingState !== 'running') break;
    }

    if (trainingState === 'running') {
      setTrainingState('completed');
      setShowResults(true);
    }
  };

  const pauseTraining = () => {
    setTrainingState('paused');
  };

  const stopTraining = () => {
    setTrainingState('idle');
    setTrainingInfo(prev => ({
      ...prev,
      currentEpoch: 0,
      elapsedTime: '00:00:00',
      samplesPerSecond: 0,
      gpuUsage: 0
    }));
    setShowResults(false);
  };

  const saveCheckpoint = () => {
    console.log('Guardando checkpoint del modelo...');
  };

  const downloadModel = () => {
    console.log('Descargando modelo entrenado...');
  };

  const isConfigurationValid = () => {
    return selectedModel && 
           dataConfig.selectedDataset && 
           hyperparameters.learningRate && 
           hyperparameters.batchSize;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Entrenamiento de Modelos</h1>
        <p className="text-gray-400">
          Configure y entrene modelos de Deep Learning para análisis de tráfico de red
        </p>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Panel Izquierdo - Configuración */}
        <div className="xl:col-span-1 space-y-6">
          <ModelArchitectureSelector
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            disabled={trainingState === 'running'}
          />
          
          <HyperparameterConfig
            values={hyperparameters}
            onValuesChange={setHyperparameters}
            disabled={trainingState === 'running'}
          />
          
          <DataConfiguration
            values={dataConfig}
            onValuesChange={setDataConfig}
            disabled={trainingState === 'running'}
          />
        </div>

        {/* Panel Central - Monitoreo */}
        <div className="xl:col-span-1">
          <TrainingMonitor
            metrics={[]}
            trainingInfo={trainingInfo}
            isTraining={trainingState === 'running'}
          />
        </div>

        {/* Panel Derecho - Métricas */}
        <div className="xl:col-span-1">
          <ModelMetrics
            finalMetrics={{
              accuracy: 0.92,
              precision: 0.89,
              recall: 0.94,
              f1Score: 0.91,
              auc: 0.96
            }}
            comparisons={[]}
            confusionMatrix={{
              truePositive: 2847,
              falsePositive: 203,
              trueNegative: 8923,
              falseNegative: 127
            }}
            showResults={showResults}
          />
        </div>
      </div>

      {/* Footer - Controles de Acción */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {trainingState === 'idle' || trainingState === 'completed' ? (
                <Button
                  onClick={startTraining}
                  className="bg-[#e94560] hover:bg-[#e94560]/90 text-white"
                  disabled={!isConfigurationValid()}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Entrenamiento
                </Button>
              ) : trainingState === 'running' ? (
                <Button
                  onClick={pauseTraining}
                  variant="outline"
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={startTraining}
                  className="bg-[#e94560] hover:bg-[#e94560]/90 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </Button>
              )}

              <Button
                onClick={stopTraining}
                variant="outline"
                className="text-red-400 border-red-400 hover:bg-red-400/10"
                disabled={trainingState === 'idle'}
              >
                <Square className="h-4 w-4 mr-2" />
                Detener
              </Button>

              {(trainingState === 'running' || trainingState === 'paused') && (
                <Button
                  onClick={saveCheckpoint}
                  variant="outline"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Checkpoint
                </Button>
              )}
            </div>

            {showResults && (
              <Button
                onClick={downloadModel}
                variant="outline"
                className="text-green-400 border-green-400 hover:bg-green-400/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Modelo
              </Button>
            )}
          </div>

          {/* Estado del Entrenamiento */}
          <div className="mt-4 p-3 bg-[#0f3460] rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Estado del Entrenamiento:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  trainingState === 'running' 
                    ? 'bg-green-400 animate-pulse' 
                    : trainingState === 'completed'
                    ? 'bg-blue-400'
                    : trainingState === 'paused'
                    ? 'bg-yellow-400'
                    : trainingState === 'error'
                    ? 'bg-red-400'
                    : 'bg-gray-400'
                }`}></div>
                <span className="text-white capitalize">
                  {trainingState === 'idle' ? 'Listo para iniciar' :
                   trainingState === 'running' ? 'Entrenando...' :
                   trainingState === 'completed' ? 'Completado' :
                   trainingState === 'paused' ? 'Pausado' : 'Error'}
                </span>
              </div>
            </div>
            
            {trainingInfo.currentEpoch > 0 && (
              <div className="mt-2 text-xs text-gray-400">
                Progreso: {trainingInfo.currentEpoch}/{trainingInfo.totalEpochs} épocas • 
                Tiempo transcurrido: {trainingInfo.elapsedTime} • 
                GPU: {trainingInfo.gpuUsage.toFixed(0)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}