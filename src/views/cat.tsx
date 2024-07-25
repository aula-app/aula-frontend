import { CAT_ICONS, CategoryIconType } from '@/components/CategoryIcon/CategoryIcon';
import DefaultImage from '@/components/DefaultImages';
import { Stack } from '@mui/material';

const CatView = () => {
  const icons = Object.keys(CAT_ICONS) as CategoryIconType[];
  return (
    <Stack>
      {/* <Grid container spacing={2} p={2}>
        {icons.map((icon) => (
          <Grid item xs={1} key={icon}>
            <CategoryIcon icon={icon} size="xl" />
          </Grid>
        ))}
      </Grid> */}
      <DefaultImage />
    </Stack>
  );
};

export default CatView;
