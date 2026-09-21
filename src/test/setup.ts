import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom doesn't implement PointerEvent, which some components dispatch.
if (typeof globalThis.PointerEvent === 'undefined') {
  globalThis.PointerEvent = class PointerEvent extends Event {} as typeof globalThis.PointerEvent;
}

// jsdom doesn't implement matchMedia, which AppStore reads for the dark-mode default.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

// jsdom doesn't implement the <dialog> methods that Modal drives.
if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.show = function show() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

// Node 22+ ships its own `localStorage`/`sessionStorage` globals that only work when the
// process is started with `--localstorage-file`. They shadow the jsdom ones, so modules
// touching storage at import time (e.g. services/consent via hooks/auth) blow up with
// "localStorage.getItem is not a function". Swap in a working in-memory Storage, but only
// when the global is actually broken, so jsdom's own implementation is preferred.
const installStorage = (key: 'localStorage' | 'sessionStorage') => {
  if (typeof (globalThis as any)[key]?.getItem === 'function') return;

  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (name) => (store.has(name) ? store.get(name)! : null),
    key: (index) => [...store.keys()][index] ?? null,
    removeItem: (name) => void store.delete(name),
    setItem: (name, value) => void store.set(name, String(value)),
  };

  for (const target of [globalThis, typeof window !== 'undefined' ? window : undefined]) {
    if (target) Object.defineProperty(target, key, { value: storage, configurable: true, writable: true });
  }
};

installStorage('localStorage');
installStorage('sessionStorage');

afterEach(() => {
  cleanup();
});
