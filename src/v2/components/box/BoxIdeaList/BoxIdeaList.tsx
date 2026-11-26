import { IdeaType } from '@/types/Scopes';
import { Vote } from '@/utils';
import { PhaseType, RoomPhases } from '@/types/SettingsTypes';
import { Category } from '@/v2/components/idea/CategoryList';
import PhaseStatus, { getPhaseStatus } from '@/v2/components/idea/PhaseStatus';
import Link from '@/v2/components/navigation/Link';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface BoxIdeaListProps {
  ideas: IdeaType[];
  phase: `${RoomPhases}`;
  color: PhaseType;
  boxPath: string;
  /** Keyed by idea hash_id. */
  categories?: Record<string, Category>;
  /** Keyed by idea hash_id. */
  votes?: Record<string, Vote | null>;
  className?: string;
  'data-testid'?: string;
}

const DISCUSSION_PHASE = '10';

// 3.5 rows, so the list visibly scrolls.
const PREVIEW_HEIGHT = 'max-h-[118px]';

const BoxIdeaList = ({
  ideas,
  phase,
  color,
  boxPath,
  categories,
  votes,
  className,
  'data-testid': dataTestId,
}: BoxIdeaListProps) => {
  const { t } = useTranslation();

  if (ideas.length === 0) return null;

  const band = `bg-${color}-light text-foreground`;

  return (
    <ul
      className={twMerge('flex flex-col gap-0.5 overflow-y-auto', PREVIEW_HEIGHT, className)}
      data-testid={dataTestId}
    >
      {ideas.map((idea) => {
        const status = getPhaseStatus({ idea, phase, vote: votes?.[idea.hash_id] });
        const category = categories?.[idea.hash_id];

        const rowColors = status?.colors ?? band;

        return (
          <li key={idea.hash_id} className="flex items-stretch gap-0.5">
            <span
              className={twMerge(
                'flex shrink-0 items-center px-2 text-xs font-semibold uppercase',
                category ? band : rowColors
              )}
            >
              {category ? category.label : <Icon type={color} size="1.1rem" aria-hidden="true" />}
            </span>
            <Link
              to={`${boxPath}/idea/${idea.hash_id}`}
              className={twMerge(
                'flex min-w-0 flex-1 items-center rounded-none px-3 py-1.5 text-sm no-underline',
                rowColors
              )}
            >
              <span className="truncate">{idea.title}</span>
            </Link>
            {status && <PhaseStatus status={status} iconOnly className="shrink-0 rounded-none px-2 text-lg" />}
            {!status && phase === DISCUSSION_PHASE && (
              <span className={twMerge('flex shrink-0 items-center gap-1 px-2 text-xs font-medium', rowColors)}>
                <Icon type="heart" size="1rem" aria-hidden="true" />
                <span aria-hidden="true">{idea.sum_likes}</span>
                <span className="sr-only">
                  {t(idea.sum_likes === 1 ? 'v2.scopes.ideas.stats.like' : 'v2.scopes.ideas.stats.likes', {
                    count: idea.sum_likes,
                  })}
                </span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default BoxIdeaList;
