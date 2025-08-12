import { AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { Box, Chip, Stack } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getRuntimeConfig } from '@/config';
import { useCodeManagement } from '@/hooks/instance';

const PublicLayoutHeader: FunctionComponent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { code, resetCode } = useCodeManagement();

  const renderBackToSignIn = () => {
    if (location.pathname !== '/') {
      return (
        <AppLink color="primary" to="/">
          &lt; {t('auth.login.button')}
        </AppLink>
      );
    }
    return null;
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
      <Box flex={1}>{renderBackToSignIn()}</Box>
      {getRuntimeConfig().IS_MULTI && (
        <Stack direction="row" flex={1} justifyContent="center">
          {code ? (
            <Chip
              label={code}
              onClick={resetCode}
              onDelete={resetCode}
              aria-label={t('auth.login.instanceCode', { var: code })}
            />
          ) : (
            <Chip label={t('auth.login.reset_code')} role="status" aria-label={t('auth.login.reset_code')} />
          )}
        </Stack>
      )}
      <Stack direction="row" flex={1} justifyContent="end">
        <LocaleSwitch />
      </Stack>
    </Stack>
  );
};

export default PublicLayoutHeader;
