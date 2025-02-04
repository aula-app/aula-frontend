import AppIcon from '@/components/AppIcon';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { Button, Stack, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

type Props = {
  scope: SettingNamesType;
  selected: Array<string>;
  setEdit: Dispatch<SetStateAction<number | boolean>>;
};

const ToolBar: React.FC<Props> = ({ scope, selected, setEdit }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      mt={1}
      p={2}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRight: 0,
        borderLeft: 0,
      }}
    >
      <Button variant="outlined" onClick={() => setEdit(true)}>
        <AppIcon icon="add" pr={2} />
        {t('actions.add', { var: t(`scopes.${scope}.name`).toLowerCase() })}
      </Button>
    </Stack>
  );
};

export default ToolBar;
