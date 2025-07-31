import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Brain, CheckCircle, Clock, TrendingUp } from "lucide-react";

export function ModelStatus() {
  const modelMetrics = [
    { label: "Precisión", value: 94.7, max: 100 },
    { label: "Recall", value: 92.3, max: 100 },
    { label: "F1-Score", value: 93.5, max: 100 }
  ];

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="h-5 w-5 text-[#e94560]" />
          <span>Estado del Modelo AI</span>
        </CardTitle>
        <p className="text-sm text-gray-400">Deep Learning Neural Network v2.1.4</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado Operacional */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Estado:</span>
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            ACTIVO
          </Badge>
        </div>

        {/* Métricas de Rendimiento */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Métricas de Rendimiento</h4>
          {modelMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{metric.label}</span>
                <span className="text-white">{metric.value}%</span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2 bg-[#0f3460]"
              />
            </div>
          ))}
        </div>

        {/* Información Adicional */}
        <div className="space-y-3 pt-4 border-t border-[#0f3460]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Última Actualización:
            </span>
            <span className="text-gray-200">29/01/2025 13:45</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Muestras Procesadas:
            </span>
            <span className="text-gray-200">2,847,293</span>
          </div>

          <div className="bg-[#0f3460] p-3 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Próxima Actualización:</p>
            <p className="text-sm text-white">Programada para las 02:00 AM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}