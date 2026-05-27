import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';

const PrintButton = () => {
  const { t } = useTranslation();

  return (
    <IconButton aria-label={t('v2.ui.actions.print')} hint={t('v2.ui.actions.print')} onClick={() => window.print()}>
      <Icon type="print" />
    </IconButton>
  );
};

PrintButton.displayName = 'PrintButton';

export default PrintButton;
