import { ReportBodyType } from '@/types/Scopes';
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { AppLink } from '..';

/**
 * Renders "ReportCard" component
 */

interface Props {
  headline: string;
  body: string;
}

const ReportCard = ({ headline, body }: Props) => {
  function convertToJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return { content: str };
    }
    return JSON.parse(str);
  }

  const bodyData: ReportBodyType = convertToJson(body);

  return (
    <Card variant="outlined" sx={{ borderRadius: 5, overflow: 'visible' }}>
      <CardHeader title={headline} />
      <Divider />
      {bodyData.data && (
        <>
          <CardContent sx={{ bgcolor: 'bug.main' }}>
            <Stack>
              {(Object.keys(bodyData.data) as Array<keyof ReportBodyType['data']>).map((data) => (
                <>
                  {bodyData.data && (
                    <Typography mt={1} key={data}>
                      {data}:{' '}
                      {data === 'location' ? (
                        <AppLink to={bodyData.data[data]}>{bodyData.data[data]}</AppLink>
                      ) : (
                        bodyData.data[data]
                      )}
                    </Typography>
                  )}
                </>
              ))}
            </Stack>
          </CardContent>
          <Divider />
        </>
      )}
      <CardContent>
        <Stack mt={2} flex={1}>
          <Typography>{bodyData.content}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
