import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDraftStorage } from './useDraftStorage';

const KEY = 'draft-test';

const Form: React.FC<{ enabled?: boolean; storageKey?: string }> = ({ enabled = true, storageKey = KEY }) => {
  const form = useForm({ defaultValues: { title: '' } });
  const { clearDraft } = useDraftStorage(form, { storageKey, enabled });
  return (
    <>
      <input aria-label="title" {...form.register('title')} />
      <button onClick={clearDraft}>clear</button>
    </>
  );
};

const getInput = (container: HTMLElement) => container.querySelector('input') as HTMLInputElement;
const storedTitle = (key = KEY) => {
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw).formData.title : null;
};

afterEach(() => sessionStorage.clear());

describe('useDraftStorage', () => {
  it('mirrors form changes into sessionStorage', () => {
    const { container } = render(<Form />);

    fireEvent.change(getInput(container), { target: { value: 'my idea' } });

    expect(storedTitle()).toBe('my idea');
  });

  it('restores the draft after unmounting and remounting', () => {
    const first = render(<Form />);
    fireEvent.change(getInput(first.container), { target: { value: 'unfinished idea' } });
    first.unmount();

    const second = render(<Form />);
    expect(getInput(second.container).value).toBe('unfinished idea');
  });

  it('keeps drafts independent per key', () => {
    const a = render(<Form storageKey="draft-room-a" />);
    fireEvent.change(getInput(a.container), { target: { value: 'idea for room a' } });
    a.unmount();

    const b = render(<Form storageKey="draft-room-b" />);
    expect(getInput(b.container).value).toBe('');
    expect(storedTitle('draft-room-a')).toBe('idea for room a');
  });

  it('clearDraft removes the stored draft', () => {
    const { container, getByRole } = render(<Form />);
    fireEvent.change(getInput(container), { target: { value: 'discard me' } });

    fireEvent.click(getByRole('button'));

    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('does not restore or write while disabled', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ formData: { title: 'earlier draft' } }));

    const { container } = render(<Form enabled={false} />);
    expect(getInput(container).value).toBe('');

    fireEvent.change(getInput(container), { target: { value: 'edited value' } });
    expect(storedTitle()).not.toBe('edited value');
  });

  it('falls back to the defaults on a malformed draft', () => {
    sessionStorage.setItem(KEY, 'not json');

    const { container } = render(<Form />);

    expect(getInput(container).value).toBe('');
  });
});
