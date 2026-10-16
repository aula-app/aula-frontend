import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Markdown from './Markdown';

describe('Markdown', () => {
  it('renders standard markdown', () => {
    const { getByText } = render(<Markdown>**bold**</Markdown>);
    expect(getByText('bold').tagName).toBe('STRONG');
  });

  it('converts emoji shortcodes (as serialized by the Tiptap editor) into emoji characters', () => {
    const { container } = render(<Markdown>{'Nice work :smile: :rocket:'}</Markdown>);
    expect(container.textContent).toContain('😄');
    expect(container.textContent).toContain('🚀');
    expect(container.textContent).not.toContain(':smile:');
  });

  it('leaves native unicode emoji untouched', () => {
    const { container } = render(<Markdown>{'Ship it 🚀'}</Markdown>);
    expect(container.textContent).toContain('🚀');
  });
});
