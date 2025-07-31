import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import { Target } from 'lucide-react';

interface ROCPoint {
  fpr: number; // False Positive Rate
  tpr: number; // True Positive Rate
  threshold: number;
}

interface ROCCurveProps {
  data?: ROCPoint[];
  currentPoint?: { fpr: number; tpr: number };
  auc?: number;
  className?: string;
}

// Datos de ejemplo para la curva ROC
const defaultROCData: ROCPoint[] = [
  { fpr: 0, tpr: 0, threshold: 1.0 },
  { fpr: 0.01, tpr: 0.15, threshold: 0.9 },
  { fpr: 0.02, tpr: 0.28, threshold: 0.8 },
  { fpr: 0.04, tpr: 0.45, threshold: 0.7 },
  { fpr: 0.07, tpr: 0.62, threshold: 0.6 },
  { fpr: 0.12, tpr: 0.78, threshold: 0.5 },
  { fpr: 0.18, tpr: 0.87, threshold: 0.4 },
  { fpr: 0.26, tpr: 0.93, threshold: 0.3 },
  { fpr: 0.38, tpr: 0.96, threshold: 0.2 },
  { fpr: 0.55, tpr: 0.98, threshold: 0.1 },
  { fpr: 1, tpr: 1, threshold: 0.0 }
];

// Línea base (clasificador aleatorio)
const baselineData = [
  { fpr: 0, tpr: 0, threshold: 1.0 },
  { fpr: 1, tpr: 1, threshold: 0.0 }
];

export function ROCCurve({ 
  data = defaultROCData, 
  currentPoint = { fpr: 0.12, tpr: 0.78 },
  auc = 0.96,
  className = "" 
}: ROCCurveProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f3460] border border-[#16213e] rounded-lg p-3 shadow-lg">
          <div className="text-white text-sm space-y-1">
            <div>Threshold: {data.threshold?.toFixed(2)}</div>
            <div>TPR: {(data.tpr * 100).toFixed(1)}%</div>
            <div>FPR: {(data.fpr * 100).toFixed(1)}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.fpr === currentPoint.fpr && payload.tpr === currentPoint.tpr) {
      return <Dot cx={cx} cy={cy} r={6} fill="#e94560" stroke="#fff" strokeWidth={2} />;
    }
    return null;
  };

  return (
    <Card className={`bg-[#16213e] border-[#0f3460] ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-[#e94560]" />
            Curva ROC
          </CardTitle>
          <Badge className="bg-[#e94560] text-white">
            AUC: {auc.toFixed(3)}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Relación entre tasa de verdaderos positivos y falsos positivos
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e94560" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e94560" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
              
              <XAxis 
                dataKey="fpr" 
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
                type="number"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              
              <YAxis 
                dataKey="tpr"
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 1]}
                type="number"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Línea base (clasificador aleatorio) */}
              <Area
                data={baselineData}
                dataKey="tpr"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#baselineGradient)"
                fillOpacity={0.3}
              />
              
              {/* Curva ROC principal */}
              <Area
                dataKey="tpr"
                stroke="#e94560"
                strokeWidth={3}
                fill="url(#rocGradient)"
                fillOpacity={0.6}
                dot={<CustomDot />}
              />
              
              {/* Línea de referencia para punto perfecto */}
              <ReferenceLine x={0} y={1} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Información del punto actual */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Punto Actual</div>
              <div className="text-[#e94560] font-medium">
                ({(currentPoint.fpr * 100).toFixed(1)}%, {(currentPoint.tpr * 100).toFixed(1)}%)
              </div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">AUC Score</div>
              <div className="text-green-400 font-medium">{auc.toFixed(3)}</div>
            </div>
            
            <div className="text-center p-3 bg-[#0f3460] rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Clasificación</div>
              <div className={`font-medium ${
                auc > 0.9 ? 'text-green-400' :
                auc > 0.8 ? 'text-yellow-400' :
                auc > 0.7 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {auc > 0.9 ? 'Excelente' :
                 auc > 0.8 ? 'Bueno' :
                 auc > 0.7 ? 'Regular' : 'Deficiente'}
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#e94560] rounded"></div>
              <span className="text-gray-400">Curva ROC</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-[#64748b] rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #64748b 0, #64748b 3px, transparent 3px, transparent 6px)' }}></div>
              <span className="text-gray-400">Línea Base</span>
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