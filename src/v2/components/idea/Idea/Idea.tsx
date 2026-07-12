import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';
import DeleteIdeaButton from '@/v2/components/idea/DeleteIdeaButton';
import EditIdeaButton from '@/v2/components/idea/EditIdeaButton';
import LikeStat from '@/v2/components/idea/LikeStat';
import ReportIdeaButton from '@/v2/components/idea/ReportIdeaButton';
import Stat from '@/v2/components/idea/Stat';
import UserBar from '@/v2/components/idea/UserBar';
import Markdown from '@/v2/components/ui/Markdown';
import { TEST_IDS } from '@/test-ids';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import IconButton from '../../button/IconButton';
import Link from '../../navigation/Link';
import Icon from '../../ui/Icon';

interface IdeaProps {
  idea: IdeaType;
  categories?: Category[];
  className?: string;
  onChanged?: () => void;
}

const Idea = ({ idea, categories = [], className, onChanged }: IdeaProps) => {
  const { t } = useTranslation();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const moreOptionsToggleRef = useRef<HTMLButtonElement>(null);
  const moreOptionsId = useId();

  useEffect(() => {
    if (!moreOptionsOpen) return;
    moreOptionsRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
  }, [moreOptionsOpen]);

  useEffect(() => {
    if (!moreOptionsOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!moreOptionsRef.current?.contains(event.target as Node)) {
        setMoreOptionsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [moreOptionsOpen]);

  const handleMoreOptionsBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (moreOptionsOpen && !event.currentTarget.contains(event.relatedTarget)) {
      setMoreOptionsOpen(false);
    }
  };

  const handleMoreOptionsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setMoreOptionsOpen(false);
      moreOptionsToggleRef.current?.focus();
    }
  };

  const titleId = useId();
  const phase_id = phase || '0';
  const phaseColor = phases[phase_id] ?? 'wild';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${phase_id}/idea/${idea.hash_id}`;

  return (
    <article aria-labelledby={titleId} data-testid={`idea-${idea.title}`} className={twMerge('flex flex-col gap-1', className)}>
      <div className="flex flex-row-reverse">
        <div className="relative flex flex-col gap-1 flex-1">
          <CategoryList categories={categories} />
          <Link
            className={twMerge(
              'flex flex-col gap-1 p-3 rounded-2xl rounded-bl-none',
              `bg-${phaseColor}`,
              categories.length > 0 ? 'rounded-tl-none' : ''
            )}
            to={ideaPath}
          >
            <h2 id={titleId} className="font-semibold text-foreground">
              {idea.title}
            </h2>
            {idea.content && <Markdown className="prose-sm text-muted line-clamp-3">{idea.content}</Markdown>}
          </Link>
          <div
            className={twMerge(
              'grid transition-[grid-template-rows] duration-150 ease-in-out',
              moreOptionsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            )}
            inert={moreOptionsOpen ? undefined : ''}
            data-testid={TEST_IDS.IDEA_MORE_OPTIONS_PANEL}
          >
            <div
              className={twMerge(
                'flex items-center justify-center gap-3 bg-surface rounded-br-2xl overflow-hidden min-h-0 mr-auto transition-all duration-150 ease-in-out',
                moreOptionsOpen ? 'p-2 px-3' : 'p-0'
              )}
              id={moreOptionsId}
              ref={moreOptionsRef}
              onBlur={handleMoreOptionsBlur}
              onKeyDown={handleMoreOptionsKeyDown}
            >
              <EditIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setMoreOptionsOpen(false)} />
              <DeleteIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setMoreOptionsOpen(false)} />
              <ReportIdeaButton idea={idea} onOpen={() => setMoreOptionsOpen(false)} />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col justify-end items-center">
          <IconButton
            ref={moreOptionsToggleRef}
            aria-label={t('v2.ui.button.more')}
            aria-expanded={moreOptionsOpen}
            aria-controls={moreOptionsId}
            data-testid={TEST_IDS.IDEA_MORE_MENU}
            onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
          >
            <Icon type={moreOptionsOpen ? 'close' : 'more'} />
          </IconButton>
        </div>
      </div>

      <div className="flex justify-between items-center gap-6 mr-1">
        <UserBar name={idea.displayname} date={idea.created} />

        <div className="flex items-center">
          <Stat
            icon="discussion"
            count={idea.sum_comments}
            label={t(idea.sum_comments === 1 ? 'v2.scopes.ideas.stats.comment' : 'v2.scopes.ideas.stats.comments', {
              count: idea.sum_comments,
            })}
            to={ideaPath}
          />
          <LikeStat idea={idea} />
        </div>
      </div>
    </article>
  );
};

export default Idea;
