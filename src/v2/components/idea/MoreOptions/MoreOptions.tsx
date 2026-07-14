import { IdeaType } from '@/types/Scopes';
import DeleteIdeaButton from '@/v2/components/idea/DeleteIdeaButton';
import EditIdeaButton from '@/v2/components/idea/EditIdeaButton';
import ReportIdeaButton from '@/v2/components/idea/ReportIdeaButton';
import ShareIdeaButton from '@/v2/components/idea/ShareIdeaButton';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { TEST_IDS } from '@/test-ids';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface MoreOptionsProps {
  idea: IdeaType;
  onChanged?: () => void;
}

const MoreOptions = ({ idea, onChanged }: MoreOptionsProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      // Ignore the toggle so its own click handler decides; otherwise closing here reopens on click.
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (open && !event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <div className="contents" onBlur={handleBlur} onKeyDown={handleKeyDown}>
      <IconButton
        ref={toggleRef}
        aria-label={t('v2.ui.button.more')}
        aria-expanded={open}
        aria-controls={panelId}
        data-testid={TEST_IDS.IDEA_MORE_MENU}
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-1 right-1 z-10"
      >
        <Icon type={open ? 'close' : 'more'} />
      </IconButton>
      <div
        className={twMerge(
          'grid transition-all duration-150 ease-in-out',
          open ? 'grid-rows-[1fr] -my-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        )}
        inert={open ? undefined : ''}
        data-testid={TEST_IDS.IDEA_MORE_OPTIONS_PANEL}
      >
        <div
          className="flex items-center justify-center gap-1 overflow-hidden min-h-0 ml-auto mr-6 transition-all duration-150 ease-in-out"
          id={panelId}
          ref={panelRef}
        >
          <EditIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setOpen(false)} />
          <DeleteIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setOpen(false)} />
          <ShareIdeaButton idea={idea} onOpen={() => setOpen(false)} />
          <ReportIdeaButton idea={idea} onOpen={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default MoreOptions;
