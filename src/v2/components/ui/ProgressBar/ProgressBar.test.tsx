import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from './ProgressBar';

const fillOf = (container: HTMLElement) =>
  container.querySelector('[role="progressbar"]')!.firstElementChild as HTMLElement;

describe('ProgressBar', () => {
  it('draws no fill and no label at zero', () => {
    const { container } = render(<ProgressBar value={0} color="voting" label="none" valueLabel={<span>0</span>} />);
    const fill = fillOf(container);
    expect(fill.style.width).toBe('0%');
    expect(fill.textContent).toBe('');
  });

  it('keeps the label inside the fill at any non-zero value', () => {
    for (const value of [5, 60]) {
      const { container } = render(<ProgressBar value={value} color="voting" label="x" valueLabel={<span>1</span>} />);
      expect(fillOf(container).textContent).toBe('1');
    }
  });

  it('never lets a label widen the fill past its value', () => {
    const { container } = render(
      <ProgressBar value={30} color="voting" label="some" valueLabel={<span>a very long label indeed</span>} />
    );
    expect(fillOf(container).style.width).toBe('30%');
    expect(fillOf(container).style.minWidth).toBe('');
  });

  it('puts the marker exactly on its threshold, even at the edges', () => {
    const { container } = render(<ProgressBar value={10} color="voting" label="x" marker={97} markerLabel={9} />);
    const marker = container.querySelector('[style*="clip-path"]') as HTMLElement;
    expect(marker.style.left).toBe('97%');
  });

  it('hides the end label once the fill reaches it', () => {
    const { queryByText } = render(<ProgressBar value={95} color="voting" label="x" endLabel={40} />);
    expect(queryByText('40')).toBeNull();
  });

  it('hides the end label once the marker flag reaches it', () => {
    const { queryByText } = render(<ProgressBar value={5} color="voting" label="x" marker={80} endLabel={40} />);
    expect(queryByText('40')).toBeNull();
  });

  it('keeps the end label when nothing is near it', () => {
    const { getByText } = render(<ProgressBar value={20} color="voting" label="x" marker={50} endLabel={40} />);
    expect(getByText('40')).toBeTruthy();
  });
});
