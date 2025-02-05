import AppIcon from '@/components/AppIcon';
import { getGroups } from '@/services/groups';
import { getUserGroups } from '@/services/users';
import { GroupType } from '@/types/Scopes';
import {
  Button,
  ButtonProps,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  items?: string[];
  onSubmit: () => void;
}

const AddGroupButton: React.FC<Props> = ({ disabled = false, items = [], onSubmit, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const fetchGroups = useCallback(async () => {
    const response = await getGroups();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setGroups(response.data);
  }, []);

  const fetchUserGroup = useCallback(async (id: string) => {
    const response = await getUserGroups(id);
    if (!response.error && response.data)
      console.log(`user: ${id} => group: ${response.data.map((group) => group.room_id)}`);
  }, []);

  const getOwnGroups = () => {
    items.forEach((item) => {
      fetchUserGroup(item);
    });
  };

  const toggleGroup = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((group) => group !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };

  const onClose = () => {
    setOpen(false);
    setSelectedGroups([]);
  };

  useEffect(() => {
    fetchGroups();
    if (items.length > 0) {
      getOwnGroups();
    }
  }, [items]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} {...restOfProps}>
        <AppIcon icon="group" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.groups.name'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {t('actions.addToParent', {
            var: t('scopes.groups.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ pt: 0 }}>
          {groups.map((group) => (
            <ListItem disablePadding key={group.hash_id}>
              <ListItemButton onClick={() => toggleGroup(group.hash_id)}>
                <ListItemAvatar>
                  <Checkbox checked={selectedGroups.includes(group.hash_id)} />
                </ListItemAvatar>
                <ListItemText primary={group.group_name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained">{t('actions.confirm')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddGroupButton;
