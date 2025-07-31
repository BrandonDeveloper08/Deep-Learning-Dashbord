import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Database, Shuffle } from 'lucide-react';

interface DataSplit {
  train: number[];
  validation: number[];
  test: number[];
}

interface DataAugmentation {
  rotation: boolean;
  noise: boolean;
  scaling: boolean;
  shift: boolean;
}

interface DataConfigurationValues {
  selectedDataset: string;
  dataSplit: DataSplit;
  augmentation: DataAugmentation;
}

interface DataConfigurationProps {
  values: DataConfigurationValues;
  onValuesChange: (values: DataConfigurationValues) => void;
  disabled?: boolean;
}

const availableDatasets = [
  { id: 'dataset_1', name: 'Dataset Web Traffic 2025', size: '245MB', samples: '2.8M' },
  { id: 'dataset_2', name: 'Malware Samples', size: '89MB', samples: '1.2M' },
  { id: 'dataset_3', name: 'Normal Traffic Baseline', size: '456MB', samples: '5.1M' },
  { id: 'dataset_4', name: 'Mixed Network Data', size: '123MB', samples: '890K' }
];

export function DataConfiguration({ values, onValuesChange, disabled = false }: DataConfigurationProps) {
  const updateDataset = (datasetId: string) => {
    onValuesChange({
      ...values,
      selectedDataset: datasetId
    });
  };

  const updateDataSplit = (type: keyof DataSplit, value: number[]) => {
    const newSplit = { ...values.dataSplit, [type]: value };
    
    // Asegurar que la suma sea 100%
    const total = newSplit.train[0] + newSplit.validation[0] + newSplit.test[0];
    if (total !== 100) {
      if (type === 'train') {
        const remaining = 100 - value[0];
        newSplit.validation = [Math.round(remaining * 0.5)];
        newSplit.test = [remaining - newSplit.validation[0]];
      } else if (type === 'validation') {
        const remaining = 100 - value[0] - newSplit.train[0];
        newSplit.test = [remaining];
      } else {
        const remaining = 100 - value[0] - newSplit.validation[0];
        newSplit.train = [remaining];
      }
    }
    
    onValuesChange({
      ...values,
      dataSplit: newSplit
    });
  };

  const updateAugmentation = (key: keyof DataAugmentation, value: boolean) => {
    onValuesChange({
      ...values,
      augmentation: {
        ...values.augmentation,
        [key]: value
      }
    });
  };

  const selectedDataset = availableDatasets.find(d => d.id === values.selectedDataset);

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-5 w-5 mr-2 text-[#e94560]" />
          Configuración de Datos
        </CardTitle>
        <p className="text-sm text-gray-400">
          Selecciona el dataset y configura la división de datos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selección de Dataset */}
        <div className="space-y-2">
          <Label className="text-gray-300">Dataset de Entrenamiento</Label>
          <Select
            value={values.selectedDataset}
            onValueChange={updateDataset}
            disabled={disabled}
          >
            <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
              <SelectValue placeholder="Selecciona un dataset" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
              {availableDatasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  <div className="flex flex-col">
                    <span>{dataset.name}</span>
                    <span className="text-xs text-gray-400">{dataset.size} • {dataset.samples} muestras</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedDataset && (
            <div className="p-3 bg-[#0f3460] rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Tamaño:</span>
                  <span className="text-white ml-2">{selectedDataset.size}</span>
                </div>
                <div>
                  <span className="text-gray-400">Muestras:</span>
                  <span className="text-white ml-2">{selectedDataset.samples}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* División de Datos */}
        <div className="space-y-4">
          <Label className="text-gray-300 flex items-center">
            <Shuffle className="h-4 w-4 mr-2" />
            División de Datos
          </Label>
          
          {/* Train */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Entrenamiento</span>
              <span className="text-white">{values.dataSplit.train[0]}%</span>
            </div>
            <Slider
              value={values.dataSplit.train}
              onValueChange={(value) => updateDataSplit('train', value)}
              min={50}
              max={90}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>
          
          {/* Validation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Validación</span>
              <span className="text-white">{values.dataSplit.validation[0]}%</span>
            </div>
            <Slider
              value={values.dataSplit.validation}
              onValueChange={(value) => updateDataSplit('validation', value)}
              min={5}
              max={30}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>
          
          {/* Test */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prueba</span>
              <span className="text-white">{values.dataSplit.test[0]}%</span>
            </div>
            <Slider
              value={values.dataSplit.test}
              onValueChange={(value) => updateDataSplit('test', value)}
              min={5}
              max={30}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>
        </div>

        {/* Data Augmentation */}
        <div className="space-y-4">
          <Label className="text-gray-300">Data Augmentation</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300 text-sm">Rotación de características</span>
                <p className="text-xs text-gray-400">Aplica rotaciones aleatorias a los datos</p>
              </div>
              <Switch
                checked={values.augmentation.rotation}
                onCheckedChange={(checked) => updateAugmentation('rotation', checked)}
                disabled={disabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300 text-sm">Ruido gaussiano</span>
                <p className="text-xs text-gray-400">Añade ruido para mejorar robustez</p>
              </div>
              <Switch
                checked={values.augmentation.noise}
                onCheckedChange={(checked) => updateAugmentation('noise', checked)}
                disabled={disabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300 text-sm">Escalado</span>
                <p className="text-xs text-gray-400">Escalado aleatorio de características</p>
              </div>
              <Switch
                checked={values.augmentation.scaling}
                onCheckedChange={(checked) => updateAugmentation('scaling', checked)}
                disabled={disabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300 text-sm">Desplazamiento temporal</span>
                <p className="text-xs text-gray-400">Desplaza secuencias en el tiempo</p>
              </div>
              <Switch
                checked={values.augmentation.shift}
                onCheckedChange={(checked) => updateAugmentation('shift', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}