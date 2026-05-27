import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';

const BugButton = () => {
  const { t } = useTranslation();

  return (
    <IconButton aria-label={t('v2.ui.actions.report')} hint={t('v2.ui.actions.report')}>
      <Icon type="bug" />
    </IconButton>
  );
};

BugButton.displayName = 'BugButton';

export default BugButton;
