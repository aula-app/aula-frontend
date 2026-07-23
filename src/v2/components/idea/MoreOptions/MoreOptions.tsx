import { IdeaType } from '@/types/Scopes';
import DeleteIdeaButton from '@/v2/components/idea/MoreOptions/DeleteIdeaButton';
import EditIdeaButton from '@/v2/components/idea/MoreOptions/EditIdeaButton';
import ReportIdeaButton from '@/v2/components/idea/MoreOptions/ReportIdeaButton';
import ShareIdeaButton from '@/v2/components/idea/MoreOptions/ShareIdeaButton';
import IconButton from '@/v2/components/button/IconButton';
import Collapse from '@/v2/components/ui/Collapse';
import { useDropdown } from '@/v2/components/ui/Dropdown/useDropdown';
import Icon from '@/v2/components/ui/Icon';
import { TEST_IDS } from '@/test-ids';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface MoreOptionsProps {
  idea: IdeaType;
  onChanged?: () => void;
}

const MoreOptions = ({ idea, onChanged }: MoreOptionsProps) => {
  const { t } = useTranslation();

  const { isOpen, toggle, close, wrapperRef } = useDropdown();
  const panelId = useId();

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isOpen && !event.currentTarget.contains(event.relatedTarget)) {
      close();
    }
  };

  return (
    <div ref={wrapperRef} className="contents" onBlur={handleBlur}>
      <IconButton
        aria-label={t('v2.ui.button.more')}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-testid={TEST_IDS.IDEA_MORE_MENU}
        onClick={toggle}
        className="absolute top-1 right-1 z-10"
      >
        <Icon type={isOpen ? 'close' : 'more'} size="1.2em" />
      </IconButton>
      <Collapse
        open={isOpen}
        className={twMerge('justify-end', isOpen ? '-my-1' : undefined)}
        data-testid={TEST_IDS.IDEA_MORE_OPTIONS_PANEL}
      >
        <div className="flex items-center justify-center gap-1 ml-auto mr-6" id={panelId} data-dropdown-panel>
          <EditIdeaButton idea={idea} onChanged={onChanged} onOpen={close} />
          <DeleteIdeaButton idea={idea} onChanged={onChanged} onOpen={close} />
          <ReportIdeaButton idea={idea} onOpen={close} />
          <ShareIdeaButton idea={idea} onOpen={close} />
        </div>
      </Collapse>
    </div>
  );
};

export default MoreOptions;
