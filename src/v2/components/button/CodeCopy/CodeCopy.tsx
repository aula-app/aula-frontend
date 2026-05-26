import { getRuntimeConfig } from '@/config';
import { useAppStore } from '@/store';
import { announceToScreenReader, localStorageGet } from '@/utils';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../ui/Icon';
import Button from '../Button';
import Tooltip from '../../ui/Tooltip';

const CodeCopy: FC = (restOfProps) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const code = localStorageGet('code');

  if (!getRuntimeConfig().IS_MULTI || !code) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        dispatch({ type: 'ADD_POPUP', message: { message: t('v2.ui.code.success'), type: 'success' } });
        announceToScreenReader(t('v2.ui.code.success'), 'polite');
      })
      .catch(() => {
        dispatch({ type: 'ADD_POPUP', message: { message: t('v2.ui.code.error'), type: 'error' } });
        announceToScreenReader(t('v2.ui.code.error'), 'assertive');
      });
  };

  return (
    <Tooltip content={t('v2.ui.code.copy')}>
      <Button
        text
        id="instance-code"
        type="button"
        onClick={handleCopy}
        className="text-text-secondary"
        aria-label={t('v2.ui.code.copy', { var: code })}
        {...restOfProps}
      >
        {`${t('v2.ui.code.button', { var: code })}`}
        <Icon type="copy" />
      </Button>
    </Tooltip>
  );
};

CodeCopy.displayName = 'CodeCopy';

export default CodeCopy;
