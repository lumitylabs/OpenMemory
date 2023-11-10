import React from 'react';
import ReactDOM from 'react-dom/client'
import { DeviceProvider } from './DeviceContext';
import './assets/index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DeviceProvider>
    <App />
    </DeviceProvider>
  </React.StrictMode>,
);