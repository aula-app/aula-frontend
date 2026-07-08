import { useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { IdeaType } from '@/types/Scopes';
import { phases } from '@/utils';
import UserBar from '@/v2/components/idea/UserBar';
import Stat from '@/v2/components/idea/Stat';
import CategoryList, { Category } from '@/v2/components/idea/CategoryList';

interface IdeaProps {
  idea: IdeaType;
  /** Optional categories; omitted for now until the data exists. */
  categories?: Category[];
  className?: string;
}

/**
 * Compact idea card. Composes the reusable UserBar, CategoryList and Stat
 * building blocks so the layout stays declarative and each piece can evolve
 * (or be reused) independently.
 */
const Idea = ({ idea, categories, className }: IdeaProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const phaseColor = phases[idea.phase_id] ?? 'wild';

  return (
    <article aria-labelledby={titleId} className={twMerge('flex flex-col gap-2', className)}>
      <CategoryList categories={categories} />

      <div className={twMerge('flex flex-col gap-1 p-3 rounded-2xl rounded-bl-none ml-4', `bg-${phaseColor}`)}>
        <h3 id={titleId} className="font-semibold text-foreground">
          {idea.title}
        </h3>
        {idea.content && <p className="text-sm text-muted">{idea.content}</p>}
      </div>

      <div className="flex justify-between items-center gap-6 mr-4">
        <UserBar name={idea.displayname} date={idea.created} />

        <div className="flex items-center gap-4">
          <Stat
            icon="heart"
            count={idea.sum_likes}
            label={t('v2.scopes.ideas.stats.likes', { count: idea.sum_likes })}
          />
          <Stat
            icon="voting"
            count={idea.sum_votes}
            label={t('v2.scopes.ideas.stats.votes', { count: idea.sum_votes })}
          />
          <Stat
            icon="discussion"
            count={idea.sum_comments}
            label={t('v2.scopes.ideas.stats.comments', { count: idea.sum_comments })}
          />
        </div>
      </div>
    </article>
  );
};

export default Idea;
