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
import { useId, useRef, useState } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const phase_id = phase || '0';
  const phaseColor = phases[phase_id] ?? 'wild';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${phase_id}/idea/${idea.hash_id}`;

  return (
    <article aria-labelledby={titleId} className={twMerge('flex flex-col gap-1', className)}>
      <div className="flex">
        <div className="relative flex flex-col-reverse justify-start items-center">
          <IconButton aria-label={t('v2.ui.button.more')} onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}>
            <Icon type={moreOptionsOpen ? 'close' : 'more'} />
          </IconButton>
          <div
            ref={menuRef}
            className={twMerge(
              'absolute bottom-9 grid transition-[grid-template-rows] duration-150 ease-in-out',
              moreOptionsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            )}
            inert={moreOptionsOpen ? undefined : ''}
          >
            <div className="flex flex-col items-center justify-center gap-2 bg-surface shadow-lg p-1 py-1.5 rounded-xl rounded-br-none overflow-hidden min-h-0">
              <EditIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setMoreOptionsOpen(false)} />
              <DeleteIdeaButton idea={idea} onChanged={onChanged} onOpen={() => setMoreOptionsOpen(false)} />
              <ReportIdeaButton idea={idea} onOpen={() => setMoreOptionsOpen(false)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <CategoryList categories={categories} />
          <Link
            className={twMerge(
              'flex flex-col gap-1 p-3 rounded-2xl rounded-bl-none',
              `bg-${phaseColor}`,
              categories.length > 0 ? 'rounded-tl-none' : ''
            )}
            to={ideaPath}
          >
            <h3 id={titleId} className="font-semibold text-foreground">
              {idea.title}
            </h3>
            {idea.content && <Markdown className="prose-sm text-muted line-clamp-3">{idea.content}</Markdown>}
          </Link>
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
