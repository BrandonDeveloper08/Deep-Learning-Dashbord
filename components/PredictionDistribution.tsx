import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface DistributionData {
  bin: string;
  normal: number;
  malicious: number;
  probability: number;
}

interface PredictionDistributionProps {
  data?: DistributionData[];
  defaultThreshold?: number;
  className?: string;
}

// Datos de ejemplo para la distribución de predicciones
const defaultDistributionData: DistributionData[] = [
  { bin: '0.0-0.1', normal: 2847, malicious: 45, probability: 0.05 },
  { bin: '0.1-0.2', normal: 1923, malicious: 78, probability: 0.15 },
  { bin: '0.2-0.3', normal: 1245, malicious: 156, probability: 0.25 },
  { bin: '0.3-0.4', normal: 876, malicious: 289, probability: 0.35 },
  { bin: '0.4-0.5', normal: 567, malicious: 445, probability: 0.45 },
  { bin: '0.5-0.6', normal: 345, malicious: 678, probability: 0.55 },
  { bin: '0.6-0.7', normal: 234, malicious: 923, probability: 0.65 },
  { bin: '0.7-0.8', normal: 156, malicious: 1245, probability: 0.75 },
  { bin: '0.8-0.9', normal: 89, malicious: 1678, probability: 0.85 },
  { bin: '0.9-1.0', normal: 23, malicious: 2345, probability: 0.95 }
];

export function PredictionDistribution({ 
  data = defaultDistributionData, 
  defaultThreshold = 0.5,
  className = "" 
}: PredictionDistributionProps) {
  const [threshold, setThreshold] = useState([defaultThreshold]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].payload.normal + payload[0].payload.malicious;
      return (
        <div className="bg-[#0f3460] border border-[#16213e] rounded-lg p-3 shadow-lg">
          <div className="text-white text-sm space-y-1">
            <div className="font-medium">Rango: {label}</div>
            <div className="text-blue-400">Normal: {payload[0].value?.toLocaleString()}</div>
            <div className="text-red-400">Malicioso: {payload[1].value?.toLocaleString()}</div>
            <div className="text-gray-300">Total: {total.toLocaleString()}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calcular métricas basadas en el umbral actual
  const calculateMetrics = (thresholdValue: number) => {
    let truePositive = 0, falsePositive = 0, trueNegative = 0, falseNegative = 0;

    data.forEach(bin => {
      if (bin.probability >= thresholdValue) {
        // Predicción positiva (malicioso)
        truePositive += bin.malicious;
        falsePositive += bin.normal;
      } else {
        // Predicción negativa (normal)
        trueNegative += bin.normal;
        falseNegative += bin.malicious;
      }
    });

    const precision = truePositive / (truePositive + falsePositive);
    const recall = truePositive / (truePositive + falseNegative);
    const specificity = trueNegative / (trueNegative + falsePositive);
    const accuracy = (truePositive + trueNegative) / (truePositive + falsePositive + trueNegative + falseNegative);

    return { precision, recall, specificity, accuracy, truePositive, falsePositive, trueNegative, falseNegative };
  };

  const metrics = calculateMetrics(threshold[0]);

  return (
    <Card className={`bg-[#16213e] border-[#0f3460] ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-[#e94560]" />
          Distribución de Predicciones
        </CardTitle>
        <p className="text-sm text-gray-400">
          Histograma de probabilidades por clase con umbral ajustable
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Control de Umbral */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-gray-300">Umbral de Clasificación</Label>
              <Badge className="bg-[#e94560] text-white">
                {threshold[0].toFixed(2)}
              </Badge>
            </div>
            <Slider
              value={threshold}
              onValueChange={setThreshold}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.00 (Todo Normal)</span>
              <span>1.00 (Todo Malicioso)</span>
            </div>
          </div>

          {/* Gráfico de Distribución */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              
              <XAxis 
                dataKey="bin" 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Línea de umbral */}
              <ReferenceLine 
                x={data.find(d => Math.abs(d.probability - threshold[0]) < 0.05)?.bin} 
                stroke="#e94560" 
                strokeWidth={3}
                strokeDasharray="5 5"
              />
              
              <Bar dataKey="normal" stackId="predictions" fill="#3b82f6" name="Normal" />
              <Bar dataKey="malicious" stackId="predictions" fill="#ef4444" name="Malicioso" />
            </BarChart>
          </ResponsiveContainer>

          {/* Métricas del Umbral Actual */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Precisión</div>
              <div className="text-blue-400 font-medium">
                {(metrics.precision * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Recall</div>
              <div className="text-green-400 font-medium">
                {(metrics.recall * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Especificidad</div>
              <div className="text-purple-400 font-medium">
                {(metrics.specificity * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Accuracy</div>
              <div className="text-yellow-400 font-medium">
                {(metrics.accuracy * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Matriz de Confusión Simplificada */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Predicciones Correctas</div>
              <div className="flex justify-between">
                <div>
                  <div className="text-green-400 font-medium">TP: {metrics.truePositive.toLocaleString()}</div>
                  <div className="text-cyan-400 font-medium">TN: {metrics.trueNegative.toLocaleString()}</div>
                </div>
                <div className="text-white font-bold text-lg">
                  {((metrics.truePositive + metrics.trueNegative) / 
                    (metrics.truePositive + metrics.falsePositive + metrics.trueNegative + metrics.falseNegative) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Predicciones Incorrectas</div>
              <div className="flex justify-between">
                <div>
                  <div className="text-red-400 font-medium">FP: {metrics.falsePositive.toLocaleString()}</div>
                  <div className="text-orange-400 font-medium">FN: {metrics.falseNegative.toLocaleString()}</div>
                </div>
                <div className="text-white font-bold text-lg">
                  {((metrics.falsePositive + metrics.falseNegative) / 
                    (metrics.truePositive + metrics.falsePositive + metrics.trueNegative + metrics.falseNegative) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#3b82f6] rounded"></div>
              <span className="text-gray-400">Tráfico Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#ef4444] rounded"></div>
              <span className="text-gray-400">Tráfico Malicioso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#e94560] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #e94560 0, #e94560 3px, transparent 3px, transparent 6px)' }}></div>
              <span className="text-gray-400">Umbral</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}