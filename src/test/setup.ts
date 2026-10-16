import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom doesn't implement PointerEvent, which some components dispatch.
if (typeof globalThis.PointerEvent === 'undefined') {
  globalThis.PointerEvent = class PointerEvent extends Event {} as typeof globalThis.PointerEvent;
}

afterEach(() => {
  cleanup();
});
