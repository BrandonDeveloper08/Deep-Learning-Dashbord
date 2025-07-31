import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Shield, Clock, Cpu } from "lucide-react";

export function RealTimeMetrics() {
  const metrics = [
    {
      title: "Paquetes/Segundo",
      value: "2,847",
      change: "+12%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Tráfico Normal",
      value: "94.2%",
      change: "+2.1%",
      icon: Shield,
      color: "text-green-400"
    },
    {
      title: "Tiempo Respuesta",
      value: "15ms",
      change: "-3ms",
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      title: "Uso GPU",
      value: "67%",
      change: "+5%",
      icon: Cpu,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-[#16213e] border-[#0f3460]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <p className="text-xs text-gray-400">
              <span className={metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                {metric.change}
              </span>
              {" desde la última hora"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}