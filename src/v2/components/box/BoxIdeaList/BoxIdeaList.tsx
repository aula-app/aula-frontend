import { IdeaType } from '@/types/Scopes';
import { Vote } from '@/utils';
import { PhaseType, RoomPhases } from '@/types/SettingsTypes';
import { Category } from '@/v2/components/idea/CategoryList';
import { getPhaseStatus } from '@/v2/components/idea/PhaseStatus';
import Link from '@/v2/components/navigation/Link';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface BoxIdeaListProps {
  ideas: IdeaType[];
  phase: `${RoomPhases}`;
  /** Palette the rows are drawn in — the box's own phase color. */
  color: PhaseType;
  /** Path of the box these ideas sit in; each row links to the idea beneath it. */
  boxPath: string;
  /** Category per idea, keyed by idea hash_id. Rows without one omit the chip. */
  categories?: Record<string, Category>;
  /** The viewer's own vote per idea, keyed by idea hash_id. Without one a row reads as not yet voted. */
  votes?: Record<string, Vote | null>;
  className?: string;
  'data-testid'?: string;
}

const DISCUSSION_PHASE = '10';

// Three rows and their gaps, plus half a row, so a fourth idea is cut in half
// and gives the list a visible edge to scroll.
const PREVIEW_HEIGHT = 'max-h-[135px]';

/** One trailing readout on a row: an icon, an optional count, and the text behind both. */
const Metric = ({ icon, count, label }: { icon: ICON_TYPE; count?: number; label: string }) => (
  <span className="flex items-center gap-1">
    <Icon type={icon} size="1rem" aria-hidden="true" />
    {count !== undefined && <span aria-hidden="true">{count}</span>}
    <span className="sr-only">{label}</span>
  </span>
);

/** What a box holds, as full-width rows: category, title and status. */
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
    <ul className={twMerge('flex flex-col gap-1 overflow-y-auto', PREVIEW_HEIGHT, className)} data-testid={dataTestId}>
      {ideas.map((idea) => {
        const status = getPhaseStatus({ idea, phase, vote: votes?.[idea.hash_id] });
        const category = categories?.[idea.hash_id];

        const rowColors = status?.colors ?? band;

        const trailer = status ? (
          <Metric icon={status.icon} label={t(status.label)} />
        ) : phase === DISCUSSION_PHASE ? (
          <>
            <Metric
              icon="discussion"
              count={idea.sum_comments}
              label={t(idea.sum_comments === 1 ? 'v2.scopes.ideas.stats.comment' : 'v2.scopes.ideas.stats.comments', {
                count: idea.sum_comments,
              })}
            />
            <Metric
              icon="heart"
              count={idea.sum_likes}
              label={t(idea.sum_likes === 1 ? 'v2.scopes.ideas.stats.like' : 'v2.scopes.ideas.stats.likes', {
                count: idea.sum_likes,
              })}
            />
          </>
        ) : null;

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
              className={twMerge('flex min-w-0 flex-1 items-center rounded-none px-3 py-1.5 no-underline', rowColors)}
            >
              <span className="flex-1 truncate">{idea.title}</span>
              {trailer && <span className="flex shrink-0 items-center gap-2 text-xs font-medium">{trailer}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default BoxIdeaList;
