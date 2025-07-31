import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Grid3X3, RotateCcw } from 'lucide-react';

interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
  className?: string;
}

const defaultData: ConfusionMatrixData = {
  truePositive: 2847,
  falsePositive: 203,
  trueNegative: 8923,
  falseNegative: 127
};

export function ConfusionMatrix({ data = defaultData, className = "" }: ConfusionMatrixProps) {
  const [normalizeBy, setNormalizeBy] = useState<'none' | 'rows' | 'columns'>('none');
  const [showPercentages, setShowPercentages] = useState(false);

  const total = data.truePositive + data.falsePositive + data.trueNegative + data.falseNegative;
  
  const calculateValue = (value: number, type: 'tp' | 'fp' | 'tn' | 'fn') => {
    if (normalizeBy === 'none') return value;
    
    if (normalizeBy === 'rows') {
      if (type === 'tp' || type === 'fn') {
        const rowTotal = data.truePositive + data.falseNegative;
        return ((value / rowTotal) * 100);
      } else {
        const rowTotal = data.falsePositive + data.trueNegative;
        return ((value / rowTotal) * 100);
      }
    }
    
    if (normalizeBy === 'columns') {
      if (type === 'tp' || type === 'fp') {
        const colTotal = data.truePositive + data.falsePositive;
        return ((value / colTotal) * 100);
      } else {
        const colTotal = data.trueNegative + data.falseNegative;
        return ((value / colTotal) * 100);
      }
    }
    
    return value;
  };

  const getIntensity = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    return Math.min(1, Math.max(0.1, intensity));
  };

  const maxValue = Math.max(data.truePositive, data.falsePositive, data.trueNegative, data.falseNegative);

  const formatValue = (value: number, originalValue: number) => {
    if (normalizeBy === 'none') {
      return showPercentages ? `${((originalValue / total) * 100).toFixed(1)}%` : originalValue.toLocaleString();
    }
    return `${value.toFixed(1)}%`;
  };

  const precision = data.truePositive / (data.truePositive + data.falsePositive);
  const recall = data.truePositive / (data.truePositive + data.falseNegative);
  const specificity = data.trueNegative / (data.trueNegative + data.falsePositive);
  const accuracy = (data.truePositive + data.trueNegative) / total;

  return (
    <Card className={`bg-[#16213e] border-[#0f3460] ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Grid3X3 className="h-5 w-5 mr-2 text-[#e94560]" />
            Matriz de Confusión
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNormalizeBy('none');
              setShowPercentages(false);
            }}
            className="text-gray-400 border-gray-600 hover:bg-[#0f3460] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Label className="text-gray-400">Normalizar</Label>
            <select
              value={normalizeBy}
              onChange={(e) => setNormalizeBy(e.target.value as 'none' | 'rows' | 'columns')}
              className="bg-[#0f3460] border border-[#1a1a2e] text-white text-xs rounded px-2 py-1"
            >
              <option value="none">Sin normalizar</option>
              <option value="rows">Por filas</option>
              <option value="columns">Por columnas</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={showPercentages && normalizeBy === 'none'}
              onCheckedChange={setShowPercentages}
              disabled={normalizeBy !== 'none'}
            />
            <Label className="text-gray-400">Porcentajes</Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Matriz */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div></div>
            <div className="text-sm font-medium text-gray-400">Predicho</div>
            <div></div>
            
            <div></div>
            <div className="text-sm text-gray-400">Positivo</div>
            <div className="text-sm text-gray-400">Negativo</div>
            
            <div className="text-sm font-medium text-gray-400 flex items-center">
              <span className="transform -rotate-90 whitespace-nowrap">Real</span>
            </div>
            <div className="text-sm text-gray-400">Positivo</div>
            <div className="text-sm text-gray-400">Negativo</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <div className="text-xs text-center text-gray-400">Positivo</div>
            <div className="text-xs text-center text-gray-400">Negativo</div>
            
            <div className="text-xs text-gray-400 flex items-center justify-center">Positivo</div>
            <div
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#e94560] transition-all"
              style={{
                backgroundColor: `rgba(16, 185, 129, ${getIntensity(calculateValue(data.truePositive, 'tp'), maxValue)})`
              }}
            >
              <div className="text-lg font-bold">
                {formatValue(calculateValue(data.truePositive, 'tp'), data.truePositive)}
              </div>
              <div className="text-xs opacity-80">TP</div>
              <Badge className="absolute top-1 right-1 bg-green-600 text-white text-xs">
                Correcto
              </Badge>
            </div>
            <div
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#e94560] transition-all"
              style={{
                backgroundColor: `rgba(239, 68, 68, ${getIntensity(calculateValue(data.falseNegative, 'fn'), maxValue)})`
              }}
            >
              <div className="text-lg font-bold">
                {formatValue(calculateValue(data.falseNegative, 'fn'), data.falseNegative)}
              </div>
              <div className="text-xs opacity-80">FN</div>
              <Badge className="absolute top-1 right-1 bg-red-600 text-white text-xs">
                Error
              </Badge>
            </div>
            
            <div className="text-xs text-gray-400 flex items-center justify-center">Negativo</div>
            <div
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#e94560] transition-all"
              style={{
                backgroundColor: `rgba(245, 158, 11, ${getIntensity(calculateValue(data.falsePositive, 'fp'), maxValue)})`
              }}
            >
              <div className="text-lg font-bold">
                {formatValue(calculateValue(data.falsePositive, 'fp'), data.falsePositive)}
              </div>
              <div className="text-xs opacity-80">FP</div>
              <Badge className="absolute top-1 right-1 bg-yellow-600 text-white text-xs">
                Error
              </Badge>
            </div>
            <div
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#e94560] transition-all"
              style={{
                backgroundColor: `rgba(6, 182, 212, ${getIntensity(calculateValue(data.trueNegative, 'tn'), maxValue)})`
              }}
            >
              <div className="text-lg font-bold">
                {formatValue(calculateValue(data.trueNegative, 'tn'), data.trueNegative)}
              </div>
              <div className="text-xs opacity-80">TN</div>
              <Badge className="absolute top-1 right-1 bg-cyan-600 text-white text-xs">
                Correcto
              </Badge>
            </div>
          </div>
        </div>

        {/* Métricas Calculadas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-gray-400">Precisión:</span>
            <span className="text-white font-medium ml-2">{(precision * 100).toFixed(1)}%</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Recall:</span>
            <span className="text-white font-medium ml-2">{(recall * 100).toFixed(1)}%</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Especificidad:</span>
            <span className="text-white font-medium ml-2">{(specificity * 100).toFixed(1)}%</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400">Accuracy:</span>
            <span className="text-white font-medium ml-2">{(accuracy * 100).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}