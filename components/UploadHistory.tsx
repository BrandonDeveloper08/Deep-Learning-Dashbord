import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Clock, Eye, Trash2, RotateCcw } from 'lucide-react';

interface UploadHistoryItem {
  id: string;
  name: string;
  type: string;
  timestamp: string;
  size: string;
  status: 'success' | 'failed' | 'processing';
  dataType: string;
}

const historyData: UploadHistoryItem[] = [
  {
    id: '1',
    name: 'dataset_web_traffic_2025.pcap',
    type: 'PCAP',
    timestamp: '2025-01-29 13:45:23',
    size: '245MB',
    status: 'success',
    dataType: 'Mixto'
  },
  {
    id: '2',
    name: 'malware_samples.csv',
    type: 'CSV',
    timestamp: '2025-01-29 12:30:15',
    size: '89MB',
    status: 'success',
    dataType: 'Tráfico Malicioso'
  },
  {
    id: '3',
    name: 'normal_traffic_baseline.pcap',
    type: 'PCAP',
    timestamp: '2025-01-29 11:22:45',
    size: '456MB',
    status: 'failed',
    dataType: 'Tráfico Normal'
  },
  {
    id: '4',
    name: 'network_analysis_data.csv',
    type: 'CSV',
    timestamp: '2025-01-29 10:15:30',
    size: '123MB',
    status: 'processing',
    dataType: 'Mixto'
  }
];

export function UploadHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      success: { label: 'EXITOSO', className: 'bg-green-500' },
      failed: { label: 'FALLIDO', className: 'bg-red-500' },
      processing: { label: 'PROCESANDO', className: 'bg-yellow-500' }
    };
    
    const statusConfig = config[status as keyof typeof config];
    return (
      <Badge className={`${statusConfig.className} text-white text-xs`}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white">Historial de Cargas</CardTitle>
        <p className="text-sm text-gray-400">
          Últimos datasets cargados en el sistema
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historyData.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f3460] p-4 rounded-lg border border-[#1a1a2e] hover:bg-[#1a1a2e]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className="text-white font-medium truncate max-w-64">
                    {item.name}
                  </span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
                <div>
                  <span className="block">Tipo:</span>
                  <span className="text-gray-200">{item.type}</span>
                </div>
                <div>
                  <span className="block">Tamaño:</span>
                  <span className="text-gray-200">{item.size}</span>
                </div>
                <div>
                  <span className="block">Clasificación:</span>
                  <span className="text-gray-200">{item.dataType}</span>
                </div>
                <div>
                  <span className="block">Fecha:</span>
                  <span className="text-gray-200">{item.timestamp}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-300 border-gray-600 hover:bg-[#1a1a2e] hover:text-white"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                
                {item.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-yellow-400 border-yellow-600 hover:bg-yellow-400/10"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reintentar
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-400 border-red-600 hover:bg-red-400/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}