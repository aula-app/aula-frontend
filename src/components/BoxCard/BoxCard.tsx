import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import MoreOptions from '@/components/MoreOptions';
import { BoxType } from '@/types/Scopes';
import { checkPermissions, phases } from '@/utils';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BoxCardProps {
  box: BoxType;
  noLink?: boolean;
  onReload: () => void;
}

const BoxCard = ({ box, noLink = false, onReload }: BoxCardProps) => {
  const { t } = useTranslation();

  // const [remaining, setRemaining] = useState(0);

  const daysRemaining = (): number => {
    let remaining = 0;
    for (let i = 0; i < Number(box.phase_id) / 10 && i < 3; i++) {
      const phase = `phase_duration_${i + 1}` as
        | 'phase_duration_1'
        | 'phase_duration_2'
        | 'phase_duration_3'
        | 'phase_duration_4';
      remaining += Number(box[phase]);
    }
    const currentDate = new Date();
    const endDate = new Date(box.created);
    endDate.setDate(endDate.getDate() + remaining);
    return Math.round((Number(endDate) - Number(currentDate)) / 86400000);
  };

  return (
    <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
      <Stack
        width="100%"
        height="3rem"
        alignItems="center"
        direction="row"
        bgcolor={`${phases[box.phase_id]}.main`}
        p={1}
        pr={2}
      >
        <AppIcon icon={phases[box.phase_id]} sx={{ mx: 1 }} />
        <Typography variant="caption" mr="auto">
          {t('patterns.on', {
            a: t('delegation.status.undelegated', { var: box.ideas_num }),
            b: t('phases.phase', { var: t(`phases.${phases[box.phase_id]}`) }).toLowerCase(),
          })}
        </Typography>
        {/* <MoreOptions scope="boxes" item={box} onClose={onReload} canEdit={checkPermissions(30)} /> */}
      </Stack>
      <AppLink
        to={`/room/${box.room_hash_id}/phase/${box.phase_id}/idea-box/${box.hash_id}`}
        mb={2}
        key={box.hash_id}
        disabled={noLink}
      >
        <CardContent>
          <Typography variant="h6" noWrap>
            {box.name}
          </Typography>
          <Typography variant="body2">{box.description_public}</Typography>
          <Box
            mt={2}
            position="relative"
            borderRadius={999}
            width="100%"
            height="1.5rem"
            bgcolor={`${phases[box.phase_id]}.main`}
            overflow="clip"
          >
            <Box bgcolor={`${phases[box.phase_id]}.main`} position="absolute" left={0} height="100%" width="50%" />
            <Stack direction="row" position="absolute" left={0} height="100%" width="100%" alignItems="center">
              <AppIcon icon="clock" size="small" sx={{ mx: 0.5 }} />
              <Typography variant="caption">
                {daysRemaining() > 0 ? t('phases.status.end', { var: daysRemaining() }) : t('phases.status.ended')}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </AppLink>
    </Card>
  );
};

export default BoxCard;
