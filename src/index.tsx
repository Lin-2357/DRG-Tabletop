import React from 'react';
import ReactDOM from 'react-dom/client';
//import Demo from './github/Demo.js';
import Demo from './Demo';

// ========================================

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  React.createElement(Demo, null)
);
