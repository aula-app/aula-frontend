import { MessageType } from '@/types/Scopes';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MarkdownReader from '../MarkdownReader';
import { blueGrey } from '@mui/material/colors';
import AppLink from '../AppLink';
import AppIconButton from '../AppIconButton';
import { setMessageStatus } from '@/services/messages';

/**
 * Renders "ReportCard" component
 */

interface Props {
  report: MessageType;
  onReload: () => void;
}

const ReportCard = ({ report, onReload }: Props) => {
  const { t } = useTranslation();

  const YAML = report.body.split('---')[1];
  const content = report.body.replace(`---${YAML}---`, '');
  const metadata = YAML?.split(/\r?\n/)
    .filter((n) => n)
    .map((n) => ({ key: n.split(': ')[0], value: n.split(': ')[1] }));

  const toggleArchive = async () => {
    setMessageStatus({
      status: report.status ? 3 : 1,
      message_id: report.hash_id,
    }).then(onReload);
  };
  //   await databaseRequest(
  //     {
  //       model: 'Message',
  //       method: 'setMessageStatus',
  //       arguments: {
  //         status: value ? 3 : 1,
  //         message_id: report.id,
  //       },
  //     },
  //     ['updater_id']
  //   ).then(() => onReload());

  // const confirmRequest = () => {
  //   if (!onConfirm) return;
  //   onConfirm();
  //   onArchive(true);
  // };

  return (
    <Card variant="outlined" sx={{ borderRadius: 5, overflow: 'visible' }}>
      <CardHeader
        title={report.headline}
        action={<AppIconButton icon={report.status === 1 ? 'archive' : 'unarchive'} onClick={toggleArchive} />}
      />
      <Divider />
      <CardContent sx={{ bgcolor: blueGrey[50] }}>
        <Stack>
          {metadata &&
            metadata.map((data) => (
              <Typography color="secondary">
                <b>{data.key}</b>:{' '}
                <AppLink to={data.value} disabled={data.key !== 'location'}>
                  {data.value}
                </AppLink>
              </Typography>
            ))}
        </Stack>
      </CardContent>
      <Divider />
      <CardContent>
        <MarkdownReader>{content}</MarkdownReader>
      </CardContent>
      <Divider />
      {/* <CardActions>
        <Stack direction="row" mt={0.5} flex={1} gap={3} justifyContent="end">
          {report.status === 1 ? (
            <Button color="error" onClick={() => onArchive(true)}>
              {t('actions.archive')}
            </Button>
          ) : (
            <Button onClick={() => onArchive(false)}>{t('actions.unarchive')}</Button>
          )}
          {!!onConfirm && (
            <Button variant="contained" onClick={confirmRequest}>
              {t('actions.confirm')}
            </Button>
          )}
        </Stack>
      </CardActions> */}
    </Card>
  );
};

export default ReportCard;
