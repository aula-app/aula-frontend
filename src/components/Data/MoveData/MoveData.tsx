import { AppIcon, AppIconButton } from '@/components';
import { DatabaseResponseData, DatabaseResponseType, ObjectPropByName } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, dataSettings, getRequest, requestDefinitions } from '@/utils';
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
  parentId?: number;
  scope: SettingNamesType;
  onClose?: () => void;
  addUpdate?: (newUpdate: updateType) => void;
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = ({ scope, parentId, onClose = () => {}, addUpdate }: Props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [availableItems, setAvailableItems] = useState<DatabaseResponseData[]>();
  const [selectedItems, setSelectedItems] = useState<DatabaseResponseData[]>();
  const [data, setData] = useState<DatabaseResponseData[]>();
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState('');
  const [isOpen, setOpen] = useState(false);

  const getAvailableItems = async () => {
    const moreArgs = scope === 'ideas' ? { room_id: Number(params['room_id']) } : {};
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: scope === 'ideas' ? 'getIdeasByRoom' : getRequest(scope, 'fetch'),
      arguments: {
        offset: 0,
        limit: 0,
        orderby: dataSettings[scope][0].orderId,
        asc: 1,
        extra_where: ` AND (${dataSettings[scope][0].name} LIKE '%${filter}%' OR ${dataSettings[scope][1].name} LIKE '%${filter}%')`,
        ...moreArgs,
      },
    }).then((response: DatabaseResponseType) => {
      response.data ? setAvailableItems(response.data) : setAvailableItems([]);
    });
  };

  const getCurrentItems = async () => {
    if (!parentId || !requestDefinitions[scope].isChild) {
      setSelectedItems([]);
      return;
    }

    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'getChild'),
      arguments: {
        [getRequest(requestDefinitions[scope].isChild, 'id')]: parentId,
      },
    }).then((response: DatabaseResponseType) => {
      response.data ? setSelectedItems(response.data) : setSelectedItems([]);
      response.data ? setSelected(response.data.map((item) => item.id)) : setSelected([]);
    });
  };

  const normalizeData = () => {
    if (!availableItems || !selectedItems) return;
    setData([...new Map([...availableItems, ...selectedItems].map((c) => [c.id, c])).values()]);
  };

  const select = async (itemId: number) => {
    setSelected([...selected, itemId]);
  };

  const remove = async (itemId: number) => {
    setSelected(selected.filter((id) => id !== itemId));
  };

  const requestAdd = async (id: number) => {
    if (!parentId || !requestDefinitions[scope].isChild) return;
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'move'),
      arguments: {
        [getRequest(scope, 'id')]: id,
        [getRequest(requestDefinitions[scope].isChild, 'id')]: parentId,
      },
    });
  };

  const requestRemove = async (id: number) => {
    if (!parentId || !requestDefinitions[scope].isChild) return;
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'remove'),
      arguments: {
        [getRequest(scope, 'id')]: id,
        [getRequest(requestDefinitions[scope].isChild, 'id')]: parentId,
      },
    });
  };

  const requestUpdates = () => {
    if (!selectedItems) return;
    const originalSelection = selectedItems.map((item) => item.id);
    const toAdd = selected.filter((x) => !originalSelection.includes(x));
    const toRemove = originalSelection.filter((x) => !selected.includes(x));
    if (parentId) {
      toAdd.forEach((id) => requestAdd(id));
      toRemove.forEach((id) => requestRemove(id));
    } else if (addUpdate) {
      selected.forEach((id) =>
        addUpdate({
          model: requestDefinitions[scope].model,
          method: getRequest(scope, 'move'),
          args: { [getRequest(scope, 'id')]: id },
          requestId: requestDefinitions[scope].isChild,
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
      <Button
        fullWidth
        color="secondary"
        variant="outlined"
        startIcon={<AppIcon icon="edit" />}
        sx={{ borderRadius: 30 }}
        onClick={() => setOpen(true)}
      >
        {t('texts.select', { var: t(`views.${scope}`) })}
      </Button>
      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{t('texts.select', { var: t(`views.${scope}`) })}</DialogTitle>
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
                {data &&
                  data.map((item) => (
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
                        <Typography noWrap>{item[dataSettings[scope][0].name]}</Typography>
                        <Typography noWrap color="secondary" fontSize="small">
                          {item[dataSettings[scope][1].name]}
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
  );
};

export default DelegateVote;
