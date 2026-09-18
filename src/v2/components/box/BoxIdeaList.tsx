import { IdeaType } from '@/types/Scopes';
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
  /** Palette the rows are drawn in — the box's own phase color. */
  color: PhaseType;
  /** Path of the box these ideas sit in; each row links to the idea beneath it. */
  boxPath: string;
  /** Category per idea, keyed by idea hash_id. Rows without one omit the chip. */
  categories?: Record<string, Category>;
  /** Percentage of users needed, for the result phase's status. */
  quorum?: number;
  /** Room members, the quorum denominator. */
  users?: number;
  className?: string;
  'data-testid'?: string;
}

const DISCUSSION_PHASE = '10';
const VOTING_PHASE = '30';

// Three 32px rows and their 2px gaps, plus half a row, so a fourth idea is cut
// in half and gives the list a visible edge to scroll.
const PREVIEW_HEIGHT = 'max-h-[118px]';

/** What a box holds, as full-width rows: category, title and status. */
const BoxIdeaList = ({
  ideas,
  phase,
  color,
  boxPath,
  categories,
  quorum,
  users,
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
        // A voting status is about the viewer's own vote, which this list does not have.
        const status = phase === VOTING_PHASE ? null : getPhaseStatus({ idea, phase, quorum, users });
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
            {status && <PhaseStatus status={status} iconOnly className="shrink-0 rounded-none px-2" />}
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
