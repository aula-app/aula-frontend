import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Collapse from './Collapse';

describe('Collapse', () => {
  it('renders children expanded and interactive when open', () => {
    const { getByTestId, getByText } = render(
      <Collapse open data-testid="panel">
        <button>action</button>
      </Collapse>
    );
    expect(getByText('action')).toBeTruthy();
    const panel = getByTestId('panel');
    expect(panel.className).toContain('grid-rows-[1fr]');
    expect(panel.hasAttribute('inert')).toBe(false);
  });

  it('collapses, hides, and inerts content when closed', () => {
    const { getByTestId } = render(
      <Collapse open={false} data-testid="panel">
        <button>action</button>
      </Collapse>
    );
    const panel = getByTestId('panel');
    expect(panel.className).toContain('grid-rows-[0fr]');
    expect(panel.className).toContain('pointer-events-none');
    expect(panel.hasAttribute('inert')).toBe(true);
  });

  it('merges a custom className onto the wrapper', () => {
    const { getByTestId } = render(
      <Collapse open className="-my-1" data-testid="panel">
        content
      </Collapse>
    );
    expect(getByTestId('panel').className).toContain('-my-1');
  });
});
