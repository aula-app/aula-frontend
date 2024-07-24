import CategoryIcon, { CAT_ICONS, CategoryIconType } from '@/components/CategoryIcon/CategoryIcon';
import { Grid } from '@mui/material';

const CatView = () => {
  const icons = Object.keys(CAT_ICONS) as CategoryIconType[];
  return (
    <Grid container spacing={2}>
      {icons.map((icon) => (
        <Grid item xs={1} key={icon}>
          <CategoryIcon icon={icon} size="xl" />
        </Grid>
      ))}
    </Grid>
  );
};

export default CatView;
