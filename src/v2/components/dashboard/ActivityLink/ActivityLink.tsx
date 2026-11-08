import IconButton from '@/v2/components/button/IconButton';
import Badge from '@/v2/components/ui/Badge';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';

interface ActivityLinkProps {
  to: string;
  icon: ICON_TYPE;
  label: string;
  /** New items, shown as a badge. Omitted while it loads. */
  count?: number;
  badgeClass?: string;
}

const ActivityLink = ({ to, icon, label, count, badgeClass }: ActivityLinkProps) => {
  const { t } = useTranslation();

  return (
    <span className="relative inline-flex">
      <IconButton to={to} hint={label} aria-label={count ? t('v2.ui.dashboard.newCount', { label, count }) : label}>
        <Icon type={icon} size="1.5em" />
      </IconButton>
      <Badge count={count} className={badgeClass} />
    </span>
  );
};

export default ActivityLink;
