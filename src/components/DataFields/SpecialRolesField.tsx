import AppIcon from '@/components/AppIcon';
import { getRooms } from '@/services/rooms';
import { RoomType } from '@/types/Scopes';
import { UpdtesObject } from '@/types/SettingsTypes';
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
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectRole from '../SelectRole';

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddRoomRefProps {
  setNewIdeaRooms: (id: string) => void;
}

const SpecialRolesField: React.FC<ButtonProps> = ({ disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [indeterminateRooms, setIndeterminateRooms] = useState<string[]>([]);
  const [updates, setUpdates] = useState<UpdtesObject>({ add: [], remove: [] });

  const fetchRooms = async () => {
    setLoading(true);
    const response = await getRooms();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.data) return;
    setRooms(response.data);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} disabled={disabled} {...restOfProps}>
        <AppIcon icon="key" pr={2} />
        {t('actions.set', {
          var: t('roles.roomRoles'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('actions.set', {
            var: t('roles.roomRoles'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {rooms.map((room) => (
            <ListItemButton key={room.hash_id} sx={{ py: 0 }}>
              <ListItem secondaryAction={<SelectRole userRole={20} setRole={() => {}} size="small" />}>
                <ListItemText primary={room.room_name} />
              </ListItem>
            </ListItemButton>
          ))}
        </List>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={() => {}} variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpecialRolesField;
