import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ConfusionMatrix } from './ConfusionMatrix';
import { ROCCurve } from './ROCCurve';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PrecisionRecallCurve } from './PrecisionRecallCurve';
import { PredictionDistribution } from './PredictionDistribution';
import { ResponseTimeChart } from './ResponseTimeChart';
import { Filter, Download, Calendar as CalendarIcon, Settings, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FilterState {
  selectedModel: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  metricType: string;
  timeRange: '1h' | '6h' | '24h' | '7d';
}

interface ExportOptions {
  format: 'png' | 'pdf' | 'csv';
  charts: string[];
}

export function MetricsVisualization() {
  const [filters, setFilters] = useState<FilterState>({
    selectedModel: 'cnn_v2.1',
    dateRange: {
      from: new Date(2025, 0, 22), // 22 enero 2025
      to: new Date(2025, 0, 29)    // 29 enero 2025
    },
    metricType: 'all',
    timeRange: '24h'
  });

  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableModels = [
    { id: 'cnn_v2.1', name: 'CNN v2.1 (Actual)', status: 'active' },
    { id: 'cnn_v2.0', name: 'CNN v2.0', status: 'previous' },
    { id: 'lstm_v1.5', name: 'LSTM v1.5', status: 'previous' },
    { id: 'baseline_svm', name: 'Baseline SVM', status: 'baseline' }
  ];

  const exportOptions = [
    { format: 'png', label: 'Imágenes PNG' },
    { format: 'pdf', label: 'Reporte PDF' },
    { format: 'csv', label: 'Datos CSV' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleExport = (format: string) => {
    console.log(`Exportando métricas en formato ${format}...`);
    // Aquí iría la lógica de exportación
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectedModel = availableModels.find(m => m.id === filters.selectedModel);

  return (
    <div className="space-y-6">
      {/* Header con Filtros */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Métricas y Visualizaciones</h1>
            <p className="text-gray-400">
              Dashboard de evaluación del rendimiento del modelo de Deep Learning
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-[#0f3460] hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
            
            <Button
              onClick={() => setShowConfigPanel(!showConfigPanel)}
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-[#0f3460] hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Filtros Principales */}
        <Card className="bg-[#16213e] border-[#0f3460]">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Selector de Modelo */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Modelo</label>
                <Select
                  value={filters.selectedModel}
                  onValueChange={(value) => updateFilter('selectedModel', value)}
                >
                  <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                    {availableModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center space-x-2">
                          <span>{model.name}</span>
                          <Badge className={`text-xs ${
                            model.status === 'active' ? 'bg-[#e94560]' :
                            model.status === 'previous' ? 'bg-blue-500' : 'bg-gray-500'
                          } text-white`}>
                            {model.status === 'active' ? 'ACTUAL' :
                             model.status === 'previous' ? 'ANTERIOR' : 'BASE'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de Fechas */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-[#0f3460] border-[#1a1a2e] text-white hover:bg-[#1a1a2e]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from && filters.dateRange.to ? (
                        `${format(filters.dateRange.from, 'dd MMM', { locale: es })} - ${format(filters.dateRange.to, 'dd MMM', { locale: es })}`
                      ) : (
                        'Seleccionar fechas'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#0f3460] border-[#1a1a2e]">
                    <Calendar
                      mode="range"
                      selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          updateFilter('dateRange', { from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tipo de Métrica */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Tipo de Métrica</label>
                <Select
                  value={filters.metricType}
                  onValueChange={(value) => updateFilter('metricType', value)}
                >
                  <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                    <SelectItem value="all">Todas las Métricas</SelectItem>
                    <SelectItem value="classification">Clasificación</SelectItem>
                    <SelectItem value="performance">Rendimiento</SelectItem>
                    <SelectItem value="distribution">Distribución</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exportar */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Exportar</label>
                <Select onValueChange={handleExport}>
                  <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
                    <SelectValue placeholder="Seleccionar formato" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
                    {exportOptions.map(option => (
                      <SelectItem key={option.format} value={option.format}>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información del Modelo Seleccionado */}
            {selectedModel && (
              <div className="mt-4 p-3 bg-[#0f3460] rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">Modelo seleccionado:</span>
                    <span className="text-white font-medium">{selectedModel.name}</span>
                    <Badge className={`${
                      selectedModel.status === 'active' ? 'bg-[#e94560]' :
                      selectedModel.status === 'previous' ? 'bg-blue-500' : 'bg-gray-500'
                    } text-white`}>
                      {selectedModel.status === 'active' ? 'ACTIVO' :
                       selectedModel.status === 'previous' ? 'ANTERIOR' : 'BASELINE'}
                    </Badge>
                  </div>
                  <div className="text-gray-400">
                    Período: {format(filters.dateRange.from, 'dd/MM/yyyy')} - {format(filters.dateRange.to, 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid de Visualizaciones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Primera Fila */}
        <ConfusionMatrix />
        <ROCCurve />
        
        {/* Segunda Fila */}
        <PrecisionRecallCurve />
        <PredictionDistribution />
        
        {/* Tercera Fila */}
        <div className="xl:col-span-2">
          <PerformanceMetrics />
        </div>
        
        {/* Cuarta Fila */}
        <div className="xl:col-span-2">
          <ResponseTimeChart timeRange={filters.timeRange} />
        </div>
      </div>

      {/* Panel de Configuración (Lateral) */}
      {showConfigPanel && (
        <Card className="bg-[#16213e] border-[#0f3460] fixed right-6 top-24 w-80 z-50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Configuración de Gráficos</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfigPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Rango Temporal</label>
              <div className="grid grid-cols-2 gap-2">
                {['1h', '6h', '24h', '7d'].map(range => (
                  <Button
                    key={range}
                    variant={filters.timeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('timeRange', range)}
                    className={filters.timeRange === range 
                      ? 'bg-[#e94560] text-white' 
                      : 'text-gray-400 border-gray-600'
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Opciones de Visualización</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Mostrar tendencias</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Animaciones</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Tooltips detallados</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#e94560] hover:bg-[#e94560]/90 text-white">
              Aplicar Configuración
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}