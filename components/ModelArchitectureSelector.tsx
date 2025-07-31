import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Network, Layers, Zap } from 'lucide-react';

interface ModelArchitecture {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  icon: React.ComponentType<any>;
  complexity: 'Baja' | 'Media' | 'Alta';
  recommended: boolean;
}

interface ModelArchitectureSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  disabled?: boolean;
}

const architectures: ModelArchitecture[] = [
  {
    id: 'cnn',
    name: 'CNN',
    description: 'Convolutional Neural Network optimizada para detección de patrones en datos de red secuenciales.',
    useCases: ['Detección de DDoS', 'Análisis de tráfico', 'Clasificación de protocolos'],
    icon: Layers,
    complexity: 'Media',
    recommended: true
  },
  {
    id: 'lstm',
    name: 'LSTM',
    description: 'Long Short-Term Memory ideal para analizar secuencias temporales de tráfico de red.',
    useCases: ['Predicción de anomalías', 'Análisis temporal', 'Detección de intrusiones'],
    icon: Network,
    complexity: 'Alta',
    recommended: true
  },
  {
    id: 'rnn',
    name: 'RNN',
    description: 'Recurrent Neural Network para procesar secuencias de datos de red con dependencias temporales.',
    useCases: ['Análisis de sesiones', 'Detección de patrones', 'Clasificación de flujos'],
    icon: Zap,
    complexity: 'Media',
    recommended: false
  },
  {
    id: 'autoencoder',
    name: 'Autoencoder',
    description: 'Red neuronal para detección de anomalías mediante aprendizaje no supervisado.',
    useCases: ['Detección de anomalías', 'Reducción dimensional', 'Detección de outliers'],
    icon: Brain,
    complexity: 'Baja',
    recommended: false
  }
];

export function ModelArchitectureSelector({ selectedModel, onModelSelect, disabled = false }: ModelArchitectureSelectorProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Baja':
        return 'bg-green-500';
      case 'Media':
        return 'bg-yellow-500';
      case 'Alta':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-[#e94560]" />
          Arquitectura del Modelo
        </CardTitle>
        <p className="text-sm text-gray-400">
          Selecciona la arquitectura de red neuronal más adecuada para tu caso de uso
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {architectures.map((arch) => {
          const IconComponent = arch.icon;
          const isSelected = selectedModel === arch.id;
          
          return (
            <div
              key={arch.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-[#e94560] bg-[#e94560]/10'
                  : 'border-[#0f3460] hover:border-[#1a1a2e] hover:bg-[#0f3460]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onModelSelect(arch.id)}
            >
              {arch.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-[#e94560] text-white text-xs">
                  Recomendado
                </Badge>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#e94560]' : 'bg-[#0f3460]'}`}>
                  <IconComponent className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{arch.name}</h4>
                    <Badge className={`${getComplexityColor(arch.complexity)} text-white text-xs`}>
                      {arch.complexity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-400">{arch.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {arch.useCases.map((useCase, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs text-gray-300 border-gray-600"
                      >
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 border-2 border-[#e94560] rounded-lg pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}