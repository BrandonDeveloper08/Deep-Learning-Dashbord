import React, { useState } from 'react';
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { RealTimeMetrics } from "./components/RealTimeMetrics";
import { ActivityChart } from "./components/ActivityChart";
import { RecentAlerts } from "./components/RecentAlerts";
import { ModelStatus } from "./components/ModelStatus";
import { DatasetUpload } from "./components/DatasetUpload";
import { DataPreprocessing } from "./components/DataPreprocessing";
import { ModelTraining } from "./components/ModelTraining";
import { MetricsVisualization } from "./components/MetricsVisualization";

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeView) {
      case 'dataset-upload':
        return <DatasetUpload />;
      
      case 'preprocessing':
        return <DataPreprocessing />;
      
      case 'model-training':
        return <ModelTraining />;
      
      case 'metrics-visualization':
        return <MetricsVisualization />;
      
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Métricas en Tiempo Real */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Métricas en Tiempo Real</h2>
              <RealTimeMetrics />
            </section>

            {/* Gráfico de Actividad y Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <ActivityChart />
              </section>
              
              <section>
                <RecentAlerts />
              </section>
            </div>

            {/* Estado del Modelo */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ModelStatus />
                </div>
                
                {/* Espacio para widgets adicionales */}
                <div className="lg:col-span-2 bg-[#16213e] border border-[#0f3460] rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <h3 className="text-lg font-medium mb-2">Área de Expansión</h3>
                    <p className="text-sm">Espacio disponible para widgets adicionales</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Header */}
      <Header />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#16213e] border-t border-[#0f3460] px-6 py-4">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>© 2025 NetworkTraffic AI - Sistema de Análisis de Tráfico con Deep Learning</span>
          <span>Versión 2.1.4 | Última sincronización: 29/01/2025 14:30</span>
        </div>
      </footer>
    </div>
  );
}