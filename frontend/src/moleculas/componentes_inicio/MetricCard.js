import React from 'react';

const MetricCard = ({ icon, title, value, loading, color }) => (
  <div className={`mtsk-metric-card mtsk-metric-card--${color}`}>
    <div className="mtsk-metric-card__icon">{icon}</div>
    <div className="mtsk-metric-card__content">
      <h3 className="mtsk-metric-card__title">{title}</h3>
      <div className="mtsk-metric-card__value">
        {loading ? <div className="mtsk-loading-bar"></div> : value}
      </div>
    </div>
  </div>
);

export default MetricCard;
