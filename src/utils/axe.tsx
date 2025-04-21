/**
 * Axe-core integration for accessibility testing
 * This only runs in development mode and logs accessibility issues to the console
 */
import React from 'react';

// We'll dynamically import axe-core to avoid bundling it in production
const initAxe = async () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const ReactDOM = await import('react-dom');
      const axe = await import('@axe-core/react');

      // Initialize axe with React and ReactDOM
      axe.default(React, ReactDOM, 1000, {
        // Optional axe-core configuration
        rules: [
          // You can customize rules here
          { id: 'color-contrast', enabled: true },
        ],
      });

      console.log('Axe-core accessibility testing initialized');
    } catch (error) {
      console.error('Error initializing axe-core:', error);
    }
  }
};

export default initAxe;
