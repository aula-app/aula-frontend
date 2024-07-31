import { ReportBodyType } from '@/types/Scopes';
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { AppLink } from '..';

/**
 * Renders "ReportCard" component
 */

interface Props {
  headline: string;
  body: ReportBodyType;
}

const ReportCard = ({ headline, body }: Props) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 5 }}>
      <CardHeader title={headline} />
      <Divider />
      <CardContent sx={{ bgcolor: 'bug.main' }}>
        <Stack>
          {(Object.keys(body.data) as Array<keyof ReportBodyType['data']>).map((data) => (
            <Typography mt={1} key={data}>
              {data}:{' '}
              {data === 'location' ? <AppLink to={body.data[data]}>{body.data[data]}</AppLink> : body.data[data]}
            </Typography>
          ))}
        </Stack>
      </CardContent>
      <Divider />
      <CardContent>
        <Stack mt={2} flex={1}>
          <Typography>{body.content}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
