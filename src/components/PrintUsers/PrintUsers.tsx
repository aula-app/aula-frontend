import AppIcon from '@/components/AppIcon';
import SelectRoom from '@/components/SelectRoom';
import { getUsers } from '@/services/users';
import { UserType } from '@/types/Scopes';
import {
  Button,
  ButtonProps,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PrintUsers = forwardRef<ButtonProps>(({ ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [onlyTempPass, setOnlyTempPass] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string>('all');

  const fetchUsers = useCallback(async (roomId: string) => {
    setLoading(true);
    let response;
    if (roomId !== 'all') response = await getUsers({ room_id: roomId });
    else response = await getUsers();

    if (response.error) setError(response.error);
    else {
      setUsers(response.data || []);
    }
    setLoading(false);
  }, []);

  const onSubmit = () => {
    const printWindow = window.open('', '_blank');
    const columns = 2;

    function chunkArray(array: Array<UserType>, size: number) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }

    // Optionally filter users when only showing temporary passwords
    const filteredUsers = onlyTempPass ? users.filter((u) => Boolean(u.temp_pw)) : users;

    const rows = chunkArray(filteredUsers, columns);

    let usersPasswords = rows
      .map((row) => {
        const cells = row
          .map((user) => {
            const passwordText = user.temp_pw
              ? `<b>${t('settings.columns.pw')}:</b> <mark>${user.temp_pw}</mark>`
              : `<b><i>${t('settings.users.passwordChanged')}</i></b>`;
            return `<td>
                      <b>${user.realname}</b><p/>
                      <b>${t('settings.columns.username')}:</b> <mark>${user.username}</mark><br/>
                      ${passwordText}
                    </td>`.trim();
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    // Generate HTML content for the new window
    const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${t('settings.users.printTitle')}</title>
            <style>
              body {
                font-family: 'vision', 'Tahoma', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
                font-size: 32px;
                margin: 20px;
                justify: center;
              }
              table {
                font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
                width: 1200px;
                border-collapse: collapse;
                margin-bottom: 20px;
                margin: auto;
              }
              th, td {
                border: 3px dashed #aaa;
                padding-top: 15px;
                padding-left: 15px;
                text-align: left;
                max-width: 50%;
                width: 50%;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              td b {
                font-family: 'vision', 'Tahoma', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
              }
              td mark {
                background-color: rgba(0, 0, 0, 0.06);
              }
              .print-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
              }
              .print-title {
                font-size: 24px;
                font-weight: bold;
              }
              .print-date {
                font-size: 14px;
              }
              .print-button {
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                margin-bottom: 20px;
              }
              @media print {
                .print-button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <div class="print-title">${t('settings.users.printTitle')}</div>
              <div class="print-date">Generated on: ${new Date().toLocaleDateString()}</div>
            </div>
            <button class="print-button" onclick="window.print()">Print</button>
            <table>
              <tbody>
               ${usersPasswords}
              </tbody>
            </table>
          </body>
        </html>
      `;

    // Write the HTML content to the new window
    if (printWindow && printWindow.document) {
      // @ts-ignore
      printWindow.document.open();
      // @ts-ignore
      printWindow.document.write(htmlContent);
      // @ts-ignore
      printWindow.document.close();
    }
    //setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const hasUsers = () => {
    if (onlyTempPass) return users.filter((u) => !!u.temp_pw).length > 0;
    else return users.length > 0;
  };

  useEffect(() => {
    fetchUsers('all');
    setOnlyTempPass(true);
  }, [open]);

  useEffect(() => {
    fetchUsers(roomId);
  }, [open, roomId]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} {...restOfProps}>
        <AppIcon icon="print" pr={2} />
        {t('settings.users.printTitle')}
      </Button>
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>{t('settings.users.printTitle')}</DialogTitle>
        <DialogContent>
          {isLoading && <Skeleton />}
          <SelectRoom room={roomId} setRoom={setRoomId} />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={onlyTempPass} onChange={() => setOnlyTempPass(!onlyTempPass)} />}
              label={t('settings.users.onlyTemporaryPasswords')}
            />
          </FormGroup>
          {!hasUsers() && (
            <b>
              {roomId === '' ? t('settings.users.no_users') : t('settings.users.no_users_in_room')}{' '}
              {onlyTempPass && t('settings.users.temp_pass')}
            </b>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} variant="contained" disabled={!hasUsers()}>
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default PrintUsers;
