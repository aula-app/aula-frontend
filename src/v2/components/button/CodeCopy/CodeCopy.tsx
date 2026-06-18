import { getRuntimeConfig } from '@/config';
import { localStorageGet } from '@/utils';
import { useToast } from '@/v2/hooks';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../ui/Icon';
import Button from '../Button';
import Tooltip from '../../ui/Tooltip';

const CodeCopy: FC<Omit<React.ComponentProps<typeof Button>, 'outlined' | 'text'>> = (restOfProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const code = localStorageGet('code');

  if (!getRuntimeConfig().IS_MULTI || !code) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(t('v2.ui.code.success')))
      .catch(() => toast.error(t('v2.ui.code.error')));
  };

  return (
    <Tooltip content={t('v2.ui.code.copy')}>
      <Button text id="instance-code" type="button" onClick={handleCopy} {...restOfProps}>
        {`${t('v2.ui.code.button', { var: code })}`}
        <Icon type="copy" />
      </Button>
    </Tooltip>
  );
};

CodeCopy.displayName = 'CodeCopy';

export default CodeCopy;
