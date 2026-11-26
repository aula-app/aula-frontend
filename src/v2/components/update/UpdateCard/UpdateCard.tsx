import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import Link from '@/v2/components/navigation/Link';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { countVotes, IdeaUpdate, VoteTally } from '../groupUpdates';
import { VARIANT_ICONS } from './updateVariant';

interface UpdateCardProps {
  update: IdeaUpdate;
}

const VOTE_KEYS: (keyof VoteTally)[] = ['for', 'against', 'neutral'];

const getIdeaPath = ({ room_id, phase_id, topic_id, idea_id }: IdeaUpdate) =>
  `/room/${room_id}/phase/${phase_id ?? 0}${topic_id ? `/idea-box/${topic_id}` : ''}/idea/${idea_id}`;

const Activity = ({ icon, label }: { icon: ICON_TYPE; label: string }) => (
  <span className="flex items-center gap-1">
    <Icon type={icon} size="1rem" className="shrink-0" />
    {label}
  </span>
);

const UpdateCard = ({ update }: UpdateCardProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const phase = phases[`${update.phase_id ?? 0}` as `${RoomPhases}`] ?? 'wild';
  const votes = countVotes(update);
  const voteBreakdown = VOTE_KEYS.filter((key) => update.votes[key] > 0)
    .map((key) => t(`v2.scopes.updates.activity.${key}`, { count: update.votes[key] }))
    .join(', ');

  return (
    <article
      aria-labelledby={titleId}
      data-testid={`update-${update.idea_id}`}
      className="flex items-stretch gap-1 min-h-16 rounded-2xl"
    >
      <div
        className={twMerge(
          'flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-l-2xl px-2 py-2',
          `bg-${phase}`
        )}
      >
        <Icon type={phase} size="2rem" />
        <span className="text-center text-xs font-medium leading-tight">{t(`phases.${phase}`)}</span>
      </div>
      <Link
        to={getIdeaPath(update)}
        className={twMerge(
          'flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2 pr-6 rounded-none rounded-r-2xl',
          'hover:no-underline transition-colors duration-150',
          `bg-${phase} hover:bg-${phase}-active`
        )}
      >
        <h2 id={titleId} className="truncate text-lg font-semibold">
          {update.title}
        </h2>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {update.comments > 0 && (
            <Activity
              icon={VARIANT_ICONS.comments}
              label={t('v2.scopes.updates.activity.comments', { count: update.comments })}
            />
          )}
          {votes > 0 && (
            <Activity
              icon={VARIANT_ICONS.votes}
              label={`${t('v2.scopes.updates.activity.votes', { count: votes })} (${voteBreakdown})`}
            />
          )}
        </p>
      </Link>
    </article>
  );
};

export default UpdateCard;
