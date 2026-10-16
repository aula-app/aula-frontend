import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ApprovalBar from './ApprovalBar';
import { ApprovalState } from './useIdeaApproval';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

// Reached through RejectionForm's editor; its canvas probe cannot run under jsdom.
vi.mock('is-emoji-supported', () => ({ isEmojiSupported: () => true }));

const openModal = vi.fn();
vi.mock('@/v2/hooks/useModal', () => ({ useModal: () => ({ openModal, closeModal: vi.fn() }) }));

const approval = (overrides: Partial<ApprovalState> = {}): ApprovalState => ({
  approved: null,
  comment: '',
  decide: vi.fn(),
  pending: false,
  ...overrides,
});

const options = (container: HTMLElement) => Array.from(container.querySelectorAll('button'));

describe('ApprovalBar', () => {
  it('approves straight away, with nothing to fill in', () => {
    const decide = vi.fn();
    const { container } = render(<ApprovalBar approval={approval({ decide })} />);

    options(container)[0].click();
    expect(decide).toHaveBeenCalledWith(1);
    expect(openModal).not.toHaveBeenCalled();
  });

  it('asks for the argument before turning an idea down', () => {
    const decide = vi.fn();
    const { container } = render(<ApprovalBar approval={approval({ decide })} />);

    options(container)[1].click();
    expect(decide).not.toHaveBeenCalled();
    expect(openModal).toHaveBeenCalled();
  });

  it('reopens the argument when a rejection is picked again, so it can be rewritten', () => {
    const { container } = render(<ApprovalBar approval={approval({ approved: -1, comment: 'off topic' })} />);

    openModal.mockClear();
    options(container)[1].click();
    expect(openModal).toHaveBeenCalled();
  });

  it('locks both options while a decision is in flight', () => {
    const { container } = render(<ApprovalBar approval={approval({ pending: true })} />);

    expect(options(container).every((button) => button.disabled)).toBe(true);
  });
});
