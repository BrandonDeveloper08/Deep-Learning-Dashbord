import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import { Crosshair } from 'lucide-react';

interface PRPoint {
  recall: number;
  precision: number;
  threshold: number;
}

interface PrecisionRecallCurveProps {
  data?: PRPoint[];
  currentPoint?: { recall: number; precision: number };
  averagePrecision?: number;
  className?: string;
}

// Datos de ejemplo para la curva Precision-Recall
const defaultPRData: PRPoint[] = [
  { recall: 0, precision: 1.0, threshold: 1.0 },
  { recall: 0.15, precision: 0.98, threshold: 0.9 },
  { recall: 0.28, precision: 0.96, threshold: 0.8 },
  { recall: 0.45, precision: 0.94, threshold: 0.7 },
  { recall: 0.62, precision: 0.91, threshold: 0.6 },
  { recall: 0.78, precision: 0.89, threshold: 0.5 },
  { recall: 0.87, precision: 0.85, threshold: 0.4 },
  { recall: 0.93, precision: 0.78, threshold: 0.3 },
  { recall: 0.96, precision: 0.65, threshold: 0.2 },
  { recall: 0.98, precision: 0.45, threshold: 0.1 },
  { recall: 1.0, precision: 0.28, threshold: 0.0 }
];

export function PrecisionRecallCurve({ 
  data = defaultPRData, 
  currentPoint = { recall: 0.78, precision: 0.89 },
  averagePrecision = 0.85,
  className = "" 
}: PrecisionRecallCurveProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f3460] border border-[#16213e] rounded-lg p-3 shadow-lg">
          <div className="text-white text-sm space-y-1">
            <div>Threshold: {data.threshold?.toFixed(2)}</div>
            <div>Precision: {(data.precision * 100).toFixed(1)}%</div>
            <div>Recall: {(data.recall * 100).toFixed(1)}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.recall === currentPoint.recall && payload.precision === currentPoint.precision) {
      return <Dot cx={cx} cy={cy} r={6} fill="#e94560" stroke="#fff" strokeWidth={2} />;
    }
    return null;
  };

  // Calcular punto de equilibrio (donde precision ≈ recall)
  const equilibriumPoint = data.reduce((closest, point) => {
    const currentDiff = Math.abs(point.precision - point.recall);
    const closestDiff = Math.abs(closest.precision - closest.recall);
    return currentDiff < closestDiff ? point : closest;
  });

  return (
    <Card className={`bg-[#16213e] border-[#0f3460] ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Crosshair className="h-5 w-5 mr-2 text-[#e94560]" />
            Curva Precision-Recall
          </CardTitle>
          <Badge className="bg-[#e94560] text-white">
            AP: {averagePrecision.toFixed(3)}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Relación entre precisión y sensibilidad para diferentes umbrales
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e94560" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e94560" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              
              <XAxis 
                dataKey="recall" 
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
                type="number"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ value: 'Recall', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9ca3af' } }}
              />
              
              <YAxis 
                dataKey="precision"
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
                type="number"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ value: 'Precision', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Línea de equilibrio (precision = recall) */}
              <ReferenceLine 
                segment={[{x: 0, y: 1}, {x: 1, y: 0}]} 
                stroke="#64748b" 
                strokeDasharray="5 5" 
                strokeWidth={1}
              />
              
              {/* Curva Precision-Recall */}
              <Line
                type="monotone"
                dataKey="precision"
                stroke="#e94560"
                strokeWidth={3}
                fill="url(#prGradient)"
                dot={<CustomDot />}
                activeDot={{ r: 4, fill: "#e94560", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Información de puntos clave */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Punto Actual</div>
              <div className="text-[#e94560] font-medium">
                P: {(currentPoint.precision * 100).toFixed(1)}%
              </div>
              <div className="text-[#e94560] font-medium">
                R: {(currentPoint.recall * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Average Precision</div>
              <div className="text-green-400 font-medium">{averagePrecision.toFixed(3)}</div>
              <div className="text-xs text-gray-400 mt-1">Área bajo curva</div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Equilibrio</div>
              <div className="text-yellow-400 font-medium">
                {(equilibriumPoint.precision * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">P ≈ R</div>
            </div>
          </div>

          {/* Métricas adicionales */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">F1-Score</div>
              <div className="text-white font-medium">
                {(2 * (currentPoint.precision * currentPoint.recall) / (currentPoint.precision + currentPoint.recall)).toFixed(3)}
              </div>
            </div>
            
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-2">Clasificación</div>
              <div className={`font-medium ${
                averagePrecision > 0.9 ? 'text-green-400' :
                averagePrecision > 0.8 ? 'text-yellow-400' :
                averagePrecision > 0.7 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {averagePrecision > 0.9 ? 'Excelente' :
                 averagePrecision > 0.8 ? 'Bueno' :
                 averagePrecision > 0.7 ? 'Regular' : 'Deficiente'}
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#e94560] rounded"></div>
              <span className="text-gray-400">Curva PR</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-[#64748b] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #64748b 0, #64748b 2px, transparent 2px, transparent 4px)' }}></div>
              <span className="text-gray-400">Equilibrio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#e94560] rounded-full border-2 border-white"></div>
              <span className="text-gray-400">Punto Actual</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}