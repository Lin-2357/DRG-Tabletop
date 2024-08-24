import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from './github/Demo.js';

// ========================================

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  React.createElement(Demo, null)
);
