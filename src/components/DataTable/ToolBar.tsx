import AppIcon from '@/components/AppIcon';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

type Props = {
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  scope: SettingNamesType;
  selected: Array<string>;
  setEdit: (value: boolean) => void;
  setDelete: (ideas: Array<string>) => void;
};

const ToolBar: React.FC<Props> = ({ extraTools, scope, selected, setEdit, setDelete }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isOpen, setOpen] = useState(false);

  const onDelete = () => {
    setDelete(selected);
    setOpen(false);
  };

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
      <Stack direction="row" gap={1} alignItems="center" width="100%" flexWrap="wrap">
        {scope !== 'ideas' && (
          <Button variant="outlined" onClick={() => setEdit(true)}>
            <AppIcon icon="add" pr={2} />
            {t('actions.add', { var: t(`scopes.${scope}.name`) })}
          </Button>
        )}
        {extraTools && extraTools({ items: selected })}
        {checkPermissions(scope, 'delete') && (
          <Button variant="outlined" color="error" onClick={() => setOpen(true)} disabled={selected.length === 0}>
            <AppIcon icon="delete" pr={2} />
            {t('actions.remove', {
              var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`),
            })}
          </Button>
        )}
      </Stack>
      <Dialog
        open={isOpen}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" />{' '}
            {t('deletion.headline', { var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('deletion.confirm', { var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button color="error" variant="contained" onClick={onDelete}>
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ToolBar;
