import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FormHTMLAttributes, FunctionComponent, ReactNode } from 'react';

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

/**
 * Application styled Form container
 * @component AppForm
 */
const AppForm: FunctionComponent<Props> = ({ children, ...resOfProps }) => {
  return (
    <form {...resOfProps}>
      <Grid container direction="column" alignItems="center">
        <Box maxWidth="40rem" width="100%">
          {children}
        </Box>
      </Grid>
    </form>
  );
};

export default AppForm;
