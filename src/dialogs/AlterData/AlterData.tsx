import { useAppStore } from '@/store';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { Avatar, Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AppIcon from '../../components/AppIcon';
import { SettingsConfig, databaseRequest, localStorageGet, parseJwt } from '@/utils';
import DataFields from './DataFields';

/**
 * Renders "AlterData" component
 * url: /
 */
const AlterData = () => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [state, dispatch] = useAppStore();
  const [items, setItems] = useState<SingleResponseType>();

  const dataFetch = async () => {
    if (!state.editData) return;
    await databaseRequest('model', {
      model: SettingsConfig[state.editData.element].model,
      method: SettingsConfig[state.editData.element].requests.get,
      arguments: {
        [SettingsConfig[state.editData.element].requests.id]: state.editData.id,
      },
    }).then((response: SingleResponseType) => setItems(response));
  };

  const handleSubmit = async (formData: Object) => {
    if(!state.editData) return;
    const config = SettingsConfig[state.editData.element]
    const otherData = {updater_id: jwt_payload.user_id} as ObjectPropByName;
    if(state.editData.type === 'edit') otherData[config.requests.id] = state.editData.id;
    if(state.editData.element === 'ideas') otherData.user_id = jwt_payload.user_id;

    await databaseRequest('model', {
      model: config.model,
      method: state.editData.type === 'edit' ? config.requests.edit : config.requests.add,
      arguments: {
        ...formData,
        ...otherData
      }
    }).then((response) => {
      if (!response.success) return;
      if(state.editData?.onClose) state.editData.onClose();
      handleClose();
    });
  };

  const handleClose = () => {
    dispatch({ type: 'EDIT_DATA', payload: null });
  };

  useEffect(() => {
    dataFetch();
  }, [state.editData]);

  return (
    <Drawer anchor="bottom" open={state.editData !== null} onClose={handleClose} sx={{ overflowY: 'auto' }}>
      {items && state.editData && (
        <Stack p={2}>
          <Stack direction="row" justifyContent="space-between">
            {state.editData.element === 'users' && (
              <Avatar>
                <AppIcon name="avatar" />
              </Avatar>
            )}
            <Typography variant="h4" pb={2}>
              {state.editData.type === 'edit'
                ? 'Edit'
              : state.editData.type === 'add'
                ? 'New'
              : 'Report'}{' '}
              {state.editData.type === 'bug'
                ? state.editData.type
                : SettingsConfig[state.editData.element].item.toLowerCase()
              }
            </Typography>
          </Stack>
          <DataFields info={state.editData} items={items} onClose={handleClose} onSubmit={handleSubmit} />
        </Stack>
      )}
    </Drawer>
  );
};

export default AlterData;
