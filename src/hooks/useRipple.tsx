import { useState, useCallback, ReactNode } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

let rippleCount = 0;

/**
 * A hook that provides MUI-like ripple effect functionality
 * @returns Object containing ripple handlers and the Ripples component to render
 *
 * @example
 * const { createRipple, RipplesContainer } = useRipple();
 *
 * <button onMouseDown={createRipple} className="relative overflow-hidden">
 *   Click me
 *   <RipplesContainer />
 * </button>
 */
export const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const id = rippleCount++;
    setRipples((prev) => [...prev, { id, x, y, size }]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const RipplesContainer = useCallback(
    (): ReactNode => (
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-current blur-sm animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            onAnimationEnd={() => removeRipple(ripple.id)}
          />
        ))}
      </span>
    ),
    [ripples, removeRipple]
  );

  return {
    createRipple,
    ripples,
    RipplesContainer,
  };
};

export default useRipple;
