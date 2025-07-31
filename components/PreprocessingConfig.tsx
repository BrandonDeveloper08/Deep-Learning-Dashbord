import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Settings2 } from 'lucide-react';

interface PreprocessingOptions {
  removeNulls: boolean;
  normalize: boolean;
  encode: boolean;
  dimensionReduction: boolean;
}

interface AdvancedParams {
  normalizationMethod: string;
  encodingMethod: string;
  reductionMethod: string;
  varianceThreshold: number[];
}

interface PreprocessingConfigProps {
  options: PreprocessingOptions;
  params: AdvancedParams;
  onOptionsChange: (options: PreprocessingOptions) => void;
  onParamsChange: (params: AdvancedParams) => void;
  disabled?: boolean;
}

export function PreprocessingConfig({
  options,
  params,
  onOptionsChange,
  onParamsChange,
  disabled = false
}: PreprocessingConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState<{ [key: string]: boolean }>({});

  const toggleAdvanced = (section: string) => {
    setShowAdvanced(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateOption = (key: keyof PreprocessingOptions, value: boolean) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  const updateParam = (key: keyof AdvancedParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings2 className="h-5 w-5 mr-2 text-[#e94560]" />
          Configuración de Preprocesamiento
        </CardTitle>
        <p className="text-sm text-gray-400">
          Configure las opciones de limpieza y transformación de datos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eliminación de valores nulos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-gray-300">Eliminación de valores nulos</Label>
              <p className="text-xs text-gray-400">Remueve filas con datos faltantes</p>
            </div>
            <Switch
              checked={options.removeNulls}
              onCheckedChange={(checked) => updateOption('removeNulls', checked)}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Normalización de características numéricas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-gray-300">Normalización de características</Label>
              <p className="text-xs text-gray-400">Escala los valores numéricos</p>
            </div>
            <Switch
              checked={options.normalize}
              onCheckedChange={(checked) => updateOption('normalize', checked)}
              disabled={disabled}
            />
          </div>
          
          {options.normalize && (
            <Collapsible open={showAdvanced.normalize} onOpenChange={() => toggleAdvanced('normalize')}>
              <CollapsibleTrigger className="flex items-center text-sm text-gray-400 hover:text-gray-300">
                <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced.normalize ? 'rotate-180' : ''}`} />
                Configuración avanzada
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 bg-[#0f3460] rounded-lg">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Método de normalización</Label>
                  <Select
                    value={params.normalizationMethod}
                    onValueChange={(value) => updateParam('normalizationMethod', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="bg-[#1a1a2e] border-[#16213e] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                      <SelectItem value="minmax">MinMax Scaler</SelectItem>
                      <SelectItem value="standard">Standard Scaler</SelectItem>
                      <SelectItem value="robust">Robust Scaler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Codificación de variables categóricas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-gray-300">Codificación de variables categóricas</Label>
              <p className="text-xs text-gray-400">Convierte texto a valores numéricos</p>
            </div>
            <Switch
              checked={options.encode}
              onCheckedChange={(checked) => updateOption('encode', checked)}
              disabled={disabled}
            />
          </div>
          
          {options.encode && (
            <Collapsible open={showAdvanced.encode} onOpenChange={() => toggleAdvanced('encode')}>
              <CollapsibleTrigger className="flex items-center text-sm text-gray-400 hover:text-gray-300">
                <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced.encode ? 'rotate-180' : ''}`} />
                Configuración avanzada
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 bg-[#0f3460] rounded-lg">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Método de codificación</Label>
                  <Select
                    value={params.encodingMethod}
                    onValueChange={(value) => updateParam('encodingMethod', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="bg-[#1a1a2e] border-[#16213e] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                      <SelectItem value="onehot">One-Hot Encoding</SelectItem>
                      <SelectItem value="label">Label Encoding</SelectItem>
                      <SelectItem value="ordinal">Ordinal Encoding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Reducción de dimensionalidad */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-gray-300">Reducción de dimensionalidad</Label>
              <p className="text-xs text-gray-400">Reduce el número de características</p>
            </div>
            <Switch
              checked={options.dimensionReduction}
              onCheckedChange={(checked) => updateOption('dimensionReduction', checked)}
              disabled={disabled}
            />
          </div>
          
          {options.dimensionReduction && (
            <Collapsible open={showAdvanced.reduction} onOpenChange={() => toggleAdvanced('reduction')}>
              <CollapsibleTrigger className="flex items-center text-sm text-gray-400 hover:text-gray-300">
                <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced.reduction ? 'rotate-180' : ''}`} />
                Configuración avanzada
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-3 bg-[#0f3460] rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Técnica de reducción</Label>
                  <Select
                    value={params.reductionMethod}
                    onValueChange={(value) => updateParam('reductionMethod', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="bg-[#1a1a2e] border-[#16213e] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                      <SelectItem value="pca">PCA</SelectItem>
                      <SelectItem value="tsne">t-SNE</SelectItem>
                      <SelectItem value="umap">UMAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm">
                    Varianza a mantener: {params.varianceThreshold[0]}%
                  </Label>
                  <Slider
                    value={params.varianceThreshold}
                    onValueChange={(value) => updateParam('varianceThreshold', value)}
                    min={50}
                    max={99}
                    step={1}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}