import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { IdeaType } from '@/types/Scopes';
import Stat from '@/v2/components/idea/Stat';
import { useIdeaLike } from './useIdeaLike';

type LikeStatProps = Omit<ComponentProps<typeof Stat>, 'icon' | 'count' | 'label' | 'active' | 'onClick'> & {
  idea: IdeaType;
};

/**
 * Like metric for an idea: a Stat wired to the like API. Clicking it toggles the
 * like, optimistically updating the count and swapping to the filled heart.
 */
const LikeStat = ({ idea, ...props }: LikeStatProps) => {
  const { t } = useTranslation();
  const { liked, count, toggle, pending } = useIdeaLike(idea);

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
