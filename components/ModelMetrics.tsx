import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

interface FinalMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

interface ModelComparison {
  modelName: string;
  accuracy: number;
  f1Score: number;
  trainTime: string;
  status: 'current' | 'previous' | 'baseline';
}

interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

interface ModelMetricsProps {
  finalMetrics: FinalMetrics;
  comparisons: ModelComparison[];
  confusionMatrix: ConfusionMatrix;
  showResults: boolean;
}

const defaultMetrics: FinalMetrics = {
  accuracy: 0.92,
  precision: 0.89,
  recall: 0.94,
  f1Score: 0.91,
  auc: 0.96
};

const defaultComparisons: ModelComparison[] = [
  { modelName: 'CNN v2.1 (Actual)', accuracy: 0.92, f1Score: 0.91, trainTime: '2h 45m', status: 'current' },
  { modelName: 'CNN v2.0', accuracy: 0.88, f1Score: 0.86, trainTime: '2h 30m', status: 'previous' },
  { modelName: 'LSTM v1.5', accuracy: 0.85, f1Score: 0.83, trainTime: '3h 15m', status: 'previous' },
  { modelName: 'Baseline SVM', accuracy: 0.76, f1Score: 0.74, trainTime: '45m', status: 'baseline' }
];

const defaultConfusionMatrix: ConfusionMatrix = {
  truePositive: 2847,
  falsePositive: 203,
  trueNegative: 8923,
  falseNegative: 127
};

export function ModelMetrics({ 
  finalMetrics = defaultMetrics, 
  comparisons = defaultComparisons, 
  confusionMatrix = defaultConfusionMatrix,
  showResults = false 
}: ModelMetricsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-[#e94560]';
      case 'previous':
        return 'bg-blue-500';
      case 'baseline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const confusionData = [
    { name: 'True Positive', value: confusionMatrix.truePositive, color: '#10b981' },
    { name: 'False Positive', value: confusionMatrix.falsePositive, color: '#f59e0b' },
    { name: 'True Negative', value: confusionMatrix.trueNegative, color: '#06b6d4' },
    { name: 'False Negative', value: confusionMatrix.falseNegative, color: '#ef4444' }
  ];

  if (!showResults) {
    return (
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Métricas del Modelo</h3>
            <p className="text-sm">
              Las métricas y comparaciones aparecerán aquí una vez completado el entrenamiento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Finales */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Award className="h-5 w-5 mr-2 text-[#e94560]" />
            Métricas Finales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Accuracy
                </span>
                <span className="text-white">{(finalMetrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <Progress value={finalMetrics.accuracy * 100} className="h-2 bg-[#0f3460]" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Precision</span>
                <span className="text-white">{(finalMetrics.precision * 100).toFixed(1)}%</span>
              </div>
              <Progress value={finalMetrics.precision * 100} className="h-2 bg-[#0f3460]" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Recall</span>
                <span className="text-white">{(finalMetrics.recall * 100).toFixed(1)}%</span>
              </div>
              <Progress value={finalMetrics.recall * 100} className="h-2 bg-[#0f3460]" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">F1-Score</span>
                <span className="text-white">{(finalMetrics.f1Score * 100).toFixed(1)}%</span>
              </div>
              <Progress value={finalMetrics.f1Score * 100} className="h-2 bg-[#0f3460]" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">AUC</span>
                <span className="text-white">{(finalMetrics.auc * 100).toFixed(1)}%</span>
              </div>
              <Progress value={finalMetrics.auc * 100} className="h-2 bg-[#0f3460]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparación de Modelos */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#e94560]" />
            Comparación de Modelos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comparisons.map((model, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                model.status === 'current' 
                  ? 'border-[#e94560] bg-[#e94560]/10'
                  : 'border-[#0f3460] bg-[#0f3460]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{model.modelName}</span>
                  <Badge className={`${getStatusColor(model.status)} text-white text-xs`}>
                    {model.status === 'current' ? 'ACTUAL' : 
                     model.status === 'previous' ? 'ANTERIOR' : 'BASELINE'}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">{model.trainTime}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white ml-2">{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">F1-Score:</span>
                  <span className="text-white ml-2">{(model.f1Score * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Matriz de Confusión */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white">Matriz de Confusión</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confusionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f3460', 
                  border: '1px solid #16213e',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="value">
                {confusionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}