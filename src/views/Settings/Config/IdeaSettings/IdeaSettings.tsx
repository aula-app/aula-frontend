import { AppButton, AppIconButton } from '@/components';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { CustomFieldsNameType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import CustomFields from './CustomFIelds';
import QuorumSettings from './QuorumSettings';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "IdeaSettings" component
 */

const IdeaSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack gap={2}>
      <QuorumSettings onReload={onReload} />
      <CustomFields onReload={onReload} />
    </Stack>
  );
};

export default IdeaSettings;
