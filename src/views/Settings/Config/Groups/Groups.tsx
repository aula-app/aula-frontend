import { AppIcon } from '@/components';
import GroupForms from '@/components/DataForms/GroupForms';
import { deleteGroup, getGroups } from '@/services/groups';
import { GroupType } from '@/types/Scopes';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const View: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [edit, setEdit] = useState<GroupType | boolean>(false);
  const [del, setDel] = useState<GroupType>();

  const groupsFetch = async () => {
    const response = await getGroups();
    setGroups(response.data ? response.data : []);
  };

  const onDel = async () => {
    if (!del) return;
    const request = await deleteGroup(del.id);
    if (request.error) return;
    onClose();
  };

  const onClose = () => {
    setEdit(false);
    setDel(undefined);
    groupsFetch();
  };

  useEffect(() => {
    groupsFetch();
  }, []);

  return (
    <Stack gap={2}>
      {/* <Typography variant="h6">{t('scopes.groups.plural')}</Typography> */}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('actions.add', { var: t('scopes.groups.name').toLowerCase() })}
          avatar={<AppIcon icon="add" />}
          onClick={() => setEdit(true)}
        />
        {groups.map((group, key) => {
          return (
            <Chip key={key} label={group.group_name} onClick={() => setEdit(group)} onDelete={() => setDel(group)} />
          );
        })}
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <GroupForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
      <Dialog
        open={!!del}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" /> {t('deletion.headline', { var: t(`scopes.groups.name`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('deletion.confirm', { var: t(`scopes.groups.name`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDel(undefined)} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onDel} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default View;
