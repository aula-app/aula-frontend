import CategoryIcon, { CAT_ICONS } from '@/components/CategoryIcon/CategoryIcon';
import { Grid } from '@mui/material';

const CatView = () => {
  return (
    <Grid container spacing={2}>
      {Object.keys(CAT_ICONS).map((icon) => (
        <Grid item xs={1} key={icon}>
          <CategoryIcon icon={icon} size="xl" />
        </Grid>
      ))}
    </Grid>
  );
};

export default CatView;
