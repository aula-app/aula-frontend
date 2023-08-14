import { Grid } from '@mui/material';
import { PhaseButton } from '../PhaseButton';
import phases from '../../utils/phases';

const keys = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if(keys.includes('result')) keys.splice(keys.indexOf('result'), 1);
const UserStats = () => {
  return (
    <Grid container spacing={1} py={1}>
      {keys.map(phase => (
        <Grid item xs={6}>
          <PhaseButton variant={phase} displayNumber={3} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;
