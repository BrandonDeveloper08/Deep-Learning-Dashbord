import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Shield, Zap } from "lucide-react";

interface Alert {
  id: string;
  timestamp: string;
  sourceIP: string;
  threatType: string;
  confidence: number;
  severity: 'high' | 'medium' | 'low';
}

const alerts: Alert[] = [
  {
    id: '1',
    timestamp: '2025-01-29 14:23:45',
    sourceIP: '192.168.1.45',
    threatType: 'DDoS Attack',
    confidence: 98,
    severity: 'high'
  },
  {
    id: '2',
    timestamp: '2025-01-29 14:18:22',
    sourceIP: '10.0.0.127',
    threatType: 'Port Scanning',
    confidence: 87,
    severity: 'medium'
  },
  {
    id: '3',
    timestamp: '2025-01-29 14:15:11',
    sourceIP: '172.16.0.98',
    threatType: 'SQL Injection',
    confidence: 95,
    severity: 'high'
  },
  {
    id: '4',
    timestamp: '2025-01-29 14:12:33',
    sourceIP: '192.168.0.234',
    threatType: 'Anomalous Traffic',
    confidence: 72,
    severity: 'low'
  },
  {
    id: '5',
    timestamp: '2025-01-29 14:09:07',
    sourceIP: '10.0.1.156',
    threatType: 'Brute Force',
    confidence: 91,
    severity: 'high'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertTriangle;
    case 'medium':
      return Zap;
    case 'low':
      return Shield;
    default:
      return AlertTriangle;
  }
};

export function RecentAlerts() {
  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white">Alertas Recientes</CardTitle>
        <p className="text-sm text-gray-400">Últimas 5 amenazas detectadas</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const SeverityIcon = getSeverityIcon(alert.severity);
          return (
            <div key={alert.id} className="bg-[#0f3460] p-4 rounded-lg border border-[#1a1a2e]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <SeverityIcon className={`h-4 w-4 ${getSeverityColor(alert.severity).replace('bg-', 'text-')}`} />
                  <span className="text-white font-medium">{alert.threatType}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getSeverityColor(alert.severity)} text-white text-xs`}
                >
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>IP Origen:</span>
                  <span className="text-gray-200">{alert.sourceIP}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confianza:</span>
                  <span className="text-gray-200">{alert.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-gray-200">{alert.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}