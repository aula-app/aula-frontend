import { AppIconButton } from '@/components';
import { CommandResponse, deleteCommand, getCommands } from '@/services/config';
import { ObjectPropByName } from '@/types/Generics';
import { CommandType } from '@/types/Scopes';
import { Commands } from '@/utils/commands';
import { Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimedCommandInput from './TimedCommandInput';

const LIST_LIMIT = 10;

/** * Renders "TimedCommands" component
 */

const TimedCommands = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>();

  async function fetchCommands() {
    const response = await getCommands(LIST_LIMIT, page * LIST_LIMIT);
    if (!response.data) return;
    if (Array.isArray(response.data))
      response.data.map((r: ObjectPropByName) => (r.parameters = JSON.parse(r.parameters)));
    setTable(response);
  }

  async function removeCommand(id: number) {
    const response = await deleteCommand(id);
    if (response.data) fetchCommands();
  }

  const setTable = (response: CommandResponse) => {
    setCommands(response.data);
    setCount(Math.floor(response.count || 0 / LIST_LIMIT));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    fetchCommands();
  }, [page]);

  return (
    <Stack gap={2}>
      <TimedCommandInput onReload={fetchCommands} />
      {commands && (
        <Stack>
          <Typography variant="h3">{t('settings.time.actions')}</Typography>
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
                        <AppIconButton icon="delete" onClick={() => removeCommand(command.id)} />
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
