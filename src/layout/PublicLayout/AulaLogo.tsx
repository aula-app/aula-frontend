import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { getRuntimeConfig } from '../../config';

const AulaLogo: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <img
        src={`${getRuntimeConfig().BASENAME}img/Aula_Logo.svg`}
        alt={t('app.name.logo')}
        role="img"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
};

export default AulaLogo;
