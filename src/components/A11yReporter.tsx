'use client';

import React, { useEffect } from 'react';

export function A11yReporter() {
  useEffect(() => {
    // Only run axe-core in client-side development environments
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      Promise.all([
        import('react'),
        import('react-dom'),
        import('@axe-core/react')
      ]).then(([ReactDep, ReactDOMDep, axeDep]) => {
        const ReactInstance = ReactDep.default || ReactDep;
        const ReactDOMInstance = ReactDOMDep.default || ReactDOMDep;
        const axeInstance = axeDep.default || axeDep;
        
        axeInstance(ReactInstance, ReactDOMInstance, 1000);
      }).catch((err) => {
        console.warn('Could not initialize axe-core/react:', err);
      });
    }
  }, []);

  return null;
}

export default A11yReporter;
