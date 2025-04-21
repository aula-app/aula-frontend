import React from 'react';
import { styled } from '@mui/material/styles';

// Styles to hide content visually while keeping it available to screen readers
const StyledVisuallyHidden = styled('span')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
});

interface VisuallyHiddenProps {
  /**
   * The content to be visually hidden but still available to screen readers
   */
  children: React.ReactNode;
  
  /**
   * If true, the component will be a span instead of a div
   */
  inline?: boolean;
}

/**
 * VisuallyHidden component - hides content visually but keeps it available to screen readers
 * 
 * This is useful for providing additional context to screen reader users without
 * affecting the visual layout.
 * 
 * Example:
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Close Menu</VisuallyHidden>
 * </button>
 */
const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children, inline = false }) => {
  const Component = inline ? 'span' : 'div';
  
  return (
    <StyledVisuallyHidden as={Component}>
      {children}
    </StyledVisuallyHidden>
  );
};

export default VisuallyHidden;