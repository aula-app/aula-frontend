import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';

const PrintButton = () => {
  const { t } = useTranslation();

  return (
    <IconButton data-testid={TEST_IDS.PRINT_BUTTON} aria-label={t('v2.ui.actions.print')} hint={t('v2.ui.actions.print')} onClick={() => window.print()}>
      <Icon type="print" />
    </IconButton>
  );
};

PrintButton.displayName = 'PrintButton';

export default PrintButton;
