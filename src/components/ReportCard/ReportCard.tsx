import { addMessage, setMessageStatus } from '@/services/messages';
import { deleteUser, editSelfRestricted, exportSelfData } from '@/services/users';
import { useAppStore } from '@/store';
import { MessageType } from '@/types/Scopes';
import { errorAlert, successAlert } from '@/utils';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import AppLink from '../AppLink';
import MarkdownReader from '../MarkdownReader';
import dayjs from 'dayjs';

/**
 * Renders "ReportCard" component
 */

interface Props {
  report: MessageType;
  onReload: () => void;
}

interface Report {
  claim?: string;
  location?: string;
  useragent?: string;
}

interface DataRequest {
  type?: 'deleteAccount' | 'requestData';
  responseTo?: 'deleteAccount' | 'requestData';
  id: string;
  realname: string;
  username: string;
  email: string;
}

interface UpdateRequest {
  type?: 'changeName';
  responseTo?: 'changeName';
  id: string;
  property: 'realname' | 'username' | 'email';
  value: string;
}

const ReportCard = ({ report, onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const YAML = report.body.split('---')[1];
  const content = report.body.replace(`---${YAML}---`, '');
  const metadata = YAML?.split(/\r?\n/)
    .filter((n) => n)
    .reduce(
      (acc, n) => {
        const [key, value] = n.split(': ');
        acc[key as keyof DataRequest | keyof UpdateRequest | keyof Report] = value;
        return acc;
      },
      {} as Record<keyof DataRequest | keyof UpdateRequest | keyof Report, string>
    );

  const archiveMessage = async () => {
    setMessageStatus({
      status: 3,
      message_id: report.hash_id,
    }).then(onReload);
  };

  const unarchiveMessage = async () => {
    setMessageStatus({
      status: 1,
      message_id: report.hash_id,
    }).then(onReload);
  };

  const toggleArchive = () => {
    report.status === 1 ? archiveMessage() : unarchiveMessage();
  };

  const changeName = async () => {
    const request = await editSelfRestricted({
      field: metadata.property as 'realname' | 'username' | 'email',
      id: metadata.id,
      value: metadata.value,
    });

    if (request.error) {
      errorAlert(t(request.error), dispatch);
      return;
    }
    successAlert(t(`requests.confirm`), dispatch);
  };

  const deleteAccount = async () => {
    const request = await deleteUser(metadata.id);

    if (request.error) {
      errorAlert(t(request.error), dispatch);
      return;
    }
    successAlert(t(`requests.confirm`), dispatch);
  };

  const downloadData = async () => {
    const request = await exportSelfData();

    if (request.error) {
      errorAlert(t(request.error), dispatch);
      return;
    }

    const file = document.createElement('a');
    file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(request.data)));
    file.setAttribute('download', `data_export_${dayjs().format('YYYY-MM-DD_HH:mm')}.txt`);

    file.style.display = 'none';
    document.body.appendChild(file);

    file.click();

    document.body.removeChild(file);
  };

  const confirmRequest = async () => {
    switch (metadata.type) {
      case 'changeName':
        changeName();
        break;
      case 'deleteAccount':
        deleteAccount();
        break;
    }

    const request = await sendMessage(t(`requests.accepted`));

    if (request.error) {
      errorAlert(t(request.error), dispatch);
      return;
    }
    archiveMessage();
  };

  const cancelRequest = async () => {
    const request = await sendMessage(t(`requests.denied`));

    if (request.error) {
      errorAlert(t(request.error), dispatch);
      return;
    }
    archiveMessage();
    successAlert(t(`requests.cancel`), dispatch);
  };

  const sendMessage = async (message: string) =>
    await addMessage({
      headline: report.headline,
      body: `
---
${YAML.replace('type:', 'responseTo:')}
---
${message}`,
      target_id: report.creator_id,
      msg_type: 5,
    });

  return (
    <Card variant="outlined" sx={{ borderRadius: 5, overflow: 'visible' }}>
      <CardHeader
        title={report.headline}
        action={<AppIconButton icon={report.status === 1 ? 'archive' : 'unarchive'} onClick={toggleArchive} />}
      />
      <Divider />
      <CardContent sx={{ bgcolor: blueGrey[50] }}>
        {metadata &&
          (Object.keys(metadata) as Array<keyof typeof metadata>).map((entry) =>
            entry !== 'id' ? (
              <Typography color="secondary">
                <b>{entry}</b>:{' '}
                <AppLink to={metadata[entry]} disabled={entry !== 'location'}>
                  {metadata[entry]}
                </AppLink>
              </Typography>
            ) : (
              <></>
            )
          )}
      </CardContent>
      <Divider />
      <CardContent>
        <MarkdownReader>{content}</MarkdownReader>
        {metadata && !!metadata.type && (
          <CardActions>
            <Stack direction="row" mt={0.5} flex={1} gap={1} justifyContent="space-between">
              <Button variant="contained" onClick={confirmRequest}>
                {t('actions.confirm')}
              </Button>
              <Button variant="contained" color="error" onClick={cancelRequest}>
                {t('actions.cancel')}
              </Button>
            </Stack>
          </CardActions>
        )}
        {metadata && metadata.responseTo === 'requestData' && (
          <CardActions>
            <Stack direction="row" mt={0.5} flex={1} gap={1} justifyContent="end">
              <Button variant="contained" color="info" onClick={downloadData}>
                {t('actions.download')}
              </Button>
            </Stack>
          </CardActions>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportCard;
