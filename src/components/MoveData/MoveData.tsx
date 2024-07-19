import { AppIcon, AppIconButton } from '@/components';
import { DatabaseResponseData, DatabaseResponseType } from '@/types/Generics';
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

interface Props {
  parentId: number | undefined;
  scope: SettingNamesType;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const DelegateVote = ({ scope, parentId, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [data, setData] = useState<DatabaseResponseData[]>();
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState('');

  const dataFetch = async () => {
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'fetch'),
      arguments: {
        offset: 0,
        limit: 0,
        orderby: dataSettings[scope][0].orderId,
        asc: 1,
        extra_where: ` AND (${dataSettings[scope][0].name} LIKE '%${filter}%' OR ${dataSettings[scope][1].name} LIKE '%${filter}%')`,
      },
    }).then((response: DatabaseResponseType) => setData(response.data));
  };

  const getCurrentItems = async () => {
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'getChild'),
      arguments: {
        [getRequest(requestDefinitions[scope].isChild, 'id')]: parentId,
      },
    }).then((request: DatabaseResponseType) => setSelected(request.data.map((item) => item.id)));
  };

  const select = async (itemId: number) => {
    if (!!parentId) return;
    await databaseRequest(
      {
        model: requestDefinitions[scope].model,
        method: getRequest(scope, 'move'),
        arguments: {
          [getRequest(scope, 'id')]: itemId,
          [getRequest(requestDefinitions[scope].isChild, 'id')]: parentId,
        },
      },
      ['updater_id']
    ).then(getCurrentItems);
  };

  const remove = async (itemId: number) => {
    if (!!parentId) return;
    await databaseRequest(
      {
        model: requestDefinitions[scope].model,
        method: getRequest(scope, 'move'),
        arguments: {
          [getRequest(scope, 'id')]: itemId,
          [getRequest(requestDefinitions[scope].isChild, 'id')]: 0,
        },
      },
      ['updater_id']
    ).then(getCurrentItems);
  };

  const toggleSelect = (item: number) => {
    selected.includes(item) ? remove(item) : select(item);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    dataFetch();
  }, [filter, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select {scope}</DialogTitle>
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
                    onClick={() => select(item.id)}
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
        <Button color="secondary" onClick={onClose}>
          {t('generics.cancel')}
        </Button>
        <Button variant="contained" onClick={() => {}} disabled={!selected}>
          {t('generics.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DelegateVote;
