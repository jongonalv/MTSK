import React from 'react';

const QuickAction = ({ link, icon, text, color, onClick }) => (
  <a
    href={link}
    className={`mtsk-action-item mtsk-action-item--${color}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="mtsk-action-icon">{icon}</div>
    <span className="mtsk-action-text">{text}</span>
  </a>
);

export default QuickAction;