import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Clock, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface ResponseTimeData {
  timestamp: string;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number;
  errors: number;
}

interface ResponseTimeChartProps {
  data?: ResponseTimeData[];
  timeRange?: '1h' | '6h' | '24h' | '7d';
  className?: string;
}

// Datos de ejemplo para tiempo de respuesta
const generate24hData = (): ResponseTimeData[] => {
  const data: ResponseTimeData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseLatency = 45 + Math.random() * 20;
    const spike = Math.random() > 0.9 ? 80 : 0; // 10% chance of spike
    
    data.push({
      timestamp: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      avgLatency: baseLatency + spike,
      p95Latency: baseLatency * 1.8 + spike,
      p99Latency: baseLatency * 2.5 + spike,
      throughput: 850 + Math.random() * 300 - spike * 2,
      errors: Math.floor(Math.random() * 5) + (spike > 0 ? 15 : 0)
    });
  }
  
  return data;
};

export function ResponseTimeChart({ 
  data = generate24hData(), 
  timeRange = '24h',
  className = "" 
}: ResponseTimeChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'latency' | 'throughput'>('latency');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f3460] border border-[#16213e] rounded-lg p-3 shadow-lg">
          <div className="text-white text-sm space-y-1">
            <div className="font-medium">{label}</div>
            <div className="text-blue-400">Promedio: {data.avgLatency.toFixed(1)}ms</div>
            <div className="text-yellow-400">P95: {data.p95Latency.toFixed(1)}ms</div>
            <div className="text-red-400">P99: {data.p99Latency.toFixed(1)}ms</div>
            <div className="text-green-400">Throughput: {data.throughput.toFixed(0)} req/s</div>
            {data.errors > 0 && (
              <div className="text-red-400">Errores: {data.errors}</div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calcular estadísticas
  const avgLatency = data.reduce((sum, d) => sum + d.avgLatency, 0) / data.length;
  const maxLatency = Math.max(...data.map(d => d.p99Latency));
  const minLatency = Math.min(...data.map(d => d.avgLatency));
  const avgThroughput = data.reduce((sum, d) => sum + d.throughput, 0) / data.length;
  const totalErrors = data.reduce((sum, d) => sum + d.errors, 0);

  // Identificar picos de latencia
  const slaThreshold = 100; // SLA de 100ms
  const slaViolations = data.filter(d => d.avgLatency > slaThreshold).length;

  return (
    <Card className={`bg-[#16213e] border-[#0f3460] ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#e94560]" />
            Tiempo de Respuesta
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={selectedMetric === 'latency' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('latency')}
              className={selectedMetric === 'latency' ? 'bg-[#e94560] text-white' : 'text-gray-400 border-gray-600'}
            >
              Latencia
            </Button>
            <Button
              variant={selectedMetric === 'throughput' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('throughput')}
              className={selectedMetric === 'throughput' ? 'bg-[#e94560] text-white' : 'text-gray-400 border-gray-600'}
            >
              Throughput
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Rendimiento del modelo en tiempo real durante las últimas {timeRange}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Métricas Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Activity className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-gray-400 text-xs">Latencia Promedio</span>
              </div>
              <div className="text-blue-400 font-bold text-lg">
                {avgLatency.toFixed(1)}ms
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-gray-400 text-xs">Throughput</span>
              </div>
              <div className="text-green-400 font-bold text-lg">
                {avgThroughput.toFixed(0)}
              </div>
              <div className="text-xs text-gray-400">req/s</div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className={`h-4 w-4 mr-1 ${slaViolations > 0 ? 'text-red-400' : 'text-green-400'}`} />
                <span className="text-gray-400 text-xs">SLA</span>
              </div>
              <div className={`font-bold text-lg ${slaViolations > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {((data.length - slaViolations) / data.length * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className={`h-4 w-4 mr-1 ${totalErrors > 0 ? 'text-red-400' : 'text-green-400'}`} />
                <span className="text-gray-400 text-xs">Errores</span>
              </div>
              <div className={`font-bold text-lg ${totalErrors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {totalErrors}
              </div>
            </div>
          </div>

          {/* Gráfico Principal */}
          <ResponsiveContainer width="100%" height={300}>
            {selectedMetric === 'latency' ? (
              <LineChart data={data}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
                
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${value}ms`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {/* Línea SLA */}
                <ReferenceLine 
                  y={slaThreshold} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: "SLA (100ms)", position: "topRight" }}
                />
                
                <Line
                  type="monotone"
                  dataKey="avgLatency"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Promedio"
                  dot={false}
                />
                
                <Line
                  type="monotone"
                  dataKey="p95Latency"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="P95"
                  dot={false}
                />
                
                <Line
                  type="monotone"
                  dataKey="p99Latency"
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  name="P99"
                  dot={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
                
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${value} req/s`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#throughputGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>

          {/* Estadísticas Detalladas */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Rango de Latencia</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-300">Mín:</span>
                  <span className="text-green-400">{minLatency.toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Máx:</span>
                  <span className="text-red-400">{maxLatency.toFixed(1)}ms</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Violaciones SLA</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total:</span>
                  <span className={slaViolations > 0 ? 'text-red-400' : 'text-green-400'}>
                    {slaViolations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">%:</span>
                  <span className={slaViolations > 0 ? 'text-red-400' : 'text-green-400'}>
                    {(slaViolations / data.length * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Estado Actual</div>
              <div className="space-y-1">
                <Badge className={`${
                  data[data.length - 1]?.avgLatency < slaThreshold 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {data[data.length - 1]?.avgLatency < slaThreshold ? 'Saludable' : 'Degradado'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#3b82f6] rounded"></div>
              <span className="text-gray-400">Latencia Promedio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#f59e0b] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #f59e0b 0, #f59e0b 3px, transparent 3px, transparent 6px)' }}></div>
              <span className="text-gray-400">P95</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#ef4444] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #ef4444 0, #ef4444 2px, transparent 2px, transparent 4px)' }}></div>
              <span className="text-gray-400">P99</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#ef4444] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #ef4444 0, #ef4444 3px, transparent 3px, transparent 6px)' }}></div>
              <span className="text-gray-400">SLA</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}