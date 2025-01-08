import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import MoreOptions from '@/components/MoreOptions';
import { BoxType, PossibleFields } from '@/types/Scopes';
import { checkPermissions, databaseRequest, phases } from '@/utils';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BoxCardSkeleton from './BoxCardSkeleton';

interface BoxCardProps {
  box: number;
  noLink?: boolean;
  onReload?: () => void;
}

const BoxCard = ({ box, noLink = false, onReload }: BoxCardProps) => {
  const { t } = useTranslation();

  const [boxData, setBox] = useState<BoxType>();
  const [remaining, setRemaining] = useState(0);

  const boxFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: box },
    }).then((response) => {
      if (response.success) setBox(response.data);
    });

  const daysRemaining = (): number => {
    if (!boxData) return 0;
    let remaining = 0;
    for (let i = 0; i < Number(boxData.phase_id) / 10 && i < 3; i++) {
      const phase = `phase_duration_${i + 1}` as
        | 'phase_duration_1'
        | 'phase_duration_2'
        | 'phase_duration_3'
        | 'phase_duration_4';
      remaining += Number(boxData[phase]);
    }
    const currentDate = new Date();
    const endDate = new Date(boxData.created);
    endDate.setDate(endDate.getDate() + remaining);
    return Math.round((Number(endDate) - Number(currentDate)) / 86400000);
  };

  const reload = () => {
    if (onReload) onReload();
    boxFetch();
  };

  useEffect(() => {
    setRemaining(daysRemaining());
  }, [boxData]);

  useEffect(() => {
    boxFetch();
  }, []);

  return boxData ? (
    <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
      <Stack
        width="100%"
        height="3rem"
        alignItems="center"
        direction="row"
        bgcolor={`${phases[boxData.phase_id]}.main`}
        p={1}
        pr={2}
      >
        <AppIcon icon={phases[boxData.phase_id]} sx={{ mx: 1 }} />
        <Typography variant="caption" mr="auto">
          {t('texts.ideaBox', { var: boxData.ideas_num, phase: t(`phases.${phases[boxData.phase_id]}`) })}
        </Typography>
        <MoreOptions scope="boxes" item={boxData} onClose={reload} canEdit={checkPermissions(30)} />
      </Stack>
      <AppLink
        to={`/room/${boxData.room_id}/phase/${boxData.phase_id}/idea-box/${boxData.id}`}
        mb={2}
        key={boxData.id}
        disabled={noLink}
      >
        <CardContent>
          <Typography variant="h6" noWrap>
            {boxData.name}
          </Typography>
          <Typography variant="body2">{boxData.description_public}</Typography>
          <Box
            mt={2}
            position="relative"
            borderRadius={999}
            width="100%"
            height="1.5rem"
            bgcolor={`${phases[boxData.phase_id]}.main`}
            overflow="clip"
          >
            <Box bgcolor={`${phases[boxData.phase_id]}.main`} position="absolute" left={0} height="100%" width="50%" />
            <Stack
              direction="row"
              position="absolute"
              left={0}
              height="100%"
              width="100%"
              alignItems="center"
              justifyContent="end"
              px={2}
            >
              <AppIcon icon="clock" size="small" sx={{ mx: 0.5 }} />
              <Typography variant="caption">
                {remaining > 0 ? t('texts.phaseEnd', { var: remaining }) : t('texts.phaseEnded')}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </AppLink>
    </Card>
  ) : (
    <BoxCardSkeleton />
  );
};

export default BoxCard;
