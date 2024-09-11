import { AppIcon, AppIconButton } from '@/components';
import { DatabaseResponseData, DatabaseResponseType } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import DataConfig from '@/utils/Data';
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
    if (!DataConfig[scope].requests.move) return;
    const moreArgs = params[DataConfig[scope].requests.move.targetId]
      ? { [DataConfig[scope].requests.move.targetId]: targetId }
      : {};
    await databaseRequest({
      model: DataConfig[DataConfig[scope].requests.move.target].requests.model,
      method: DataConfig[DataConfig[scope].requests.move.target].requests.fetch,
      arguments: {
        offset: 0,
        limit: 0,
        orderby: DataConfig[DataConfig[scope].requests.move.target].columns[0].orderId,
        asc: 1,
        extra_where: ` AND (${DataConfig[DataConfig[scope].requests.move.target].columns[0].name} LIKE '%${filter}%' OR ${DataConfig[DataConfig[scope].requests.move.target].columns[1].name} LIKE '%${filter}%')`,
        ...moreArgs,
      },
    }).then((response: DatabaseResponseType) => {
      response.data ? setAvailableItems(response.data) : setAvailableItems([]);
    });
  };

  const getCurrentItems = async () => {
    if (!id || !DataConfig[scope].requests.move) {
      setSelectedItems([]);
      return;
    }

    await databaseRequest({
      model: DataConfig[DataConfig[scope].requests.move.target].requests.model,
      method: DataConfig[scope].requests.move.get,
      arguments: { [DataConfig[scope].requests.id]: id },
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
    if (!id || !DataConfig[scope].requests.move) return;
    await databaseRequest(
      {
        model: DataConfig[scope].requests.move.model,
        method: DataConfig[scope].requests.move.add,
        arguments: {
          [DataConfig[scope].requests.id]: id,
          [DataConfig[scope].requests.move.targetId]: targetId,
        },
      },
      ['updater_id']
    ).then(() => onClose());
  };

  const requestRemove = async (targetId: number) => {
    if (!id || !DataConfig[scope].requests.move) return;
    await databaseRequest({
      model: DataConfig[scope].requests.move.model,
      method: DataConfig[scope].requests.move.remove,
      arguments: {
        [DataConfig[scope].requests.id]: id,
        [DataConfig[scope].requests.move.targetId]: targetId,
      },
    }).then(() => onClose());
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
      if (!DataConfig[scope].requests.move) return;
      const moveSettings = DataConfig[scope].requests.move;
      addUpdate(
        selected.map((targetId) => {
          return {
            model: moveSettings.model,
            method: moveSettings.add,
            args: { [DataConfig[scope].requests.id]: id, [moveSettings.targetId]: targetId },
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
      {DataConfig[scope].requests.move && (
        <>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            startIcon={<AppIcon icon="edit" />}
            sx={{ borderRadius: 30, mb: 3, order: 999 }}
            onClick={() => setOpen(true)}
          >
            {t('texts.select', { var: t(`views.${DataConfig[scope].requests.move.target}`) })}
          </Button>
          <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xs">
            <DialogTitle>
              {t('texts.select', { var: t(`views.${DataConfig[scope].requests.move.target}`) })}
            </DialogTitle>
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
                              {DataConfig[scope].requests.move &&
                                item[DataConfig[DataConfig[scope].requests.move.target].columns[0].name]}
                            </Typography>
                            <Typography noWrap color="secondary" fontSize="small">
                              {DataConfig[scope].requests.move &&
                                item[DataConfig[DataConfig[scope].requests.move.target].columns[1].name]}
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
