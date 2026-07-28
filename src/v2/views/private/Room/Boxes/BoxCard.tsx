import { BoxType } from '@/types/Scopes';
import { phases } from '@/utils';
import Icon from '@/v2/components/ui/Icon/Icon';
import Markdown from '@/v2/components/ui/Markdown';
import Link from '@/v2/components/navigation/Link';
import { useTranslation } from 'react-i18next';

interface BoxCardProps {
  box: BoxType;
}

const BoxCard = ({ box }: BoxCardProps) => {
  const { t } = useTranslation();
  const phaseColor = phases[box.phase_id] ?? 'wild';
  const to = `/room/${box.room_hash_id}/phase/${box.phase_id}/idea-box/${box.hash_id}`;

  return (
    <Link
      to={to}
      data-testid={`box-${box.name}`}
      className="flex flex-col gap-2 p-4 rounded-2xl border border-muted no-underline text-foreground"
    >
      <div className="flex items-center gap-2">
        <span className={`flex items-center justify-center size-8 rounded-full bg-${phaseColor}`}>
          <Icon type={phaseColor} size="1.25rem" aria-hidden="true" />
        </span>
        <h3 className="font-semibold flex-1 truncate">{box.name}</h3>
        <span className="flex items-center gap-1 text-sm text-muted">
          <Icon type="idea" size="1rem" aria-hidden="true" />
          {box.ideas_num}
        </span>
      </div>

      {box.description_public && (
        <Markdown className="prose-sm text-muted line-clamp-3">{box.description_public}</Markdown>
      )}

      <span className="text-xs text-muted">{t(`phases.${phaseColor}`)}</span>
    </Link>
  );
};

export default BoxCard;
