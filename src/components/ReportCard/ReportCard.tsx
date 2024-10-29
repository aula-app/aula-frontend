import { MessageType, ReportBodyType, ReportMetadataType, RequestBodyType, RequestMetadataType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { AppLink } from '..';

/**
 * Renders "ReportCard" component
 */

interface Props {
  report: MessageType;
  onConfirm?: () => void;
  onReload: () => void;
}

const ReportCard = ({ report, onReload, onConfirm }: Props) => {
  const { t } = useTranslation();

  const onArchive = async (value: boolean) =>
    await databaseRequest(
      {
        model: 'Message',
        method: 'setMessageStatus',
        arguments: {
          status: value ? 3 : 1,
          message_id: report.id,
        },
      },
      ['updater_id']
    ).then(() => onReload());

  const confirmRequest = () => {
    if (!onConfirm) return;
    onConfirm();
    onArchive(true);
  };

  const bodyData: ReportBodyType | RequestBodyType = JSON.parse(report.body);

  return bodyData ? (
    <Card variant="outlined" sx={{ borderRadius: 5, overflow: 'visible' }}>
      <CardHeader
        title={bodyData.data.type ? t(`texts.${bodyData.data.type}`, { var: report.headline }) : report.headline}
      />
      <Divider />
      {bodyData.data && (
        <>
          <CardContent sx={{ bgcolor: 'bug.main' }}>
            <Stack>
              {(Object.keys(bodyData.data) as Array<keyof ReportMetadataType | keyof RequestMetadataType>).map(
                (data, key) => (
                  <Fragment key={key}>
                    {bodyData.data && (
                      <Typography key={data}>
                        {data}:{' '}
                        {'location' in bodyData.data && data === 'location' ? (
                          <AppLink to={bodyData.data[data]}>{bodyData.data[data]}</AppLink>
                        ) : (
                          // @ts-ignore
                          bodyData.data[data]
                        )}
                      </Typography>
                    )}
                  </Fragment>
                )
              )}
            </Stack>
          </CardContent>
          <Divider />
        </>
      )}
      <CardContent>
        <Stack my={2} flex={1}>
          <Typography>
            {bodyData.content !== ''
              ? bodyData.content
              : t(
                  `texts.${bodyData.data.type}Body`,
                  'from' in bodyData.data && 'to' in bodyData.data
                    ? {
                        var: report.headline,
                        old: bodyData.data.from || '',
                        new: bodyData.data.to || '',
                      }
                    : { var: report.headline }
                )}
          </Typography>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Stack direction="row" mt={0.5} flex={1} gap={3} justifyContent="end">
          {report.status === 1 ? (
            <Button color="error" onClick={() => onArchive(true)}>
              {t(`texts.archive`)}
            </Button>
          ) : (
            <Button onClick={() => onArchive(false)}>{t(`texts.unarchive`)}</Button>
          )}
          {!!onConfirm && (
            <Button variant="contained" onClick={confirmRequest}>
              {t('generics.confirm')}
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  ) : (
    <></>
  );
};

export default ReportCard;
