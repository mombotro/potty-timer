// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import SimplePottyTimer from './SimplePottyTimer';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimplePottyTimer />
  </React.StrictMode>
);