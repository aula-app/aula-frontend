import { Grid } from '@mui/material';
import { PhaseButton } from '../PhaseButton';
import phases from '../../utils/phases';

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if(displayPhases.includes('result')) displayPhases.splice(displayPhases.indexOf('result'), 1);

const UserStats = () => {
  return (
    <Grid container spacing={1} py={1}>
      {displayPhases.map((phase, i) => (
        <Grid item xs={6} key={i}>
          <PhaseButton variant={phase} displayNumber={3} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;
