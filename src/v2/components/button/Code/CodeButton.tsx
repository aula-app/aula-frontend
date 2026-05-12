import Icon from '@/components/new/Icon';
import { getRuntimeConfig } from '@/config';
import { useCodeManagement } from '@/hooks/instance';
import Chip from '@/v2/components/button/Chip';
import { useTranslation } from 'react-i18next';

const CodeButton = () => {
  const { t } = useTranslation();
  const { code, resetCode } = useCodeManagement();

  if (!getRuntimeConfig().IS_MULTI) return null;

  if (!code) {
    return (
      <Chip role="status" aria-label={t('auth.login.reset_code')}>
        {t('auth.login.reset_code')}
      </Chip>
    );
  }

  return (
    <Chip
      data-testid="current-instance-code"
      aria-label={t('auth.login.instanceCode', { var: code })}
      endIcon={<Icon type="close" size="1em" />}
      onClick={resetCode}
    >
      {`${t('instance.chip')}: ${code}`}
    </Chip>
  );
};

CodeButton.displayName = 'CodeButton';

export default CodeButton;
