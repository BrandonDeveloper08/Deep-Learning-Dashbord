import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataQuality {
  metric: string;
  before: number;
  after: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
}

interface QualityMetricsProps {
  metrics: DataQuality[];
  distributionData: any[];
  showComparison: boolean;
}

const qualityData: DataQuality[] = [
  { metric: 'Completitud', before: 78, after: 100, unit: '%', trend: 'up' },
  { metric: 'Consistencia', before: 65, after: 95, unit: '%', trend: 'up' },
  { metric: 'Dimensiones', before: 247, after: 89, unit: 'features', trend: 'down' },
  { metric: 'Valores únicos', before: 12847, after: 11203, unit: 'registros', trend: 'down' },
];

const distributionBefore = [
  { name: 'Valores válidos', value: 78, color: '#10b981' },
  { name: 'Valores nulos', value: 15, color: '#ef4444' },
  { name: 'Duplicados', value: 7, color: '#f59e0b' }
];

const distributionAfter = [
  { name: 'Valores válidos', value: 95, color: '#10b981' },
  { name: 'Valores nulos', value: 0, color: '#ef4444' },
  { name: 'Duplicados', value: 5, color: '#f59e0b' }
];

export function QualityMetrics({ showComparison = false }: QualityMetricsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (before: number, after: number, metric: string) => {
    const isPositiveChange = (metric === 'Completitud' || metric === 'Consistencia') 
      ? after > before 
      : after < before;
    return isPositiveChange ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Calidad */}
      <Card className="bg-[#16213e] border-[#0f3460]">
        <CardHeader>
          <CardTitle className="text-white">Métricas de Calidad</CardTitle>
          <p className="text-sm text-gray-400">
            Comparación antes y después del preprocesamiento
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{item.metric}</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(item.trend)}
                  <span className="text-white">
                    {showComparison ? `${item.before} → ${item.after}` : item.before} {item.unit}
                  </span>
                </div>
              </div>
              
              {showComparison && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Antes</span>
                      <span className="text-gray-300">{item.before}{item.unit}</span>
                    </div>
                    <Progress value={item.before} max={item.metric === 'Dimensiones' ? 300 : 100} className="h-1 bg-[#0f3460]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Después</span>
                      <span className={`${getChangeColor(item.before, item.after, item.metric)}`}>
                        {item.after}{item.unit}
                      </span>
                    </div>
                    <Progress value={item.after} max={item.metric === 'Dimensiones' ? 300 : 100} className="h-1 bg-[#0f3460]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Distribución de Datos */}
      {showComparison && (
        <Card className="bg-[#16213e] border-[#0f3460]">
          <CardHeader>
            <CardTitle className="text-white">Distribución de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-300 text-sm mb-3 text-center">Antes del Preprocesamiento</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={distributionBefore}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                      fontSize={10}
                    >
                      {distributionBefore.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f3460', border: '1px solid #16213e', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-gray-300 text-sm mb-3 text-center">Después del Preprocesamiento</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={distributionAfter}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                      fontSize={10}
                    >
                      {distributionAfter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f3460', border: '1px solid #16213e', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}