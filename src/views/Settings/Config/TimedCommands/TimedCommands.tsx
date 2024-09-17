import { AppIconButton } from '@/components';
import { CommandType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Commands } from '@/utils/commands';
import { Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimedCommandInput from './TimedCommandInput';

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
      if (response.success) setTable(response);
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
      if (response.success) getCommands();
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
      <Typography variant="h6">{t('settings.actions')}</Typography>
      <TableContainer>
        <Table aria-label="simple table">
          <TableBody>
            {commands &&
              commands.map((command, i) => {
                const action = Commands.filter((cmd) => cmd.value === command.cmd_id);
                return (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {command.date_start}
                    </TableCell>
                    <TableCell align="left">{action[0].label}</TableCell>
                    <TableCell align="left">{command.command}</TableCell>
                    <TableCell align="left">{command.parameters}</TableCell>
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
  );
};

export default TimedCommands;
