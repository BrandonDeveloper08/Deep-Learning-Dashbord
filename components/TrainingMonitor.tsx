import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Clock, Zap, Cpu } from 'lucide-react';

interface TrainingMetrics {
  epoch: number;
  loss: number;
  valLoss: number;
  accuracy: number;
  valAccuracy: number;
  f1Score: number;
}

interface TrainingInfo {
  currentEpoch: number;
  totalEpochs: number;
  elapsedTime: string;
  estimatedTime: string;
  samplesPerSecond: number;
  gpuUsage: number;
}

interface TrainingMonitorProps {
  metrics: TrainingMetrics[];
  trainingInfo: TrainingInfo;
  isTraining: boolean;
}

// Datos de ejemplo para la simulación
const exampleMetrics: TrainingMetrics[] = [
  { epoch: 1, loss: 0.8, valLoss: 0.85, accuracy: 0.65, valAccuracy: 0.62, f1Score: 0.58 },
  { epoch: 2, loss: 0.6, valLoss: 0.68, accuracy: 0.72, valAccuracy: 0.70, f1Score: 0.68 },
  { epoch: 3, loss: 0.45, valLoss: 0.52, accuracy: 0.78, valAccuracy: 0.76, f1Score: 0.74 },
  { epoch: 4, loss: 0.35, valLoss: 0.42, accuracy: 0.83, valAccuracy: 0.81, f1Score: 0.79 },
  { epoch: 5, loss: 0.28, valLoss: 0.35, accuracy: 0.87, valAccuracy: 0.85, f1Score: 0.83 },
  { epoch: 6, loss: 0.22, valLoss: 0.29, accuracy: 0.90, valAccuracy: 0.88, f1Score: 0.86 },
];

export function TrainingMonitor({ 
  metrics = exampleMetrics, 
  trainingInfo, 
  isTraining 
}: TrainingMonitorProps) {
  const progressPercentage = (trainingInfo.currentEpoch / trainingInfo.totalEpochs) * 100;

  return (
    <div className="space-y-6">
      {/* Información del Entrenamiento */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[#e94560]" />
            Estado del Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progreso General */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">
                Época {trainingInfo.currentEpoch} de {trainingInfo.totalEpochs}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#0f3460]" />
            <div className="text-center text-xs text-gray-400">
              {progressPercentage.toFixed(1)}% completado
            </div>
          </div>

          {/* Métricas de Rendimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Tiempo</span>
              </div>
              <div className="text-white text-sm">
                {trainingInfo.elapsedTime} / {trainingInfo.estimatedTime}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Velocidad</span>
              </div>
              <div className="text-white text-sm">
                {trainingInfo.samplesPerSecond} samples/seg
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">GPU</span>
              </div>
              <div className="text-white text-sm">
                {trainingInfo.gpuUsage}% usado
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-400">Estado</span>
              </div>
              <div className={`text-sm ${isTraining ? 'text-green-400' : 'text-gray-400'}`}>
                {isTraining ? 'Entrenando...' : 'Detenido'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Pérdida */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white">Función de Pérdida</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              <XAxis 
                dataKey="epoch" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f3460', 
                  border: '1px solid #16213e',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#e94560" 
                strokeWidth={2}
                name="Training Loss"
                dot={{ fill: '#e94560', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="valLoss" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Validation Loss"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Precisión */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white">Precisión y F1-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              <XAxis 
                dataKey="epoch" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f3460', 
                  border: '1px solid #16213e',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Training Accuracy"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="valAccuracy" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="Validation Accuracy"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="f1Score" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="F1-Score"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}