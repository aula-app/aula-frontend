import { AppButton, AppIcon } from '@/components';
import ChangePassword from '@/components/ChangePassword';
import ImageEditor from '@/components/ImageEditor';
import { useAppStore } from '@/store';
import { SingleUserResponseType } from '@/types/RequestTypes';
import { UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import Categories from './Categories';

/** * Renders "Config" view
 * url: /settings/config
 */
const ConfigView = () => {
  const { t } = useTranslation();

  // Missing endpoint for categories

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">{t('views.config')}</Typography>
      <Typography variant="h6">{t('settings.categories')}</Typography>
      <Categories />
    </Stack>
  );
};

export default ConfigView;
