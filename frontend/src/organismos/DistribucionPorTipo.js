import React from 'react';
import { FaChartPie } from 'react-icons/fa';
import WidgetCard from '../moleculas/componentes_inicio/WidgetCard';
import { getColorForType } from '../helpers/colors';

const DistribucionPorTipoWidget = ({ loading, stats }) => (
  <WidgetCard 
    icon={<FaChartPie />} 
    title="Distribución por tipo" 
    loading={loading} 
    isChart={true}
  >
    <div className="mtsk-chart-container">
      {stats.tiposEquipos && Object.entries(stats.tiposEquipos).map(([tipo, count]) => (
        <div key={tipo} className="mtsk-chart-item">
          <div className="mtsk-chart-label">
            <span>{tipo}</span>
            <span>{count} ({Math.round((count / stats.totalEquipos) * 100)}%)</span>
          </div>
          <div className="mtsk-chart-bar-container">
            <div 
              className="mtsk-chart-bar" 
              style={{
                width: `${(count / stats.totalEquipos) * 100}%`,
                backgroundColor: getColorForType(tipo)
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </WidgetCard>
);

export default DistribucionPorTipoWidget;