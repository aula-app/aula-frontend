import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { useScrollRestoration } from './useScrollRestoration';

/**
 * jsdom has no layout engine, so its scrollTop is a plain stored value. Real
 * browsers return 0 from scrollTop (and ignore writes) once an element is
 * detached, because a detached element has no scrolling box. The hook's
 * unmount behavior depends on exactly that, so mimic it here.
 */
const originalScrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')!;
const scrollTops = new WeakMap<Element, number>();

beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollTop', {
    configurable: true,
    get(this: Element) {
      return this.isConnected ? (scrollTops.get(this) ?? 0) : 0;
    },
    set(this: Element, value: number) {
      if (this.isConnected) scrollTops.set(this, value);
    },
  });
});

afterAll(() => {
  Object.defineProperty(Element.prototype, 'scrollTop', originalScrollTop);
});

const List: React.FC<{ storageKey: string; ready?: boolean }> = ({ storageKey, ready = true }) => {
  const ref = useScrollRestoration<HTMLUListElement>(storageKey, ready);
  return <ul ref={ref} data-testid="list" />;
};

const getList = (container: HTMLElement) => container.querySelector('ul') as HTMLUListElement;

describe('useScrollRestoration', () => {
  it('restores the scroll position after unmounting and remounting', () => {
    const first = render(<List storageKey="restore-test" />);
    const list = getList(first.container);

    list.scrollTop = 300;
    fireEvent.scroll(list);
    first.unmount();

    const second = render(<List storageKey="restore-test" />);
    expect(getList(second.container).scrollTop).toBe(300);
  });

  it('keeps positions independent per key', () => {
    const a = render(<List storageKey="key-a" />);
    const listA = getList(a.container);
    listA.scrollTop = 120;
    fireEvent.scroll(listA);
    a.unmount();

    const b = render(<List storageKey="key-b" />);
    const listB = getList(b.container);
    listB.scrollTop = 480;
    fireEvent.scroll(listB);
    b.unmount();

    const aAgain = render(<List storageKey="key-a" />);
    expect(getList(aAgain.container).scrollTop).toBe(120);
  });

  it('does not restore until ready is true', () => {
    const first = render(<List storageKey="ready-test" />);
    const list = getList(first.container);
    list.scrollTop = 200;
    fireEvent.scroll(list);
    first.unmount();

    const second = render(<List storageKey="ready-test" ready={false} />);
    expect(getList(second.container).scrollTop).toBe(0);

    second.rerender(<List storageKey="ready-test" ready />);
    expect(getList(second.container).scrollTop).toBe(200);
  });
});
