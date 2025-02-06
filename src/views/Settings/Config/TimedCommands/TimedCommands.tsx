import { AppIconButton } from '@/components';
import { CommandType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Commands } from '@/utils/commands';
import {
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimedCommandInput from './TimedCommandInput';
import { ObjectPropByName } from '@/types/Generics';

const LIST_LIMIT = 10;

/** * Renders "TimedCommands" component
 */

interface CommandsResponseType {
  success: boolean;
  count: number;
  data: CommandType[];
}

const TimedCommands = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>();

  async function getCommands() {
    await databaseRequest({
      model: 'Command',
      method: 'getCommands',
      arguments: {
        limit: LIST_LIMIT,
        offset: page * LIST_LIMIT,
      },
    }).then((response) => {
      if (!response.data) return;
      if (Array.isArray(response.data))
        response.data.map((r: ObjectPropByName) => (r.parameters = JSON.parse(r.parameters)));
      setTable(response.data);
    });
  }

  async function deleteCommand(id: number) {
    await databaseRequest(
      {
        model: 'Command',
        method: 'deleteCommand',
        arguments: {
          command_id: id,
        },
      },
      ['updater_id']
    ).then((response) => {
      if (response.data) getCommands();
    });
  }

  const setTable = (response: CommandsResponseType) => {
    setCommands(response.data);
    setCount(Math.floor(response.count / LIST_LIMIT));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    getCommands();
  }, [page]);

  return (
    <Stack gap={2}>
      <TimedCommandInput onReload={getCommands} />
      {commands && (
        <Stack>
          <Typography variant="h6">{t('settings.time.actions')}</Typography>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {commands.map((command, i) => {
                  const scope = command.cmd_id > 9 ? Math.floor(command.cmd_id / 10) : 0;
                  const action = Commands[scope].actions.find(
                    (action) => action.value === Number(String(command.cmd_id).slice(-1))
                  );
                  return (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{t(Commands[scope].label)}</TableCell>
                      <TableCell>{command.target_id || ''}</TableCell>
                      <TableCell>{t(action?.label || '')}</TableCell>
                      <TableCell>{command.parameters}</TableCell>
                      <TableCell>{command.date_start}</TableCell>
                      <TableCell align="right">
                        <AppIconButton icon="delete" onClick={() => deleteCommand(command.id)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {count > 1 && (
              <Stack direction="row" alignItems="center" justifyContent="center" width="100%">
                <Pagination count={count} onChange={handleChangePage} sx={{ py: 1 }} />
              </Stack>
            )}
          </TableContainer>
        </Stack>
      )}
    </Stack>
  );
};

export default TimedCommands;
