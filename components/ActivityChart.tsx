import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { time: '00:00', normal: 2400, malicioso: 45, total: 2445 },
  { time: '04:00', normal: 1398, malicioso: 23, total: 1421 },
  { time: '08:00', normal: 9800, malicioso: 156, total: 9956 },
  { time: '12:00', normal: 3908, malicioso: 78, total: 3986 },
  { time: '16:00', normal: 4800, malicioso: 234, total: 5034 },
  { time: '20:00', normal: 3800, malicioso: 89, total: 3889 },
  { time: '24:00', normal: 4300, malicioso: 67, total: 4367 },
];

export function ActivityChart() {
  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white">Actividad de Red - Últimas 24 Horas</CardTitle>
        <p className="text-sm text-gray-400">Volumen de tráfico clasificado por tipo</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f3460', 
                border: '1px solid #16213e',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="normal" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Tráfico Normal"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="malicioso" 
              stroke="#e94560" 
              strokeWidth={2}
              name="Tráfico Malicioso"
              dot={{ fill: '#e94560', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Total"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}