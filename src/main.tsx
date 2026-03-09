import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './input.css';
import '../css/main.css';

const routerMode = String(import.meta.env.VITE_ROUTER_MODE || 'browser').toLowerCase();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {routerMode === 'hash' ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
);
