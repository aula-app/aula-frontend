import { BoxType } from '@/types/Scopes';
import { localStorageGet, parseJwt, phases } from '@/utils';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';
import MoreOptions from '../MoreOptions';

interface IdeaBoxProps {
  box: BoxType;
  noLink?: boolean;
  onReload: () => void;
}

const IdeaBox = ({ box, noLink = false, onReload }: IdeaBoxProps) => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  return (
    <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
      <Stack
        width="100%"
        height="3rem"
        alignItems="center"
        direction="row"
        bgcolor={phases[box.phase_id].color}
        p={1}
        pr={2}
      >
        <AppIcon icon={phases[box.phase_id].name} sx={{ mx: 1 }} />
        <Typography variant="caption" mr="auto">
          {t('texts.ideaBox', { var: box.ideas_num, phase: t(`phases.${phases[box.phase_id].name}`) })}
        </Typography>
        <MoreOptions scope="boxes" id={box.id} onClose={onReload} canEdit={jwt_payload.user_level >= 50} />
      </Stack>
      <AppLink to={`idea-box/${box.id}`} mb={2} key={box.id} disabled={noLink}>
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
            bgcolor={phases[box.phase_id].color}
            overflow="clip"
          >
            <Box bgcolor={phases[box.phase_id].baseColor[300]} position="absolute" left={0} height="100%" width="50%" />
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
              <Typography variant="caption">{t('texts.phaseEnd', { var: 3 })}</Typography>
            </Stack>
          </Box>
        </CardContent>
      </AppLink>
    </Card>
  );
};

export default IdeaBox;
