import { BarChart3, Shield, Activity, Settings, Database, AlertTriangle, Upload, Cog, Brain, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", view: "dashboard" },
    { icon: Upload, label: "Cargar Dataset", view: "dataset-upload" },
    { icon: Cog, label: "Preprocesamiento", view: "preprocessing" },
    { icon: Brain, label: "Entrenamiento", view: "model-training" },
    { icon: TrendingUp, label: "Métricas", view: "metrics-visualization" },
    { icon: Activity, label: "Monitoreo", view: "monitoring" },
    { icon: Shield, label: "Seguridad", view: "security" },
    { icon: AlertTriangle, label: "Alertas", view: "alerts" },
    { icon: Database, label: "Modelos", view: "models" },
    { icon: Settings, label: "Configuración", view: "settings" },
  ];

  return (
    <aside className="bg-[#16213e] w-64 min-h-screen border-r border-[#0f3460] p-4">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={activeView === item.view ? "secondary" : "ghost"}
            className={`w-full justify-start text-left ${
              activeView === item.view
                ? "bg-[#e94560] text-white hover:bg-[#e94560]/90"
                : "text-gray-300 hover:text-white hover:bg-[#0f3460]"
            }`}
            onClick={() => onViewChange(item.view)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="mt-8 p-4 bg-[#0f3460] rounded-lg">
        <h3 className="text-white font-medium mb-2">Estado del Sistema</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Operacional</span>
        </div>
      </div>
    </aside>
  );
}