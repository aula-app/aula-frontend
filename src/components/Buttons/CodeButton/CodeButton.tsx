import AppIcon from '@/components/AppIcon';
import { getRuntimeConfig } from '@/config';
import { useAppStore } from '@/store';
import { announceToScreenReader, localStorageGet } from '@/utils';
import { Button, ButtonProps, Divider } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const CodeButton: FC<ButtonProps> = ({ ...restOfProps }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const code = localStorageGet('code');

  return (
    getRuntimeConfig().IS_MULTI &&
    code && (
      <>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() =>
              dispatch({
                type: 'ADD_POPUP',
                message: { message: t('ui.accessibility.codeCopied'), type: 'success' },
              })
            );
            announceToScreenReader(t('ui.accessibility.codeCopied'), 'polite');
          }}
          color="secondary"
          className="app-code"
          aria-label={t('ui.accessibility.copyInstanceCode', { code })}
          {...restOfProps}
        >
          {`${t('instance.chip')}: ${code}`}
          <AppIcon icon="copy" size="small" sx={{ ml: 1 }} />
        </Button>
        <div className="border-t border-theme-grey mx-3" />
      </>
    )
  );
};

CodeButton.displayName = 'CodeButton';

export default CodeButton;
