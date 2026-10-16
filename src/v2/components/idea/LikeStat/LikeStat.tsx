import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import Stat from '@/v2/components/idea/Stat';
import { LikeState } from '@/v2/hooks/useLike';

type LikeStatProps = Omit<ComponentProps<typeof Stat>, 'icon' | 'count' | 'label' | 'active' | 'onClick'> & {
  /** Like state from `useIdeaLike` / `useCommentLike`, owned by the caller so the count can drive other readouts too. */
  like: LikeState;
};

/**
 * Like metric for an idea: a Stat wired to the like API. Clicking it toggles the
 * like, optimistically updating the count and swapping to the filled heart.
 */
const LikeStat = ({ like, ...props }: LikeStatProps) => {
  const { t } = useTranslation();
  const { liked, count, toggle, pending } = like;

  return (
    <Stat
      icon={liked ? 'heartFull' : 'heart'}
      count={count}
      active={liked}
      onClick={toggle}
      disabled={pending}
      aria-label={t(`tooltips.${liked ? 'heartFull' : 'heart'}`)}
      label={t(count === 1 ? 'v2.scopes.ideas.stats.like' : 'v2.scopes.ideas.stats.likes', { count })}
      {...props}
    />
  );
};

export default LikeStat;
