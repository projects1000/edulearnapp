import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'netlify-identity-widget/dist/netlify-identity-widget.css';

// Unregister any existing service workers to fix sw.js errors
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
