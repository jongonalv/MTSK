import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const WidgetCard = ({
  icon,
  title,
  loading,
  data,
  emptyMessage,
  renderItem,
  footerLink,
  footerText,
  isChart,
  isSpecs,
  children
}) => (
  <div className={`mtsk-widget-card${isChart ? ' mtsk-widget-card--chart' : ''}${isSpecs ? ' mtsk-widget-card--specs' : ''}`}>
    <div className="mtsk-widget-card__header">
      <div className="mtsk-widget-card__icon">{icon}</div>
      <h3 className="mtsk-widget-card__title">{title}</h3>
    </div>
    <div className="mtsk-widget-card__body">
      {loading ? (
        <div className="mtsk-loading-state">
          <div className="mtsk-loading-bar"></div>
          <div className="mtsk-loading-bar"></div>
          <div className="mtsk-loading-bar"></div>
        </div>
      ) : isChart || isSpecs ? (
        children
      ) : (!data || data.length === 0) ? (
        <div className="mtsk-empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="mtsk-widget-list">
          {data.map((item, index) => (
            <div key={index} className="mtsk-widget-list-item">
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
    {footerLink && (
      <div className="mtsk-widget-footer">
        <a href={footerLink} className="mtsk-widget-footer-link">
          {footerText} <FaArrowRight />
        </a>
      </div>
    )}
  </div>
);

export default WidgetCard;
