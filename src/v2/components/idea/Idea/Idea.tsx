import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';
import LikeStat from '@/v2/components/idea/LikeStat';
import MoreOptions from '@/v2/components/idea/MoreOptions';
import Stat from '@/v2/components/idea/Stat';
import UserBar from '@/v2/components/idea/UserBar';
import Markdown from '@/v2/components/ui/Markdown';
import { TEST_IDS } from '@/test-ids';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import Link from '../../navigation/Link';

interface IdeaProps {
  idea: IdeaType;
  categories?: Category[];
  className?: string;
  onChanged?: () => void;
}

const Idea = ({ idea, categories = [], className, onChanged }: IdeaProps) => {
  const { t } = useTranslation();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();

  const titleId = useId();
  const phase_id = phase || '0';
  const phaseColor = phases[phase_id] ?? 'wild';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${phase_id}/idea/${idea.hash_id}`;

  return (
    <article
      aria-labelledby={titleId}
      data-testid={`idea-${idea.title}`}
      className={twMerge('flex flex-col gap-1', className)}
    >
      <div className="relative flex flex-col-reverse gap-1 flex-1">
        <CategoryList categories={categories} />
        <div
          className={twMerge(
            'relative flex flex-col-reverse ml-4 gap-1 py-2 px-4 rounded-2xl rounded-bl-none',
            `bg-${phaseColor}`,
            categories.length > 0 ? 'rounded-tl-none' : ''
          )}
        >
          <Link to={ideaPath}>
            <h2 id={titleId} className="font-semibold text-foreground">
              {idea.title}
            </h2>
            {idea.content && <Markdown className="prose-sm text-muted line-clamp-3">{idea.content}</Markdown>}
          </Link>
          <MoreOptions idea={idea} onChanged={onChanged} />
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
          <LikeStat idea={idea} data-testid={TEST_IDS.LIKE_BUTTON} />
        </div>
      </div>
    </article>
  );
};

export default Idea;
