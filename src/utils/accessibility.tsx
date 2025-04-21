/**
 * Accessibility utilities for Aula frontend
 */
import React from 'react';

/**
 * Adds keyboard support to elements that handle click events but don't have keyboard support natively
 *
 * @param onClick The onClick handler
 * @returns Props that include keyboard handlers
 */
export const withKeyboardSupport = (onClick: (event: React.MouseEvent | React.KeyboardEvent) => void) => {
  return {
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    },
    role: 'button',
    tabIndex: 0,
  };
};

/**
 * Creates props for screen reader only text
 * This makes an element visually hidden but still accessible to screen readers
 */
export const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

/**
 * Generates an ID that can be used for aria-labelledby or aria-describedby
 *
 * @param prefix The prefix for the ID
 * @returns A unique ID
 */
export const generateAccessibleId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Types for accessibility props
 */
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  role?: string;
}

/**
 * Component for creating skip links
 */
export const SkipLink: React.FC<{
  targetId: string;
  children: React.ReactNode;
}> = ({ targetId, children }) => {
  const linkStyle = {
    position: 'absolute',
    top: '-40px',
    left: '0',
    background: '#000',
    color: '#fff',
    padding: '8px',
    zIndex: '100',
    transition: 'top 0.2s',
    ':focus': {
      top: '0',
    },
  } as const;

  return (
    <a
      href={`#${targetId}`}
      style={linkStyle}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

/**
 * Higher-order component that adds a focus outline only when using keyboard navigation
 */
export const withFocusOutline = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    // Track if the user is navigating with keyboard
    const [usingKeyboard, setUsingKeyboard] = React.useState(false);

    React.useEffect(() => {
      const handleKeyDown = () => setUsingKeyboard(true);
      const handleMouseDown = () => setUsingKeyboard(false);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousedown', handleMouseDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousedown', handleMouseDown);
      };
    }, []);

    return <Component {...props} data-using-keyboard={usingKeyboard} />;
  };
};
