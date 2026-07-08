import { IdeaType } from '@/types/Scopes';
import { phases } from '@/utils';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';
import LikeStat from '@/v2/components/idea/LikeStat';
import Stat from '@/v2/components/idea/Stat';
import UserBar from '@/v2/components/idea/UserBar';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import Link from '../../navigation/Link';

interface IdeaProps {
  idea: IdeaType;
  categories?: Category[];
  className?: string;
}

/**
 * Compact idea card. Composes the reusable UserBar, CategoryList and Stat
 * building blocks so the layout stays declarative and each piece can evolve
 * (or be reused) independently.
 */
const Idea = ({ idea, categories = [], className }: IdeaProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const phaseColor = phases[idea.phase_id] ?? 'wild';
  const ideaPath = `/room/${idea.room_hash_id}/phase/${idea.phase_id}/idea/${idea.hash_id}`;

  return (
    <article aria-labelledby={titleId} className={twMerge('flex flex-col gap-1', className)}>
      <CategoryList categories={categories} />

      <Link
        className={twMerge(
          'flex flex-col gap-1 p-3 rounded-2xl rounded-bl-none ml-4',
          `bg-${phaseColor}`,
          categories.length > 0 ? 'rounded-tl-none' : ''
        )}
        to={ideaPath}
      >
        <h3 id={titleId} className="font-semibold text-foreground">
          {idea.title}
        </h3>
        {idea.content && <p className="text-sm text-muted">{idea.content}</p>}
      </Link>

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
