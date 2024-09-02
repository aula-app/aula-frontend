import { AppIcon, AppIconButton } from '@/components';
import { DatabaseResponseData, DatabaseResponseType } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, dataSettings, scopeDefinitions } from '@/utils';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { updateType } from '../EditData/EditData';

interface Props {
  id?: number;
  scope: SettingNamesType;
  targetId?: number;
  onClose?: () => void;
  addUpdate?: (newUpdate: updateType[]) => void;
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const MoveData = ({ id, scope, targetId, onClose = () => {}, addUpdate }: Props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [availableItems, setAvailableItems] = useState<DatabaseResponseData[]>();
  const [selectedItems, setSelectedItems] = useState<DatabaseResponseData[]>();
  const [displayItems, setDisplayItems] = useState<DatabaseResponseData[]>();
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState('');
  const [isOpen, setOpen] = useState(false);

  const getAvailableItems = async () => {
    if (!scopeDefinitions[scope].move) return;
    const moreArgs = params[scopeDefinitions[scope].move.targetId]
      ? { [scopeDefinitions[scope].move.targetId]: targetId }
      : {};
    await databaseRequest({
      model: scopeDefinitions[scopeDefinitions[scope].move.target].model,
      method: scopeDefinitions[scopeDefinitions[scope].move.target].fetch,
      arguments: {
        offset: 0,
        limit: 0,
        orderby: dataSettings[scopeDefinitions[scope].move.target][0].orderId,
        asc: 1,
        extra_where: ` AND (${dataSettings[scopeDefinitions[scope].move.target][0].name} LIKE '%${filter}%' OR ${dataSettings[scopeDefinitions[scope].move.target][1].name} LIKE '%${filter}%')`,
        ...moreArgs,
      },
    }).then((response: DatabaseResponseType) => {
      response.data ? setAvailableItems(response.data) : setAvailableItems([]);
    });
  };

  const getCurrentItems = async () => {
    if (!id || !scopeDefinitions[scope].move) {
      setSelectedItems([]);
      return;
    }

    og({ [scopeDefinitions[scope].id]: id });

    await databaseRequest({
      model: scopeDefinitions[scopeDefinitions[scope].move.target].model,
      method: scopeDefinitions[scope].move.get,
      arguments: { [scopeDefinitions[scope].id]: id },
    }).then((response: DatabaseResponseType) => {
      response.data ? setSelectedItems(response.data) : setSelectedItems([]);
      response.data ? setSelected(response.data.map((item) => item.id)) : setSelected([]);
    });
  };

  const normalizeData = () => {
    if (!availableItems || !selectedItems) return;
    setDisplayItems([...new Map([...availableItems, ...selectedItems].map((c) => [c.id, c])).values()]);
  };

  const select = async (itemId: number) => {
    setSelected([...selected, itemId]);
  };

  const remove = async (itemId: number) => {
    setSelected(selected.filter((id) => id !== itemId));
  };

  const requestAdd = async (targetId: number) => {
    if (!id || !scopeDefinitions[scope].move) return;
    await databaseRequest(
      {
        model: scopeDefinitions[scope].move.model,
        method: scopeDefinitions[scope].move.add,
        arguments: {
          [scopeDefinitions[scope].id]: id,
          [scopeDefinitions[scope].move.targetId]: targetId,
        },
      },
      ['updater_id']
    );
  };

  const requestRemove = async (targetId: number) => {
    if (!id || !scopeDefinitions[scope].move) return;
    await databaseRequest({
      model: scopeDefinitions[scope].move.model,
      method: scopeDefinitions[scope].move.remove,
      arguments: {
        [scopeDefinitions[scope].id]: id,
        [scopeDefinitions[scope].move.targetId]: targetId,
      },
    });
  };

  const requestUpdates = () => {
    if (!selectedItems) return;
    const originalSelection = selectedItems.map((item) => item.id);
    const toAdd = selected.filter((x) => !originalSelection.includes(x));
    const toRemove = originalSelection.filter((x) => !selected.includes(x));
    if (id) {
      toAdd.forEach((targetId) => requestAdd(targetId));
      toRemove.forEach((targetId) => requestRemove(targetId));
    } else if (addUpdate) {
      if (!scopeDefinitions[scope].move) return;
      const moveSettings = scopeDefinitions[scope].move;
      addUpdate(
        selected.map((targetId) => {
          return {
            model: moveSettings.model,
            method: moveSettings.add,
            args: { [scopeDefinitions[scope].id]: id, [moveSettings.targetId]: targetId },
            requestId: moveSettings.target,
          };
        })
      );
    }
    close();
  };

  const toggleSelect = (item: number) => {
    selected.includes(item) ? remove(item) : select(item);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const onSubmit = () => {
    requestUpdates();
  };

  const close = () => {
    onClose();
    setOpen(false);
  };

  useEffect(() => {
    getAvailableItems();
    getCurrentItems();
  }, [filter, isOpen]);

  useEffect(() => {
    if (availableItems && selectedItems) normalizeData();
  }, [availableItems, selectedItems]);

  return (
    <>
      {scopeDefinitions[scope].move && (
        <>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            startIcon={<AppIcon icon="edit" />}
            sx={{ borderRadius: 30, mb: 2 }}
            onClick={() => setOpen(true)}
          >
            {t('texts.select', { var: t(`views.${scopeDefinitions[scope].move.target}`) })}
          </Button>
          <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xs">
            <DialogTitle>{t('texts.select', { var: t(`views.${scopeDefinitions[scope].move.target}`) })}</DialogTitle>
            <DialogContent>
              <Stack height={350} position="relative" overflow="hidden">
                <Stack position="absolute" height="100%" width="100%">
                  <FilledInput
                    size="small"
                    onChange={changeSearch}
                    value={filter}
                    fullWidth
                    startAdornment={<AppIcon icon="search" size="small" sx={{ mr: 1 }} />}
                    endAdornment={<AppIconButton icon="close" size="small" onClick={() => setFilter('')} />}
                  />
                  <Stack my={1} sx={{ overflowY: 'auto' }}>
                    {displayItems &&
                      displayItems.map((item) => (
                        <Stack
                          component={Button}
                          direction="row"
                          mt={1}
                          key={item.id}
                          borderRadius={30}
                          bgcolor={selected.includes(item.id) ? grey[200] : 'transparent'}
                          sx={{
                            textTransform: 'none',
                            textAlign: 'left',
                            justifyContent: 'start',
                            color: 'inherit',
                            overflow: 'clip',
                          }}
                          fullWidth
                          onClick={() => toggleSelect(item.id)}
                        >
                          <Checkbox checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                          <Stack pl={2} flex={1}>
                            <Typography noWrap>
                              {scopeDefinitions[scope].move &&
                                item[dataSettings[scopeDefinitions[scope].move.target][0].name]}
                            </Typography>
                            <Typography noWrap color="secondary" fontSize="small">
                              {scopeDefinitions[scope].move &&
                                item[dataSettings[scopeDefinitions[scope].move.target][1].name]}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                  </Stack>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
              <Button color="error" onClick={close}>
                {t('generics.close')}
              </Button>
              <Button type="submit" variant="contained" onClick={onSubmit}>
                {t('generics.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default MoveData;
