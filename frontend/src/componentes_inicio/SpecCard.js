import React from 'react';

const SpecCard = ({ icon, title, data, emptyMessage }) => (
  <div className="mtsk-spec-card">
    <div className="mtsk-spec-header">
      <div className="mtsk-spec-icon">{icon}</div>
      <h4>{title}</h4>
    </div>
    <div className="mtsk-spec-content">
      {!data || Object.keys(data).length === 0 ? (
        <p className="mtsk-empty-spec">{emptyMessage}</p>
      ) : (
        <ul className="mtsk-spec-list">
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([spec, count]) => (
              <li key={spec}>
                <span className="mtsk-spec-name">{spec}</span>
                <span className="mtsk-spec-count">{count}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  </div>
);

export default SpecCard;
