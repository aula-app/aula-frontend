import '@mdxeditor/editor/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import './print.css';

// Initialize axe-core for accessibility testing in development
if (process.env.NODE_ENV !== 'production') {
  import('./utils/axe').then(({ default: initAxe }) => {
    initAxe();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
