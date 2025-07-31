import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Settings2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface HyperparameterValues {
  epochs: number[];
  batchSize: string;
  learningRate: string;
  optimizer: string;
  lossFunction: string;
}

interface HyperparameterConfigProps {
  values: HyperparameterValues;
  onValuesChange: (values: HyperparameterValues) => void;
  disabled?: boolean;
}

export function HyperparameterConfig({ values, onValuesChange, disabled = false }: HyperparameterConfigProps) {
  const updateValue = (key: keyof HyperparameterValues, value: any) => {
    onValuesChange({
      ...values,
      [key]: value
    });
  };

  const learningRatePresets = [
    { value: '0.001', label: '0.001 (Recomendado)' },
    { value: '0.01', label: '0.01 (Rápido)' },
    { value: '0.0001', label: '0.0001 (Conservador)' }
  ];

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings2 className="h-5 w-5 mr-2 text-[#e94560]" />
          Hiperparámetros
        </CardTitle>
        <p className="text-sm text-gray-400">
          Configura los parámetros de entrenamiento del modelo
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {/* Épocas */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Épocas</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Número de veces que el modelo verá todo el dataset durante el entrenamiento</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">1</span>
                <span className="text-white">{values.epochs[0]} épocas</span>
                <span className="text-gray-400">1000</span>
              </div>
              <Slider
                value={values.epochs}
                onValueChange={(value) => updateValue('epochs', value)}
                min={1}
                max={1000}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
          </div>

          {/* Batch Size */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Batch Size</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Número de muestras procesadas antes de actualizar los pesos del modelo</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={values.batchSize}
              onValueChange={(value) => updateValue('batchSize', value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                <SelectValue placeholder="Selecciona batch size" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="32">32 (Recomendado)</SelectItem>
                <SelectItem value="64">64</SelectItem>
                <SelectItem value="128">128</SelectItem>
                <SelectItem value="256">256</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learning Rate */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Learning Rate</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Controla qué tan grandes son los pasos durante la optimización</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.0001"
                min="0.0001"
                max="1"
                value={values.learningRate}
                onChange={(e) => updateValue('learningRate', e.target.value)}
                disabled={disabled}
                className="bg-[#0f3460] border-[#1a1a2e] text-white"
                placeholder="0.001"
              />
              <div className="grid grid-cols-3 gap-1">
                {learningRatePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => updateValue('learningRate', preset.value)}
                    disabled={disabled}
                    className="text-xs p-1 rounded bg-[#0f3460] text-gray-400 hover:text-white hover:bg-[#1a1a2e] disabled:opacity-50"
                  >
                    {preset.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optimizador */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Optimizador</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Algoritmo utilizado para actualizar los pesos del modelo</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={values.optimizer}
              onValueChange={(value) => updateValue('optimizer', value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                <SelectValue placeholder="Selecciona optimizador" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                <SelectItem value="adam">Adam (Recomendado)</SelectItem>
                <SelectItem value="sgd">SGD</SelectItem>
                <SelectItem value="rmsprop">RMSprop</SelectItem>
                <SelectItem value="adamw">AdamW</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Función de Pérdida */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Función de Pérdida</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Función que mide qué tan lejos está la predicción del valor real</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={values.lossFunction}
              onValueChange={(value) => updateValue('lossFunction', value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                <SelectValue placeholder="Selecciona función de pérdida" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                <SelectItem value="binary_crossentropy">Binary Crossentropy</SelectItem>
                <SelectItem value="categorical_crossentropy">Categorical Crossentropy</SelectItem>
                <SelectItem value="sparse_categorical_crossentropy">Sparse Categorical Crossentropy</SelectItem>
                <SelectItem value="mse">Mean Squared Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}