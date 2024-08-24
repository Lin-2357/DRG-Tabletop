import React from 'react';
import ReactDOM from 'react-dom/client';
//import Demo from './github/Demo.js';
import Demo from './Demo.tsx';

// ========================================

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  React.createElement(Demo, null)
);
