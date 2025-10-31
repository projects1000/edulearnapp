import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'netlify-identity-widget/dist/netlify-identity-widget.css';

// Service worker logic removed to avoid sw.js errors

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
