import { Lightbulb } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material"

export const UserStats = () => {
  return (
    <Grid container spacing={2} p={1}>
      <Grid item xs={6}>
        <Chip icon={<Lightbulb />} label="With Icon" />
      </Grid>
    </Grid>
  );
}

export default UserStats;