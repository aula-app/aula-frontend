import { AppLink } from '@/components';
import AppIcon, { AllIconsType } from '@/components/AppIcon/AppIcon';
import { DefaultUpdate } from '@/types/Generics';
import { phases } from '@/utils';
import { Card, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  item: DefaultUpdate;
  icon: AllIconsType;
  variant: 'votes' | 'comments';
};

/**
 * Renders "SelectInput" component
 */

const UpdateCard = ({ item, icon, variant, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        px: 3,
        mb: 1,
        bgcolor: `${phases[item.phase_id || 0]}.main`,
      }}
      variant="outlined"
      {...restOfProps}
    >
      <AppLink
        to={`/room/${item.room_hash_id}/phase/${item.phase_id || 0}${item.topic_id ? `/idea-box/${item.topic_id}` : ''}/idea/${item.idea_id}`}
      >
        <Stack direction="row" height={68} alignItems="center">
          <AppIcon icon={icon} sx={{ mr: 2 }} />
          {t('settings.messages.update', { var: t(`scopes.${variant}.plural`) })}
          <Typography ml={0.5} fontWeight={800}>
            {item.title}
          </Typography>
        </Stack>
      </AppLink>
    </Card>
  );
};

export default UpdateCard;
