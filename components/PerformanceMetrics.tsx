import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface MetricData {
  name: string;
  value: number;
  previousValue?: number;
  target?: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface PerformanceMetricsProps {
  metrics?: MetricData[];
  className?: string;
}

const defaultMetrics: MetricData[] = [
  {
    name: 'Precisión',
    value: 0.89,
    previousValue: 0.85,
    target: 0.90,
    icon: Target,
    color: 'text-blue-400',
    description: 'Proporción de predicciones positivas correctas'
  },
  {
    name: 'Sensibilidad (Recall)',
    value: 0.94,
    previousValue: 0.92,
    target: 0.85,
    icon: CheckCircle,
    color: 'text-green-400',
    description: 'Proporción de casos positivos detectados'
  },
  {
    name: 'F1-Score',
    value: 0.91,
    previousValue: 0.88,
    target: 0.88,
    icon: TrendingUp,
    color: 'text-purple-400',
    description: 'Media armónica entre precisión y recall'
  },
  {
    name: 'Tasa de Falsos Positivos',
    value: 0.08,
    previousValue: 0.12,
    target: 0.10,
    icon: XCircle,
    color: 'text-red-400',
    description: 'Proporción de falsos positivos'
  }
];

export function PerformanceMetrics({ metrics = defaultMetrics, className = "" }: PerformanceMetricsProps) {
  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null;
    return current > previous ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (current: number, previous?: number, isNegativeMetric = false) => {
    if (!previous) return 'text-gray-400';
    const isIncreasing = current > previous;
    
    if (isNegativeMetric) {
      return isIncreasing ? 'text-red-400' : 'text-green-400';
    }
    return isIncreasing ? 'text-green-400' : 'text-red-400';
  };

  const getTargetStatus = (current: number, target?: number, isNegativeMetric = false) => {
    if (!target) return null;
    
    if (isNegativeMetric) {
      return current <= target ? 'success' : 'warning';
    }
    return current >= target ? 'success' : 'warning';
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const TrendIcon = getTrendIcon(metric.value, metric.previousValue);
        const isNegativeMetric = metric.name.includes('Falsos');
        const targetStatus = getTargetStatus(metric.value, metric.target, isNegativeMetric);
        const trendColor = getTrendColor(metric.value, metric.previousValue, isNegativeMetric);

        return (
          <Card key={index} className="bg-[#16213e] border-[#0f3460]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  <CardTitle className="text-white text-base">{metric.name}</CardTitle>
                </div>
                
                {targetStatus && (
                  <Badge className={`text-xs ${
                    targetStatus === 'success' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {targetStatus === 'success' ? 'Objetivo' : 'Mejora'}
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Valor Principal */}
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(metric.value)}
                  </div>
                  
                  {metric.previousValue && (
                    <div className="flex items-center space-x-1 text-sm">
                      {TrendIcon && <TrendIcon className={`h-3 w-3 ${trendColor}`} />}
                      <span className={trendColor}>
                        {formatPercentage(Math.abs(metric.value - metric.previousValue))}
                      </span>
                      <span className="text-gray-400">vs anterior</span>
                    </div>
                  )}
                </div>

                {metric.target && (
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Objetivo</div>
                    <div className="text-sm text-gray-300">
                      {formatPercentage(metric.target)}
                    </div>
                  </div>
                )}
              </div>

              {/* Progreso hacia el objetivo */}
              {metric.target && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progreso</span>
                    <span className="text-gray-300">
                      {isNegativeMetric 
                        ? `${Math.max(0, ((metric.target - metric.value) / metric.target * 100)).toFixed(0)}%`
                        : `${Math.min(100, (metric.value / metric.target * 100)).toFixed(0)}%`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={isNegativeMetric 
                      ? Math.max(0, ((metric.target - metric.value) / metric.target * 100))
                      : Math.min(100, (metric.value / metric.target * 100))
                    } 
                    className="h-2 bg-[#0f3460]"
                  />
                </div>
              )}

              {/* Comparación Visual */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-gray-400">Actual</span>
                  <div className={`font-medium ${
                    targetStatus === 'success' ? 'text-green-400' : 
                    targetStatus === 'warning' ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {formatPercentage(metric.value)}
                  </div>
                </div>
                
                {metric.previousValue && (
                  <div className="space-y-1">
                    <span className="text-gray-400">Anterior</span>
                    <div className="text-gray-300 font-medium">
                      {formatPercentage(metric.previousValue)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}